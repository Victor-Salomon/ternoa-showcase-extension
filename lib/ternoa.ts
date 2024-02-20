import {
  BlockchainEvent,
  BlockchainEvents,
  Errors,
  WaitUntil,
  checkTransactionSuccess,
  submitTxBlocking,
  getRawApi,
  query,
  NFTCreatedEvent,
  createNftTx,
  getApiEndpoint,
  getFirstPublicClusterAvailable,
  getEnclaveHealthStatus,
  generatePGPKeys,
  NftMetadataType,
  TernoaIPFS,
  secretNftEncryptAndUploadFile,
  createSecretNftTx,
  SecretAddedToNFTEvent,
  SecretNftData,
  prepareAndStoreKeyShares,
} from "ternoa-js";
import type { Signer as InjectedSigner } from "@polkadot/api/types";
import { SecretNFTResponse } from "@/components/base/Forms/SecretNFT/types";
import { Dispatch, SetStateAction } from "react";

export const getExplorerLink = (block: number) => {
  const wssEndpoint = getApiEndpoint()
  if (!wssEndpoint) throw new Error("TERNOA_API_NOT_CONNECTED")
  const subdomain = wssEndpoint.includes('alphanet') ? 'explorer-alphanet.' : 'explorer.'
  const extension = wssEndpoint.includes('alphanet') ? '.dev' : '.com'
  return `https://${subdomain}ternoa${extension}/block/${block}`
}

const getSigner = async (address: string): Promise<InjectedSigner> => {
  const { web3FromAddress } = await import("@polkadot/extension-dapp") as Record<string, any>;;
  const injector = await web3FromAddress(address);
  return injector?.signer;
};

const signGeneric = async (
  txHex: `0x${string}`,
  address: string,
  signer: any,
  nonce?: number
) => {
  const api = getRawApi();
  return (await api.tx(txHex).signAsync(address, { nonce, signer })).toHex();
};

export const signTx = async (txHex: `0x${string}`, address: string) => {
  const nonce = (
    (await query("system", "account", [address])) as any
  ).nonce.toNumber();
  const signer = await getSigner(address);
  return signGeneric(txHex, address, signer, nonce);
};

const genericSign = async (tx: `0x${string}`, address: string) => {
  const signedTx = await signTx(tx, address);
  return await submitTxBlocking(signedTx, WaitUntil.BlockInclusion);
};

const genericTxnCheck = <T extends BlockchainEvent>(
  events: BlockchainEvents,
  ctor: new (...args: any[]) => T
) => {
  const { isTxSuccess, failedEvent } = checkTransactionSuccess(events);
  if (!isTxSuccess && failedEvent)
    throw new Error(
      `${Errors.EXTRINSIC_FAILED}: ${failedEvent.errorType} - ${failedEvent.details}`
    );
  else {
    return events.findEventOrThrow(ctor);
  }
};

export const mintNFT = async (
  address: string,
  offchainData: string,
  formatedroyalty = 0,
  formatedCollection: number | undefined = undefined,
  soulbond = false
) => {
  try {
    const tx = await createNftTx(
      offchainData,
      formatedroyalty,
      formatedCollection,
      soulbond
    );
    const { events, blockInfo } = await genericSign(tx, address);
    const { isTxSuccess, failedEvent } = checkTransactionSuccess(events);
    if (!isTxSuccess && failedEvent) {
      throw new Error(
        `${Errors.EXTRINSIC_FAILED}: ${failedEvent.errorType} - ${failedEvent.details}`
      );
    }
    const nftEvent = events.findEventOrThrow(NFTCreatedEvent)
    return { nftEvent, blockInfo };
  } catch (error) {
    const errorDescription = `NFT_MINT_ERROR: ${error instanceof Error ? error.message : JSON.stringify(error)
      }`;
    throw new Error(errorDescription)
  }
};

export const mintSecretNFT = async (
  address: string,
  nftFile: File,
  nftMetadata: NftMetadataType,
  secretNftFile: File,
  secretNftMetadata: NftMetadataType,
  ipfsClient: TernoaIPFS,
  royalty: number,
  collection: number | undefined,
  isSoulbound: boolean,
  injector: Record<string, any>,
  status: Dispatch<SetStateAction<string | undefined>>,
): Promise<SecretNFTResponse> => {
  try {
    const clusterId = await getFirstPublicClusterAvailable()
    await getEnclaveHealthStatus(clusterId)
    status("Uploading content on IPFS.")
    const { privateKey, publicKey } = await generatePGPKeys();
    const { Hash: offchainDataHash } = await ipfsClient.storeNFT(nftFile, nftMetadata);
    const { Hash: secretOffchainDataHash } = await secretNftEncryptAndUploadFile(
      secretNftFile,
      publicKey,
      ipfsClient,
      secretNftMetadata,
    )
    status("Sign transaction to create your NFT.")
    const tx = await createSecretNftTx(
      offchainDataHash, secretOffchainDataHash, royalty, collection, isSoulbound,
    )
    const { events, blockInfo, txHash } = await genericSign(tx, address);
    const { isTxSuccess, failedEvent } = checkTransactionSuccess(events);

    if (!isTxSuccess && failedEvent) {
      throw new Error(
        `${Errors.EXTRINSIC_FAILED}: ${failedEvent.errorType} - ${failedEvent.details}`
      );
    }

    const nftEvent = events.findEventOrThrow(NFTCreatedEvent);
    const secretNftEvent = events.findEventOrThrow(SecretAddedToNFTEvent);
    const secretNFTData: SecretNftData = {
      nftId: nftEvent.nftId,
      owner: nftEvent.owner,
      creator: nftEvent.owner,
      offchainData: nftEvent.offchainData,
      secretOffchainData: secretNftEvent.offchainData,
      royalty: nftEvent.royalty,
      collectionId: nftEvent.collectionId,
      isSoulbound: nftEvent.isSoulbound,
    };
    status("Sign transaction to securize your content on Ternoa SGX clusters.")
    const teeRes = await prepareAndStoreKeyShares(
      privateKey,
      address,
      secretNFTData.nftId,
      "secret",
      injector,
      clusterId
    )

    return {
      event: secretNftEvent,
      clusterResponse: teeRes,
      blockInfo,
      txHash
    }
  } catch (error) {
    const errorDescription = `SECRET_NFT_MINT_ERROR: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
    throw new Error(errorDescription)
  }
}
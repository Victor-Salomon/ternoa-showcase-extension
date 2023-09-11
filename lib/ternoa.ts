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
} from "ternoa-js";
import type { Signer as InjectedSigner } from "@polkadot/api/types";

const getSigner = async (address: string): Promise<InjectedSigner> => {
  const { web3FromAddress } = await import("@polkadot/extension-dapp");
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
    return {nftEvent, blockInfo};
  } catch (error) {
    const errorDescription = `NFT_MINT_ERROR: ${
      error instanceof Error ? error.message : JSON.stringify(error)
    }`;
    throw new Error(errorDescription)
  }
};

export const getExplorerLink = (block: number) => {
  const wssEndpoint = getApiEndpoint()
  if (!wssEndpoint) throw new Error("TERNOA_API_NOT_CONNECTED")
  const subdomain = wssEndpoint.includes('alphanet') ? 'explorer-alphanet.' : 'explorer.'
  const extension = wssEndpoint.includes('alphanet') ? '.dev' : '.com'
  return `https://${subdomain}ternoa${extension}/block/${block}` 
}
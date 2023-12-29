import { BlockInfo, SecretAddedToNFTEvent, TeeSharesStoreType } from "ternoa-js";

export type SecretNFTResponse = {
    event: SecretAddedToNFTEvent;
    clusterResponse: TeeSharesStoreType[];
    blockInfo: BlockInfo;
    txHash: `0x${string}`;
}
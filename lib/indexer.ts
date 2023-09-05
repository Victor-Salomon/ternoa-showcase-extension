import { INDEXER_URL } from "./constants";
import { collectionIdQuery } from "./graphqlReq";

export type CollectionsType = {
  collectionId: string;
};

export const getCollections = async (address: string) => {
  const query = collectionIdQuery(address);

  return await fetch(INDEXER_URL, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
    }),
  })
    .then((response) => response.json())
    .then(
      (response: {
        data: { collectionEntities: { nodes: CollectionsType[] } };
      }) => response.data.collectionEntities.nodes
    )
    .catch((error) => {
      const errorDescription = `INDEXER_REQUEST - COLLECTION_IDS_NOT_FOUND - ${
        error instanceof Error ? error.message : JSON.stringify(error)
      }`;
      throw new Error(errorDescription);
    });
};

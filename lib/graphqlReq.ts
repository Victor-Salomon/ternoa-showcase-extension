import { gql } from 'graphql-request'

export const collectionIdQuery = (owner: string) => gql`
{
  collectionEntities(
    filter: {
      owner: { equalTo: "${owner}" }
    }
  ) {
    nodes {
      collectionId
    }
  }
}
`

export const totalNFTsQuery = (owner: string) => gql`
{
  nftEntities(
    filter: {
      owner: { equalTo: "${owner}" }
    }
  ) {
    totalCount
  }
}
`

export const lastBlockQuery = () => gql`
{
  _metadata {
    lastProcessedHeight
    indexerHealthy
  }
}
`


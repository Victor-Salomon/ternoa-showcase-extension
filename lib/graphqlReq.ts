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
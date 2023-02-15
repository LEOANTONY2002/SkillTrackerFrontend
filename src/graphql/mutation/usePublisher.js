import { gql, useMutation } from "@apollo/client";

export const ADD_PUBLISHER = gql`
        mutation Mutation($name: String!, $id: String!,) {
            addPublisher(name: $name, id: $id) {
                id
                name
                # certificates {
                #     id
                #     name
                #     photo
                #     publisher {
                #             id
                #             name
                #         }
                #     expiry
                #     createdAt
                #     updatedAt
                #     employeeSkills {
                #         id
                #         employeeId
                #         level
                #         skill {
                #             skill {
                #             name
                #             id
                #             }
                #             category {
                #             name
                #             id
                #             }
                #         }
                #     }
                # }
            }
        }
    `;


export const useAddPublisher = () => {
    const [addPublisher, { loading, data, error }] = useMutation(ADD_PUBLISHER);
    return { addPublisher, loading, data, error }
}

export const DELETE_PUBLISHER = gql`
        mutation Mutation($id: String!) {
            addPublisher(id: $id) {
                id
                name
                # certificates {
                #     id
                #     name
                #     photo
                #     publisher {
                #             id
                #             name
                #         }
                #     expiry
                #     createdAt
                #     updatedAt
                #     employeeSkills {
                #         id
                #         employeeId
                #         level
                #         skill {
                #             skill {
                #             name
                #             id
                #             }
                #             category {
                #             name
                #             id
                #             }
                #         }
                #     }
                # }
            }
        }
    `;


export const useADeletePublisher = () => {
    const [deletePublisher, { loading, data, error }] = useMutation(DELETE_PUBLISHER);
    return { deletePublisher, loading, data, error }
}
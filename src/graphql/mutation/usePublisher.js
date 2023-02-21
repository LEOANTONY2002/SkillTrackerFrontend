import { gql, useMutation } from "@apollo/client";

export const ADD_PUBLISHER = gql`
        mutation Mutation($name: String!, $id: String!) {
            addPublisher(name: $name, id: $id) {
                id
                name
            }
        }
    `;


export const useAddPublisher = () => {
    const [addPublisher, { loading, data, error }] = useMutation(ADD_PUBLISHER);
    return { addPublisher, loading, data, error }
}

export const DELETE_PUBLISHER = gql`
        mutation Mutation($id: String!) {
            deletePublisher(id: $id) {
                id
                name
            }
        }
    `;


export const useDeletePublisher = () => {
    const [deletePublisher, { loading, data, error }] = useMutation(DELETE_PUBLISHER);
    return { deletePublisher, loading, data, error }
}
import { gql, useMutation } from "@apollo/client";

export const ADD_CERTIFICATE = gql`
        mutation Mutation($name: String!, $publisherId: String!, $photo: String!, $id: String, $expiry: String, $employeeSkillId: String!, $employeeId: String!) {
            addCertificate(name: $name, publisherId: $publisherId, photo: $photo, id: $id, expiry: $expiry, employeeSkillId: $employeeSkillId, employeeId: $employeeId) {
                id
                name
                email
                photo
                employeeSkills {
                    id
                    employeeId
                    level
                    skill {
                        skill {
                        name
                        id
                        }
                        category {
                        name
                        id
                        }
                    }
                    certificate {
                        id
                        name
                        photo
                        publisherId
                        publisher {
                            id
                            name
                        }
                        expiry
                        createdAt
                        updatedAt
                    }
                }
            }
        }
    `;


export const useAddCertificate = () => {
    const [addCertificate, { loading, data, error }] = useMutation(ADD_CERTIFICATE);
    return { addCertificate, loading, data, error }
}
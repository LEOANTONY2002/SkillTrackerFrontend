import { gql, useMutation } from "@apollo/client";

export const ADD_SKILL = gql`
    mutation Mutation($name: String!, $categoryId: String!) {
        addSkill(name: $name, categoryId: $categoryId) {
            id
            skillId
            categoryId
            skill {
                id
                name
            }
            category {
                name
            }
            employeeSkills {
                id
                level
                employee {
                    name
                    email
                    role
                }
                certificate {
                    name
                    publisher {
                            id
                            name
                        }
                    expiry
                }
            }
        }
    }
`;

export const UPDATE_SKILL = gql`
    mutation Mutation($id: String!, $name: String!, $skillId: String!, $categoryId: String!) {
        editSkill(id: $id, name: $name, skillId: $skillId, categoryId: $categoryId) {
            id
            skillId
            categoryId
            skill {
                id
                name
            }
            category {
                name
            }
            employeeSkills {
                id
                level
                employee {
                    name
                    email
                    role
                }
                certificate {
                    name
                    publisher {
                            id
                            name
                        }
                    expiry
                }
            }
        }
    }
`;


export const DELETE_SKILL = gql`
    mutation Mutation($id: String!, $coskillId: String!) {
        deleteSkill(id: $id, coskillId: $coskillId) {
            id
            skillId
            categoryId
            skill {
                id
                name
            }
            category {
                name
            }
            employeeSkills {
                id
                level
                employee {
                    name
                    email
                    role
                }
                certificate {
                    name
                    publisher {
                            id
                            name
                        }
                    expiry
                }
            }
            
        }
    }
`;


export const useAddSkill = () => {
    const [addSkill, { loading, data, error }] = useMutation(ADD_SKILL);
    return { addSkill, loading, data, error }
}

export const useUpdateSkill = () => {
    const [updateSkill, { loading, data, error }] = useMutation(UPDATE_SKILL);
    return { updateSkill, loading, data, error }
}


export const useDeleteSkill = () => {
    const [deleteSkill, { loading, data, error }] = useMutation(DELETE_SKILL);
    return { deleteSkill, loading, data, error }
}

import { gql, useMutation } from "@apollo/client";

export const UPDATE_EMPLOYEE = gql`
        mutation Mutation($id: String!, $email: String!, $name: String!, $photo: String){
            editEmployee(id: $id, email: $email, name: $name, photo: $photo) {
                id
                email
                name
                photo
                jobTitle
                displayName
                mobileNumber
                department
                isAdmin
                isNewEmployee
                division
                location
                employeeSkills {
                    id
                    employeeId
                    level
                    skillId
                    updatedAt
                    skill {
                        id
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


export const useUpdateEmployees = () => {
    const [updateEmployee, { loading, data, error }] = useMutation(UPDATE_EMPLOYEE);
    return { updateEmployee, loading, data, error }
}
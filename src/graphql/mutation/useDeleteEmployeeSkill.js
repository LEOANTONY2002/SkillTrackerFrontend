import { gql, useMutation } from "@apollo/client";

const DELETE_EMPLOYEE_SKILL = gql`
        mutation DeleteEmployeeSkill($employeeId: String!, $eskillId: String!) {
            deleteEmployeeSkill(employeeId: $employeeId, eskillId: $eskillId) {
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
                    updatedAt
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


export const useDeleteEmployeeSkill = () => {
    const [esDelete, { loading, data, error }] = useMutation(DELETE_EMPLOYEE_SKILL);
    return { esDelete, loading, data, error }
}
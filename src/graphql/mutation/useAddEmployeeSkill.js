import { gql, useMutation } from "@apollo/client";

const ADD_EMPLOYEE_SKILL = gql`
        mutation AddEmployeeSkill($employeeId: String!, $coskillId: String!, $level: String!, $id: String) {
            addEmployeeSkill(employeeId: $employeeId, coskillId: $coskillId, level: $level, id: $id) {
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
                        updatedAt
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


export const useAddEmployeeSkill = () => {
    const [esAdd, { loading, data, error }] = useMutation(ADD_EMPLOYEE_SKILL);
    return { esAdd, loading, data, error }
}
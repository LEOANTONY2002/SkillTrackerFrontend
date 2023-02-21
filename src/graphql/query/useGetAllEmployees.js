import { gql, useQuery } from "@apollo/client";

const GET_ALL_EMPLOYEES = gql`
        query Employees {
            employees {
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
                certificate {
                    id
                    name
                    publisher {
                        id
                        name
                    }
                    expiry
                    photo
                    createdAt
                    updatedAt
                }
                createdAt
                id
                level
                skillId
                updatedAt
                skill {
                    id
                    createdAt
                    categoryId
                    skillId
                    updatedAt
                    skill {
                    id
                    name
                    createdAt
                    updatedAt
                    }
                    category {
                    id
                    name
                    createdAt
                    updatedAt
                    }
                }
                }
                createdAt
                updatedAt
            }
        }
    `;


export const useGetAllEmployees = () => {
    const { loading, data, error } = useQuery(GET_ALL_EMPLOYEES);
    let employees = data?.employees
    return { loading, employees, error }
}

const ALL_ADMINS = gql`
        query Query {
            allAdmins {
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
            }
        }
    `;


export const UseGetAllAdmins = () => {
    const { loading, data, error } = useQuery(ALL_ADMINS);
    let admins = data?.allAdmins
    return { loading, admins, error }
}
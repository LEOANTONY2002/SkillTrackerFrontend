import { gql, useMutation } from "@apollo/client";

const GET_EMPLOYEE = gql`
        mutation Mutation($email: String!){
            employeeLogin(email: $email) {
                accessToken
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


export const useLogin = () => {
    const [login, { loading, data, error }] = useMutation(GET_EMPLOYEE);
    return { login, loading, data, error }
}

const GET_EMPLOYEE_WITH_EMAIL_PASSWORD = gql`
        mutation Mutation($email: String!, $password: String!){
            employeeLoginWithPassword(email: $email, password: $password) {
                accessToken
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


export const useLoginWithPassword = () => {
    const [loginWithPassword, { loading, data, error }] = useMutation(GET_EMPLOYEE_WITH_EMAIL_PASSWORD);
    return { loginWithPassword, loading, data, error }
}

const RESET_PASSWORD = gql`
        mutation Mutation($id: String!, $password: String!){
            employeePasswordReset(id: $id, password: $password) {
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


export const useResetPassword = () => {
    const [employeePasswordReset, { loading, data, error }] = useMutation(RESET_PASSWORD);
    return { employeePasswordReset, loading, data, error }
}

const SYNC_EMPLOYEES_DATA = gql`
        mutation syncEmployeesData{
            syncEmployeesData {
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


export const useSyncEmployeesData = () => {
    const [syncEmployeesData, { loading, data, error }] = useMutation(SYNC_EMPLOYEES_DATA);
    return { syncEmployeesData, loading, data, error }
}


const MANAGE_ADMIN = gql`
        mutation Mutation($email: String!, $isAdmin: Boolean!){
            manageAdmin(email: $email, isAdmin: $isAdmin) {
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


export const useManageAdmin = () => {
    const [manageAdmin, { loading, data, error }] = useMutation(MANAGE_ADMIN);
    return { manageAdmin, loading, data, error }
}
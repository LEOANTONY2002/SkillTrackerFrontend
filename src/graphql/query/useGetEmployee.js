import { gql, useLazyQuery } from "@apollo/client";

const GET_EMPLOYEE = gql`
        query Employee($email: String!) {
            employee(email: $email) {
                email
                name
                photo
                jobTitle
                id
                
                employeeSkills {
                level
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


export const useGetEmployee = () => {
    const [getEmployee, { loading, data, error }] = useLazyQuery(GET_EMPLOYEE);
    return { getEmployee, loading, data, error }
}

const GET_LAST_SYNC = gql`
        query LastSync {
            lastSync {
                id
                lastSync
                updatedAt
                createdAt
            }
        }
    `;


export const useGetLastSync = () => {
    const [getLastSync, { loading, data, error }] = useLazyQuery(GET_LAST_SYNC);
    return { getLastSync, loading, data, error }
}
import { gql, useQuery } from "@apollo/client";

const GET_ALL_CERTIFICATES = gql`
        query Certificates {
            certificates {
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
                employeeSkill {
                    id
                    employeeId
                    level
                    employee {
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
                }
            }
        }
    `;


export const useGetAllCertificates = () => {
    const { loading, data, error } = useQuery(GET_ALL_CERTIFICATES);
    let certificates = data?.certificates
    return { loading, certificates, error }
}

const GET_ALL_PUBLISHERS = gql`
        query Publishers {
            publishers {
                id
                name
                createdAt
                updatedAt
            }
        }
    `;


export const useGetAllPublishers = () => {
    const { loading, data, error } = useQuery(GET_ALL_PUBLISHERS);
    let publishers = data?.publishers
    return { loading, publishers, error }
}
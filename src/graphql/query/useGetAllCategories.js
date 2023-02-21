import { gql, useQuery } from "@apollo/client";

const GET_ALL_CATEGORIES = gql`
        query Categories {
            categories {
                id
                name
                skills {
                id
                skill {
                    name
                }
                employeeSkills {
                    id
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
                    certificate {
                    name
                    publisher {
                        id
                        name
                    }
                    }
                }
                }
            }
        }
    `;


export const useGetAllCategories = () => {
    const { loading, data, error } = useQuery(GET_ALL_CATEGORIES);
    let categories = data?.categories
    return { loading, categories, error }
}
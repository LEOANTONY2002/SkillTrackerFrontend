import { gql, useQuery } from "@apollo/client";

const GET_ALL_SKILLS = gql`
        query AllCOS {
            allCOS {
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
                    expiry
                }
                }
            }
        }
    `;


export const useGetAllSkills = () => {
    const { loading, data, error } = useQuery(GET_ALL_SKILLS);
    let skills = data?.allCOS
    return { loading, skills, error }
}
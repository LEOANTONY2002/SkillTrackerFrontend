import { gql, useLazyQuery } from "@apollo/client";

const GET_SEARCH_SKILLS = gql`
        query SearchSkill($word: String!) {
            searchSkill(word: $word) {
                id
                skillId
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


export const useGetSearchSkills = () => {
    const [searchSkills, { loading, data, error }] = useLazyQuery(GET_SEARCH_SKILLS);
    return { searchSkills, loading, data, error }
}

const GET_SEARCH_CATEGORIES = gql`
        query SearchCategory($word: String!) {
            searchCategory(word: $word) {
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
                    name
                    email
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


export const useGetSearchCategories = () => {
    const [searchCategories, { loading, data, error }] = useLazyQuery(GET_SEARCH_CATEGORIES);
    return { searchCategories, loading, data, error }
}

const GET_SEARCH_EMPLOYEES = gql`
        query SearchEmployee($word: String!) {
            searchEmployee(word: $word) {
                email
                name
                photo
                role
                id
                employeeSkills {
                level
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


export const useGetSearchEmployees = () => {
    const [searchEmployees, { loading, data, error }] = useLazyQuery(GET_SEARCH_EMPLOYEES);
    return { searchEmployees, loading, data, error }
}

const GET_SEARCH_EMPLOYEES_BY_SKILL = gql`
        query SearchEmployeeBySkill($word: String!) {
            searchEmployeeBySkill(word: $word) {
                email
                name
                photo
                role
                id
                employeeSkills {
                level
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


export const useGetSearchEmployeesBySkill = () => {
    const [searchEmployeesBySkill, { loading, data, error }] = useLazyQuery(GET_SEARCH_EMPLOYEES_BY_SKILL);
    return { searchEmployeesBySkill, loading, data, error }
}

const GET_SEARCH_EMPLOYEES_BY_CATEGORY = gql`
        query SearchEmployeeByCategory($word: String!) {
            searchEmployeeByCategory(word: $word) {
                email
                name
                photo
                role
                id
                employeeSkills {
                level
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


export const useGetSearchEmployeesByCategory = () => {
    const [searchEmployeesByCategory, { loading, data, error }] = useLazyQuery(GET_SEARCH_EMPLOYEES_BY_CATEGORY);
    return { searchEmployeesByCategory, loading, data, error }
}

const GET_SEARCH_CERTIFICATES = gql`
        query searchCertificate($word: String!) {
            searchCertificate(word: $word) {
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
                        name
                        email
                        photo
                        id
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


export const useGetSearchCertificates = () => {
    const [searchCertificates, { loading, data, error }] = useLazyQuery(GET_SEARCH_CERTIFICATES);
    return { searchCertificates, loading, data, error }
}

const GET_SEARCH_CERTIFICATES_BY_PUBLISHER = gql`
        query Certificates($word: String!) {
            searchCertificateByPublisher(word: $word) {
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
                        name
                        email
                        photo
                        id
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


export const useGetSearchCertificatesByPublisher = () => {
    const [searchCertificatesByPublisher, { loading, data, error }] = useLazyQuery(GET_SEARCH_CERTIFICATES_BY_PUBLISHER);
    return { searchCertificatesByPublisher, loading, data, error }
}
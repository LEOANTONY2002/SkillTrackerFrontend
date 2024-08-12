import { gql, useMutation } from "@apollo/client";

const LOGIN = gql`
  mutation AddEmployee(
    $name: String!
    $email: String!
    $password: String!
    $jobTitle: String!
  ) {
    addEmployee(
      name: $name
      email: $email
      password: $password
      jobTitle: $jobTitle
    ) {
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
      createdAt
      updatedAt
    }
  }
`;

export const useSignup = () => {
  const [signup, { loading, data, error }] = useMutation(LOGIN);
  return { signup, loading, data, error };
};

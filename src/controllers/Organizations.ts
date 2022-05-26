import { useQuery } from "urql"

const GET_ORGANIZATIONS = `
query get_organizations {
  organizations {
    name
    label
  }
}
`

export const useOrganizations = () => {
  const [{ data, fetching }] = useQuery({
    query: GET_ORGANIZATIONS,
    pause: loading,
  });
  return {
    organizations: data?.organizations,
    loading: fetching,
  }
}

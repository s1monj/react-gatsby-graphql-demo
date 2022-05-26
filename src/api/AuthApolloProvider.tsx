import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { createClient, Provider } from "urql";

const setupClient = (_token) => {
  return createClient({
    url: process.env.GATSBY_HASURA_GRAPHQL_URL,
    fetchOptions: () => {
      return {
        headers: {
          authorization: _token ? `Bearer ${_token}` : "",
        },
      };
    },
  });
};

const AuthApolloProvider = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated, getIdTokenClaims } =
    useAuth0();
  const [token, setToken] = useState("");
  const [client, setClient] = useState(setupClient(token));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const t = await getAccessTokenSilently({
          audience: process.env.GATSBY_AUTH0_AUDIENCE,
          scope: "openid profile email offline_access",
          ignoreCache: true,
        });
        const tokenClaims = await getIdTokenClaims();
        console.log(tokenClaims.__raw);
        setToken(tokenClaims.__raw);
      }
    })();
  }, [isAuthenticated, getAccessTokenSilently]);
  useEffect(() => {
    setClient(setupClient(token));
    if (client) setLoading(false);
  }, [token]);
  return <Provider value={client}>{children}</Provider>;
};

export default AuthApolloProvider;

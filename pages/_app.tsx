import * as React from "react";
import '../styles/global.css';

import fetch from 'isomorphic-unfetch';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
    uri: 'http://localhost:3000/api',
    fetch: fetch,
});

export default function App({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}
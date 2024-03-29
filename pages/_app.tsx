import * as React from "react";
import '../styles/global.css';

import fetch from 'isomorphic-unfetch';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { ToastProvider } from 'react-toast-notifications';

const URI = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api' : 'https://mmtrading.herokuapp.com/api';

const client = new ApolloClient({
    uri: URI,
    fetch: fetch,
});

export default function App({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <ToastProvider>
                <Component {...pageProps} />
            </ToastProvider>
        </ApolloProvider>
    );
}
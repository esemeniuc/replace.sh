import React from "react";
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from '@apollo/client';
import {PageContainer} from "./PageContainer";
import {GRAPHQL_ENDPOINT} from "./config";
import ReactGA from 'react-ga';
import {CssBaseline} from "@material-ui/core";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: GRAPHQL_ENDPOINT,
    })
});

export default function App() {
    ReactGA.initialize('UA-161926610-2', {
        debug: process.env.NODE_ENV !== 'production',
        titleCase: false,
        gaOptions: {siteSpeedSampleRate: 100}
    });

    return <ApolloProvider client={client}>
        <CssBaseline />
        <PageContainer/>
    </ApolloProvider>;
}

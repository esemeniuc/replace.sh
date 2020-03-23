import React from "react";
import {ApolloProvider} from "@apollo/react-hooks";
import ApolloClient from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import {PageContainer} from "./PageContainer";
import {createUploadLink} from "apollo-upload-client";
import {GRAPHQL_ENDPOINT} from "./config";
import ReactGA from 'react-ga';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({uri: GRAPHQL_ENDPOINT})
});

export default function App() {
    ReactGA.initialize('UA-157507250-1', {
        debug: process.env.NODE_ENV !== 'production',
        titleCase: false,
        gaOptions: {siteSpeedSampleRate: 100}
    });

    return <ApolloProvider client={client}>
        <PageContainer/>
    </ApolloProvider>
}

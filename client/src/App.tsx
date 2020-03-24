import React from "react";
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from '@apollo/client';
import {PageContainer} from "./PageContainer";
import {BrowserRouter as Router} from "react-router-dom";
// import ReactGA from 'react-ga';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'http://localhost:8001/graphql',
    })
});

export default function App() {
    // ReactGA.initialize('UA-157507250-1', {
    //     debug: process.env.NODE_ENV !== 'production',
    //     titleCase: false,
    //     gaOptions: {siteSpeedSampleRate: 100}
    // });

    return <Router>
        <ApolloProvider client={client}>
            <PageContainer/>
        </ApolloProvider>
    </Router>;
}

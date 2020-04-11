import React from "react";
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from '@apollo/client';
import {PageContainer} from "./PageContainer";
import {GRAPHQL_ENDPOINT} from "./config";
import ReactGA from 'react-ga';
import {CssBaseline} from "@material-ui/core";
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: "https://615bd73a0a5741debde731bbeacffa25@o371822.ingest.sentry.io/5196842",
    environment: process.env.NODE_ENV,
    beforeSend(event, hint) {
        // Check if it is an exception, and if so, show the report dialog
        if (event.exception) {
            Sentry.showReportDialog({eventId: event.event_id});
        }
        return event;
    }
});


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

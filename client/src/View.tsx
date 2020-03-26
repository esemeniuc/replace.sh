import Page from "./components/Page";
import ReactGA from 'react-ga';
import React from "react";
import {gql, useQuery} from '@apollo/client';
import {GetFindReplaceCommand} from "./__generated__/GetFindReplaceCommand";
import {Box, Paper, Typography} from "@material-ui/core";
import {Codebox} from "./components/Codebox";
import {formatCommandForDisplay} from "./Home";
import {useParams} from "react-router";

const GET_FIND_REPLACE_COMMAND = gql`
    query GetFindReplaceCommand($shortcode: String!){
        getFindReplaceCommand(shortcode: $shortcode){
            find
            replace
            command
            shortcode
        }
    }
`;

export default function View() {
    const {shortcode} = useParams();
    ReactGA.pageview('/r');
    const {
        loading: frcLoading,
        error: frcError,
        data: frcData,
        // refetch: frcRefetch
    } = useQuery<GetFindReplaceCommand>(GET_FIND_REPLACE_COMMAND, {variables: {shortcode}});
    if (frcLoading) return <>Loading!</>; //TODO make loading and error pages
    if (frcError || !frcData) return <>Error!</>;
    return <Page>
        <Box mx={4} my={6}>
            <Typography variant="h4" component="h1">
                The command ⤵
            </Typography>
            <Paper elevation={5}>
                <Codebox
                    cmd={formatCommandForDisplay(frcData?.getFindReplaceCommand?.command, frcData?.getFindReplaceCommand?.shortcode)}/>
            </Paper>

            <Typography variant="h4" component="h1">
                ... finds this text ⤵
            </Typography>
            <Box fontFamily="Monospace" fontSize="h6.fontSize" m={1} style={{whiteSpace: "pre-wrap"}}>
                {frcData?.getFindReplaceCommand?.find}
            </Box>
            <Typography variant="h4" component="h1">
                and replaces it with ⤵
            </Typography>
            <Box fontFamily="Monospace" fontSize="h6.fontSize" m={1} style={{whiteSpace: "pre-wrap"}}>
                {frcData?.getFindReplaceCommand?.replace}
            </Box>
        </Box>
    </Page>;
}

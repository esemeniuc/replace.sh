import Page from "./components/Page";
import ReactGA from 'react-ga';
import React from "react";
import {gql, useQuery} from '@apollo/client';
import {GetFindReplaceCommand} from "./__generated__/GetFindReplaceCommand";
import {Box, Button, Typography} from "@material-ui/core";
import {Codebox} from "./components/Codebox";
import {formatCommandForDisplay, getUrlFromShortcode} from "./Home";
import {useParams, useRouteMatch} from "react-router";
import {Link} from "react-router-dom";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {ShareBox} from "./components/Share";
import {ErrorComponent} from "./components/ErrorComponent";

const GET_FIND_REPLACE_COMMAND = gql`
    query GetFindReplaceCommand($shortcode: String!){
        getFindReplaceCommand(shortcode: $shortcode){
            find
            replace
            command
            isGlobal
            isInplace
            shortcode
        }
    }
`;

export default function View() {
    const match = useRouteMatch();
    ReactGA.pageview(match.url);
    const {shortcode} = useParams();

    const {
        loading: frcLoading,
        error: frcError,
        data: frcData,
        // refetch: frcRefetch
    } = useQuery<GetFindReplaceCommand>(GET_FIND_REPLACE_COMMAND, {variables: {shortcode}});
    if (frcLoading) return <Page><LoadingSpinner/></Page>;
    if (frcError || !frcData) return <Page><ErrorComponent message={`${shortcode} not found :(`}/></Page>;
    if (!frcData.getFindReplaceCommand) return <Page>404, sorry not found :(</Page>;
    return <Page>
        <Box mx={4} my={6}>
            <Typography variant="h4" component="h1">
                The command ⤵
            </Typography>
            <Codebox cmd={formatCommandForDisplay(
                frcData.getFindReplaceCommand.command,
                frcData.getFindReplaceCommand.shortcode)}/>
            <Box my={3}/>

            <Typography variant="h5" component="h2" gutterBottom>
                ... finds <span style={{
                backgroundColor: "#e9ff32", //greenish
                textDecoration: "underline"
            }}>{frcData.getFindReplaceCommand.isGlobal ? "all occurrences" : "the first occurrence"}</span> of this
                text ⤵
            </Typography>
            <Box fontFamily="Monospace" fontSize="body1.fontSize" mx={1} my={3} style={{whiteSpace: "pre-wrap"}}>
                {frcData.getFindReplaceCommand.find}
            </Box>

            <Typography variant="h5" component="h2" gutterBottom>
                ... and replaces it <span style={{
                backgroundColor: "#e9ff32", //greenish
                textDecoration: "underline"
            }}>{frcData.getFindReplaceCommand.isInplace ? "in-place" : "in a new file"}</span> with this
                text ⤵
            </Typography>

            <Box fontFamily="Monospace" fontSize="body1.fontSize" mx={1} my={3} style={{whiteSpace: "pre-wrap"}}>
                {frcData.getFindReplaceCommand.replace}
            </Box>

            <Box my={2}/>

            <Box display="flex" justifyContent="center">
                <Button size="large"
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/">
                    Make another!
                </Button>
            </Box>
            <Box my={5}/>
            <ShareBox url={getUrlFromShortcode(frcData.getFindReplaceCommand.shortcode)}
                      message={"Use replace.sh to find and replace blocks of text with sed."}/>
        </Box>
    </Page>;
}

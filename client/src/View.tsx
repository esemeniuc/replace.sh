import Page from "./components/Page";
import ReactGA from 'react-ga';
import React from "react";
import {gql, useQuery} from '@apollo/client';
import {GetFindReplaceCommand} from "./__generated__/GetFindReplaceCommand";
import {Box, Button, Typography} from "@material-ui/core";
import {Codebox} from "./components/Codebox";
import {formatCommandForDisplay} from "./Home";
import {useParams} from "react-router";
import {Link} from "react-router-dom";

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
            <Codebox cmd={formatCommandForDisplay(
                frcData?.getFindReplaceCommand?.command,
                frcData?.getFindReplaceCommand?.shortcode)}/>
            <Box my={3}/>

            <Typography variant="h5" component="h2" gutterBottom>
                ... finds this text ⤵
            </Typography>
            <Box fontFamily="Monospace" fontSize="body1.fontSize" mx={1} my={3} style={{whiteSpace: "pre-wrap"}}>
                {frcData?.getFindReplaceCommand?.find}
            </Box>

            <Typography variant="h5" component="h2" gutterBottom>
                and replaces it with ⤵
            </Typography>
            <Box fontFamily="Monospace" fontSize="body1.fontSize" mx={1} my={3} style={{whiteSpace: "pre-wrap"}}>
                {frcData?.getFindReplaceCommand?.replace}
            </Box>

            <Box display="flex" justifyContent="center">
                <Button size="large"
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/">
                    Make one like this!
                </Button>
            </Box>

        </Box>
    </Page>;
}

import Page from "./components/Page";
import ReactGA from 'react-ga';
import React from "react";
import {gql, useQuery} from '@apollo/client';
import {GetFindReplaceCommand} from "./__generated__/GetFindReplaceCommand";
import {Box, Paper, Typography} from "@material-ui/core";
import {Codebox} from "./components/Codebox";
import {formatCommandForDisplay} from "./Home";

const GET_FIND_REPLACE_COMMAND = gql`
    query GetFindReplaceCommand{
        getFindReplaceCommand(shortcode: "hideous-ground-0042"){
            find
            replace
            command
            shortcode
        }
    }
`;

export default function View() {
    ReactGA.pageview('/view');
    const {
        loading: frcLoading,
        error: frcError,
        data: frcData,
        // refetch: frcRefetch
    } = useQuery<GetFindReplaceCommand>(GET_FIND_REPLACE_COMMAND);
    if (frcLoading) return <>Loading!</>; //TODO make loading and error pages
    if (frcError || !frcData) return <>Error!</>;
    return <Page>
        Command
        <Box mx={4} my={6}>
            <Typography variant="h4"
                        component="h1"
                        align="center">
                Command
            </Typography>
            <Paper elevation={5}>
                <Codebox
                    cmd={formatCommandForDisplay(frcData?.getFindReplaceCommand?.command, frcData?.getFindReplaceCommand?.shortcode)}/>
            </Paper>

        </Box>
    </Page>;
}

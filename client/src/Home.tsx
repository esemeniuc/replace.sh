import Page from "./components/Page";
import ReactGA from 'react-ga';
import React, {useState} from "react";
import {gql, useMutation} from '@apollo/client';
import {CreateCommand} from "./__generated__/CreateCommand";
import {Box, Button, Paper, TextField, Typography} from "@material-ui/core";
import {VIEW_FRC_ENDPOINT} from "./config";
import {Codebox} from "./components/Codebox";

const CREATE_COMMAND = gql`
    mutation CreateCommand ($find: String!, $replace: String!) {
        createCommand(find: $find, replace: $replace){
            command
            shortcode
        }
    }
`;

export function formatCommandForDisplay(command: string | undefined, shortcode: string | undefined): string {
    return `${command?.replace(/\n/g, "\\n")} #wtf is this? ${VIEW_FRC_ENDPOINT}/${shortcode}`;
}

export default function Home() {
    ReactGA.pageview('/home');

    const [find, setFind] = useState("findo1\nfindo2\nfindo3\nfindo4");
    const [replace, setReplace] = useState("replaco1\nreplaco2\nreplaco3\nreplaco4\n");

    const [createCommand, {data: ccData, loading: ccLoading, error: ccError}] = useMutation<CreateCommand>(CREATE_COMMAND);
    if (ccLoading) return <>Loading!</>; //TODO make loading and error pages
    if (ccError) return <>Error!</>;
    return <Page>
        Find and replace multiple lines of text from command line
        <form>
            <Box m={4}>
                <TextField
                    value={find}
                    onChange={(e) => {
                        setFind(e.target.value);
                    }}
                    id="outlined-multiline-static"
                    label="Find"
                    multiline
                    rows="8"
                    placeholder="Eg. foo123"
                    variant="outlined"
                    autoFocus
                    fullWidth
                    InputProps={{
                        style: {fontFamily: "monospace"},
                    }}
                />
            </Box>
            <Box m={4}>
                <TextField
                    value={replace}
                    onChange={(e) => {
                        setReplace(e.target.value);
                    }}
                    id="outlined-multiline-static"
                    label="Replace"
                    multiline
                    rows="8"
                    placeholder="Eg. bar123"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        style: {fontFamily: "monospace"},
                    }}
                />
            </Box>
            <Box display="flex" justifyContent="center">
                <Button variant="contained"
                        color="primary"
                        onClick={(e) => {
                            e.preventDefault();
                            createCommand({
                                variables: {
                                    find,
                                    replace
                                }
                            });
                        }}>
                    Generate!
                </Button>
            </Box>

        </form>
        {
            // ccData && cmd && <Box m={4}>
            <>

                <Box mx={4} my={6}>
                    <Typography variant="h4"
                                component="h1"
                                align="center">
                        Command
                    </Typography>
                    <Paper elevation={5}>
                        <Codebox
                            cmd={formatCommandForDisplay(ccData?.createCommand.command, ccData?.createCommand.shortcode)}/>
                    </Paper>

                </Box>
            </>
        }
    </Page>;
}

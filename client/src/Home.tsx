import Page from "./components/Page";
import ReactGA from 'react-ga';
import React, {useState} from "react";
import {gql, useMutation} from '@apollo/client';
import {CreateCommand} from "./__generated__/CreateCommand";
import {Box, Button, Paper, TextField, Typography} from "@material-ui/core";
import {VIEW_FRC_ENDPOINT} from "./config";
import {Codebox} from "./components/Codebox";
import {SyncLoader} from "react-spinners";
import AsciinemaPlayer from "./components/AsciinemaPlayer";

const CREATE_COMMAND = gql`
    mutation CreateCommand ($find: String!, $replace: String!) {
        createCommand(find: $find, replace: $replace){
            command
            shortcode
        }
    }
`;

export function formatCommandForDisplay(command: string | undefined, shortcode: string | undefined): string {
    return `${command?.replace(/\n/g, "\\n")} #cmd info: ${VIEW_FRC_ENDPOINT}/${shortcode}`;
}

export default function Home() {
    ReactGA.pageview('/home');

    const [find, setFind] = useState("findo1\nfindo2\nfindo3\nfindo4");
    const [replace, setReplace] = useState("replaco1\nreplaco2\nreplaco3\nreplaco4");
    const [createCommand, {data: ccData, loading: ccLoading, error: ccError}] = useMutation<CreateCommand>(CREATE_COMMAND);
    return <Page>
        <Typography variant="h4"
                    component="h1"
                    align="center">
            Find and replace multiple lines of text from command line
        </Typography>

        <AsciinemaPlayer id="asciicast-WlEd6YNdZbJSYJ3x8dccc7GEE"
                         src="https://asciinema.org/a/WlEd6YNdZbJSYJ3x8dccc7GEE.js"/>
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
                <Button size="large"
                        variant="contained"
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
            ccLoading ? <Box display="flex" justifyContent="center" my={6}>
                    <SyncLoader size={24} color="#3f51b5"/>
                </Box> :
                ccError ? <>Error!</> :  //TODO make error pages
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

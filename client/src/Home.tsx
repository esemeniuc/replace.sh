import Page from "./components/Page";
import ReactGA from 'react-ga';
import React, {useState} from "react";
import {gql, useMutation} from '@apollo/client';
import {CreateCommand} from "./__generated__/CreateCommand";
import {Box, Button, Paper, TextField, Tooltip, Typography} from "@material-ui/core";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {tomorrowNight} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {useClipboard} from "use-clipboard-copy";
import {VIEW_FRC_ENDPOINT} from "./config";

const CREATE_COMMAND = gql`
    mutation CreateCommand ($find: String!, $replace: String!) {
        createCommand(find: $find, replace: $replace){
            command
            shortcode
        }
    }
`;

function Codebox(props: { cmd: string }) {
    const clipboard = useClipboard({
        copiedTimeout: 1500 // duration in milliseconds
    });
    console.log(props.cmd);
    return <Tooltip title="Copied to clipboard!" open={clipboard.copied}>
        <Box>{/* need this to avoid refs*/}
            <SyntaxHighlighter onClick={() => clipboard.copy(props.cmd)}
                               language="bash"
                               style={tomorrowNight}
                               customStyle={{fontSize: "1.4rem", whiteSpace: "pre-wrap"}}>
                {props.cmd}
            </SyntaxHighlighter>
        </Box>
    </Tooltip>;
}

function formatCommandForDisplay(ccData: CreateCommand | undefined) {
    return `${ccData?.createCommand.command} #wtf is this? ${VIEW_FRC_ENDPOINT}/${ccData?.createCommand.shortcode}`;
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
                        <Codebox cmd={formatCommandForDisplay(ccData)}/>
                    </Paper>

                </Box>
            </>
        }
    </Page>;
}

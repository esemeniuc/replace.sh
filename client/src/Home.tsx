import Page from "./components/Page";
import ReactGA from 'react-ga';
import React, {forwardRef, RefObject, useState} from "react";
import {gql, useMutation} from '@apollo/client';
import {CreateComand} from "./__generated__/CreateComand";
import {Box, Button, TextField, Tooltip, Typography} from "@material-ui/core";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {tomorrowNight} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {useClipboard} from "use-clipboard-copy";
import {VIEW_FRC_ENDPOINT} from "./config";

const CREATE_COMMAND = gql`
    mutation CreateComand ($find: String!, $replace: String!) {
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
    return <Tooltip title="Copied to clipboard!" open={clipboard.copied}>
        <Box>{/* need to avoid refs*/}
            <SyntaxHighlighter onClick={() => clipboard.copy(props.cmd)}
                               language="bash"
                               style={tomorrowNight}>
                {props.cmd}
            </SyntaxHighlighter>
        </Box>
    </Tooltip>;
}

export default function Home() {
    ReactGA.pageview('/home');

    const [find, setFind] = useState("");
    const [replace, setReplace] = useState("");

    const [createCommand, {data: ccData, loading: ccLoading, error: ccError}] = useMutation<CreateComand>(CREATE_COMMAND);
    if (ccLoading) return <>Loading!</>; //TODO make loading and error pages
    if (ccError) return <>Error!</>;
    const cmd = `${ccData?.createCommand.command} #wtf is this? ${VIEW_FRC_ENDPOINT}/${ccData?.createCommand.shortcode}`;
    return <Page>
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
            ccData && <Box m={4}>
                <Codebox cmd={cmd}/>
            </Box>
        }
    </Page>;
}



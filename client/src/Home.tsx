import Page from "./components/Page";
import ReactGA from 'react-ga';
import React, {forwardRef, RefObject, useState} from "react";
import {gql, useMutation} from '@apollo/client';
import {CreateComand} from "./__generated__/CreateComand";
import {Box, Button, TextField, Tooltip, Typography} from "@material-ui/core";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {tomorrowNight} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {useClipboard} from "use-clipboard-copy";

const CREATE_COMMAND = gql`
    mutation CreateComand ($find: String!, $replace: String!) {
        createCommand(find: $find, replace: $replace){
            command
            shortcode
        }
    }
`;

export default function Home() {
    ReactGA.pageview('/home');
    const clipboard = useClipboard({
        copiedTimeout: 1500 // duration in milliseconds
    });
    const [find, setFind] = useState("");
    const [replace, setReplace] = useState("");

    const [createCommand, {data: ccData, loading: ccLoading, error: ccError}] = useMutation<CreateComand>(CREATE_COMMAND);
    if (ccLoading) return <>Loading!</>; //TODO make loading and error pages
    if (ccError) return <>Error!</>;
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
        {ccData && <Box m={4}>
            {/*    {ccData?.createCommand.command}*/}
            {/*    {ccData?.createCommand.shortcode}*/}

            <Tooltip title="Copied to clipboard!" open={clipboard.copied}>
                <Box>
                    <SyntaxHighlighter onClick={() => clipboard.copy(find)}
                                       language="javascript"
                                       style={tomorrowNight}>
                        {find}
                    </SyntaxHighlighter>
                </Box>
            </Tooltip>

        </Box>}
    </Page>;
}



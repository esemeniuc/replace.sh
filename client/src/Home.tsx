import Page from "./components/Page";
import ReactGA from 'react-ga';
import React, {useState} from "react";
import {gql, useMutation, useQuery} from '@apollo/client';
import {CreateComand} from "./__generated__/CreateComand";
import {Box, Button, TextField, Typography} from "@material-ui/core";

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
    const [find, setFind] = useState<string>();
    const [replace, setReplace] = useState<string>();

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
        {ccData && <>
            {ccData?.createCommand.command}
            {ccData?.createCommand.shortcode}
        </>}
    </Page>;
}

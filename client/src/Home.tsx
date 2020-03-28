import Page from "./components/Page";
import ReactGA from 'react-ga';
import React, {useState} from "react";
import {gql, useMutation} from '@apollo/client';
import {CreateCommand} from "./__generated__/CreateCommand";
import {Box, Button, Grid, Switch, TextField, Tooltip, Typography} from "@material-ui/core";
import {VIEW_FRC_ENDPOINT} from "./config";
import {Codebox} from "./components/Codebox";
import {SyncLoader} from "react-spinners";
import AsciinemaPlayer from "./components/AsciinemaPlayer";
import {ShareBox} from "./components/Share";

const CREATE_COMMAND = gql`
    mutation CreateCommand ($find: String!, $replace: String!, $isGlobal: Boolean!, $isInplace: Boolean!) {
        createCommand(find: $find, replace: $replace, isGlobal: $isGlobal, isInplace: $isInplace){
            command
            shortcode
        }
    }
`;

function getUrlFromShortcode(shortcode: string | undefined) {
    return `${VIEW_FRC_ENDPOINT}/${shortcode}`;
}

export function formatCommandForDisplay(command: string | undefined, shortcode: string | undefined): string {
    return `${command?.replace(/\n/g, "\\n")} #cmd info: ${getUrlFromShortcode(shortcode)}`;
}

export default function Home() {
    ReactGA.pageview('/home');

    const [find, setFind] = useState("findo1\nfindo2\nfindo3\nfindo4");
    const [replace, setReplace] = useState("replaco1\nreplaco2\nreplaco3\nreplaco4");
    const [isGlobal, setIsGlobal] = useState(true);
    const [isInplace, setIsInplace] = useState(false);
    const [createCommand, {data: ccData, loading: ccLoading, error: ccError}] = useMutation<CreateCommand>(CREATE_COMMAND);
    return <Page>
        <Box mt={4}/>
        <Typography variant="h4"
                    component="h1"
                    align="center">
            Find and replace blocks of text with <Tooltip
            title="sed is a stream editor that transforms text from an input stream (a file, or input from a pipeline). It's available on almost any platform (Ubuntu, Linux, Mac OS, WSL)"
            arrow>
            <span
                style={{
                    fontFamily: "monospace",
                    backgroundColor: "#e9ff32", //greenish
                    textDecoration: "underline"
                }}>sed</span>
        </Tooltip>
        </Typography>

        <Box style={{width: "80%", margin: "auto"}}>
            <AsciinemaPlayer id="Vk3jubMXrW4dVSvRfbmRwtALT"
                             size='medium'
                             speed={2.5}
                             autoplay/>
        </Box>
        <form>
            <Typography variant="h5" component="h2" align="center" gutterBottom>
                Let's find this text ⤵
            </Typography>
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

            <Typography variant="h5" component="h2" align="center" gutterBottom>
                ... and replace it with ⤵
            </Typography>
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

            <Typography variant="h5" component="h2" align="center" gutterBottom>
                Optional customizations ⤵
            </Typography>
            <Box my={4} mx={30}>
                <Grid component="label" container alignItems="center" justify="center" spacing={1}
                      style={{flexWrap: "nowrap"}}>
                    <Grid item xs={5} style={{textAlign: "center"}}>
                        <Tooltip arrow
                                 title="Replaces only the first time text appears, and ignores all other matches">
                            <Typography variant="body1">Replace first</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={2} style={{textAlign: "center"}}>
                        <Switch checked={isGlobal} onChange={() => setIsGlobal(!isGlobal)}/>
                    </Grid>
                    <Grid item xs={5} style={{textAlign: "center"}}>
                        <Tooltip arrow
                                 title="Replaces all occurrences of the text being searched for">
                            <Typography variant="body1">Replace all</Typography>
                        </Tooltip>
                    </Grid>
                </Grid>

                <Grid component="label" container alignItems="center" justify="center" spacing={1}
                      style={{flexWrap: "nowrap"}}>
                    <Grid item xs={5} style={{textAlign: "center"}}>
                        <Tooltip arrow
                                 title="Creates a new file called 'OUTPUT_FILE.txt'. Does not modify 'INPUT_FILE.txt'">
                            <Typography variant="body1">Make new file</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={2} style={{textAlign: "center"}}>
                        <Switch checked={isInplace} onChange={() => setIsInplace(!isInplace)}/>
                    </Grid>
                    <Grid item xs={5} style={{textAlign: "center"}}>
                        <Tooltip arrow
                                 title="Modifies 'INPUT_FILE.txt' in-place">
                            <Typography variant="body1">Modify in-place</Typography>
                        </Tooltip></Grid>
                </Grid>
            </Box>

            <Box my={4}/>

            <Box display="flex" justifyContent="center">
                <Button size="large"
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                            e.preventDefault();
                            createCommand({
                                variables: {
                                    find,
                                    replace,
                                    isGlobal,
                                    isInplace,
                                }
                            });
                        }}>
                    Lets do it!
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
                                        align="center"
                                        gutterBottom>
                                Your shiny command ⤵
                            </Typography>
                            <Codebox
                                cmd={formatCommandForDisplay(ccData?.createCommand.command, ccData?.createCommand.shortcode)}/>

                            <Box my={8}/>

                            <ShareBox url={getUrlFromShortcode(ccData?.createCommand.shortcode)}
                                      message={"Use replace.sh to find and replace blocks of text with sed."}/>
                        </Box>
                    </>
        }
    </Page>;
}

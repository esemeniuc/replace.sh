import {Grid, Switch, Tooltip, Typography} from "@material-ui/core";
import React from "react";

export function FindReplaceOptionsSelector(props: {
    isGlobal: boolean,
    setIsGlobal?: (prevState: boolean) => void,
    isInplace: boolean,
    setIsInplace?: (prevState: boolean) => void
    disableInput: boolean,
}) {
    return <>
        <Grid component="label" container alignItems="center" justify="center" spacing={1}
              style={{flexWrap: "nowrap"}}>
            <Grid item xs={5} style={{textAlign: "center"}}>
                <Tooltip arrow
                         title="Replaces only the first time text appears, and ignores all other matches">
                    <Typography variant="body1">Replace first</Typography>
                </Tooltip>
            </Grid>
            <Grid item xs={2} style={{textAlign: "center"}}>
                <Switch checked={props.isGlobal}
                        disabled={props.disableInput}
                        onChange={() => props.setIsGlobal && props.setIsGlobal(!props.isGlobal)}/>
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
                <Switch checked={props.isInplace}
                        disabled={props.disableInput}
                        onChange={() => props.setIsInplace && props.setIsInplace(!props.isInplace)}/>
            </Grid>
            <Grid item xs={5} style={{textAlign: "center"}}>
                <Tooltip arrow
                         title="Modifies 'INPUT_FILE.txt' in-place">
                    <Typography variant="body1">Modify in-place</Typography>
                </Tooltip></Grid>
        </Grid>
    </>;
}

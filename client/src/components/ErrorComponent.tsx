import {Box, Typography} from "@material-ui/core";
import {ErrorOutline} from "@material-ui/icons";
import React from "react";

export function ErrorComponent(props: { message?: React.ReactNode }) {
    return <Box m={4}>
        <Typography variant="h3" component="h1" gutterBottom>
            <ErrorOutline/> Error
        </Typography>
        {
            props.message && <Typography variant="body1">
                {props.message}
            </Typography>
        }
    </Box>;
}

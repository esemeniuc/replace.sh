import {Typography} from "@material-ui/core";
import {ErrorOutline} from "@material-ui/icons";
import React from "react";

export function ErrorComponent() {
    return <Typography variant="body1"><ErrorOutline/> Error!</Typography>;
}

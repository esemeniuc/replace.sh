import {Box} from "@material-ui/core";
import {SyncLoader} from "react-spinners";
import React from "react";

export function LoadingSpinner() {
    return <Box display="flex" justifyContent="center" my={6}>
        <SyncLoader size={24} color="#3f51b5"/>
    </Box>;
}

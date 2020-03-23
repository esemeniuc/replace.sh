import React from "react";
import {Box} from "@material-ui/core";

export default function Section(props: { style?: React.CSSProperties, children?: React.ReactNode }) {
    return <Box mx={7} style={{
        display: 'flex',
        flexDirection: "column",
        justifyItems: 'center',
        height: '50%', ...props.style
    }}>{props.children}</Box>;
}
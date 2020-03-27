import {useClipboard} from "use-clipboard-copy";
import {Box, Link, Paper, Tooltip, Typography} from "@material-ui/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import {tomorrowNight} from "react-syntax-highlighter/dist/esm/styles/hljs";
import React from "react";
import {Assignment} from "@material-ui/icons";

export function Codebox(props: { cmd: string }) {
    const clipboard = useClipboard({
        copiedTimeout: 1500 // duration in milliseconds
    });
    return <Tooltip title="Copied to clipboard!" open={clipboard.copied} arrow>
        <Box>{/* need this box to avoid dealing with refs using tooltip*/}
            <Paper elevation={5}>
                <SyntaxHighlighter onClick={() => clipboard.copy(props.cmd)}
                                   language="bash"
                                   style={tomorrowNight}
                                   customStyle={{fontSize: "1.4rem", whiteSpace: "pre-wrap"}}>
                    {props.cmd}
                </SyntaxHighlighter>
            </Paper>
            <Box display="flex"
                 justifyContent="center"
                 alignItems="center"
                 onClick={() => clipboard.copy(props.cmd)}>
                <Assignment color="primary"/>{' '}
                <Typography variant="caption"
                            component="h2">
                    <Link onClick={() => clipboard.copy(props.cmd)}>
                        Copy to clipboard
                    </Link>
                </Typography>
            </Box>
        </Box>
    </Tooltip>;
}

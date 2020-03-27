import {useClipboard} from "use-clipboard-copy";
import {Box, Tooltip} from "@material-ui/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import {tomorrowNight} from "react-syntax-highlighter/dist/esm/styles/hljs";
import React from "react";

export function Codebox(props: { cmd: string }) {
    const clipboard = useClipboard({
        copiedTimeout: 1500 // duration in milliseconds
    });
    return <Tooltip title="Copied to clipboard!" open={clipboard.copied}>
        <Box>{/* need this to avoid refs*/}
            <SyntaxHighlighter onClick={() => clipboard.copy(props.cmd)}
                               language="bash"
                               style={tomorrowNight}
                               customStyle={{fontSize: "1.4rem", whiteSpace: "pre-wrap"}}>
                {props.cmd}
            </SyntaxHighlighter>
        </Box>
    </Tooltip>;
}

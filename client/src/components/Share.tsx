import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";
import {Box, Link, Tooltip, Typography} from "@material-ui/core";
import React from "react";
import {useClipboard} from "use-clipboard-copy";
import {BACKEND_ROOT_URL} from "../config";

export function ShareBox(props: { url: string, message: string }) {
    const clipboard = useClipboard({
        copiedTimeout: 1500 // duration in milliseconds
    });
    return <Box display="flex" flexDirection="column" alignItems="center">

        <Typography variant="h6"
                    component="h3"
                    gutterBottom>
            Share via url
        </Typography>
        <Tooltip title="Copied to clipboard!" open={clipboard.copied} arrow>
            <Link onClick={() => clipboard.copy(props.url)}>
                {props.url}
            </Link>
        </Tooltip>

        <Box my={1}/>

        <Typography variant="h6"
                    component="h3"
                    gutterBottom>
            Share via social media
        </Typography>
        <Box display="flex" justifyContent="center">
            <EmailShareButton subject={props.message} //TODO: use short names in subject instead
                              body={props.message}
                              url={props.url}>
                <EmailIcon/>
            </EmailShareButton>
            <FacebookShareButton quote={props.message}
                                 hashtag={"#replace.sh"}
                                 url={props.url}>
                <FacebookIcon/>
            </FacebookShareButton>
            <TwitterShareButton title={props.message}
                                hashtags={["replace.sh"]}
                                via={BACKEND_ROOT_URL}
                                url={props.url}>
                <TwitterIcon/>
            </TwitterShareButton>
            <WhatsappShareButton title={props.message}
                                 url={props.url}>
                <WhatsappIcon/>
            </WhatsappShareButton>
        </Box>
    </Box>
}

import React from "react";
import {AppBar, Box, Container, Link, Toolbar, Typography} from "@material-ui/core";
import {BACKEND_ROOT_URL} from "../config";
import {PageviewOutlined} from "@material-ui/icons";

export default function Page(props: { children: React.ReactNode, style?: React.CSSProperties }) {
    return <>
        <AppBar position="relative" elevation={1}>
            <Toolbar>
                <PageviewOutlined/><Box mr={1}/>
                <Link href={BACKEND_ROOT_URL} color="inherit">
                    <Typography variant="h6" color="inherit" noWrap>
                        replace.sh
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar>
        <Container maxWidth="md" style={{backgroundColor: 'white', ...props.style}}>
            {props.children}
            <footer>
                <Box my={3}>
                    <Typography variant="body2" color="textSecondary" align="center">
                        {'Copyright © '}
                        <Link color="inherit" href={BACKEND_ROOT_URL}>
                            replace.sh
                        </Link>
                        {` ${new Date().getFullYear()}`}
                    </Typography>
                </Box>
            </footer>
        </Container>
    </>
}

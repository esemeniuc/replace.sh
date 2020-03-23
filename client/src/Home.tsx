import React from "react";
import Page from "./components/Page";
import {Box, Button, Card, CardContent, CardHeader, Divider, Grid, Typography} from "@material-ui/core";
import {
    AssignmentTurnedIn,
    CheckCircleOutline,
    ContactPhone,
    Lock,
    Payment,
    PostAdd,
    Print,
    Speed,
    SvgIconComponent
} from '@material-ui/icons';
import ReactGA from 'react-ga';

export default function Home(props: { onNext: () => void }) {
    ReactGA.pageview('/home');
    return <Page>
        <Box p={4} mt={3}>
            <Grid container spacing={0} justify="space-around" alignItems="center">
                <Grid item>
                    <Typography variant="h4" component="h1" color="textPrimary">
                        Simple Pay As You Go Faxing
                    </Typography>
                    <Typography variant="h6" component="h1" color="textSecondary">
                        Secure online faxing to anywhere in North America
                    </Typography>
                </Grid>
                <Grid item>
                    <Print color="primary" style={{fontSize: 225}}/>
                </Grid>
            </Grid>

            <Box display="flex" flexDirection="column" alignItems="center">
                <Button size="large"
                        style={{fontSize: "2rem"}}
                        variant="contained"
                        color="primary"
                        onClick={props.onNext}>
                    Get Started
                </Button>
                <Box mt={1}>
                    <Typography variant="caption" component="h3" style={{justifySelf: "center"}}>
                        $0.20 per page, no other fees
                    </Typography>
                </Box>
            </Box>

            <Box p={4} m={2}/>

            <Grid container spacing={5}>
                {
                    [
                        {
                            title: "Simple",
                            description: [
                                "Pay with PayPal",
                                "No account setup",
                                "No monthly fees",
                            ],
                            icon: AssignmentTurnedIn
                        },
                        {
                            title: "Fast",
                            description: [
                                "Fax in under a minute",
                                "3 automatic retries",
                                "No queueing delay",
                            ],
                            icon: Speed
                        },
                        {
                            title: "Private",
                            description: [
                                "Secure connection",
                                "No file retention",
                                "No ads",
                            ],
                            icon: Lock
                        },
                    ].map((props: { title: string, description: string[], icon: SvgIconComponent }, idx) =>
                        <Grid item xs key={idx}>
                            <Card elevation={0}>
                                <CardHeader title={<>
                                    <props.icon color="primary" style={{fontSize: 120}}/>
                                    <Typography variant="h6" component="h2" align="center" color='primary'>
                                        {props.title}
                                    </Typography>
                                </>}
                                            titleTypographyProps={{align: 'center'}}/>
                                <Divider variant="middle"/>
                                <CardContent>
                                    <ul style={{
                                        margin: 0,
                                        padding: 0,
                                        listStyle: 'none',
                                    }}>
                                        {props.description.map((el, idx) =>
                                            <Typography component="li"
                                                        variant="subtitle1"
                                                        align="center"
                                                        key={idx}>
                                                {el}
                                            </Typography>
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>
                        </Grid>)
                }
            </Grid>

            <blockquote>
                <Box m={6} p={3}>
                    <Typography variant="h5" color="textPrimary" align='center'
                                style={{justifySelf: "center"}}>
                        Faxtail is designed with security in mind and is GDPR compliant, making it a safe and
                        secure faxing solution
                    </Typography>
                </Box>
            </blockquote>

            <Box my={10}>
                <Grid container spacing={6}>
                    <Grid item xs style={{alignSelf: "center"}}>
                        <Typography variant="h5" component="h1" color="textPrimary" gutterBottom>
                            Sending a Fax is Easy
                        </Typography>
                    </Grid>
                    {
                        [
                            {
                                title: "1. Enter Fax Number",
                                icon: ContactPhone
                            },
                            {
                                title: "2. Upload Documents",
                                icon: PostAdd
                            },
                            {
                                title: "3. Pay with Paypal",
                                icon: Payment
                            },
                            {
                                title: "4. Done",
                                icon: CheckCircleOutline
                            },
                        ].map((props: { title: string, icon: SvgIconComponent }, idx) =>
                            <Grid item xs key={idx}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <props.icon color="secondary"
                                                style={{fontSize: 64, textAlign: "center",}}/>
                                    <Typography variant="body1" align="center">
                                        {props.title}
                                    </Typography>
                                </Box>
                            </Grid>)
                    }
                </Grid>
            </Box>
        </Box>
    </Page>
}

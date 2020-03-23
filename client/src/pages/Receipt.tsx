import React from "react";
import Page from "../components/Page";
import {CheckCircleOutline} from '@material-ui/icons'
import {Box, Button, Divider, Paper, Typography} from "@material-ui/core";
import {mockDetails} from "../components/PaymentComponent";
import {green} from "@material-ui/core/colors";
import {ProgressStepper} from "../components/ProgressStepper";
import {PageToDisplay} from "../config";
import ReactGA from "react-ga";

export default function Receipt(props: {
    onNext: () => void,
    orderId: string,
    firstName: string,
    lastName: string,
    email: string,
    faxNumber: string,
    numPages: number,
    cost: string,
    currencyCode: string,
    transactionDate: string,
}) {
    ReactGA.pageview('/receipt');
    return <Page>
        <ProgressStepper activeStep={PageToDisplay.Receipt}/>
        <Paper elevation={3}>
            <Box p={2}>
                <Box p={2} m={2}>
                    <CheckCircleOutline style={{
                        color: green[500],
                        fontSize: 64,
                        margin: 'auto',
                        width: "100%"
                    }}/> {/* use inline style to avoid flex email problems*/}
                    <Typography variant="h4" component="h1" align="center" gutterBottom>Your fax is on its
                        way!</Typography>
                    <Typography variant="h6" component="h2" align="center" gutterBottom>Order
                        ID: {props.orderId}</Typography>
                    <Typography variant="subtitle2" align="center">We'll send you another email once your fax has been
                        delivered</Typography>
                    <Typography variant="subtitle2" align="center">A copy of this receipt has been sent
                        to <u>{props.email}</u></Typography>
                </Box>
                <Divider/>
                <Box p={2} m={2}>
                    <Typography variant="h5" component="h2" gutterBottom>Sender</Typography>
                    <Typography>{props.firstName} {props.lastName}</Typography>
                    <Typography>{props.email}</Typography>
                </Box>
                <Divider/>
                <Box p={2} m={2}>
                    <Typography variant="h5" component="h2" gutterBottom>Recipient</Typography>
                    <Typography>To: {props.faxNumber}</Typography>
                    <Typography>Pages: {props.numPages}</Typography>
                </Box>
                <Divider/>
                <Box p={2} m={2}>
                    <Typography variant="h5" component="h2" gutterBottom>Order Summary</Typography>
                    <Typography>Date: {props.transactionDate}</Typography>
                    <Typography>Order ID: {props.orderId}</Typography>
                    <Typography>Total: ${props.cost} {props.currencyCode}</Typography>
                </Box>
            </Box>
        </Paper>
        {/*Forward a copy?*/}
        {/*<form>*/}
        {/*    <TextField type='text'>Hello</TextField>*/}
        {/*</form>*/}
        <Box mt={4}>
            <Box display="flex" justifyContent="center">
                <Box ml={1}/>
                <Button variant="contained"
                        color="primary"
                        onClick={props.onNext}>
                    Send another fax
                </Button>
            </Box>
        </Box>
    </Page>;
}

export function MockReceipt() {
    const paymentDetails = mockDetails;
    return <Receipt onNext={() => null}
                    orderId={paymentDetails.id}
                    firstName={paymentDetails.payer.name.given_name}
                    lastName={paymentDetails.payer.name.surname}
                    email={paymentDetails?.purchase_units[0].payee.email_address}
                    faxNumber={"1112222"}
                    numPages={5}
                    cost={paymentDetails.purchase_units[0].amount.value}
                    currencyCode={paymentDetails.purchase_units[0].amount.currency_code}
                    transactionDate={paymentDetails.update_time}
    />;
}

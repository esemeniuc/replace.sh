import React from "react";
import {pdfjs} from "react-pdf";
import Page from "../components/Page";
import {IFileWithMeta} from "react-dropzone-uploader/dist/Dropzone";
import {HorizontalPagePreviews} from "../components/HorizontalPagePreviews";
import {Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "@material-ui/core";
import {PaymentComponent, PayPalData, PayPalDetails} from "../components/PaymentComponent";
import data from '../mockData/dummyPdf.json';
import {ProgressStepper} from "../components/ProgressStepper";
import {Skeleton} from "@material-ui/lab";
import {PageToDisplay} from "../config";
import ReactGA from "react-ga";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function Review(props: {
    onPrevious: () => void,
    onPaymentSuccess: (details: PayPalDetails, data: PayPalData) => void,
    files: IFileWithMeta[],
    faxNumber: string,
    orderId: string,
    numPages: number,
    cost: string,
}) {
    ReactGA.pageview('/review');
    return <Page>
        <ProgressStepper activeStep={PageToDisplay.Review}/>
        <Paper elevation={3}>
            <Box p={4}>
                <Typography variant="h4" component="h1" gutterBottom>Review</Typography>
                <Box mt={4}>
                    <Typography variant="subtitle2" component="h2" gutterBottom>Details</Typography>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            <TableRow key='fax-number'>
                                <TableCell component="th" scope="row">Fax Number</TableCell>
                                <TableCell align="right">{props.faxNumber}</TableCell>
                            </TableRow>

                            <TableRow key='documents'>
                                <TableCell component="th" scope="row">Documents</TableCell>
                                <TableCell align="right">{props.numPages} pages</TableCell>
                            </TableRow>

                            <TableRow key='subtotal'>
                                <TableCell component="th" scope="row">Price</TableCell>
                                <TableCell align="right">${props.cost}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box my={2}>
                    <Typography variant="subtitle2" component="h2" gutterBottom>Document Preview</Typography>
                    <HorizontalPagePreviews files={props.files}/>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    {props.orderId &&
                    <PaymentComponent orderID={props.orderId} onSuccess={props.onPaymentSuccess}/>}
                    <Box ml={1}/>
                    <Button color="secondary"
                            onClick={props.onPrevious}>
                        Back
                    </Button>
                </Box>
            </Box>
        </Paper>
    </Page>;
}

export function ReviewSkeleton() {
    return <Page>
        <ProgressStepper activeStep={PageToDisplay.Review}/>
        <Paper elevation={3}>
            <Box p={4}>
                <Typography variant="h4" component="h1" gutterBottom>Review</Typography>

                <Skeleton height={50}/>
                <Skeleton height={50}/>
                <Skeleton height={50}/>
                <Box display="flex" flexWrap="nowrap">
                    {[0, 1, 2].map(idx => <Box m={2} key={idx}><Skeleton variant="rect"
                                                                         height={150}
                                                                         width={110}
                    /></Box>)}
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Skeleton height={50} width={200}/>
                    <Skeleton height={50} width={200}/>
                    <Skeleton height={50} width={200}/>
                </Box>
            </Box>
        </Paper>
    </Page>;
}

export function MockReview() {
    const dataBase64: string = data.dataAsBase64;
    const arrayBuffer = Uint8Array.from(window.atob(dataBase64), c => c.charCodeAt(0));
    const file = new File([arrayBuffer], "dummy.pdf", {type: 'application/pdf'});
    const fileWithMeta: IFileWithMeta = {
        file,
        cancel: () => null,
        restart: () => null,
        remove: () => null,
        meta: {
            status: "done",
            name: file.name,
            size: file.size,
            type: file.type,
            lastModifiedDate: new Date().toString(),
            uploadedDate: new Date().toString(),
            percent: 0,
            id: "some id"
        },
    };
    return <Review onPrevious={() => null}
                   onPaymentSuccess={(details, data) => null}
                   files={[fileWithMeta, fileWithMeta, fileWithMeta]}
                   faxNumber={"111222"}
                   orderId={"8T0511237M5900443"}
                   numPages={10}
                   cost={"1.00"}/>;
}

import React, {useState} from "react";
import Home from "./pages/Home";
import FaxNumber from "./pages/FaxNumber";
import Review, {MockReview, ReviewSkeleton} from "./pages/Review";
import Document from "./pages/Document";
import Receipt, {MockReceipt} from "./pages/Receipt";
import {IFileWithMeta} from "react-dropzone-uploader/dist/Dropzone";
import {gql} from "apollo-boost";
import {SendFax, SendFaxVariables} from "./__generated__/SendFax";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {PayPalDetails} from "./components/PaymentComponent";
import {DEBUG, HOMEPAGE, PageToDisplay} from "./config";
import {GetUploadTransactionId} from "./__generated__/GetUploadTransactionId";
import ReactGA from "react-ga";
import {PhoneNumberFormat, PhoneNumberUtil} from "google-libphonenumber";

const GET_TXN_ID = gql`
    query GetUploadTransactionId {
        getUploadTransactionId
    }
`;
const SEND_FAX = gql`
    mutation SendFax($to: String!, $uploadTransactionId: ID!) {
        fax(to: $to, uploadTransactionId: $uploadTransactionId) {
            id
            numPages
            cost
        }
    }
`;

//doesn't go back to homepage, when at the end
function getNextPage(page: PageToDisplay): PageToDisplay {
    const PAGE_COUNT = Object.keys(PageToDisplay).length / 2;
    return (page % PAGE_COUNT) + 1;
}

function getPreviousPage(page: PageToDisplay): PageToDisplay {
    if (page === 0 || page === PageToDisplay.Receipt) {
        throw new Error(`previous page not defined for ${page}`)
    }
    return page - 1
}

export function PageContainer() {
    const [page, setPage] = useState(HOMEPAGE);
    const [faxNumber, setFaxNumber] = useState<string>();
    const [pdfFiles, setPdfFiles] = useState<IFileWithMeta[]>();
    const [paymentDetails, setPaymentDetails] = useState<PayPalDetails>();

    const {
        loading: uploadTxnLoading,
        error: uploadTxnError,
        data: uploadTxnData,
        refetch: refetchUploadTransactionId
    } = useQuery<GetUploadTransactionId>(GET_TXN_ID);
    const [sendFax, {data, loading, error}] = useMutation<SendFax>(SEND_FAX);

    switch (page) {
        case PageToDisplay.Home:
            return <Home onNext={() => setPage(getNextPage(PageToDisplay.Home))}/>;

        case PageToDisplay.FaxNumber:
            return <FaxNumber faxNumber={faxNumber}
                              onPrevious={() => setPage(getPreviousPage(PageToDisplay.FaxNumber))}
                              onNextFaxNumber={faxNumber => {
                                  setFaxNumber(faxNumber);
                                  setPage(getNextPage(PageToDisplay.FaxNumber));
                              }}/>;

        case PageToDisplay.Document:
            debugger
            if (uploadTxnLoading) return <>Loading!</>; //TODO make loading and error pages
            if (uploadTxnError || !uploadTxnData || !faxNumber) return <>Error!</>;
            return <Document uploadTransactionId={uploadTxnData.getUploadTransactionId}
                             onPrevious={() => setPage(getPreviousPage(PageToDisplay.Document))}
                             onNextDocument={files => {
                                 setPdfFiles(files);
                                 if (faxNumber && uploadTxnData) {
                                     const phoneUtil = PhoneNumberUtil.getInstance();
                                     const formattedNumber = phoneUtil.format(phoneUtil.parse(faxNumber, 'US'), PhoneNumberFormat.E164);
                                     const variables: SendFaxVariables = {
                                         to: formattedNumber,
                                         uploadTransactionId: uploadTxnData.getUploadTransactionId
                                     };
                                     sendFax({variables});
                                     setPage(getNextPage(PageToDisplay.Document));
                                 }
                             }}/>;

        case PageToDisplay.Review:
            if (DEBUG) return <MockReview/>;
            if (loading) return <ReviewSkeleton/>;
            if (error || !data || !data.fax || !faxNumber || !pdfFiles) return <>Error!</>;
            return <Review files={pdfFiles}
                           faxNumber={faxNumber}
                           orderId={data.fax.id}
                           numPages={data.fax.numPages}
                           cost={data.fax.cost}
                           onPrevious={() => setPage(getPreviousPage(PageToDisplay.Review))}
                           onPaymentSuccess={(details, data) => {
                               console.log('success!');
                               setPaymentDetails(details);
                               setPage(getNextPage(PageToDisplay.Review));
                               ReactGA.event({
                                   category: 'User',
                                   action: 'Payment success',
                               });
                           }}/>;

        case PageToDisplay.Receipt:
            if (DEBUG) return <MockReceipt/>;
            if (!paymentDetails ||
                !paymentDetails.purchase_units ||
                !data ||
                !data.fax ||
                !faxNumber) {
                return <>Error!</>
            }
            return <Receipt orderId={paymentDetails.id}
                            firstName={paymentDetails.payer.name.given_name}
                            lastName={paymentDetails.payer.name.surname}
                            email={paymentDetails.purchase_units[0].payee.email_address}
                            faxNumber={faxNumber}
                            numPages={data.fax.numPages}
                            cost={paymentDetails.purchase_units[0].amount.value}
                            currencyCode={paymentDetails.purchase_units[0].amount.currency_code}
                            transactionDate={paymentDetails.update_time}
                            onNext={() => {
                                refetchUploadTransactionId();
                                ReactGA.event({
                                    category: 'User',
                                    action: 'Send another fax',
                                });
                                setPage(getNextPage(PageToDisplay.Receipt));
                            }}/>;
    }
}

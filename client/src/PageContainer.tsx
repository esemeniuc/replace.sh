import React from "react";
import {gql} from "apollo-boost";
import {SendFax} from "./__generated__/SendFax";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {GetUploadTransactionId} from "./__generated__/GetUploadTransactionId";
import Home from "./Home";

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

export function PageContainer() {

    const {
        loading: uploadTxnLoading,
        error: uploadTxnError,
        data: uploadTxnData,
        refetch: refetchUploadTransactionId
    } = useQuery<GetUploadTransactionId>(GET_TXN_ID);
    const [sendFax, {data, loading, error}] = useMutation<SendFax>(SEND_FAX);

    return <Home onNext={() => null}/>;


    // if (uploadTxnLoading) return <>Loading!</>; //TODO make loading and error pages
    // if (uploadTxnError || !uploadTxnData) return <>Error!</>;
    // return null;

}

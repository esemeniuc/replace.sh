import React from "react";
import {gql, useMutation, useQuery} from '@apollo/client';
import Home from "./Home";
import {GetFindReplaceCommand} from "./__generated__/GetFindReplaceCommand";
import {CreateComand} from "./__generated__/CreateComand";

const GET_TXN_ID = gql`
    query GetFindReplaceCommand{
        getFindReplaceCommand(shortcode: "hideous-ground-0042"){
            find
            replace
            command
        }
    }
`;
const SEND_FAX = gql`
    mutation CreateComand {
        createCommand(find: "a", replace: "b")
    }
`;

export function PageContainer() {

    const {
        loading: uploadTxnLoading,
        error: uploadTxnError,
        data: uploadTxnData,
        refetch: refetchUploadTransactionId
    } = useQuery<GetFindReplaceCommand>(GET_TXN_ID);
    const [sendFax, {data, loading, error}] = useMutation<CreateComand>(SEND_FAX);

    return <Home onNext={() => null}/>;


    // if (uploadTxnLoading) return <>Loading!</>; //TODO make loading and error pages
    // if (uploadTxnError || !uploadTxnData) return <>Error!</>;
    // return null;

}

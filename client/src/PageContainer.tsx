import React from "react";
import {gql, useQuery} from '@apollo/client';
import {GetFindReplaceCommand} from "./__generated__/GetFindReplaceCommand";

const GET_FIND_REPLACE_COMMAND = gql`
    query GetFindReplaceCommand{
        getFindReplaceCommand(shortcode: "hideous-ground-0042"){
            find
            replace
            command
        }
    }
`;
const CREATE_COMMAND = gql`
    mutation CreateComand {
        createCommand(find: "a", replace: "b")
    }
`;

export function PageContainer() {

    // const [createCommand, {data: ccData, loading: ccLoading, error: ccError}] = useMutation<CreateComand>(CREATE_COMMAND);
    // const resp = createCommand({variables: {}}).then(value => console.log("got mut response", value));
    // if (ccLoading) return <>Loading!</>; //TODO make loading and error pages
    // if (ccError || !ccData) return <>Error!</>;
    // return <p>happy happy</p>

    const {
        loading: frcLoading,
        error: frcError,
        data: frcData,
        refetch: frcRefetch
    } = useQuery<GetFindReplaceCommand>(GET_FIND_REPLACE_COMMAND);
    if (frcLoading) return <>Loading!</>; //TODO make loading and error pages
    if (frcError || !frcData) return <>Error!</>;
    return <>{`${JSON.stringify(frcData?.getFindReplaceCommand)}`}</>;
}

import React from "react";
import {gql, useMutation, useQuery} from '@apollo/client';
import {GetFindReplaceCommand} from "./__generated__/GetFindReplaceCommand";
import {CreateComand} from "./__generated__/CreateComand";

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

    const {
        loading: frcLoading,
        error: frcError,
        data: frcData,
        refetch: frcRefetch
    } = useQuery<GetFindReplaceCommand>(GET_FIND_REPLACE_COMMAND);
    const [createCommand, {data, loading, error}] = useMutation<CreateComand>(CREATE_COMMAND);

    // return <Home onNext={() => null}/>;
    const resp = createCommand({variables: {}}).then(value => console.log("got mut response", value));

    if (frcLoading) return <>Loading!</>; //TODO make loading and error pages
    if (frcError || !frcData) return <>Error!</>;
    return <>{frcData?.getFindReplaceCommand}</>;

}

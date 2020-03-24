import React, {useState} from "react";
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
    mutation CreateComand ($find: String!, $replace: String!) {
        createCommand(find: $find, replace: $replace)
    }
`;

export function PageContainer() {

    const [createCommand, {data: ccData, loading: ccLoading, error: ccError}] = useMutation<CreateComand>(CREATE_COMMAND);
    // const resp = createCommand({variables: {}}).then(value => console.log("got mut response", value));
    // if (ccLoading) return <>Loading!</>; //TODO make loading and error pages
    // if (ccError || !ccData) return <>Error!</>;
    // return <p>happy happy</p>


    const [find, setFind] = useState("aa");
    const [replace, setReplace] = useState("bb");
    const {
        loading: frcLoading,
        error: frcError,
        data: frcData,
        refetch: frcRefetch
    } = useQuery<GetFindReplaceCommand>(GET_FIND_REPLACE_COMMAND);
    if (frcLoading) return <>Loading!</>; //TODO make loading and error pages
    if (frcError || !frcData) return <>Error!</>;
    return <>
        <form>
            Find
            <textarea value={find}
                      onChange={(e) => {
                          setFind(e.target.value);
                      }}/>
            Replace
            <textarea value={replace}
                      onChange={(e) => {
                          setReplace(e.target.value);
                      }}/>
            <button onClick={(e) => {
                e.preventDefault();
                createCommand({variables: {find, replace}}).then(value => console.log("got mut response", value));
            }}>
                Submit
            </button>
        </form>
        Command
        <div>
            {`${JSON.stringify(frcData?.getFindReplaceCommand)}`}
        </div>
    </>;
}

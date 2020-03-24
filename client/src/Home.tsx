import Page from "./components/Page";
import ReactGA from 'react-ga';
import React, {useState} from "react";
import {gql, useMutation, useQuery} from '@apollo/client';
import {CreateComand} from "./__generated__/CreateComand";

const CREATE_COMMAND = gql`
    mutation CreateComand ($find: String!, $replace: String!) {
        createCommand(find: $find, replace: $replace){
            command
            shortcode
        }
    }
`;

export default function Home() {
    ReactGA.pageview('/home');
    const [find, setFind] = useState("aa");
    const [replace, setReplace] = useState("bb");

    const [createCommand, {data: ccData, loading: ccLoading, error: ccError}] = useMutation<CreateComand>(CREATE_COMMAND);
    if (ccLoading) return <>Loading!</>; //TODO make loading and error pages
    if (ccError) return <>Error!</>;
    return <Page>
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
        {ccData && <>
            {ccData?.createCommand.command}
            {ccData?.createCommand.shortcode}
        </>}
    </Page>;
}

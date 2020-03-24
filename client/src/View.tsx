import Page from "./components/Page";
import ReactGA from 'react-ga';
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

export default function View() {
    ReactGA.pageview('/view');
    const {
        loading: frcLoading,
        error: frcError,
        data: frcData,
        refetch: frcRefetch
    } = useQuery<GetFindReplaceCommand>(GET_FIND_REPLACE_COMMAND);
    if (frcLoading) return <>Loading!</>; //TODO make loading and error pages
    if (frcError || !frcData) return <>Error!</>;
    return <Page>
        Command
        <div>
            {`${JSON.stringify(frcData?.getFindReplaceCommand)}`}
        </div>
    </Page>;
}

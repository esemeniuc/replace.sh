import React, {useEffect} from "react";

function DemoComp(props: { id: string }) {
    return <div id={props.id}/>
}

export default function AsciinemaPlayer(props: { src: string, id: string, playerContainer?: React.FunctionComponent<{ id: string }> }) {
    const playerDivId = `div_${props.id}`;
    const playerContainerComponent = props.playerContainer ? <props.playerContainer id={playerDivId}/> :
        <div id={playerDivId}/>;
    useEffect(() => {
        //see https://stackoverflow.com/a/34425083 for useEffect() info
        const script = document.createElement('script');
        script.src = props.src;
        script.id = props.id;
        script.async = true;

        const playerDiv = document.getElementById(playerDivId);
        playerDiv && playerDiv.appendChild(script);

        return () => {
            playerDiv && playerDiv.removeChild(script);
        }
    }, [playerDivId, props.id, props.src]);

    return playerContainerComponent
}

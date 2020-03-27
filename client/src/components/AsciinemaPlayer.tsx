import React, {useEffect} from "react";

function DemoComp(props: { id: string }) {
    return <div id={props.id}/>
}

export default function AsciinemaPlayer(props: {
    id: string,
    autoplay?: boolean,
    size?: 'small' | 'medium' | 'big',
    cols?: number,
    rows?: number,
    speed?: number,
    playerContainer?: React.FunctionComponent<{ id: string }>
}) {
    //props based on https://asciinema.org/docs/embedding
    const playerDivId = `div_${props.id}`;
    const playerContainerComponent = props.playerContainer ? <props.playerContainer id={playerDivId}/> :
        <div id={playerDivId}/>;
    useEffect(() => {
        //see https://stackoverflow.com/a/34425083 for useEffect() info
        const script = document.createElement('script');
        script.src = `https://asciinema.org/a/${props.id}.js`;
        script.id = `asciicast-${props.id}`;
        script.async = true;
        props.autoplay && script.setAttribute('data-autoplay', props.autoplay.toString());
        props.size && script.setAttribute('data-size', props.size);
        props.cols && script.setAttribute('data-cols', props.cols.toString());
        props.rows && script.setAttribute('data-rows', props.rows.toString());
        props.speed && script.setAttribute('data-speed', props.speed.toString());

        const playerDiv = document.getElementById(playerDivId);
        playerDiv && playerDiv.appendChild(script);

        return () => {
            playerDiv && playerDiv.removeChild(script);
        }
    }, [playerDivId, props.id]);

    return playerContainerComponent
}

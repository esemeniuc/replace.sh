import React, {useEffect} from "react";

export default function AsciinemaPlayer(props: { src: string, id: string }) {
    const playerDivId = `div_${props.id}`;

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
    }, []);

    return <div id={playerDivId}/>
}

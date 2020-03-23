import React from "react";


export function WaveComponent(props: { fillColour: string }) {
    return <div style={{zIndex: -1, position: 'absolute', left: 0, right: 0, top: 400, width: "100vw"}}>
        <svg transform='scale(1 1)' width="100%" height="400" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M594.367 66.219c169.881 0 372.873-95.458 636.374-56.09 168.168 25.124 380.289 37.098 560.956 29.078 157.35-6.986 291.003-32.8 348.303-32.8v393.005c-89.015-.002-253.338-61.795-348.303-61.795-175.735 0-240.022 33.77-443.007 50.91-297.901 25.155-548.214-61.735-726.262-61.735-388.572 0-512.698 72.59-622.401 72.59C.027 242.126 0 84.676 0 6.408c198.586 0 399.197 59.812 594.367 59.812z"
                fill={props.fillColour}/>
        </svg>
    </div>;
    // return <div style={{background: "no-repeat center/200% url(wave.svg)", zIndex: 100, minHeight: 400}}>
    //     hihi
    // </div>
}
import {Step, StepLabel, Stepper} from "@material-ui/core";
import React from "react";
import {PageToDisplay} from "../config";

export function ProgressStepper(props: { activeStep: PageToDisplay }) {
    function activeStepToIndex(activeStep: PageToDisplay): number {
        return activeStep - 1;
    }

    const steps = ["Fax Number", "Upload Documents", "Review", "Receipt"];
    return <Stepper activeStep={activeStepToIndex(props.activeStep)} alternativeLabel>
        {steps.map(label => (
            <Step key={label}>
                <StepLabel>{label}</StepLabel>
            </Step>
        ))}
    </Stepper>
}

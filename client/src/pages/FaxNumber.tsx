import React, {useState} from "react";
import Page from "../components/Page";
import {Box, Button, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {Phone} from "@material-ui/icons";
import {ProgressStepper} from "../components/ProgressStepper";
import {PageToDisplay} from "../config";
import {PhoneNumberType, PhoneNumberUtil} from "google-libphonenumber";
import NumberFormat from 'react-number-format';
import ReactGA from "react-ga";

const phoneUtil = PhoneNumberUtil.getInstance();

//copied from server, make sure to synchronize!
function isValidNumber(faxNumber: string): boolean {
    try {
        const number = phoneUtil.parse(faxNumber, 'US');
        return (phoneUtil.getNumberType(number) !== PhoneNumberType.PREMIUM_RATE && //block 900 numbers
            (phoneUtil.isValidNumberForRegion(number, 'US') ||
                phoneUtil.isValidNumberForRegion(number, 'CA')))
    } catch {
        return false;
    }
}

function NumberFormatCustom(props: {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { value: string } }) => void;
}) {
    //based on https://material-ui.com/components/text-fields/#integration-with-3rd-party-input-libraries
    const {inputRef, onChange, ...other} = props;
    return <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
            onChange({
                target: {
                    value: values.value,
                },
            });
        }}
        format="(###) ###-####"
        mask="_"
        isNumericString
        // prefix="+1"
    />
}

export default function FaxNumber(props: { faxNumber?: string, onPrevious: () => void, onNextFaxNumber: (faxNumber: string) => void }) {
    const [faxNumber, setFaxNumber] = useState(props.faxNumber || "");

    function onSubmit() {
        if (isValidNumber(faxNumber)) {
            props.onNextFaxNumber(faxNumber); //pass phone number to main component
        } else {
            alert("Fax number must be 10 digits long, and to a US/Canada destination.")
        }
    }

    const isError = faxNumber.length >= 10 && !isValidNumber(faxNumber);
    ReactGA.pageview('/faxNumber');
    return <Page>
        <ProgressStepper activeStep={PageToDisplay.FaxNumber}/>
        <Paper elevation={3}>
            <Box p={4}>
                <Typography variant="h4" component="h1" gutterBottom>Recipient Fax Number</Typography>
                <Typography variant="subtitle2" component="h2" gutterBottom>US/Canada fax numbers only</Typography>
                <Box my={2}>
                    <form onSubmit={e => {
                        e.preventDefault(); //stop enter key from refreshing the page
                        onSubmit();
                    }}>
                        <Grid container spacing={1} alignItems="flex-end">
                            <Grid item>
                                <Phone/>
                            </Grid>
                            <Grid item xs={11}>
                                <TextField required fullWidth autoFocus
                                           type="tel"
                                           placeholder="US/Canada fax number"
                                           label="Fax Number"
                                           value={faxNumber}
                                           error={isError}
                                           helperText={isError && "Phone number is invalid"}
                                           onChange={(e) => {
                                               setFaxNumber(e.target.value);
                                           }}
                                           InputProps={{
                                               inputComponent: NumberFormatCustom as any, //for masking
                                           }}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Box>
                <Box mt={4}>
                    <Box display="flex" justifyContent="end">
                        <Button color="secondary"
                                onClick={props.onPrevious}>
                            Back
                        </Button>
                        <Box ml={1}/>
                        <Button variant="contained"
                                color="primary"
                                onClick={onSubmit}>
                            Upload Documents
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    </Page>;
};

import {IFileWithMeta} from "react-dropzone-uploader/dist/Dropzone";
import {Document as PDFDocument, Page as PDFPage} from "react-pdf";
import {Box, Paper, Tooltip} from "@material-ui/core";
import React from "react";

export function HorizontalPagePreviews(props: { files: IFileWithMeta[] }) {
    return <Box m={2} style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {props.files.map((f, idx) => <PDFDocument file={f.file} key={idx}>
            <Box m={2}>
                <Paper elevation={3}>
                    <Tooltip title={f.file.name}>
                        <PDFPage width={110} pageNumber={1}/>
                    </Tooltip>
                </Paper>
            </Box>
        </PDFDocument>)}
    </Box>
}

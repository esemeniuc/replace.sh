import React, {useContext, useState} from "react";
import Page from "../components/Page";
import Dropzone, {formatBytes, IInputProps, ILayoutProps, IPreviewProps, StatusValue} from 'react-dropzone-uploader'
import {Cancel, CloudUpload, Delete, PictureAsPdf, Refresh} from '@material-ui/icons';
import {extname} from 'path'
import {
    Avatar,
    Box, Button,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Typography
} from "@material-ui/core";
import {IFileWithMeta} from "react-dropzone-uploader/dist/Dropzone";
import {HorizontalPagePreviews} from "../components/HorizontalPagePreviews";
import {ProgressStepper} from "../components/ProgressStepper";
import {MAX_UPLOAD_SIZE, PageToDisplay, UPLOAD_ENDPOINT} from "../config";
import ReactGA from "react-ga";

// import 'react-dropzone-uploader/dist/styles.css'

function UploadListItem(props: IPreviewProps) {
    //based on https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Preview.tsx
    const {
        className,
        style,
        fileWithMeta: {cancel, remove, restart},
        meta: {name = '', percent = 0, size = 0, status},
        isUpload,
        canCancel,
        canRemove,
        canRestart,
        extra: {minSizeBytes},
    } = props;
    const transactionId = useContext(UploadTransactionContext);

    function titleFormatter(status: StatusValue) {
        const title = name || '?';
        if (status === 'error_upload_params' || status === 'exception_upload' || status === 'error_upload') {
            return `${title} (upload failed)`
        } else if (status === 'aborted') {
            return `${title} (cancelled)`;
        }
        return title;
    }

    const title = titleFormatter(status);

    if (status === 'error_file_size' || status === 'error_validation') { //TODO: style this like list item
        return (  //error list item
            <div className={className} style={style}>
                <span className="dzu-previewFileNameError">{title}</span>
                {status === 'error_file_size' && <span>{size < minSizeBytes ? 'File too small' : 'File too big'}</span>}
                {status === 'error_validation' && <span>{"Only .pdf file supported"}</span>}
                {canRemove && <span className="dzu-previewButton" onClick={remove}><Delete/></span>}
            </div>
        )
    }

    function ListItemAction(props: { onClick: () => void, content: React.ReactNode }) {
        return <IconButton onClick={props.onClick}>
            {props.content}
        </IconButton>
    }

    ReactGA.event({
        category: 'User',
        action: 'Uploaded a file',
    });
    return <ListItem>
        <ListItemAvatar>
            <Avatar>
                <PictureAsPdf/>
            </Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={<div>
                {title}
                {isUpload && ['uploading', 'done', 'headers_received'].includes(status) &&
                <LinearProgress variant="determinate" style={{maxWidth: "98%"}}
                                value={status === 'done' || status === 'headers_received' ? 100 : percent}/>
                }
            </div>}
            secondary={formatBytes(size)}
        />
        <ListItemSecondaryAction>
            {status === 'uploading' && canCancel && <ListItemAction onClick={cancel} content={<Cancel/>}/>}

            {['error_upload_params', 'exception_upload', 'error_upload', 'aborted', 'ready'].includes(status) &&
            canRestart && <ListItemAction onClick={restart} content={<Refresh/>}/>}

            {
                status !== 'preparing' && status !== 'getting_upload_params' && status !== 'uploading' && canRemove &&
                <ListItemAction content={<Delete/>}
                                onClick={() => {
                                    //TODO: call mutation to delete file
                                    console.log("GOT IT", transactionId);
                                    remove()
                                }}/>
            }
        </ListItemSecondaryAction>
    </ListItem>
}

function CustomLayout(props: ILayoutProps) {
    //based on https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.tsx
    const {files, input, previews, extra: {maxFiles}, dropzoneProps: {style, ref, onDragEnter, onDragOver, onDragLeave, onDrop}} = props;
    const customDropzoneProps = {style, ref, onDragEnter, onDragOver, onDragLeave, onDrop};

    return <Paper elevation={2} variant="outlined" style={{borderStyle: "dashed", borderWidth: 4}}>
        <Box {...customDropzoneProps}>
            {//the list of uploaded files, not the pdf previews
                previews && previews.length > 0 && <List>{previews}</List>
            }
            {//the horizontal preview
                files.length > 0 && <Box my={2}>
                    <HorizontalPagePreviews files={files}/>
                </Box>
            }
            {//the upload icon and text
                files.length < maxFiles && input
            }
        </Box>
    </Paper>
}

function InputComponent(props: IInputProps) {
    //based on https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Input.tsx
    const {
        labelClassName,
        labelWithFilesClassName,
        style,
        className,
        labelStyle,
        labelWithFilesStyle,
        getFilesFromEvent,
        accept,
        multiple,
        disabled,
        content,
        withFilesContent,
        onFiles,
        files,
    } = props;

    return <Box className={className} style={{
        height: "100%",
        width: "100%", //fill parent so users can click anywhere
        ...style
    }}
    >
        <label className={files.length > 0 ? labelWithFilesClassName : labelClassName}
               style={files.length > 0 ? labelWithFilesStyle : labelStyle}>
            <Box display="flex" flexDirection="column" alignItems='center' p={4}>
                <CloudUpload color="primary" style={{fontSize: 64}}/>
                <Typography>
                    {files.length > 0 ? withFilesContent : content}
                </Typography>
                <input hidden
                       type="file"
                       accept={accept}
                       multiple={multiple}
                       disabled={disabled}
                       onChange={async e => {
                           const target = e.target;
                           const chosenFiles = await getFilesFromEvent(e);
                           onFiles(chosenFiles);
                           //@ts-ignore
                           target.value = null
                       }}
                />
            </Box>
        </label>
    </Box>
}

function Uploader(props: {
    onChangeStatus: (
        file: IFileWithMeta,
        status: StatusValue,
        allFiles: IFileWithMeta[],
    ) => void,
    uploadTransactionId: string,
}) {
    return <Dropzone
        getUploadParams={(fileWithMeta) => ({
            url: UPLOAD_ENDPOINT,
            fields: {uploadTransactionId: props.uploadTransactionId}
        })}
        onSubmit={(files, allFiles) => {
            console.log("submitted files: ", files.map(f => f.meta));
            allFiles.forEach(f => f.remove()) //clean up list after submission
        }}
        maxSizeBytes={MAX_UPLOAD_SIZE}
        accept={"application/pdf"} //forces the web browser's file selector to only show pdf files
        validate={fileWithMeta => extname(fileWithMeta.file.name.toLowerCase()) !== '.pdf'} //valid files return false
        InputComponent={InputComponent}
        LayoutComponent={CustomLayout}
        PreviewComponent={UploadListItem}
        SubmitButtonComponent={() => null}
        onChangeStatus={props.onChangeStatus}
        inputContent={(files, extra) => (extra.reject ? 'PDF files only' : "Drag and drop files here or click to upload")}
        styles={{
            dropzoneActive: {backgroundColor: "#DEEBFF", borderColor: "#2484FF"},
            dropzoneReject: {borderColor: 'red', backgroundColor: '#DAA'},
            inputLabel: (files, extra) => (extra.reject ? {color: '#801336'} : {}),
        }}
    />
}

const UploadTransactionContext = React.createContext("");

export default function Document(props: {
    onPrevious: () => void,
    onNextDocument: (documents: IFileWithMeta[]) => void,
    uploadTransactionId: string,
}) {
    const [isReadyToContinue, setIsReadyToContinue] = useState<Boolean>(false);
    const [allFiles, setAllFiles] = useState<IFileWithMeta[]>([]);

    function handleOnChangeStatus(
        file: IFileWithMeta,
        status: StatusValue,
        files: IFileWithMeta[],
    ) {
        const errorOrUploading = files.some(f => ['preparing', 'getting_upload_params', 'uploading', 'error_file_size', 'error_validation'].includes(f.meta.status));
        const someFilesFinished = files.some(f => ['headers_received', 'done'].includes(f.meta.status));
        setIsReadyToContinue(!errorOrUploading && someFilesFinished);
        setAllFiles(files.filter(f => ['headers_received', 'done'].includes(f.meta.status)))
    }

    ReactGA.pageview('/document');
    return <Page>
        <ProgressStepper activeStep={PageToDisplay.Document}/>
        <Paper elevation={3}>
            <Box p={4}>
                <Typography variant="h4" component="h1" gutterBottom>Upload Documents</Typography>

                <UploadTransactionContext.Provider value={props.uploadTransactionId}>
                    <Uploader onChangeStatus={handleOnChangeStatus}
                              uploadTransactionId={props.uploadTransactionId}/>
                    <Box mt={4}>
                        <Box display="flex" justifyContent="end">
                            <Button color="secondary"
                                    onClick={props.onPrevious}>
                                Back
                            </Button>
                            <Box ml={1}/>
                            <Button variant="contained"
                                    color="primary"
                                    onClick={() => props.onNextDocument(allFiles)}
                                disabled={!isReadyToContinue}>

                                Review
                            </Button>
                        </Box>
                    </Box>
                </UploadTransactionContext.Provider>
            </Box>
        </Paper>
    </Page>;
}

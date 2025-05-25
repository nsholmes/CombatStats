import { Box, Button, Typography, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ChangeEvent, useRef, useState } from "react";
import { connect } from "react-redux";
import { uploadFile } from "../Features/fileUploadAction";
import { FileUploadProps } from "../Models";

function mapDispatchToProps(dispatch: any) {
  return {
    uploadIKFEventFile: (file: File) => { dispatch(uploadFile(file)) }
  }
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function UploadEvent(props: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File>();

  /**
   * Event Handlers
   */
  const handleUploadClicked = () => {
    inputRef.current?.click()
  }
  const handleFileChange = (ev: ChangeEvent<HTMLInputElement>) => {
    console.log("HAS FILES: ", ev.target.files)
    if (ev.target.files) {
      setFile(ev.target.files[0]);
      props.uploadIKFEventFile(ev.target.files[0]);
    }
  }
  return (
    <>
      <Typography variant="h6">Upload New Event File</Typography>
      <Button component="label" variant="contained" onClick={handleUploadClicked} startIcon={<CloudUploadIcon />}>
        Upload file
      </Button>
      <VisuallyHiddenInput ref={inputRef} type="file" onChange={handleFileChange} />
      <Box>
        {file && `${file.name} - ${file.type}`}
      </Box>

    </>
  );
}
export default connect(null, mapDispatchToProps)(UploadEvent);
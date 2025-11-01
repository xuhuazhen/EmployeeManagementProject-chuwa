import { useState } from "react"; 
import { useDispatch } from "react-redux";  
import UploadButton from "../Button/UploadButton";
import { message, Progress, Button } from "antd";
import AppButton from "../Button/AppButton";
import style from './visaStatus.module.css';
import axios from "axios";
import { updateDoc } from "../../slices/employeeSlice";

const FileUploader = ({ tag, setFile, setFileStatus }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);  
  const dispatch = useDispatch();

  const handleUpload = async () => {
    if (!selectedFile) return;
    // const file = event.target.files[0];
    setUploading(true); // Show progress bar when upload starts
    setProgress(0); // Reset progress to 0

    const formData = new FormData();  
    formData.append("file", selectedFile);
    formData.append("tag", tag);  
    
    console.log(selectedFile, formData.entries())
    try {
       const uploadResponse = await axios.post('http://localhost:3000/api/file/upload', formData, {
         headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      setProgress(100); // Set progress to 100 on successful upload

      dispatch(updateDoc(uploadResponse.data.data));
      const nextStep = uploadResponse.data.data.nextStep;
      setFile(nextStep.split("-")[0]);
      setFileStatus(nextStep.split("-")[1]);
      
      message.success('File upload successful!');
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      // Hide progress bar after upload completes/fails
    }
  };

  return ( 
    <>
      <UploadButton onFileSelect={setSelectedFile} type={"doc"}/>  
      {selectedFile && (
        <>
          <AppButton className={style.appButton}
            type="primary"
            onClick={handleUpload}
            loading={uploading} 
          >
            Confirm Upload
          </AppButton>
          {uploading && <Progress percent={progress} style={{ marginTop: 8 }} />}
        </>
      )}
    </>
  );
};

export default FileUploader;

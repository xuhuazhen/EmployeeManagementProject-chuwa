import { useState } from "react"; 
import { useDispatch } from "react-redux"; 
import api from "../../api/axiosConfig";
import UploadButton from "../Button/UploadButton";

const FileUploader = ({ tag, setFile, setFileStatus }) => {
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const dispatch = useDispatch();

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return; // Exit if no file is selected

    setShowProgress(true); // Show progress bar when upload starts
    setProgress(0); // Reset progress to 0

    const formData = new FormData();
    formData.append("document", file);
    formData.append("tag", tag); 

    try {
      const uploadResponse = await api.post('/document', formData, {
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

      // Since you're already in an async function, you can directly await this call

      const nextStep = uploadResponse.data.data.nextStep;
      //dispatch(updatefile)
      setFile(nextStep.split("-")[0]);
      setFileStatus(nextStep.split("-")[1]);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setShowProgress(false);
      // Hide progress bar after upload completes/fails
    }
  };

  return (
    <div>
      <UploadButton onChange={handleUpload} />
      {showProgress && (
        <LinearProgress variant="determinate" value={progress} />
      )}
    </div>
  );
};

export default FileUploader;

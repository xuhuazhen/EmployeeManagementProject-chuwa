// import FileUploader from "./FileUploader.jsx"; 
import { Row, Col, Typography, Button, Space } from "antd";
import styles from "./visaStatus.module.css";
import DownloadButton from "../Button/DownloadButton/DownloadButton";
import FileUploader from "./FileUploader";
const { Text, Title } = Typography; 
 
const fileMapping = {
  ead: "Application",
  i983: "EAD Document",
  i20: "I-983 Document",
};
const SAMPLE_FILE_URL = "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";

const VisaStatus = ({ file, status, feedback, setFile, setFileStatus }) => {
    
  return (
    <div className={styles.container}>
        <Title level={3} className={styles.title}>
          Visa Status
        </Title>

        {status === "pending" && (
          <Text className={styles.text}>
            Waiting for HR to approve your <b>{file.toUpperCase()}</b> Document
          </Text>
        )}

        {status === "reject" && (
          <>
            <Text className={styles.text}>
              Your <b>{file}</b> is rejected, please refer to the feedback below:
            </Text>
            <Text className={styles.feedback}>{feedback}</Text>
            <Text className={styles.text}>
              Please reupload your <b>{file}</b>
            </Text>
            <FileUploader setFile={setFile} setFileStatus={setFileStatus} tag={file} />
          </>
        )}

        {status === "waiting" && (
          <>
            <Text className={styles.text}>
              Your <b>{fileMapping[file]}</b> document has been approved
            </Text>

            {file === "i983" && (
              <>
                <Text className={styles.text}>Please download and fill out the i-983 form:</Text>
                <Space className={styles.downloadButtons}>  
                  <DownloadButton url={SAMPLE_FILE_URL}>Download Empty Template</DownloadButton>
                  <DownloadButton url={SAMPLE_FILE_URL}>Download Sample Template</DownloadButton>
                </Space>
              </>
            )}

            <Text className={styles.text}>
              Please upload your <b>{file.toUpperCase()}</b>
            </Text>
            <FileUploader setFile={setFile} setFileStatus={setFileStatus} tag={file} />
          </>
        )}

        {status === "done" && file === "all" && (
          <Text className={styles.text}>All documents have been approved!</Text>
        )}
    </div>
  );
};


export default VisaStatus;

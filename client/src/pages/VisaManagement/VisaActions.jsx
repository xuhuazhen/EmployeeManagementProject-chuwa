import { useState } from "react";
import { Space, message } from "antd";
import { useDispatch } from "react-redux";
import {
  sendNotification,
  updateDocumentStatus,
} from "../../thunks/hrEmployeesThunk";
import DocumentReviewModal from "../../components/Modal/DocumentReviewModal";
import AppButton from "../../components/Button/AppButton";
import { DownloadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import styles from "./VisaManagement.module.css";

const VisaActionCell = ({ employee, mode }) => {
  const dispatch = useDispatch();
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  // Pending documents for approval
  const pendingDocs =
    employee.documents?.filter((doc) => doc.status === "pending") || [];

  // Open document modal
  const openPreview = (doc) => {
    setPreviewDoc(doc);
    setIsModalVisible(true);
  };

  const closePreview = () => {
    setPreviewDoc(null);
    setIsModalVisible(false);
  };

  // Approve document
  const handleApprove = async (doc) => {
    try {
      await dispatch(
        updateDocumentStatus({
          docId: doc._id,
          status: "approved",
          feedback: "",
        })
      );
      message.success(`${doc.title} approved`);
      closePreview();
    } catch (err) {
      message.error("Failed to approve document", err);
    }
  };

  // Reject document
  const handleReject = async (doc, feedback) => {
    try {
      await dispatch(
        updateDocumentStatus({
          docId: doc._id,
          status: "rejected",
          feedback,
        })
      );
      message.warning(`${doc.title} rejected`);
      closePreview();
    } catch (err) {
      message.error("Failed to reject document", err);
    }
  };

  // Send notification for next step
  const handleSendNotification = async () => {
    try {
      const resultAction = await dispatch(sendNotification(employee._id));
      message.success(resultAction.message);
      setNotificationSent(true);
    } catch (err) {
      message.error(err.message || "Failed to send notification");
    }
  };

  // All documents view
  if (mode === "all") {
    const handleDownload = async (url, filename) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
      } catch (err) {
        console.error("Download failed", err);
      }
    };
    return (
      <Space direction="vertical">
        {employee.documents?.length
          ? employee.documents.map((doc) => (
              <Space key={doc._id}>
                <Link type="link" onClick={() => openPreview(doc)}>
                  {doc.tag}
                </Link>
                <DownloadOutlined
                  onClick={() => handleDownload(doc.url, doc.title)}
                  style={{ cursor: "pointer" }}
                />
              </Space>
            ))
          : "N/A"}
        <DocumentReviewModal
          visible={isModalVisible}
          document={previewDoc}
          onClose={closePreview}
        />
      </Space>
    );
  }

  // In-progress view
  return (
    <Space direction="horizontal">
      {/* Pending documents */}
      {pendingDocs.map((doc) => (
        <AppButton
          className={styles.buttonView}
          key={doc._id}
          onClick={() => openPreview(doc)}
        >
          {'View ' + doc.tag.toUpperCase()}
        </AppButton>
      ))}

      {/* Send notification if next step requires submission */}
      {( employee.nextStep?.split("-")[0] !== "application"
        && (employee.nextStep?.includes("waiting") || employee.nextStep?.includes("reject")))
         && (
        <AppButton
          className={styles.buttonSend}
          onClick={handleSendNotification}
          disabled={notificationSent}
        >
          {notificationSent ? "Notification Sent" : "Send Notification"}
        </AppButton>
      )}
      <DocumentReviewModal
        visible={isModalVisible}
        document={previewDoc}
        onClose={closePreview}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Space>
  );
};

export default VisaActionCell;

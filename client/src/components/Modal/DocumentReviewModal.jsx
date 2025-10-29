import { useState } from "react";
import { Modal, Input, message, Space } from "antd";
import AppButton from "../Button/AppButton";
import styles from "./DocumentReviewModal.module.css";

const { TextArea } = Input;

const DocumentReviewModal = ({
  visible,
  document,
  onClose,
  onApprove,
  onReject,
  onSendFeedback,
  context,
}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [feedback, setFeedback] = useState("");

  if (!document) return null;

  const handleApproveClick = () => {
    onApprove?.(document);
    message.success(`${document.title} approved`);
    onClose();
  };

  const handleRejectClick = () => setIsRejecting(true);

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      message.warning("Please provide feedback before sending.");
      return;
    }
    onReject?.(document, feedback);
    onSendFeedback?.(document, feedback);
    message.info("Feedback sent to employee.");
    setFeedback("");
    setIsRejecting(false);
    onClose();
  };

  const handleDownload = () => {
    if (!document?.url) {
      message.error("No document available to download.");
      return;
    }

    const link = document.createElement("a");
    link.href = document.url;
    link.download = document.title || "document.pdf";
    link.target = "_blank";
    link.click();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={document.title || "Document Review"}
      footer={null}
      width={800}
      centered
    >
      {/* Document preview */}
      {document.url ? (
        <iframe
          src={document.url}
          title={document.title}
          width="100%"
          height="500px"
          style={{
            border: "1px solid #eee",
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
      ) : (
        <p>No document available for preview</p>
      )}

      {/* Action buttons */}
      {!isRejecting && (
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* Show Download button only in the “all” context */}
          {context === "all" && (
            <AppButton className={styles.buttonAccept} onClick={handleDownload}>
              Download
            </AppButton>
          )}

          {/* Show Approve/Reject buttons for HR review tabs */}
          {context === "in progress" && (
            <>
              <AppButton
                className={styles.buttonAccept}
                onClick={handleApproveClick}
              >
                Approve
              </AppButton>
              <AppButton
                className={styles.buttonReject}
                onClick={handleRejectClick}
              >
                Reject
              </AppButton>
            </>
          )}
        </Space>
      )}

      {/* Rejecting state */}
      {isRejecting && (
        <div style={{ marginTop: 16 }}>
          <TextArea
            rows={4}
            placeholder="Enter feedback for rejection..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 10,
              gap: 8,
            }}
          >
            <AppButton
              className={styles.buttonCancel}
              onClick={() => setIsRejecting(false)}
            >
              Cancel
            </AppButton>
            <AppButton onClick={handleSendFeedback}>
              Send Notification
            </AppButton>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DocumentReviewModal;

import { Modal, Typography, Input, Space } from "antd";
import { useState } from "react";
import AppButton from "../Button/AppButton";
import styles from "./DocumentReviewModal.module.css";

const { Text } = Typography;
const { TextArea } = Input;

const DocumentReviewModal = ({
  visible,
  document,
  onClose,
  onApprove,
  onReject,
}) => {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [feedback, setFeedback] = useState("");

  if (!document) return null;

  const handleApprove = () => {
    if (onApprove) {
      onApprove(document);
      setIsFeedbackVisible(false);
    }
  };

  const handleRejectClick = () => {
    if (!onReject) return;

    if (!isFeedbackVisible) {
      setIsFeedbackVisible(true);
      return;
    }

    if (!feedback.trim()) return;

    onReject(document, feedback);
    setFeedback("");
    setIsFeedbackVisible(false);
  };

  const handleCancelReject = () => {
    setIsFeedbackVisible(false);
    setFeedback("");
  };
  // Conditionally render footer only if actions exist
  const footer =
    onApprove || onReject ? (
      <Space>
        {!isFeedbackVisible && onApprove && (
          <AppButton onClick={handleApprove}>Approve</AppButton>
        )}

        {!isFeedbackVisible && onReject && (
          <AppButton
            className={styles.buttonReject}
            onClick={handleRejectClick}
          >
            Reject
          </AppButton>
        )}

        {isFeedbackVisible && (
          <>
            <AppButton
              className={styles.buttonApprove}
              onClick={handleRejectClick}
            >
              Submit Rejection
            </AppButton>
            <AppButton
              className={styles.buttonReject}
              onClick={handleCancelReject}
            >
              Cancel
            </AppButton>
          </>
        )}
      </Space>
    ) : null;

  return (
    <Modal
      title={`Review Document: ${document.title}`}
      open={visible}
      onCancel={() => {
        setIsFeedbackVisible(false);
        setFeedback("");
        onClose();
      }}
      footer={footer}
      width={600}
    >
      <div style={{ marginBottom: 16 }}>
        <iframe
          src={document.url}
          title={document.title}
          width="100%"
          height="400px"
          style={{ border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {isFeedbackVisible && onReject && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Feedback (required for rejection):</Text>
          <TextArea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback here..."
            rows={4}
          />
        </div>
      )}
    </Modal>
  );
};

export default DocumentReviewModal;

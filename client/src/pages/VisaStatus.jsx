// client/src/pages/VisaStatus.jsx
import { useEffect, useState } from "react";
import LoadingSpin from "../components/LoadingSpin/loadingSpin";
import { Alert } from "antd";
import MainLayout from "../components/mainLayout/mainLayout";
import VisaStatus from "../components/VisaStatusBox/visaStatusBox";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const VisaStatusPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState("");
  const [fileStatus, setFileStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const location = useLocation();
  const user = useSelector((state) => state.employee.employee);

  useEffect(() => {
    setError(null);
    setIsLoading(true);

    const nextStep = user?.nextStep || "";
    if (nextStep && nextStep.includes("-")) {
      const [f, s] = nextStep.split("-");
      setFile(f);
      setFileStatus(s);
    } else {
      setFile("");
      setFileStatus("");
    }
    setFeedback(user?.feedback || "");
    setIsLoading(false);
  }, [location.pathname, user?.nextStep, user?.feedback]);

  if (isLoading) return <LoadingSpin />;

  return (
    <MainLayout>
      <div>
        {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
        <VisaStatus
          file={file}
          status={fileStatus}
          feedback={feedback}
          setFile={setFile}
          setFileStatus={setFileStatus}
        />
      </div>
    </MainLayout>
  );
};

export default VisaStatusPage;

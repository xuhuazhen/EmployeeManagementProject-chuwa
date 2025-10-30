
import { useEffect, useState } from "react"; 
import LoadingSpin from "../components/LoadingSpin/loadingSpin";
import api from "../api/axiosConfig";
import { Row, Col, Typography, Alert } from "antd";
import MainLayout from "../components/mainLayout/mainLayout";
import VisaStatus from "../components/VisaStatusBox/visaStatusBox";
import { useLocation } from "react-router-dom";

const VisaStatusPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState("");
    const [fileStatus, setFileStatus] = useState("");
    const [feedback, setFeedback] = useState("");
    const location = useLocation();
 
    useEffect(() => {
        setError(null);
        setIsLoading(true);
        async function getNextStep() {
            try {
                const res = await api.get("/user/nextstep", {
                    withCredentials: true,
                });
                console.log("get user nextstep:", res.data)
                const nextStep = res.data.nextStep;
                setFile(nextStep.split("-")[0]);
                setFileStatus(nextStep.split("-")[1]);
                setFeedback(res.data.feedback || "");
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        getNextStep();
    }, [location.pathname]);

    if (isLoading) {
        return <LoadingSpin />;
    }

    return (
        <MainLayout>
            <Row
                justify="center"
                align="middle"
                style={{ height: "80vh", textAlign: "center" }}
            >
                <Col>
                {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
                    <VisaStatus
                        file={file}
                        status={'reject'}
                        feedback={'eee'}
                        setFile={setFile}
                        setFileStatus={setFileStatus}
                    />
                </Col>
            </Row>
        </MainLayout>
  );

}

export default VisaStatusPage;
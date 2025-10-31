
import { useEffect, useState } from "react"; 
import LoadingSpin from "../components/LoadingSpin/loadingSpin";
import api from "../api/axiosConfig";
import { Row, Col, Typography, Alert } from "antd";
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
    const user = useSelector(state => state.employee.employee);
 
    useEffect(() => {
        setError(null);
        setIsLoading(true); 
        const nextStep = user.nextStep;
        setFile(nextStep.split("-")[0]);
        setFileStatus(nextStep.split("-")[1]);
        setFeedback(user.feedback || "");  
        setIsLoading(false);
        // async function getNextStep() {
        //     try {
        //         const res = await api.get("/user/nextstep", {
        //             withCredentials: true,
        //         });
        //         console.log("get user nextstep:", res.data)
        //        
        //     } catch (err) {
        //         setError(err.message);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }
        // getNextStep();
    }, [location.pathname]);

    if (isLoading) {
        return <LoadingSpin />;
    }

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

}

export default VisaStatusPage;
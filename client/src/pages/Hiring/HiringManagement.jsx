import React, { useEffect, useState } from "react";
import axios from "axios";
import AppTable from "../../components/Table/AppTable";
import MainLayout from "../../components/mainLayout/mainLayout";
import styles from "./HiringManagement.module.css";
import { Flex, Typography, Tabs, Space, message, Input } from "antd";
import { formatProfile } from "../../utils/formatProfile";
import dayjs from "dayjs";
import DocumentReviewModal from "../../components/Modal/DocumentReviewModal";
import AppButton from "../../components/Button/AppButton";
import api from "../../api/axiosConfig";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const HiringManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email history");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const [onboardingTab, setOnboardingTab] = useState("pending"); // 判断applicaiton status

  const { Title, Text } = Typography;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/hr/profiles", {withCredentials: true});
        const profiles = res.data.data.map(formatProfile);

        const getHistory = await api.get('/hr/history');
        console.log(getHistory.data)
        setHistory(getHistory.data.data);

        setProfiles(profiles);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleClick = useCallback(async (values) => {
    try {
      const res = await api.post("hr/signup", values, {
        withCredentials: true,
      });

      if (res.data.status === "success") {
        message.success("Email send succed!");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Unable to send reset link. Please try again later.");
      }
    }
  }, []);

  const openPreview = (doc) => {
    setPreviewDoc(doc);
    setIsModalVisible(true);
  };

  const closePreview = () => {
    setPreviewDoc(null);
    setIsModalVisible(false);
  };

  const handleApprove = async (doc) => {
    try {
      await axios.put(`/api/hr/documents/${doc._id}`, { status: "approved" });
      message.success(`${doc.title} approved`);
      setProfiles((prev) =>
        prev.map((p) => ({
          ...p,
          documents: p.documents?.map((d) =>
            d._id === doc._id ? { ...d, status: "approved" } : d
          ),
        }))
      );
      closePreview();
    } catch (err) {
      console.error(err);
      message.error("Failed to approve document");
    }
  };

  const handleReject = async (doc) => {
    try {
      await axios.put(`/api/hr/documents/${doc._id}`, { status: "rejected" });
      message.warning(`${doc.title} rejected`);
      setProfiles((prev) =>
        prev.map((p) => ({
          ...p,
          documents: p.documents?.map((d) =>
            d._id === doc._id ? { ...d, status: "rejected" } : d
          ),
        }))
      );
      closePreview();
    } catch (err) {
      console.error(err);
      message.error("Failed to reject document");
    }
  };

  const filteredProfiles =
    activeTab === "email history"
      ? history
      : profiles
          .filter((p) => p.application?.status === onboardingTab) //data should match tab key

  const columns = 
    activeTab !== "email history" ? 
      [
        {
          title: "Name",
          dataIndex: ["name"],
          key: "name",
        },
        {
          title: "Title",
          dataIndex: ["employment", "visaTitle"],
          key: "visaTitle",
        },
        {
          title: "Start Date",
          dataIndex: ["employment", "startDate"],
          key: "startDate",
          render: (date) => (date ? dayjs(date).format("MMM D, YYYY") : "—"),
        },
        {
          title: "End Date",
          dataIndex: ["employment", "endDate"],
          key: "endDate",
          render: (date) => (date ? dayjs(date).format("MMM D, YYYY") : "—"),
        },
        {
          title: "Remaining",
          dataIndex: ["employment", "endDate"],
          key: "endDate",
          render: (date) => {
            if (!date) return "—";
            const daysLeft = dayjs(date).diff(dayjs(), "day");
            if (daysLeft < 0) return <span style={{ color: "red" }}>Expired</span>;
            if (daysLeft < 30)
              return <span style={{ color: "orange" }}>{daysLeft} days</span>;
            return <span style={{ color: "green" }}>{daysLeft} days</span>;
          },
        },
        {
          title: "Next Step",
          dataIndex: "nextStep",
          key: "nextStep",
          render: (nextStep) => {
            switch (nextStep) {
              case "application-pending":
                return "Need HR approval";
              case "application-reject":
                return "Waiting for employee to resubmit";
              case "ead-waiting":
                return "Waiting for employee to submit EAD";
              case "ead-pending":
                return "Need HR approval of EAD";
              case "ead-reject":
                return "Waiting for employee to resubmit EAD";
              case "i20-waiting":
                return "Waiting for employee to submit I-20";
              case "i20-pending":
                return "Need HR approval of I-20";
              case "i20-reject":
                return "Waiting for employee to resubmit I-20";
              case "i983-waiting":
                return "Waiting for employee to submit I-983";
              case "i983-pending":
                return "Need HR approval of I-983";
              case "i983-reject":
                return "Waiting for employee to resubmit I-983";
              case "all-done":
                return "All steps completed";
              default:
                return nextStep || "—";
            }
          },
        },
        {
          title: "Action",
          key: "action", 
          render: (_, record) => ( 
            <AppButton
              size="small"
              className={styles.buttonView}
              key={record._id}
              onClick={() => navigate(`/hr/application/${record._id}`,
                { state: { status: onboardingTab} }
              )}
            >
              View Application
            </AppButton>  
          ),
        },
      ]
    :
      [
        {
          title: "Name",
          dataIndex: ["personName"],
          key: "name" 
        },
        {
          title: "Email",
          dataIndex: ["email"],
          key: "email",
        },
        {
          title: "Registrion Link",
          dataIndex: ["link"],
          key: "link",
          render: (link) =>
            link ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link.length > 30 ? link.slice(0, 30) + "..." : link}
              </a>
            ) : (
              "—"
            ),
        },
        {
          title: "Status",
          dataIndex: ["status"],
          key: "status",  
        }, 
      ];

  const items = [
    {
      key: "email history",
      label: "Email History",
    },
    {
      key: "onboarding",
      label: "Onboarding Applications",
    },
  ];

  const RegistrantionToken = React.memo(({ handleClick }) => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");

    const validateInputs = () => {
      if (!email.trim() || !fullName.trim()) {
        message.warning("Please fill in both email and name.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        message.error("Please enter a valid email address.");
        return false;
      }
      return true;
    };

    const onSend = () => {
      if (!validateInputs()) return;
      handleClick({ email, fullName });
      setEmail("");
      setFullName("");
    };
    return (
      <div className={styles.container}>
        <Text className={styles.label}>Send registration</Text>
        <Input
          className={styles.input}
          placeholder="Enter email..."
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className={styles.input}
          placeholder="Enter full name..."
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <AppButton className={styles.button} onClick={onSend}>
          Send
        </AppButton>
      </div>
    );
  });

  return (
    <MainLayout>
      <Flex className={styles.profileContainer}>
        <Title level={4} className={styles.title}>
          Hiring Management
        </Title>
        <Flex className={styles.topBar}>
          <Text className={styles.total}>
            <strong>Total:</strong> {filteredProfiles.length} Employees
          </Text>
          <Tabs
            className={styles.tab}
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
          />
        </Flex>
        {activeTab === "email history" && (
          <RegistrantionToken handleClick={handleClick} />
        )}

        {activeTab === "onboarding" && (
          <Tabs
            className={styles.subTabs}
            activeKey={onboardingTab}
            onChange={setOnboardingTab}
            items={[
              { key: "pending", label: "Pending" },
              { key: "rejected", label: "Rejected" },
              { key: "approved", label: "Approved" },
            ]}
          />
        )}
        <AppTable columns={columns} data={filteredProfiles} loading={loading} />
      </Flex>
      <DocumentReviewModal
        visible={isModalVisible}
        document={previewDoc}
        onClose={closePreview}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </MainLayout>
  );
};
export default HiringManagement;

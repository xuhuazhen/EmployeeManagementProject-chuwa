import { useEffect, useState } from "react";
import axios from "axios";
import AppTable from "../../components/Table/AppTable";
import MainLayout from "../../components/mainLayout/mainLayout";
import styles from "./VisaManagement.module.css";
import { Flex, Typography, Tabs, Space, message } from "antd";
import { formatProfile } from "../../utils/formatProfile";
import dayjs from "dayjs";
import DocumentReviewModal from "../../components/Modal/DocumentReviewModal";
import AppButton from "../../components/Button/AppButton";
import SearchBar from "../../components/SearchBar/SearchBar";

const VisaManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("in progress");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { Title, Text } = Typography;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/hr/profiles");
        const profiles = res.data.data.map(formatProfile);
        setProfiles(profiles);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
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
    activeTab === "in progress"
      ? profiles
          .filter((p) => p.nextStep !== "all-done") //in progress
          .map((p) => ({
            ...p,
            //only keep documents pending approval
            documents:
              p.documents?.filter((doc) => doc.status === "pending") || [],
          }))
      : profiles
          .filter((p) => p.employment?.isF1 !== false) //exclude not F1
          .map((p) => ({
            ...p,
            documents:
              p.documents?.filter((doc) => doc.status === "approved") || [],
          }));

  const columns = [
    {
      title: "Name",
      dataIndex: ["name"],
      key: "name",
      render: (name) => <a>{name}</a>,
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
      dataIndex: ["nextStep"],
      key: "nextStep",
    },
    {
      title: activeTab === "in progress" ? "Action" : "Documents",
      key: "action",
      render: (_, record) =>
        activeTab === "in progress" ? (
          <Space size="middle">
            {record.documents?.map((doc) => (
              <AppButton
                size="small"
                className={styles.buttonView}
                key={doc._id}
                onClick={() => openPreview(doc)}
              >
                View
              </AppButton>
            ))}
            <AppButton size="small" className={styles.buttonSend}>
              Send Notification
            </AppButton>
          </Space>
        ) : (
          <Space size="middle">
            {record.documents?.length > 0 ? ( //Pending documents
              record.documents.map((doc) => (
                <a
                  key={doc._id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.title}
                </a>
              ))
            ) : (
              <span>N/A</span>
            )}
            <a>Send notification</a>
          </Space>
        ),
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       {record.documents?.length > 0 ? ( //Pending documents
    //         record.documents.map((doc) => (
    //           <a
    //             key={doc._id}
    //             href={doc.url}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //           >
    //             {doc.title}
    //           </a>
    //         ))
    //       ) : (
    //         <span>N/A</span>
    //       )}
    //       <a>Send notification</a>
    //     </Space>
    //   ),
    // },
  ];

  const items = [
    {
      key: "in progress",
      label: "In Progress",
    },
    {
      key: "all",
      label: "All",
    },
  ];

  return (
    <MainLayout>
      <Flex className={styles.profileContainer}>
        <Title level={4} className={styles.title}>
          Visa Status Management
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
        {activeTab === "all" && <SearchBar />}
        <AppTable columns={columns} data={filteredProfiles} loading={loading} />
      </Flex>
      <DocumentReviewModal
        visible={isModalVisible}
        document={previewDoc}
        onClose={closePreview}
        onApprove={handleApprove}
        onReject={handleReject}
        context={activeTab}
      />
    </MainLayout>
  );
};

export default VisaManagement;

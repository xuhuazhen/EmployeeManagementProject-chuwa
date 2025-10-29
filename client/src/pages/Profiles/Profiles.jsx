import { useEffect, useState } from "react";
import axios from "axios";
import AppTable from "../../components/Table/AppTable";
import MainLayout from "../../components/mainLayout/mainLayout";
import styles from "./Profiles.module.css";
import { Flex, Typography } from "antd";
import SearchBar from "../../components/SearchBar/SearchBar";
import { formatProfile } from "../../utils/formatProfile";

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const columns = [
    {
      title: "Name",
      dataIndex: ["name"],
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "SSN",
      dataIndex: ["personalInfo", "ssn"],
      key: "ssn",
    },
    {
      title: "Work Authorization",
      dataIndex: ["employment", "visaTitle"],
      key: "visaTitle",
    },
    {
      title: "Phone Number",
      dataIndex: ["contactInfo", "cellPhoneNumber"],
      key: "cellPhoneNumber",
    },
    {
      title: "Email",
      dataIndex: ["email"],
      key: "email",
    },
  ];

  return (
    <MainLayout>
      <Flex className={styles.profileContainer}>
        <Title level={4} className={styles.title}>
          Employee Profiles
        </Title>
        <Text className={styles.total}>
          <strong>Total:</strong> {profiles.length} Employees
        </Text>
        <SearchBar className={styles.search} />
        <AppTable columns={columns} data={profiles} loading={loading} />
      </Flex>
    </MainLayout>
  );
};

export default Profiles;

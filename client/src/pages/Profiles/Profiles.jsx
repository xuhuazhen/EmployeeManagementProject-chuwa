import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEmployees } from "../../thunks/hrEmployeesThunk";
import SearchBar from "../../components/SearchBar/SearchBar";
import MainLayout from "../../components/mainLayout/mainLayout";
import { Typography, Flex } from "antd";
import AppTable from "../../components/Table/AppTable";
import styles from "./Profiles.module.css";
import { setSearch } from "../../slices/hrEmployeesSlice";

const { Title, Text } = Typography;

const Profiles = () => {
  const dispatch = useDispatch();
  const {
    all: employees,
    loading,
    error,
    search,
  } = useSelector((store) => store.hrEmployees);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllEmployees({ search: search }));
  }, [dispatch, search]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => navigate(`/hr/profiles/${record._id}`)}>{text}</a>
      ),
    },
    { title: "SSN", dataIndex: ["personalInfo", "ssn"], key: "ssn" },
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
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  console.log(employees);

  return (
    <MainLayout>
      <Flex className={styles.profileContainer}>
        <Title level={4} className={styles.title}>
          Employee Profiles
        </Title>
        <Text className={styles.total}>
          <strong>Total:</strong> {employees.length} Employees
        </Text>

        <SearchBar onSearch={(value) => dispatch(setSearch(value))} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <AppTable columns={columns} data={employees} loading={loading} />
      </Flex>
    </MainLayout>
  );
};

export default Profiles;

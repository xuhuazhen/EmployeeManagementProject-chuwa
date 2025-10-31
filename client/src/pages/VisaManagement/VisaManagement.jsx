import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Flex, Tabs } from "antd";
import { setSearch } from "../../slices/hrEmployeesSlice";
import SearchBar from "../../components/SearchBar/SearchBar";
import MainLayout from "../../components/mainLayout/mainLayout";
import styles from "./VisaManagement.module.css";
import {
  fetchInProgressEmployees,
  fetchVisaEmployees,
} from "../../thunks/hrEmployeesThunk";
import VisaTable from "./VisaTable";

const { Title, Text } = Typography;

const VisaManagement = () => {
  const dispatch = useDispatch();
  const { inProgress, visa, loading, search } = useSelector(
    (store) => store.hrEmployees
  );

  const [activeTab, setActiveTab] = useState("in-progress");

  // Determine which data to display
  const displayedEmployees = activeTab === "in-progress" ? inProgress : visa;

  const totalInProgress = inProgress.length;
  const totalAll = visa.length;

  // Fetch employees whenever activeTab or search changes
  useEffect(() => {
    const delay = setTimeout(() => {
      if (activeTab === "in-progress") {
        dispatch(fetchInProgressEmployees({ search }));
      } else if (activeTab === "all") {
        dispatch(fetchVisaEmployees({ search }));
      }
    }, 300); // debounce search

    return () => clearTimeout(delay);
  }, [activeTab, search, dispatch]);

  console.log(displayedEmployees);

  return (
    <MainLayout>
      <Flex className={styles.profileContainer} direction="column">
        <Title level={4} className={styles.title}>
          Visa Status Management
        </Title>

        <Flex className={styles.topBar}>
          <Text className={styles.total}>
            <strong>Total:</strong>{" "}
            {activeTab === "in-progress" ? totalInProgress : totalAll} Employees
          </Text>

          {activeTab === "all" && (
            <div className={styles.searchWrapper}>
              <SearchBar onSearch={(value) => dispatch(setSearch(value))} />
            </div>
          )}
        </Flex>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="In Progress" key="in-progress">
            <VisaTable data={inProgress} loading={loading} mode={activeTab} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="All" key="all">
            <VisaTable data={visa} loading={loading} mode={activeTab} />
          </Tabs.TabPane>
        </Tabs>
      </Flex>
    </MainLayout>
  );
};

export default VisaManagement;

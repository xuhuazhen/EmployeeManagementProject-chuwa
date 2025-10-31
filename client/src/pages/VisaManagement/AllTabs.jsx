import { Tabs, Flex } from "antd";
import VisaTable from "./VisaTable";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../slices/hrEmployeesSlice";
import { selectSearchQuery } from "../../selectors/hrEmployeesSelectors";
import SearchBar from "../../components/SearchBar/SearchBar";

const VisaTabs = ({
  inProgressEmployees,
  allVisaEmployees,
  activeTab,
  onTabChange,
}) => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);

  const items = [
    {
      key: "in-progress",
      label: "In Progress",
      children: <VisaTable data={inProgressEmployees} mode="in-progress" />,
    },
    {
      key: "all",
      label: "All",
      children: (
        <>
          <Flex justify="end">
            <SearchBar
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search by first, last, or preferred name..."
            />
          </Flex>
          <VisaTable data={allVisaEmployees} mode="all" />
        </>
      ),
    },
  ];

  return (
    <Tabs activeKey={activeTab} onChange={onTabChange} items={items} centered />
  );
};

export default VisaTabs;

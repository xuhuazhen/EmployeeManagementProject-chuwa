import VisaActions from "./VisaActions";
import styles from "./VisaManagement.module.css";
import AppTable from "../../components/Table/AppTable";
import { useNavigate } from "react-router-dom";

const VisaTable = ({ data, mode }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => navigate(`/hr/profiles/${record._id}`)}>
          {record.name}
        </a>
      ),
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
      render: (d) => new Date(d).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: ["employment", "endDate"],
      key: "endDate",
      render: (d) => new Date(d).toLocaleDateString(),
    },
    {
      title: "Days Remaining",
      key: "daysRemaining",
      render: (_, r) => {
        const endDate = r.employment?.endDate;
        if (!endDate) return "—"; // fallback if missing

        const days = Math.ceil(
          (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        if (days < 0) return <span style={{ color: "red" }}>Expired</span>;
        if (days < 30)
          return <span style={{ color: "orange" }}>{days} days</span>;
        return <span style={{ color: "green" }}>{days} days</span>;
      },
    },
    { title: "Next Step", dataIndex: "nextStep", key: "nextStep" },
  ];
  columns.push({
    title: mode === "all" ? "Documents" : "Action",
    key: "action",
    render: (_, record) => <VisaActions employee={record} mode={mode} />,
  });

  return (
    <AppTable
      columns={columns}
      data={data}
      rowKey={(record) => record._id}
      className={styles.table}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};

export default VisaTable;

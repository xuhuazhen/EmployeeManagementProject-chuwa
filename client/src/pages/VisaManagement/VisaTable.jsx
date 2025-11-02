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
    {
      title: "Next Step",
      dataIndex: "nextStep",
      key: "nextStep",
      render: (nextStep) => {
        switch (nextStep) {
          case "application-pending":
            return "Waiting for HR approval of OPT";
          case "application-reject":
            return "Waiting for employee to resubmit OPT";
          case "ead-waiting":
            return "Waiting for employee to submit EAD";
          case "ead-pending":
            return "Waiting for HR approval of EAD";
          case "ead-reject":
            return "Waiting for employee to resubmit EAD";
          case "i20-waiting":
            return "Waiting for employee to submit I-20";
          case "i20-pending":
            return "Waiting for HR approval of I-20";
          case "i20-reject":
            return "Waiting for employee to resubmit I-20";
          case "i983-waiting":
            return "Waiting for employee to submit I-983";
          case "i983-pending":
            return "Waiting for HR approval of I-983";
          case "i983-reject":
            return "Waiting for employee to resubmit I-983";
          case "all-done":
            return "All steps completed";
          default:
            return nextStep || "—";
        }
      },
    }
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

import styles from "./AppTable.module.css";
import { Table, Spin } from "antd";

const AppTable = ({ columns, data = [], loading = false, rowKey = "_id" }) => {
  if (loading) return <Spin size="large" />;
  return (
    <Table
      className={styles.customTable}
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};

export default AppTable;

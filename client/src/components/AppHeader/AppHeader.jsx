import { Layout, Typography } from "antd";
import Navbar from "../Nav/Navbar";
import styles from "./AppHeader.module.css";
import AppButton from "../Button/AppButton";

const { Header } = Layout;
const { Text, Link } = Typography;

const AppHeader = () => {
  return (
    <Header className={styles.header}>
      <Text className={styles.logo}>Employee Managemet</Text>
      <Navbar>
        <Link>Home</Link>
        <Link>Visa</Link>
        <Link>Profile</Link>
        <AppButton>Logout</AppButton>
      </Navbar>
    </Header>
  );
};

export default AppHeader;

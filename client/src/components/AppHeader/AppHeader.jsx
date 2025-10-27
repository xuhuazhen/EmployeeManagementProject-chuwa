import { Layout, Typography, Grid } from "antd";
import Navbar from "../Nav/Navbar";
import styles from "./AppHeader.module.css";
import AppButton from "../Button/AppButton";
import { useState } from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Text, Link } = Typography;
const { useBreakpoint } = Grid;

const AppHeader = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Header className={styles.header}>
      <div className={styles.topRow}>
        <Text className={styles.logo}>
          {!isMobile ? "Employee" : "E"}
          <span> Management</span>
        </Text>
        {isMobile && (
          <div
            className={styles.menuToggle}
            onClick={() => {
              setIsOpen(!isOpen);
              console.log(isOpen);
            }}
          >
            {isOpen ? <CloseOutlined /> : <MenuOutlined />}
          </div>
        )}
      </div>
      {/* !isLogging? */}
      {/* <Navbar isOpen={isOpen}>
        <Link>Home</Link>
      </Navbar> */}

      {/* isLogging as condidate? */}
      {/* <Navbar isOpen={isOpen}>
        <Link>Home</Link>
        <Link>Visa</Link>
        <Link>Profile</Link>
        <AppButton className={styles.button}>Logout</AppButton>
      </Navbar> */}

      {/* isLogging as HR? */}
      <Navbar isOpen={isOpen}>
        <Link>Home</Link>
        <Link>Visa</Link>
        <Link>Profile</Link>
        <Link>Hiring</Link>
        <AppButton className={styles.button}>Logout</AppButton>
      </Navbar>
    </Header>
  );
};

export default AppHeader;

import { Layout, Typography, Grid, message} from "antd";
import Navbar from "../Nav/Navbar";
import styles from "./AppHeader.module.css";
import AppButton from "../Button/AppButton";
import { useState } from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import api from "../../api/axiosConfig";

const { Header } = Layout;
const { Text, Link } = Typography;
const { useBreakpoint } = Grid;

const AppHeader = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth);

  const handleClick = async () => {
    console.log("click");
    try {
      const res = await api.get("user/logout", { withCredentials: true });

      if (res.data.status === "success") {
        dispatch(logout());

        message.success("Logout succeessful");
        return navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Header className={styles.header}>
      <div className={styles.topRow}>
        <Text className={styles.logo} onClick={() => navigate('/login')}>
          {!isMobile ? "Employee" : "E"}
          <span> Management</span>
        </Text>
        { user.isLoggedIn && isMobile && (
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
      { user.isLoggedIn && user.role === 'employee' &&
        <Navbar isOpen={isOpen}>
          <Link>Home</Link>
          <Link>Visa</Link>
          <Link>Profile</Link>
          <AppButton handleClick={handleClick}> Logout </AppButton>
        </Navbar>
      }
      { user.isLoggedIn && user.role === 'hr' && 
        <Navbar isOpen={isOpen}>
          <Link>Home</Link>
          <Link>Hiring</Link>
          <Link>Visa</Link>
          <Link>Profile</Link>
          <AppButton handleClick={handleClick}> Logout </AppButton>
        </Navbar>
      }
    </Header>
  );
};

export default AppHeader;

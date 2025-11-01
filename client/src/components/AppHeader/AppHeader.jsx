import { Layout, Typography, Grid, message } from "antd";
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

const NAV_ITEMS = {
  employee: [
    { label: "Home", path: "/home" },
    { label: "Visa", path: "/visa-status" },
    { label: "Profile", path: "/personal-info" },
  ],
  hr: [
    { label: "Home", path: "/hr/home" },
    { label: "Hiring", path: "/hr/hiring" },
    { label: "Visa", path: "/hr/visa-management" },
    { label: "Profiles", path: "/hr/profiles" },
  ],
};

const AppHeader = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth);
  const navLinks = user.isLoggedIn ? NAV_ITEMS[user.role] || [] : [];

  const handleClick = async () => {
    console.log("click");
    try {
      const res = await api.get("user/logout", { withCredentials: true });

      if (res.data.status === "success") {
        dispatch(logout());

        message.success("Logout succeessful");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Header className={styles.header}>
      <div className={styles.topRow}>
        <Text className={styles.logo} onClick={() => navigate("/login")}>
          {!isMobile ? "Employee" : "E"}
          <span> Management</span>
        </Text>
        {user.isLoggedIn && isMobile && (
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
      {user.isLoggedIn && (
        <Navbar isOpen={isOpen}>
          {navLinks.map((link) => (
            <Link key={link.path} onClick={() => navigate(link.path)}>
              {link.label}
            </Link>
          ))}
          <AppButton handleClick={handleClick}> Logout </AppButton>
        </Navbar>
      )}
    </Header>
  );
};

export default AppHeader;

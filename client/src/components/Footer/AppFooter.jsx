import { Layout } from "antd";
import styles from "./AppFooter.module.css";

const { Footer } = Layout;

const AppFooter = () => {
  return <Footer className={styles.footer}>©2022 All Rights Reserved.</Footer>;
};

export default AppFooter;

import { Flex, Typography } from "antd";
import styles from "./NavBar.module.css";

const Navbar = ({ children }) => {
  return <Flex className={styles.navBar}>{children}</Flex>;
};

export default Navbar;

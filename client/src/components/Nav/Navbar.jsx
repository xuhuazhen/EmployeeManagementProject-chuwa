import { Flex } from "antd";
import styles from "./NavBar.module.css";

const Navbar = ({ children, isOpen }) => {
  return (
    <Flex className={`${styles.navBar} ${isOpen ? styles.showMenu : ""}`}>
      {children}
    </Flex>
  );
};
export default Navbar;

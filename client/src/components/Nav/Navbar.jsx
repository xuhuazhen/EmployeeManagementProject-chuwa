<<<<<<< HEAD
import { Flex } from "antd";
import styles from "./NavBar.module.css";

const Navbar = ({ children, isOpen }) => {
  return (
    <Flex className={`${styles.navBar} ${isOpen ? styles.showMenu : ""}`}>
      {children}
    </Flex>
  );
=======
import { Flex, Typography } from "antd";
import styles from "./NavBar.module.css";

const Navbar = ({ children }) => {
  return <Flex className={styles.navBar}>{children}</Flex>;
>>>>>>> 75ec155 (creating button, navbar,  header and footer reusable components)
};

export default Navbar;

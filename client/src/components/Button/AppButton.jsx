import { Button } from "antd";
import styles from "./AppButton.module.css";

// const AppButton = ({ children }) => {
//   return <Button className={styles.primary}>{children}</Button>;
// };
// export default AppButton;

const AppButton = ({ children, className = "", ...props }) => {
  // Merge the default styles with any custom className passed
  const combinedClassName = `${styles.button} ${className}`.trim();

  return (
    <Button className={combinedClassName} {...props}>
      {children}
    </Button>
  );
};

export default AppButton;

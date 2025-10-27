<<<<<<< HEAD
import { Layout, Grid } from "antd";
=======
import { Flex, Layout } from "antd";
>>>>>>> 75ec155 (creating button, navbar,  header and footer reusable components)
import AppHeader from "../AppHeader/AppHeader";
import AppFooter from "../Footer/AppFooter";

const { Content } = Layout;
<<<<<<< HEAD
const { useBreakpoint } = Grid;

const MainLayout = ({ children }) => {
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <AppHeader />
      <Content
        style={{
          padding: isMobile ? "16px" : "50px",
          flex: 1,
          width: "100%",
        }}
      >
        {children}
      </Content>
      <AppFooter />
    </Layout>
  );
};
=======

const MainLayout = ({ children }) => (
  <Flex gap="middle" wrap>
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Content>{children}</Content>
      <AppFooter />
    </Layout>
  </Flex>
);
>>>>>>> 75ec155 (creating button, navbar,  header and footer reusable components)
export default MainLayout;

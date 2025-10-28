import { Layout, Grid } from "antd";
import AppHeader from "../AppHeader/AppHeader";
import AppFooter from "../Footer/AppFooter";

const { Content } = Layout;
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
export default MainLayout;

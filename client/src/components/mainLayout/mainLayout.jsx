import { Flex, Layout } from "antd";
import AppHeader from "../AppHeader/AppHeader";
import AppFooter from "../Footer/AppFooter";

const { Content } = Layout;

const MainLayout = ({ children }) => (
  <Flex gap="middle" wrap>
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Content>{children}</Content>
      <AppFooter />
    </Layout>
  </Flex>
);
export default MainLayout;

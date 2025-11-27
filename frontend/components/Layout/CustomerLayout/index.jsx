import React, { useState } from "react";
import {
  AccountBookOutlined,
  BranchesOutlined,
  DashboardOutlined,
  DesktopOutlined,
  DollarCircleOutlined,
  FileOutlined,
  GiftOutlined,
  LogoutOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Customerlayout = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log(pathname);

  const logoutFunc = () => {
    sessionStorage.removeItem("userInfo");
    cookies.remove("authToken");
    navigate("/");
  };
  const items = [
    {
      key: "/customer",
      icon: <DashboardOutlined />,
      label: <Link to="/customer">Dashboard</Link>,
    },
    {
      key: "/customer/transaction",
      icon: <BranchesOutlined />,
      label: <Link to="/customer/transaction">Transactions</Link>,
    },
    {
      key: "/customer/logout",
      icon: <LogoutOutlined />,
      label: (
        <Button
          type="text"
          className="!text-gray-300 !font-semibold"
          onClick={logoutFunc}
        >
          Logout
        </Button>
      ),
    },
  ];
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[pathname]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Customerlayout;

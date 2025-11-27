import React, { useState } from "react";
import {
  BranchesOutlined,
  DashboardOutlined,
  DesktopOutlined,
  DollarCircleOutlined,
  FileOutlined,
  GiftOutlined,
  LogoutOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";

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

const Adminlayout = ({ children }) => {
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
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/branding",
      icon: <GiftOutlined />,
      label: <Link to="/admin/branding">Branding</Link>,
    },
    {
      key: "/admin/branch",
      icon: <BranchesOutlined />,
      label: <Link to="/admin/branch">Branch</Link>,
    },
    {
      key: "/admin/currency",
      icon: <DollarCircleOutlined />,
      label: <Link to="/admin/currency">Currency</Link>,
    },
    {
      key: "/admin/new-employee",
      icon: <UserOutlined />,
      label: <Link to="/admin/new-employee">New Employee</Link>,
    },
    {
      key: "/admin/new-account",
      icon: <UserAddOutlined />,
      label: <Link to="/admin/new-account">New Account</Link>,
    },
    {
      key: "/admin/logout",
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
export default Adminlayout;

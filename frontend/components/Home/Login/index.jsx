import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Form, Input, Button } from "antd";

const { Item } = Form;

const Login = () => {
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <div className="flex">
      <div className="w-1/2 hidden md:flex items-center justify-center">
        <img src="/bank-img.jpg" alt="Bank" className="w-4/5 object-contain" />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <Card className="w-full max-w-sm shadow-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Bank Login
          </h2>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Item name="username" label="Username" rules={[{ required: true }]}>
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
              />
            </Item>
            <Item name="password" label="Password" rules={[{ required: true }]}>
              <Input
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Item>
            <Item>
              <Button
                type="text"
                htmlType="submit"
                block
                className="!bg-blue-500 !text-white !font-bold"
              >
                Login
              </Button>
            </Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;

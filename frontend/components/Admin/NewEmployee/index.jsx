import { Card, Form, Input, Button, Table } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { trimData, http } from "../../../modules/modules";

import swal from "sweetalert";
import { useState } from "react";

const { Item } = Form;

const NewEmployee = () => {
  // states collection
  const [empForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  // create new employee
  const onFinish = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      finalObj.profile = photo ? photo : "bankImages/avatar.jpg ";
      const httpReq = http();
      const { data } = await httpReq.post(`/api/users`, finalObj);
      console.log(data);

      const obj = {
        email: finalObj.email,
        password: finalObj.password,
      };

      const res = await httpReq.post(`/api/send-email`, obj);
      console.log(res);
      swal("Success", "Employee created", "success");
      empForm.resetFields();
      setPhoto(null);
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data?.err?.code);
      if (err?.response?.data?.err?.code === 11000) {
        empForm.setFields([
          {
            name: "email",
            errors: ["Email already exists!"],
          },
        ]);
      } else {
        swal("Warning", "Try again later", "warning");
      }
    } finally {
      setLoading(false);
    }
  };

  // handle upload
  const handleUpload = async (e) => {
    try {
      console.log(e.target.files[0]);
      let file = e.target.files[0];
      const formData = new FormData();
      formData.append("photo", file);
      const httpReq = http();
      const { data } = await httpReq.post("/api/upload", formData);
      console.log(data);
      setPhoto(data.filePath);
      swal("Success", "File uploaded", "success");
    } catch (err) {
      console.log(err);
      swal("Faile", "Unable to upload", "warning");
    }
  };

  // columns for table
  const columns = [
    {
      title: "Profile",
      key: "profile",
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <div className="flex gap-1">
          <Button
            type="text"
            className="!bg-pink-100 !text-pink-500 !font-bold"
            icon={<EyeInvisibleOutlined />}
          />
          <Button
            type="text"
            className="!bg-green-100 !text-green-500 !font-bold"
            icon={<EditOutlined />}
          />
          <Button
            type="text"
            className="!bg-rose-100 !text-rose-500 !font-bold"
            icon={<DeleteOutlined />}
          />
        </div>
      ),
    },
  ];
  return (
    <Adminlayout>
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add new employee">
          <Form form={empForm} onFinish={onFinish} layout="vertical">
            <Item label="Profile" name="xyz">
              <Input onChange={handleUpload} type="file" />
            </Item>
            <div className="grid md:grid-cols-2 gap-x-2">
              <Item
                name="fullname"
                label="Fullname"
                rules={[{ required: true }]}
              >
                <Input />
              </Item>
              <Item name="mobile" label="Mobile" rules={[{ required: true }]}>
                <Input type="number" />
              </Item>
              <Item name="email" label="Email" rules={[{ required: true }]}>
                <Input />
              </Item>
              <Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
              >
                <Input />
              </Item>
            </div>
            <Item>
              <Input.TextArea />
            </Item>
            <Item>
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-blue-500 !text-white !font-bold !w-full"
              >
                Submit
              </Button>
            </Item>
          </Form>
        </Card>
        <Card className="md:col-span-2" title="Employee list">
          <Table dataSource={[{}]} columns={columns} />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default NewEmployee;

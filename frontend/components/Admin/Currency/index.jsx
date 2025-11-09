import {
  Card,
  Form,
  Input,
  Button,
  message,
  Table,
  Image,
  Popconfirm,
} from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { trimData, http } from "../../../modules/modules";

import swal from "sweetalert";
import { useEffect, useState } from "react";

const { Item } = Form;

const Currency = () => {
  // states collection
  const [currencyForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [allCurrency, setAllCurrency] = useState([]);
  const [edit, setEdit] = useState(null);
  const [no, setNo] = useState(0);

  //get all employee data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/currency");
        console.log(data);
        setAllCurrency(data.data);
      } catch (err) {
        messageApi.error("Unable to fetch data!");
      }
    };
    fetcher();
  }, [no]);

  // create new employee
  const onFinish = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      finalObj.key = finalObj.currencyName;
      const httpReq = http();
      const { data } = await httpReq.post(`/api/currency`, finalObj);
      console.log(data);

      messageApi.success("Currency created!");
      currencyForm.resetFields();
      setNo(no + 1);
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data?.err?.code);
      if (err?.response?.data?.err?.code === 11000) {
        currencyForm.setFields([
          {
            name: "currencyName",
            errors: ["Currency already exists!"],
          },
        ]);
      } else {
        swal("Warning", "Try again later", "warning");
      }
    } finally {
      setLoading(false);
    }
  };

  // update employee
  const onEditCurrency = async (obj) => {
    try {
      console.log(obj);
      setEdit(obj);
      currencyForm.setFieldsValue(obj);
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdate = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);

      console.log(finalObj);
      const httpReq = http();
      await httpReq.put(`/api/currency/${edit._id}`, finalObj);
      messageApi.success("Currency updated successfully!");
      setNo(no + 1);
      setEdit(null);
      currencyForm.resetFields();
    } catch (err) {
      messageApi.error("Unable to update currency!");
    } finally {
      setLoading(false);
    }
  };

  // delete employee
  const onDeleteCurrency = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/currency/${id}`);
      messageApi.success("Currency deleted successfully!");
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to delete branch!");
    }
  };

  // columns for table
  const columns = [
    {
      title: "Currency Name",
      dataIndex: "currencyName",
      key: "currencyName",
    },
    {
      title: "Currency Description",
      dataIndex: "currencyDesc",
      key: "currencyDesc",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are you sure?"
            description="Once you update, you can also re-update!"
            onCancel={() => messageApi.info("No changes occur!")}
            onConfirm={() => onEditCurrency(obj)}
          >
            <Button
              type="text"
              className="!bg-green-100 !text-green-500 !font-bold"
              icon={<EditOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure?"
            description="Once deleted, you cannot restore!"
            onCancel={() => messageApi.info("Your data is safe!")}
            onConfirm={() => onDeleteCurrency(obj._id)}
          >
            <Button
              type="text"
              className="!bg-rose-100 !text-rose-500 !font-bold"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <Adminlayout>
      {context}
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add new currency">
          <Form
            form={currencyForm}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical"
          >
            <Item
              name="currencyName"
              label="Currency Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <Item name="currencyDesc" label="Currency Description">
              <Input.TextArea />
            </Item>
            <Item>
              {edit ? (
                <Button
                  loading={loading}
                  type="text"
                  htmlType="submit"
                  className="!bg-rose-500 !text-white !font-bold !w-full"
                >
                  Update
                </Button>
              ) : (
                <Button
                  loading={loading}
                  type="text"
                  htmlType="submit"
                  className="!bg-blue-500 !text-white !font-bold !w-full"
                >
                  Submit
                </Button>
              )}
            </Item>
          </Form>
        </Card>
        <Card
          className="md:col-span-2"
          title="Currency list"
          style={{ overflowX: "auto" }}
        >
          <Table
            dataSource={allCurrency}
            columns={columns}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default Currency;

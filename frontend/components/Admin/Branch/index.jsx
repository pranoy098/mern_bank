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

const Branch = () => {
  // states collection
  const [branchForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [allBranch, setAllBranch] = useState([]);
  const [edit, setEdit] = useState(null);
  const [no, setNo] = useState(0);

  //get all employee data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/branch");
        console.log(data);
        setAllBranch(data.data);
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
      finalObj.key = finalObj.branchName;
      const httpReq = http();
      const { data } = await httpReq.post(`/api/branch`, finalObj);
      console.log(data);

      messageApi.success("Branch created!");
      branchForm.resetFields();
      setNo(no + 1);
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data?.err?.code);
      if (err?.response?.data?.err?.code === 11000) {
        branchForm.setFields([
          {
            name: "branchName",
            errors: ["Branch already exists!"],
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
  const onEditBranch = async (obj) => {
    try {
      console.log(obj);
      setEdit(obj);
      branchForm.setFieldsValue(obj);
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
      await httpReq.put(`/api/branch/${edit._id}`, finalObj);
      messageApi.success("Branch updated successfully!");
      setNo(no + 1);
      setEdit(null);
      branchForm.resetFields();
    } catch (err) {
      messageApi.error("Unable to update employee!");
    } finally {
      setLoading(false);
    }
  };

  // delete employee
  const onDeleteBranch = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/branch/${id}`);
      messageApi.success("Branch deleted successfully!");
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to delete branch!");
    }
  };

  // columns for table
  const columns = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      title: "Branch Address",
      dataIndex: "branchAddress",
      key: "branchAddress",
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
            onConfirm={() => onEditBranch(obj)}
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
            onConfirm={() => onDeleteBranch(obj._id)}
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
        <Card title="Add new branch">
          <Form
            form={branchForm}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical"
          >
            <Item
              name="branchName"
              label="Branch Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <Item name="branchAddress" label="Branch Address">
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
          title="Branch list"
          style={{ overflowX: "auto" }}
        >
          <Table
            dataSource={allBranch}
            columns={columns}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default Branch;

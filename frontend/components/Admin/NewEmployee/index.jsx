import {
  Card,
  Form,
  Input,
  Button,
  message,
  Table,
  Image,
  Popconfirm,
  Select,
} from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { trimData, http, fetchData } from "../../../modules/modules";
import useSWR from "swr";
import swal from "sweetalert";
import { useEffect, useState } from "react";
import Search from "antd/es/transfer/search";

const { Item } = Form;

const NewEmployee = () => {
  // states collection
  const [empForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [allEmployee, setAllEmployee] = useState([]);
  const [finalEmployee, setFinalEmployee] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  const [edit, setEdit] = useState(null);
  const [no, setNo] = useState(0);

  // get branch data
  const { data: branches, error: bError } = useSWR("/api/branch", fetchData, {
    revalidateOnFocus: false,
    refreshInterval: 1200000,
    revalidateOnReconnect: false,
  });

  console.log(branches, bError);
  useEffect(() => {
    let filter =
      branches &&
      branches?.data.map((item) => ({
        value: item.branchName,
        label: item.branchName,
        key: item.key,
      }));
    setAllBranch(filter);
  }, [branches]);

  //get all employee data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/users");
        console.log(data);
        setAllEmployee(data.data);
        setFinalEmployee(data.data);
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
      finalObj.profile = photo ? photo : "bankImages/avatar.jpg ";
      finalObj.key = finalObj.email;
      finalObj.userType = "employee";
      const httpReq = http();
      const { data } = await httpReq.post(`/api/users`, finalObj);
      console.log(data);

      const obj = {
        email: finalObj.email,
        password: finalObj.password,
      };

      const res = await httpReq.post(`/api/send-email`, obj);
      console.log(res);
      messageApi.success("Employee created!");
      // swal("Success", "Employee created", "success");
      empForm.resetFields();
      setPhoto(null);
      setNo(no + 1);
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

  // update isActive status
  const updateIsActive = async (id, isActive) => {
    try {
      const obj = {
        isActive: !isActive,
      };
      const httpReq = http();
      const { data } = await httpReq.put(`/api/users/${id}`, obj);
      messageApi.success("Record updated successfully!");
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to update isActive!");
    }
  };

  // update employee
  const onEditUser = async (obj) => {
    try {
      console.log(obj);
      setEdit(obj);
      empForm.setFieldsValue(obj);
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdate = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);

      if (photo) {
        finalObj.profile = photo;
      }
      console.log(finalObj);
      const httpReq = http();
      await httpReq.put(`/api/users/${edit._id}`, finalObj);
      messageApi.success("Employee updated successfully!");
      setNo(no + 1);
      setEdit(null);
      empForm.resetFields();
    } catch (err) {
      messageApi.error("Unable to update employee!");
    } finally {
      setLoading(false);
    }
  };

  // delete employee
  const onDeleteUser = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/users/${id}`);
      messageApi.success("Employee deleted successfully!");
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to delete user!");
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

  // search handler
  const onSearch = (e) => {
    let value = e.target.value.trim().toLowerCase();
    console.log("filter value", value);
    let filter =
      finalEmployee &&
      finalEmployee.filter((emp) => {
        console.log("emp", emp);
        if (emp.fullname.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.userType.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.email.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.branch.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.mobile.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.address.toLowerCase().indexOf(value) != -1) {
          return emp;
        }
      });
    setAllEmployee(filter);
  };

  // columns for table
  const columns = [
    {
      title: "Profile",
      key: "profile",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    {
      title: "User type",
      dataIndex: "userType",
      key: "userType",
      render: (text) => {
        if (text === "admin") {
          return <span className=" capitalize text-indigo-500">{text}</span>;
        } else if (text === "employee") {
          return <span className=" capitalize text-green-500">{text}</span>;
        } else {
          return <span className=" capitalize text-red-500">{text}</span>;
        }
      },
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
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
      fixed: "right",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are you sure?"
            description="Once you update, you can also re-update!"
            onCancel={() => messageApi.info("No changes occur!")}
            onConfirm={() => updateIsActive(obj._id, obj.isActive)}
          >
            <Button
              type="text"
              className={`${
                obj.isActive
                  ? "!bg-indigo-100 !text-indigo-500 !font-bold"
                  : "!bg-pink-100 !text-pink-500 !font-bold"
              }`}
              icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure?"
            description="Once you update, you can also re-update!"
            onCancel={() => messageApi.info("No changes occur!")}
            onConfirm={() => onEditUser(obj)}
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
            onConfirm={() => onDeleteUser(obj._id)}
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
        <Card title="Add new employee">
          <Form
            form={empForm}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical"
          >
            <Item
              name="branch"
              label="Select Branch"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select branch" options={allBranch} />
            </Item>
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
                <Input disabled={edit ? true : false} />
              </Item>
            </div>
            <Item name="address" label="Branch Address">
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
          title="Employee list"
          style={{ overflowX: "auto" }}
          extra={
            <div>
              <Input
                placeholder="Search by all"
                prefix={<SearchOutlined />}
                onChange={onSearch}
              />
            </div>
          }
        >
          <Table
            dataSource={allEmployee}
            columns={columns}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default NewEmployee;

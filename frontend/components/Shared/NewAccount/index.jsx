import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Modal,
  Table,
  Form,
  DatePicker,
  Select,
  message,
  Image,
  Popconfirm,
} from "antd";

import { useEffect, useState } from "react";
import {
  http,
  uploadFile,
  fetchData,
  trimData,
} from "../../../modules/modules";
import useSWR, { mutate } from "swr";
import swal from "sweetalert";

const { Item } = Form;
const NewAccount = () => {
  // get userInfo from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  const [accountForm] = Form.useForm();
  const [accountModal, setAccountModal] = useState(false);
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [document, setDocument] = useState(null);
  const [allCustomer, setAllCustomer] = useState(null);
  const [finalCustomer, setFinalCustomer] = useState(null);
  const [no, setNo] = useState(0);
  const [edit, setEdit] = useState(null);

  // get branding details
  const { data: brandings, error: bError } = useSWR(
    "/api/branding",
    fetchData,
    {
      refreshInterval: 120000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  console.log("Branding data in new account:", brandings);

  // get customer data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/customers");
        console.log(data);
        setAllCustomer(
          data?.data.filter((item) => item.branch == userInfo?.branch)
        );
        setFinalCustomer(
          data?.data.filter((item) => item.branch == userInfo?.branch)
        );
      } catch (err) {
        messageApi.error("Unable to fetch data!");
      }
    };
    fetcher();
  }, [no]);

  let bankAccountNo =
    Number(brandings && brandings?.data[0]?.bankAccountNo) + 1;
  let brandingId = brandings && brandings?.data[0]?._id;
  accountForm.setFieldValue("accountNo", bankAccountNo);

  // create new account
  const onFinish = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      finalObj.profile = photo ? photo : "bankImages/avatar.jpg ";
      finalObj.signature = signature ? signature : "bankImages/avatar.jpg ";
      finalObj.document = document ? document : "bankImages/avatar.jpg ";
      finalObj.key = finalObj.email;
      finalObj.userType = "customer";
      finalObj.branch = userInfo?.branch;
      finalObj.createdBy = userInfo?.email;
      const httpReq = http();
      console.log("Final obj in new account:", finalObj);
      const { data } = await httpReq.post(`/api/users`, finalObj);
      console.log(data);
      finalObj.customerLoginId = data?.data?._id;
      const obj = {
        email: finalObj.email,
        password: finalObj.password,
      };

      await httpReq.post(`/api/customers`, finalObj);
      await httpReq.post(`/api/send-email`, obj);
      await httpReq.put(`/api/branding/${brandingId}`, { bankAccountNo });

      accountForm.resetFields();
      mutate("/api/branding");
      setAccountModal(false);
      setPhoto(null);
      setSignature(null);
      setDocument(null);
      setNo(no + 1);
      setAccountModal(false);
      messageApi.success("Account created!");
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data?.err?.code);
      if (err?.response?.data?.err?.code === 11000) {
        accountForm.setFields([
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

  // handle photo
  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    const folderName = "customerPhoto";

    try {
      const result = await uploadFile(file, folderName);
      setPhoto(result.filePath);
    } catch (err) {
      messageApi.error("File upload failed");
    }
  };

  // handle signature
  const handleSignature = async (e) => {
    const file = e.target.files[0];
    const folderName = "customerSignature";
    try {
      const result = await uploadFile(file, folderName);
      setSignature(result.filePath);
    } catch (err) {
      messageApi.error("File upload failed");
    }
  };

  // handle document
  const handleDocument = async (e) => {
    const file = e.target.files[0];
    const folderName = "customerDocument";
    try {
      const result = await uploadFile(file, folderName);
      setDocument(result.filePath);
    } catch (err) {
      messageApi.error("File upload failed");
    }
  };

  // update isActive status
  const updateIsActive = async (id, isActive, loginId) => {
    try {
      const obj = {
        isActive: !isActive,
      };
      const httpReq = http();
      await httpReq.put(`/api/users/${loginId}`, obj);
      const { data } = await httpReq.put(`/api/customers/${id}`, obj);
      messageApi.success("Record updated successfully!");
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to update isActive!");
    }
  };

  // search handler
  const onSearch = (e) => {
    let value = e.target.value.trim().toLowerCase();
    console.log("filter value", value);
    let filter =
      finalCustomer &&
      finalCustomer.filter((cust) => {
        console.log("emp", cust);
        if (cust?.fullname.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (cust?.userType.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (cust?.email.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (cust?.branch.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (cust?.mobile.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (cust?.address.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (
          cust?.accountNo.toString().toLowerCase().indexOf(value) != -1
        ) {
          return cust;
        } else if (
          cust?.createdBy.toString().toLowerCase().indexOf(value) != -1
        ) {
          return cust;
        } else if (
          cust?.finalBalance.toString().toLowerCase().indexOf(value) != -1
        ) {
          return cust;
        }
      });
    setAllCustomer(filter);
  };

  // update employee
  const onEditCustomer = async (obj) => {
    try {
      console.log(obj);
      setEdit(obj);
      setAccountModal(true);
      accountForm.setFieldsValue(obj);
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdate = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      delete finalObj.password;
      delete finalObj.email;
      delete finalObj.accountNo;

      if (photo) {
        finalObj.profile = photo;
      }
      if (signature) {
        finalObj.signature = photo;
      }
      if (document) {
        finalObj.document = photo;
      }
      console.log(finalObj);
      const httpReq = http();
      await httpReq.put(`/api/customers/${edit._id}`, finalObj);
      messageApi.success("Employee updated successfully!");
      setNo(no + 1);
      setEdit(null);
      setPhoto(null);
      setSignature(null);
      setDocument(null);
      setAccountModal(false);
      accountForm.resetFields();
    } catch (err) {
      messageApi.error("Unable to update employee!");
    } finally {
      setLoading(false);
    }
  };

  // delete employee
  const onDeleteCustomer = async (id, loginId) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/customers/${loginId}`);
      await httpReq.delete(`/api/customers/${id}`);
      messageApi.success("Customer deleted successfully!");
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to delete customer!");
    }
  };

  // columns for table
  const columns = [
    {
      title: "Photo",
      key: "photo",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj?.profile}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    {
      title: "Signature",
      key: "signature",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj?.signature}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    {
      title: "Document",
      key: "document",
      render: (src, obj) => (
        <Button
          type="text"
          shape="circle"
          className="!bg-blue-100 !text-blue-500"
          icon={<DownloadOutlined />}
        />
      ),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
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
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Balance",
      dataIndex: "finalBalance",
      key: "finalBalance",
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
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
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
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
            onConfirm={() =>
              updateIsActive(obj._id, obj.isActive, obj.customerLoginId)
            }
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
            onConfirm={() => onEditCustomer(obj)}
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
            onConfirm={() => onDeleteCustomer(obj._id, obj.customerLoginId)}
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

  const onCloseModal = () => {
    setAccountModal(false);
    setEdit(null);
    accountForm.resetFields();
  };

  return (
    <div>
      {context}
      <div className="grid">
        <Card
          title="Account List"
          style={{ overflowX: "auto" }}
          extra={
            <div className="flex gap-x-3">
              <Input
                placeholder="Search by all"
                prefix={<SearchOutlined />}
                onChange={onSearch}
              />
              <Button
                onClick={() => setAccountModal(true)}
                type="text"
                className="!font-bold !bg-blue-500 !text-white"
              >
                Add new account
              </Button>
            </div>
          }
        >
          <Table
            dataSource={allCustomer}
            columns={columns}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
      <Modal
        open={accountModal}
        onCancel={onCloseModal}
        width={820}
        footer={null}
        title="Open New Account"
      >
        <Form
          layout="vertical"
          onFinish={edit ? onUpdate : onFinish}
          form={accountForm}
        >
          {!edit && (
            <div className="grid md:grid-cols-3 gap-x-3">
              <Item label="Account no" name="accountNo">
                <Input disabled placeholder="Account no" />
              </Item>
              <Item label="Email" name="email" rules={[{ require: true }]}>
                <Input
                  disabled={edit ? true : false}
                  placeholder="Enter email"
                />
              </Item>
              <Item
                label="Password"
                name="password"
                rules={[{ require: edit ? true : false }]}
              >
                <Input
                  disabled={edit ? true : false}
                  placeholder="Enter password"
                />
              </Item>
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-x-3">
            <Item label="Full Name" name="fullname" rules={[{ require: true }]}>
              <Input placeholder="Enter Fullname" />
            </Item>
            <Item label="Mobile" name="mobile" rules={[{ require: true }]}>
              <Input placeholder="Enter mobile" />
            </Item>
            <Item
              label="Father Name"
              name="fatherName"
              rules={[{ require: true }]}
            >
              <Input placeholder="Enter father name" />
            </Item>

            <Item label="DOB" name="dob">
              <Input type="date" />
            </Item>
            <Item label="Gender" name="gender" rules={[{ require: true }]}>
              <Select
                placeholder="Select Gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />
            </Item>
            <Item label="Currency" name="currency" rules={[{ require: true }]}>
              <Select
                placeholder="Select currency"
                options={[
                  { label: "INR", value: "inr" },
                  { label: "USD", value: "usd" },
                ]}
              />
            </Item>
            <Item
              label="Photo"
              name="xyz"
              // rules={[{ require: true }]}
            >
              <Input type="file" onChange={handlePhoto} />
            </Item>
            <Item
              label="Signature"
              name="dfr"
              // rules={[{ require: true }]}
            >
              <Input type="file" onChange={handleSignature} />
            </Item>
            <Item
              label="Document"
              name="hus"
              // rules={[{ require: true }]}
            >
              <Input type="file" onChange={handleDocument} />
            </Item>
          </div>
          <Item label="Address" name="address" rules={[{ require: true }]}>
            <Input.TextArea />
          </Item>
          <Item className="flex justify-end items-center">
            <Button
              loading={loading}
              htmlType="submit"
              type="text"
              className="!bg-blue-500 !font-bold !text-white"
            >
              Submit
            </Button>
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewAccount;

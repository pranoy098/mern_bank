import { SearchOutlined } from "@ant-design/icons";
import { Card, Image, Input, Form, Select, Button, message, Empty } from "antd";
import { useState } from "react";
import { http, trimData } from "../../../modules/modules";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const NewTransaction = () => {
  const token = cookies.get("authToken");
  // get userinfo from sessionstorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  // form info
  const [transactionForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // state collection
  const [accountNo, setAccountNo] = useState(null);
  const [accountDetail, setAccountDetail] = useState(null);

  const onFinish = async (values) => {
    try {
      const finalObj = trimData(values);
      let balance = 0;
      if (finalObj.transactionType === "cr") {
        balance =
          Number(accountDetail.finalBalance) +
          Number(finalObj.transactionAmount);
      } else if (finalObj.transactionType === "dr") {
        balance =
          Number(accountDetail.finalBalance) -
          Number(finalObj.transactionAmount);
      }
      console.log(balance);
      finalObj.currentBalance = accountDetail.finalBalance;
      finalObj.customerId = accountDetail._id;
      finalObj.accountNo = accountDetail.accountNo;
      finalObj.branch = userInfo?.branch;
      const httpReq = http(token);
      await httpReq.post("/api/transaction", finalObj);
      await httpReq.put(`/api/customers/${accountDetail._id}`, {
        finalBalance: balance,
      });
      messageApi.success("Transaction processed successfully");
      transactionForm.resetFields();
      setAccountDetail(null);
    } catch (err) {
      messageApi.error(
        err.response
          ? err.response.data.message
          : "Unable to process transaction!"
      );
    }
  };

  const searchByAccountNo = async () => {
    try {
      const obj = {
        accountNo,
        branch: userInfo?.branch,
      };
      const httpReq = http();
      const { data } = await httpReq.post(`/api/find-by-account`, obj);
      if (data?.data) {
        setAccountDetail(data?.data);
      } else {
        messageApi.warning("There is no record of this account no");
        setAccountDetail(null);
      }
    } catch (err) {
      messageApi.error("Error fetching account details");
    }
  };
  return (
    <div>
      {contextHolder}
      <Card
        title="New Transaction"
        extra={
          <Input
            onChange={(e) => setAccountNo(e.target.value)}
            placeholder="Enter Account Number"
            addonAfter={<SearchOutlined onClick={searchByAccountNo} />}
            style={{ cursor: "pointer" }}
          />
        }
      >
        {accountDetail ? (
          <div>
            <div className="flex items-center justify-start gap-2">
              <Image
                src={`${import.meta.env.VITE_BASEURL}/${
                  accountDetail?.profile
                }`}
                width={120}
                className="rounded-full"
              />
              <Image
                src={`${import.meta.env.VITE_BASEURL}/${
                  accountDetail?.signature
                }`}
                width={120}
                className="rounded-full"
              />
            </div>
            <div className="mt-5 grid md:grid-cols-3 gap-8">
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <b>Name : </b> <b>{accountDetail?.fullname}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Mobile : </b> <b>{accountDetail?.mobile}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Balance : </b>{" "}
                  <b>
                    {accountDetail?.currency === "inr" ? "₹ " : "$ "}
                    {accountDetail?.finalBalance}
                  </b>
                </div>
                <div className="flex justify-between items-center">
                  <b>DOB : </b> <b>{accountDetail?.dob}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Currency : </b> <b>{accountDetail?.currency}</b>
                </div>
              </div>
              <Form
                form={transactionForm}
                onFinish={onFinish}
                layout="vertical"
              >
                <div className="grid md:grid-cols-2 gap-x-3">
                  <Form.Item
                    label="Transaction Type"
                    name="transactionType"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select Transaction Type"
                      className="w-full"
                      options={[
                        { value: "cr", label: "CR" },
                        { value: "dr", label: "DR" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Transaction Amount"
                    name="transactionAmount"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="500.00" type="number" />
                  </Form.Item>
                  <Form.Item
                    label="Reference"
                    name="reference"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="text"
                      className="!bg-blue-500 !text-white !font-semibold !w-full"
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </Card>
    </div>
  );
};
export default NewTransaction;

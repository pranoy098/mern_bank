import React, { useEffect, useState } from "react";
import { Button, Card, DatePicker, Form, Input, Table } from "antd";
import {
  formatDate,
  http,
  printBankTransactions,
  trimData,
  downloadTransaction,
} from "../../../modules/modules";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
// import Item from "antd/es/list/Item";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const { Item } = Form;

const TransactionTable = ({ query = {} }) => {
  const token = cookies.get("authToken");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [accountNo, setAccountNo] = useState(query.accountNo || "");
  const [branch, setBranch] = useState(query.branch || "");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (params = {}) => {
    setLoading(true);
    const searchParams = new URLSearchParams({
      page: params.current || 1,
      pageSize: params.pageSize || 10,
    });

    // Add filters from state OR initial query
    if (accountNo) searchParams.append("accountNo", accountNo);
    if (branch) searchParams.append("branch", branch);
    try {
      const httpReq = http(token);
      const res = await httpReq.get(
        `/api/transaction/pagination?${searchParams.toString()}`
      );
      setData(res.data.data);
      setTotal(res.data.total);
      setPagination({
        current: res.data.page,
        pageSize: res.data.pageSize,
      });
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(pagination);
  }, [query]); // Re-run when new props come in

  const handleTableChange = (pagination) => {
    fetchTransactions(pagination);
  };

  const columns = [
    {
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: "Amount",
      dataIndex: "transactionAmount",
      key: "transactionAmount",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => formatDate(d),
    },
  ];

  const onFinish = async (values) => {
    try {
      values.branch = query.branch;
      if (query.isCustomer) {
        values.accountNo = query.accountNo;
      }
      console.log("Received values:", values);
      const httpReq = http();
      let obj = trimData(values);
      const { data } = await httpReq.post(`/api/transaction/filter`, obj);
      console.log("Filtered data:", data);
      setData(data);
    } catch (err) {
      console.error("Error in onFinish:", err);
    }
  };

  return (
    <div className="p-4">
      <Card className="!mb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Form className="flex gap-3" onFinish={onFinish}>
              <Item label="From" name="fromDate" rules={[{ required: true }]}>
                <DatePicker />
              </Item>
              <Item label="To" name="toDate" rules={[{ required: true }]}>
                <DatePicker />
              </Item>
              {!query.isCustomer && (
                <Item label="Account" name="accountNo">
                  <Input placeholder="Account No" />
                </Item>
              )}

              <Item>
                <Button
                  type="text"
                  htmlType="submit"
                  className="font-semibold !text-white !bg-blue-500"
                >
                  Fetch Transactions
                </Button>
              </Item>
            </Form>
          </div>
          <div className="flex gap-3">
            <Button
              type="text"
              className="mt-2 !text-white !bg-blue-500"
              shape="circle"
              icon={<DownloadOutlined />}
              onClick={() => downloadTransaction(data)}
            />
            <Button
              type="text"
              className="mt-2 !text-white !bg-blue-500"
              shape="circle"
              icon={<PrinterOutlined />}
              onClick={() => printBankTransactions(data)}
            />
          </div>
        </div>
      </Card>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        pagination={{
          total: total,
          current: pagination.current,
          pageSize: pagination.pageSize,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default TransactionTable;

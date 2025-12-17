import Customerlayout from "../../Layout/CustomerLayout";
import Dashboard from "../../Shared/Dashboard";
import TransactionTable from "../../Shared/TransactionTable";

const CustomerTransactions = () => {
  // Get user info from local storage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  return (
    <Customerlayout>
      <Dashboard />
      <TransactionTable
        query={{
          accountNo: userInfo?.accountNo,
          branch: userInfo?.branch,
          isCustomer: true,
        }}
      />
    </Customerlayout>
  );
};
export default CustomerTransactions;

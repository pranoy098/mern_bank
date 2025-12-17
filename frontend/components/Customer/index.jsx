import Customerlayout from "../Layout/CustomerLayout";
import Dashboard from "../Shared/Dashboard";
import useSWR from "swr";
import { fetchData } from "../../modules/modules";

const CustomerDashboard = () => {
  // get userInfo from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const { data: trData, error: trError } = useSWR(
    `/api/transaction/summary?accountNo=${userInfo?.accountNo}`,
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1200000,
    }
  );
  console.log("trData", trData);
  return (
    <Customerlayout>
      <Dashboard data={trData && trData} />
    </Customerlayout>
  );
};
export default CustomerDashboard;

import Adminlayout from "../Layout/Adminlayout";
import Dashboard from "../Shared/Dashboard";
import useSWR from "swr";
import { fetchData } from "../../modules/modules";

const AdminDashboard = () => {
  // get userInfo from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const { data: trData, error: trError } = useSWR(
    `/api/transaction/summary?branch=${userInfo?.branch}`,
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1200000,
    }
  );
  console.log("trData", trData);
  return (
    <Adminlayout>
      <Dashboard data={trData && trData} />
    </Adminlayout>
  );
};

export default AdminDashboard;

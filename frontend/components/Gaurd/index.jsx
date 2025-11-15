import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { http } from "../../modules/modules";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader";

const Guard = ({ endpoint, role }) => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  console.log(token, endpoint, role);
  const [authorised, setAuthorised] = useState(false);
  const [loader, setLoader] = useState(true);
  const [userType, setUserType] = useState(null);
  if (token === undefined) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAuthorised(false);
        return <Navigate to="/" />;
      }

      try {
        const httpReq = http(token);
        const { data } = await httpReq.get(endpoint);
        const user = data?.data?.userType;
        sessionStorage.setItem("userInfo", JSON.stringify(data?.data));
        console.log(data);
        setUserType(user);
        setLoader(false);
        setAuthorised(true);
      } catch (err) {
        setUserType(null);
        setLoader(false);
        setAuthorised(false);
      }
    };
    verifyToken();
  }, [endpoint]);

  if (loader) {
    return <Loader />;
  }
  if (authorised && role === userType) {
    return <Outlet />;
  } else if (authorised && role === userType) {
    return <Outlet />;
  } else if (authorised && role === userType) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default Guard;

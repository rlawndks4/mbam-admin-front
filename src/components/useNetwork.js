import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useNetwork = (onChange) => {
    const {pathname} = useLocation();
    const [status, setStatus] = useState(navigator.onLine);
    const handleChange = () => {
      onChange(navigator.onLine);
      setStatus(navigator.onLine);
    };
    useEffect(() => {
      window.addEventListener("online", handleChange);
      window.addEventListener("offline", handleChange);
      return () => {
        window.removeEventListener("online", handleChange);
        window.removeEventListener("offline", handleChange);
      };
    }, [pathname]);
    return status;
  };
   
  export default useNetwork;
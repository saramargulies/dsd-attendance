import { createContext, useState, useEffect, useContext } from "react";
import { Spinner } from "../Global/Spinner";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const loginUser = async (loginData) => {
    const loginUrl = `${process.env.REACT_APP_FASTAPI}/accounts/login/`;
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(loginData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      credentials: "include",
    };
  
    setLoading(true);

    try {
      const res = await fetch(loginUrl, fetchConfig);
      const data = await res.json();
      if (data.success) {
        setUser(data);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const logoutUser = async () => {
    const body = JSON.stringify({
      withCredentials: true,
    });
    const config = {
      method: "post",
      credentials: "include",
      body: body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_FASTAPI}/accounts/logout/`, config);

      await res.json();
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const checkUserStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FASTAPI}/accounts/authenticated/`,
        { credentials: "include" }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.isAuthenticated === "success") {
          setUser(data);
        }
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <div className="center"><Spinner></Spinner></div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;

import Cookies from "js-cookie";
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() =>{
    setLoading(false)
  }, [])
  

}

export const checkAuthenticated = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_FASTAPI}/accounts/authenticated/`,
      { credentials: "include" }
    );

    if (response.ok) {
      const data = await response.json();

      if (data?.isAuthenticated === "success") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

export const logout = async () => {
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

    const data = await res.json();
  } catch (err) {
    console.log(err);
  }
};

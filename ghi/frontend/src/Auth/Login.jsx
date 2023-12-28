import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CSRFToken from "../components/CSRF";
import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {};

    loginData.username = email;
    loginData.password = password;
    // loginData.withCredentials = true;

    loginUser(loginData);
  };

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[user, navigate])

  return (
    <div className="page-container mt-4">
      <div className="spacer"></div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <CSRFToken />
            <div className="mb-3">
              <label htmlFor="Login__email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="Login__email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Login__password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="Login__password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="spacer"></div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { AlertError, AlertSuccess } from "../Global/Alerts";

function AddClient() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [name, setName] = useState("");
  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {};

    data.name = name;

    const clientUrl = `${process.env.REACT_APP_DJANGO_API}/attendance/clients/`;
    const fetchConfig = {
      credentials: "include",
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    const response = await fetch(clientUrl, fetchConfig);
    const responseJSON = await response.json();
    if (response.ok) {
      const newClient = responseJSON;
      setSuccessMessage(newClient.name)
      setName("");
    } else {
      setErrorMessage(responseJSON.Error);
    }
  };

  let isDisabled = true;
  if (name) {
    isDisabled = false;
  }


  return (
    <>
      <div className="container">
        <div className="my-5">
          <div className="row">
            <div className="col">
              <div className="card shadow">
                <div className="card-body">
                  {successMessage && <AlertSuccess>
                    Thanks for adding {successMessage}! Would you like to {}
                    <Link to="/overview/add-dog" className="link-secondary">
                      add a new dog?
                    </Link></AlertSuccess>}
                  {errorMessage && <AlertError>{errorMessage}</AlertError>}
                  <form
                    className="d-inline"
                    onSubmit={handleSubmit}
                    id="create-tech-form"
                  >
                    <h1 className="card-title">Add a Client</h1>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        placeholder="Full Name"
                        type="text"
                        onChange={handleNameChange}
                        value={name}
                        name="firstName"
                        id="firstName"
                        required
                      ></input>
                    </div>
                    <button
                      className="btn btn-lg btn-primary"
                      disabled={isDisabled}
                    >
                      Create
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddClient;

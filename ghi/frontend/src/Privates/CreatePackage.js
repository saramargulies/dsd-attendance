import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function CreatePackage() {
  const [dogs, setDogs] = useState([]);
  const [packages, setPackages] = useState([]);
  const [formStyle, setFormStyle] = useState("d-inline");
  const [successStyle, setSuccessStyle] = useState(
    "alert alert-success d-none mb-0 alert-dismissible"
  );

  const [sessions, setSessions] = useState("");
  const handleSessionsChange = (event) => {
    const value = event.target.value;
    setSessions(value);
  };

  const [dog, setDog] = useState("");
  const handleDogChange = (event) => {
    const value = event.target.value;
    setDog(value);
  };

  const fetchData = async () => {
    const responses = await Promise.all([
      fetch(`${process.env.REACT_APP_DJANGO_API}/attendance/dogs/`),
      fetch(`${process.env.REACT_APP_DJANGO_API}/attendance/packages/`),
    ]);

    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    if (data) {
      setDogs(data[0].dogs);
      setPackages(data[1].packages);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {};

    data.dog = dog;
    data.sessions = sessions;

    const submitUrl = `${process.env.REACT_APP_DJANGO_API}/attendance/packages/`;
    const fetchConfig = {
      credentials: "include",
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    const response = await fetch(submitUrl, fetchConfig);
    if (response.ok) {
      setDog("");
      setSessions("");
    }
  };
  const success = () => {
    setFormStyle("d-none");
    setSuccessStyle("alert alert-success mb-0 alert-dismissible");
  };
  const reload = () => {
    window.location.reload();
  };

  useEffect(() => {
    fetchData();
  }, []);

  let isDisabled = true;
  if (dog && sessions) {
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
                  <form onSubmit={handleSubmit} id="class-attendance-form">
                    <div className={formStyle}>
                      <h1 className="card-title">Create a Package</h1>
                      <div className="mb-3">
                        <select
                          onChange={handleDogChange}
                          value={dog}
                          name="dog"
                          id="dog"
                          className="form-select"
                          required
                        >
                          <option value="">Choose a dog</option>
                          {dogs?.map((dog) => {
                            return (
                              <option key={dog.id} value={dog.id}>
                                {dog.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="mb-3">
                        <input
                          placeholder="Number of sessions"
                          onChange={handleSessionsChange}
                          value={sessions}
                          name="sessions"
                          type="number"
                          id="sessions"
                          className="form-control"
                          required
                        ></input>
                      </div>
                      <button
                        onClick={success}
                        className="btn btn-lg btn-primary"
                        disabled={isDisabled}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                  <div className={successStyle} id="success-message">
                    You've successfully created a package! If you need to take
                    attendance for a session you can do so{" "}
                    <Link
                      to="/take-attendance/private"
                      className="link-secondary"
                    >
                      here.
                    </Link>
                    <button
                      onClick={reload}
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="m-3 font-link">
        <h1>Active Packages</h1>
      </div>
      <div className="container shadow table-responsive font-link pt-2">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Dog</th>
              <th>Number of Sessions</th>
              <th>Completed?</th>
            </tr>
          </thead>
          <tbody>
            {packages?.reverse().map((pkg) => {
              return (
                <tr key={pkg.id}>
                  <td>{pkg.dog}</td>
                  <td>{pkg.sessions}</td>
                  <td>{String(pkg.is_complete)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CreatePackage;

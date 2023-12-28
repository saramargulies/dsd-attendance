import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

function AddDog() {
  const [clients, setClients] = useState([]);
  const [groups, setGroups] = useState([]);
  const [weeklyClasses, setWeeklyClasses] = useState([]);
  const [formStyle, setFormStyle] = useState("d-inline");
  const [successStyle, setSuccessStyle] = useState(
    "alert alert-success d-none mb-0 alert-dismissible"
  );

  const [name, setName] = useState("");
  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
  };

  const [startedOn, setStartedOn] = useState("");
  const handleStartedOnChange = (event) => {
    const value = event.target.value;
    setStartedOn(value);
  };

  const [client, setClient] = useState("");
  const handleClientChange = (event) => {
    const value = event.target.value;
    setClient(value);
  };

  const [weekly, setWeekly] = useState("");
  const handleWeeklyChange = (event) => {
    const value = event.target.value;
    setWeekly(value);
  };

  const [group, setGroup] = useState("");
  const handleGroupChange = (event) => {
    const value = event.target.value;
    setGroup(value);
  };

  const fetchData = async () => {
    const weeklyUrl = `${process.env.REACT_APP_FASTAPI}/attendance/weekly/`;
    const clientUrl = `${process.env.REACT_APP_FASTAPI}/attendance/clients/`;
    const groupsUrl = `${process.env.REACT_APP_FASTAPI}/attendance/groups/`;

    const weeklyResponse = await fetch(weeklyUrl);
    const clientResponse = await fetch(clientUrl);
    const groupsResponse = await fetch(groupsUrl);

    if (weeklyResponse.ok && clientResponse.ok && groupsResponse.ok) {
      const weeklyData = await weeklyResponse.json();
      const clientsData = await clientResponse.json();
      const groupsData = await groupsResponse.json();
      setWeeklyClasses(weeklyData.weekly_classes);
      setGroups(groupsData.groups);
      setClients(clientsData.clients);
    } else {
      console.error(weeklyResponse, clientResponse, groupsResponse);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {};

    data.name = name;
    data.started_on = startedOn;
    data.client = client;
    data.group = group;
    data.w_class = weekly;

    const clientUrl = `${process.env.REACT_APP_FASTAPI}/attendance/dogs/`;
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
    if (response.ok) {
      setName("");
      setClient("");
      setWeekly("");
      setGroup("");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const success = () => {
    setFormStyle("d-none");
    setSuccessStyle("alert alert-success mb-0 alert-dismissible");
  };

  const reload = () => {
    window.location.reload();
  };

  let isDisabled = true;
  if (name && client && group && weekly) {
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
                  <form
                    className={formStyle}
                    onSubmit={handleSubmit}
                    id="create-tech-form"
                  >
                    <h1 className="card-title">Add a Dog</h1>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        placeholder="Dog's Name"
                        type="text"
                        onChange={handleNameChange}
                        value={name}
                        name="dogName"
                        id="dogName"
                        required
                      ></input>
                    </div>
                    <label htmlFor="startedOn">Start date:</label>
                    <input
                      className="form-control"
                      type="date"
                      onChange={handleStartedOnChange}
                      value={startedOn}
                      name="startedOn"
                      id="startedOn"
                      required
                    ></input>
                    <div className="mb-3"></div>
                    <div className="mb-3">
                      <select
                        onChange={handleClientChange}
                        value={client}
                        name="client"
                        id="client"
                        className="form-select"
                        required
                      >
                        <option value="">Choose a client</option>
                        {clients.map((client) => {
                          return (
                            <option key={client.id} value={client.name}>
                              {client.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="mb-3">
                      <select
                        onChange={handleGroupChange}
                        value={group}
                        name="group"
                        id="group"
                        className="form-select"
                        required
                      >
                        <option value="">Choose a group</option>
                        {groups.map((group) => {
                          return (
                            <option key={group.id} value={group.name}>
                              {group.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="mb-3">
                      <select
                        onChange={handleWeeklyChange}
                        value={weekly}
                        name="weekly_class"
                        id="weekly_class"
                        className="form-select"
                        required
                      >
                        <option value="">Choose a weekly class</option>
                        {weeklyClasses.map((weekly) => {
                          return (
                            <option
                              key={weekly.day_and_time}
                              value={weekly.day_and_time}
                            >
                              {weekly.day_and_time}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <button
                      onClick={success}
                      className="btn btn-lg btn-primary"
                      disabled={isDisabled}
                    >
                      Create
                    </button>
                  </form>
                  <div className={successStyle} id="success-message">
                    Thanks for adding a new dog!
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
    </>
  );
}

export default AddDog;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";

function UpdateDog() {
  let { id } = useParams();

  const [dog, setDog] = useState([]);
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
    const dogUrl = `${process.env.REACT_APP_FASTAPI}/attendance/dogs/${id}/`;
    const weeklyUrl = `${process.env.REACT_APP_FASTAPI}/attendance/weekly/`;
    const clientUrl = `${process.env.REACT_APP_FASTAPI}/attendance/clients/`;
    const groupsUrl = `${process.env.REACT_APP_FASTAPI}/attendance/groups/`;

    const dogResponse = await fetch(dogUrl);
    const weeklyResponse = await fetch(weeklyUrl);
    const clientResponse = await fetch(clientUrl);
    const groupsResponse = await fetch(groupsUrl);

    if (
      weeklyResponse.ok &&
      clientResponse.ok &&
      groupsResponse.ok &&
      dogResponse.ok
    ) {
      const dogData = await dogResponse.json();
      const weeklyData = await weeklyResponse.json();
      const clientsData = await clientResponse.json();
      const groupsData = await groupsResponse.json();
      setDog(dogData);
      setName(dogData.name);
      setWeekly(dogData.w_class);
      setClient(dogData.client);
      setGroup(dogData.group);
      setWeeklyClasses(weeklyData.weekly_classes);
      setGroups(groupsData.groups);
      setClients(clientsData.clients);
    } else {
      console.error(weeklyResponse, clientResponse, groupsResponse);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let data = {};

    data.name = name;
    data.client = client;
    data.group = group;
    data.w_class = weekly;

    const dogUrl = `${process.env.REACT_APP_FASTAPI}/attendance/dogs/${id}/`;
    const fetchConfig = {
      credentials: "include",
      method: "put",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    const response = await fetch(dogUrl, fetchConfig);
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
                    <h1 className="card-title">Update {dog.name}</h1>
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
                    <div className="mb-3">
                      <select
                        onChange={handleClientChange}
                        value={client}
                        name="client"
                        id="client"
                        className="form-select"
                        required
                        disabled
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
                    >
                      Update
                    </button>
                  </form>
                  <div className={successStyle} id="success-message">
                    Thanks for updating {dog.name}'s profile! You may now{" "}
                    <Link to={`/overview/${dog.id}`} className="link-secondary">
                      return to {dog.name}'s profile
                    </Link>
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

export default UpdateDog;

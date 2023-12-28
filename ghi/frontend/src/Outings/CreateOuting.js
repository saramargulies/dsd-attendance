import AsyncSelect from "react-select/async";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function CreateOuting() {
  const [groups, setGroups] = useState([]);
  const [formStyle, setFormStyle] = useState("d-inline");
  const [successStyle, setSuccessStyle] = useState(
    "alert alert-success d-none mb-0 alert-dismissible"
  );

  const [location, setLocation] = useState("");
  const handleLocationChange = (event) => {
    const value = event.target.value;
    setLocation(value);
  };

  const [address, setAddress] = useState("");
  const handleAddressChange = (event) => {
    const value = event.target.value;
    setAddress(value);
  };

  const [starts, setStarts] = useState("");
  const handleStartsChange = (event) => {
    const value = event.target.value;
    setStarts(value);
  };

  const [ends, setEnds] = useState("");
  const handleEndsChange = (event) => {
    const value = event.target.value;
    setEnds(value);
  };

  const [group, setGroup] = useState("");
  const handleGroupChange = (event) => {
    setGroup(event);
  };

  const fetchData = async () => {
    const url = `${process.env.REACT_APP_FASTAPI}/attendance/groups/`;

    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      setGroups(data.groups);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {};

    data.location = location;
    data.address = address;
    data.starts = starts;
    data.ends = ends;
    data.groups_invited = group.map((g) => {
      return g.label;
    });

    const submitUrl = `${process.env.REACT_APP_FASTAPI}/attendance/outings/`;
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

      setLocation("");
      setAddress("");
      setStarts("");
      setEnds("");
      setGroup("");
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
  const loadGroups = groups.map((group) => {
    return { value: group.id, label: group.name };
  });

  const loadOptions = (searchValue, callback) => {
    const filteredOptions = groups.filter((group) =>
      group.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredGroups = filteredOptions.map((group) => {
      return { value: group.id, label: group.name };
    });

    callback(filteredGroups);
  };

  let isDisabled = true;
  if (location && address && starts && ends && group) {
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
                      <h1 className="card-title">Create an Outing</h1>
                      <div className="mb-3">
                        <input
                          placeholder="Name of location"
                          onChange={handleLocationChange}
                          value={location}
                          name="location"
                          id="location"
                          className="form-control"
                          required
                        ></input>
                      </div>
                      <div className="mb-3">
                        <input
                          placeholder="Address"
                          onChange={handleAddressChange}
                          value={address}
                          name="address"
                          id="address"
                          className="form-control"
                          required
                        ></input>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-floating mb-3">
                            <input
                              onChange={handleStartsChange}
                              value={starts}
                              required
                              placeholder="Starts"
                              type="datetime-local"
                              id="starts"
                              name="starts"
                              className="form-control"
                            ></input>
                            <label htmlFor="starts">Starts:</label>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-floating mb-3">
                            <input
                              onChange={handleEndsChange}
                              value={ends}
                              required
                              placeholder="Ends"
                              type="datetime-local"
                              id="ends"
                              name="ends"
                              className="form-control"
                            ></input>
                            <label htmlFor="ends">Ends:</label>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-floating mb-3">
                            <AsyncSelect
                              simpleValue={true}
                              onChange={handleGroupChange}
                              value={group}
                              defaultOptions={loadGroups}
                              loadOptions={loadOptions}
                              placeholder="Select Groups"
                              isMulti
                              required
                            />
                          </div>
                        </div>
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
                    You've successfully created this outing! If you need to
                    change this outing, you can edit or delete it in the{" "}
                    <Link to="/outings" className="link-secondary">
                      View & Edit Outings
                    </Link>{" "}
                    page.
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

export default CreateOuting;

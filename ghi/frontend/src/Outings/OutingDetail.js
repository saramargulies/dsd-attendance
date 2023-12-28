import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


function OutingDetail() {
  let { id } = useParams();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [formStyle, setFormStyle] = useState("d-inline");
  const [successStyle, setSuccessStyle] = useState(
    "alert alert-success d-none mb-0 alert-dismissible"
  );
  const [deletedStyle] = useState(
    "alert alert-danger d-none mb-0"
  );
  const [warningStyle, setWarningStyle] = useState(
    "alert alert-danger d-none mb-0"
  );
  const [wantToDeleteStyle, setWantToDeleteStyle] = useState("in-line");
  const [outing, setOuting] = useState([]);

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
    const responses = await Promise.all([
      fetch(`${process.env.REACT_APP_FASTAPI}/attendance/outings/${id}/`),
      fetch(`${process.env.REACT_APP_FASTAPI}/attendance/groups/`),
    ]);

    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    if (data && data[0].groups_invited) {
      setOuting(data[0]);
      setLocation(data[0].location);
      setAddress(data[0].address);
      setGroups(data[1].groups);
      let g = data[0].groups_invited.map((grp) => {
        return data[1].groups.filter((g) => g.name === grp);
      });
      let filteredGroups = g.map((item) => {
        return { value: item[0].id, label: item[0].name };
      });
      setGroup(filteredGroups);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {};

    data.location = location;
    data.starts = starts;
    data.ends = ends;
    data.groups_invited = group.map((g) => {
      return g.label;
    });

    const submitUrl = `${process.env.REACT_APP_FASTAPI}/attendance/outings/${id}/`;
    const fetchConfig = {
      credentials: "include",
      method: "put",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    const response = await fetch(submitUrl, fetchConfig);
    if (response.ok) {
      setLocation("");
      setStarts("");
      setEnds("");
      setGroup("");
    }
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

  ////// I want to write a function that will connect to a button to "ARCHIVE a dog and take them off the overview or filter overview by year with tabs to navigate between years"

  function deleteOuting(id) {
    fetch(`${process.env.REACT_APP_FASTAPI}/attendance/outings/${id}/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    }).then((result) => {
      fetchData();
      result.json().then((resp) => {
        console.warn(resp);
      });
    });
    navigate("/outings/");
    // setWarningStyle("alert alert-warning d-none");
    // setDeletedStyle("");
  }
  let disableDelete = true;
  if (!outing.attendance_taken) {
    disableDelete = false;
  }

  const areYouSure = () => {
    setWantToDeleteStyle("d-none");
    setWarningStyle("alert alert-warning");
  };

  const goBack = () => {
    setWantToDeleteStyle("in-line");
    setWarningStyle("alert alert-warning d-none");
  };

  const success = () => {
    setFormStyle("d-none");
    setSuccessStyle("alert alert-success mb-0 alert-dismissible");
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
                      <h1 className="card-title">
                        Edit the {outing.location} Outing:
                      </h1>
                      <p className="mb-1">
                        Dates and times must be re-entered.
                      </p>
                      <p className="mb-3">
                        If you navigate away from this page before submitting
                        your changes will not be saved.
                      </p>
                      <div className="mb-3">
                        <input
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
                    You've successfully updated this outing! If you need to
                    change this outing, you can edit or delete it in the{" "}
                    <Link to="/outings" className="link-secondary">
                      View & Edit Outings
                    </Link>{" "}
                    page.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="my-5">
          <div className="row">
            <div className="col">
              <div className="card shadow" style={{ width: 18 + "rem" }}>
                <div className="card-body">
                  <div className={wantToDeleteStyle}>
                    <h2>Delete This Outing</h2>
                    <button
                      id="delete"
                      onClick={areYouSure}
                      className="btn btn-danger"
                      disabled={disableDelete}
                    >
                      Delete
                    </button>
                  </div>
                  <div
                    className={warningStyle}
                    id="warning-message"
                    role="alert"
                  >
                    Are you sure you want to permanently delete this outing?
                    This can't be undone.
                    <button
                      id="delete"
                      onClick={() => deleteOuting(outing.id)}
                      type="button"
                      className="btn btn-danger"
                      data-bs-dismiss="alert"
                      disabled={disableDelete}
                    >
                      Delete
                    </button>
                    <button
                      onClick={goBack}
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="alert"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className={deletedStyle} id="deleted-message">
                    You've permanently deleted this outing.
                    <Link to="/outings" className="link-secondary">
                      View & Edit Outings
                    </Link>{" "}
                    page.
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

export default OutingDetail;

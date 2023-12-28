import AsyncSelect from "react-select/async";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AlertError, AlertSuccess } from "../Global/Alerts";
import { Spinner } from "../Global/Spinner";

function ClassAttendance() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tableLoading, setTableLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [dogs, setDogs] = useState([]);
  const [weeklyClasses, setWeeklyClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formStyle, setFormStyle] = useState("d-inline");
  const [alertStyle, setAlertStyle] = useState("alert alert-warning d-none");
  // const [successStyle, setSuccessStyle] = useState(
  //   "alert alert-success d-none mb-0 alert-dismissible"
  // );

  const [weekly, setWeekly] = useState("");
  const handleWeeklyChange = (event) => {
    const value = event.target.value;
    setWeekly(value);
  };

  const [dog, setDog] = useState("");
  const handleDogChange = (selectedOption) => {
    setDog(selectedOption);
  };

  let selectedDogs = [];
  if (dog) {
    selectedDogs = dog.map((d) => {
      return d["label"];
    });
  }

  const [date, setDate] = useState("");
  const handleDateChange = (event) => {
    const value = event.target.value;
    setDate(value);
  };

  const fetchRecentClasses = async () => {
    const classesUrl = `${process.env.REACT_APP_FASTAPI}/attendance/classes/`;

    const classesResponse = await fetch(classesUrl, {
      credentials: "include",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    });
    if (classesResponse.ok) {
      const classesData = await classesResponse.json();
      setClasses(classesData.results);
    }
    setTableLoading(false)
  };

  const fetchFormOptions = async () => {
    setFormLoading(true)
    const responses = await Promise.all([fetch(`${process.env.REACT_APP_FASTAPI}/attendance/dogs/`), fetch(`${process.env.REACT_APP_FASTAPI}/attendance/weekly/`)])

    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    if (data) {
      setDogs(data[0].dogs);
      setWeeklyClasses(data[1].weekly_classes);
    }
    setFormLoading(false);
  };

  const handleSubmit = async (event) => {
    setFormLoading(true);
    setTableLoading(true);
    event.preventDefault();

    const data = {};

    data.occurred_on = date;
    if (dog) {
      data.class_attendance = dog.map((d) => {
        return d.value;
      });
    } else {
      data.class_attendance = [];
    }
    data.weekly_class = weekly;
    console.log(data)

    const classesUrl = `${process.env.REACT_APP_FASTAPI}/attendance/classes/`;
    const fetchConfig = {
      credentials: "include",
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
    setAlertStyle("alert alert-warning d-none");
    const response = await fetch(classesUrl, fetchConfig);
    console.log(response)
    if (response.ok) {
      setFormStyle("d-inline");
      setSuccessMessage("Attendance successfully taken.");
      setWeekly("");
      setDog("");
      setDate("");
      fetchRecentClasses();
    } else {
      setFormStyle("d-inline");
      setErrorMessage("Something went wrong when taking attendance");
      setWeekly("");
      setDog("");
      setDate("");
    }
    setTableLoading(false);
    setFormLoading(false);
  };
  console.log(weekly)

  useEffect(() => {
    fetchFormOptions();
    fetchRecentClasses();
  }, []);

  const defaultDogs = dogs.map((dog) => {
    return { value: dog.id, label: `${dog.name} - ${dog.client}` };
  });

  const loadOptions = (searchValue, callback) => {
    const filteredOptions = dogs.filter((dog) =>
      dog.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredDogs = filteredOptions.map((dog) => {
      return { value: dog.id, label: `${dog.name} - ${dog.client}` };
    });

    callback(filteredDogs);
  };
  const areYouSure = () => {
    setFormStyle("d-none");
    setAlertStyle("alert alert-warning");
  };

  const goBack = () => {
    setFormStyle("d-inline");
    setAlertStyle("alert alert-warning d-none");
  };

  let isDisabled = true;
  if (weekly && date) {
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
                      <h1 className="card-title">Take Class Attendance</h1>
                      <p className="mb-3">
                        Please choose which class you're taking attendance for.
                      </p>
                      {successMessage && (
                        <AlertSuccess>
                          Attendance successfully taken.
                        </AlertSuccess>
                      )}
                      {errorMessage && <AlertError>{errorMessage}</AlertError>}
                      {!formLoading ? (
                        <>
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
                                    value={weekly.id}
                                  >
                                    {weekly.day_and_time}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="row">
                            <div className="col">
                              <div className="form-floating mb-3">
                                <input
                                  onChange={handleDateChange}
                                  value={date}
                                  required
                                  placeholder="Date"
                                  type="date"
                                  id="date"
                                  name="date"
                                  className="form-control"
                                ></input>
                                <label htmlFor="name">Date:</label>
                              </div>
                            </div>
                            <div className="col">
                              <div className="form-floating mb-3">
                                <AsyncSelect
                                  simpleValue={true}
                                  onChange={handleDogChange}
                                  value={dog}
                                  defaultOptions={defaultDogs}
                                  loadOptions={loadOptions}
                                  placeholder="Select Dogs"
                                  isMulti
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={areYouSure}
                            className="btn btn-lg btn-primary"
                            disabled={isDisabled}
                          >
                            Submit
                          </button>
                          <div className="alert alert-warning"role="alert" id="warning">
                            <h4 className="alert-heading">
                              Are you sure you're ready to submit this outing's
                              attendance?
                            </h4>
                            <p>
                              This action cannot be undone without an
                              administrator.
                            </p>
                            <p>Class: {weekly}</p>
                            <p>Dogs: {selectedDogs.join(", ")}</p>
                            <hr></hr>
                            <div className="row">
                              <div className="mb-0 col-content-end">
                                <button
                                  onClick={goBack}
                                  type="button"
                                  className="btn btn-lg btn-danger"
                                >
                                  Go Back
                                </button>
                              </div>
                              <div className="mb-0 col">
                                <button className="btn btn-lg btn-primary">
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Spinner></Spinner>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="m-3 font-link">
        <h1>Most recent classes</h1>
      </div>
      {!tableLoading ? (
        <div className="container shadow table-responsive font-link pt-2">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weekly Class</th>
                <th>Dogs</th>
              </tr>
            </thead>
            <tbody>
              {classes
                ?.slice(-10)
                .reverse()
                .map((cla) => {
                  return (
                    <tr key={cla.id}>
                      <td>{cla.occurred_on}</td>
                      <td>{cla.weekly_class.day_and_time}</td>
                      <td>
                        {cla.class_attendance.map((dog) => {
                          let str = "";
                          if (
                            dog ===
                            cla.class_attendance[
                              cla.class_attendance.length - 1
                            ]
                          ) {
                            let lastStr = str.concat(dog.name);
                            return lastStr;
                          } else {
                            let newStr = str.concat(dog.name + ", ");
                            return newStr;
                          }
                        })}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <Spinner></Spinner>
      )}
    </>
  );
}

export default ClassAttendance;

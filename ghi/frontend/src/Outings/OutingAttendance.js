import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import Cookies from "js-cookie";

function OutingAttendance() {
  const [dogs, setDogs] = useState([]);
  const [outings, setOutings] = useState([]);
  const [formStyle, setFormStyle] = useState("");
  const [alertStyle, setAlertStyle] = useState("alert alert-warning d-none");
  const [successStyle, setSuccessStyle] = useState(
    "alert alert-success d-none mb-0 alert-dismissible"
  );

  const [outing, setOuting] = useState("");
  const handleOutingChange = (event) => {
    const value = event.target.value;
    setOuting(value);
  };

  const [dog, setDog] = useState("");
  const handleDogChange = (event) => {
    setDog(event);
  };

  let selectedDogs = [];
  if (!(dog === "")) {
    selectedDogs = dog.map((d) => {
      return d["label"];
    });
  }

  const fetchData = async () => {
    const outingUrl = `${process.env.REACT_APP_DJANGO_API}/attendance/outings/`;
    const dogsUrl = `${process.env.REACT_APP_DJANGO_API}/attendance/dogs/`;

    const outingResponse = await fetch(outingUrl);
    const dogsResponse = await fetch(dogsUrl);

    if (outingResponse.ok) {
      const outingData = await outingResponse.json();
      const dogsData = await dogsResponse.json();
      const outing_list = outingData.outings.filter((outing) => {
        if (outing.attendance_taken === false) {
          return outing;
        }
      });

      setOutings(outing_list);
      setDogs(dogsData.dogs);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {};
    if (dog) {
      data.outing_attendance = dog.map((d) => {
        return d.value;
      });
    } else {
      data.outing_attendance = [];
    }

    const submitUrl = `${process.env.REACT_APP_DJANGO_API}/attendance/outings/${outing}/take_attendance`;

    const fetchConfig = {
      credentials: "include",
      method: "put",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    const submitResponse = await fetch(submitUrl, fetchConfig);
    if (submitResponse.ok) {
      setDog("");
      setOuting("");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const defaultDogs = dogs.map((dog) => {
    return { value: dog.id, label: dog.name };
  });

  const loadDogs = (searchValue, callback) => {
    const filteredOptions = dogs.filter((dog) =>
      dog.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredDogs = filteredOptions.map((dog) => {
      return { value: dog.id, label: dog.name };
    });

    callback(filteredDogs);
  };

  const areYouSure = () => {
    setFormStyle("d-none");
    setAlertStyle("alert alert-warning");
  };

  const goBack = () => {
    setFormStyle("");
    setAlertStyle("alert alert-warning d-none");
  };

  const success = () => {
    setFormStyle("d-none");
    setAlertStyle("alert alert-warning d-none");
    setSuccessStyle("alert alert-success mb-0 alert-dismissible");
  };
  const reload = () => {
    window.location.reload();
  };

  let isDisabled = true;
  if (outing) {
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
                  <form onSubmit={handleSubmit} id="outing-attendance-form">
                    <div className={formStyle}>
                      <h1 className="card-title">Take Outing Attendance</h1>
                      <p className="mb-3">
                        Please choose which outing you're taking attendance for.
                      </p>
                      <div className="mb-3">
                        <select
                          onChange={handleOutingChange}
                          value={outing}
                          name="outing"
                          id="outing"
                          className="form-select"
                          required
                        >
                          <option value="">Choose an outing</option>
                          {outings.map((outing) => {
                            return (
                              <option key={outing.id} value={outing.id}>
                                {outing.location}, {outing.starts}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-floating mb-3">
                            <AsyncSelect
                              simpleValue={true}
                              onChange={handleDogChange}
                              value={dog}
                              defaultOptions={defaultDogs}
                              loadOptions={loadDogs}
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
                    </div>
                    <div className={alertStyle} role="alert" id="warning">
                      <h4 className="alert-heading">
                        Are you sure you're ready to submit this outing's
                        attendance?
                      </h4>
                      <p>
                        This action cannot be undone without an administrator.
                      </p>
                      <p>
                        Outing:{" "}
                        {outings.map((out) => {
                          if (out.id === Math.floor(outing)) {
                            return out.location;
                          }
                        })}
                      </p>
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
                        <div onClick={success} className="mb-0 col">
                          <button className="btn btn-lg btn-primary">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className={successStyle} id="success-message">
                    Thanks for taking attendance!
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

export default OutingAttendance;

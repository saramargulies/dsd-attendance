import { useState, useEffect } from "react";
import "../App.css";
import Cookies from "js-cookie";

function MainPage() {
  const [notes, setNotes] = useState([]);
  const [classes, setClasses] = useState([]);

  const [note, setNote] = useState("");
  const handleNoteChange = (event) => {
    const value = event.target.value;
    setNote(value);
  };

  const fetchData = async () => {
    const responses = await Promise.all([
      fetch(`${process.env.REACT_APP_DJANGO_API}/attendance/notes/`),
      fetch(`${process.env.REACT_APP_DJANGO_API}/attendance/classes/`),
    ]);

    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    if (data) {
      setNotes(data[0].notes);
      setClasses(data[1].classes);
    }
  };
  let i = 0;

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {};

    data.note = note;

    const notesUrl = `${process.env.REACT_APP_DJANGO_API}/attendance/notes/`;
    const fetchConfig = {
      credentials: "include",
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    console.log(notesUrl)
    const response = await fetch(notesUrl, fetchConfig);
    if (response.ok) {
      setNote("");
      fetchData()
    }
  };


  const dismissNote = (id) => {
    fetch(`${process.env.REACT_APP_DJANGO_API}/attendance/notes/${id}/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    }).then((result) => {
      fetchData();
      result.json().then((resp) => {
        console.warn(resp);
      });
    });
  };

  return (
    <>
      <h1 className="mt-3">Welcome to the DSD Attendance Manager! </h1>
      <hr></hr>
      <div className="row">
        <div className="col">
          <div className="container">
            <div className="my-5">
              <div className="row">
                <div className="col">
                  <div className="card shadow">
                    <div className="card-body">
                      <form onSubmit={handleSubmit} id="create-tech-form">
                        <h2 className="card-title">Notes</h2>
                        <div className="mb-3 input-group">
                          <input
                            className="form-control "
                            placeholder="Add a new note here..."
                            type="text"
                            onChange={handleNoteChange}
                            value={note}
                            name="note"
                            id="note"
                            required
                          ></input>
                          <button
                            className="btn btn-lg btn-primary"
                          >
                            Create
                          </button>
                        </div>
                        <div>
                          {notes.map((note) => {
                            i++;
                            if (!note.is_completed) {
                              return (
                                <div key={i} className="card mb-3 p-3">
                                  <div className="card-body">
                                    <h5 className="card-title">{note.note}</h5>
                                    <h6 className="card-subtitle text-muted">
                                      Created on {note.date_added}
                                    </h6>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => dismissNote(note.id)}
                                    className="btn btn-lg btn-primary"
                                  >
                                    Dismiss
                                  </button>
                                </div>
                              );
                            }
                          })}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="container">
            <div className="my-5">
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="card-title">Recent Attendance Records</h2>
                  <div className="table-responsive font-link pt-2">
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
                          ?.slice(-5)
                          .reverse()
                          .map((cla) => {
                            return (
                              <tr key={cla.id}>
                                <td>{cla.occurred_on}</td>
                                <td>{cla.weekly_class}</td>
                                <td>
                                  {cla.class_attendance.map((dog) => {
                                    let str = "";
                                    if (
                                      dog ===
                                      cla.class_attendance[
                                        cla.class_attendance.length - 1
                                      ]
                                    ) {
                                      let lastStr = str.concat(dog);
                                      return lastStr;
                                    } else {
                                      let newStr = str.concat(dog + ", ");
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;

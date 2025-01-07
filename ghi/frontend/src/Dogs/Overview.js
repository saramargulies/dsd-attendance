import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../Global/Spinner";
import Cookies from "js-cookie";

function Overview() {
  const [dogs, setDogs] = useState([]);
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [years] = useState([]);

  const handleYearChange = (event) => {
    const value = event.target.value;
    setYear(value);
  };

  const fetchData = async () => {
    setLoading(true);
    const url = `${process.env.REACT_APP_DJANGO_API}/attendance/dogs/`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setDogs(data.dogs);
    }
    setLoading(false);
  };

  async function archiveButton(dog) {
    setLoading(true);
    const data = {};

    data.name = dog.name;
    data.client = dog.client;
    data.group = dog.group;
    data.w_class = dog.w_class;
    data.archived = !dog.archived;

    fetch(`${process.env.REACT_APP_DJANGO_API}/attendance/dogs/${dog.id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
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
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  let yearsInDogs = [];
  let i = 2023;
  if (dogs) {
    for (let dog of dogs) {
      for (let clss of dog.classes) {
        if (clss.includes(i) && !years.includes(i)) {
          yearsInDogs.push(i);
          i++;
        }
      }
    }
  }

  const filterDogs = function (dogs, year) {
    let result = [];
    if (year === "archived") {
      for (let dog of dogs) {
        if (dog.archived) {
          result.push(dog);
        }
      }
    } else {
      for (let dog of dogs) {
        if (!dog.archived) {
          if (dog.classes.length === 0) {
            result.push(dog);
          }
          for (let clss of dog.classes) {
            if (clss.includes(year) && !result.includes(dog)) {
              result.push(dog);
            }
          }
        }
      }
    }

    return result;
  };

  return (
    <>
      <div className="mb-3 mt-3 font-link">
        <h1>Attendance Overview</h1>
      </div>
      <div className="mb-3">
        <Link to="/clients" className="btn btn-secondary mr-4">
          Add a client
        </Link>
        <Link to="/overview/add-dog" className="btn btn-secondary ml-4">
          Add a dog
        </Link>
      </div>
      <div className="mb-3">
        <select
          onChange={handleYearChange}
          value={year}
          name="year"
          id="year-filter"
          className="form-select "
          required
        >
          <option value="">Filter</option>
          <option value="archived">Archived</option>
          {yearsInDogs.map((year) => {
            return (
              <option value={year} key={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <div className="container shadow table-responsive font-link pt-2">
        {!loading ? (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Dog</th>
                <th>Client</th>
                <th>Group</th>
                <th>Weekly Class</th>
                <th>Started On</th>
                <th>Class Attended</th>
                <th>Class Available</th>
                <th>Outing Attended</th>
                <th>Outing Available</th>
                <th>Archive Dog</th>
              </tr>
            </thead>
            <tbody>
              {filterDogs(dogs, year).map((dog) => {
                return (
                  <tr key={dog.id}>
                    <td className="fixed-side">
                      <Link
                        className="link"
                        to={`${dog.id}`}
                        aria-current="page"
                      >
                        {dog.name}
                      </Link>
                    </td>
                    <td>{dog.client}</td>
                    <td>{dog.group}</td>
                    <td>{dog.w_class}</td>
                    <td>{dog.started_on}</td>
                    <td>{dog.classes.length * 1.5}</td>
                    <td>{dog.class_available}</td>
                    <td>
                      {dog.outings.map((outing) => {
                        return parseFloat(outing.hours)
                      }).reduce(
                        (accumulator, currentValue) => accumulator + currentValue,
                        0,
                      )}
                    </td>
                    <td>{dog.outing_available}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => archiveButton(dog)}
                        aria-current="page"
                      >
                        {dog.archived ? "Unarchive" : "Archive"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Spinner></Spinner>
        )}
      </div>
    </>
  );
}

export default Overview;

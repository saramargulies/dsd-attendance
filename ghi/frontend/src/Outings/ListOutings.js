import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ListOutings() {
  const [outings, setOutings] = useState([]);
  const [years] = useState([]);
  const [year, setYear] = useState("");

  const handleYearChange = (event) => {
    const value = event.target.value;
    setYear(value);
  };

  const filterOutings = function (outings, year) {
    let result = [];
    for (const out of outings) {
      if (out.starts.includes(year)) {
        result.push(out);
      }
    }
    return result;
  };

  const fetchData = async () => {
    const url = `${process.env.REACT_APP_FASTAPI}/attendance/outings/`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setOutings(data.outings);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let yearsInOutings = [];
  let i = 2023;
  if (outings) {
    for (let day of outings) {
      if (day.starts.includes(i) && !years.includes(i)) {
        yearsInOutings.push(i);
        i++;
      }
    }
  }

  return (
    <>
      <h1>Outing Overview</h1>
      <div className="m-3 font-link"></div>
      <div className="mb-3">
        <select
          onChange={handleYearChange}
          value={year}
          name="year"
          id="year-filter"
          className="form-select "
          required
        >
          <option value="">Filter by year</option>
          {yearsInOutings.map((year) => {
            return (
              <option value={year} key={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
      <div className="container shadow table-responsive font-link pt-2">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th className="">Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Address</th>
              <th>Groups Invited</th>
              <th>Edit Outing</th>
              <th>Attendance Taken?</th>
            </tr>
          </thead>
          <tbody>
            {filterOutings(outings, year)
              .reverse()
              .map((outing) => {
                return (
                  <tr className="object-fit" key={outing.id}>
                    <td>{outing.location}</td>
                    <td>{outing.starts.slice(0, -9)}</td>
                    <td>
                      {outing.starts.slice(-7, -2)}-{outing.ends.slice(-7)}
                    </td>
                    <td>{outing.address}</td>
                    <td>{outing.groups_invited}</td>
                    <td className="fixed-side">
                      <Link
                        className="link"
                        to={`${outing.id}`}
                        aria-current="page"
                      >
                        Edit
                      </Link>
                    </td>
                    <td>{String(outing.attendance_taken)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ListOutings;

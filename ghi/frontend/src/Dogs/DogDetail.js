import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "../Global/Spinner";

function DogDetail() {
  let { id } = useParams();

  const [dog, setDog] = useState({});
  const [privateLog, setPrivateLog] = useState([])
  const [classDates, setClassDates] = useState([]);
  const [outings, setOutings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const url = `${process.env.REACT_APP_FASTAPI}/attendance/dogs/${id}/`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setDog(data);
      setClassDates(data.classes);
      setOutings(data.outings);
      setPrivateLog(data.pvt_log)
      id = data.id;
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);


  let yearsInAttendance = [];
  let i = 2023;
  for (let date of classDates) {
    if (date.includes(i) && !yearsInAttendance.includes(i)) {
      yearsInAttendance.push(i);
      i++;
    }
  }

  const filterClasses = (classes, year) => {
    let months = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };
    for (let month in months) {
      for (let date of classDates) {
        if (date.includes(month) && date.includes(year)) {
          months[month] += 1.5;
        }
      }
    }
    return months;
  };
  const filterOutings = (outings, year) => {
    let months = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    for (let month in months) {
      for (let event of outings) {
        if (event.date.includes(month) && event.date.includes(year)) {
          months[month] += Number(event.hours);
        }
      }
    }

    let quarters = {
      Q1: months["January"] + months["February"] + months["March"],
      Q2: months["April"] + months["May"] + months["June"],
      Q3: months["July"] + months["August"] + months["September"],
      Q4: months["October"] + months["November"] + months["December"],
    };
    return quarters;
  };

  return (
    <>
      <div className="card mb-3 shadow">
        <div className="card-body table-responsive">
          <h5 className="card-title d-flex justify-content-between">
            {dog.name}{" "}
            <div>
              <Link
                className="btn btn-secondary"
                to={`/overview/${dog.id}/update`}
                aria-current="page"
              >
                Edit
              </Link>
            </div>
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">{dog.client}</h6>

          <div className="">
            {!loading ? (
              <table className="table table-bordered">
                <thead>
                  <tr className="object-fit">
                    <td>Weekly Class</td>
                    <td>Group</td>
                    <td>Started On</td>
                    <td>
                      Class Hours<br></br>Attended/Available
                    </td>
                    <td>
                      Outing Hours<br></br>Attended/Available
                    </td>
                    <td>
                      Private Sessions<br></br>Attended/Available
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{dog.w_class}</td>
                    <td>{dog.group}</td>
                    <td>{dog.started_on}</td>
                    <td>{`${dog.class_count}/${dog.class_available}`}</td>
                    <td>{`${dog.outing_count}/${dog.outing_available}`}</td>
                    <td>{`${dog.pvt_count}/${dog.pvt_avail}`}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <Spinner></Spinner>
            )}
          </div>
        </div>
      </div>
      <div className="card mb-3 shadow">
        <div className="card-body table-responsive">
          <h6 className="card-subtitle mb-2 text-muted">
            Class attendance by month & year
          </h6>
          <table className="table table-bordered">
            <thead>
              <tr className="object-fit">
                <td>Year</td>
                <td>Jan</td>
                <td>Feb</td>
                <td>Mar</td>
                <td>Apr</td>
                <td>May</td>
                <td>Jun</td>
                <td>Jul</td>
                <td>Aug</td>
                <td>Sep</td>
                <td>Oct</td>
                <td>Nov</td>
                <td>Dec</td>
              </tr>
            </thead>
            <tbody>
              {yearsInAttendance.map((yearInAttendance) => {
                return (
                  <tr key={yearInAttendance}>
                    <td>{yearInAttendance}</td>
                    {Object.values(
                      filterClasses(classDates, yearInAttendance)
                    ).map((month) => {
                      i++;
                      return <td key={i}>{month}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card mb-3 shadow">
        <div className="card-body table-responsive">
          <h6 className="card-subtitle mb-2 text-muted">
            Outing attendance by quarter
          </h6>
          <table className="table table-bordered">
            <thead>
              <tr className="object-fit">
                <td>Year</td>
                <td>Q1</td>
                <td>Q2</td>
                <td>Q3</td>
                <td>Q4</td>
              </tr>
            </thead>
            <tbody>
              {yearsInAttendance.map((yearInAttendance) => {
                return (
                  <tr key={yearInAttendance}>
                    <td>{yearInAttendance}</td>
                    {Object.values(
                      filterOutings(outings, yearInAttendance)
                    ).map((quarter) => {
                      i++;
                      return <td key={i}>{quarter}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="container text-center">
        <div className="row align-items-start">
          <div className="col">
            <div className="col card mb-3 shadow">
              <div className="card-body">
                <p className="card-title">Outing Log</p>
                <table className="table table-bordered">
                  <thead>
                    <tr className="object-fit">
                      <td className="bold">Location</td>
                      <td>Date</td>
                      <td>Hours</td>
                    </tr>
                  </thead>
                  <tbody>
                    {dog?.outings?.map((outing) => {
                      return (
                        <tr key={i++}>
                          <td>{outing.location}</td>
                          <td>{outing.date}</td>
                          <td>{outing.hours}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="col card mb-3 shadow">
              <div className="card-body">
                <p className="card-title">Class Log</p>
                <table className="table table-bordered">
                  <thead>
                    <tr className="object-fit">
                      <td>Date</td>
                    </tr>
                  </thead>
                  <tbody>
                    {dog?.classes?.map((class_instance) => {
                      return (
                        <tr className="object-fit" key={class_instance}>
                          <td>{class_instance}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="col card mb-3 shadow">
              <div className="card-body">
                <p className="card-title">Private Log</p>
                <table className="table table-bordered">
                  <thead>
                    <tr className="object-fit">
                      <td>Date</td>
                    </tr>
                  </thead>
                  <tbody>
                    {privateLog.map((date) => {
                      return (
                        <tr className="object-fit" key={i++}>
                          <td>{date}</td>
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
    </>
  );
}

export default DogDetail;

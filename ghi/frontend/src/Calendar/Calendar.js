import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./calendar.css";

function AddCalendar() {
  const localizer = momentLocalizer(moment);
  const [myEventsList, setMyEventsList] = useState([]);

  const componentDidUpdate = async () => {
    const url = `${process.env.REACT_APP_DJANGO_API}/attendance/calendar/`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      let eventsList = [];

      for (let outing of data.outings) {
        let starts = new Date(outing.starts);
        let ends = new Date(outing.ends);

        let title = `
          ${outing.location}`;
        eventsList.push({
          start: new Date(outing.starts),
          end: new Date(outing.ends),
          title: title,
        });

        title = `${outing.address} Grps: ${outing.groups_invited}`;
        eventsList.push({
          start: new Date(outing.starts),
          end: new Date(outing.ends),
          title: title,
        });

        title = `${new Date(starts.valueOf() + 21600000)
          .toLocaleString()
          .slice(-11)
          .slice(0, 5)} -${new Date(ends.valueOf() + 21600000)
          .toLocaleString()
          .slice(-11)
          .slice(0, 5)}${new Date(ends.valueOf() + 21600000)
          .toLocaleString()
          .slice(-2)}`;
        eventsList.push({
          start: new Date(outing.starts),
          end: new Date(outing.ends),
          title: title,
        });

        // title = `${new Date(outing.starts).toLocaleString().slice(-11).slice(0,5)}-${new Date(outing.ends).toLocaleString().slice(-11).slice(0,5)}${new Date(outing.ends).toLocaleString().slice(-2)}`
        // eventsList.push({start: new Date(outing.starts), end: new Date(outing.ends), title: title})
      }

      setMyEventsList(eventsList);
    }
  };
  useEffect(() => {
    componentDidUpdate();
  }, []);


  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 715 }}
      />
    </div>
  );
}
export default AddCalendar;

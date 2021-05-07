import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { newReservations } from "../utils/api";
import { formatAsDate, today } from "../utils/date-time";
import ReservationError from "./ReservationError";

function CreateReservation() {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState([]);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const [lastName, setLastName] = useState("");

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const [mobileNumber, setMobileNumber] = useState("");

  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const [date, setDate] = useState("");

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const [time, setTime] = useState("");

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const [people, setPeople] = useState("");

  const handlePeopleChange = (e) => {
    setPeople(e.target.value);
  };

  function previousPage() {
    history.goBack();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitErrors = [];

    //if date is less than today at this hour || tuesday || !10:30am - 9:30pm

    //check if reserving in the past
    if (date < today()) {
      submitErrors.push("No reservations before today");

    }

    //check if time is after hours
    let replacedTime = time.replace(":", "");
    if (replacedTime < 1030 || replacedTime > 2130) {
      submitErrors.push("After hours");

    }

    //check if tuesday
    let newDate = new Date(date);
    let dayOfWeek = newDate.getDay();
    if (dayOfWeek === 1) {
      submitErrors.push("Restaurant is closed on Tuesdays");

    }
    if (submitErrors.length) {
      setError(submitErrors);
      return;
    }

    try {
      await newReservations({
        first_name: firstName,
        last_name: lastName,
        mobile_number: mobileNumber,
        people: Number(people),
        reservation_time: time,
        reservation_date: date,
        status: "booked",
      });
      history.push(`/dashboard?date=${formatAsDate(date)}`);
    } catch (err) {
      console.log(err);
    }

  };  
  return (
    <div>
      {error.length
        ? error.map((err) => {
            return <ReservationError err={err} key={err} />;
          })
        : ""}
      <h2>Create a reservation</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name:
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            className="form-control"
            onChange={handleFirstNameChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleName" className="form-label">
            Last Name:
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            className="form-control"
            onChange={handleLastNameChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number:
          </label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="text"
            className="form-control"
            onChange={handleMobileNumberChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reservation_date" className="form-label">
            Date of Reservation:
          </label>
          <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            className="form-control"
            onChange={handleDateChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reservation_time" className="form-label">
            Time of Reservation:
          </label>
          <input
            id="reservation_time"
            name="reservation_time"
            type="time"
            className="form-control"
            onChange={handleTimeChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="people" className="form-label">
            Number of People:
          </label>
          <input
            id="people"
            name="people"
            type="text"
            className="form-control"
            onChange={handlePeopleChange}
          />
        </div>

        <button
          type="button"
          onClick={previousPage}
          className="btn btn-secondary"
        >
          {``} {``} Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          type="submit"
        >
          {``} {``} Submit
        </button>
      </form>
    </div>
  );
}

export default CreateReservation;

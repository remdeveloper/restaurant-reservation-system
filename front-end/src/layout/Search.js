import React, { useState } from "react";
import Reservation from "./Reservation";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

/**
 * Search Form Component
 * @returns {JSX.Element}
 */
export default function Search() {
  const [mobile_number, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const reservationsList = reservations.map((reservation, index) => {
    return <Reservation reservation={reservation} key={index} />;
  });

  const handleChange = (e) => setMobileNumber(e.target.value);

  const handleSearch = (e) => {
    e.preventDefault();

    const abortController = new AbortController();

    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .then(() =>
        reservationsList.length === 0
          ? setError({ message: "No reservations found" })
          : setError(null)
      )
      .catch(setError);
  };

  return (
    <>
      <h2 className="text-center rtHead pb-2">Search for Reservation</h2>
      <div className="d-flex flex-column align-items-center">
        <form onSubmit={handleSearch} className="mt-3 w-50">
          <div className="form-group">
            <input
              name="mobile_number"
              placeholder="Enter a customer's phone number"
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="button mx-3 px-3">
            Find
          </button>
        </form>
        {reservationsList.length !== 0 ? <h3>Reservations</h3> : ""}
        {reservationsList.length === 0 ? <ErrorAlert error={error} /> : ""}
        {reservationsList}
      </div>
    </>
  );
}

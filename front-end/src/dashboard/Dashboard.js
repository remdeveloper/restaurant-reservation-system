import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link, useLocation } from "react-router-dom";
import Reservation from "../layout/Reservation";
import Table from "../layout/Table"
import { next, previous, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date}) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  //getting the date from the url query /dashboard?date=2035-12-30
  let location = useLocation();
  // console.log(location.search, "location.search");
  let urlDate = new URLSearchParams(location.search).get("date");
  // console.log(reservations, "reservations")

  function showReservations() {
    //console.log('this is the date from dashboard.js', date);
    //console.log('this is the urldate from dashboard.js', urlDate);
    //show reservations in the url date or today's date
    let filterDate = urlDate || date;
    return reservations
      .filter((reservation) => {
        return reservation.reservation_date === filterDate;
      })
      .filter((reservation)=>{
        return reservation.status !== "finished"
      })
      .filter((reservation)=>{
        return reservation.status !== "cancelled"
      })
      .map((reservation) => {
        return (
          <Reservation
            reservation={reservation}
            key={reservation.reservation_id}       
          />
        );
      });
  }

  function showTables(){
    return(
      tables.map((table,index)=>{
      return(
        <Table table={table} key={index} />
      )
      })
    )
    
  }

date = urlDate || date;
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    //console.log('this is the date in dashboard.js', date)
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations( {date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch((err) => console.error(err));
    //console.log('reservations in dashboard',reservations)
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>

      {/* how do i make these increment days? */}
      <Link to={`/dashboard?date=${previous(urlDate)}`} className="btn btn-secondary">
        {``} {``} Previous
      </Link>

      <Link to={`/dashboard?date=${today()}`} className="btn btn-secondary">
        {``} {``} Today
      </Link>

      <Link to={`/dashboard?date=${next(urlDate)}`} className="btn btn-secondary">
        {``} {``} Next
      </Link>

      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {showReservations()}
      {showTables()}
      {/* map list of reservations */}
    </main>
  );
}

export default Dashboard;

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { cancelReservation } from "../utils/api";

//called in dashboard
function Reservation({ reservation }) {
  //const [statusState, setStatusState] = useState("booked");
  const history = useHistory();

  const {
    created_at,
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_id,
    reservation_time,
    updated_at,
    status,
  } = reservation;

  async function handleSeat(e) {
    e.preventDefault();
    //setStatusState("seated");

    //change status from booked to seated

    try {
      history.push(`/reservations/${reservation.reservation_id}/seat`);
    } catch (err) {
      console.log(err);
    }
  }

  const handleCancel = async (e) => {
    e.preventDefault();

    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const status = await cancelReservation(reservation.reservation_id);

      if (status === 200) window.location.reload();
    }
  };

  return (
    <div className="card" key={reservation_id}>
      <h5 className="card-header">{first_name} {last_name}</h5>     
      <p className="card-text">Mobile number: {mobile_number}</p>
      <p className="card-text">People:{people}</p>
      <p className="card-text">Reservation date:{reservation_date}</p>
      <p className="card-text">Reservation id:{reservation_id}</p>
      <p className="card-text">Reservation time:{reservation_time}</p>
      <p className="card-text">Updated at:{updated_at}</p>
      <p className="card-text">Created at:{created_at}</p>
      <p className="card-text" data-reservation-id-status={reservation.reservation_id}>{status && status}</p>
      <br></br>

      {/* ternary to show seat button only when status is booked */}
      {status === "booked" ? (
        <div>
          <Link to={`/reservations/${reservation.reservation_id}/seat`}
            onClick={handleSeat}
            href={`/reservations/${reservation.reservation_id}/seat`}
            className="btn btn-primary"
          >
            Seat
          </Link>
          <Link
            to={`/reservations/${reservation.reservation_id}/edit`}
            href={`/reservations/${reservation.reservation_id}/edit`}
            className="btn btn-primary"
          >
            <span className="oi oi-pencil" />
            &nbsp; Edit
          </Link>
          <button
            onClick={handleCancel}
            data-reservation-id-cancel={reservation.reservation_id}
            className="btn btn-primary"
          >
            <span className="oi oi-x" />
            &nbsp; Cancel
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Reservation;

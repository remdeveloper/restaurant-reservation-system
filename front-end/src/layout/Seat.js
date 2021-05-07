import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, readReservation, seatReserve, updateStatus } from "../utils/api";

//called by reservation
function Seat() {
  const [tableId, setTableId] = useState(1);
  const [tables, setTables] = useState([]);
  const history = useHistory();
  const { reservation_id } = useParams();

  //const [reservationsError, setReservationsError] = useState(null);
  const [reservation, setReservation] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();

    listTables(abortController.signal)
      .then(setTables)
      .catch((err) => console.error(err));
    return () => abortController.abort();
  }, []);

  // fetch Reservation
  useEffect(() => {
    async function fetchReservation() {
      const response = await readReservation(reservation_id);
      const fetchedReservation = response;

      fetchedReservation.reservation_date = fetchedReservation.reservation_date.slice(
        0,
        10
      );
      fetchedReservation.reservation_time = fetchedReservation.reservation_time.slice(
        0,
        5
      );

      setReservation(fetchedReservation);
    }
    fetchReservation();
  }, [reservation_id]);

  const tableOptions = tables.map((table, index) => {
    return (
      <option key={index} value={table.table_id}>
        {table.table_name} - {table.capacity}
        {table.occupied ? " OCCUPIED" : ""}
      </option>
    );
  });

  const handleChange = (e) => {
   return setTableId(e.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await seatReserve(tableId, reservation_id);
      await updateStatus(reservation_id, {data : {status: "seated"}}) //this is req.body.data

      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();

    history.goBack();
  };

  return (
    <>
      <div className="text-center">
        <h2 className="rtHead pb-2">Seat Reservation</h2>
        <p>Choose a table to seat the party</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select name="table_id" onChange={handleChange}>
              {tableOptions}
            </select>
          </div>
          <button onClick={handleCancel} className="button mx-3 px-3">
            Cancel
          </button>
          <button type="submit" className="button mx-3 px-3">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Seat;

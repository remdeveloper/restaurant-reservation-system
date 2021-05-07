import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import { today } from "../utils/date-time";

function NewTable() {
  const history = useHistory();
  const [tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState("");

  function previousPage() {
    history.goBack();
  }

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleCapacityChange = (e) => {
    setCapacity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTable({
        table_name: tableName,
        capacity: Number(capacity),
      });
      history.push(`/dashboard?date=${today()}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Reserve a table</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="table_name" className="form-label">
            Table Name:
          </label>
          <input
            id="table_name"
            name="table_name"
            type="text"
            className="form-control"
            onChange={handleTableNameChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="capacity" className="form-label">
            Capacity    :
          </label>
          <input
            id="capacity"
            name="capacity"
            type="text"
            className="form-control"
            onChange={handleCapacityChange}
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
          className="btn btn-primary"
          type="submit"
        >
          {``} {``} Submit
        </button>
      </form>
    </div>
  );
}

export default NewTable;

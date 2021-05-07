import React from "react";
import { deleteTable, updateStatus } from "../utils/api";

//called in dashboard

//table is
/*Object { table_id: 4, table_name: "Bar #2", capacity: 1,
 occupied: false, reservation_id: null, created_at: "2020-12-10T08:31:32.326Z",
  updated_at: "2020-12-10T08:31:32.326Z" }*/

function Table({ table }) {

  async function handleFinish(e) {
    e.preventDefault();
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await deleteTable(table.table_id);
        await updateStatus(table.reservation_id, {
          data: { status: "finished" },
        });
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div>
      <li>Table_name: {table.table_name}</li>
      <li>Table_id: {table.table_id}</li>
      <li>Capacity: {table.capacity}</li>
      <li data-table-id-status={table.table_id}>
        Occupied: {table.occupied ? "Occupied" : "Free"}
      </li>
      {table.occupied ? (
        <button className="btn btn-primary" data-table-id-finish={table.table_id} onClick={handleFinish}>
          Finish
        </button>
      ) : (
        <div></div>
      )}

      <br></br>
    </div>
  );
}

export default Table;

const knex = require("../db/connection");

function list(date) {
  return knex("reservations").where({reservation_date : date}).whereNot("status", "finished").select("*").orderBy("reservation_time");
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .returning([
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
      "status",
    ]);
}

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

function update(reservation_id, newData) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update(newData)
    .returning([
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ]);
}

function updateStatus(reservation_id, status){
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({status:status})
    .returning("status")
}

function listMobileNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  update,
  listMobileNumber,
  updateStatus
};

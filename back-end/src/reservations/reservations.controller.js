/**
 * List handler for reservation resources
 */
const P = require("pino");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const ReservationsService = require("./reservations.service");

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const error = { status: 404, message: `${reservation_id} cannot be found` };
  if (!reservation_id) return next(error);
  const reservation = await ReservationsService.read(reservation_id);
  if (!reservation) return next(error);
  res.locals.reservation = reservation;
  next();
}

async function validateReservationStatus(req, res, next) {
  const foundReservation = await ReservationsService.read(
    parseInt(req.params.reservation_id)
  );
  if (!foundReservation) {
    return next({
      status: 404,
      message: `This ${req.params.reservation_id} does not exist`,
    });
  }
  if (foundReservation.status === "finished") {
    return next({
      status: 400,
      message: "Reservation already finished",
    });
  }
  if (
    req.body.data.status === "booked" ||
    req.body.data.status === "seated" ||
    req.body.data.status === "cancelled" ||
    req.body.data.status === "finished"
  ) {
    res.locals.reservation = foundReservation;
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservation status is unknown",
    });
  }
}

async function validateReservation(req, res, next) {
  // validate data
  if (!req.body.data) {
    return next({
      status: 400,
      message: "Must include data!",
    });
  }

  const {
    data: { reservation_date, reservation_time, people, status },
  } = req.body;
  const date = new Date(reservation_date);
  const currentDate = new Date();

  // validate first name
  if (!req.body.data.first_name || req.body.data.first_name.length === 0) {
    return next({
      status: 400,
      message: "Must include valid first_name!",
    });
  }

  // validate last name
  if (!req.body.data.last_name || req.body.data.last_name.length === 0) {
    return next({
      status: 400,
      message: "Must include valid last_name!",
    });
  }

  // validate mobile number
  if (
    !req.body.data.mobile_number ||
    req.body.data.mobile_number.length === 0
  ) {
    return next({
      status: 400,
      message: "Must include valid mobile_number!",
    });
  }

  // validate reservation date
  if (
    !req.body.data.reservation_date ||
    !req.body.data.reservation_date.match(/\d{4}\-\d{2}\-\d{2}/g)
  ) {
    return next({
      status: 400,
      message: "Must include valid reservation_date!",
    });
  }

  // validate reservation time
  if (
    !req.body.data.reservation_time ||
    !req.body.data.reservation_time.match(/[0-9]{2}:[0-9]{2}/g)
  ) {
    return next({
      status: 400,
      message: "Must include valid reservation_time!",
    });
  }

  // validate people
  if (
    !req.body.data.people ||
    typeof req.body.data.people !== "number" ||
    req.body.data.people === 0
  ) {
    return next({
      status: 400,
      message: "Must include valid people!",
    });
  }

  if (reservation_date.match(/[a-z]/i)) {
    return next({
      status: 400,
      message: ` reservation_date: ${reservation_date} is not a date!`,
    });
  }
  if (reservation_time.match(/[a-z]/i)) {
    return next({
      status: 400,
      message: ` reservation_time: ${reservation_time} is not a valid time!`,
    });
  }
  if (
    date.valueOf() < currentDate.valueOf() &&
    date.toUTCString().slice(0, 16) !== currentDate.toUTCString().slice(0, 16)
  )
    return next({
      status: 400,
      message: "Reservations must be made in the future!",
    });

  // validate that reservation date does not land on a Tuesday
  if (date.getDay() === 1) {
    return next({
      status: 400,
      message: "Invalid reservation_date: restaurant closed on Tuesdays!",
    });
  }

  // validate if reservation time is within operating hours
  const replacedTime = req.body.data.reservation_time.replace(":", "");
  if (replacedTime < 1030 || replacedTime > 2130) {
    return next({
      status: 400,
      message: "The reservation_time is after store operating hours!",
    });
  }

  if (
    // !req.body.data.reservation_status ||
    !req.body.data.reservation_time.match(/[0-9]{2}:[0-9]{2}/g)
  ) {
    return next({
      status: 400,
      message: "Must include valid reservation_time!",
    });
  }

  // added this thing

  if (req.body.data.status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated!",
    });
  }
  if (req.body.data.status === "finished") {
    return next({
      status: 400,
      message: "Reservation is already finished!",
    });
  }
  return next();
}

async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    try {
      const knex = req.app.get("db"); //based on app.js
      let reservations = await ReservationsService.list(date);

      res.json({ data: reservations });
    } catch (error) {
      console.log(error);
    }
  }

  if (mobile_number) {
    const data = await ReservationsService.listMobileNumber(mobile_number);

    res.json({
      data: data,
    });

    return;
  } else {
    res.json({
      data: [],
    });
  }
}

async function read(req, res) {
  const { reservation_id } = req.params;
  ReservationsService.read(reservation_id).then((data) =>
    res.status(200).json({ data: data })
  );
}

async function updateStatus(req, res) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;
  const updatedData = await ReservationsService.updateStatus(
    reservation_id,
    status
  );

  res.status(200).json({ data: { status: updatedData[0] } });
}

async function create(req, res) {
  if (!req.body.data) {
    return res.status(400).json({ error: "Please enter data" });
  }

  const data = await ReservationsService.create(req.body.data);
  //  data = [
  //   {
  //     first_name: 'asdf',
  //     last_name: 'asdf',
  //     mobile_number: '123',
  //     reservation_date: 2021-04-28T04:00:00.000Z,
  //     reservation_time: '11:11:00',
  //     people: 4,
  //     status: 'booked'
  //   }
  // ]
  res.status(201).json({ data: data[0] });
}

async function update(req, res) {
  const { reservation_id } = req.params;
  const data = await ReservationsService.update(reservation_id, req.body.data);
  res.status(200).json({
    data: data[0],
  });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(validateReservation), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validateReservationStatus),
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validateReservation),
    asyncErrorBoundary(update),
  ],
};

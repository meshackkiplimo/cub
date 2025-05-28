import express from "express";
import { BookingController } from "../controller/bookingController";




export const booking = (app: express.Express) => {
    const bookingController = new BookingController();

    app.route("/bookings").post(
        async (req, res, next) => {
            try {
                await bookingController.createBooking(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/bookings").get(
        async (req, res, next) => {
            try {
                await bookingController.getAllBookings(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/bookings/:id").get(
        async (req, res, next) => {
            try {
                await bookingController.getBookingById(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/bookings/:id").put(
        async (req, res, next) => {
            try {
                await bookingController.updateBooking(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/bookings/:id").delete(
        async (req, res, next) => {
            try {
                await bookingController.deleteBooking(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
};
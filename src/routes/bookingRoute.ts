import { Express } from "express";
import { createBookingController, deleteBookingController, getAllBookingsController, getBookingController, updateBookingController } from "../controller/bookingController";
import { adminOnly, isAuthenticated } from "../middleware/roleMiddleware";

export const booking = (app: Express) => {
    // Create new booking
    app.route("/bookings").post(
        isAuthenticated,
        async (req, res, next) => {
            try {
                await createBookingController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // Get all bookings (admin) or user's bookings (customer)
    app.route("/bookings").get(
        isAuthenticated,
        async (req, res, next) => {
            try {
                await getAllBookingsController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // Get specific booking
    app.route("/bookings/:id").get(
        isAuthenticated,
        async (req, res, next) => {
            try {
                await getBookingController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // Update booking
    app.route("/bookings/:id").put(
        isAuthenticated,
        async (req, res, next) => {
            try {
                await updateBookingController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // Delete booking (admin only)
    app.route("/bookings/:id").delete(
        isAuthenticated,
        adminOnly,
        async (req, res, next) => {
            try {
                await deleteBookingController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
};
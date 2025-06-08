import { Express } from "express"
import { createBookingController, deleteBookingController, getAllBookingsController, getBookingController, updateBookingController } from "../controller/bookingController"

export const booking = (app: Express) => {
    app.route("/bookings").post(
        async (req, res, next) => {
            try {
                await createBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/bookings").get(
        
        async (req, res, next) => {
            
            try {
                await getAllBookingsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/bookings/:id").get(
        async (req, res, next) => {
            try {
                await getBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/bookings/:id").put(
        async (req, res, next) => {
            try {
                await updateBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/bookings/:id").delete(
        async (req, res, next) => {
            try {
                await deleteBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
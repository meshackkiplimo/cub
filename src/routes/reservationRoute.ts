import { Express } from "express"
import { 
    completeReservationController,
    createReservationController, 
    deleteReservationController, 
    getAllReservationsController, 
    getCustomerReservationsController, 
    getReservationController, 
    updateReservationController 
} from "../controller/reservationcontroller"

export const reservation = (app: Express) => {
    // Create new reservation
    app.route("/reservations").post(
        async (req, res, next) => {
            try {
                await createReservationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Get all reservations
    app.route("/reservations").get(
        async (req, res, next) => {
            try {
                await getAllReservationsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Get specific reservation
    app.route("/reservations/:id").get(
        async (req, res, next) => {
            try {
                await getReservationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Get customer's reservations
    app.route("/customers/:customerId/reservations").get(
        async (req, res, next) => {
            try {
                await getCustomerReservationsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Update reservation
    app.route("/reservations/:id").put(
        async (req, res, next) => {
            try {
                await updateReservationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Complete reservation (check-in)
    app.route("/reservations/:id/complete").post(
        async (req, res, next) => {
            try {
                await completeReservationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Cancel/delete reservation
    app.route("/reservations/:id").delete(
        async (req, res, next) => {
            try {
                await deleteReservationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
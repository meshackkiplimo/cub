import { Express } from "express"
import { createPaymentController, deletePaymentController, getAllPaymentsController, getPaymentController, updatePaymentController } from "../controller/paymentController"

export const payment = (app: Express) => {
    app.route("/payments").post(
        async (req, res, next) => {
            try {
                await createPaymentController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/payments").get(
        async (req, res, next) => {
            try {
                await getAllPaymentsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/payments/:id").get(
        async (req, res, next) => {
            try {
                await getPaymentController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/payments/:id").put(
        async (req, res, next) => {
            try {
                await updatePaymentController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/payments/:id").delete(
        async (req, res, next) => {
            try {
                await deletePaymentController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
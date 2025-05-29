import { Express } from "express"
import { createCustomerController, deleteCustomerController, getAllCustomersController, getCustomerController, updateCustomerController } from "../controller/customerController"

export const customer = (app: Express) => {
    app.route("/customers").post(
        async (req, res, next) => {
            try {
                await createCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/customers").get(
        async (req, res, next) => {
            try {
                await getAllCustomersController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/customers/:id").get(
        async (req, res, next) => {
            try {
                await getCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/customers/:id").put(
        async (req, res, next) => {
            try {
                await updateCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/customers/:id").delete(
        async (req, res, next) => {
            try {
                await deleteCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
import { Express } from "express"
import { createCustomerController, deleteCustomerController, getAllCustomersController, getCustomerController, updateCustomerController } from "../controller/customerController"
import { adminOnly, checkRole } from "../middleware/roleMiddleware"

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
         // Only admin can get all customers
        async (req, res, next) => {
            try {
                await getAllCustomersController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/customers/:id").get(
        checkRole(['admin', 'customer']), // Both admin and customer can view individual customer details
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
        adminOnly, // Only admin can delete customers
        async (req, res, next) => {
            try {
                await deleteCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
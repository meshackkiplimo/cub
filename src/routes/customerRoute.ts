import { Express } from "express"
import { createCustomerController, deleteCustomerController, getAllCustomersController, getCustomerController, updateCustomerController } from "../controller/customerController"
import { adminOnly, checkRole, isAuthenticated } from "../middleware/roleMiddleware"

export const customer = (app: Express) => {
    app.route("/customers").post(
        isAuthenticated, // Ensure user is authenticated
        async (req, res, next) => {
            try {
                // Validate required fields
                const { phone_number, address } = req.body;
                if (!phone_number || !address) {
                    res.status(400).json({ message: "Customer creation failed" });
                    return;
                }
                await createCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/customers").get(
        adminOnly, // Only admin can get all customers
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
        isAuthenticated, // Must be authenticated to update
        checkRole(['admin', 'customer']), // Both admin and customer can update
        async (req, res, next) => {
            try {
                // Validate update data
                const { phone_number, address } = req.body;
                if (!phone_number && !address) {
                    res.status(400).json({ message: "Invalid update data" });
                    return;
                }
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
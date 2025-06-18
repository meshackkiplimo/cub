import { Express } from "express"
import { createCarController, deleteCarController, getAllCarsController, getCarController, updateCarController } from "../controller/carController"
import { adminOnly } from "../middleware/roleMiddleware"

export const car = (app: Express) => {
    app.route("/cars").post(
        adminOnly,
        async (req, res, next) => {
            try {
                await createCarController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/cars").get(
        async (req, res, next) => {
            try {
                await getAllCarsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/cars/:id").get(
        async (req, res, next) => {
            try {
                await getCarController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/cars/:id").put(
        adminOnly,
        async (req, res, next) => {
            try {
                await updateCarController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/cars/:id").delete(
        adminOnly,
        async (req, res, next) => {
            try {
                await deleteCarController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
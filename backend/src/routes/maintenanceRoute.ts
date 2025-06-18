import { Express } from "express"
import { createMaintenanceController, deleteMaintenanceController, getAllMaintenanceController, getCarMaintenanceHistoryController, getMaintenanceController, updateMaintenanceController } from "../controller/maintenanceController"

export const maintenance = (app: Express) => {
    app.route("/maintenance").post(
        async (req, res, next) => {
            try {
                await createMaintenanceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/maintenance").get(
        async (req, res, next) => {
            try {
                await getAllMaintenanceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/maintenance/:id").get(
        async (req, res, next) => {
            try {
                await getMaintenanceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/maintenance/:id").put(
        async (req, res, next) => {
            try {
                await updateMaintenanceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/maintenance/:id").delete(
        async (req, res, next) => {
            try {
                await deleteMaintenanceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Additional route for getting maintenance history by car ID
    app.route("/maintenance/car/:carId").get(
        async (req, res, next) => {
            try {
                await getCarMaintenanceHistoryController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
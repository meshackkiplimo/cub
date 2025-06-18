import { Express } from "express"
import { 
    createLocationController, 
    deleteLocationController, 
    getAllLocationsController, 
    getLocationAvailableCarsController, 
    getLocationController, 
    updateLocationController 
} from "../controller/locationController"

export const location = (app: Express) => {
    // Create new location
    app.route("/locations").post(
        async (req, res, next) => {
            try {
                await createLocationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Get all locations
    app.route("/locations").get(
        async (req, res, next) => {
            try {
                await getAllLocationsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Get specific location with its cars
    app.route("/locations/:id").get(
        async (req, res, next) => {
            try {
                await getLocationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Get available cars at a location
    app.route("/locations/:id/available-cars").get(
        async (req, res, next) => {
            try {
                await getLocationAvailableCarsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Update location
    app.route("/locations/:id").put(
        async (req, res, next) => {
            try {
                await updateLocationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Delete location
    app.route("/locations/:id").delete(
        async (req, res, next) => {
            try {
                await deleteLocationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
import { Express } from "express"
import {
    createInsuranceController,
    deleteInsuranceController,
    getAllInsurancesController,
    getInsuranceController,
    updateInsuranceController
} from "../controller/insuranceController"

export const insurance = (app: Express) => {
    app.route("/insurance").post(
        async (req, res, next) => {
            try {
                await createInsuranceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/insurance").get(
        async (req, res, next) => {
            try {
                await getAllInsurancesController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/insurance/:id").get(
        async (req, res, next) => {
            try {
                await getInsuranceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/insurance/:id").put(
        async (req, res, next) => {
            try {
                await updateInsuranceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/insurance/:id").delete(
        async (req, res, next) => {
            try {
                await deleteInsuranceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
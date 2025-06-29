import { Express } from "express"
import { creatUserController, deleteUserController, getAllUsersController, getUserByIdController, loginUserController, updateUserRoleController, verifyEmailController } from "../controller/authController"
import { bothRoleAuth, isAuthenticated } from "../middleware/roleMiddleware"

export const user = (app: Express) => {
    app.route("/auth/register").post(
        async (req, res, next) => {
            try {
                await creatUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/auth/login").post(
        async (req, res, next) => {
            try {
                await loginUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route("/auth/verify-email").post(
        async (req, res, next) => {
            try {
                await verifyEmailController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/users').get(
        async (req, res, next) => {
            try {
                await getAllUsersController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    app.route('/users/:id').patch(
        async (req, res, next) => {
            try {
                await updateUserRoleController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
    app.route('/users/:id').delete(
        async (req, res, next) => {
            try {
                await deleteUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
    app.route('/users/:id').get(
        // bothRoleAuth,
        // isAuthenticated,
        
        async (req, res, next) => {
            try {
                await getUserByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}

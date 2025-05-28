import { Express } from "express"
import { creatUserController, loginUserController } from "../controller/authController"




export const user =(app:Express)  =>{
    app.route("/auth/register").post(
        async(res,req,next)=>{
            try {
                await creatUserController(res, req)
                
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

}
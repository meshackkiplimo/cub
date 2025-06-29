import { Express } from "express"
import { createCarController, deleteCarController, getAllCarsController, getCarController, updateCarController } from "../controller/carController"
import { adminOnly } from "../middleware/roleMiddleware"
import multer from "multer"


const storage = multer.memoryStorage()
const upload = multer({ 
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024
    }

})

export const car = (app: Express) => {
    app.route("/cars").post(
        // adminOnly,
        upload.single("image"), // Handle single file upload with field name 'image'
    
        async (req, res, next) => {
            try {
                // Use multer to handle file uploads


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
       
        async (req, res, next) => {
            try {
                await deleteCarController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}
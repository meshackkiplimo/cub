import { Express, Request, Response, NextFunction } from "express";
import {
    createInsuranceController,
    deleteInsuranceController,
    getAllInsurancesController,
    getInsuranceController,
    updateInsuranceController
} from "../controller/insuranceController";
import { adminOnly, isAuthenticated } from "../middleware/roleMiddleware";

export const insurance = (app: Express): void => {
    // Create insurance - Admin only
    app.post("/insurance",
        isAuthenticated,
        adminOnly,
        (req: Request, res: Response, next: NextFunction) => {
            if (!req.body.provider || !req.body.policy_number || !req.body.car_id || 
                !req.body.start_date || !req.body.end_date) {
                res.status(400).json({ 
                    message: 'Invalid insurance data',
                    details: 'Missing required fields'
                });
                return;
            }
            createInsuranceController(req, res).catch(next);
        }
    );

    // Get all insurance policies - Admin only
    app.get("/insurance",
        isAuthenticated,
        adminOnly,
        (req: Request, res: Response, next: NextFunction) => {
            getAllInsurancesController(req, res).catch(next);
        }
    );

    // Get specific insurance policy - Admin or related customer
    app.get("/insurance/:id",
        isAuthenticated,
        (req: Request, res: Response, next: NextFunction) => {
            getInsuranceController(req, res).catch(next);
        }
    );

    // Update insurance - Admin only
    app.put("/insurance/:id",
        isAuthenticated,
        adminOnly,
        (req: Request, res: Response, next: NextFunction) => {
            updateInsuranceController(req, res).catch(next);
        }
    );

    // Delete insurance - Admin only
    app.delete("/insurance/:id",
        isAuthenticated,
        adminOnly,
        (req: Request, res: Response, next: NextFunction) => {
            deleteInsuranceController(req, res).catch(next);
        }
    );
};
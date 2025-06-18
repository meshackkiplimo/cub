import { Request, Response } from 'express';
import { createMaintenanceService, deleteMaintenanceService, getAllMaintenanceService, getCarMaintenanceHistory, getMaintenanceService, updateMaintenanceService } from '../services/maintenanceService';

export const createMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenance = req.body;

        // Validate required fields
        if (!maintenance.car_id || !maintenance.maintenance_date || 
            !maintenance.description || !maintenance.cost) {
            return res.status(400).json({ 
                message: "Maintenance record creation failed",
                details: "Required fields missing: car_id, maintenance_date, description, cost"
            });
        }

        // Validate cost format
        if (isNaN(parseFloat(maintenance.cost))) {
            return res.status(400).json({ 
                message: "Maintenance record creation failed",
                details: "Invalid cost format - must be a valid number"
            });
        }

        const createMaintenance = await createMaintenanceService(maintenance);
        if (!createMaintenance) {
            return res.status(400).json({ message: "Maintenance record creation failed" });
        }

        res.status(201).json({ 
            message: "Maintenance record created successfully", 
            maintenance: createMaintenance 
        });
    } catch (error: any) {
        console.error("Error in createMaintenanceController:", error);
        if (error.message?.includes('validation')) {
            return res.status(400).json({ 
                message: "Maintenance record creation failed",
                details: error.message
            });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceId = parseInt(req.params.id);
        const maintenance = await getMaintenanceService(maintenanceId);
        
        if (!maintenance) {
            return res.status(404).json({ message: "Maintenance record not found" });
        }
        
        res.status(200).json({ maintenance });
    } catch (error) {
        console.error("Error in getMaintenanceController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceRecords = await getAllMaintenanceService();
        res.status(200).json({ maintenance: maintenanceRecords });
    } catch (error) {
        console.error("Error in getAllMaintenanceController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceId = parseInt(req.params.id);
        const maintenanceData = req.body;

        // Validate update data
        if (Object.keys(maintenanceData).length === 0) {
            return res.status(400).json({ 
                message: "Maintenance record update failed",
                details: "No update data provided"
            });
        }

        // Validate cost format if provided
        if (maintenanceData.cost && isNaN(parseFloat(maintenanceData.cost))) {
            return res.status(400).json({ 
                message: "Maintenance record update failed",
                details: "Invalid cost format - must be a valid number"
            });
        }

        const updatedMaintenance = await updateMaintenanceService(maintenanceId, maintenanceData);
        
        if (!updatedMaintenance) {
            return res.status(404).json({ message: "Maintenance record not found" });
        }
        
        res.status(200).json({ 
            message: "Maintenance record updated successfully", 
            maintenance: updatedMaintenance 
        });
    } catch (error: any) {
        console.error("Error in updateMaintenanceController:", error);
        if (error.message?.includes('validation')) {
            return res.status(400).json({ 
                message: "Maintenance record update failed",
                details: error.message
            });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceId = parseInt(req.params.id);
        const deletedMaintenance = await deleteMaintenanceService(maintenanceId);
        
        if (!deletedMaintenance || deletedMaintenance.length === 0) {
            return res.status(404).json({ message: "Maintenance record not found" });
        }
        
        res.status(200).json({ message: "Maintenance record deleted successfully" });
    } catch (error) {
        console.error("Error in deleteMaintenanceController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCarMaintenanceHistoryController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.carId);
        const maintenanceHistory = await getCarMaintenanceHistory(carId);
        
        if (!maintenanceHistory || maintenanceHistory.length === 0) {
            return res.status(404).json({ message: "No maintenance records found for this car" });
        }
        
        res.status(200).json({ maintenanceHistory });
    } catch (error) {
        console.error("Error in getCarMaintenanceHistoryController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
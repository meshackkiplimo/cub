import { Request, Response } from 'express';
import { createInsuranceService, deleteInsuranceService, getAllInsurancesService, getInsuranceService, updateInsuranceService } from '../services/insuranceService';

export const createInsuranceController = async (req: Request, res: Response) => {
    try {
        const insurance = req.body;

        // Validate required fields
        if (!insurance.provider || !insurance.policy_number || !insurance.car_id ||
            !insurance.start_date || !insurance.end_date) {
            return res.status(400).json({
                message: 'Invalid insurance data',
                details: 'Missing required fields'
            });
        }

        const newInsurance = await createInsuranceService(insurance);
        if (!newInsurance) {
            return res.status(400).json({ message: 'Insurance creation failed' });
        }

        res.status(201).json({
            message: 'Insurance created successfully',
            insurance: newInsurance
        });
    } catch (error: any) {
        if (error.message.includes('validation')) {
            return res.status(400).json({
                message: 'Invalid insurance data',
                details: error.message
            });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceId = parseInt(req.params.id);
        const insurance = await getInsuranceService(insuranceId);
        
        if (!insurance) {
            return res.status(404).json({ message: 'Insurance not found' });
        }
        
        res.status(200).json({ insurance });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllInsurancesController = async (req: Request, res: Response) => {
    try {
        const insurances = await getAllInsurancesService();
        res.status(200).json({ insurances });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceId = parseInt(req.params.id);
        const insuranceData = req.body;
        
        // Validate update data
        if (Object.keys(insuranceData).length === 0) {
            return res.status(400).json({
                message: 'Invalid insurance data',
                details: 'No update data provided'
            });
        }
        
        const updatedInsurance = await updateInsuranceService(insuranceId, insuranceData);
        
        if (!updatedInsurance) {
            return res.status(404).json({ message: 'Insurance not found' });
        }
        
        res.status(200).json({
            message: 'Insurance updated successfully',
            insurance: updatedInsurance
        });
    } catch (error: any) {
        if (error.message.includes('validation')) {
            return res.status(400).json({
                message: 'Invalid insurance data',
                details: error.message
            });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceId = parseInt(req.params.id);
        const deletedInsurance = await deleteInsuranceService(insuranceId);
        
        if (!deletedInsurance || deletedInsurance.length === 0) {
            return res.status(404).json({ message: 'Insurance not found' });
        }
        
        res.status(200).json({ message: 'Insurance deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
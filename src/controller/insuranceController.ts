


import { Request, Response } from 'express';
import { createInsuranceService, deleteInsuranceService, getAllInsurancesService, getInsuranceService, updateInsuranceService } from '../services/insuranceService';

export const createInsuranceController = async (req: Request, res: Response) => {
    try {
        const insurance = req.body;
        const newInsurance = await createInsuranceService(insurance);
        res.status(201).json({ message: 'Insurance created successfully', insurance: newInsurance });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export const getInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceId = parseInt(req.params.id);
        const insurance = await getInsuranceService(insuranceId);
        
        if (!insurance) {
            return res.status(404).json({ message: 'Insurance not found' });
        }
        
        res.status(200).json(insurance);
    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export const getAllInsurancesController = async (req: Request, res: Response) => {
    try {
        const insurances = await getAllInsurancesService();
        res.status(200).json(insurances);
    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export const updateInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceId = parseInt(req.params.id);
        const insuranceData = req.body;
        
        const updatedInsurance = await updateInsuranceService(insuranceId, insuranceData);
        
        if (!updatedInsurance) {
            return res.status(404).json({ message: 'Insurance not found' });
        }
        
        res.status(200).json({ message: 'Insurance updated successfully', insurance: updatedInsurance });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export const deleteInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceId = parseInt(req.params.id);
        const deletedInsurance = await deleteInsuranceService(insuranceId);
        
        if (!deletedInsurance.length) {
            return res.status(404).json({ message: 'Insurance not found' });
        }
        
        res.status(200).json({ message: 'Insurance deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
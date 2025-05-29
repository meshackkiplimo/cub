import { Request, Response } from 'express';
import { createPaymentService, deletePaymentService, getAllPaymentsService, getPaymentService, updatePaymentService } from '../services/paymentService';

export const createPaymentController = async (req: Request, res: Response) => {
    try {
        const payment = req.body;
        const newPayment = await createPaymentService(payment);
        if (!newPayment) {
            res.status(400).json({ message: "Payment creation failed" });
            return;
        }
        res.status(201).json({ message: "Payment created successfully", payment: newPayment });
    } catch (error) {
        console.error("Error in createPaymentController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        const payment = await getPaymentService(paymentId);
        if (!payment) {
            res.status(404).json({ message: "Payment not found" });
            return;
        }
        res.status(200).json({ payment });
    } catch (error) {
        console.error("Error in getPaymentController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllPaymentsController = async (req: Request, res: Response) => {
    try {
        const payments = await getAllPaymentsService();
        res.status(200).json({ payments });
    } catch (error) {
        console.error("Error in getAllPaymentsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updatePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        const paymentData = req.body;
        const updatedPayment = await updatePaymentService(paymentId, paymentData);
        if (!updatedPayment) {
            res.status(404).json({ message: "Payment not found" });
            return;
        }
        res.status(200).json({ message: "Payment updated successfully", payment: updatedPayment });
    } catch (error) {
        console.error("Error in updatePaymentController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deletePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        const deletedPayment = await deletePaymentService(paymentId);
        if (!deletedPayment || deletedPayment.length === 0) {
            res.status(404).json({ message: "Payment not found" });
            return;
        }
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error("Error in deletePaymentController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
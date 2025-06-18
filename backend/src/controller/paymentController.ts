import { Request, Response } from 'express';
import { createPaymentService, deletePaymentService, getAllPaymentsService, getPaymentService, updatePaymentService } from '../services/paymentService';

const VALID_PAYMENT_METHODS = ['card', 'cash', 'bank_transfer'];

export const createPaymentController = async (req: Request, res: Response) => {
    try {
        const payment = req.body;

        // Validate required fields
        if (!payment.booking_id || !payment.payment_date ||
            !payment.amount || !payment.payment_method) {
            return res.status(400).json({
                message: "Payment creation failed",
                details: "Required fields: booking_id, payment_date, amount, payment_method"
            });
        }

        // Validate amount format
        if (isNaN(parseFloat(payment.amount))) {
            return res.status(400).json({
                message: "Payment creation failed",
                details: "Invalid amount format"
            });
        }

        // Validate payment method
        if (!VALID_PAYMENT_METHODS.includes(payment.payment_method)) {
            return res.status(400).json({
                message: "Payment creation failed",
                details: "Invalid payment method. Allowed methods: card, cash, bank_transfer"
            });
        }

        const newPayment = await createPaymentService(payment);
        if (!newPayment) {
            return res.status(400).json({ message: "Payment creation failed" });
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

        // Validate payment method if provided
        if (paymentData.payment_method && !VALID_PAYMENT_METHODS.includes(paymentData.payment_method)) {
            return res.status(400).json({
                message: "Invalid payment data",
                details: "Invalid payment method. Allowed methods: card, cash, bank_transfer"
            });
        }

        // Validate amount if provided
        if (paymentData.amount && isNaN(parseFloat(paymentData.amount))) {
            return res.status(400).json({
                message: "Invalid payment data",
                details: "Invalid amount format"
            });
        }

        const updatedPayment = await updatePaymentService(paymentId, paymentData);
        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
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
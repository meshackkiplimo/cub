import { Request, Response } from 'express';
import { createCustomerService, deleteCustomerService, getAllCustomersService, getCustomerService, updateCustomerService } from '../services/customerService';

export const createCustomerController = async (req: Request, res: Response) => {
    try {
        const customer = req.body;
        const createCustomer = await createCustomerService(customer);
        if (!createCustomer) {
            res.status(400).json({ message: "Customer creation failed" });
            return;
        }
        res.status(201).json({ message: "Customer created successfully", customer: createCustomer });
    } catch (error) {
        console.error("Error in createCustomerController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCustomerController = async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.id);
        const customer = await getCustomerService(customerId);
        if (!customer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }
        res.status(200).json({ customer });
    } catch (error) {
        console.error("Error in getCustomerController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllCustomersController = async (req: Request, res: Response) => {
    try {
        const customers = await getAllCustomersService();
        res.status(200).json({ customers });
    } catch (error) {
        console.error("Error in getAllCustomersController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateCustomerController = async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.id);
        const customerData = req.body;
        const updatedCustomer = await updateCustomerService(customerId, customerData);
        if (!updatedCustomer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }
        res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
    } catch (error) {
        console.error("Error in updateCustomerController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteCustomerController = async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.id);
        const deletedCustomer = await deleteCustomerService(customerId);
        if (!deletedCustomer || deletedCustomer.length === 0) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Error in deleteCustomerController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
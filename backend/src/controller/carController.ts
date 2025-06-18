import { Request, Response } from 'express';
import { createCarService, deleteCarService, getAllCarsService, getCarService, updateCarService } from '../services/carService';

export const createCarController = async (req: Request, res: Response) => {
    try {
        const car = req.body;
        const createCar = await createCarService(car);
        if (!createCar) {
            res.status(400).json({ message: "Car creation failed" });
            return;
        }
        res.status(201).json({ message: "Car created successfully", car: createCar });
    } catch (error) {
        console.error("Error in createCarController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCarController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.id);
        const car = await getCarService(carId);
        if (!car) {
            res.status(404).json({ message: "Car not found" });
            return;
        }
        res.status(200).json({ car });
    } catch (error) {
        console.error("Error in getCarController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllCarsController = async (req: Request, res: Response) => {
    try {
        const cars = await getAllCarsService();
        res.status(200).json({ car: cars });
    } catch (error) {
        console.error("Error in getAllCarsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCarController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.id);
        const carData = req.body;
        const updatedCar = await updateCarService(carId, carData);
        if (!updatedCar) {
            res.status(404).json({ message: "Car not found" });
            return;
        }
        res.status(200).json({ message: "Car updated successfully", car: updatedCar });
    } catch (error) {
        console.error("Error in updateCarController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteCarController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.id);
        const deletedCar = await deleteCarService(carId);
        if (!deletedCar || deletedCar.length === 0) {
            res.status(404).json({ message: "Car not found" });
            return;
        }
        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        console.error("Error in deleteCarController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
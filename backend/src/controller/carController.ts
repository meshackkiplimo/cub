import { Request, Response } from 'express';
import { createCarService, deleteCarService, getAllCarsService, getCarService, updateCarService } from '../services/carService';
import cloudinary from 'cloudinary';
import { TICar } from 'src/types';

// Import Multer types and extend Express Request interface to include 'file' property


const uploadImage =  async (file:Express.Multer.File) =>{
    const image= file
    const base64Image = Buffer.from(image.buffer).toString("base64")
    const dataURI = `data:${image.mimetype};base64,${base64Image}`
    const uploadResponse =  await cloudinary.v2.uploader.upload(dataURI)
    return uploadResponse.url

}



export const createCarController = async (req: Request, res: Response) => {
  try {
    const carData: TICar = req.body;

    // Validate required fields
    const requiredFields = ['make', 'model', 'year', 'color', 'availability', 'rental_rate', 'location_id'];
    for (const field of requiredFields) {
      if (!carData[field as keyof TICar]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Upload image first
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    if (!imageUrl) {
      return res.status(500).json({ message: 'Failed to upload image' });
    }

    // Attach image URL
    carData.image_url = imageUrl;

    // Create the car
    const createdCar = await createCarService(carData);

    return res.status(201).json({ message: 'Car created successfully', car: createdCar });
  } catch (error) {
    console.error('Error in createCarController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
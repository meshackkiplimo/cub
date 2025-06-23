import { Request, Response } from 'express';
import { createCarService, deleteCarService, getAllCarsService, getCarService, updateCarService } from '../services/carService';
import cloudinary from '../config/cloudinaryConfig'; // Adjust the import path as necessary
import { TICar } from 'src/types';

// Import Multer types and extend Express Request interface to include 'file' property


declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; // Optional file property for Multer
    }
  }
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
  
}



export const createCarController = async (req: Request, res: Response) => {
  try {
    const carData:TICar = req.body;

    // Handle image upload to Cloudinary if a file is provided
    let image_url: string = '';
    let imagePublicId: string = '';


    //console if cloudinary is configured correctly
    if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
      console.error('Cloudinary is not configured correctly');
      return res.status(500).json({ message: 'Cloudinary configuration error' });
    }




    if (req.file) {
      const result: CloudinaryUploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            
            transformation: [
              { width: 800, height: 600, crop: 'fill', gravity: 'auto' }, // Optional: resize on upload
              { quality: 'auto' },
            ],
          },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error('Upload failed'));
            }
            resolve(result);
          }
        ).end(req.file!.buffer);
      });

      image_url = result.secure_url;
      imagePublicId = result.public_id;
    }

    // Add image data to carData
    const carWithImage = {
      ...carData,
      image_url,
      imagePublicId,
    };
    console.log('Car data with image:', carWithImage);

    const createCar = await createCarService(carWithImage);
    if (!createCar) {
      return res.status(400).json({ message: 'Car creation failed' });
    }

    res.status(201).json({ message: 'Car created successfully', car: createCar });
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
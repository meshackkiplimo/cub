import { Request, Response } from 'express';
import { createLocationService, deleteLocationService, getAllLocationsService, getLocationAvailableCarsService, getLocationService, updateLocationService } from '../services/locationService';

interface LocationData {
    location_name?: string;
    address?: string;
    contact_number?: string;
}

export const createLocationController = async (req: Request, res: Response) => {
    try {
        const location = {
            location_name: req.body.location_name,
            address: req.body.address,
            contact_number: req.body.contact_number
        };

        if (!location.location_name || !location.address || !location.contact_number) {
            res.status(400).json({ message: "All fields are required: location_name, address, contact_number" });
            return;
        }

        const newLocation = await createLocationService(location);
        if (!newLocation) {
            res.status(400).json({ message: "Location creation failed" });
            return;
        }
        res.status(201).json({ 
            message: "Location created successfully", 
            location: newLocation 
        });
    } catch (error) {
        console.error("Error in createLocationController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getLocationController = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.id);
        const location = await getLocationService(locationId);
        if (!location) {
            res.status(404).json({ message: "Location not found" });
            return;
        }
        res.status(200).json({ 
            location: {
                ...location,
                total_cars: location.cars?.length || 0,
                available_cars: location.cars?.filter(car => car.availability)?.length || 0
            }
        });
    } catch (error) {
        console.error("Error in getLocationController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllLocationsController = async (req: Request, res: Response) => {
    try {
        const locations = await getAllLocationsService();
        const locationsWithStats = locations.map(location => ({
            ...location,
            total_cars: location.cars?.length || 0,
            available_cars: location.cars?.filter(car => car.availability)?.length || 0
        }));
        res.status(200).json({ locations: locationsWithStats });
    } catch (error) {
        console.error("Error in getAllLocationsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getLocationAvailableCarsController = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.id);
        const location = await getLocationAvailableCarsService(locationId);
        
        if (!location) {
            res.status(404).json({ message: "Location not found" });
            return;
        }

        res.status(200).json({
            location_name: location.location_name,
            address: location.address,
            available_cars: location.cars || [],
            total_available: location.cars?.length || 0
        });
    } catch (error) {
        console.error("Error in getLocationAvailableCarsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateLocationController = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.id);
        const locationData: LocationData = {
            location_name: req.body.location_name,
            address: req.body.address,
            contact_number: req.body.contact_number
        };

        // Remove undefined fields
        Object.keys(locationData).forEach(key => {
            if (locationData[key as keyof LocationData] === undefined) {
                delete locationData[key as keyof LocationData];
            }
        });

        const updatedLocation = await updateLocationService(locationId, locationData);
        if (!updatedLocation) {
            res.status(404).json({ message: "Location not found" });
            return;
        }
        res.status(200).json({ 
            message: "Location updated successfully", 
            location: updatedLocation 
        });
    } catch (error) {
        console.error("Error in updateLocationController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteLocationController = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.id);
        const deletedLocation = await deleteLocationService(locationId);
        if (!deletedLocation || deletedLocation.length === 0) {
            res.status(404).json({ message: "Location not found" });
            return;
        }
        res.status(200).json({ 
            message: "Location deleted successfully",
            note: "Location was empty (no cars assigned)"
        });
    } catch (error: any) {
        console.error("Error in deleteLocationController:", error);
        if (error.message.includes("Cannot delete location with assigned cars")) {
            res.status(400).json({ 
                message: "Cannot delete location with assigned cars. Please reassign or remove cars first." 
            });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
}
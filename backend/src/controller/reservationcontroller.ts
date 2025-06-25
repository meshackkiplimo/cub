import { Request, Response } from 'express';
import { 
    completeReservationService,
    createReservationService, 
    deleteReservationService, 
    getAllReservationsService, 
    getCustomerReservationsService, 
    getReservationService, 
    updateReservationService 
} from '../services/reservationService';


export const createReservationController = async (req: Request, res: Response) => {
    try {
        console.log('Received reservation request:', req.body);
        
        // Validate required fields
        if (
            !req.user?.user_id ||
            !req.body.car_id ||
            !req.body.reservation_date ||
            !req.body.pickup_date
        ) {
            return res.status(400).json({ 
                message: "Missing required fields: customer_id, car_id, reservation_date, pickup_date" 
            });
        }

        const reservationData = {
            user_id: Number(req.user.user_id),
            car_id: Number(req.body.car_id),
            reservation_date: String(req.body.reservation_date),
            pickup_date: String(req.body.pickup_date)
        };
        
        console.log('Processed reservation data:', reservationData);

        // Validate dates
        const reservationDate = new Date(reservationData.reservation_date);
        const pickupDate = new Date(reservationData.pickup_date);
        const today = new Date();

        if (reservationDate < today) {
            return res.status(400).json({ message: "Reservation date cannot be in the past" });
        }

        if (pickupDate < reservationDate) {
            return res.status(400).json({ message: "Pickup date must be after reservation date" });
        }

        const newReservation = await createReservationService(reservationData);
        res.status(201).json({
            message: "Reservation created successfully",
            reservation: newReservation
        });
    } catch (error: any) {
        console.error("Error in createReservationController:", error);
        if (error.message.includes("Car is not available")) {
            return res.status(400).json({ message: "Car is not available for reservation" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getReservationController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.id);
        const reservation = await getReservationService(reservationId);
        
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json({ reservation });
    } catch (error: any) {
        console.error("Error in getReservationController:", error);
        if (error.message.includes("Reservation not found")) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllReservationsController = async (req: Request, res: Response) => {
    try {
        const reservations = await getAllReservationsService();
        res.status(200).json({ reservations });
    } catch (error) {
        console.error("Error in getAllReservationsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCustomerReservationsController = async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.customerId);
        const reservations = await getCustomerReservationsService(customerId);
        res.status(200).json({ reservations });
    } catch (error) {
        console.error("Error in getCustomerReservationsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateReservationController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.id);
        const reservationData = {
            pickup_date: req.body.pickup_date,
            return_date: req.body.return_date
        };

        // Validate dates if provided
        if (reservationData.pickup_date) {
            const pickupDate = new Date(reservationData.pickup_date);
            const today = new Date();
            if (pickupDate < today) {
                return res.status(400).json({ message: "Pickup date cannot be in the past" });
            }
        }

        const updatedReservation = await updateReservationService(reservationId, reservationData);
        if (!updatedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json({
            message: "Reservation updated successfully",
            reservation: updatedReservation
        });
    } catch (error: any) {
        console.error("Error in updateReservationController:", error);
        if (error.message.includes("Reservation not found")) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export const completeReservationController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.id);
        const { return_date } = req.body;

        if (!return_date) {
            return res.status(400).json({ message: "Return date is required" });
        }

        const completedReservation = await completeReservationService(reservationId, return_date);
        res.status(200).json({
            message: "Reservation completed successfully",
            reservation: completedReservation
        });
    } catch (error: any) {
        console.error("Error in completeReservationController:", error);
        if (error.message.includes("Reservation not found")) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteReservationController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.id);
        const deletedReservation = await deleteReservationService(reservationId);
        
        if (!deletedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json({
            message: "Reservation cancelled successfully",
            note: "Car has been marked as available"
        });
    } catch (error: any) {
        console.error("Error in deleteReservationController:", error);
        if (error.message.includes("Reservation not found")) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}
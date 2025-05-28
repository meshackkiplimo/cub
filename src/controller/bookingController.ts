import { Request, Response } from 'express';
import { createBookingService, deleteBookingService, getAllBookingsService, getBookingService, updateBookingService } from '../services/bookingService';

export const createBookingController = async (req: Request, res: Response) => {
    try {
        const booking = req.body;
        const newBooking = await createBookingService(booking);
        if (!newBooking) {
            res.status(400).json({ message: "Booking creation failed" });
            return;
        }
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("Error in createBookingController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getBookingController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id);
        const booking = await getBookingService(bookingId);
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        res.status(200).json({ booking });
    } catch (error) {
        console.error("Error in getBookingController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllBookingsController = async (req: Request, res: Response) => {
    try {
        const bookings = await getAllBookingsService();
        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error in getAllBookingsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateBookingController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id);
        const bookingData = req.body;
        const updatedBooking = await updateBookingService(bookingId, bookingData);
        if (!updatedBooking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });
    } catch (error) {
        console.error("Error in updateBookingController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteBookingController = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id);
        const deletedBooking = await deleteBookingService(bookingId);
        if (!deletedBooking || deletedBooking.length === 0) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Error in deleteBookingController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
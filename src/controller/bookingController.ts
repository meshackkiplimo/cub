import { Request, Response } from 'express';
import { sql } from 'drizzle-orm';
import db from '../drizzle/db';
import { CarTable } from '../drizzle/schema';
import { createBookingService, deleteBookingService, getAllBookingsService, getBookingService, updateBookingService } from '../services/bookingService';
import { CreateBookingDto, DbBookingWithRelations, UpdateBookingDto } from '../types/booking';

export const createBookingController = async (req: Request, res: Response) => {
    try {
        const booking: CreateBookingDto = req.body;
        
        // Validate required fields
        if (!booking.customer_id || !booking.car_id || !booking.rental_start_date || 
            !booking.rental_end_date || !booking.total_amount) {
            return res.status(400).json({ message: "Invalid booking data" });
        }

        // Check if car is available before creating booking
        const car = await db.query.CarTable.findFirst({
            where: sql`${CarTable.car_id}=${booking.car_id}`
        });

        if (!car || !car.availability) {
            return res.status(400).json({ message: "Car is not available for booking" });
        }

        const newBooking = await createBookingService(booking);
        if (!newBooking) {
            return res.status(400).json({ message: "Booking creation failed" });
        }

        // Update car availability
        await db.update(CarTable)
            .set({ availability: false })
            .where(sql`${CarTable.car_id}=${booking.car_id}`);

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
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if user has access to this booking
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const isAdmin = req.user.role === 'admin';

        // Check user access
        if (!isAdmin && booking.customer.user.user_id !== parseInt(req.user.user_id)) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.error("Error in getBookingController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllBookingsController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const isAdmin = req.user.role === 'admin';
        const allBookings = await getAllBookingsService();

        const bookings = isAdmin ? allBookings : 
            allBookings.filter(booking => 
                booking.customer.user.user_id === parseInt(req.user!.user_id)
            );

        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error in getAllBookingsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateBookingController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const bookingId = parseInt(req.params.id);
        const booking = await getBookingService(bookingId);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const isAdmin = req.user.role === 'admin';

        // Check user access
        if (!isAdmin && booking.customer.user.user_id !== parseInt(req.user.user_id)) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Check if booking is completed
        if (booking.status === 'completed') {
            return res.status(400).json({ message: "Cannot modify completed booking" });
        }

        const updateData: UpdateBookingDto = req.body;
        const updatedBooking = await updateBookingService(bookingId, updateData);
        res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });
    } catch (error) {
        console.error("Error in updateBookingController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteBookingController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const bookingId = parseInt(req.params.id);
        const booking = await getBookingService(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Only admin can delete bookings
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const deletedBooking = await deleteBookingService(bookingId);
        
        if (deletedBooking) {
            // Reset car availability
            await db.update(CarTable)
                .set({ availability: true })
                .where(sql`${CarTable.car_id}=${booking.car_id}`);

            res.status(200).json({ message: "Booking deleted successfully" });
        } else {
            res.status(404).json({ message: "Booking not found" });
        }
    } catch (error) {
        console.error("Error in deleteBookingController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
import { Request, Response } from "express";
import { BookingService } from "../services/bookingService";

const bookingService = new BookingService();

export class BookingController {
  async createBooking(req: Request, res: Response) {
    try {
      const bookingData = {
        customer_id: req.body.customer_id,
        car_id: req.body.car_id,
        rental_start_date: req.body.rental_start_date,
        rental_end_date: req.body.rental_end_date,
        total_amount: req.body.total_amount,
      };

      const booking = await bookingService.createBooking(bookingData);
      res.status(201).json({
        status: "success",
        data: booking,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getAllBookings(req: Request, res: Response) {
    try {
      const bookings = await bookingService.getAllBookings();
      res.status(200).json({
        status: "success",
        data: bookings,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getBookingById(req: Request, res: Response) {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await bookingService.getBookingById(bookingId);
      
      if (!booking) {
        res.status(404).json({
          status: "error",
          message: "Booking not found",
        });
        return 
      }

      res.status(200).json({
        status: "success",
        data: booking,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateBooking(req: Request, res: Response) {
    try {
      const bookingId = parseInt(req.params.id);
      const bookingData = {
        customer_id: req.body.customer_id,
        car_id: req.body.car_id,
        rental_start_date: req.body.rental_start_date,
        rental_end_date: req.body.rental_end_date,
        total_amount: req.body.total_amount,
      };

      const updatedBooking = await bookingService.updateBooking(bookingId, bookingData);
      
      if (!updatedBooking) {
        res.status(404).json({
          status: "error",
          message: "Booking not found",
        });
        return 
      }

      res.status(200).json({
        status: "success",
        data: updatedBooking,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      const bookingId = parseInt(req.params.id);
      const deletedBooking = await bookingService.deleteBooking(bookingId);
      
      if (!deletedBooking) {
        res.status(404).json({
          status: "error",
          message: "Booking not found",
        });
        return 
      }

      res.status(200).json({
        status: "success",
        data: deletedBooking,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
}
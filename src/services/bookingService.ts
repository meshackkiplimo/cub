import db from "../drizzle/db";
import { BookingTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export class BookingService {
  async createBooking(bookingData: any) {
    try {
      const booking = await db.insert(BookingTable).values(bookingData).returning();
      return booking[0];
    } catch (error: any) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  async getAllBookings() {
    try {
      const bookings = await db.select().from(BookingTable);
      return bookings;
    } catch (error: any) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
  }

  async getBookingById(bookingId: number) {
    try {
      const booking = await db
        .select()
        .from(BookingTable)
        .where(eq(BookingTable.booking_id, bookingId));
      return booking[0];
    } catch (error: any) {
      throw new Error(`Failed to fetch booking: ${error.message}`);
    }
  }

  async updateBooking(bookingId: number, bookingData: any) {
    try {
      const updatedBooking = await db
        .update(BookingTable)
        .set(bookingData)
        .where(eq(BookingTable.booking_id, bookingId))
        .returning();
      return updatedBooking[0];
    } catch (error: any) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }
  }

  async deleteBooking(bookingId: number) {
    try {
      const deletedBooking = await db
        .delete(BookingTable)
        .where(eq(BookingTable.booking_id, bookingId))
        .returning();
      return deletedBooking[0];
    } catch (error: any) {
      throw new Error(`Failed to delete booking: ${error.message}`);
    }
  }
}
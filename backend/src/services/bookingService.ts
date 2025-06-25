import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { BookingTable } from "../drizzle/schema";
import { CreateBookingDto, DbBooking, UpdateBookingDto } from "../types/booking";

export const createBookingService = async (booking: CreateBookingDto): Promise<DbBooking | null> => {
    const newBooking = await db.insert(BookingTable)
        .values({ ...booking, status: 'pending' })
        .returning();
    return newBooking[0] || null;
}

export const getBookingService = async (bookingId: number) => {
    return await db.query.BookingTable.findFirst({
        columns: {
            booking_id: true,
            user_id: true,
            car_id: true,
            rental_start_date: true,
            rental_end_date: true,
            total_amount: true,
            status: true
        },
        with: {
            user: {
                columns: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    role: true,
                 
                

                }
            },
            car: {
                columns: {
                    car_id: true,
                    make: true,
                    model: true,
                    year: true,
                    color: true,
                    rental_rate: true,
                    availability: true,
                    location_id: true
                }
            }
        },
        where: sql`${BookingTable.booking_id}=${bookingId}`
    });
}

export const getAllBookingsService = async () => {
    return await db.query.BookingTable.findMany({
        columns: {
            booking_id: true,
            user_id: true,
            car_id: true,
            rental_start_date: true,
            rental_end_date: true,
            total_amount: true,
            status: true
        },
        with: {
            user: {
                columns: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    
                  
                    
                
                }
            },
            car: {
                columns: {
                    car_id: true,
                    make: true,
                    model: true,
                    year: true,
                    color: true,
                    rental_rate: true,
                    availability: true,
                    location_id: true
                }
            }
        }
    });
}

export const updateBookingService = async (bookingId: number, booking: UpdateBookingDto): Promise<DbBooking | null> => {
    const updatedBooking = await db.update(BookingTable)
        .set(booking)
        .where(sql`${BookingTable.booking_id}=${bookingId}`)
        .returning();
    return updatedBooking[0] || null;
}

export const deleteBookingService = async (bookingId: number): Promise<DbBooking | null> => {
    const deletedBooking = await db.delete(BookingTable)
        .where(sql`${BookingTable.booking_id}=${bookingId}`)
        .returning();
    return deletedBooking[0] || null;
}

export const completeBookingService = async (bookingId: number): Promise<DbBooking | null> => {
    const updatedBooking = await db.update(BookingTable)
        .set({ status: 'completed' })
        .where(sql`${BookingTable.booking_id}=${bookingId}`)
        .returning();
    return updatedBooking[0] || null;
}

export const cancelBookingService = async (bookingId: number): Promise<DbBooking | null> => {
    const updatedBooking = await db.update(BookingTable)
        .set({ status: 'cancelled' })
        .where(sql`${BookingTable.booking_id}=${bookingId}`)
        .returning();
    return updatedBooking[0] || null;
}
import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { BookingTable } from "../drizzle/schema";
import { TIBooking } from "../types";

export const createBookingService = async (booking: TIBooking) => {
    const newBooking = await db.insert(BookingTable).values(booking).returning();
    return newBooking[0];
}

export const getBookingService = async (bookingId: number) => {
    return await db.query.BookingTable.findFirst({
        columns: {
            booking_id: true,
            customer_id: true,
            car_id: true,
            rental_start_date: true,
            rental_end_date: true,
            total_amount: true
        },
        with: {
            customer: {
                columns: {
                    customer_id: true,
                    phone_number: true,
                    address: true
                },
                with: {
                    user: {
                        columns: {
                            first_name: true,
                            last_name: true,
                            email: true
                        }
                    }
                }
            },
            car: {
                columns: {
                    manufacturer: true,
                    car_model: true,
                    year: true,
                    color: true,
                    rental_rate: true
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
            customer_id: true,
            car_id: true,
            rental_start_date: true,
            rental_end_date: true,
            total_amount: true
        },
        with: {
            customer: {
                columns: {
                    customer_id: true,
                    phone_number: true,
                    address: true
                },
                with: {
                    user: {
                        columns: {
                            first_name: true,
                            last_name: true,
                            email: true
                        }
                    }
                }
            },
            car: {
                columns: {
                    manufacturer: true,
                    car_model: true,
                    year: true,
                    color: true,
                    rental_rate: true
                }
            }
        }
    });
}

export const updateBookingService = async (bookingId: number, booking: Partial<TIBooking>) => {
    const updatedBooking = await db.update(BookingTable)
        .set(booking)
        .where(sql`${BookingTable.booking_id}=${bookingId}`)
        .returning();
    return updatedBooking[0];
}

export const deleteBookingService = async (bookingId: number) => {
    return await db.delete(BookingTable)
        .where(sql`${BookingTable.booking_id}=${bookingId}`)
        .returning();
}
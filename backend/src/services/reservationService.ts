import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { ReservationTable, CarTable } from "../drizzle/schema";
import { TIReservation } from "../types";

export const createReservationService = async (reservation: TIReservation) => {
    // Check if car is available
    const car = await db.query.CarTable.findFirst({
        columns: {
            availability: true,
            car_id: true
        },
        where: sql`${CarTable.car_id}=${reservation.car_id}`
    });

    console.log('Found car:', car);
    
    if (!car) {
        throw new Error("Car not found");
    }
    
    if (!car.availability) {
        throw new Error("Car is not available for reservation");
    }

    // Create reservation and update car availability
    const newReservation = await db.transaction(async (tx) => {
        const [reservationResult] = await tx.insert(ReservationTable)
            .values(reservation)
            .returning();

        await tx.update(CarTable)
            .set({ availability: false })
            .where(sql`${CarTable.car_id}=${reservation.car_id}`);

        return reservationResult;
    });

    return newReservation;
}

export const getReservationService = async (reservationId: number) => {
    try {
        const result = await db.query.ReservationTable.findFirst({
        columns: {
            reservation_id: true,
            user_id: true,
            car_id: true,
            reservation_date: true,
            pickup_date: true,
            return_date: true
        },
        with: {
            user: {
                columns: {
                   
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true
                }
                
                    
                
            },
            car: {
                columns: {
                    make: true,
                    model: true,
                    year: true,
                    color: true,
                    rental_rate: true
                }
            }
        },
            where: sql`${ReservationTable.reservation_id}=${reservationId}`
        });
        
        return result;
    } catch (error) {
        console.error('Error in getReservationService:', error);
        throw error;
    }
}

export const getAllReservationsService = async () => {
    try {
        return await db.query.ReservationTable.findMany({
        columns: {
            reservation_id: true,
            user_id: true,
            car_id: true,
            reservation_date: true,
            pickup_date: true,
            return_date: true
        },
        with: {
            user: {
                columns: {
                   
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true
                },
                
            },
            car: {
                columns: {
                    make: true,
                    model: true,
                    year: true
                }
            }
        }
        });
    } catch (error) {
        console.error('Error in getAllReservationsService:', error);
        throw error;
    }
}

export const getCustomerReservationsService = async (user_id: number) => {
    try {
        return await db.query.ReservationTable.findMany({
        columns: {
            reservation_id: true,
            reservation_date: true,
            pickup_date: true,
            return_date: true
        },
        with: {
            user: {
                columns: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    
                },
                
            },
            car: {
                columns: {
                    make: true,
                    model: true,
                    year: true,
                    color: true,
                    rental_rate: true
                }
            }
        },
            where: sql`${ReservationTable.user_id}=${user_id}`,
        });
    } catch (error) {
        console.error('Error in getCustomerReservationsService:', error);
        throw error;
    }
}

export const updateReservationService = async (reservationId: number, reservation: Partial<TIReservation>) => {
    const updatedReservation = await db.update(ReservationTable)
        .set(reservation)
        .where(sql`${ReservationTable.reservation_id}=${reservationId}`)
        .returning();
    return updatedReservation[0];
}

export const completeReservationService = async (reservationId: number, returnDate: string) => {
    // Get reservation to find car_id
    const reservation = await getReservationService(reservationId);
    if (!reservation) {
        throw new Error("Reservation not found");
    }

    // Update reservation and car availability
    return await db.transaction(async (tx) => {
        const [updatedReservation] = await tx.update(ReservationTable)
            .set({ return_date: returnDate })
            .where(sql`${ReservationTable.reservation_id}=${reservationId}`)
            .returning();

        await tx.update(CarTable)
            .set({ availability: true })
            .where(sql`${CarTable.car_id}=${reservation.car_id}`);

        return updatedReservation;
    });
}

export const deleteReservationService = async (reservationId: number) => {
    // Get reservation to find car_id
    const reservation = await getReservationService(reservationId);
    if (!reservation) {
        throw new Error("Reservation not found");
    }

    // Delete reservation and update car availability
    return await db.transaction(async (tx) => {
        const deletedReservation = await tx.delete(ReservationTable)
            .where(sql`${ReservationTable.reservation_id}=${reservationId}`)
            .returning();

        await tx.update(CarTable)
            .set({ availability: true })
            .where(sql`${CarTable.car_id}=${reservation.car_id}`);

        return deletedReservation[0];
    });
}
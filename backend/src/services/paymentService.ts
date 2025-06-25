import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { PaymentTable } from "../drizzle/schema";
import { TIPayment } from "../types";

export const createPaymentService = async (payment: TIPayment) => {
    const newPayment = await db.insert(PaymentTable).values(payment).returning();
    return newPayment[0];
}

export const getPaymentService = async (paymentId: number) => {
    return await db.query.PaymentTable.findFirst({
        columns: {
            payment_id: true,
            booking_id: true,
            payment_date: true,
            amount: true,
            payment_method: true
        },
        with: {
            booking: {
                columns: {
                    booking_id: true,
                    rental_start_date: true,
                    rental_end_date: true,
                    total_amount: true
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
                            year: true
                        }
                    }
                }
            }
        },
        where: sql`${PaymentTable.payment_id}=${paymentId}`
    });
}

export const getAllPaymentsService = async () => {
    return await db.query.PaymentTable.findMany({
        columns: {
            payment_id: true,
            booking_id: true,
            payment_date: true,
            amount: true,
            payment_method: true
        },
        with: {
            booking: {
                columns: {
                    booking_id: true,
                    rental_start_date: true,
                    rental_end_date: true,
                    total_amount: true
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
            }
        }
    });
}

export const updatePaymentService = async (paymentId: number, payment: Partial<TIPayment>) => {
    const updatedPayment = await db.update(PaymentTable)
        .set(payment)
        .where(sql`${PaymentTable.payment_id}=${paymentId}`)
        .returning();
    return updatedPayment[0];
}

export const deletePaymentService = async (paymentId: number) => {
    return await db.delete(PaymentTable)
        .where(sql`${PaymentTable.payment_id}=${paymentId}`)
        .returning();
}
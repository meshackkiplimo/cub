import { BookingTable, CarTable, CustomerTable, InsuranceTable, LocationTable, MaintenanceTable, PaymentTable, ReservationTable } from "./drizzle/schema";



export type TICustomer = typeof CustomerTable.$inferInsert
export type TSCustomer = typeof CustomerTable.$inferSelect
export type TILocation= typeof LocationTable.$inferInsert
export type TSLocation = typeof LocationTable.$inferSelect
export type TICar = typeof CarTable.$inferInsert
export type TSCar = typeof CarTable.$inferSelect
export type TIReservation = typeof ReservationTable.$inferInsert
export type TSReservation = typeof ReservationTable.$inferSelect
export type TIBooking = typeof BookingTable.$inferInsert
export type TSBooking = typeof BookingTable.$inferSelect
export type TIPayment = typeof PaymentTable.$inferInsert
export type TSPayment = typeof PaymentTable.$inferSelect
export type TIMaintenance = typeof MaintenanceTable.$inferInsert
export type TSMaintenance = typeof MaintenanceTable.$inferSelect
export type TIInsurance = typeof InsuranceTable.$inferInsert
export type TSInsurance = typeof InsuranceTable.$inferSelect
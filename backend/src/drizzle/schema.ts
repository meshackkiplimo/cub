import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, varchar, decimal, integer, pgEnum } from "drizzle-orm/pg-core";

export const BookingStatusEnum = pgEnum('booking_status', ['pending', 'completed', 'cancelled']);

export const UserTable = pgTable("user", {
    user_id: serial("user_id").primaryKey(),
    first_name: varchar("first_name", { length: 50 }).notNull(),
    last_name: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull().default("customer"),
    is_verified: boolean("is_verified").notNull().default(false),
});


// export const CustomerTable = pgTable("customer", {
//     customer_id: serial("customer_id").primaryKey(),
//     user_id: integer("user_id").notNull().references(() => UserTable.user_id, { onDelete: 'cascade' }),
//     phone_number: varchar("phone", { length: 15 }).notNull(),
//     address: varchar("address", { length: 255 }).notNull(),
// });

export const LocationTable = pgTable("location", {
    location_id: serial("location_id").primaryKey(),
    location_name: varchar("location_name", { length: 100 }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    contact_number: varchar("contact_number", { length: 15 }).notNull(),
});

export const CarTable = pgTable("car", {
    car_id: serial("car_id").primaryKey(),
    make: varchar("make", { length: 50 }).notNull(),
    model: varchar("model", { length: 50 }).notNull(),
    year: varchar("year", { length: 4 }).notNull(),
    color: varchar("color", { length: 20 }).notNull(),
    availability: boolean("availability").notNull().default(true),
    rental_rate: decimal("rental_rate", { precision: 10, scale: 2 }).notNull(),
    location_id: integer("location_id").notNull().references(() => LocationTable.location_id, { onDelete: 'cascade' }),
    image_url: varchar("image_url", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
})

export const ReservationTable = pgTable("reservation", {
    reservation_id: serial("reservation_id").primaryKey(),
    user_id: integer("customer_id").notNull().references(() => UserTable.user_id, { onDelete: 'cascade' }),
    car_id: integer("car_id").notNull().references(() => CarTable.car_id, { onDelete: 'cascade' }),
    reservation_date: varchar("start_date", { length: 10 }).notNull(),
    pickup_date: varchar("end_date", { length: 10 }).notNull(),
    return_date: varchar("return_date", { length: 10 })
})

export const BookingTable = pgTable("booking", {
    booking_id: serial("booking_id").primaryKey(),
    user_id: integer("customer_id").notNull().references(() => UserTable.user_id, { onDelete: 'cascade' }),
    car_id: integer("car_id").notNull().references(() => CarTable.car_id, { onDelete: 'cascade' }),
    rental_start_date: varchar("rental_start_date", { length: 10 }).notNull(),
    rental_end_date: varchar("rental_end_date", { length: 10 }).notNull(),
    total_amount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: BookingStatusEnum("status").notNull().default('pending'),
});

export const PaymentTable = pgTable("payment", {
    payment_id: serial("payment_id").primaryKey(),
    booking_id: integer("booking_id").notNull().references(() => BookingTable.booking_id, { onDelete: 'cascade' }),
    payment_date: varchar("payment_date", { length: 10 }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
});

export const MaintenanceTable = pgTable("maintenance", {
    maintenance_id: serial("maintenance_id").primaryKey(),
    car_id: integer("car_id").notNull().references(() => CarTable.car_id, { onDelete: 'cascade' }),
    maintenance_date: varchar("maintenance_date", { length: 10 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
});

export const InsuranceTable = pgTable("insurance", {
    insurance_id: serial("insurance_id").primaryKey(),
    car_id: integer("car_id").notNull().references(() => CarTable.car_id, { onDelete: 'cascade' }),
    provider: varchar("provider", { length: 100 }).notNull(),
    policy_number: varchar("policy_number", { length: 50 }).notNull(),
    start_date: varchar("start_date", { length: 10 }).notNull(),
    end_date: varchar("end_date", { length: 10 }).notNull(),
});

// Define relations
// export const UserRelations = relations(UserTable, ({ one }) => ({
//     customer: one(CustomerTable, {
//         fields: [UserTable.user_id],
//         references: [CustomerTable.user_id],
//     }),
// }));

// export const CustomerRelations = relations(CustomerTable, ({ many, one }) => ({
//     user: one(UserTable, {
//         fields: [CustomerTable.user_id],
//         references: [UserTable.user_id],
//     }),
//     bookings: many(BookingTable),
//     reservations: many(ReservationTable)
// }));

export const LocationRelations = relations(LocationTable, ({ many }) => ({
    cars: many(CarTable)
}));


export const CarRelations = relations(CarTable, ({ many, one }) => ({
    reservations: many(ReservationTable),
    location: one(LocationTable, {
        fields: [CarTable.location_id],
        references: [LocationTable.location_id]
    }),
    bookings: many(BookingTable),
    maintenance: many(MaintenanceTable),
    insurance: many(InsuranceTable)
}));

export const ReservationRelations = relations(ReservationTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [ReservationTable.user_id],
        references: [UserTable.user_id],
    }),
    car: one(CarTable, {
        fields: [ReservationTable.car_id],
        references: [CarTable.car_id],
    }),
}));

export const BookingRelations = relations(BookingTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [BookingTable.user_id],
        references: [UserTable.user_id],
    }),
    car: one(CarTable, {
        fields: [BookingTable.car_id],
        references: [CarTable.car_id],
    }),
}));

export const PaymentRelations = relations(PaymentTable, ({ one }) => ({
    booking: one(BookingTable, {
        fields: [PaymentTable.booking_id],
        references: [BookingTable.booking_id],
    }),
}));

export const MaintenanceRelations = relations(MaintenanceTable, ({ one }) => ({
    car: one(CarTable, {
        fields: [MaintenanceTable.car_id],
        references: [CarTable.car_id],
    }),
}));

export const InsuranceRelations = relations(InsuranceTable, ({ one }) => ({
    car: one(CarTable, {
        fields: [InsuranceTable.car_id],
        references: [CarTable.car_id],
    }),
}));

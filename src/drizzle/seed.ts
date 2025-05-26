import db from "./db"
import { CarTable, LocationTable, CustomerTable, ReservationTable, BookingTable, PaymentTable, MaintenanceTable, InsuranceTable } from "./schema";

async function seed() {

    console.log("......Seeding Started......");

    await db.insert(LocationTable).values([
        {location_name: "Downtown", address: "123 Main St, Cityville, ST 12345",contact_number: "123-456-7890"},
        {location_name: "Airport", address: "456 Airport Rd, Cityville, ST 12345", contact_number: "987-654-3210"},
        {location_name: "Suburban", address: "789 Suburbia Ave, Cityville, ST 12345", contact_number: "555-123-4567"},
        {location_name: "City Center", address: "321 City Center Blvd, Cityville, ST 12345", contact_number: "444-987-6543"},
        {location_name: "Uptown", address: "654 Uptown St, Cityville, ST 12345", contact_number: "333-555-7890"},
    ]);

    await db.insert(CarTable).values([
        {
            manufacturer: "Toyota",
            car_model: "Camry",
            year: "2022",
            color: "Silver",
            availability: true,
            rental_rate: "50.00",
            location_id: 1
        },
        {
            manufacturer: "Honda",
            car_model: "Civic",
            year: "2021",
            color: "Blue",
            availability: true,
            rental_rate: "45.00",
            location_id: 2
        },
        {
            manufacturer: "BMW",
            car_model: "3 Series",
            year: "2023",
            color: "Black",
            availability: true,
            rental_rate: "75.00",
            location_id: 3
        },
        {
            manufacturer: "Mercedes",
            car_model: "C-Class",
            year: "2022",
            color: "White",
            availability: true,
            rental_rate: "80.00",
            location_id: 4
        },
        {
            manufacturer: "Tesla",
            car_model: "Model 3",
            year: "2023",
            color: "Red",
            availability: true,
            rental_rate: "90.00",
            location_id: 5
        }
    ]);


    // Seed Customers
    await db.insert(CustomerTable).values([
        {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@email.com",
            phone_number: "111-222-3333",
            address: "101 Oak Street, Cityville, ST 12345"
        },
        {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@email.com",
            phone_number: "444-555-6666",
            address: "202 Pine Avenue, Cityville, ST 12345"
        },
        {
            first_name: "Michael",
            last_name: "Johnson",
            email: "michael.j@email.com",
            phone_number: "777-888-9999",
            address: "303 Maple Road, Cityville, ST 12345"
        }
    ]);

    // Seed Reservations
    await db.insert(ReservationTable).values([
        {
            customer_id: 1,
            car_id: 1,
            reservation_date: "2024-05-26",
            pickup_date: "2024-06-01",
            return_date: "2024-06-05"
        },
        {
            customer_id: 2,
            car_id: 3,
            reservation_date: "2024-05-26",
            pickup_date: "2024-06-10",
            return_date: "2024-06-15"
        }
    ]);

    // Seed Bookings
    await db.insert(BookingTable).values([
        {
            customer_id: 1,
            car_id: 2,
            rental_start_date: "2024-05-27",
            rental_end_date: "2024-05-30",
            total_amount: "150.00"
        },
        {
            customer_id: 3,
            car_id: 4,
            rental_start_date: "2024-05-28",
            rental_end_date: "2024-06-02",
            total_amount: "400.00"
        }
    ]);

    // Seed Payments
    await db.insert(PaymentTable).values([
        {
            booking_id: 1,
            payment_date: "2024-05-27",
            amount: "150.00",
            payment_method: "Credit Card"
        },
        {
            booking_id: 2,
            payment_date: "2024-05-28",
            amount: "400.00",
            payment_method: "Debit Card"
        }
    ]);

    // Seed Maintenance Records
    await db.insert(MaintenanceTable).values([
        {
            car_id: 1,
            maintenance_date: "2024-04-15",
            description: "Regular service and oil change",
            cost: "150.00"
        },
        {
            car_id: 3,
            maintenance_date: "2024-05-01",
            description: "Brake pad replacement",
            cost: "300.00"
        }
    ]);

    // Seed Insurance Records
    await db.insert(InsuranceTable).values([
        {
            car_id: 1,
            provider: "SafeCar Insurance",
            policy_number: "POL-001-2024",
            start_date: "2024-01-01",
            end_date: "2024-12-31"
        },
        {
            car_id: 2,
            provider: "AutoGuard Insurance",
            policy_number: "POL-002-2024",
            start_date: "2024-01-01",
            end_date: "2024-12-31"
        },
        {
            car_id: 3,
            provider: "PremiumCover Insurance",
            policy_number: "POL-003-2024",
            start_date: "2024-01-01",
            end_date: "2024-12-31"
        }
    ]);

    console.log("......Seeding Completed......");
}
seed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1); // 1 means an error occurred
}).then(() => {
    console.log("Seeding finished successfully.");
    process.exit(0); // 0 means success
});

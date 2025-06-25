import db from "./db"
import { CarTable, LocationTable, ReservationTable, BookingTable, PaymentTable, MaintenanceTable, InsuranceTable, UserTable } from "./schema";

async function seed() {

    console.log("......Seeding Started......");

    // Seed Users first since CustomerTable references UserTable
    await db.insert(UserTable).values([
        {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@email.com",
            password: "hashed_password_1",
            role: "customer"
        },
        {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@email.com",
            password: "hashed_password_2",
            role: "customer"
        },
        {
            first_name: "Michael",
            last_name: "Johnson",
            email: "michael.j@email.com",
            password: "hashed_password_3",
            role: "customer"
        },
        {
            first_name: "Sarah",
            last_name: "Wilson",
            email: "sarah.w@email.com",
            password: "hashed_password_4",
            role: "customer"
        },
        {
            first_name: "David",
            last_name: "Brown",
            email: "david.b@email.com",
            password: "hashed_password_5",
            role: "admin"
        },
        {
            first_name: "Emily",
            last_name: "Taylor",
            email: "emily.t@email.com",
            password: "hashed_password_6",
            role: "customer"
        },
        {
            first_name: "James",
            last_name: "Anderson",
            email: "james.a@email.com",
            password: "hashed_password_7",
            role: "customer"
        },
        {
            first_name: "Lisa",
            last_name: "Martinez",
            email: "lisa.m@email.com",
            password: "hashed_password_8",
            role: "customer"
        },
        {
            first_name: "Robert",
            last_name: "Garcia",
            email: "robert.g@email.com",
            password: "hashed_password_9",
            role: "customer"
        },
        {
            first_name: "Admin",
            last_name: "User",
            email: "admin@email.com",
            password: "admin_password",
            role: "admin"
        }
    ]);

    await db.insert(LocationTable).values([
        {location_name: "Downtown", address: "123 Main St, Cityville, ST 12345", contact_number: "123-456-7890"},
        {location_name: "Airport", address: "456 Airport Rd, Cityville, ST 12345", contact_number: "987-654-3210"},
        {location_name: "Suburban", address: "789 Suburbia Ave, Cityville, ST 12345", contact_number: "555-123-4567"},
        {location_name: "City Center", address: "321 City Center Blvd, Cityville, ST 12345", contact_number: "444-987-6543"},
        {location_name: "Uptown", address: "654 Uptown St, Cityville, ST 12345", contact_number: "333-555-7890"},
        {location_name: "West End", address: "789 West End Blvd, Cityville, ST 12345", contact_number: "222-333-4444"},
        {location_name: "East Side", address: "321 East Side Ave, Cityville, ST 12345", contact_number: "111-222-3333"},
        {location_name: "North Station", address: "456 North Road, Cityville, ST 12345", contact_number: "999-888-7777"},
        {location_name: "South Plaza", address: "789 South Street, Cityville, ST 12345", contact_number: "777-666-5555"},
        {location_name: "Business District", address: "101 Business Ave, Cityville, ST 12345", contact_number: "666-555-4444"}
    ]);

    await db.insert(CarTable).values([
        {
            make: "Toyota",
            model: "Camry",
            year: "2022",
            color: "Silver",
            availability: true,
            rental_rate: "50.00",
            location_id: 1,
            image_url: "https://example.com/toyota_camry_2022.jpg",
            description: "A reliable and fuel-efficient sedan perfect for city driving."
        },
        {
            make: "Honda",
            model: "Civic",
            year: "2021",
            color: "Blue",
            availability: true,
            rental_rate: "45.00",
            location_id: 2,
            image_url: "https://example.com/honda_civic_2021.jpg",
            description: "A compact car with sporty handling and advanced safety features.",
        },
        {
            make: "BMW",
            model: "3 Series",
            year: "2023",
            color: "Black",
            availability: true,
            rental_rate: "75.00",
            location_id: 3,
            image_url: "https://example.com/bmw_3_series_2023.jpg",
            description: "A luxury sedan with a powerful engine and premium interior."
        },
        {
            make: "Mercedes",
            model: "C-Class",
            year: "2022",
            color: "White",
            availability: true,
            rental_rate: "80.00",
            location_id: 4,
            image_url: "https://example.com/mercedes_c_class_2022.jpg",
            description: "A sophisticated sedan with cutting-edge technology and comfort."
        },
        {
            make: "Tesla",
            model: "Model 3",
            year: "2023",
            color: "Red",
            availability: true,
            rental_rate: "90.00",
            location_id: 5,
            image_url: "https://example.com/tesla_model_3_2023.jpg",
            description: "An all-electric sedan with impressive range and performance."
        },
        {
            make: "Audi",
            model: "A4",
            year: "2023",
            color: "Gray",
            availability: true,
            rental_rate: "85.00",
            location_id: 6,
            image_url: "https://example.com/audi_a4_2023.jpg",
            description: "A premium compact sedan with a refined interior and advanced tech."
        },
        {
            make: "Lexus",
            model: "ES",
            year: "2022",
            color: "Black",
            availability: true,
            rental_rate: "82.00",
            location_id: 7,
            image_url: "https://example.com/lexus_es_2022.jpg",
            description: "A luxury sedan known for its comfort, reliability, and smooth ride."
        },
        {
            make: "Volkswagen",
            model: "Golf",
            year: "2023",
            color: "Blue",
            availability: true,
            rental_rate: "55.00",
            location_id: 8,
            image_url: "https://example.com/volkswagen_golf_2023.jpg",
            description: "A versatile hatchback with a spacious interior and fun driving dynamics."
        },
        {
            make: "Hyundai",
            model: "Sonata",
            year: "2022",
            color: "Silver",
            availability: true,
            rental_rate: "48.00",
            location_id: 9,
            image_url: "https://example.com/hyundai_sonata_2022.jpg",
            description: "A stylish sedan with a comfortable ride and modern features."
        },
        {
            make: "Ford",
            model: "Mustang",
            year: "2023",
            color: "Yellow",
            availability: true,
            rental_rate: "95.00",
            location_id: 10,
            image_url: "https://example.com/ford_mustang_2023.jpg",
            description: "An iconic sports car with a powerful engine and thrilling performance."
        }
    ]);


    // Seed Customers (references UserTable)
    // await db.insert(CustomerTable).values([
    //     {
    //         user_id: 1,
    //         phone_number: "111-222-3333",
    //         address: "101 Oak Street, Cityville, ST 12345"
    //     },
    //     {
    //         user_id: 2,
    //         phone_number: "444-555-6666",
    //         address: "202 Pine Avenue, Cityville, ST 12345"
    //     },
    //     {
    //         user_id: 3,
    //         phone_number: "777-888-9999",
    //         address: "303 Maple Road, Cityville, ST 12345"
    //     },
    //     {
    //         user_id: 4,
    //         phone_number: "123-456-7890",
    //         address: "404 Elm Street, Cityville, ST 12345"
    //     },
    //     {
    //         user_id: 6,
    //         phone_number: "234-567-8901",
    //         address: "505 Cedar Lane, Cityville, ST 12345"
    //     },
    //     {
    //         user_id: 7,
    //         phone_number: "345-678-9012",
    //         address: "606 Birch Road, Cityville, ST 12345"
    //     },
    //     {
    //         user_id: 8,
    //         phone_number: "456-789-0123",
    //         address: "707 Willow Way, Cityville, ST 12345"
    //     },
    //     {
    //         user_id: 9,
    //         phone_number: "567-890-1234",
    //         address: "808 Maple Court, Cityville, ST 12345"
    //     },
    //     {
    //         user_id: 10,
    //         phone_number: "678-901-2345",
    //         address: "909 Pine Street, Cityville, ST 12345"
    //     }
    // ]);

    // Seed Reservations
    await db.insert(ReservationTable).values([
        {
            user_id: 1,
            car_id: 1,
            reservation_date: "2024-05-26",
            pickup_date: "2024-06-01",
            return_date: "2024-06-05"
        },
        {
            user_id: 2,
            car_id: 3,
            reservation_date: "2024-05-26",
            pickup_date: "2024-06-10",
            return_date: "2024-06-15"
        },
        {
            user_id: 3,
            car_id: 5,
            reservation_date: "2024-05-27",
            pickup_date: "2024-06-15",
            return_date: "2024-06-20"
        },
        {
            user_id: 4,
            car_id: 7,
            reservation_date: "2024-05-28",
            pickup_date: "2024-06-20",
            return_date: "2024-06-25"
        },
        {
            user_id: 5,
            car_id: 2,
            reservation_date: "2024-05-29",
            pickup_date: "2024-06-05",
            return_date: "2024-06-10"
        },
        {
            user_id: 6,
            car_id: 4,
            reservation_date: "2024-05-30",
            pickup_date: "2024-06-12",
            return_date: "2024-06-18"
        },
        {
            user_id: 7,
            car_id: 6,
            reservation_date: "2024-05-31",
            pickup_date: "2024-06-25",
            return_date: "2024-06-30"
        },
        {
            user_id: 8,
            car_id: 8,
            reservation_date: "2024-06-01",
            pickup_date: "2024-07-01",
            return_date: "2024-07-05"
        },
        {
            user_id: 9,
            car_id: 9,
            reservation_date: "2024-06-02",
            pickup_date: "2024-07-10",
            return_date: "2024-07-15"
        },
        {
            user_id: 1,
            car_id: 10,
            reservation_date: "2024-06-03",
            pickup_date: "2024-07-20",
            return_date: "2024-07-25"
        }
    ]);

    // Seed Bookings
    await db.insert(BookingTable).values([
        {
            user_id: 1,
            car_id: 2,
            rental_start_date: "2024-05-27",
            rental_end_date: "2024-05-30",
            total_amount: "150.00"
        },
        {
            user_id: 3,
            car_id: 4,
            rental_start_date: "2024-05-28",
            rental_end_date: "2024-06-02",
            total_amount: "400.00"
        },
        {
            user_id: 2,
            car_id: 6,
            rental_start_date: "2024-05-29",
            rental_end_date: "2024-06-03",
            total_amount: "425.00"
        },
        {
            user_id: 4,
            car_id: 8,
            rental_start_date: "2024-05-30",
            rental_end_date: "2024-06-04",
            total_amount: "275.00"
        },
        {
            user_id: 5,
            car_id: 1,
            rental_start_date: "2024-05-31",
            rental_end_date: "2024-06-05",
            total_amount: "250.00"
        },
        {
            user_id: 6,
            car_id: 3,
            rental_start_date: "2024-06-01",
            rental_end_date: "2024-06-06",
            total_amount: "375.00"
        },
        {
            user_id: 7,
            car_id: 5,
            rental_start_date: "2024-06-02",
            rental_end_date: "2024-06-07",
            total_amount: "450.00"
        },
        {
            user_id: 8,
            car_id: 7,
            rental_start_date: "2024-06-03",
            rental_end_date: "2024-06-08",
            total_amount: "410.00"
        },
        {
            user_id: 9,
            car_id: 9,
            rental_start_date: "2024-06-04",
            rental_end_date: "2024-06-09",
            total_amount: "240.00"
        },
        {
            user_id: 1,
            car_id: 10,
            rental_start_date: "2024-06-05",
            rental_end_date: "2024-06-10",
            total_amount: "475.00"
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
        },
        {
            booking_id: 3,
            payment_date: "2024-05-29",
            amount: "425.00",
            payment_method: "Credit Card"
        },
        {
            booking_id: 4,
            payment_date: "2024-05-30",
            amount: "275.00",
            payment_method: "PayPal"
        },
        {
            booking_id: 5,
            payment_date: "2024-05-31",
            amount: "250.00",
            payment_method: "Credit Card"
        },
        {
            booking_id: 6,
            payment_date: "2024-06-01",
            amount: "375.00",
            payment_method: "Debit Card"
        },
        {
            booking_id: 7,
            payment_date: "2024-06-02",
            amount: "450.00",
            payment_method: "PayPal"
        },
        {
            booking_id: 8,
            payment_date: "2024-06-03",
            amount: "410.00",
            payment_method: "Credit Card"
        },
        {
            booking_id: 9,
            payment_date: "2024-06-04",
            amount: "240.00",
            payment_method: "Debit Card"
        },
        {
            booking_id: 10,
            payment_date: "2024-06-05",
            amount: "475.00",
            payment_method: "Credit Card"
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
        },
        {
            car_id: 2,
            maintenance_date: "2024-05-15",
            description: "Tire rotation and alignment",
            cost: "120.00"
        },
        {
            car_id: 4,
            maintenance_date: "2024-05-20",
            description: "Air conditioning service",
            cost: "200.00"
        },
        {
            car_id: 5,
            maintenance_date: "2024-05-25",
            description: "Battery replacement",
            cost: "250.00"
        },
        {
            car_id: 6,
            maintenance_date: "2024-06-01",
            description: "Transmission service",
            cost: "400.00"
        },
        {
            car_id: 7,
            maintenance_date: "2024-06-05",
            description: "Engine tune-up",
            cost: "350.00"
        },
        {
            car_id: 8,
            maintenance_date: "2024-06-10",
            description: "Suspension check and repair",
            cost: "280.00"
        },
        {
            car_id: 9,
            maintenance_date: "2024-06-15",
            description: "Brake fluid replacement",
            cost: "100.00"
        },
        {
            car_id: 10,
            maintenance_date: "2024-06-20",
            description: "Regular service and inspection",
            cost: "180.00"
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
        },
        {
            car_id: 4,
            provider: "SecureDrive Insurance",
            policy_number: "POL-004-2024",
            start_date: "2024-01-01",
            end_date: "2024-12-31"
        },
        {
            car_id: 5,
            provider: "TopCover Insurance",
            policy_number: "POL-005-2024",
            start_date: "2024-01-01",
            end_date: "2024-12-31"
        },
        {
            car_id: 6,
            provider: "EliteCar Insurance",
            policy_number: "POL-006-2024",
            start_date: "2024-01-01",
            end_date: "2024-12-31"
        },
        {
            car_id: 7,
            provider: "TotalProtect Insurance",
            policy_number: "POL-007-2024",
            start_date: "2024-01-01",
            end_date: "2024-12-31"
        },
        {
            car_id: 8,
            provider: "DriveShield Insurance",
            policy_number: "POL-008-2024",
            start_date: "2024-01-01",
            end_date: "2024-12-31"
        },
        {
            car_id: 9,
            provider: "MaxCover Insurance",
            policy_number: "POL-009-2024",
            start_date: "2024-01-01",
            end_date: "2024-12-31"
        },
        {
            car_id: 10,
            provider: "PrimeDrive Insurance",
            policy_number: "POL-010-2024",
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

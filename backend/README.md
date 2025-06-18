# Car Rental System Documentation

## System Overview
This is a comprehensive car rental management system built with TypeScript, Express.js, and Drizzle ORM. The system manages car rentals, bookings, customers, payments, and vehicle maintenance.

## Database Schema

### Core Entities

#### Users
- `user_id` (Primary Key)
- `first_name`, `last_name`
- `email` (unique)
- `password` (hashed)
- `role` (default: "customer")
- `is_verified` (boolean)

#### Customers
- `customer_id` (Primary Key)
- `user_id` (Foreign Key)
- `phone_number`
- `address`

#### Cars
- `car_id` (Primary Key)
- `make`, `model`, `year`, `color`
- `availability` (boolean)
- `rental_rate`
- `location_id` (Foreign Key)

#### Locations
- `location_id` (Primary Key)
- `location_name`
- `address`
- `contact_number`

### Rental Management

#### Reservations
- `reservation_id` (Primary Key)
- `customer_id` (Foreign Key)
- `car_id` (Foreign Key)
- `reservation_date`
- `pickup_date`
- `return_date`

#### Bookings
- `booking_id` (Primary Key)
- `customer_id` (Foreign Key)
- `car_id` (Foreign Key)
- `rental_start_date`
- `rental_end_date`
- `total_amount`
- `status` (pending/completed/cancelled)

#### Payments
- `payment_id` (Primary Key)
- `booking_id` (Foreign Key)
- `payment_date`
- `amount`
- `payment_method`

### Vehicle Management

#### Maintenance
- `maintenance_id` (Primary Key)
- `car_id` (Foreign Key)
- `maintenance_date`
- `description`
- `cost`

#### Insurance
- `insurance_id` (Primary Key)
- `car_id` (Foreign Key)
- `provider`
- `policy_number`
- `start_date`
- `end_date`

## API Endpoints

### Car Management
```
POST /cars          - Create a new car (Admin only)
GET /cars           - Get all cars
GET /cars/:id       - Get car by ID
PUT /cars/:id       - Update car details (Admin only)
DELETE /cars/:id    - Delete a car (Admin only)
```

### Booking Management
```
POST /bookings      - Create a new booking
GET /bookings       - Get all bookings
GET /bookings/:id   - Get booking by ID
PUT /bookings/:id   - Update booking
DELETE /bookings/:id - Delete booking
PUT /bookings/:id/complete - Complete a booking
PUT /bookings/:id/cancel   - Cancel a booking
```

## Features

### User Management
- User registration and authentication
- Role-based access control (Admin/Customer)
- User verification system
- Customer profile management

### Vehicle Management
- Comprehensive car inventory management
- Location-based car availability
- Vehicle maintenance tracking
- Insurance policy management

### Booking System
- Real-time car availability checking
- Reservation management
- Flexible booking status handling
- automated booking workflow

### Payment Processing
- Secure payment handling
- Multiple payment method support
- Payment tracking and history
- Automated payment status updates

## Security Features

1. Role-based Access Control
   - Admin-only routes protection
   - User authentication middleware
   - Route-specific authorization

2. Rate Limiting
   - API request rate limiting
   - Protection against brute force attacks

3. Data Validation
   - Input validation
   - Data sanitization
   - Type safety with TypeScript

## Business Logic

### Booking Flow
1. Customer makes a reservation
2. System checks car availability
3. Booking is created with 'pending' status
4. Payment is processed
5. Booking status updated to 'completed'
6. Car availability updated

### Maintenance Handling
- Regular maintenance scheduling
- Cost tracking
- Availability status updates
- Insurance policy management

## Technical Implementation

### Database
- PostgreSQL with Drizzle ORM
- Relational database design
- Referential integrity maintenance
- Type-safe queries

### API Layer
- RESTful API design
- Express.js middleware architecture
- Controller-Service pattern
- Error handling middleware

### Testing
- Integration tests
- Unit tests for services
- Load testing suite
- API endpoint testing

## Error Handling
- Standardized error responses
- Detailed error logging
- Custom error types
- Global error handling middleware

## Performance Optimizations
- Database query optimization
- Connection pooling
- Rate limiting
- Caching strategies

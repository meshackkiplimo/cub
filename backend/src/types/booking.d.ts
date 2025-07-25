export interface DbUser {
    first_name: string;
    last_name: string;
    email: string;
    user_id: number;
    role: string;
}



export interface DbCar {
    car_id: number;
    make: string;
    model: string;
    year: string;
    color: string;
    rental_rate: string;
    availability: boolean;
    location_id: number;
}

export interface DbBooking {
    booking_id: number;
    user_id: number;
    car_id: number;
    rental_start_date: string;
    rental_end_date: string;
    total_amount: string;
}

export interface DbBookingWithRelations extends DbBooking {
    user: DbUser;
    car: DbCar;
    status?: 'pending' | 'completed' | 'cancelled';
}

// For creating new bookings
export type CreateBookingDto = Omit<DbBooking, 'booking_id'>;

// For updating bookings
export type UpdateBookingDto = Partial<Omit<DbBooking, 'booking_id'>>;
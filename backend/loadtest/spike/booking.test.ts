import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:5000';

// First get auth token
let authToken = null;
export function setup() {
    const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    try {
        const body = JSON.parse(loginRes.body as string);
        authToken = body.token;
    } catch (e) {
        console.error('Login failed:', e);
    }
    return { authToken };
}

export const options = {
    stages: [
        { duration: '20s', target: 10 },    // Baseline
        { duration: '20s', target: 1000 },  // Spike to 1000 users
        { duration: '20s', target: 1000 },  // Stay at 1000 for 20s
        { duration: '20s', target: 10 },    // Scale down to baseline
        { duration: '20s', target: 0 },     // Scale down to 0
    ],
    thresholds: {
        http_req_failed: ['rate<0.1'],      // Error rate < 10%
        http_req_duration: ['p(95)<2000'],  // 95% requests within 2s
    }
};

export default function (data) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.authToken}`
    };

    // Required booking data structure
    const booking = {
        customer_id: 1,
        car_id: 1,
        rental_start_date: '2025-06-20',
        rental_end_date: '2025-06-25',
        total_amount: 200,
        status: 'pending'
    };

    // Create booking
    const createResponse = http.post(
        `${BASE_URL}/bookings`,
        JSON.stringify(booking),
        { headers }
    );

    // Verify booking creation
    const createChecks = check(createResponse, {
        'booking created successfully': (r) => r.status === 201,
        'response time < 2000ms': (r) => r.timings.duration < 2000,
        'response has booking data': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return body.booking && body.booking.booking_id;
            } catch {
                return false;
            }
        }
    });

    // If booking was created successfully, verify we can retrieve it
    if (createChecks) {
        try {
            const body = JSON.parse(createResponse.body as string);
            if (body.booking && body.booking.booking_id) {
                const getResponse = http.get(
                    `${BASE_URL}/bookings/${body.booking.booking_id}`,
                    { headers }
                );

                check(getResponse, {
                    'get booking successful': (r) => r.status === 200,
                    'get response time < 2000ms': (r) => r.timings.duration < 2000,
                    'retrieved booking matches': (r) => {
                        try {
                            const body = JSON.parse(r.body as string);
                            return body.booking && 
                                   body.booking.car_id === booking.car_id &&
                                   body.booking.customer_id === booking.customer_id;
                        } catch {
                            return false;
                        }
                    }
                });
            }
        } catch (e) {
            console.error('Failed to parse booking response:', e);
        }
    }

    sleep(1);
}
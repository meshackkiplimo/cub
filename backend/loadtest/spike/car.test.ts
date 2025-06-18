import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:5000';

export const options = {
    stages: [
        { duration: '20s', target: 10 },    // Baseline: 10 users
        { duration: '20s', target: 1000 },  // Spike to 1000 users
        { duration: '20s', target: 1000 },  // Stay at spike
        { duration: '20s', target: 10 },    // Scale down to baseline
        { duration: '20s', target: 0 },     // Scale down to 0
    ],
    thresholds: {
        http_req_failed: ['rate<0.1'],      // Error rate < 10%
        http_req_duration: ['p(95)<2000'],  // 95% of requests within 2s
    }
};

export default function () {
    const response = http.get(`${BASE_URL}/cars`, {
        headers: { 'Content-Type': 'application/json' }
    });

    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 2000ms': (r) => r.timings.duration < 2000,
        'has valid data': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        }
    });

    sleep(1);
}
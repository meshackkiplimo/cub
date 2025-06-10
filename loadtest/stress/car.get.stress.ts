import http from 'k6/http';
import { check, sleep } from 'k6';



const BASE_URL = 'http://localhost:5000';


export const options = {
  stages: [
    { duration: '30s', target: 500 }, // Ramp up to 100 users over 30 seconds
    { duration: '30s', target: 1000 }, // Stay at 100 users for 1 minute
    { duration: '50s', target: 2000 }, // Ramp down to 0 users over 30 seconds
    { duration: '20s', target: 500 }, // Ramp down to 0 users over 30 seconds
    { duration: '10s', target: 0 }, // Ramp down to 0 users over 10 seconds
  ],
  ext:{
    loadimpact: {
     
      name: 'Car API Stress Test',
      
    },
  }
}

export default function () {
    const response = http.get(`${BASE_URL}/cars/1`);
    // Check the response status and content
    
    
    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
        'response contains car data': (r) => r.body.includes('car_id'),
    });
    
    sleep(1); // Sleep for 1 second between requests
}




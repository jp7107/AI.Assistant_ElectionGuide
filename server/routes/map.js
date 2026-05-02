import { Router } from 'express';

const router = Router();

// Sample polling booth locations across major Indian cities
const POLLING_BOOTHS = [
  // Jaipur
  { id: 1, name: 'Govt. Senior Secondary School, Bani Park', city: 'Jaipur', state: 'Rajasthan', lat: 26.9324, lng: 75.7873, address: 'Bani Park, Jaipur, Rajasthan 302016' },
  { id: 2, name: 'Rajasthan University Campus', city: 'Jaipur', state: 'Rajasthan', lat: 26.8984, lng: 75.8061, address: 'JLN Marg, Jaipur, Rajasthan 302004' },
  { id: 3, name: 'Govt. School, Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', lat: 26.8553, lng: 75.8127, address: 'Malviya Nagar, Jaipur, Rajasthan 302017' },
  { id: 4, name: 'Community Hall, Vaishali Nagar', city: 'Jaipur', state: 'Rajasthan', lat: 26.9126, lng: 75.7390, address: 'Vaishali Nagar, Jaipur, Rajasthan 302021' },
  // Delhi
  { id: 5, name: 'Govt. Boys School, Connaught Place', city: 'New Delhi', state: 'Delhi', lat: 28.6315, lng: 77.2167, address: 'Connaught Place, New Delhi 110001' },
  { id: 6, name: 'Community Centre, Dwarka Sector 6', city: 'New Delhi', state: 'Delhi', lat: 28.5823, lng: 77.0618, address: 'Dwarka Sector 6, New Delhi 110075' },
  { id: 7, name: 'Govt. School, Rohini Sector 3', city: 'New Delhi', state: 'Delhi', lat: 28.7165, lng: 77.1135, address: 'Rohini Sector 3, New Delhi 110085' },
  // Mumbai
  { id: 8, name: 'BMC School, Andheri West', city: 'Mumbai', state: 'Maharashtra', lat: 19.1364, lng: 72.8296, address: 'Andheri West, Mumbai, Maharashtra 400058' },
  { id: 9, name: 'Community Hall, Dadar', city: 'Mumbai', state: 'Maharashtra', lat: 19.0178, lng: 72.8478, address: 'Dadar, Mumbai, Maharashtra 400014' },
  { id: 10, name: 'Govt. School, Bandra', city: 'Mumbai', state: 'Maharashtra', lat: 19.0596, lng: 72.8295, address: 'Bandra West, Mumbai, Maharashtra 400050' },
  // Bengaluru
  { id: 11, name: 'Govt. School, Koramangala', city: 'Bengaluru', state: 'Karnataka', lat: 12.9352, lng: 77.6245, address: 'Koramangala, Bengaluru, Karnataka 560034' },
  { id: 12, name: 'Community Hall, Jayanagar', city: 'Bengaluru', state: 'Karnataka', lat: 12.9308, lng: 77.5838, address: 'Jayanagar, Bengaluru, Karnataka 560041' },
  // Chennai
  { id: 13, name: 'Corporation School, T. Nagar', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0418, lng: 80.2341, address: 'T. Nagar, Chennai, Tamil Nadu 600017' },
  { id: 14, name: 'Govt. Higher Secondary School, Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0850, lng: 80.2101, address: 'Anna Nagar, Chennai, Tamil Nadu 600040' },
  // Kolkata
  { id: 15, name: 'Govt. School, Salt Lake', city: 'Kolkata', state: 'West Bengal', lat: 22.5804, lng: 88.4168, address: 'Salt Lake, Kolkata, West Bengal 700091' },
  { id: 16, name: 'Community Hall, Park Street', city: 'Kolkata', state: 'West Bengal', lat: 22.5528, lng: 88.3529, address: 'Park Street, Kolkata, West Bengal 700016' },
  // Hyderabad
  { id: 17, name: 'Govt. School, Banjara Hills', city: 'Hyderabad', state: 'Telangana', lat: 17.4156, lng: 78.4347, address: 'Banjara Hills, Hyderabad, Telangana 500034' },
  { id: 18, name: 'Community Centre, Kukatpally', city: 'Hyderabad', state: 'Telangana', lat: 17.4948, lng: 78.3996, address: 'Kukatpally, Hyderabad, Telangana 500072' },
  // Lucknow
  { id: 19, name: 'Govt. Inter College, Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8500, lng: 80.9450, address: 'Hazratganj, Lucknow, UP 226001' },
  { id: 20, name: 'Primary School, Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8563, lng: 80.9914, address: 'Gomti Nagar, Lucknow, UP 226010' },
];

// GET /api/map — all booths
router.get('/', (req, res) => {
  const { city } = req.query;
  let results = POLLING_BOOTHS;

  if (city) {
    results = POLLING_BOOTHS.filter(
      (b) => b.city.toLowerCase() === city.toLowerCase()
    );
  }

  res.json({
    total: results.length,
    data: results,
    cities: [...new Set(POLLING_BOOTHS.map((b) => b.city))],
  });
});

// GET /api/map/cities
router.get('/cities', (req, res) => {
  const cities = [...new Set(POLLING_BOOTHS.map((b) => b.city))];
  res.json(cities);
});

export default router;

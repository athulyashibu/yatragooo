export interface Airport {
  code: string; // IATA Code (e.g. JFK)
  name: string; // Airport Name (e.g. John F. Kennedy International Airport)
  city: string; // City Name (e.g. New York)
  country: string; // Country Name (e.g. United States)
  region: 'North America' | 'Europe' | 'Asia' | 'Middle East' | 'Oceania' | 'South America' | 'Africa';
  popular?: boolean;
  latitude?: number;
  longitude?: number;
}

export const ALL_AIRPORTS: Airport[] = [
  // --- NORTH AMERICA ---
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', region: 'North America', popular: true, latitude: 40.6413, longitude: -73.7781 },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'New York / Newark', country: 'United States', region: 'North America', latitude: 40.6895, longitude: -74.1745 },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'United States', region: 'North America', latitude: 40.7769, longitude: -73.8740 },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', region: 'North America', popular: true, latitude: 33.9416, longitude: -118.4085 },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', region: 'North America', popular: true, latitude: 37.6213, longitude: -122.3790 },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States', region: 'North America', popular: true, latitude: 41.9742, longitude: -87.9073 },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States', region: 'North America', latitude: 32.8998, longitude: -97.0403 },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', region: 'North America', latitude: 33.6407, longitude: -84.4277 },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', region: 'North America', popular: true, latitude: 25.7959, longitude: -80.2870 },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States', region: 'North America', latitude: 47.4502, longitude: -122.3088 },
  { code: 'BOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'United States', region: 'North America', latitude: 42.3656, longitude: -71.0096 },
  { code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'United States', region: 'North America', latitude: 39.8561, longitude: -104.6737 },
  { code: 'IAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'United States', region: 'North America', latitude: 29.9902, longitude: -95.3368 },
  { code: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'United States', region: 'North America', popular: true, latitude: 36.0840, longitude: -115.1537 },
  { code: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'United States', region: 'North America', latitude: 28.4312, longitude: -81.3081 },
  { code: 'PHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', country: 'United States', region: 'North America', latitude: 33.4352, longitude: -112.0101 },
  { code: 'MSP', name: 'Minneapolis-Saint Paul International Airport', city: 'Minneapolis', country: 'United States', region: 'North America', latitude: 44.8848, longitude: -93.2223 },
  { code: 'DTW', name: 'Detroit Metropolitan Wayne County Airport', city: 'Detroit', country: 'United States', region: 'North America', latitude: 42.2162, longitude: -83.3554 },
  { code: 'PHL', name: 'Philadelphia International Airport', city: 'Philadelphia', country: 'United States', region: 'North America', latitude: 39.8721, longitude: -75.2407 },
  { code: 'CLT', name: 'Charlotte Douglas International Airport', city: 'Charlotte', country: 'United States', region: 'North America', latitude: 35.2140, longitude: -80.9431 },
  { code: 'IAD', name: 'Washington Dulles International Airport', city: 'Washington D.C.', country: 'United States', region: 'North America', latitude: 38.9531, longitude: -77.4565 },
  { code: 'DCA', name: 'Ronald Reagan Washington National Airport', city: 'Washington D.C.', country: 'United States', region: 'North America', latitude: 38.8512, longitude: -77.0402 },
  { code: 'SAN', name: 'San Diego International Airport', city: 'San Diego', country: 'United States', region: 'North America', latitude: 32.7338, longitude: -117.1933 },
  { code: 'SLC', name: 'Salt Lake City International Airport', city: 'Salt Lake City', country: 'United States', region: 'North America', latitude: 40.7899, longitude: -111.9791 },
  { code: 'BNA', name: 'Nashville International Airport', city: 'Nashville', country: 'United States', region: 'North America', latitude: 36.1263, longitude: -86.6774 },
  { code: 'MSY', name: 'Louis Armstrong New Orleans International Airport', city: 'New Orleans', country: 'United States', region: 'North America', latitude: 29.9934, longitude: -90.2580 },
  { code: 'PDX', name: 'Portland International Airport', city: 'Portland', country: 'United States', region: 'North America', latitude: 45.5898, longitude: -122.5951 },
  { code: 'AUS', name: 'Austin-Bergstrom International Airport', city: 'Austin', country: 'United States', region: 'North America', latitude: 30.1975, longitude: -97.6664 },
  { code: 'SAN', name: 'San Diego International Airport', city: 'San Diego', country: 'United States', region: 'North America', latitude: 32.7338, longitude: -117.1933 },
  { code: 'HNL', name: 'Daniel K. Inouye International Airport', city: 'Honolulu', country: 'United States', region: 'North America', popular: true, latitude: 21.3187, longitude: -157.9225 },
  { code: 'ANC', name: 'Ted Stevens Anchorage International Airport', city: 'Anchorage', country: 'United States', region: 'North America', latitude: 61.1743, longitude: -149.9963 },

  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', region: 'North America', popular: true, latitude: 43.6777, longitude: -79.6248 },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', region: 'North America', popular: true, latitude: 49.1967, longitude: -123.1815 },
  { code: 'YUL', name: 'Montréal-Trudeau International Airport', city: 'Montreal', country: 'Canada', region: 'North America', latitude: 45.4657, longitude: -73.7455 },
  { code: 'YYC', name: 'Calgary International Airport', city: 'Calgary', country: 'Canada', region: 'North America', latitude: 51.1215, longitude: -114.0076 },
  { code: 'YOW', name: 'Ottawa Macdonald-Cartier International Airport', city: 'Ottawa', country: 'Canada', region: 'North America', latitude: 45.3225, longitude: -75.6692 },
  { code: 'YEG', name: 'Edmonton International Airport', city: 'Edmonton', country: 'Canada', region: 'North America', latitude: 53.3097, longitude: -113.5797 },
  { code: 'YHZ', name: 'Halifax Stanfield International Airport', city: 'Halifax', country: 'Canada', region: 'North America', latitude: 44.8808, longitude: -63.5086 },
  { code: 'YWG', name: 'Winnipeg James Armstrong Richardson International Airport', city: 'Winnipeg', country: 'Canada', region: 'North America', latitude: 49.9100, longitude: -97.2399 },

  // Mexico & Caribbean
  { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico', region: 'North America', popular: true, latitude: 19.4363, longitude: -99.0721 },
  { code: 'CUN', name: 'Cancún International Airport', city: 'Cancun', country: 'Mexico', region: 'North America', popular: true, latitude: 21.0365, longitude: -86.8771 },
  { code: 'GDL', name: 'Guadalajara International Airport', city: 'Guadalajara', country: 'Mexico', region: 'North America', latitude: 20.5218, longitude: -103.3112 },
  { code: 'MTY', name: 'Monterrey International Airport', city: 'Monterrey', country: 'Mexico', region: 'North America', latitude: 25.7785, longitude: -100.1070 },
  { code: 'PVR', name: 'Lic. Gustavo Díaz Ordaz International Airport', city: 'Puerto Vallarta', country: 'Mexico', region: 'North America', latitude: 20.6801, longitude: -105.2542 },
  { code: 'SJU', name: 'Luis Muñoz Marín International Airport', city: 'San Juan', country: 'Puerto Rico', region: 'North America', latitude: 18.4394, longitude: -66.0018 },
  { code: 'MBJ', name: 'Sangster International Airport', city: 'Montego Bay', country: 'Jamaica', region: 'North America', latitude: 18.5037, longitude: -77.9134 },
  { code: 'PUJ', name: 'Punta Cana International Airport', city: 'Punta Cana', country: 'Dominican Republic', region: 'North America', latitude: 18.5674, longitude: -68.3634 },
  { code: 'NAS', name: 'Lynden Pindling International Airport', city: 'Nassau', country: 'Bahamas', region: 'North America', latitude: 25.0390, longitude: -77.4662 },

  // --- EUROPE ---
  // United Kingdom & Ireland
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', region: 'Europe', popular: true, latitude: 51.4700, longitude: -0.4543 },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', region: 'Europe', latitude: 51.1537, longitude: -0.1821 },
  { code: 'STN', name: 'London Stansted Airport', city: 'London', country: 'United Kingdom', region: 'Europe', latitude: 51.8860, longitude: 0.2389 },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', region: 'Europe', latitude: 53.3537, longitude: -2.2750 },
  { code: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom', region: 'Europe', latitude: 55.9500, longitude: -3.3725 },
  { code: 'GLA', name: 'Glasgow Airport', city: 'Glasgow', country: 'United Kingdom', region: 'Europe', latitude: 55.8719, longitude: -4.4331 },
  { code: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom', region: 'Europe', latitude: 52.4539, longitude: -1.7480 },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', region: 'Europe', popular: true, latitude: 53.4264, longitude: -6.2499 },
  { code: 'SNN', name: 'Shannon Airport', city: 'Shannon', country: 'Ireland', region: 'Europe', latitude: 52.7020, longitude: -8.9248 },

  // France
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', region: 'Europe', popular: true, latitude: 49.0097, longitude: 2.5479 },
  { code: 'ORY', name: 'Paris Orly Airport', city: 'Paris', country: 'France', region: 'Europe', latitude: 48.7262, longitude: 2.3652 },
  { code: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France', region: 'Europe', latitude: 43.6584, longitude: 7.2159 },
  { code: 'LYS', name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'France', region: 'Europe', latitude: 45.7256, longitude: 5.0811 },
  { code: 'MRS', name: 'Marseille Provence Airport', city: 'Marseille', country: 'France', region: 'Europe', latitude: 43.4367, longitude: 5.2150 },

  // Germany
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', region: 'Europe', popular: true, latitude: 50.0379, longitude: 8.5622 },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', region: 'Europe', popular: true, latitude: 48.3537, longitude: 11.7861 },
  { code: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany', region: 'Europe', latitude: 52.3667, longitude: 13.5033 },
  { code: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', country: 'Germany', region: 'Europe', latitude: 53.6304, longitude: 9.9882 },
  { code: 'DUS', name: 'Düsseldorf Airport', city: 'Düsseldorf', country: 'Germany', region: 'Europe', latitude: 51.2895, longitude: 6.7668 },
  { code: 'STR', name: 'Stuttgart Airport', city: 'Stuttgart', country: 'Germany', region: 'Europe', latitude: 48.6899, longitude: 9.2219 },

  // Italy
  { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome', country: 'Italy', region: 'Europe', popular: true, latitude: 41.8003, longitude: 12.2389 },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', region: 'Europe', popular: true, latitude: 45.6301, longitude: 8.7255 },
  { code: 'LIN', name: 'Milan Linate Airport', city: 'Milan', country: 'Italy', region: 'Europe', latitude: 45.4451, longitude: 9.2767 },
  { code: 'VCE', name: 'Venice Marco Polo Airport', city: 'Venice', country: 'Italy', region: 'Europe', latitude: 45.5053, longitude: 12.3519 },
  { code: 'NAP', name: 'Naples International Airport', city: 'Naples', country: 'Italy', region: 'Europe', latitude: 40.8860, longitude: 14.2908 },
  { code: 'FLR', name: 'Florence Airport', city: 'Florence', country: 'Italy', region: 'Europe', latitude: 43.8100, longitude: 11.2051 },

  // Spain & Portugal
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', region: 'Europe', popular: true, latitude: 40.4839, longitude: -3.5680 },
  { code: 'BCN', name: 'Josep Tarradellas Barcelona–El Prat Airport', city: 'Barcelona', country: 'Spain', region: 'Europe', popular: true, latitude: 41.2974, longitude: 2.0833 },
  { code: 'AGP', name: 'Málaga–Costa del Sol Airport', city: 'Malaga', country: 'Spain', region: 'Europe', latitude: 36.6749, longitude: -4.4991 },
  { code: 'PMI', name: 'Palma de Mallorca Airport', city: 'Palma de Mallorca', country: 'Spain', region: 'Europe', latitude: 39.5517, longitude: 2.7388 },
  { code: 'IBZ', name: 'Ibiza Airport', city: 'Ibiza', country: 'Spain', region: 'Europe', latitude: 38.8729, longitude: 1.3731 },
  { code: 'LIS', name: 'Humberto Delgado Airport', city: 'Lisbon', country: 'Portugal', region: 'Europe', popular: true, latitude: 38.7742, longitude: -9.1342 },
  { code: 'OPO', name: 'Francisco de Sá Carneiro Airport', city: 'Porto', country: 'Portugal', region: 'Europe', latitude: 41.2481, longitude: -8.6814 },
  { code: 'FAO', name: 'Faro Airport', city: 'Faro', country: 'Portugal', region: 'Europe', latitude: 37.0144, longitude: -7.9659 },

  // Netherlands, Belgium, Switzerland, Austria
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', region: 'Europe', popular: true, latitude: 52.3105, longitude: 4.7683 },
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', region: 'Europe', latitude: 50.9010, longitude: 4.4856 },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', region: 'Europe', popular: true, latitude: 47.4582, longitude: 8.5555 },
  { code: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', region: 'Europe', latitude: 46.2370, longitude: 6.1092 },
  { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', region: 'Europe', popular: true, latitude: 48.1103, longitude: 16.5697 },

  // Nordic Countries
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', region: 'Europe', latitude: 55.6180, longitude: 12.6508 },
  { code: 'OSL', name: 'Oslo Airport, Gardermoen', city: 'Oslo', country: 'Norway', region: 'Europe', latitude: 60.1976, longitude: 11.1004 },
  { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden', region: 'Europe', latitude: 59.6498, longitude: 17.9238 },
  { code: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland', region: 'Europe', latitude: 60.3172, longitude: 24.9633 },
  { code: 'KEF', name: 'Keflavík International Airport', city: 'Reykjavik', country: 'Iceland', region: 'Europe', popular: true, latitude: 63.9850, longitude: -22.6056 },

  // Central & Eastern Europe, Greece, Turkey
  { code: 'ATH', name: 'Athens International Airport', city: 'Athens', country: 'Greece', region: 'Europe', popular: true, latitude: 37.9364, longitude: 23.9472 },
  { code: 'JMK', name: 'Mykonos International Airport', city: 'Mykonos', country: 'Greece', region: 'Europe', latitude: 37.4351, longitude: 25.3481 },
  { code: 'JTR', name: 'Santorini (Thira) International Airport', city: 'Santorini', country: 'Greece', region: 'Europe', latitude: 36.3992, longitude: 25.4793 },
  { code: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland', region: 'Europe', latitude: 52.1672, longitude: 20.9679 },
  { code: 'PRG', name: 'Václav Havel Airport Prague', city: 'Prague', country: 'Czechia', region: 'Europe', popular: true, latitude: 50.1008, longitude: 14.2600 },
  { code: 'BUD', name: 'Budapest Ferenc Liszt International Airport', city: 'Budapest', country: 'Hungary', region: 'Europe', latitude: 47.4369, longitude: 19.2556 },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', region: 'Europe', popular: true, latitude: 41.2753, longitude: 28.7519 },
  { code: 'SAW', name: 'Istanbul Sabiha Gökçen International Airport', city: 'Istanbul', country: 'Turkey', region: 'Europe', latitude: 40.8986, longitude: 29.3092 },
  { code: 'AYT', name: 'Antalya Airport', city: 'Antalya', country: 'Turkey', region: 'Europe', latitude: 36.8987, longitude: 30.8005 },
  { code: 'OTP', name: 'Henri Coandă International Airport', city: 'Bucharest', country: 'Romania', region: 'Europe', latitude: 44.5706, longitude: 26.0844 },
  { code: 'BEG', name: 'Belgrade Nikola Tesla Airport', city: 'Belgrade', country: 'Serbia', region: 'Europe', latitude: 44.8184, longitude: 20.3091 },

  // --- ASIA & PACIFIC ---
  // East Asia (Japan, Korea, China, HK, Taiwan)
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', region: 'Asia', popular: true, latitude: 35.5494, longitude: 139.7798 },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', region: 'Asia', popular: true, latitude: 35.7720, longitude: 140.3929 },
  { code: 'KIX', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan', region: 'Asia', latitude: 34.4320, longitude: 135.2304 },
  { code: 'CTS', name: 'New Chitose Airport', city: 'Sapporo', country: 'Japan', region: 'Asia', latitude: 42.7752, longitude: 141.6923 },
  { code: 'FUK', name: 'Fukuoka Airport', city: 'Fukuoka', country: 'Japan', region: 'Asia', latitude: 33.5859, longitude: 130.4507 },

  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', region: 'Asia', popular: true, latitude: 37.4602, longitude: 126.4407 },
  { code: 'GMP', name: 'Gimpo International Airport', city: 'Seoul', country: 'South Korea', region: 'Asia', latitude: 37.5583, longitude: 126.7906 },
  { code: 'CJU', name: 'Jeju International Airport', city: 'Jeju', country: 'South Korea', region: 'Asia', latitude: 33.5113, longitude: 126.4930 },

  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', region: 'Asia', popular: true, latitude: 22.3080, longitude: 113.9185 },
  { code: 'TPE', name: 'Taiwan Taoyuan International Airport', city: 'Taipei', country: 'Taiwan', region: 'Asia', popular: true, latitude: 25.0797, longitude: 121.2342 },

  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', region: 'Asia', popular: true, latitude: 40.0799, longitude: 116.6031 },
  { code: 'PKX', name: 'Beijing Daxing International Airport', city: 'Beijing', country: 'China', region: 'Asia', latitude: 39.5098, longitude: 116.4105 },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', region: 'Asia', popular: true, latitude: 31.1443, longitude: 121.8083 },
  { code: 'SHA', name: 'Shanghai Hongqiao International Airport', city: 'Shanghai', country: 'China', region: 'Asia', latitude: 31.1979, longitude: 121.3363 },
  { code: 'CAN', name: 'Guangzhou Baiyun International Airport', city: 'Guangzhou', country: 'China', region: 'Asia', latitude: 23.3924, longitude: 113.2988 },
  { code: 'SZX', name: 'Shenzhen Bao\'an International Airport', city: 'Shenzhen', country: 'China', region: 'Asia', latitude: 22.6393, longitude: 113.8107 },
  { code: 'CTU', name: 'Chengdu Shuangliu International Airport', city: 'Chengdu', country: 'China', region: 'Asia', latitude: 30.5785, longitude: 103.9471 },
  { code: 'CKG', name: 'Chongqing Jiangbei International Airport', city: 'Chongqing', country: 'China', region: 'Asia', latitude: 29.7192, longitude: 106.6417 },
  { code: 'XIY', name: "Xi'an Xianyang International Airport", city: "Xi'an", country: 'China', region: 'Asia', latitude: 34.4471, longitude: 108.7516 },

  // Southeast Asia (Singapore, Thailand, Indonesia, Malaysia, Vietnam, Philippines)
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', region: 'Asia', popular: true, latitude: 1.3644, longitude: 103.9915 },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', region: 'Asia', popular: true, latitude: 13.6900, longitude: 100.7501 },
  { code: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'Thailand', region: 'Asia', latitude: 13.9126, longitude: 100.6067 },
  { code: 'HKT', name: 'Phuket International Airport', city: 'Phuket', country: 'Thailand', region: 'Asia', popular: true, latitude: 8.1132, longitude: 98.3169 },
  { code: 'CNX', name: 'Chiang Mai International Airport', city: 'Chiang Mai', country: 'Thailand', region: 'Asia', latitude: 18.7677, longitude: 98.9626 },
  { code: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali / Denpasar', country: 'Indonesia', region: 'Asia', popular: true, latitude: -8.7482, longitude: 115.1672 },
  { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia', region: 'Asia', latitude: -6.1275, longitude: 106.6537 },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', popular: true, latitude: 2.7456, longitude: 101.7099 },
  { code: 'PEN', name: 'Penang International Airport', city: 'Penang', country: 'Malaysia', region: 'Asia', latitude: 5.2971, longitude: 100.2769 },
  { code: 'BKI', name: 'Kota Kinabalu International Airport', city: 'Kota Kinabalu', country: 'Malaysia', region: 'Asia', latitude: 5.9372, longitude: 116.0512 },
  { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines', region: 'Asia', latitude: 14.5086, longitude: 121.0194 },
  { code: 'CEB', name: 'Mactan-Cebu International Airport', city: 'Cebu', country: 'Philippines', region: 'Asia', latitude: 10.3075, longitude: 123.9794 },
  { code: 'SGN', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam', region: 'Asia', popular: true, latitude: 10.8188, longitude: 106.6519 },
  { code: 'HAN', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam', region: 'Asia', latitude: 21.2212, longitude: 105.8072 },
  { code: 'DAD', name: 'Da Nang International Airport', city: 'Da Nang', country: 'Vietnam', region: 'Asia', latitude: 16.0439, longitude: 108.1994 },

  // South Asia (India, Sri Lanka, Maldives, Nepal, Pakistan, Bangladesh)
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India', region: 'Asia', popular: true, latitude: 28.5562, longitude: 77.1000 },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', region: 'Asia', popular: true, latitude: 19.0896, longitude: 72.8656 },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', country: 'India', region: 'Asia', popular: true, latitude: 13.1986, longitude: 77.7066 },
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', region: 'Asia', latitude: 17.2403, longitude: 78.4294 },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', region: 'Asia', latitude: 12.9941, longitude: 80.1709 },
  { code: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', country: 'India', region: 'Asia', latitude: 22.6547, longitude: 88.4467 },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India', region: 'Asia', latitude: 23.0772, longitude: 72.6347 },
  { code: 'GOI', name: 'Dabolim Airport', city: 'Goa', country: 'India', region: 'Asia', popular: true, latitude: 15.3808, longitude: 73.8313 },
  { code: 'GOX', name: 'Manohar International Airport', city: 'Mopa / Goa', country: 'India', region: 'Asia', latitude: 15.7667, longitude: 73.8667 },
  { code: 'COK', name: 'Cochin International Airport', city: 'Kochi / Cochin', country: 'India', region: 'Asia', latitude: 10.1520, longitude: 76.4019 },
  { code: 'TRV', name: 'Thiruvananthapuram International Airport', city: 'Trivandrum', country: 'India', region: 'Asia', latitude: 8.4821, longitude: 76.9200 },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India', region: 'Asia', latitude: 18.5822, longitude: 73.9197 },
  { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', country: 'India', region: 'Asia', latitude: 26.8242, longitude: 75.8122 },
  { code: 'MLE', name: 'Velana International Airport', city: 'Male', country: 'Maldives', region: 'Asia', popular: true, latitude: 4.1918, longitude: 73.5291 },
  { code: 'CMB', name: 'Bandaranaike International Airport', city: 'Colombo', country: 'Sri Lanka', region: 'Asia', latitude: 7.1808, longitude: 79.8841 },
  { code: 'KTM', name: 'Tribhuvan International Airport', city: 'Kathmandu', country: 'Nepal', region: 'Asia', latitude: 27.6966, longitude: 85.3591 },
  { code: 'DAC', name: 'Hazrat Shahjalal International Airport', city: 'Dhaka', country: 'Bangladesh', region: 'Asia', latitude: 23.8433, longitude: 90.3978 },
  { code: 'KHI', name: 'Jinnah International Airport', city: 'Karachi', country: 'Pakistan', region: 'Asia', latitude: 24.9065, longitude: 67.1608 },
  { code: 'LHE', name: 'Allama Iqbal International Airport', city: 'Lahore', country: 'Pakistan', region: 'Asia', latitude: 31.5216, longitude: 74.4036 },
  { code: 'ISB', name: 'Islamabad International Airport', city: 'Islamabad', country: 'Pakistan', region: 'Asia', latitude: 33.5489, longitude: 72.8336 },

  // --- MIDDLE EAST ---
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', popular: true, latitude: 25.2532, longitude: 55.3657 },
  { code: 'DWC', name: 'Al Maktoum International Airport', city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', latitude: 24.8960, longitude: 55.1614 },
  { code: 'AUH', name: 'Zayed International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East', popular: true, latitude: 24.4330, longitude: 54.6511 },
  { code: 'SHJ', name: 'Sharjah International Airport', city: 'Sharjah', country: 'United Arab Emirates', region: 'Middle East', latitude: 25.3286, longitude: 55.5172 },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', region: 'Middle East', popular: true, latitude: 25.2731, longitude: 51.6081 },
  { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', region: 'Middle East', popular: true, latitude: 24.9576, longitude: 46.6988 },
  { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', region: 'Middle East', latitude: 21.6796, longitude: 39.1565 },
  { code: 'MED', name: 'Prince Mohammad bin Abdulaziz International Airport', city: 'Medina', country: 'Saudi Arabia', region: 'Middle East', latitude: 24.5534, longitude: 39.7051 },
  { code: 'DMM', name: 'King Fahd International Airport', city: 'Dammam', country: 'Saudi Arabia', region: 'Middle East', latitude: 26.4712, longitude: 49.7979 },
  { code: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman', region: 'Middle East', latitude: 23.5933, longitude: 58.2844 },
  { code: 'BAH', name: 'Bahrain International Airport', city: 'Bahrain', country: 'Bahrain', region: 'Middle East', latitude: 26.2708, longitude: 50.6336 },
  { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', region: 'Middle East', latitude: 29.2265, longitude: 47.9689 },
  { code: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan', region: 'Middle East', latitude: 31.7225, longitude: 35.9932 },
  { code: 'BEY', name: 'Beirut-R Rafic Hariri International Airport', city: 'Beirut', country: 'Lebanon', region: 'Middle East', latitude: 33.8209, longitude: 35.4884 },
  { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel', region: 'Middle East', latitude: 32.0055, longitude: 34.8854 },

  // --- OCEANIA (Australia, New Zealand, Pacific) ---
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', region: 'Oceania', popular: true, latitude: -33.9461, longitude: 151.1772 },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', region: 'Oceania', popular: true, latitude: -37.6690, longitude: 144.8410 },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', region: 'Oceania', latitude: -27.3842, longitude: 153.1175 },
  { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', region: 'Oceania', latitude: -31.9403, longitude: 115.9669 },
  { code: 'ADL', name: 'Adelaide Airport', city: 'Adelaide', country: 'Australia', region: 'Oceania', latitude: -34.9450, longitude: 138.5311 },
  { code: 'CNS', name: 'Cairns Airport', city: 'Cairns', country: 'Australia', region: 'Oceania', latitude: -16.8858, longitude: 145.7553 },
  { code: 'OOL', name: 'Gold Coast Airport', city: 'Gold Coast', country: 'Australia', region: 'Oceania', latitude: -28.1644, longitude: 153.5047 },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', region: 'Oceania', popular: true, latitude: -37.0082, longitude: 174.7850 },
  { code: 'CHC', name: 'Christchurch International Airport', city: 'Christchurch', country: 'New Zealand', region: 'Oceania', latitude: -43.4864, longitude: 172.5369 },
  { code: 'ZQN', name: 'Queenstown Airport', city: 'Queenstown', country: 'New Zealand', region: 'Oceania', popular: true, latitude: -45.0212, longitude: 168.7392 },
  { code: 'WLG', name: 'Wellington International Airport', city: 'Wellington', country: 'New Zealand', region: 'Oceania', latitude: -41.3272, longitude: 174.8053 },
  { code: 'NAN', name: 'Nadi International Airport', city: 'Nadi', country: 'Fiji', region: 'Oceania', latitude: -17.7554, longitude: 177.4431 },
  { code: 'PPT', name: 'Fa\'a\'ā International Airport', city: 'Papeete / Tahiti', country: 'French Polynesia', region: 'Oceania', popular: true, latitude: -17.5537, longitude: -149.6071 },

  // --- SOUTH AMERICA ---
  { code: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', region: 'South America', popular: true, latitude: -23.4356, longitude: -46.4731 },
  { code: 'GIG', name: 'Rio de Janeiro/Galeão International Airport', city: 'Rio de Janeiro', country: 'Brazil', region: 'South America', popular: true, latitude: -22.8089, longitude: -43.2436 },
  { code: 'BSB', name: 'Brasília International Airport', city: 'Brasilia', country: 'Brazil', region: 'South America', latitude: -15.8697, longitude: -47.9172 },
  { code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina', region: 'South America', popular: true, latitude: -34.8222, longitude: -58.5358 },
  { code: 'AEP', name: 'Jorge Newbery Airfield', city: 'Buenos Aires', country: 'Argentina', region: 'South America', latitude: -34.5592, longitude: -58.4156 },
  { code: 'SCL', name: 'Arturo Merino Benítez International Airport', city: 'Santiago', country: 'Chile', region: 'South America', popular: true, latitude: -33.3930, longitude: -70.7858 },
  { code: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru', region: 'South America', popular: true, latitude: -12.0219, longitude: -77.1143 },
  { code: 'CUZ', name: 'Alejandro Velasco Astete International Airport', city: 'Cusco', country: 'Peru', region: 'South America', latitude: -13.5357, longitude: -71.9388 },
  { code: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia', region: 'South America', popular: true, latitude: 4.7016, longitude: -74.1469 },
  { code: 'MDE', name: 'José María Córdova International Airport', city: 'Medellín', country: 'Colombia', region: 'South America', latitude: 6.1645, longitude: -75.4231 },
  { code: 'PTY', name: 'Tocumen International Airport', city: 'Panama City', country: 'Panama', region: 'South America', latitude: 9.0714, longitude: -79.3835 },
  { code: 'SJO', name: 'Juan Santamaría International Airport', city: 'San José', country: 'Costa Rica', region: 'South America', latitude: 9.9939, longitude: -84.2088 },
  { code: 'UIO', name: 'Mariscal Sucre International Airport', city: 'Quito', country: 'Ecuador', region: 'South America', latitude: -0.1292, longitude: -78.3575 },
  { code: 'MVD', name: 'Carrasco International Airport', city: 'Montevideo', country: 'Uruguay', region: 'South America', latitude: -34.8384, longitude: -56.0308 },

  // --- AFRICA ---
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', region: 'Africa', popular: true, latitude: 30.1219, longitude: 31.4056 },
  { code: 'HRG', name: 'Hurghada International Airport', city: 'Hurghada', country: 'Egypt', region: 'Africa', latitude: 27.1783, longitude: 33.7994 },
  { code: 'JNB', name: 'O. R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', region: 'Africa', popular: true, latitude: -26.1392, longitude: 28.2460 },
  { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa', region: 'Africa', popular: true, latitude: -33.9715, longitude: 18.6021 },
  { code: 'DUR', name: 'King Shaka International Airport', city: 'Durban', country: 'South Africa', region: 'Africa', latitude: -29.6144, longitude: 31.1197 },
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya', region: 'Africa', popular: true, latitude: -1.3192, longitude: 36.9275 },
  { code: 'MBA', name: 'Moi International Airport', city: 'Mombasa', country: 'Kenya', region: 'Africa', latitude: -4.0348, longitude: 39.5942 },
  { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco', region: 'Africa', popular: true, latitude: 33.3675, longitude: -7.5899 },
  { code: 'RAK', name: 'Marrakesh Menara Airport', city: 'Marrakesh', country: 'Morocco', region: 'Africa', popular: true, latitude: 31.6069, longitude: -8.0363 },
  { code: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia', region: 'Africa', popular: true, latitude: 8.9779, longitude: 38.7993 },
  { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria', region: 'Africa', latitude: 6.5774, longitude: 3.3212 },
  { code: 'ACC', name: 'Kotoka International Airport', city: 'Accra', country: 'Ghana', region: 'Africa', latitude: 5.6052, longitude: -0.1668 },
  { code: 'TUN', name: 'Tunis-Carthage International Airport', city: 'Tunis', country: 'Tunisia', region: 'Africa', latitude: 36.8510, longitude: 10.2272 },
  { code: 'ZNZ', name: 'Abeid Amani Karume International Airport', city: 'Zanzibar', country: 'Tanzania', region: 'Africa', popular: true, latitude: -6.2220, longitude: 39.2249 },
  { code: 'DAR', name: 'Julius Nyerere International Airport', city: 'Dar es Salaam', country: 'Tanzania', region: 'Africa', latitude: -6.8781, longitude: 39.2026 },
  { code: 'MRU', name: 'Sir Seewoosagur Ramgoolam International Airport', city: 'Mauritius', country: 'Mauritius', region: 'Africa', popular: true, latitude: -20.4302, longitude: 57.6836 },
  { code: 'SEZ', name: 'Seychelles International Airport', city: 'Mahé / Seychelles', country: 'Seychelles', region: 'Africa', popular: true, latitude: -4.6743, longitude: 55.5219 },

  // --- ADDITIONAL GLOBAL & DOMESTIC AIRPORTS ---
  // USA & Canada
  { code: 'TPA', name: 'Tampa International Airport', city: 'Tampa', country: 'United States', region: 'North America', latitude: 27.9755, longitude: -82.5332 },
  { code: 'CLE', name: 'Cleveland Hopkins International Airport', city: 'Cleveland', country: 'United States', region: 'North America', latitude: 41.4117, longitude: -81.8498 },
  { code: 'PIT', name: 'Pittsburgh International Airport', city: 'Pittsburgh', country: 'United States', region: 'North America', latitude: 40.4915, longitude: -80.2329 },
  { code: 'CMH', name: 'John Glenn Columbus International Airport', city: 'Columbus', country: 'United States', region: 'North America', latitude: 39.9980, longitude: -82.8919 },
  { code: 'IND', name: 'Indianapolis International Airport', city: 'Indianapolis', country: 'United States', region: 'North America', latitude: 39.7173, longitude: -86.2944 },
  { code: 'MCI', name: 'Kansas City International Airport', city: 'Kansas City', country: 'United States', region: 'North America', latitude: 39.2976, longitude: -94.7139 },
  { code: 'SJC', name: 'Norman Y. Mineta San Jose International Airport', city: 'San Jose', country: 'United States', region: 'North America', latitude: 37.3626, longitude: -121.9290 },
  { code: 'SMF', name: 'Sacramento International Airport', city: 'Sacramento', country: 'United States', region: 'North America', latitude: 38.6954, longitude: -121.5908 },
  { code: 'OAK', name: 'San Francisco Bay Oakland International Airport', city: 'Oakland', country: 'United States', region: 'North America', latitude: 37.7213, longitude: -122.2207 },
  { code: 'OMA', name: 'Eppley Airfield', city: 'Omaha', country: 'United States', region: 'North America', latitude: 41.3032, longitude: -95.8941 },
  { code: 'MEM', name: 'Memphis International Airport', city: 'Memphis', country: 'United States', region: 'North America', latitude: 35.0424, longitude: -89.9767 },
  { code: 'OKC', name: 'Will Rogers World Airport', city: 'Oklahoma City', country: 'United States', region: 'North America', latitude: 35.3931, longitude: -97.6007 },
  { code: 'ABQ', name: 'Albuquerque International Sunport', city: 'Albuquerque', country: 'United States', region: 'North America', latitude: 35.0402, longitude: -106.6092 },
  { code: 'TUS', name: 'Tucson International Airport', city: 'Tucson', country: 'United States', region: 'North America', latitude: 32.1161, longitude: -110.9410 },
  { code: 'OGG', name: 'Kahului Airport', city: 'Maui', country: 'United States', region: 'North America', latitude: 20.8986, longitude: -156.4305 },
  { code: 'KOA', name: 'Ellison Onizuka Kona International Airport', city: 'Kona', country: 'United States', region: 'North America', latitude: 19.7388, longitude: -156.0456 },
  { code: 'LIH', name: 'Lihue Airport', city: 'Kauai', country: 'United States', region: 'North America', latitude: 21.9760, longitude: -159.3390 },

  { code: 'YQB', name: 'Québec City Jean Lesage International Airport', city: 'Quebec City', country: 'Canada', region: 'North America', latitude: 46.7911, longitude: -71.3933 },
  { code: 'YYJ', name: 'Victoria International Airport', city: 'Victoria', country: 'Canada', region: 'North America', latitude: 48.6469, longitude: -123.4258 },
  { code: 'YLW', name: 'Kelowna International Airport', city: 'Kelowna', country: 'Canada', region: 'North America', latitude: 49.9561, longitude: -119.3778 },

  { code: 'TIJ', name: 'Tijuana International Airport', city: 'Tijuana', country: 'Mexico', region: 'North America', latitude: 32.5411, longitude: -116.9702 },
  { code: 'MID', name: 'Manuel Crescencio Rejón International Airport', city: 'Mérida', country: 'Mexico', region: 'North America', latitude: 20.9370, longitude: -89.6577 },
  { code: 'OAX', name: 'Xoxocotlán International Airport', city: 'Oaxaca', country: 'Mexico', region: 'North America', latitude: 16.9999, longitude: -96.7266 },
  { code: 'SJD', name: 'Los Cabos International Airport', city: 'Cabo San Lucas', country: 'Mexico', region: 'North America', popular: true, latitude: 23.1518, longitude: -109.7210 },

  // Europe Expansion
  { code: 'NCL', name: 'Newcastle International Airport', city: 'Newcastle upon Tyne', country: 'United Kingdom', region: 'Europe', latitude: 55.0375, longitude: -1.6917 },
  { code: 'LDS', name: 'Leeds Bradford Airport', city: 'Leeds', country: 'United Kingdom', region: 'Europe', latitude: 53.8658, longitude: -1.6606 },
  { code: 'BRS', name: 'Bristol Airport', city: 'Bristol', country: 'United Kingdom', region: 'Europe', latitude: 51.3827, longitude: -2.7191 },
  { code: 'BFS', name: 'Belfast International Airport', city: 'Belfast', country: 'United Kingdom', region: 'Europe', latitude: 54.6575, longitude: -6.2158 },
  { code: 'ORK', name: 'Cork Airport', city: 'Cork', country: 'Ireland', region: 'Europe', latitude: 51.8413, longitude: -8.4911 },

  { code: 'BOD', name: 'Bordeaux-Mérignac Airport', city: 'Bordeaux', country: 'France', region: 'Europe', latitude: 44.8283, longitude: -0.7156 },
  { code: 'TLS', name: 'Toulouse-Blagnac Airport', city: 'Toulouse', country: 'France', region: 'Europe', latitude: 43.6291, longitude: 1.3638 },
  { code: 'NTE', name: 'Nantes Atlantique Airport', city: 'Nantes', country: 'France', region: 'Europe', latitude: 47.1532, longitude: -1.6107 },

  { code: 'CGN', name: 'Cologne Bonn Airport', city: 'Cologne / Bonn', country: 'Germany', region: 'Europe', latitude: 50.8659, longitude: 7.1427 },
  { code: 'NUE', name: 'Nuremberg Airport', city: 'Nuremberg', country: 'Germany', region: 'Europe', latitude: 49.4987, longitude: 11.0780 },
  { code: 'HAJ', name: 'Hannover Airport', city: 'Hannover', country: 'Germany', region: 'Europe', latitude: 52.4611, longitude: 9.6851 },

  { code: 'BLQ', name: 'Bologna Guglielmo Marconi Airport', city: 'Bologna', country: 'Italy', region: 'Europe', latitude: 44.5354, longitude: 11.2887 },
  { code: 'PSA', name: 'Pisa International Airport', city: 'Pisa', country: 'Italy', region: 'Europe', latitude: 43.6839, longitude: 10.3927 },
  { code: 'TRN', name: 'Turin Airport', city: 'Turin', country: 'Italy', region: 'Europe', latitude: 45.2008, longitude: 7.6496 },
  { code: 'VRN', name: 'Verona Villafranca Airport', city: 'Verona', country: 'Italy', region: 'Europe', latitude: 45.3957, longitude: 10.8885 },
  { code: 'BRI', name: 'Bari Karol Wojtyła Airport', city: 'Bari', country: 'Italy', region: 'Europe', latitude: 41.1389, longitude: 16.7606 },
  { code: 'CTA', name: 'Catania-Fontanarossa Airport', city: 'Catania / Sicily', country: 'Italy', region: 'Europe', latitude: 37.4668, longitude: 15.0664 },
  { code: 'PMO', name: 'Falcone Borsellino Airport', city: 'Palermo / Sicily', country: 'Italy', region: 'Europe', latitude: 38.1760, longitude: 13.0910 },

  { code: 'VLC', name: 'Valencia Airport', city: 'Valencia', country: 'Spain', region: 'Europe', latitude: 39.4893, longitude: -0.4816 },
  { code: 'SVQ', name: 'Seville Airport', city: 'Seville', country: 'Spain', region: 'Europe', latitude: 37.4180, longitude: -5.8931 },
  { code: 'BIO', name: 'Bilbao Airport', city: 'Bilbao', country: 'Spain', region: 'Europe', latitude: 43.3011, longitude: -2.9106 },
  { code: 'SCQ', name: 'Santiago-Rosalía de Castro Airport', city: 'Santiago de Compostela', country: 'Spain', region: 'Europe', latitude: 42.8963, longitude: -8.4151 },
  { code: 'LPA', name: 'Gran Canaria Airport', city: 'Las Palmas / Canary Islands', country: 'Spain', region: 'Europe', latitude: 27.9319, longitude: -15.3866 },
  { code: 'TFS', name: 'Tenerife South Airport', city: 'Tenerife / Canary Islands', country: 'Spain', region: 'Europe', latitude: 28.0445, longitude: -16.5725 },
  { code: 'ALC', name: 'Alicante–Elche Miguel Hernández Airport', city: 'Alicante', country: 'Spain', region: 'Europe', latitude: 38.2822, longitude: -0.5582 },

  { code: 'FNC', name: 'Madeira Airport', city: 'Funchal / Madeira', country: 'Portugal', region: 'Europe', popular: true, latitude: 32.6979, longitude: -16.7744 },
  { code: 'PDL', name: 'João Paulo II Airport', city: 'Ponta Delgada / Azores', country: 'Portugal', region: 'Europe', latitude: 37.7412, longitude: -25.6979 },

  { code: 'INN', name: 'Innsbruck Airport', city: 'Innsbruck', country: 'Austria', region: 'Europe', latitude: 47.2602, longitude: 11.3440 },
  { code: 'SZG', name: 'Salzburg Airport', city: 'Salzburg', country: 'Austria', region: 'Europe', latitude: 47.7933, longitude: 13.0043 },
  { code: 'BSL', name: 'EuroAirport Basel Mulhouse Freiburg', city: 'Basel / Freiburg', country: 'Switzerland', region: 'Europe', latitude: 47.5896, longitude: 7.5299 },

  { code: 'GOT', name: 'Göteborg Landvetter Airport', city: 'Gothenburg', country: 'Sweden', region: 'Europe', latitude: 57.6683, longitude: 12.2928 },
  { code: 'SVG', name: 'Stavanger Airport, Sola', city: 'Stavanger', country: 'Norway', region: 'Europe', latitude: 58.8768, longitude: 5.6378 },
  { code: 'BGO', name: 'Bergen Airport, Flesland', city: 'Bergen', country: 'Norway', region: 'Europe', latitude: 60.2934, longitude: 5.2181 },
  { code: 'TOS', name: 'Tromsø Airport', city: 'Tromso', country: 'Norway', region: 'Europe', latitude: 69.6833, longitude: 18.9189 },

  { code: 'TLL', name: 'Tallinn Airport', city: 'Tallinn', country: 'Estonia', region: 'Europe', latitude: 59.4133, longitude: 24.8328 },
  { code: 'RIX', name: 'Riga International Airport', city: 'Riga', country: 'Latvia', region: 'Europe', latitude: 56.9236, longitude: 23.9711 },
  { code: 'VNO', name: 'Vilnius Airport', city: 'Vilnius', country: 'Lithuania', region: 'Europe', latitude: 54.6341, longitude: 25.2858 },

  { code: 'KRK', name: 'Kraków John Paul II International Airport', city: 'Krakow', country: 'Poland', region: 'Europe', latitude: 50.0777, longitude: 19.7848 },
  { code: 'GDN', name: 'Gdańsk Lech Wałęsa Airport', city: 'Gdansk', country: 'Poland', region: 'Europe', latitude: 54.3776, longitude: 18.4662 },

  { code: 'ZAG', name: 'Zagreb Airport', city: 'Zagreb', country: 'Croatia', region: 'Europe', latitude: 45.7429, longitude: 16.0688 },
  { code: 'SPU', name: 'Split Airport', city: 'Split', country: 'Croatia', region: 'Europe', popular: true, latitude: 43.5389, longitude: 16.2980 },
  { code: 'DBV', name: 'Dubrovnik Airport', city: 'Dubrovnik', country: 'Croatia', region: 'Europe', popular: true, latitude: 42.5614, longitude: 18.2682 },

  { code: 'RHO', name: 'Rhodes International Airport', city: 'Rhodes', country: 'Greece', region: 'Europe', latitude: 36.4054, longitude: 28.0862 },
  { code: 'CFU', name: 'Corfu International Airport', city: 'Corfu', country: 'Greece', region: 'Europe', latitude: 39.6019, longitude: 19.9117 },
  { code: 'HER', name: 'Heraklion International Airport', city: 'Heraklion / Crete', country: 'Greece', region: 'Europe', latitude: 35.3397, longitude: 25.1803 },

  { code: 'SOF', name: 'Sofia Airport', city: 'Sofia', country: 'Bulgaria', region: 'Europe', latitude: 42.6952, longitude: 23.4062 },
  { code: 'TBS', name: 'Tbilisi International Airport', city: 'Tbilisi', country: 'Georgia', region: 'Europe', latitude: 41.6692, longitude: 44.9547 },
  { code: 'EVN', name: 'Zvartnots International Airport', city: 'Yerevan', country: 'Armenia', region: 'Europe', latitude: 40.1473, longitude: 44.3959 },

  // Asia Expansion
  { code: 'NGO', name: 'Chubu Centrair International Airport', city: 'Nagoya', country: 'Japan', region: 'Asia', latitude: 34.8583, longitude: 136.8053 },
  { code: 'OKA', name: 'Naha Airport', city: 'Okinawa / Naha', country: 'Japan', region: 'Asia', popular: true, latitude: 26.1958, longitude: 127.6458 },
  { code: 'PUS', name: 'Gimhae International Airport', city: 'Busan', country: 'South Korea', region: 'Asia', latitude: 35.1795, longitude: 128.9382 },

  { code: 'HGH', name: 'Hangzhou Xiaoshan International Airport', city: 'Hangzhou', country: 'China', region: 'Asia', latitude: 30.2295, longitude: 120.4344 },
  { code: 'WUH', name: 'Wuhan Tianhe International Airport', city: 'Wuhan', country: 'China', region: 'Asia', latitude: 30.7838, longitude: 114.2081 },
  { code: 'KMG', name: 'Kunming Changshui International Airport', city: 'Kunming', country: 'China', region: 'Asia', latitude: 25.1019, longitude: 102.9292 },
  { code: 'SYX', name: 'Sanya Phoenix International Airport', city: 'Sanya / Hainan', country: 'China', region: 'Asia', popular: true, latitude: 18.3029, longitude: 109.4122 },

  { code: 'KBV', name: 'Krabi International Airport', city: 'Krabi', country: 'Thailand', region: 'Asia', popular: true, latitude: 8.0983, longitude: 98.9862 },
  { code: 'USM', name: 'Samui Airport', city: 'Koh Samui', country: 'Thailand', region: 'Asia', popular: true, latitude: 9.5489, longitude: 100.0625 },

  { code: 'JOG', name: 'Yogyakarta International Airport', city: 'Yogyakarta', country: 'Indonesia', region: 'Asia', latitude: -7.9016, longitude: 110.0578 },
  { code: 'LGK', name: 'Langkawi International Airport', city: 'Langkawi', country: 'Malaysia', region: 'Asia', popular: true, latitude: 6.3297, longitude: 99.7287 },

  { code: 'CXR', name: 'Cam Ranh International Airport', city: 'Nha Trang', country: 'Vietnam', region: 'Asia', latitude: 11.9982, longitude: 109.2194 },
  { code: 'PQC', name: 'Phu Quoc International Airport', city: 'Phu Quoc', country: 'Vietnam', region: 'Asia', popular: true, latitude: 10.1697, longitude: 103.9928 },
  { code: 'REP', name: 'Siem Reap-Angkor International Airport', city: 'Siem Reap', country: 'Cambodia', region: 'Asia', popular: true, latitude: 13.3617, longitude: 103.8128 },
  { code: 'LPQ', name: 'Luang Prabang International Airport', city: 'Luang Prabang', country: 'Laos', region: 'Asia', popular: true, latitude: 19.8975, longitude: 102.1625 },

  { code: 'VNS', name: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', country: 'India', region: 'Asia', latitude: 25.4524, longitude: 82.8592 },
  { code: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', country: 'India', region: 'Asia', latitude: 26.7606, longitude: 80.8893 },
  { code: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar', country: 'India', region: 'Asia', latitude: 31.7096, longitude: 74.7973 },
  { code: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', country: 'India', region: 'Asia', popular: true, latitude: 33.9871, longitude: 74.7741 },
  { code: 'IXL', name: 'Kushok Bakula Rimpochee Airport', city: 'Leh / Ladakh', country: 'India', region: 'Asia', popular: true, latitude: 34.1359, longitude: 77.5465 },

  { code: 'PBH', name: 'Paro International Airport', city: 'Paro', country: 'Bhutan', region: 'Asia', popular: true, latitude: 27.4032, longitude: 89.4246 },

  // Middle East & Africa Expansion
  { code: 'ULH', name: 'Al Ula International Airport', city: 'Al Ula', country: 'Saudi Arabia', region: 'Middle East', popular: true, latitude: 26.4883, longitude: 38.1189 },
  { code: 'SLL', name: 'Salalah International Airport', city: 'Salalah', country: 'Oman', region: 'Middle East', popular: true, latitude: 17.0383, longitude: 54.0914 },
  { code: 'SSH', name: 'Sharm El Sheikh International Airport', city: 'Sharm El Sheikh', country: 'Egypt', region: 'Africa', popular: true, latitude: 27.9773, longitude: 34.3950 },
  { code: 'LXR', name: 'Luxor International Airport', city: 'Luxor', country: 'Egypt', region: 'Africa', popular: true, latitude: 25.6708, longitude: 32.7064 },
  { code: 'JRO', name: 'Kilimanjaro International Airport', city: 'Kilimanjaro / Arusha', country: 'Tanzania', region: 'Africa', popular: true, latitude: -3.4294, longitude: 37.0745 },

  // Australia & Pacific
  { code: 'HBA', name: 'Hobart Airport', city: 'Hobart / Tasmania', country: 'Australia', region: 'Oceania', latitude: -42.8361, longitude: 147.5097 },
  { code: 'BME', name: 'Broome International Airport', city: 'Broome', country: 'Australia', region: 'Oceania', popular: true, latitude: -17.9497, longitude: 122.2319 },
  { code: 'HTI', name: 'Great Barrier Reef Airport', city: 'Hamilton Island', country: 'Australia', region: 'Oceania', popular: true, latitude: -20.3586, longitude: 148.9514 },

  // South America
  { code: 'MDZ', name: 'Governor Francisco Gabrielli International Airport', city: 'Mendoza', country: 'Argentina', region: 'South America', popular: true, latitude: -32.8317, longitude: -68.7929 },
  { code: 'BRC', name: 'San Carlos de Bariloche Airport', city: 'Bariloche', country: 'Argentina', region: 'South America', popular: true, latitude: -41.1512, longitude: -71.1578 },
  { code: 'FLN', name: 'Hercílio Luz International Airport', city: 'Florianópolis', country: 'Brazil', region: 'South America', popular: true, latitude: -27.6703, longitude: -48.5525 },
  { code: 'MAO', name: 'Eduardo Gomes International Airport', city: 'Manaus / Amazon', country: 'Brazil', region: 'South America', popular: true, latitude: -3.0386, longitude: -60.0497 },
  { code: 'IGU', name: 'Foz do Iguaçu International Airport', city: 'Foz do Iguaçu / Falls', country: 'Brazil', region: 'South America', popular: true, latitude: -25.5960, longitude: -54.4872 },
  { code: 'PUQ', name: 'Presidente Carlos Ibáñez del Campo International Airport', city: 'Punta Arenas / Patagonia', country: 'Chile', region: 'South America', popular: true, latitude: -53.0026, longitude: -70.8546 },
  { code: 'CTG', name: 'Rafael Núñez International Airport', city: 'Cartagena', country: 'Colombia', region: 'South America', popular: true, latitude: 10.4424, longitude: -75.5130 },
  { code: 'GPS', name: 'Seymour Airport', city: 'Galapagos Islands', country: 'Ecuador', region: 'South America', popular: true, latitude: -0.4538, longitude: -90.2659 },
];

/**
 * Filter and rank airports matching query by:
 * - IATA code
 * - City Name
 * - Airport Name
 * - Country Name
 */
export function searchAirports(query: string, maxResults = 12): Airport[] {
  if (!query || !query.trim()) {
    return ALL_AIRPORTS.filter((a) => a.popular).slice(0, maxResults);
  }

  const q = query.trim().toLowerCase();

  // Score matching items
  const matches = ALL_AIRPORTS.map((airport) => {
    const code = airport.code.toLowerCase();
    const city = airport.city.toLowerCase();
    const name = airport.name.toLowerCase();
    const country = airport.country.toLowerCase();

    let score = 0;

    // Exact IATA match gets highest priority
    if (code === q) score += 100;
    else if (code.startsWith(q)) score += 80;
    else if (code.includes(q)) score += 50;

    // City match
    if (city === q) score += 90;
    else if (city.startsWith(q)) score += 70;
    else if (city.includes(q)) score += 40;

    // Airport name match
    if (name.startsWith(q)) score += 60;
    else if (name.includes(q)) score += 30;

    // Country match
    if (country === q) score += 50;
    else if (country.startsWith(q)) score += 35;
    else if (country.includes(q)) score += 20;

    return { airport, score };
  })
  .filter((item) => item.score > 0)
  .sort((a, b) => b.score - a.score || a.airport.city.localeCompare(b.airport.city));

  return matches.map((m) => m.airport).slice(0, maxResults);
}

export function getPopularAirports(): Airport[] {
  return ALL_AIRPORTS.filter((a) => a.popular);
}

export function getAirportByCode(code: string): Airport | undefined {
  if (!code) return undefined;
  const upper = code.trim().toUpperCase();
  return ALL_AIRPORTS.find((a) => a.code === upper);
}

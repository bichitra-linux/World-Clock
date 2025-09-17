import moment from 'moment-timezone';

// Predefined major cities with their timezone identifiers (expanded list)
export const DEFAULT_CITIES = [
  { name: 'New York', country: 'USA', timezone: 'America/New_York' },
  { name: 'London', country: 'UK', timezone: 'Europe/London' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
];

// Comprehensive list of major world cities (100+ cities)
export const SEARCHABLE_CITIES = [
  // North America
  { name: 'New York', country: 'USA', timezone: 'America/New_York' },
  { name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { name: 'Chicago', country: 'USA', timezone: 'America/Chicago' },
  { name: 'Houston', country: 'USA', timezone: 'America/Chicago' },
  { name: 'Phoenix', country: 'USA', timezone: 'America/Phoenix' },
  { name: 'Philadelphia', country: 'USA', timezone: 'America/New_York' },
  { name: 'San Antonio', country: 'USA', timezone: 'America/Chicago' },
  { name: 'San Diego', country: 'USA', timezone: 'America/Los_Angeles' },
  { name: 'Dallas', country: 'USA', timezone: 'America/Chicago' },
  { name: 'San Jose', country: 'USA', timezone: 'America/Los_Angeles' },
  { name: 'Austin', country: 'USA', timezone: 'America/Chicago' },
  { name: 'Jacksonville', country: 'USA', timezone: 'America/New_York' },
  { name: 'San Francisco', country: 'USA', timezone: 'America/Los_Angeles' },
  { name: 'Denver', country: 'USA', timezone: 'America/Denver' },
  { name: 'Seattle', country: 'USA', timezone: 'America/Los_Angeles' },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver' },
  { name: 'Montreal', country: 'Canada', timezone: 'America/Toronto' },
  { name: 'Calgary', country: 'Canada', timezone: 'America/Edmonton' },
  { name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { name: 'Guadalajara', country: 'Mexico', timezone: 'America/Mexico_City' },
  { name: 'Monterrey', country: 'Mexico', timezone: 'America/Monterrey' },

  // South America
  { name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { name: 'Rio de Janeiro', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { name: 'Brasília', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
  { name: 'Lima', country: 'Peru', timezone: 'America/Lima' },
  { name: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota' },
  { name: 'Santiago', country: 'Chile', timezone: 'America/Santiago' },
  { name: 'Caracas', country: 'Venezuela', timezone: 'America/Caracas' },
  { name: 'Quito', country: 'Ecuador', timezone: 'America/Guayaquil' },

  // Europe
  { name: 'London', country: 'UK', timezone: 'Europe/London' },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
  { name: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { name: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna' },
  { name: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels' },
  { name: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm' },
  { name: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen' },
  { name: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo' },
  { name: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki' },
  { name: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich' },
  { name: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague' },
  { name: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw' },
  { name: 'Budapest', country: 'Hungary', timezone: 'Europe/Budapest' },
  { name: 'Athens', country: 'Greece', timezone: 'Europe/Athens' },
  { name: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon' },
  { name: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin' },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
  { name: 'Kiev', country: 'Ukraine', timezone: 'Europe/Kiev' },
  { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },

  // Asia
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
  { name: 'Beijing', country: 'China', timezone: 'Asia/Shanghai' },
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  { name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Delhi', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Chennai', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Hyderabad', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Kolkata', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { name: 'Manila', country: 'Philippines', timezone: 'Asia/Manila' },
  { name: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { name: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
  { name: 'Tehran', country: 'Iran', timezone: 'Asia/Tehran' },
  { name: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem' },
  { name: 'Doha', country: 'Qatar', timezone: 'Asia/Qatar' },
  { name: 'Kuwait City', country: 'Kuwait', timezone: 'Asia/Kuwait' },
  { name: 'Almaty', country: 'Kazakhstan', timezone: 'Asia/Almaty' },
  { name: 'Tashkent', country: 'Uzbekistan', timezone: 'Asia/Tashkent' },
  { name: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi' },
  { name: 'Lahore', country: 'Pakistan', timezone: 'Asia/Karachi' },
  { name: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka' },
  { name: 'Yangon', country: 'Myanmar', timezone: 'Asia/Yangon' },
  { name: 'Phnom Penh', country: 'Cambodia', timezone: 'Asia/Phnom_Penh' },

  // Africa
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos' },
  { name: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi' },
  { name: 'Casablanca', country: 'Morocco', timezone: 'Africa/Casablanca' },
  { name: 'Algiers', country: 'Algeria', timezone: 'Africa/Algiers' },
  { name: 'Tunis', country: 'Tunisia', timezone: 'Africa/Tunis' },
  { name: 'Addis Ababa', country: 'Ethiopia', timezone: 'Africa/Addis_Ababa' },
  { name: 'Accra', country: 'Ghana', timezone: 'Africa/Accra' },
  { name: 'Dakar', country: 'Senegal', timezone: 'Africa/Dakar' },
  { name: 'Kinshasa', country: 'DR Congo', timezone: 'Africa/Kinshasa' },
  { name: 'Luanda', country: 'Angola', timezone: 'Africa/Luanda' },

  // Oceania
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
  { name: 'Brisbane', country: 'Australia', timezone: 'Australia/Brisbane' },
  { name: 'Perth', country: 'Australia', timezone: 'Australia/Perth' },
  { name: 'Adelaide', country: 'Australia', timezone: 'Australia/Adelaide' },
  { name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  { name: 'Wellington', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  { name: 'Fiji', country: 'Fiji', timezone: 'Pacific/Fiji' },
  { name: 'Port Moresby', country: 'Papua New Guinea', timezone: 'Pacific/Port_Moresby' },
];

// DSA Algorithm 1: Merge Sort for sorting cities alphabetically
export function mergeSort(cities, key = 'name') {
  if (cities.length <= 1) return cities;

  const middle = Math.floor(cities.length / 2);
  const left = cities.slice(0, middle);
  const right = cities.slice(middle);

  return merge(mergeSort(left, key), mergeSort(right, key), key);
}

function merge(left, right, key) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex][key].toLowerCase() <= right[rightIndex][key].toLowerCase()) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// DSA Algorithm 2: Binary Search for fast city lookup
export function binarySearchCity(sortedCities, searchName) {
  let left = 0;
  let right = sortedCities.length - 1;
  const searchLower = searchName.toLowerCase();

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const middleCityName = sortedCities[middle].name.toLowerCase();

    if (middleCityName === searchLower) {
      return sortedCities[middle];
    } else if (middleCityName < searchLower) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }
  
  return null; // City not found
}

export const TimeService = {
  getCurrentTimeForCity(city, is24Hour = false) {
    const now = moment.tz(city.timezone);
    const format = is24Hour ? 'HH:mm:ss' : 'h:mm:ss A';
    return {
      time: now.format(format),
      date: now.format('ddd, MMM DD'),
      fullDate: now.format('YYYY-MM-DD HH:mm:ss'),
      timestamp: now.valueOf(),
    };
  },

  getTimeDifferenceFromLocal(city) {
    const localTime = moment();
    const cityTime = moment.tz(city.timezone);
    const diffInHours = cityTime.utcOffset() - localTime.utcOffset();
    const hours = Math.floor(diffInHours / 60);
    
    if (hours === 0) {
      return 'Same time';
    } else if (hours > 0) {
      return `+${hours} hrs`;
    } else {
      return `${hours} hrs`;
    }
  },

  searchCities(query) {
    if (!query || query.length < 2) {
      return [];
    }
    
    const lowercaseQuery = query.toLowerCase();
    
    // Use merge sort to sort cities for better user experience
    const sortedCities = mergeSort([...SEARCHABLE_CITIES], 'name');
    
    // Filter cities that match the query (includes partial matches)
    const results = sortedCities.filter(city =>
      city.name.toLowerCase().includes(lowercaseQuery) ||
      city.country.toLowerCase().includes(lowercaseQuery)
    );

    // Try binary search for exact match first
    const exactMatch = binarySearchCity(sortedCities, query);
    if (exactMatch && !results.some(city => city.timezone === exactMatch.timezone)) {
      results.unshift(exactMatch);
    }

    return results;
  },

  getSortedCities(cities, sortBy = 'name') {
    return mergeSort([...cities], sortBy);
  },

  convertTime(sourceCity, targetCity, sourceTime) {
    const sourceMoment = moment.tz(sourceTime, 'HH:mm', sourceCity.timezone);
    const targetMoment = sourceMoment.clone().tz(targetCity.timezone);
    
    return {
      sourceTime: sourceMoment.format('HH:mm'),
      targetTime: targetMoment.format('HH:mm'),
      sourceDatetime: sourceMoment.format('YYYY-MM-DD HH:mm:ss'),
      targetDatetime: targetMoment.format('YYYY-MM-DD HH:mm:ss'),
      timeDifference: this.getTimeDifferenceFromLocal(targetCity),
    };
  },
};
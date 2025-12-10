import { SkyscannerFlight } from '../services/skyscannerService';

export interface FlightFilters {
  minPrice?: number;
  maxPrice?: number;
  maxStops?: number;
  airlines?: string[];
  departTimeStart?: string; // HH:MM
  departTimeEnd?: string; // HH:MM
  arrivalTimeStart?: string; // HH:MM
  arrivalTimeEnd?: string; // HH:MM
}

export type SortBy = 'price' | 'departure' | 'arrival' | 'duration' | 'stops';
export type SortOrder = 'asc' | 'desc';

/**
 * Filter flights based on criteria
 */
export const filterFlights = (flights: SkyscannerFlight[], filters: FlightFilters): SkyscannerFlight[] => {
  return flights.filter((flight) => {
    // Price filter
    if (filters.minPrice !== undefined && flight.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && flight.price > filters.maxPrice) {
      return false;
    }

    // Stops filter
    if (filters.maxStops !== undefined && flight.stops > filters.maxStops) {
      return false;
    }

    // Airlines filter
    if (filters.airlines && filters.airlines.length > 0) {
      if (!filters.airlines.includes(flight.airline)) {
        return false;
      }
    }

    // Departure time filter
    if (filters.departTimeStart || filters.departTimeEnd) {
      const flightTime = flight.departure.time;
      if (filters.departTimeStart && flightTime < filters.departTimeStart) {
        return false;
      }
      if (filters.departTimeEnd && flightTime > filters.departTimeEnd) {
        return false;
      }
    }

    // Arrival time filter
    if (filters.arrivalTimeStart || filters.arrivalTimeEnd) {
      const flightTime = flight.arrival.time;
      if (filters.arrivalTimeStart && flightTime < filters.arrivalTimeStart) {
        return false;
      }
      if (filters.arrivalTimeEnd && flightTime > filters.arrivalTimeEnd) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort flights based on criteria
 */
export const sortFlights = (
  flights: SkyscannerFlight[],
  sortBy: SortBy = 'price',
  order: SortOrder = 'asc'
): SkyscannerFlight[] => {
  const sorted = [...flights].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'departure':
        comparison = a.departure.time.localeCompare(b.departure.time);
        break;
      case 'arrival':
        comparison = a.arrival.time.localeCompare(b.arrival.time);
        break;
      case 'duration':
        comparison = a.duration - b.duration;
        break;
      case 'stops':
        comparison = a.stops - b.stops;
        break;
      default:
        comparison = 0;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Apply both filters and sorting
 */
export const filterAndSortFlights = (
  flights: SkyscannerFlight[],
  filters: FlightFilters,
  sortBy: SortBy = 'price',
  order: SortOrder = 'asc'
): SkyscannerFlight[] => {
  const filtered = filterFlights(flights, filters);
  return sortFlights(filtered, sortBy, order);
};

/**
 * Get available airlines from flights
 */
export const getAvailableAirlines = (flights: SkyscannerFlight[]): string[] => {
  const airlines = new Set(flights.map((f) => f.airline));
  return Array.from(airlines).sort();
};

/**
 * Get price range from flights
 */
export const getPriceRange = (flights: SkyscannerFlight[]): { min: number; max: number } => {
  if (flights.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = flights.map((f) => f.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

/**
 * Get available stops from flights
 */
export const getAvailableStops = (flights: SkyscannerFlight[]): number[] => {
  const stops = new Set(flights.map((f) => f.stops));
  return Array.from(stops).sort((a, b) => a - b);
};

export default {
  filterFlights,
  sortFlights,
  filterAndSortFlights,
  getAvailableAirlines,
  getPriceRange,
  getAvailableStops,
};

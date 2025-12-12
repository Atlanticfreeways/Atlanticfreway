export interface Flight {
    id: string;
    airline: string;
    flightNumber: string;
    departure: {
        airport: string;
        city: string;
        date: string;
        time: string;
    };
    arrival: {
        airport: string;
        city: string;
        date: string;
        time: string;
    };
    duration: number; // in minutes
    price: number;
    currency: string;
    stops: number;
    emissions?: number; // CO2 kg
    safetyScore?: number; // 0-100
}

export interface FlightSearchParams {
    from: string;
    to: string;
    departDate: string;
    returnDate?: string;
    travelers: number;
    class: 'economy' | 'business' | 'first';
}

export interface SearchResponse {
    flights: Flight[];
    count: number;
    minPrice: number;
    maxPrice: number;
}

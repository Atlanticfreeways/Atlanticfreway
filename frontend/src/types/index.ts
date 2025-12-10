// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  preferences: {
    currency: string;
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Flight types
export interface Flight {
  id: string;
  skyscannerQuoteId: string;
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
  airline: string;
  price: number;
  currency: string;
  stops: number;
  duration: number;
  deeplink: string;
  segments: Array<{
    departure: string;
    arrival: string;
    airline: string;
    flightNumber: string;
  }>;
}

// Hotel types
export interface Hotel {
  id: string;
  skyscannerHotelId: string;
  name: string;
  city: string;
  airport: string;
  distance: number;
  rating: number;
  reviews: number;
  pricePerNight: number;
  currency: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  amenities: string[];
  images: string[];
  deeplink: string;
}

// Booking types
export interface Booking {
  id: string;
  bookingReference: string;
  flights: Array<{
    flightId: string;
    skyscannerQuoteId: string;
    price: number;
  }>;
  hotel?: {
    hotelId: string;
    skyscannerHotelId: string;
    nights: number;
    pricePerNight: number;
    totalPrice: number;
  };
  passengers: Array<{
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    passport: string;
  }>;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

// Search types
export interface SearchQuery {
  departure: string;
  arrival: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'roundtrip' | 'oneway' | 'multicity';
}

// Price Alert types
export interface PriceAlert {
  id: string;
  route: {
    from: string;
    to: string;
  };
  targetPrice: number;
  currency: string;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
  lastNotified?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

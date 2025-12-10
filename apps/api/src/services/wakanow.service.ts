import axios from 'axios';

export class WakanowService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.WAKANOW_API_URL || '';
    this.apiKey = process.env.WAKANOW_API_KEY || '';
  }

  async searchFlights(params: { origin: string; destination: string; date: string }) {
    const response = await axios.get(`${this.apiUrl}/flights/search`, {
      headers: { 'X-API-Key': this.apiKey },
      params
    });
    return response.data;
  }

  async searchHotels(params: { location: string; checkin: string; checkout: string }) {
    const response = await axios.get(`${this.apiUrl}/hotels/search`, {
      headers: { 'X-API-Key': this.apiKey },
      params
    });
    return response.data;
  }

  async createBooking(bookingData: any) {
    const response = await axios.post(`${this.apiUrl}/bookings`, bookingData, {
      headers: { 'X-API-Key': this.apiKey }
    });
    return response.data;
  }
}

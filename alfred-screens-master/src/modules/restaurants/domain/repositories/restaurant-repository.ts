import Restaurant from '@modules/restaurants/domain/models/restaurant';
import RestaurantAvailability from '@modules/restaurants/domain/models/restaurant-availability';

export default interface RestaurantRepository {
    find(id: string): Promise<Restaurant | null>;

    findAll(filters?: any): Promise<Restaurant[]>;

    getAvailability(id: string): Promise<RestaurantAvailability>;
}
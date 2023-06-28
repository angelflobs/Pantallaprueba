import RestaurantMall from '@modules/restaurants/domain/models/restaurant-mall';

export default interface RestaurantMallRepository {

    find(id: string): Promise<RestaurantMall | null>;

    findAll(): Promise<RestaurantMall[]>;
}
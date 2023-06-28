import RestaurantCategory from '@modules/restaurants/domain/models/restaurant-category';

export default interface RestaurantCategoryRepository {
    save(category: RestaurantCategory): Promise<void>;

    remove(id: string): Promise<void>;

    find(id: string): Promise<RestaurantCategory | null>;

    findAll(): Promise<RestaurantCategory[]>;
}
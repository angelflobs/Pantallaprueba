import FirestoreRestaurantRepository
    from '@modules/restaurants/infrastructure/repositories/firestore-restaurant-repository';
import FirestoreRestaurantCategoryRepository
    from '@modules/restaurants/infrastructure/repositories/firestore-restaurant-category-repository';
import FirestoreRestaurantMallRepository
    from '@modules/restaurants/infrastructure/repositories/firestore-restaurant-mall-repository';
import FirestorePromotionRepository
    from '@modules/restaurants/infrastructure/repositories/firestore-promotion-repository';
import FirestoreProductRepository from '@modules/restaurants/infrastructure/repositories/firestore-product-repository';

const AppDataProvider = (userTokenId?: string) => {
    return {
        RestaurantRepository: new FirestoreRestaurantRepository(),
        RestaurantCategoryRepository: new FirestoreRestaurantCategoryRepository(),
        RestaurantMallRepository: new FirestoreRestaurantMallRepository(),
        PromotionRepository: new FirestorePromotionRepository(),
        ProductRepository: new FirestoreProductRepository()
    };
};

export default AppDataProvider;

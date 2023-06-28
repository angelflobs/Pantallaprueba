import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import RestaurantCategoryRepository from '@modules/restaurants/domain/repositories/restaurant-category-repository';
import RestaurantCategory from '@modules/restaurants/domain/models/restaurant-category';
import ObjectUtils from '@utils/misc/object-utils';

const COLLECTION_NAME = 'restaurant-categories';

export default class FirestoreRestaurantCategoryRepository extends FirestoreApiRepository implements RestaurantCategoryRepository {

    async findAll(): Promise<RestaurantCategory[]> {
        const docs = await this.getDocs(COLLECTION_NAME, {
            filters: [
                {
                    field: 'status',
                    operator: '==',
                    value: 'ACTIVE'
                }
            ]
        });

        return docs.map(doc => {
            return {
                slug: doc.slug,
                id: doc.id,
                name: doc.name,
                status: doc.status
            };
        });
    }

    remove(id: string): Promise<void> {
        return this.updateDoc(COLLECTION_NAME, id, {
            status: 'DELETED'
        });
    }

    save(category: RestaurantCategory): Promise<void> {
        return this.saveDoc(COLLECTION_NAME, category.id, ObjectUtils.omitUnknown({
            ...category
        }));
    }

    async find(id: string): Promise<RestaurantCategory | null> {
        const doc = await this.getDoc(COLLECTION_NAME, id);
        if (!doc) return null;

        return {
            slug: doc.slug,
            id: doc.id,
            name: doc.name,
            status: doc.status
        };
    }

}
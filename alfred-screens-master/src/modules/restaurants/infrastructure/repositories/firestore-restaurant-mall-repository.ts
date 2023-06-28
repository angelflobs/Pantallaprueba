import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import RestaurantMall from '@modules/restaurants/domain/models/restaurant-mall';
import RestaurantMallRepository from '@modules/restaurants/domain/repositories/restaurant-mall-repository';

const COLLECTION_NAME = 'malls';

export default class FirestoreRestaurantMallRepository extends FirestoreApiRepository implements RestaurantMallRepository {

    async findAll(): Promise<RestaurantMall[]> {
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
                logoUrl: doc.logoUrl,
                status: doc.status
            };
        });
    }

    async find(id: string): Promise<RestaurantMall | null> {
        const doc = await this.getDoc(COLLECTION_NAME, id);
        if (!doc) return null;

        return {
            id: doc.id,
            name: doc.name,
            logoUrl: doc.logoUrl,
            status: doc.status
        };
    }
}
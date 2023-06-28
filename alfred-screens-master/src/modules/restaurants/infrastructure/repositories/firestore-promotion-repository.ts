import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import Promotion from '@modules/restaurants/domain/models/promotion';
import PromotionMapper from '@modules/restaurants/infrastructure/mappers/promotion-mapper';
import PromotionRepository from '@modules/restaurants/domain/repositories/promotion-repository';

const COLLECTION_NAME = 'promotions';

export default class FirestorePromotionRepository extends FirestoreApiRepository implements PromotionRepository {

    async findAll(filters?: any): Promise<Promotion[]> {

        const defaultFilters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            },
            {
                field: 'duration.end',
                operator: '>=',
                value: new Date()
            },
        ];

        if (filters?.mallId) {
            defaultFilters.push({
                field: 'mallsIds',
                operator: 'array-contains',
                value: filters.mallId
            });
        }


        defaultFilters.push({
            field: 'available',
            operator: '==',
            value: true
        });

        const docs = await this.getDocs(COLLECTION_NAME, {
            filters: defaultFilters
        });

        return PromotionMapper.toDomainFromArray(docs);
    }


    async find(id: string): Promise<Promotion | null> {

        const docs = await this.getDocs(COLLECTION_NAME, {
            filters: [
                {
                    field: 'status',
                    operator: '==',
                    value: 'ACTIVE'
                },
                {
                    field: 'id',
                    operator: '==',
                    value: id
                }
            ],
            limit: 1
        });

        if (docs.length == 0) return null;

        return PromotionMapper.toDomain(docs[0]);
    }


}
import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import RestaurantCategoryRepository from '@modules/restaurants/domain/repositories/restaurant-category-repository';
import RestaurantCategory from '@modules/restaurants/domain/models/restaurant-category';

type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: RestaurantCategory[];
};

export default function useFindRestaurantCategory(id: string, options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<RestaurantCategoryRepository>(
        'RestaurantCategoryRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'restaurant-categories',
            payload: {
                id
            },
            type: 'get'
        },
        () => repo.find(id),
        {
            ...options ?? {}
        }
    );

    return queryState;
}

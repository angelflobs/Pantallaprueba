import Restaurant from '@modules/restaurants/domain/models/restaurant';
import ObjectUtils from '@utils/misc/object-utils';
import FirebaseUtils from '@shared/infrastructure/firebase/firebase-utils';

export default class RestaurantMapper {
    static toDomain(dto: any): Restaurant {
        return Restaurant.fromPrimitives({
            id: dto.id,
            logoUrl: dto.logoUrl,
            coverImageUrl: dto.coverImageUrl,
            description: dto.description,
            schedule: dto.schedule ? (Object.keys(dto.schedule).reduce((acc, id) => {
                const el = dto.schedule[id];
                return {
                    ...acc,
                    [id]: {
                        ...el,
                        startHour: el?.startHour ? FirebaseUtils.getDate(el.startHour) : undefined,
                        endHour: el?.endHour ? FirebaseUtils.getDate(el.endHour) : undefined
                    }
                };
            }, {})) : undefined,
            contactPhone: dto.contactPhone,
            categoriesIds: dto.categoriesIds,
            name: dto.name,
            createdAt: FirebaseUtils.getDate(dto.createdAt),
            slug: dto.slug,
            address: dto.address,
            status: dto.status
        });
    }

    static toDomainFromArray(dtos: any[]): Restaurant[] {
        return dtos.map(dto => RestaurantMapper.toDomain(dto));
    }

    static toPersistence(restaurant: Restaurant): any {
        const dto = restaurant.toPrimitives();

        return ObjectUtils.omitUnknown({});
    }


}
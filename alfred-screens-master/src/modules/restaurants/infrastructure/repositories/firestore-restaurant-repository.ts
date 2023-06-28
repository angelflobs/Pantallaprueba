import Restaurant from '@modules/restaurants/domain/models/restaurant';
import RestaurantRepository from '@modules/restaurants/domain/repositories/restaurant-repository';
import RestaurantMapper from '@modules/restaurants/infrastructure/mappers/restaurant-mapper';
import FirestoreApiRepository from '@shared/infrastructure/firebase/firestore-api-repository';
import ArrayUtils from '@utils/misc/array-utils';
import DateTimeUtils from '@utils/misc/datetime-utils';
import AreaMapper from '@modules/restaurants/infrastructure/mappers/area-mapper';
import RestaurantAvailability from '@modules/restaurants/domain/models/restaurant-availability';

const COLLECTION_NAME = 'restaurants';
const AREAS_COLLECTION_NAME = 'restaurant-areas';
export default class FirestoreRestaurantRepository
    extends FirestoreApiRepository
    implements RestaurantRepository {
    async findAll(filters?: any): Promise<Restaurant[]> {
        const defaultFilters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            }
        ];

        if (filters?.mallId) {
            defaultFilters.push({
                field: 'address',
                operator: '==',
                value: filters.mallId
            });
        }

        if (filters?.categoryId) {
            defaultFilters.push({
                field: 'categoriesIds',
                operator: 'array-contains',
                value: filters.categoryId
            });
        }

        if (filters?.recommended) {
            defaultFilters.push({
                field: 'recommended',
                operator: '==',
                value: true
            });
        }

        if (filters?.isNew) {
            const date = new Date();
            const minDate = DateTimeUtils.startOfDay(
                DateTimeUtils.subtractDays(date, 7)
            );
            const maxDate = DateTimeUtils.endOfDay(date);

            defaultFilters.push({
                field: 'createdAt',
                operator: '>=',
                value: minDate
            });

            defaultFilters.push({
                field: 'createdAt',
                operator: '<=',
                value: maxDate
            });
        }

        if (filters.ids) {
            defaultFilters.push({
                field: 'id',
                operator: 'in',
                value: filters.ids
            });
        }

        const docs = await this.getDocs(COLLECTION_NAME, {
            filters: defaultFilters
        });

        if (filters.query && filters.query?.trim() !== '') {
            const filteredDocs = ArrayUtils.filterLike(
                docs,
                'name',
                filters.query
            );

            return RestaurantMapper.toDomainFromArray(filteredDocs);
        }

        return RestaurantMapper.toDomainFromArray(docs);
    }

    async find(id: string): Promise<Restaurant | null> {
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

        return RestaurantMapper.toDomain(docs[0]);
    }

    async getAvailability(id: string): Promise<RestaurantAvailability> {

        const tables = await this.getRestaurantTables(id);

        const nextDays = (() => {
            const days = [];

            for (let i = 0; i < 7; i++) {
                const nextDay = DateTimeUtils.addDays(new Date(), i);
                days.push(nextDay);
            }

            return days;
        })();

        const getNextHours = (startHour, endHour, duration) => {
            const finalItems = [startHour];
            const finalReservDuration = duration.hours + duration.minutes / 60;

            const range = Math.floor(Math.floor(DateTimeUtils.differenceInHours(endHour, startHour)) / finalReservDuration);

            let currItem = startHour;

            for (let i = 0; i < range; i++) {
                const nextItem = DateTimeUtils.addMinutes(
                    DateTimeUtils.addHours(
                        DateTimeUtils.fromTime(currItem), duration.hours),
                    duration.minutes
                );
                finalItems.push(nextItem);

                currItem = nextItem;
            }

            return finalItems;
        };

        const today = new Date();
        const dayHours = nextDays.reduce((acc, date) => {
            const dateName = DateTimeUtils.format(date, 'dddd').toUpperCase();
            const availableTables = tables.filter((t) => t.isAvailable(dateName));

            /* filter busy tables */

            const isToday = dateName == DateTimeUtils.format(new Date(), 'dddd').toUpperCase();

            const dayAvailableHours = ArrayUtils.orderBy(ArrayUtils.uniqBy(availableTables.flatMap((t) => ({
                start: DateTimeUtils.format(t.schedule[dateName].startHour, 'HH:mm'),
                startHour: t.schedule[dateName].startHour,
                endHour: t.schedule[dateName].endHour,
                duration: t.reservationDuration
            })), 'start'), ['startHour'], ['asc']);

            const finalSlots = dayAvailableHours.reduce((acc, current) => {

                const rangeSlots = getNextHours(current.startHour, current.endHour, current.duration).filter(el => {
                    const formatted = DateTimeUtils.fromTime(DateTimeUtils.format(el, 'HH:mm'));
                    return isToday ? !DateTimeUtils.isPast(formatted) : true;
                });

                return [
                    ...acc,
                    ...rangeSlots.map(z => {
                        return {
                            start: DateTimeUtils.format(z, 'HH:mm'),
                            startHour: z,
                            endHour: DateTimeUtils.addMinutes(
                                DateTimeUtils.addHours(
                                    DateTimeUtils.fromTime(z), current.duration.hours),
                                current.duration.minutes
                            )
                        };
                    })
                ];
            }, []);

            return { ...acc, [dateName]: finalSlots.map((s) => s.start) };
        }, {});

        return dayHours;
    }

    private async getRestaurantTables(id: string) {

        const dtos = await this.getDocs(AREAS_COLLECTION_NAME, {
            filters: [{
                field: 'restaurantId',
                operator: '==',
                value: id
            }]
        });

        if (dtos.length == 0) {
            return [];
        }

        const areas = AreaMapper.toDomainFromArray(dtos);

        return areas.flatMap((a) => a.tables);
    }
}

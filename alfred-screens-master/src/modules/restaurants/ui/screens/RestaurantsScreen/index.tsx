import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import AppLayout from '@main-components/Layout/AppLayout';
import NoItems from '@main-components/Secondary/NoItems';
import useFindRestaurants from '@modules/restaurants/application/use-find-restaurants';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import RestaurantItem from '@modules/restaurants/ui/components/RestaurantItem';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import { Skeleton } from '@main-components/Base/Skeleton';

export default function RestaurantsScreen() {

    const { data: restaurants, loading, isRefetching, refetch } = useFindRestaurants({});

    useFocusEffect(() => {
        // refetch();
    });

    return (
            <AppLayout
                    title={'Restaurantes'}
                    loading={loading}
            >
                <Box
                        flex={1}
                        bg={'white'}
                >
                    <RestaurantsList
                            loading={loading}
                            restaurants={restaurants ?? []}
                    />
                </Box>
            </AppLayout>
    );
}

function RestaurantsList({
    loading,
    restaurants
}: {
    loading: boolean;
    restaurants: Restaurant[];
}) {

    const { navigate } = useNavigation();

    if (!loading && restaurants.length == 0) {
        return (
                <NoItems
                        title={'Sin novedades...'}
                        icon={
                            <Icon
                                    name={'list'}
                                    type={'feather'}
                                    color={'greyMain'}
                                    numberSize={100}
                            />
                        }
                />
        );
    }

    if (loading) {
        return (
                <GridContainer>
                    {
                        [...new Array(10)].map(el => {
                            return (
                                    <Box marginHorizontal={'m'}>
                                        <Skeleton
                                                loading
                                                type={'rectangle'}
                                                height={'100%'}
                                                style={{

                                                    aspectRatio: 1 / 1,
                                                    borderRadius: 20
                                                }}
                                        />
                                    </Box>

                            );
                        })
                    }
                </GridContainer>
        );
    }

    return (
            <GridContainer>
                {
                    restaurants?.map((r) => {
                        return (
                                <RestaurantItem
                                        item={r}
                                        onPress={() => {
                                            navigate('restaurants/[id]', {
                                                id: r.id
                                            });
                                        }}
                                />
                        );
                    })
                }
            </GridContainer>
    );

}

function GridContainer({ children }) {
    return (
            <Box
                    paddingVertical={'l'}
                    bg={'white'}
                    /*  paddingHorizontal={'xl'}*/
                    style={{
                        display: 'grid',
                        gap: '1em',
                        gridTemplateColumns: `repeat(auto-fill, minmax(350px, 1fr))`
                    }}
            >
                {children}
            </Box>
    );
}


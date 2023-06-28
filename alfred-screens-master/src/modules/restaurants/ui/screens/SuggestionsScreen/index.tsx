import AppLayout from '@main-components/Layout/AppLayout';
import useFindRestaurants from '@modules/restaurants/application/use-find-restaurants';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import { Box } from '@main-components/Base/Box';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import NoItems from '@main-components/Secondary/NoItems';
import { Icon } from '@main-components/Base/Icon';
import { Skeleton } from '@main-components/Base/Skeleton';
import RestaurantItem from '@modules/restaurants/ui/components/RestaurantItem';
import Text from '@main-components/Typography/Text';

export default function SuggestionsScreen() {
    const { data: restaurants, loading, isRefetching, refetch } = useFindRestaurants({
        recommended: true
    });

    useFocusEffect(() => {
        // refetch();
    });

    return (
            <AppLayout
                    title={'Nuevos'}
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
                <Box>
                    <Title />
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
                </Box>

        );
    }

    return (
            <Box>
                <Title />
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
            </Box>

    );

}

function Title() {
    return (
            <Box
                    marginHorizontal={'xl'}
                    marginVertical={'m'}
            >
                <Text
                        bold
                        variant={'heading1'}
                >
                    Nuestra recomendación:
                </Text>
            </Box>
    );
}

function GridContainer({ children }) {
    return (
            <Box
                    paddingVertical={'l'}
                    bg={'white'}
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
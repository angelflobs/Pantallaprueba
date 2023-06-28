import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import AppLayout from '@main-components/Layout/AppLayout';
import NoItems from '@main-components/Secondary/NoItems';
import useFindRestaurants from '@modules/restaurants/application/use-find-restaurants';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import RestaurantItem from '@modules/restaurants/ui/components/RestaurantItem';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import { Skeleton } from '@main-components/Base/Skeleton';
import useParams from '@shared/domain/hooks/navigation/use-params';
import Text from '@main-components/Typography/Text';
import { Button } from '@main-components/Base/Button';

export default function SearchScreen() {

    const params = useParams();

    const { data: restaurants, loading, isRefetching, refetch } = useFindRestaurants({
        query: params?.query
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
                            query={params?.query}
                            restaurants={restaurants ?? []}
                    />
                </Box>
            </AppLayout>
    );
}

function RestaurantsList({
    loading,
    query,
    restaurants
}: {
    query: string;
    loading: boolean;
    restaurants: Restaurant[];
}) {

    const { navigate, goBack } = useNavigation();

    if (!loading && restaurants.length == 0) {
        return (
                <Box flex={1}>
                    <NoItems
                            title={'Sin resultados...'}
                            icon={
                                <Icon
                                        name={'search'}
                                        type={'feather'}
                                        color={'greyMain'}
                                        numberSize={100}
                                />
                            }
                            actions={
                                <Box mt={'m'}>
                                    <Button
                                            onPress={() => {
                                                goBack();
                                            }}
                                            icon={() => {
                                                return <Icon
                                                        name={'chevron-left'}
                                                        numberSize={20}
                                                />;
                                            }}
                                            title={'Regresar'}
                                    />
                                </Box>
                            }
                    />

                </Box>
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
            <Box>
                <Box pl={'l'}>
                    <Text variant={'heading1'}>Resultados para: <Text
                            variant={'heading1'}
                            bold
                    >{query}</Text></Text>
                </Box>
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

function GridContainer({ children }) {
    return (
            <Box
                    p={'l'}
                    bg={'white'}
                    paddingHorizontal={'xl'}
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


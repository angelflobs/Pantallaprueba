import { Box } from '@main-components/Base/Box';
import AppLayout from '@main-components/Layout/AppLayout';
import Text from '@main-components/Typography/Text';
import { Icon } from '@main-components/Base/Icon';
import useFindRestaurantCategories from '@modules/restaurants/application/categories/use-find-restaurant-categories';
import RestaurantCategory from '@modules/restaurants/domain/models/restaurant-category';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import NoItems from '@main-components/Secondary/NoItems';
import { ActivityIndicator } from '@main-components/Base/ActivityIndicator';
import { useTheme } from '@shared/ui/theme/AppTheme';
import RestaurantCategoryList from '@modules/restaurants/ui/screens/CategoriesScreen/components/RestaurantCategoryList';

export default function CategoriesScreen() {

    const { data: categories, loading, isRefetching, refetch } = useFindRestaurantCategories();

    useFocusEffect(() => {
        // refetch();
    });

    return (
            <AppLayout
                    title={'Categorías'}
                    loading={loading || isRefetching}
            >
                <Box
                        flex={1}
                        bg={'white'}

                >
                    <CategoriesList
                            loading={loading}
                            categories={categories ?? []}
                    />
                </Box>
            </AppLayout>
    );
}

function CategoriesList({
    loading,
    categories
}: { loading: boolean; categories: RestaurantCategory[] }) {

    const theme = useTheme();

    if (!loading && categories.length == 0) {
        return (
                <NoItems
                        title={'Ops. Aún no hay restaurantes'}
                        icon={<Icon
                                name={'category'}
                                type={'material'}
                                color={'greyMain'}
                                numberSize={100}
                        />}
                />
        );
    }

    return (
            <Box
                    flex={1}
                    p={'s'}
                    mt={'l'}
                    style={{
                        overflow: 'auto'
                    }}
            >

                {
                    loading ? (
                            <Box
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    flex={1}
                            >
                                <ActivityIndicator size={50} />
                            </Box>
                    ) : (
                            categories?.map(c => {
                                return (
                                        <Box mb={'l'}>
                                            <Box
                                                    style={{
                                                        width: 'fit-content'
                                                    }}
                                                    mb={'l'}
                                            >
                                                <Text
                                                        bold
                                                        variant={'heading2'}
                                                >{c.name}</Text>
                                                <Box
                                                        style={{
                                                            height: 10,
                                                            backgroundImage: `linear-gradient(to left, ${theme.colors.contrastMain},${theme.colors.contrastLight}) `
                                                        }}
                                                />

                                            </Box>

                                            <Box>
                                                <RestaurantCategoryList categoryId={c.id} />
                                            </Box>
                                        </Box>
                                );
                            })
                    )
                }
            </Box>

    );
}


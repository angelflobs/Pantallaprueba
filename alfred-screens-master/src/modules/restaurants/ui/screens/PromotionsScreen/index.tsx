import AppLayout from '@main-components/Layout/AppLayout';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import { Box } from '@main-components/Base/Box';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import NoItems from '@main-components/Secondary/NoItems';
import { Icon } from '@main-components/Base/Icon';
import { Skeleton } from '@main-components/Base/Skeleton';
import useFindPromotions from '@modules/restaurants/application/promotions/use-find-promotions';
import Promotion from '@modules/restaurants/domain/models/promotion';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { Image } from '@main-components/Base/Image';
import { Grow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Modal, ModalProps } from '@main-components/Base/Modal';
import { useTheme } from '@shared/ui/theme/AppTheme';
import useFindPromotion from '@modules/restaurants/application/promotions/use-find-promotion';
import { ActivityIndicator } from '@main-components/Base/ActivityIndicator';
import Text from '@main-components/Typography/Text';
import { Button } from '@main-components/Base/Button';
import DateTimeUtils from '@utils/misc/datetime-utils';
import useFindRestaurant from '@modules/restaurants/application/use-find-restaurant';
import useParams from '@shared/domain/hooks/navigation/use-params';
import useFindConfigurations from '@modules/restaurants/application/config/use-find-configurations';
import useFindRestaurants from '@modules/restaurants/application/use-find-restaurants';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import ArrayUtils from '@utils/misc/array-utils';

export default function PromotionsScreen() {

    const params = useParams();
    const { data: config, loading: loadingConfig, refetch: refetchConfig } = useFindConfigurations();
    const { data: items, loading, isRefetching, refetch } = useFindPromotions({
        mallId: params?.mall == 'current' ? config?.mallId : undefined
    });

    const ids = ArrayUtils.uniq(items?.map(el => el.restaurantId) ?? []);
    const { data: restaurants, loading: loadingRestaurants } = useFindRestaurants({
        ids: ids
    }, {
        enabled: ids.length > 0
    });

    useFocusEffect(() => {
        /* refetch();
         refetchConfig();*/
    });

    return (
            <AppLayout
                    title={''}
                    loading={loading || loadingConfig || loadingRestaurants}
            >
                <Box
                        flex={1}
                        bg={'white'}
                >

                    <PromotionsList
                            loading={loading}
                            items={items ?? []}
                            restaurants={restaurants}
                    />
                </Box>
            </AppLayout>
    );
}


function PromotionsList({
    loading,
    restaurants,
    items
}: {
    restaurants: Restaurant[],
    loading: boolean;
    items: Promotion[];
}) {

    const { navigate } = useNavigation();

    const [itemId, setItemId] = useState(null);

    if (!loading && items.length == 0) {
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
                    <GridContainer>
                        {
                            [...new Array(10)].map((el, idx) => {
                                return (
                                        <Box
                                                key={idx}
                                                maxWidth={'70%'}
                                                width={'100%'}
                                                marginHorizontal={'m'}
                                                alignSelf={idx % 2 == 0 ? 'flex-start' : 'flex-end'}
                                        >
                                            <Skeleton
                                                    loading
                                                    type={'rectangle'}
                                                    height={'100%'}
                                                    style={{
                                                        aspectRatio: 3 / 1,
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
                <GridContainer>
                    {
                        items?.map((r, idx) => {
                            const restaurant = restaurants?.find(l => l.id == r.restaurantId);
                            const isEven = idx % 2 == 0;
                            return (
                                    <Box
                                            key={idx}
                                            maxWidth={'70%'}
                                            width={'100%'}
                                            alignSelf={idx % 2 == 0 ? 'flex-start' : 'flex-end'}
                                    >
                                        <PromoItem
                                                restaurant={restaurant}
                                                item={r}
                                                direction={isEven ? 'row' : 'row-reverse'}
                                                onPress={() => {
                                                    setItemId(r.id);
                                                }}
                                        />
                                    </Box>

                            );
                        })
                    }
                </GridContainer>

                <PromotionDetailsModal
                        itemId={itemId}
                        visible={!!itemId}
                        onDismiss={() => {
                            setItemId(null);
                        }}
                />
            </Box>

    );
}

function PromotionDetailsModal(props: Partial<ModalProps> & { itemId: string }) {

    const { data: promotion, loading } = useFindPromotion(props.itemId, {
        enabled: !!props.itemId
    });
    const { data: restaurant, loading: loadingRestaurant } = useFindRestaurant(promotion?.restaurantId ?? '', {
        enabled: !!promotion?.restaurantId
    });
    const theme = useTheme();
    const { navigate } = useNavigation();
    const isLoading = loadingRestaurant || loading;

    return (
            <Modal
                    containerStyle={{}}
                    contentContainerStyle={{
                        boxShadow: 'none',
                        backgroundColor: 'white',
                        top: 'calc(50% - 250px)',
                        maxWidth: 800
                    }}
                    visible={props.visible}
                    onDismiss={props.onDismiss}
            >
                <Box
                        height={500}
                        flexDirection={'row'}
                >
                    {
                        isLoading ? (
                                <Box
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        flex={1}
                                >
                                    <ActivityIndicator size={'large'} />
                                </Box>
                        ) : (
                                <Box flex={1}>
                                    <Image
                                            resizeMode={'cover'}
                                            style={{
                                                borderRadius: 20,
                                                aspectRatio: 3 / 1
                                            }}
                                            source={{
                                                uri: promotion?.imageUrl
                                            }}
                                    />

                                    <Box mt={'m'}>
                                        <Text
                                                variant={'heading3'}
                                                bold
                                        >{promotion?.name}</Text>
                                    </Box>

                                    <Box mt={'m'}>
                                        <Text>{promotion?.description}</Text>
                                    </Box>

                                    <Box
                                            mt={'m'}
                                            flexDirection={'row'}
                                            alignItems={'center'}
                                    >
                                        <Text bold>Restaurante:</Text>
                                        <Box ml={'s'}><Text>{restaurant?.name}</Text></Box>
                                    </Box>

                                    <Box mt={'m'}>
                                        {
                                            promotion?.isAvailable ? (
                                                    <Box
                                                            p={'s'}
                                                            paddingHorizontal={'m'}
                                                            borderRadius={440}
                                                            style={{
                                                                width: 'fit-content'
                                                            }}
                                                            bg={'appSuccess'}
                                                    >
                                                        <Text color={'white'}>¡Promoción disponible!</Text>
                                                    </Box>
                                            ) : (
                                                    <Box
                                                            borderRadius={440}
                                                            style={{
                                                                width: 'fit-content'
                                                            }}
                                                            p={'s'}
                                                            paddingHorizontal={'m'}
                                                            bg={'dangerMain'}
                                                    >
                                                        <Text color={'white'}>Promoción caducada</Text>
                                                    </Box>
                                            )
                                        }
                                        {
                                                promotion?.isAvailable && (
                                                        <Box mt={'s'}>
                                                            <Text>* Promoción válida hasta
                                                                el <Text bold>{DateTimeUtils.format(promotion.endDate, 'DD/MM/YYYY')}</Text></Text>
                                                        </Box>
                                                )
                                        }
                                    </Box>

                                    <Box
                                            mt={'m'}
                                            flex={1}
                                            alignItems={'center'}
                                            justifyContent={'flex-end'}
                                    >
                                        <Button
                                                onPress={() => {
                                                    props.onDismiss?.();
                                                }}
                                                icon={() => (
                                                        <Icon
                                                                numberSize={20}
                                                                name={'close'}
                                                                color={'black'}
                                                                type={'ionicon'}
                                                        />
                                                )}
                                                backgroundColor={'greyLightest'}
                                                titleColor={'black'}
                                                title={'Cerrar'}
                                        />
                                    </Box>

                                </Box>
                        )
                    }

                </Box>

            </Modal>
    );
}

function PromoItem({ item, restaurant, direction, onPress }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    return (
            <Grow in={show}>
                <div>
                    <Box
                            borderRadius={20}
                            bg={'greyLightest'}
                            marginHorizontal={'m'}
                    >
                        <TouchableOpacity
                                onPress={onPress}
                        >
                            <Box>

                                <Image
                                        resizeMode={'cover'}
                                        style={{
                                            borderRadius: 20,
                                            aspectRatio: 3 / 1
                                        }}
                                        source={{
                                            uri: item?.imageUrl
                                        }}
                                />
                                <OverlayItem />
                                <Box
                                        position={'absolute'}
                                        height={'100%'}
                                        width={'100%'}
                                        flexDirection={direction}
                                >
                                    <Box>
                                        <Box
                                                width={'100%'}
                                                height={'100%'}
                                                style={{
                                                    borderRadius: 20,
                                                    aspectRatio: 1 / 1
                                                }}
                                        >
                                            <Image
                                                    resizeMode={'cover'}
                                                    style={{
                                                        borderRadius: 20,
                                                        aspectRatio: 1 / 1
                                                    }}
                                                    source={{
                                                        uri: restaurant?.logoUrl
                                                    }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box
                                            flex={1}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                    >
                                        <Text
                                                bold
                                                variant={'heading1'}
                                                color={'white'}
                                        >{item?.name}</Text>

                                        <Box mt={'m'}>
                                            <Text
                                                    variant={'body'}
                                                    color={'white'}
                                            >{item?.description} </Text>
                                        </Box>
                                    </Box>
                                </Box>

                            </Box>
                        </TouchableOpacity>
                    </Box>
                </div>
            </Grow>
    );
}

function OverlayItem() {
    return (
            <Box
                    borderRadius={20}
                    position={'absolute'}
                    width={'100%'}
                    height={'100%'}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
            >

            </Box>
    );
}

function GridContainer({ children }) {
    return (
            <Box
                    paddingVertical={'l'}
                    bg={'white'}
                    gap={'xxl'}
                    /*        paddingHorizontal={'xl'}*/
                    /* style={{
                         display: 'grid',
                         gap: '1em',
                         gridTemplateColumns: `repeat(auto-fill, minmax(350px, 1fr))`
                     }}*/
            >
                {children}
            </Box>
    );
}
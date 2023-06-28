import { Box } from '@main-components/Base/Box';
import React, { useEffect, useState } from 'react';
import { Theme, useTheme } from '@modules/_shared/ui/theme/AppTheme';
import { useUpdateNavigationTitle } from '@shared/ui/navigation/useUpdateNavigationTitle';
import AppMenu, { APP_MENU_HEIGHT, SPACE_BAR_HEIGHT } from '@modules/restaurants/ui/components/AppMenu';
import { ProgressBar } from '@main-components/Base/ProgressBar';
import { IconButton } from '@main-components/Base/IconButton';
import { Modal, ModalProps } from '@main-components/Base/Modal';
import BaseTextInput from '@main-components/Form/inputs/TextInput/components/BaseTextInput/BaseTextInput';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import Text from '@main-components/Typography/Text';
import useFindRestaurantMall from '@modules/restaurants/application/malls/use-find-restaurant-mall';
import useFindConfigurations from '@modules/restaurants/application/config/use-find-configurations';
import RestaurantMall from '@modules/restaurants/domain/models/restaurant-mall';
import { usePathname } from 'expo-router';
import { Icon } from '@main-components/Base/Icon';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import useDimensions from '@utils/hooks/useDimensions';
import { ListItem } from '@main-components/Base/List';
import useFindRestaurants from '@modules/restaurants/application/use-find-restaurants';
import { Image } from '@main-components/Base/Image';
import { useSwipeable } from 'react-swipeable';

interface AppLayoutProps {
    children: JSX.Element;
    bg?: keyof Theme['colors'];
    title?: string;
    loading?: boolean;
    headerBgColor?: string;
    LoadingComponent?: JSX.Element;
}

const MIN_TRANS = 200;
const MAIN_MENU_WIDTH = 100;

export default function AppLayout(props: AppLayoutProps) {
    const theme = useTheme();

    useUpdateNavigationTitle(props.title ?? '');
    const route = usePathname();
    const { navigate, goBack } = useNavigation();

    const items = ['/', '/categories', '/promotions', '/news', '/suggestions'];
    const index = items.indexOf(route);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (index + 1 > items.length - 1) {
                navigate(items[0]);
                return;
            }
            navigate(items[index + 1]);
        },
        onSwipedRight: () => {
            if (index <= 0) {
                navigate(items[items.length - 1]);
                return;
            }
            navigate(items[index - 1]);
            return;

        },
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    return (

            <Box
                    bg={'white'}
                    testID={'app-layout'}
                    style={{
                        overflow: 'auto',
                        /* maxWidth: 1024,
                         width: '100%',*/
                        /*alignSelf: 'center',*/
                        backgroundColor: props.bg ? theme.colors[props.bg] : theme.colors.white,
                        paddingBottom: 0 /* Trial bar */,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                    }}
            >
                <TopArea {...props} />


                <BackButton />

                <div
                        {...handlers}
                        style={{
                            marginTop: SPACE_BAR_HEIGHT + APP_MENU_HEIGHT,
                            height: '100%'
                        }}
                >

                    <Box
                            flex={1}
                            height='100%'

                            p={'s'}
                            style={{
                                marginLeft: MAIN_MENU_WIDTH,
                                paddingTop: APP_MENU_HEIGHT,
                                marginRight: MAIN_MENU_WIDTH
                            }}
                            bg={props.bg ?? 'white'}
                    >

                        {props.children}

                    </Box>
                </div>

                <MainMenuController />

                <BottomIndicator
                        items={items}
                        selectedItem={route}
                />

            </Box>
    );
}

function TopArea(props) {
    return (
            <>
                <AppMenu />

                <Box
                        height={10}
                        width={'100%'}
                        zIndex={9999}

                        position={'fixed'}
                        style={{
                            top: APP_MENU_HEIGHT,
                            opacity: props.loading ? 1 : 0
                        }}
                >
                    <ProgressBar
                            borderRadius={0}
                            progress={100}
                            color={'contrastMain'}
                            indeterminate
                    />
                </Box>

            </>
    );
}

const WAIT_TIME = 5000;

function BackButton() {
    const { navigate, goBack, canGoBack } = useNavigation();

    if (!canGoBack()) {
        return <Box></Box>;
    }

    return (
            <Box
                    position={'fixed'}
                    width={MAIN_MENU_WIDTH}
                    height={'100%'}
                    left={0}
                    top={80}
                    zIndex={9999}
                    alignItems={'center'}
                    justifyContent={'center'}
            >
                <Box>
                    <IconButton
                            containerSize={60}
                            borderRadius={60 / 2}
                            backgroundColor={'primaryMain'}
                            onPress={() => {
                                goBack();
                            }}
                            iconSize={24}
                            iconName={'arrow-left'}
                            iconColor={'white'}
                    />
                </Box>
            </Box>
    );
}

function MainMenuController() {
    const [openMenu, setOpenMenu] = useState(false);

    useScrollHandler({
        onReached: () => {
            setOpenMenu(true);
        }
    });

    useEffect(() => {
        if (openMenu) {
            setTimeout(() => {
                setOpenMenu(false);
            }, WAIT_TIME);
        }
    }, [openMenu]);

    return (
            <>
                <AnimatedMenu open={openMenu} />
                <AnimatedCollapsedMenu
                        open={!openMenu}
                        onPress={() => {
                            setOpenMenu(true);
                        }}
                />
            </>
    );
}

function AnimatedMenu({ open }) {
    const dimensions = useDimensions();

    const desiredWidth = dimensions.width - MAIN_MENU_WIDTH;
    const randomWidth = useSharedValue(dimensions.width * 2);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            height: '100%',
            width: MAIN_MENU_WIDTH,
            position: 'fixed',
            top: APP_MENU_HEIGHT + SPACE_BAR_HEIGHT,
            transform: [
                {
                    translateX: withSpring(randomWidth.value, {
                        damping: 10,
                        stiffness: 100,
                        overshootClamping: true
                    })
                }
            ]
        };
    });

    useEffect(() => {
        randomWidth.value = open ? desiredWidth : dimensions.width * 2;
    }, [open]);

    return (
            <Animated.View
                    style={[{
                        backgroundColor: 'white'
                    }, animatedStyles]}
            >
                <MainMenu />
            </Animated.View>
    );
}

function AnimatedCollapsedMenu({ open, onPress }) {
    const dimensions = useDimensions();

    const desiredWidth = dimensions.width - MAIN_MENU_WIDTH + 8;
    const randomWidth = useSharedValue(dimensions.width * 2);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            height: '100%',
            top: APP_MENU_HEIGHT + SPACE_BAR_HEIGHT,
            width: MAIN_MENU_WIDTH,
            position: 'fixed',
            transform: [
                {
                    translateX: withSpring(randomWidth.value, {
                        damping: 10,
                        stiffness: 100,
                        overshootClamping: true
                    })
                }
            ]
        };
    });

    useEffect(() => {
        randomWidth.value = open ? desiredWidth : dimensions.width * 2;
    }, [open]);

    return (
            <Animated.View
                    style={[{
                        backgroundColor: 'white'
                    }, animatedStyles]}
            >
                <CollapsedMenu onPress={onPress} />
            </Animated.View>
    );
}

function CollapsedMenu({ onPress }) {
    const theme = useTheme();

    return (
            <Box
                    alignItems={'center'}
                    justifyContent={'center'}
                    position={'fixed'}
                    height={'100%'}
                    bg={'white'}
                    right={0}
                    width={MAIN_MENU_WIDTH}
            >
                <Box>
                    <TouchableOpacity onPress={onPress}>
                        <Box
                                height={200}
                                width={200}
                                right={-80}
                                borderTopLeftRadius={100}
                                borderBottomLeftRadius={100}
                                style={{
                                    paddingLeft: 80 / 2 - 10,
                                    backgroundImage: `linear-gradient(${theme.colors.contrastLight}, ${theme.colors.contrastMain}) `
                                }}
                                justifyContent={'center'}
                        >

                            <Icon
                                    numberSize={30}
                                    color={'white'}
                                    name={'chevron-left'}
                            />

                        </Box>
                    </TouchableOpacity>
                </Box>
            </Box>
    );
}

function useScrollHandler({ onReached }) {
    const scrollThreshold = 500; // Change this value as per your requirement

    useEffect(() => {
        function checkScrollDistance() {
            if (window.scrollY >= scrollThreshold) {
                onReached();
            }
        }

        setTimeout(() => {
            window.addEventListener('scroll', checkScrollDistance);
        }, 2000);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', checkScrollDistance);
        };
    }, []);

}

function BottomIndicator({ selectedItem, items }) {

    const INDICATOR_WIDTH = 250;
    return (
            <Box
                    position={'fixed'}
                    width={INDICATOR_WIDTH}
                    borderRadius={30}
                    bg={'white'}
                    paddingVertical={'s'}
                    justifyContent={'center'}
                    alignSelf={'center'}
                    bottom={20}
                    flexDirection={'row'}
                    gap={'m'}
                    style={{
                        left: `calc(50% -  ${INDICATOR_WIDTH / 2}px )`
                    }}
                    alignItems={'center'}
            >
                {
                    items?.map(el => {
                        const isSelected = el == selectedItem;
                        return (
                                <Box
                                        width={isSelected ? 40 : 30}
                                        height={isSelected ? 40 : 30}
                                        borderRadius={isSelected ? 40 / 2 : 30 / 2}
                                        bg={isSelected ? 'greyMain' : 'greyMedium'}
                                />
                        );
                    })
                }
            </Box>
    );
}


function MainMenu() {
    const theme = useTheme();
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const { navigate } = useNavigation();
    const { data: config, loading } = useFindConfigurations();
    const {
        data: mall,
        loading: loadingMall
    } = useFindRestaurantMall(config?.mallId ?? '', { enabled: !!config?.mallId });

    return (
            <Box
                    width={MAIN_MENU_WIDTH}
                    position={'fixed'}
                    height={'100%'}
                    right={0}
                    style={{
                        backgroundImage: `linear-gradient(${theme.colors.contrastMain},${theme.colors.contrastLight}) `
                    }}
                    alignItems={'center'}
                    justifyContent={'center'}
            >
                <Box gap={'xl'}>
                    <IconButton
                            iconName={'home'}
                            iconType={'feather'}
                            iconColor={'white'}
                            iconSize={35}
                            onPress={() => {
                                navigate('/');
                            }}
                    />

                    <IconButton
                            iconName={'search'}
                            iconColor={'white'}
                            iconSize={35}
                            onPress={() => {
                                setShowSearchModal(true);
                            }}
                    />

                    {
                            !!mall && (
                                    <IconButton
                                            iconName={'ios-menu-sharp'}
                                            iconType={'ionicon'}
                                            iconColor={'white'}
                                            iconSize={35}
                                            onPress={() => {
                                                setShowMenuModal(true);
                                            }}
                                    />
                            )
                    }


                </Box>

                <SearchModal
                        onSearch={() => {

                        }}
                        onDismiss={() => {
                            setShowSearchModal(false);
                        }}
                        visible={showSearchModal}
                />

                <MallMenu
                        mall={mall}
                        onDismiss={() => {
                            setShowMenuModal(false);
                        }}
                        visible={showMenuModal}
                />
            </Box>
    );
}


function MallMenu(props: Partial<ModalProps> & { mall?: RestaurantMall }) {
    const theme = useTheme();
    const { navigate } = useNavigation();

    return (
            <Modal
                    containerStyle={{}}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.primaryMain,
                        top: 'calc(50% - 200px)',
                        maxWidth: 600,
                        height: 310
                    }}
                    visible={props.visible}
                    onDismiss={props.onDismiss}
            >
                <Box
                        alignSelf={'center'}
                >
                    <Box
                            mb={'s'}
                            alignItems={'center'}
                    >
                        <Image
                                style={{
                                    width: 50,
                                    aspectRatio: 1 / 1
                                }}
                                source={{
                                    uri: props?.mall?.logoUrl
                                }}
                        />
                    </Box>
                    <Box mb={'l'}>
                        <Text
                                variant={'heading2'}
                                align={'center'}
                                color={'white'}
                                bold
                        >Plaza {props?.mall?.name}</Text>
                    </Box>
                    <Box
                            flexDirection={'column'}
                            gap={'l'}
                    >
                        <MallMenuItem
                                label={'Reservar en cualquier restaurante'}
                                onPress={() => {
                                    props.onDismiss?.();
                                    navigate('/');
                                }}
                        />
                        <MallMenuItem
                                label={'Promociones ' + props?.mall?.name}
                                onPress={() => {
                                    props.onDismiss?.();
                                    navigate('/promotions', {
                                        mall: 'current'
                                    });
                                }}
                        />
                        <MallMenuItem
                                label={'Menú principal'}
                                onPress={() => {
                                    props.onDismiss?.();
                                }}
                        />
                    </Box>

                </Box>

            </Modal>
    );
}

function MallMenuItem({ label, onPress }) {
    return (
            <TouchableOpacity onPress={onPress}>
                <Box
                        p={'m'}
                        bg={'white'}
                        borderRadius={30}
                >
                    <Text
                            align={'center'}
                            style={{
                                color: '#A77E1C'
                            }}
                    >{label}</Text>
                </Box>
            </TouchableOpacity>
    );
}

function SearchModal(props: Partial<ModalProps> & { onSearch: any }) {


    return (
            <Modal
                    containerStyle={{}}
                    contentContainerStyle={{
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                        top: '40%',

                        maxWidth: 800
                    }}
                    visible={props.visible}
                    onDismiss={props.onDismiss}
            >
                <SearchContainer
                        onCancel={() => {
                            props.onDismiss?.();
                        }}
                />
            </Modal>
    );
}

function SearchContainer({ onCancel }) {

    const theme = useTheme();
    const [query, setQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');


    const { data: restaurants, loading, isRefetching, refetch } = useFindRestaurants({
        query: searchQuery
    }, {
        enabled: searchQuery?.trim() !== ''
    });

    return (
            <>
                <Box
                        alignItems={'center'}
                        flexDirection={'row'}
                        marginHorizontal={'l'}
                >
                    <Box mr={'l'}>
                        <IconButton
                                onPress={() => {
                                    onCancel();

                                }}
                                iconSize={20}
                                containerSize={45}
                                borderRadius={30}
                                backgroundColor={'greyLight'}
                                iconName={'chevron-left'}
                                iconColor={'black'}
                        />
                    </Box>
                    <Box flex={1}>
                        <Box
                                height={80}
                                paddingHorizontal={'m'}
                                style={{
                                    backgroundColor: theme.colors.greyLight,
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    maxWidth: 800
                                }}
                                alignItems={'center'}
                                flexDirection={'row'}
                        >
                            <Box flex={1}>
                                <BaseTextInput
                                        autoFocus
                                        value={query}
                                        placeholder={'¿Qué restaurante estás buscando?'}
                                        onChangeText={el => {
                                            setQuery(el);
                                        }}
                                        style={{
                                            fontSize: 20,
                                            elevation: 0,
                                            borderWidth: 0,
                                            backgroundColor: 'transparent'
                                        }}
                                        onSubmitEditing={() => {
                                            if (query.trim().length == 0) {
                                                setSearchQuery('');
                                                return;
                                            }
                                            setSearchQuery(query);
                                        }}
                                />
                            </Box>
                            <Box>
                                <IconButton
                                        disabled={query?.trim().length == 0}
                                        iconSize={20}
                                        containerSize={45}
                                        borderRadius={30}
                                        backgroundColor={'primaryMain'}
                                        iconName={'search'}
                                        iconColor={'white'}
                                        onPress={() => {
                                            if (query.trim().length == 0) {
                                                setSearchQuery('');
                                                return;
                                            }
                                            setSearchQuery(query);
                                            // onCancel();
                                        }}
                                />
                            </Box>

                        </Box>
                    </Box>

                </Box>
                <ResultItemList
                        onClose={onCancel}
                        result={restaurants}
                        loading={loading}
                />

            </>
    );
}

function ResultItemList({ result, loading, onClose }) {
    const { navigate } = useNavigation();

    return (
            <Box
                    borderRadius={20}
                    overflow={'hidden'}
                    bg={'white'}
                    mt={'l'}
            >
                {
                        result?.length == 0 && !loading && (
                                <Box
                                        width={'100%'}
                                        bg={'white'}
                                        paddingVertical={'m'}
                                        paddingHorizontal={'m'}
                                        borderBottomWidth={1}
                                        borderBottomColor={'greyMedium'}
                                >
                                    <Text
                                            align={'center'}
                                            color={'greyMain'}
                                            variant={'heading4'}
                                    >Sin resultados...</Text>
                                </Box>
                        )
                }

                {
                        loading && (
                                <Box
                                        width={'100%'}
                                        bg={'white'}
                                        paddingVertical={'m'}
                                        paddingHorizontal={'m'}
                                        borderBottomWidth={1}
                                        borderBottomColor={'greyMedium'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                >
                                    <Box flexDirection={'row'}>
                                        <Box mr={'m'}>
                                            <Icon
                                                    name={'search'}
                                                    color={'greyMain'}
                                            />
                                        </Box>
                                        <Box>
                                            <Text
                                                    color={'greyMain'}
                                                    variant={'heading4'}
                                            >Buscando...</Text>
                                        </Box>

                                    </Box>
                                </Box>
                        )
                }

                {
                    result?.slice(0, 3).map(el => {
                        return (
                                <TouchableOpacity
                                        onPress={() => {
                                            onClose();
                                            navigate('/restaurants/[id]', {
                                                id: el.id
                                            });
                                        }}
                                        key={el.id}
                                >
                                    <Box
                                            width={'100%'}
                                            bg={'white'}
                                            paddingVertical={'s'}
                                            paddingHorizontal={'m'}
                                            borderBottomWidth={1}
                                            borderBottomColor={'greyMedium'}
                                    >
                                        <ListItem
                                                title={el?.name}
                                                titleStyle={{
                                                    fontSize: 20,
                                                    alignItems: 'center'
                                                }}
                                                style={{
                                                    justifyContent: 'center'
                                                }}
                                                left={() => {
                                                    return (
                                                            <Box
                                                                    width={90}
                                                                    height={90}
                                                            >
                                                                <Image
                                                                        source={{
                                                                            uri: el?.logoUrl
                                                                        }}
                                                                        style={{
                                                                            borderRadius: 80 / 2,
                                                                            width: 80,
                                                                            height: 80
                                                                        }}
                                                                />

                                                            </Box>
                                                    );
                                                }}
                                                right={() => {
                                                    return (
                                                            <Box>
                                                                <Icon
                                                                        name={'chevron-right'}
                                                                        color={'greyMedium'}
                                                                />
                                                            </Box>
                                                    );
                                                }}
                                        />

                                    </Box>
                                </TouchableOpacity>
                        );
                    })
                }
            </Box>
    );
}
import { Box } from '@main-components/Base/Box';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { usePathname } from 'expo-router';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';

export const SPACE_BAR_HEIGHT = 0;
export const APP_MENU_HEIGHT = 80;

export default function AppMenu() {

    const route = usePathname();
    const { navigate } = useNavigation();

    const handlePress = (id) => {
        navigate(id);
    };

    return (
            <>
                <Box
                        position={'fixed'}
                        width={'100%'}
                        zIndex={'999'}
                        style={{
                            height: SPACE_BAR_HEIGHT,
                            backgroundColor: 'white'
                        }}
                />
                <Box
                        position={'fixed'}
                        width={'100%'}
                        zIndex={'999'}
                        height={APP_MENU_HEIGHT}
                        top={SPACE_BAR_HEIGHT}
                        bg={'primaryMain'}
                        justifyContent={'center'}
                        flexDirection={'row'}
                        alignItems={'center'}
                        paddingHorizontal={'m'}
                >

                    <MenuItem
                            id={'/'}
                            selected={route == '/'}
                            title={'Todos los restaurantes'}
                            onPress={handlePress}
                    />
                    <MenuItem
                            id={'categories'}
                            selected={route == '/categories'}
                            title={'Categorías'}
                            onPress={handlePress}
                    />
                    <MenuItem
                            id={'promotions'}
                            selected={route == '/promotions'}
                            title={'Promociones'}
                            onPress={handlePress}
                    />
                    <MenuItem
                            id={'news'}
                            selected={route == '/news'}
                            title={'Nuevos'}
                            onPress={handlePress}
                    />
                    <MenuItem
                            id={'suggestions'}
                            selected={route == '/suggestions'}
                            title={'Sugerencias'}
                            onPress={handlePress}
                    />
                </Box>
            </>
    );
}


function MenuItem({ id, selected, title, onPress }) {
    return (
            <TouchableOpacity onPress={() => onPress(id)}>
                <Box
                        alignItems={'center'}
                        justifyContent={'center'}
                        marginHorizontal={'m'}
                        padding={'m'}
                >
                    <Text
                            bold={selected}
                            color={'white'}
                    >{title}</Text>
                </Box>
            </TouchableOpacity>
    );
}



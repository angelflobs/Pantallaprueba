import { Box } from '@main-components/Base/Box';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { Image } from '@main-components/Base/Image';

export default function RestaurantItem({ item, onPress }) {
    return (
            <Box
                    borderRadius={20}
                    marginHorizontal={'m'}
            >
                <TouchableOpacity
                        onPress={onPress}
                >
                    <Image
                            resizeMode={'cover'}
                            style={{
                                borderRadius: 40,
                                aspectRatio: 1 / 1
                            }}
                            source={{
                                uri: item?.logoUrl
                            }}
                    />
                </TouchableOpacity>
            </Box>
    );
}
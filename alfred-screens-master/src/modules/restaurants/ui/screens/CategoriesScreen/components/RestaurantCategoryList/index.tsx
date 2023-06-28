import Slider from 'react-slick';
import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import { useTheme } from '@shared/ui/theme/AppTheme';
import useFindRestaurants from '@modules/restaurants/application/use-find-restaurants';
import { Skeleton } from '@main-components/Base/Skeleton';
import NoItems from '@main-components/Secondary/NoItems';
import RestaurantItem from '@modules/restaurants/ui/components/RestaurantItem';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';

export default function RestaurantCategoryList(props) {
    const categoryId = props.categoryId;

    const { data: restaurants, loading } = useFindRestaurants({
        categoryId: categoryId
    });
    const { navigate } = useNavigation();

    let settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: false,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (!loading && restaurants?.length == 0) {
        return (
                <Box>
                    <NoItems
                            icon={<Icon
                                    name={'list'}
                                    numberSize={40}
                                    color={'greyMedium'}
                            />}
                            title={'Sin restaurantes'}
                    />
                </Box>
        );
    }

    return (
            <Box width={'100%'}>
                {
                    loading ? (
                            <Slider {...settings}>
                                {[...new Array(5)].map(el => {
                                    return (
                                            <div>
                                                <Box marginHorizontal={'m'}>
                                                    <Skeleton
                                                            loading
                                                            type={'rectangle'}
                                                            height={'100%'}
                                                            style={{
                                                                borderRadius: 40,
                                                                aspectRatio: 1 / 1
                                                            }}
                                                    />
                                                </Box>
                                            </div>

                                    );
                                })}
                            </Slider>
                    ) : (
                            <Slider {...settings}>
                                {
                                    restaurants?.map((item, index) => {
                                        return (
                                                <div>
                                                    <RestaurantItem
                                                            item={item}
                                                            onPress={() => {
                                                                navigate('restaurants/[id]', {
                                                                    id: item.id
                                                                });
                                                            }}
                                                    />
                                                </div>
                                        );
                                    })
                                }
                            </Slider>
                    )
                }

            </Box>
    );
}


function NextArrow(props) {
    const theme = useTheme();
    const { className, style, onClick } = props;
    return (
            <div
                    className={className}
                    style={{
                        ...style,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: 50 / 2,
                        background: theme.colors.secondaryMain
                    }}
                    onClick={onClick}
            >
                <Icon
                        name={'chevron-right'}
                        color={'white'}
                />
            </div>
    );
}

function PrevArrow(props) {
    const theme = useTheme();
    const { className, style, onClick } = props;
    return (
            <div
                    className={className}
                    style={{
                        ...style,
                        display: 'flex',
                        zIndex: 9999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: 50 / 2,
                        background: theme.colors.secondaryMain
                    }}
                    onClick={onClick}
            >
                <Icon
                        name={'chevron-left'}
                        color={'white'}
                />
            </div>
    );
}
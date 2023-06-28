import { Box } from '@main-components/Base/Box';
import Text from '@main-components/Typography/Text';
import { Form } from '@main-components/Form/Form';
import RestaurantMallSelectInput from '@modules/restaurants/ui/components/RestaurantMallSelectInput';
import { required } from '@shared/domain/form/validate';
import useSaveConfigurations from '@modules/restaurants/application/config/use-save-configurations';
import useNotify from '@shared/domain/hooks/use-notify';
import useFindConfigurations from '@modules/restaurants/application/config/use-find-configurations';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';

export default function ConfigRoute() {
    const { execute, loading: saving } = useSaveConfigurations();
    const notify = useNotify();
    const { data: config, loading } = useFindConfigurations();
    const { navigate } = useNavigation();

    return (
            <Box
                    bg={'greyLightest'}
                    flex={1}
                    alignItems={'center'}
                    justifyContent={'center'}
            >
                <Text
                        align={'center'}
                        bold
                >Configuraciones</Text>

                <Box
                        mt={'m'}
                        height={230}
                        bg={'white'}
                        borderRadius={20}
                        p={'l'}
                        width={'100%'}
                        maxWidth={300}
                >


                    <Box mt={'m'}>

                        <Form
                                defaultValues={{
                                    ...config ?? {}
                                }}
                                onSubmit={async (values) => {
                                    await execute(values);
                                    notify('Guardado exitosamente', 'success');

                                    setTimeout(() => {
                                        navigate('/');
                                    }, 1000);
                                }}
                                saveButtonProps={{
                                    loading: saving,
                                    label: 'Guardar'
                                }}
                        >
                            <RestaurantMallSelectInput
                                    label={'Plaza'}
                                    required
                                    validate={required()}
                                    source={'mallId'}
                            />
                        </Form>
                    </Box>

                </Box>
            </Box>
    );
}
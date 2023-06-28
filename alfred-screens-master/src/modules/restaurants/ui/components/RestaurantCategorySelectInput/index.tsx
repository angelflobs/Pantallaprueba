import SelectInput, { SelectInputProps } from '@main-components/Form/inputs/SelectInput';
import useFindRestaurantCategories from '@modules/restaurants/application/categories/use-find-restaurant-categories';

interface RestaurantCategorySelectInputProps extends Omit<SelectInputProps, 'choices'> {

}

export default function RestaurantCategorySelectInput(props: RestaurantCategorySelectInputProps) {
    const { data, loading } = useFindRestaurantCategories();

    return (
            <SelectInput
                    {...props}
                    choices={data?.map(e => {
                        return {
                            id: e.id,
                            label: e.name,
                            name: e.name
                        };
                    })}
            />
    );
}
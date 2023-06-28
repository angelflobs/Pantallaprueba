import Product from '@modules/restaurants/domain/models/product';

export default interface ProductRepository {

    find(id: string): Promise<Product | null>;

    findAll(filters: any): Promise<Product[]>;
}
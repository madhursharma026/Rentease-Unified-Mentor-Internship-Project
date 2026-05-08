import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProductInput, ProductFilterInput } from './dto/product.inputs';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}

  async findAll(filter: ProductFilterInput) {
    const page = filter.page || 1;
    const limit = filter.limit || 12;
    const qb = this.products.createQueryBuilder('product').where('product.isActive = :isActive', { isActive: true });
    if (filter.category) qb.andWhere('product.category = :category', { category: filter.category });
    if (filter.search) qb.andWhere('(product.name LIKE :search OR product.description LIKE :search)', { search: `%${filter.search}%` });
    if (filter.minRent !== undefined) qb.andWhere('product.monthlyRent >= :minRent', { minRent: filter.minRent });
    if (filter.maxRent !== undefined) qb.andWhere('product.monthlyRent <= :maxRent', { maxRent: filter.maxRent });
    const [items, total] = await qb.orderBy('product.createdAt', 'DESC').skip((page - 1) * limit).take(limit).getManyAndCount();
    return { items, total, page, limit };
  }

  async findBySlug(slug: string) {
    const product = await this.products.findOne({ where: { slug } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(input: ProductInput) {
    const slug = this.slugify(input.name);
    return this.products.save(this.products.create({ ...input, slug }));
  }

  async update(id: string, input: ProductInput) {
    const product = await this.products.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, input, { slug: this.slugify(input.name) });
    return this.products.save(product);
  }

  async reduceInventory(id: string) {
    const product = await this.products.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    product.inventoryCount = Math.max(product.inventoryCount - 1, 0);
    return this.products.save(product);
  }

  async searchNames(search: string) {
    return this.products.find({ where: { name: Like(`%${search}%`) }, take: 8 });
  }

  private slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}

import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { Category, Role } from '../common/enums';
import { MaintenanceRequest } from '../maintenance/maintenance-request.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { Rental } from '../rentals/rental.entity';
import { User } from '../users/user.entity';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'renteasedb',
  entities: [User, Product, Order, OrderItem, Rental, MaintenanceRequest],
  synchronize: true
});

const products = [
  {
    name: 'Nordic Three Seater Sofa',
    category: Category.FURNITURE,
    description: 'Compact upholstered sofa with stain-resistant fabric, ideal for city apartments.',
    monthlyRent: 1299,
    deposit: 2999,
    tenureOptions: [3, 6, 12],
    inventoryCount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Velvet Lounge Chair',
    category: Category.FURNITURE,
    description: 'Accent lounge chair with a deep cushioned seat and premium velvet finish.',
    monthlyRent: 749,
    deposit: 1799,
    tenureOptions: [3, 6, 12],
    inventoryCount: 16,
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Queen Storage Bed',
    category: Category.FURNITURE,
    description: 'Hydraulic queen bed with under-bed storage and engineered wood frame.',
    monthlyRent: 999,
    deposit: 2499,
    tenureOptions: [6, 12, 18],
    inventoryCount: 10,
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Four Seat Dining Table',
    category: Category.FURNITURE,
    description: 'Solid wood dining table set with four upholstered chairs for compact homes.',
    monthlyRent: 899,
    deposit: 2199,
    tenureOptions: [3, 6, 12],
    inventoryCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Work From Home Desk',
    category: Category.FURNITURE,
    description: 'Ergonomic study desk with cable channel, storage drawer, and durable top.',
    monthlyRent: 599,
    deposit: 1499,
    tenureOptions: [3, 6, 12],
    inventoryCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Executive Office Chair',
    category: Category.FURNITURE,
    description: 'Adjustable office chair with lumbar support and breathable mesh back.',
    monthlyRent: 499,
    deposit: 1199,
    tenureOptions: [3, 6, 12],
    inventoryCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1505843490701-5be5d8d62f7f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Compact TV Unit',
    category: Category.FURNITURE,
    description: 'Modern entertainment unit with shelves for set-top boxes and decor.',
    monthlyRent: 649,
    deposit: 1499,
    tenureOptions: [6, 12, 18],
    inventoryCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Six Door Wardrobe',
    category: Category.FURNITURE,
    description: 'Spacious wardrobe with hanging space, shelves, and smooth hinges.',
    monthlyRent: 1299,
    deposit: 2999,
    tenureOptions: [6, 12, 24],
    inventoryCount: 7,
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Coffee Table Set',
    category: Category.FURNITURE,
    description: 'Minimal coffee table with nesting side table for living rooms.',
    monthlyRent: 399,
    deposit: 999,
    tenureOptions: [3, 6, 12],
    inventoryCount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Bookshelf Display Rack',
    category: Category.FURNITURE,
    description: 'Tall open bookshelf for books, plants, and work-from-home essentials.',
    monthlyRent: 449,
    deposit: 1099,
    tenureOptions: [3, 6, 12],
    inventoryCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Smart Inverter Refrigerator',
    category: Category.APPLIANCES,
    description: 'Double-door energy efficient refrigerator with quick cooling and stabilizer-free operation.',
    monthlyRent: 1499,
    deposit: 3499,
    tenureOptions: [6, 12, 24],
    inventoryCount: 9,
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Front Load Washing Machine',
    category: Category.APPLIANCES,
    description: 'Fully automatic washing machine with steam wash and low-noise motor.',
    monthlyRent: 1199,
    deposit: 2999,
    tenureOptions: [3, 6, 12],
    inventoryCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Split Air Conditioner 1.5 Ton',
    category: Category.APPLIANCES,
    description: 'Energy efficient split AC with copper condenser and fast cooling.',
    monthlyRent: 1899,
    deposit: 4499,
    tenureOptions: [6, 12, 24],
    inventoryCount: 6,
    imageUrl: 'https://images.unsplash.com/photo-1631545806609-4b4b3f789160?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Convection Microwave Oven',
    category: Category.APPLIANCES,
    description: 'Compact convection microwave suitable for baking, grilling, and reheating.',
    monthlyRent: 699,
    deposit: 1599,
    tenureOptions: [3, 6, 12],
    inventoryCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Water Purifier RO UV',
    category: Category.APPLIANCES,
    description: 'Multi-stage RO and UV water purifier with compact kitchen fit.',
    monthlyRent: 549,
    deposit: 1299,
    tenureOptions: [6, 12, 24],
    inventoryCount: 17,
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Induction Cooktop',
    category: Category.APPLIANCES,
    description: 'Portable induction cooktop with preset cooking modes and safety cut-off.',
    monthlyRent: 299,
    deposit: 799,
    tenureOptions: [3, 6, 12],
    inventoryCount: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Dishwasher Compact',
    category: Category.APPLIANCES,
    description: 'Countertop dishwasher for small families with multiple wash programs.',
    monthlyRent: 1399,
    deposit: 3299,
    tenureOptions: [6, 12, 24],
    inventoryCount: 5,
    imageUrl: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Smart LED Television 43 Inch',
    category: Category.APPLIANCES,
    description: 'Full HD smart TV with streaming apps and wall-mount option.',
    monthlyRent: 1099,
    deposit: 2699,
    tenureOptions: [3, 6, 12],
    inventoryCount: 11,
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Room Heater Premium',
    category: Category.APPLIANCES,
    description: 'Portable room heater with thermostat control and overheat protection.',
    monthlyRent: 349,
    deposit: 899,
    tenureOptions: [3, 6, 12],
    inventoryCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Air Purifier HEPA',
    category: Category.APPLIANCES,
    description: 'HEPA air purifier for bedrooms and home offices with quiet night mode.',
    monthlyRent: 799,
    deposit: 1999,
    tenureOptions: [3, 6, 12],
    inventoryCount: 13,
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1200&q=80'
  }
];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function seed() {
  await dataSource.initialize();
  const users = dataSource.getRepository(User);
  const productRepo = dataSource.getRepository(Product);
  const adminEmail = 'admin@rentease.local';
  const existingAdmin = await users.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await users.save(
      users.create({
        name: 'RentEase Admin',
        email: adminEmail,
        passwordHash: await bcrypt.hash('Admin@12345', 12),
        role: Role.ADMIN
      })
    );
  }
  for (const item of products) {
    const slug = slugify(item.name);
    const existing = await productRepo.findOne({ where: { slug } });
    if (!existing) await productRepo.save(productRepo.create({ ...item, slug }));
  }
  await dataSource.destroy();
}

seed().catch(async (error) => {
  console.error(error);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});

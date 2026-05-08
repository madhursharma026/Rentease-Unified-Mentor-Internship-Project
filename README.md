# RentEase - Furniture & Appliance Rental Platform

RentEase is a production-oriented full-stack rental platform built with:

- Next.js, React Bootstrap, external CSS, SSR/SSG, optimized images, SEO meta tags
- NestJS, GraphQL code-first API, TypeORM, MySQL, JWT authentication
- Modular backend domains for auth, users, products, cart, orders, rentals, maintenance, and reports

## Database

Create a MySQL database named `renteasedb`.

Backend defaults match the requested configuration:

```ts
type: 'mysql'
host: 'localhost'
port: 3306
username: 'root'
password: ''
database: 'renteasedb'
autoLoadEntities: true
```

## Setup Commands

Run each command separately.

```powershell
cd "D:\Madhur Company Projects\rentease"
```

```powershell
npm install
```

```powershell
Copy-Item backend\.env.example backend\.env
```

```powershell
Copy-Item frontend\.env.local.example frontend\.env.local
```

```powershell
npm run seed
```

```powershell
npm run dev
```

Frontend: `http://localhost:3000`

Backend GraphQL: `http://localhost:4000/graphql`

Seeded admin:

- Email: `admin@rentease.local`
- Password: `Admin@12345`

## Production Commands

Run each command separately.

```powershell
npm run build
```

```powershell
npm run start
```

## Key Features

- JWT login/register with guarded GraphQL operations
- Browse furniture and appliances with search, filtering, pagination-ready API, SSR catalog, and SSG home page
- Product detail page with rent, deposit, tenure, inventory, and optimized images
- Cart and checkout with delivery scheduling
- Customer rental dashboard with active rentals and maintenance creation
- Admin/vendor dashboard for analytics, orders, delivery status, maintenance queue, and product creation
- TypeORM entities, DTOs, services, resolvers, guards, validation pipes, and role-based access
- Reusable frontend components for layout, SEO, product cards, cart state, and dashboard flows

## Recommended Deployment Notes

- Set `NODE_ENV=production`.
- Replace `JWT_SECRET` with a strong secret.
- Disable TypeORM `synchronize` in production migrations workflow.
- Use managed MySQL or a backed-up MySQL container.
- Put the NestJS API behind HTTPS and configure `FRONTEND_URL`.
- Set `NEXT_PUBLIC_GRAPHQL_URL` to the production GraphQL endpoint.

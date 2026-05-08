import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { Button, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import { ProductCard } from '../../components/ProductCard';
import { Seo } from '../../components/Seo';
import { createApolloClient, PRODUCTS_QUERY } from '../../lib/graphql';
import { Product } from '../../types';

type ProductsProps = {
  products: Product[];
  total: number;
};

export default function Products({ products, total }: ProductsProps) {
  const router = useRouter();
  const page = Number(router.query.page || 1);
  const totalPages = Math.max(Math.ceil(total / 12), 1);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const search = String(form.get('search') || '');
    const category = String(form.get('category') || '');
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  }

  function changePage(nextPage: number) {
    const params = new URLSearchParams(router.query as Record<string, string>);
    params.set('page', String(nextPage));
    router.push(`/products?${params.toString()}`);
  }

  return (
    <>
      <Seo title="Browse furniture and appliance rentals" description="Search and filter rental-ready furniture and appliances with monthly rent, deposit, tenure, and inventory visibility." />
      <Container className="section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Catalog</p>
            <h1>Rental Catalog</h1>
            <p>{total} products ready for flexible plans.</p>
          </div>
        </div>
        <Form onSubmit={submit} className="filter-bar">
          <Form.Control name="search" placeholder="Search sofa, refrigerator, bed..." defaultValue={String(router.query.search || '')} />
          <Form.Select name="category" defaultValue={String(router.query.category || '')}>
            <option value="">All categories</option>
            <option value="FURNITURE">Furniture</option>
            <option value="APPLIANCES">Appliances</option>
          </Form.Select>
          <Button type="submit" variant="dark">Search</Button>
        </Form>
        <Row className="g-4">
          {products.map((product) => (
            <Col md={6} lg={4} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
        <Pagination className="mt-4">
          <Pagination.Prev disabled={page <= 1} onClick={() => changePage(page - 1)} />
          {Array.from({ length: totalPages }).map((_, index) => (
            <Pagination.Item key={index + 1} active={index + 1 === page} onClick={() => changePage(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={page >= totalPages} onClick={() => changePage(page + 1)} />
        </Pagination>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ProductsProps> = async ({ query }) => {
  try {
    const client = createApolloClient();
    const filter = {
      page: Number(query.page || 1),
      limit: 12,
      search: query.search || undefined,
      category: query.category || undefined
    };
    const { data } = await client.query({ query: PRODUCTS_QUERY, variables: { filter } });
    return { props: { products: data.products.items, total: data.products.total } };
  } catch {
    return { props: { products: [], total: 0 } };
  }
};

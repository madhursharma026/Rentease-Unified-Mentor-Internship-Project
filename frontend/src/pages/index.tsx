import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ProductCard } from '../components/ProductCard';
import { Seo } from '../components/Seo';
import { createApolloClient, PRODUCTS_QUERY } from '../lib/graphql';
import { Product } from '../types';

type HomeProps = {
  products: Product[];
};

export default function Home({ products }: HomeProps) {
  return (
    <>
      <Seo title="Flexible furniture and appliance rentals" description="Rent sofas, beds, refrigerators, washing machines, and essential home appliances with flexible tenure and delivery scheduling." />
      <section className="hero-band">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <p className="eyebrow">RentEase</p>
              <h1>Premium furniture and appliances on flexible monthly rent.</h1>
              <p className="hero-copy">Build a beautiful home without heavy upfront purchases. Choose tenure, schedule delivery, manage rentals, and request maintenance from one polished dashboard.</p>
              <div className="hero-actions">
                <Link href="/products" passHref legacyBehavior>
                  <Button as="a" variant="light" size="lg">Browse Rentals</Button>
                </Link>
                <Link href="/signup" passHref legacyBehavior>
                  <Button as="a" variant="outline-light" size="lg">Create Account</Button>
                </Link>
              </div>
            </Col>
            <Col lg={5}>
              <div className="hero-media" aria-label="Styled rented living room">
                <div className="hero-stat"><strong>20+</strong><span>curated rental items</span></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Container className="section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Featured catalog</p>
            <h2>Popular Rentals</h2>
          </div>
          <Link href="/products">View all</Link>
        </div>
        <Row className="g-4">
          {products.map((product) => (
            <Col md={6} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </Container>
      <section className="ops-band">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className="feature-icon">01</div>
              <h3>Flexible tenure</h3>
              <p>3, 6, 12, 18, and 24 month plans depending on item category and inventory policy.</p>
            </Col>
            <Col md={4}>
              <div className="feature-icon">02</div>
              <h3>Delivery scheduling</h3>
              <p>Pick a delivery date during checkout and track fulfillment from the rental dashboard.</p>
            </Col>
            <Col md={4}>
              <div className="feature-icon">03</div>
              <h3>Maintenance support</h3>
              <p>Create service requests against active rentals and let the operations team resolve them.</p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const client = createApolloClient();
    const { data } = await client.query({ query: PRODUCTS_QUERY, variables: { filter: { page: 1, limit: 4 } } });
    return { props: { products: data.products.items }, revalidate: 60 };
  } catch {
    return { props: { products: [] }, revalidate: 30 };
  }
};

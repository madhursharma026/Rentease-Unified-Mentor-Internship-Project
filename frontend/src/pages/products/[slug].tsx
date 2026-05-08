import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { Badge, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Seo } from '../../components/Seo';
import { useCart } from '../../context/CartContext';
import { createApolloClient, PRODUCT_QUERY } from '../../lib/graphql';
import { Product } from '../../types';

type ProductDetailProps = {
  product: Product | null;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [tenure, setTenure] = useState(product?.tenureOptions?.[0] || 6);
  if (!product) return <Container className="section-space"><h1>Product not found</h1></Container>;
  return (
    <>
      <Seo title={product.name} description={product.description} image={product.imageUrl} />
      <Container className="section-space">
        <Row className="g-5 align-items-start">
          <Col lg={6}>
            <div className="detail-image">
              <Image src={product.imageUrl} alt={product.name} fill priority sizes="(max-width: 992px) 100vw, 50vw" />
            </div>
          </Col>
          <Col lg={6}>
            <Badge bg={product.category === 'FURNITURE' ? 'success' : 'primary'}>{product.category}</Badge>
            <h1 className="detail-title">{product.name}</h1>
            <p className="lead">{product.description}</p>
            <div className="detail-pricing">
              <div><span>Monthly rent</span><strong>Rs. {Number(product.monthlyRent).toLocaleString('en-IN')}</strong></div>
              <div><span>Refundable deposit</span><strong>Rs. {Number(product.deposit).toLocaleString('en-IN')}</strong></div>
              <div><span>Inventory</span><strong>{product.inventoryCount} units</strong></div>
            </div>
            <Form.Group className="my-4">
              <Form.Label>Tenure</Form.Label>
              <Form.Select value={tenure} onChange={(event) => setTenure(Number(event.target.value))}>
                {product.tenureOptions.map((option) => (
                  <option value={option} key={option}>{option} months</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button size="lg" variant="dark" onClick={() => addItem(product, tenure)} disabled={product.inventoryCount < 1}>
              Add to Cart
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ProductDetailProps> = async ({ params }) => {
  try {
    const client = createApolloClient();
    const { data } = await client.query({ query: PRODUCT_QUERY, variables: { slug: params?.slug } });
    return { props: { product: data.product } };
  } catch {
    return { props: { product: null } };
  }
};

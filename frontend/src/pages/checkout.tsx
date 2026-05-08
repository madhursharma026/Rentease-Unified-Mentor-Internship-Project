import { gql } from '@apollo/client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Seo } from '../components/Seo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createApolloClient } from '../lib/graphql';

const CHECKOUT_MUTATION = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      id
      status
    }
  }
`;

export default function CheckoutPage() {
  const { token, user } = useAuth();
  const { items, clear, totalMonthlyRent, totalDeposit } = useCart();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!token) {
      setError('Please login before checkout.');
      return;
    }
    const form = new FormData(event.currentTarget);
    const client = createApolloClient(token);
    const input = {
      deliveryAddress: String(form.get('deliveryAddress')),
      deliveryDate: String(form.get('deliveryDate')),
      items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity, tenureMonths: item.tenureMonths }))
    };
    try {
      await client.mutate({ mutation: CHECKOUT_MUTATION, variables: { input } });
      clear();
      setMessage('Order placed. Your rentals are now visible in the rental dashboard.');
    } catch {
      setError('Checkout failed. Please confirm inventory is available and try again.');
    }
  }

  return (
    <>
      <Seo title="Checkout" description="Schedule delivery and complete your rental checkout." />
      <Container className="section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Secure checkout</p>
            <h1>Schedule Delivery</h1>
            <p>Confirm delivery details and place your rental order.</p>
          </div>
        </div>
        {message ? <Alert variant="success">{message}</Alert> : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}
        {!user ? (
          <Alert variant="warning">
            Please <Link href="/login">login</Link> or <Link href="/signup">create an account</Link> before checkout.
          </Alert>
        ) : null}
        <Row className="g-4">
          <Col lg={7}>
            <Form onSubmit={submit} className="surface-panel">
              <Form.Group className="mb-3">
                <Form.Label>Delivery address</Form.Label>
                <Form.Control as="textarea" name="deliveryAddress" rows={5} required minLength={10} placeholder="House number, street, city, state, PIN" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Preferred delivery date</Form.Label>
                <Form.Control type="date" name="deliveryDate" required />
              </Form.Group>
              <Button type="submit" variant="dark" disabled={!items.length || !user}>
                Place Order
              </Button>
            </Form>
          </Col>
          <Col lg={5}>
            <div className="summary-card">
              <h2>Order Summary</h2>
              {items.map((item) => (
                <div className="summary-row" key={`${item.product.id}-${item.tenureMonths}`}>
                  <span>{item.product.name}</span>
                  <strong>{item.tenureMonths} months</strong>
                </div>
              ))}
              <div className="summary-total">
                <span>Monthly rent</span>
                <strong>Rs. {totalMonthlyRent.toLocaleString('en-IN')}</strong>
              </div>
              <div className="summary-total">
                <span>Refundable deposit</span>
                <strong>Rs. {totalDeposit.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

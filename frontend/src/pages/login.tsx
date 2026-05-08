import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Seo } from '../components/Seo';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get('email')), String(form.get('password')));
      router.push('/account/rentals');
    } catch {
      setError('Invalid email or password. Please check your details and try again.');
    }
  }

  return (
    <>
      <Seo title="Login" description="Login to RentEase to manage rentals, deliveries, checkout, and maintenance requests." />
      <section className="auth-shell">
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} md={8}>
              <Form onSubmit={submit} className="auth-card">
                <p className="eyebrow dark">Welcome back</p>
                <h1>Login to RentEase</h1>
                <p className="muted-text">Use your email and password to continue. Your session stays active after refresh.</p>
                {error ? <Alert variant="danger">{error}</Alert> : null}
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control name="email" type="email" placeholder="you@example.com" required />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control name="password" type="password" placeholder="Enter password" required />
                </Form.Group>
                <Button type="submit" variant="dark" className="w-100">
                  Login
                </Button>
                <p className="auth-switch">
                  New to RentEase? <Link href="/signup">Create an account</Link>
                </p>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

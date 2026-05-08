import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Seo } from '../components/Seo';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await signup({
        name: String(form.get('name')),
        email: String(form.get('email')),
        phone: String(form.get('phone') || ''),
        password: String(form.get('password'))
      });
      router.push('/products');
    } catch {
      setError('Unable to create account. The email may already be registered.');
    }
  }

  return (
    <>
      <Seo title="Sign up" description="Create a RentEase customer account for furniture and appliance rentals." />
      <section className="auth-shell">
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} md={8}>
              <Form onSubmit={submit} className="auth-card">
                <p className="eyebrow dark">Start renting</p>
                <h1>Create Account</h1>
                <p className="muted-text">Register once, then checkout, track rentals, and raise maintenance requests from your dashboard.</p>
                {error ? <Alert variant="danger">{error}</Alert> : null}
                <Form.Group className="mb-3">
                  <Form.Label>Full name</Form.Label>
                  <Form.Control name="name" placeholder="Your name" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control name="email" type="email" placeholder="you@example.com" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control name="phone" placeholder="Mobile number" />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control name="password" type="password" placeholder="Minimum 8 characters" required minLength={8} />
                </Form.Group>
                <Button type="submit" variant="dark" className="w-100">
                  Create Account
                </Button>
                <p className="auth-switch">
                  Already registered? <Link href="/login">Login</Link>
                </p>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

import { gql } from '@apollo/client';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Seo } from '../../components/Seo';
import { useAuth } from '../../context/AuthContext';
import { createApolloClient } from '../../lib/graphql';

const ACTIVE_RENTALS_QUERY = gql`
  query ActiveRentals {
    activeRentals {
      id
      tenureMonths
      startDate
      endDate
      status
      product { name }
    }
    myMaintenanceRequests {
      id
      subject
      status
      createdAt
    }
  }
`;

const CREATE_MAINTENANCE = gql`
  mutation CreateMaintenanceRequest($input: MaintenanceRequestInput!) {
    createMaintenanceRequest(input: $input) {
      id
      status
    }
  }
`;

export default function RentalsPage() {
  const { token, user, ready } = useAuth();
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    if (!token) return;
    const client = createApolloClient(token);
    const response = await client.query({ query: ACTIVE_RENTALS_QUERY, fetchPolicy: 'no-cache' });
    setData(response.data);
  }

  useEffect(() => {
    if (ready && token) load();
  }, [ready, token]);

  async function createRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const client = createApolloClient(token);
    try {
      await client.mutate({
        mutation: CREATE_MAINTENANCE,
        variables: { input: { rentalId: String(form.get('rentalId')), subject: String(form.get('subject')), description: String(form.get('description')) } }
      });
      setMessage('Maintenance request created.');
      await load();
    } catch {
      setError('Unable to create maintenance request. Please try again.');
    }
  }

  return (
    <>
      <Seo title="Rental management" description="View active rentals, history, and maintenance requests." />
      <Container className="section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Customer dashboard</p>
            <h1>Rental Management</h1>
            <p>Track active rentals, service requests, and rental history from one place.</p>
          </div>
        </div>
        {!user ? (
          <Alert variant="warning">
            Please <Link href="/login">login</Link> to view your rentals.
          </Alert>
        ) : null}
        {message ? <Alert variant="success">{message}</Alert> : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}
        {user ? (
          <Row className="g-4">
            <Col lg={8}>
              <div className="surface-panel">
                <h2>Active Rentals</h2>
                <Table responsive className="align-middle mt-3">
                  <thead>
                    <tr><th>Product</th><th>Tenure</th><th>Start</th><th>End</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {(data?.activeRentals || []).map((rental: any) => (
                      <tr key={rental.id}>
                        <td>{rental.product.name}</td>
                        <td>{rental.tenureMonths} months</td>
                        <td>{new Date(rental.startDate).toLocaleDateString()}</td>
                        <td>{new Date(rental.endDate).toLocaleDateString()}</td>
                        <td><Badge bg="success">{rental.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col lg={4}>
              <Form onSubmit={createRequest} className="surface-panel">
                <h2>Create Maintenance Request</h2>
                <Form.Select name="rentalId" required className="mb-3">
                  <option value="">Choose rental</option>
                  {(data?.activeRentals || []).map((rental: any) => (
                    <option key={rental.id} value={rental.id}>{rental.product.name}</option>
                  ))}
                </Form.Select>
                <Form.Control name="subject" required minLength={4} placeholder="Subject" className="mb-3" />
                <Form.Control as="textarea" name="description" required minLength={10} placeholder="Describe the issue" className="mb-3" />
                <Button type="submit" variant="dark" disabled={!token}>Submit Request</Button>
              </Form>
            </Col>
            <Col xs={12}>
              <div className="surface-panel">
                <h2>Maintenance History</h2>
                <Table responsive className="align-middle mt-3">
                  <thead><tr><th>Subject</th><th>Status</th><th>Created</th></tr></thead>
                  <tbody>
                    {(data?.myMaintenanceRequests || []).map((request: any) => (
                      <tr key={request.id}>
                        <td>{request.subject}</td>
                        <td>{request.status}</td>
                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        ) : null}
      </Container>
    </>
  );
}

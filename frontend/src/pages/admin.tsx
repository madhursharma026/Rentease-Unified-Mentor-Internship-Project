import { gql } from '@apollo/client';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Seo } from '../components/Seo';
import { useAuth } from '../context/AuthContext';
import { createApolloClient } from '../lib/graphql';

const DASHBOARD_QUERY = gql`
  query Dashboard {
    dashboardMetrics {
      totalProducts
      activeRentals
      openMaintenanceRequests
      monthlyRecurringRent
      collectedDeposits
    }
    orders {
      id
      status
      totalMonthlyRent
      totalDeposit
      deliveryDate
      user {
        name
        email
      }
    }
    maintenanceRequests {
      id
      subject
      status
      assignedTo
      user {
        name
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: String!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export default function AdminPage() {
  const { token, user, ready } = useAuth();
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState('');
  const canManage = user?.role === 'ADMIN' || user?.role === 'VENDOR';

  async function load() {
    if (!token || !canManage) return;
    const client = createApolloClient(token);
    const response = await client.query({ query: DASHBOARD_QUERY, fetchPolicy: 'no-cache' });
    setData(response.data);
  }

  useEffect(() => {
    if (ready && token && canManage) load();
  }, [ready, token, canManage]);

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const client = createApolloClient(token);
    await client.mutate({
      mutation: CREATE_PRODUCT,
      variables: {
        input: {
          name: String(form.get('name')),
          category: String(form.get('category')),
          description: String(form.get('description')),
          monthlyRent: Number(form.get('monthlyRent')),
          deposit: Number(form.get('deposit')),
          tenureOptions: String(form.get('tenureOptions')).split(',').map((item) => Number(item.trim())),
          inventoryCount: Number(form.get('inventoryCount')),
          imageUrl: String(form.get('imageUrl')),
          isActive: true
        }
      }
    });
    setMessage('Product created successfully.');
    event.currentTarget.reset();
    await load();
  }

  async function updateOrder(id: string, status: string) {
    const client = createApolloClient(token);
    await client.mutate({ mutation: UPDATE_ORDER_STATUS, variables: { id, status } });
    setMessage('Order status updated.');
    await load();
  }

  const metrics = data?.dashboardMetrics;

  return (
    <>
      <Seo title="Admin dashboard" description="Manage products, orders, deliveries, maintenance, and rental analytics." />
      <Container className="section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Operations control</p>
            <h1>Admin Dashboard</h1>
            <p>Manage inventory, delivery status, maintenance, and rental analytics.</p>
          </div>
        </div>
        {!user ? <Alert variant="warning">Please <Link href="/login">login</Link> with an admin or vendor account.</Alert> : null}
        {user && !canManage ? <Alert variant="danger">Your account does not have admin/vendor access.</Alert> : null}
        {message ? <Alert variant="success">{message}</Alert> : null}
        {metrics ? (
          <>
            <Row className="g-3 my-4">
              <Col md={3}><div className="metric"><span>Products</span><strong>{metrics.totalProducts}</strong></div></Col>
              <Col md={3}><div className="metric"><span>Active rentals</span><strong>{metrics.activeRentals}</strong></div></Col>
              <Col md={3}><div className="metric"><span>Open service</span><strong>{metrics.openMaintenanceRequests}</strong></div></Col>
              <Col md={3}><div className="metric"><span>Monthly rent</span><strong>Rs. {Number(metrics.monthlyRecurringRent).toLocaleString('en-IN')}</strong></div></Col>
            </Row>
            <div className="surface-panel mb-4">
              <h2>Orders & Delivery</h2>
              <Table responsive className="align-middle">
                <thead><tr><th>Customer</th><th>Status</th><th>Delivery</th><th>Rent</th><th>Deposit</th></tr></thead>
                <tbody>
                  {data.orders.map((order: any) => (
                    <tr key={order.id}>
                      <td>{order.user.name}<br /><small>{order.user.email}</small></td>
                      <td>
                        <Form.Select defaultValue={order.status} onChange={(event) => updateOrder(order.id, event.target.value)}>
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </Form.Select>
                      </td>
                      <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                      <td>Rs. {Number(order.totalMonthlyRent).toLocaleString('en-IN')}</td>
                      <td>Rs. {Number(order.totalDeposit).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Form onSubmit={createProduct} className="surface-panel">
              <h2>Product & Inventory Management</h2>
              <Row className="g-3">
                <Col md={6}><Form.Control name="name" placeholder="Product name" required /></Col>
                <Col md={6}>
                  <Form.Select name="category" required>
                    <option value="FURNITURE">Furniture</option>
                    <option value="APPLIANCES">Appliances</option>
                  </Form.Select>
                </Col>
                <Col md={4}><Form.Control name="monthlyRent" type="number" placeholder="Monthly rent" required /></Col>
                <Col md={4}><Form.Control name="deposit" type="number" placeholder="Deposit" required /></Col>
                <Col md={4}><Form.Control name="inventoryCount" type="number" placeholder="Inventory" required /></Col>
                <Col md={6}><Form.Control name="tenureOptions" placeholder="Tenure months: 3,6,12" required /></Col>
                <Col md={6}><Form.Control name="imageUrl" placeholder="Image URL" required /></Col>
                <Col xs={12}><Form.Control as="textarea" name="description" placeholder="Description" required /></Col>
              </Row>
              <Button type="submit" variant="dark" className="mt-3">Create Product</Button>
            </Form>
            <div className="surface-panel mt-4">
              <h2>Maintenance Queue</h2>
              <Table responsive className="align-middle">
                <thead><tr><th>Request</th><th>Customer</th><th>Status</th><th>Assigned</th></tr></thead>
                <tbody>
                  {data.maintenanceRequests.map((request: any) => (
                    <tr key={request.id}>
                      <td>{request.subject}</td>
                      <td>{request.user.name}</td>
                      <td><Badge bg={request.status === 'OPEN' ? 'warning' : 'secondary'}>{request.status}</Badge></td>
                      <td>{request.assignedTo || 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        ) : null}
      </Container>
    </>
  );
}

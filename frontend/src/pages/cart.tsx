import Link from 'next/link';
import { Button, Container, Table } from 'react-bootstrap';
import { Seo } from '../components/Seo';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, removeItem, totalMonthlyRent, totalDeposit } = useCart();
  return (
    <>
      <Seo title="Cart" description="Review selected rental items before scheduling delivery and checkout." />
      <Container className="section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Rental cart</p>
            <h1>Cart</h1>
            <p>Review tenure, monthly rent, and deposit before checkout.</p>
          </div>
          <Link href="/products">Continue browsing</Link>
        </div>
        <div className="surface-panel">
          <Table responsive className="align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Tenure</th>
                <th>Qty</th>
                <th>Monthly rent</th>
                <th>Deposit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.product.id}-${item.tenureMonths}`}>
                  <td>{item.product.name}</td>
                  <td>{item.tenureMonths} months</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {Number(item.product.monthlyRent).toLocaleString('en-IN')}</td>
                  <td>Rs. {Number(item.product.deposit).toLocaleString('en-IN')}</td>
                  <td><Button variant="outline-danger" size="sm" onClick={() => removeItem(item.product.id)}>Remove</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          {!items.length ? <p className="muted-text mb-0">Your cart is empty.</p> : null}
        </div>
        <div className="checkout-summary mt-3">
          <strong>Monthly rent: Rs. {totalMonthlyRent.toLocaleString('en-IN')}</strong>
          <strong>Deposit: Rs. {totalDeposit.toLocaleString('en-IN')}</strong>
          <Link href="/checkout" passHref legacyBehavior>
            <Button as="a" variant="dark" disabled={!items.length}>Checkout</Button>
          </Link>
        </div>
      </Container>
    </>
  );
}

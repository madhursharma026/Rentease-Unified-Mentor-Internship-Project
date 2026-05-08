import Link from 'next/link';
import { ReactNode } from 'react';
import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Layout({ children }: { children: ReactNode }) {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <Navbar expand="lg" className="site-nav" sticky="top">
        <Container>
          <Link href="/" className="navbar-brand brand-mark">
            RentEase
          </Link>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto align-items-lg-center">
              <Link href="/products" className="nav-link">
                Products
              </Link>
              <Link href="/account/rentals" className="nav-link">
                Rentals
              </Link>
              <Link href="/admin" className="nav-link">
                Admin
              </Link>
              <Link href="/cart" className="nav-link cart-link">
                Cart <Badge bg="dark">{count}</Badge>
              </Link>
              {user ? (
                <>
                  <span className="nav-user">{user.name}</span>
                  <Button variant="outline-dark" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-link">
                    Login
                  </Link>
                  <Link href="/signup" className="nav-link nav-cta">
                    Sign Up
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>{children}</main>
      <footer className="site-footer">
        <Container className="d-flex flex-wrap gap-3 justify-content-between">
          <span>RentEase Furniture & Appliance Rental Platform</span>
          <span>Fast delivery, flexible tenure, responsive maintenance.</span>
        </Container>
      </footer>
    </>
  );
}

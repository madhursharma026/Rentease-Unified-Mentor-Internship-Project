import Image from 'next/image';
import Link from 'next/link';
import { Badge, Button, Card } from 'react-bootstrap';
import { Product } from '../types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="product-card h-100">
      <div className="product-image">
        <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <Card.Body>
        <div className="d-flex justify-content-between gap-2 mb-2">
          <Badge bg={product.category === 'FURNITURE' ? 'success' : 'primary'}>{product.category}</Badge>
          <span className="stock-text">{product.inventoryCount} available</span>
        </div>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <div className="price-row">
          <strong>Rs. {Number(product.monthlyRent).toLocaleString('en-IN')}</strong>
          <span>/ month</span>
        </div>
        <Link href={`/products/${product.slug}`} passHref legacyBehavior>
          <Button as="a" className="w-100 mt-3" variant="dark">
            View Details
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

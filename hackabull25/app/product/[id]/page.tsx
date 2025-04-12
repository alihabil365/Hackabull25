  originalPrice: 10000,
import ProductClientPage from '@/components/ProductClientPage';

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductClientPage id={params.id} />;
}

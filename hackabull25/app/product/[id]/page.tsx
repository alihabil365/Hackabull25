import ProductClientPage from '@/components/ProductClientPage';

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductClientPage id={params.id} />;
}

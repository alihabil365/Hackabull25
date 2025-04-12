import ProductDetail from "../../../components/productDetail";

// This would typically come from your database
const MOCK_PRODUCT = {
  id: "1",
  title: "Lexus ls460",
  price: 8500,
  originalPrice: 10000,
  location: "Wesley Chapel, FL",
  description:
    "2007 lexus ls460 super clean 2nd owner well taken care of,all maintenance records through Lexus since new. 172k on the dash and still purrs like a kitten.\n\nNo lights on dash, no issues at all. new rims and tires Ceika coilovers, painted a year ago. $8500 obo.\n\nLow Ballers will be ignored.",
  images: ["/next.svg"], // Replace with actual images
  condition: "Used - like new",
  seller: {
    name: "John Doe",
    profileImage: "/next.svg", // Replace with actual profile image
    rating: 4.8,
  },
  inStock: true,
};

export default function ProductPage({ params }: { params: { id: string } }) {
  // In a real app, fetch product data based on params.id
  return <ProductDetail {...MOCK_PRODUCT} />;
}

import { CatalogPageLayout } from "../CatalogPageLayout";
import { rings } from "../../data/productCollections";

interface RingsCatalogPageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

export function RingsCatalogPage({ onNavigate, onBack }: RingsCatalogPageProps) {
  return (
    <CatalogPageLayout
      title="Our Rings Collection"
      subtitle="Handcrafted elegance from all our partner stores. From timeless wedding bands to statement gemstones, discover rings that tell your story."
      categoryKey="rings"
      products={rings}
      onNavigate={onNavigate}
      onBack={onBack}
    />
  );
}

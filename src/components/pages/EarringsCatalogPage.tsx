import { CatalogPageLayout } from "../CatalogPageLayout";
import { earrings } from "../../data/productCollections";

interface EarringsCatalogPageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

export function EarringsCatalogPage({ onNavigate, onBack }: EarringsCatalogPageProps) {
  return (
    <CatalogPageLayout
      title="Our Earrings Collection"
      subtitle="From dainty studs to dramatic drops — earrings curated from GIVA, Palmonas and Khan Jewellers. Find your perfect pair."
      categoryKey="earrings"
      products={earrings}
      onNavigate={onNavigate}
      onBack={onBack}
    />
  );
}

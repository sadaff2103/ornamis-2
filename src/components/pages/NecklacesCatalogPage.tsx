import { CatalogPageLayout } from "../CatalogPageLayout";
import { necklaces } from "../../data/productCollections";

interface NecklacesCatalogPageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

export function NecklacesCatalogPage({ onNavigate, onBack }: NecklacesCatalogPageProps) {
  return (
    <CatalogPageLayout
      title="Our Necklaces Collection"
      subtitle="From delicate pendants to statement chokers — discover necklaces from GIVA, Palmonas and Khan Jewellers that define your style."
      categoryKey="necklaces"
      products={necklaces}
      onNavigate={onNavigate}
      onBack={onBack}
    />
  );
}

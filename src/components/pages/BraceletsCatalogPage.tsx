import { CatalogPageLayout } from "../CatalogPageLayout";
import { bracelets } from "../../data/productCollections";

interface BraceletsCatalogPageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

export function BraceletsCatalogPage({ onNavigate, onBack }: BraceletsCatalogPageProps) {
  return (
    <CatalogPageLayout
      title="Our Bracelets Collection"
      subtitle="Stack them, layer them, or let them shine alone — explore bracelets from across all stores, from everyday silver to bridal gold."
      categoryKey="bracelets"
      products={bracelets}
      onNavigate={onNavigate}
      onBack={onBack}
    />
  );
}
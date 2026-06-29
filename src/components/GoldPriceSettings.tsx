import { useGoldPrice } from "../contexts/GoldPriceContext";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  TrendingUp,
  RefreshCw,
  Settings as SettingsIcon,
  ShieldCheck,
  AlertCircle,
  Info,
  ExternalLink,
  Database,
  Globe,
  Gem
} from "lucide-react";
import { formatPrice, getTimeSinceUpdate } from "../utils/goldPriceService";

export function GoldPriceSettings() {
  const { marketRates, loading, refreshRates } = useGoldPrice();

  if (!marketRates) return null;

  const { gold, diamond } = marketRates;
  const isLive = gold.source === 'api';
  const isDiamondLive = diamond.source === 'api';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-['Cinzel:Regular',sans-serif] text-[#492f0e] flex items-center gap-2">
            <Globe className="size-5" />
            Market Pricing Configuration
          </h3>
          <p className="text-sm text-[#492f0e]/60 mt-1">
            Global market rates for precious metals & stones
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshRates()}
          disabled={loading}
          className="border-[#b39978] text-[#492f0e] hover:bg-[#b39978]/10"
        >
          <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Rates
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gold Status Card */}
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="size-16" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-widest text-[#492f0e]/40 uppercase font-sans">
                Gold Standard (24K)
              </span>
              <Badge
                variant={isLive ? "default" : "secondary"}
                className={isLive ? "bg-green-500/10 text-green-700 border-green-200" : "bg-[#b39978]/10 text-[#492f0e]"}
              >
                {isLive ? 'LIVE API' : gold.source === 'cache' ? 'CACHED' : 'DEMO MODE'}
              </Badge>
            </div>

            <div className="mb-4">
              <div className="text-3xl font-bold text-[#492f0e]">
                {formatPrice(gold.gold24k)}
                <span className="text-sm font-normal text-[#492f0e]/60 ml-2">/gram</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#492f0e]/60">22K Gold:</span>
                <span className="font-semibold text-[#492f0e]">{formatPrice(gold.gold22k)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#492f0e]/60">18K Gold:</span>
                <span className="font-semibold text-[#492f0e]">{formatPrice(gold.gold18k)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#492f0e]/5 flex items-center justify-between text-[10px] text-[#492f0e]/40 uppercase tracking-wider font-bold">
              <span className="flex items-center gap-1">
                <Database className="size-3" />
                Updated {getTimeSinceUpdate(gold.lastUpdated)}
              </span>
            </div>
          </div>
        </Card>

        {/* Diamond Status Card */}
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Gem className="size-16" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-widest text-[#492f0e]/40 uppercase font-sans">
                Diamond Index (1ct)
              </span>
              <Badge
                variant={isDiamondLive ? "default" : "secondary"}
                className={isDiamondLive ? "bg-green-500/10 text-green-700 border-green-200" : "bg-[#b39978]/10 text-[#492f0e]"}
              >
                {isDiamondLive ? 'LIVE INDEX' : diamond.source === 'cache' ? 'CACHED' : 'FALLBACK'}
              </Badge>
            </div>

            <div className="mb-4">
              <div className="text-3xl font-bold text-[#492f0e]">
                {formatPrice(diamond.pricePerCarat)}
                <span className="text-sm font-normal text-[#492f0e]/60 ml-2">/carat</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-[#b39978]/5 rounded-lg border border-[#b39978]/10">
              <ShieldCheck className="size-4 text-green-600 mt-0.5" />
              <p className="text-[11px] text-[#492f0e]/70 leading-relaxed font-sans font-medium">
                Sourced from GIA-certified round diamond indices. Reflects current market trade values.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#492f0e]/5 flex items-center justify-between text-[10px] text-[#492f0e]/40 uppercase tracking-wider font-bold">
              <span className="flex items-center gap-1">
                <Database className="size-3" />
                Updated {getTimeSinceUpdate(diamond.lastUpdated)}
              </span>
            </div>
          </div>
        </Card>

        {/* API Info Card */}
        <Card className="p-6 bg-[#492f0e] text-[#f4e5b8]">
          <h4 className="font-['Cinzel:Regular',sans-serif] mb-4 flex items-center gap-2">
            <SettingsIcon className="size-5" />
            Configuration
          </h4>

          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-60">Gold Provider</span>
                <span className="text-[10px] font-bold py-0.5 px-2 bg-[#d4af37] text-[#2a1f14] rounded-full">ACTIVE</span>
              </div>
              <p className="text-sm font-semibold truncate">Open Market Hub</p>
            </div>

            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-60">Diamond Index</span>
                <Badge variant="outline" className="text-[10px] border-white/20 text-white leading-none">OpenFacet</Badge>
              </div>
              <p className="text-sm font-semibold truncate">GIA Global Matrix</p>
            </div>

            <div className="text-[11px] opacity-60 leading-relaxed italic">
              * Rates are automatically synchronized every 30 minutes to ensure pricing accuracy across the store.
            </div>
          </div>
        </Card>
      </div>

      {/* API Reference Table */}
      <Card className="p-6">
        <h4 className="font-['Cinzel:Regular',sans-serif] text-[#492f0e] mb-4 flex items-center gap-2">
          <span className="flex items-center gap-2">
            <Info className="size-5" />
            Connected Providers
          </span>
        </h4>

        <div className="space-y-3">
          <ConnectedProviderRow
            name="GoldAPI.io"
            type="Gold"
            status={gold.source === 'api'}
            url="https://www.goldapi.io/"
          />
          <ConnectedProviderRow
            name="OpenFacet"
            type="Diamond"
            status={diamond.source === 'api' || diamond.source === 'fallback'}
            url="https://openfacet.net"
          />
          <ConnectedProviderRow
            name="Metals-API"
            type="Secondary Gold"
            status={false}
            url="https://metals-api.com"
          />
        </div>
      </Card>

      {/* Integration Guide */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-['Cinzel:Regular',sans-serif] text-[#492f0e] mb-3 flex items-center gap-2">
          <Info className="size-5" />
          How it works
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 font-sans">
          <div className="space-y-2">
            <p className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">1.</span>
              <span>Gold rates are fetched in INR/gram from international spot exchanges.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">2.</span>
              <span>Diamond rates track GIA-certified round stone indices (per carat).</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">3.</span>
              <span>Calculations automatically include making charges, gemstone weight, and 3% GST.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">4.</span>
              <span>Live data is cached for 30-60 minutes to maintain performance.</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ConnectedProviderRow({ name, type, status, url }: { name: string, type: string, status: boolean, url: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-[#492f0e]/5 hover:bg-[#492f0e]/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${status ? 'bg-green-100' : 'bg-gray-100'}`}>
          {status ? <ShieldCheck className="size-4 text-green-600" /> : <AlertCircle className="size-4 text-gray-400" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#492f0e]">{name}</p>
          <p className="text-[10px] text-[#492f0e]/60">{type} • {url.replace('https://', '')}</p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#492f0e]/40 hover:text-[#492f0e] p-2"
      >
        <ExternalLink className="size-4" />
      </a>
    </div>
  );
}

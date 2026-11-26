import type { IpVersion } from '../../shared/types';
import type { ProviderResult } from '../types';
import { zhLocation } from './geoZh';

export interface IpConsensusGroup {
  ip: string;
  version?: IpVersion;
  providers: ProviderResult[];
  avgLatency: number;
  geoSummary?: string;
}

export interface GroupedResults {
  groups: IpConsensusGroup[];
  failedProviders: ProviderResult[];
  totalSuccessful: number;
}

export function groupResultsByIp(results: ProviderResult[]): GroupedResults {
  const ipMap = new Map<string, ProviderResult[]>();
  const failed: ProviderResult[] = [];

  for (const r of results) {
    if (r.status === 'loading') continue;
    if (r.status === 'error' || !r.ip) {
      failed.push(r);
    } else {
      const existing = ipMap.get(r.ip) || [];
      existing.push(r);
      ipMap.set(r.ip, existing);
    }
  }

  const groups: IpConsensusGroup[] = Array.from(ipMap.entries()).map(([ip, provs]) => {
    const latencies = provs.map((p) => p.latencyMs || 0).filter((l) => l > 0);
    const avgLatency = latencies.length
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0;
    const version = provs.find((p) => p.version)?.version;
    const geoProvider = provs.find((p) => p.geo?.city || p.geo?.country);
    const geoSummary = geoProvider?.geo
      ? zhLocation(geoProvider.geo.city, geoProvider.geo.country, geoProvider.geo.countryCode)
      : undefined;

    return {
      ip,
      version,
      providers: provs,
      avgLatency,
      geoSummary,
    };
  });

  // Sort: IPv4 first, then IPv6, then descending by number of providers
  groups.sort((a, b) => {
    if (a.version !== b.version) {
      return a.version === 'IPv4' ? -1 : 1;
    }
    return b.providers.length - a.providers.length;
  });

  const totalSuccessful = groups.reduce((sum, g) => sum + g.providers.length, 0);

  return {
    groups,
    failedProviders: failed,
    totalSuccessful,
  };
}

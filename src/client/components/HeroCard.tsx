import {
  Check,
  ChevronRight,
  Clock,
  Copy,
  Globe,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { GeoLocationInfo } from '../../shared/types';

interface HeroCardProps {
  ipv4?: string;
  ipv6?: string;
  geo?: GeoLocationInfo;
  avgLatency?: number;
  isRefreshing: boolean;
  isInitialLoading?: boolean;
  lastRefreshedAt?: Date | null;
  securityStatus?: {
    isWebRtcLeaked: boolean;
    isDnsLeaked: boolean;
    dnsServersCount: number;
    isDnsTesting: boolean;
  };
  onViewDetails?: () => void;
  onViewWebRtc?: () => void;
  onViewDns?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  ipv4,
  ipv6,
  geo,
  avgLatency,
  isRefreshing,
  isInitialLoading = false,
  lastRefreshedAt,
  securityStatus,
  onViewDetails,
  onViewWebRtc,
  onViewDns,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="glass-card hero-card" style={{ padding: 'clamp(1.1rem, 3vw, 1.5rem)' }}>
      {/* Top row: Status indicators & Network stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.875rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {isInitialLoading && !ipv4 && !ipv6
              ? '正在查询网络接口…'
              : '网络状态：正常'}
          </span>
          {isRefreshing && !isInitialLoading && (
            <span
              className="badge badge-cyan"
              style={{ fontSize: '0.6875rem', padding: '1px 7px' }}
            >
              后台同步中…
            </span>
          )}
          {lastRefreshedAt && !isInitialLoading && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
              title={`上次检测于 ${lastRefreshedAt.toLocaleString()}`}
            >
              <Clock size={12} />
              <span>{lastRefreshedAt.toLocaleTimeString()}</span>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          {isInitialLoading && !avgLatency && !geo?.colo && !geo?.asn ? (
            <>
              <div
                className="skeleton"
                style={{ width: '120px', height: '24px', borderRadius: 'var(--radius-full)' }}
              />
              <div
                className="skeleton"
                style={{ width: '90px', height: '24px', borderRadius: 'var(--radius-full)' }}
              />
            </>
          ) : (
            <>
              {avgLatency !== undefined && (
                <div className="badge badge-emerald">
                  <Zap size={13} />
                  <span>{avgLatency} ms</span>
                </div>
              )}

              {geo?.colo && (
                <div className="badge badge-cyan">
                  <Globe size={13} />
                  <span>PoP: {geo.colo}</span>
                </div>
              )}

              {geo?.asn && (
                <div className="badge badge-amber">
                  <Shield size={13} />
                  <span>{geo.asn}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Unified IP Section (IPv4 & IPv6 combined to save space) */}
      <div
        style={{
          background: 'var(--bg-panel-strong)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        {/* IPv4 Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              className="badge badge-cyan"
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '2px 8px',
                letterSpacing: '0.05em',
              }}
            >
              IPv4
            </span>
            {isInitialLoading && !ipv4 ? (
              <div
                className="skeleton"
                style={{ width: '160px', height: '24px', borderRadius: 'var(--radius-sm)' }}
              />
            ) : (
              <span
                className="mono hero-ip-v4"
                style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)', fontWeight: 700 }}
              >
                {ipv4 || '未检测到'}
              </span>
            )}
          </div>

          {ipv4 && (
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={() => copyToClipboard(ipv4, 'ipv4')}
              title="复制 IPv4"
              style={{ width: '28px', height: '28px', padding: 0 }}
            >
              {copiedKey === 'ipv4' ? <Check size={15} color="var(--text-emerald)" /> : <Copy size={15} />}
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

        {/* IPv6 Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              className={ipv6 ? 'badge badge-emerald' : 'badge badge-amber'}
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '2px 8px',
                letterSpacing: '0.05em',
              }}
            >
              IPv6
            </span>
            {isInitialLoading && !ipv6 ? (
              <div
                className="skeleton"
                style={{ width: '220px', height: '22px', borderRadius: 'var(--radius-sm)' }}
              />
            ) : (
              <span
                className="mono hero-ip-v6"
                style={{
                  fontSize: 'clamp(0.875rem, 2vw, 0.95rem)',
                  fontWeight: 600,
                  color: ipv6 ? 'var(--text-primary)' : 'var(--text-muted)',
                  wordBreak: 'break-all',
                }}
              >
                {ipv6 || '无 IPv6 连接'}
              </span>
            )}
          </div>

          {ipv6 && (
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={() => copyToClipboard(ipv6, 'ipv6')}
              title="复制 IPv6"
              style={{ width: '28px', height: '28px', padding: 0 }}
            >
              {copiedKey === 'ipv6' ? <Check size={15} color="var(--text-emerald)" /> : <Copy size={15} />}
            </button>
          )}
        </div>
      </div>

      {/* Security Status Strip (Guaranteed single line on mobile) */}
      {securityStatus && (
        <div
          style={{
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'nowrap',
              minWidth: 0,
            }}
          >
            {securityStatus.isWebRtcLeaked ? (
              <button
                type="button"
                className="badge badge-rose"
                onClick={onViewWebRtc}
                title="可能存在 WebRTC 泄漏 - 点击查看诊断"
                style={{
                  fontSize: '0.6875rem',
                  padding: '2px 7px',
                  whiteSpace: 'nowrap',
                  cursor: onViewWebRtc ? 'pointer' : 'default',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <ShieldAlert size={11} style={{ marginRight: '3px' }} />
                WebRTC 泄漏
              </button>
            ) : (
              <button
                type="button"
                className="badge badge-emerald"
                onClick={onViewWebRtc}
                title="WebRTC 已保护 - 点击查看诊断"
                style={{
                  fontSize: '0.6875rem',
                  padding: '2px 7px',
                  whiteSpace: 'nowrap',
                  cursor: onViewWebRtc ? 'pointer' : 'default',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <ShieldCheck size={11} style={{ marginRight: '3px' }} />
                WebRTC 安全
              </button>
            )}

            {securityStatus.isDnsTesting ? (
              <button
                type="button"
                className="badge badge-cyan"
                onClick={onViewDns}
                title="正在检测 DNS 解析器 - 点击查看诊断"
                style={{
                  fontSize: '0.6875rem',
                  padding: '2px 7px',
                  whiteSpace: 'nowrap',
                  cursor: onViewDns ? 'pointer' : 'default',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                DNS 检测中
              </button>
            ) : securityStatus.isDnsLeaked ? (
              <button
                type="button"
                className="badge badge-rose"
                onClick={onViewDns}
                title="可能存在 DNS 泄漏 - 点击查看诊断"
                style={{
                  fontSize: '0.6875rem',
                  padding: '2px 7px',
                  whiteSpace: 'nowrap',
                  cursor: onViewDns ? 'pointer' : 'default',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <ShieldAlert size={11} style={{ marginRight: '3px' }} />
                DNS 泄漏
              </button>
            ) : (
              <button
                type="button"
                className="badge badge-emerald"
                onClick={onViewDns}
                title="DNS 已保护 - 点击查看诊断"
                style={{
                  fontSize: '0.6875rem',
                  padding: '2px 7px',
                  whiteSpace: 'nowrap',
                  cursor: onViewDns ? 'pointer' : 'default',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <ShieldCheck size={11} style={{ marginRight: '3px' }} />
                DNS 安全
              </button>
            )}
          </div>

          {onViewDetails && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onViewDetails}
              style={{
                padding: '3px 8px',
                fontSize: '0.75rem',
                color: 'var(--accent-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <span>详情</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

import {
  ChevronDown,
  Globe,
  Radio,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type React from 'react';
import type { DnsLeakResult } from '../types';

interface DnsLeakCardProps {
  dnsResult: DnsLeakResult & { reTest: () => void };
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const DnsLeakCard: React.FC<DnsLeakCardProps> = ({
  dnsResult,
  isExpanded = true,
  onToggleExpand,
}) => {
  const isTesting = dnsResult.status === 'testing';
  const isError = dnsResult.status === 'error';
  const hasDnsServers = dnsResult.dnsServers.length > 0;

  return (
    <div
      id="dns-leak-card"
      className="glass-card"
      style={{ padding: 'clamp(1.1rem, 3vw, 1.75rem)' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isExpanded ? '1.25rem' : 0,
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>DNS 解析器与泄漏检测</h2>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            通过解析未缓存的子域名，检测 DNS 查询是否绕过了你的代理或 VPN。
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {isTesting ? (
            <span className="badge badge-cyan">正在探测 DNS 解析器…</span>
          ) : isError ? (
            <span className="badge badge-rose">探测出错</span>
          ) : dnsResult.isLeaking ? (
            <span className="badge badge-rose">
              <ShieldAlert size={14} /> 可能存在 DNS 泄漏
            </span>
          ) : hasDnsServers ? (
            <span className="badge badge-emerald">
              <ShieldCheck size={14} /> DNS 解析器正常
            </span>
          ) : (
            <span className="badge badge-slate">就绪</span>
          )}

          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={dnsResult.reTest}
            disabled={isTesting}
            title="重新检测 DNS 泄漏状态"
          >
            <RefreshCw size={14} className={isTesting ? 'spin-anim' : ''} />
          </button>

          {onToggleExpand && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onToggleExpand}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-hover)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span>{isExpanded ? '收起' : '详情'}</span>
              <ChevronDown
                size={14}
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease',
                }}
              />
            </button>
          )}
        </div>
      </div>

      {isExpanded &&
        (isError ? (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <span style={{ color: 'var(--accent-rose)', fontSize: '0.875rem' }}>
              {dnsResult.errorMessage ||
                '无法连接 DNS 探测服务，请检查网络连接。'}
            </span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={dnsResult.reTest}>
              重试
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Detected Upstream DNS Resolvers */}
            <div
              style={{
                background: 'var(--bg-panel)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '0.75rem',
                }}
              >
                <Server size={15} color="var(--accent-cyan)" />
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                  }}
                >
                  上游 DNS 解析器（{dnsResult.dnsServers.length} 个）
                </span>
              </div>

              {dnsResult.dnsServers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dnsResult.dnsServers.map((server) => (
                    <div
                      key={server.ip}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                        gap: '8px',
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <span
                          className="mono"
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            wordBreak: 'break-all',
                            overflowWrap: 'anywhere',
                            minWidth: 0,
                          }}
                        >
                          {server.ip}
                        </span>
                        {server.country && (
                          <span
                            className="badge badge-slate"
                            style={{ fontSize: '0.6875rem', flexShrink: 0 }}
                          >
                            {server.country}
                          </span>
                        )}
                      </div>

                      {(server.org || server.asn) && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            marginTop: '3px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={server.org || server.asn}
                        >
                          {server.org || server.asn}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : isTesting ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    padding: '1rem 0',
                  }}
                >
                  <RefreshCw size={14} className="spin-anim" />
                  <span>正在并行发送 10 个随机子域名查询…</span>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  尚未检测到活动的 DNS 服务器。
                </p>
              )}
            </div>

            {/* Diagnostic Conclusion & Summary */}
            <div
              style={{
                background: 'var(--bg-panel)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '0.75rem',
                  }}
                >
                  <Globe size={15} color="var(--accent-cyan)" />
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    解析器泄漏评估
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    color: dnsResult.isLeaking ? 'var(--accent-rose)' : 'var(--text-secondary)',
                  }}
                >
                  {dnsResult.isLeaking ? (
                    <p>
                      <strong>警告：</strong>你的 DNS 查询似乎通过了代理出口路径之外的服务器解析，或解析服务商不一致。你的真实网络服务商或位置可能已被暴露。
                    </p>
                  ) : hasDnsServers ? (
                    <p>
                      <strong>正常：</strong>你的 DNS 请求由一致的上游解析器处理，未暴露私有本地网络接口。
                    </p>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>
                      等待探测结果以评估 DNS 解析器一致性。
                    </p>
                  )}
                </div>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                探测使用一次性随机子域名以绕过递归 DNS 缓存，捕获你系统真实的上游解析器。
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

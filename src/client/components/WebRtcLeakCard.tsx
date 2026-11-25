import { ChevronDown, Cpu, Globe, RefreshCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import type React from 'react';
import type { WebRtcLeakResult } from '../types';

interface WebRtcLeakCardProps {
  leakResult: WebRtcLeakResult & { reProbe: () => void };
  primaryIpv4?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const WebRtcLeakCard: React.FC<WebRtcLeakCardProps> = ({
  leakResult,
  primaryIpv4,
  isExpanded = true,
  onToggleExpand,
}) => {
  const isProbing = leakResult.status === 'probing';
  const isUnsupported = leakResult.status === 'unsupported';

  // Check if WebRTC STUN revealed a different public IP than the HTTP API (indicating a VPN/Proxy leak)
  const stunWanIp = leakResult.publicIps[0];
  const isVpnLeaked = Boolean(primaryIpv4 && stunWanIp && primaryIpv4 !== stunWanIp);

  return (
    <div
      id="webrtc-leak-card"
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
            <Shield size={18} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>WebRTC 与 STUN 泄漏检测</h2>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            检查浏览器 WebRTC ICE 候选地址，以检测本地局域网接口与 VPN 绕过。
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {isVpnLeaked ? (
            <span className="badge badge-rose">
              <ShieldAlert size={14} /> 检测到可能的 VPN 绕过
            </span>
          ) : leakResult.status === 'completed' ? (
            <span className="badge badge-emerald">
              <ShieldCheck size={14} /> 诊断完成
            </span>
          ) : (
            <span className="badge badge-cyan">正在收集 ICE 候选地址…</span>
          )}

          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={leakResult.reProbe}
            disabled={isProbing}
            title="重新运行 WebRTC STUN 探测"
          >
            <RefreshCw size={14} className={isProbing ? 'spin-anim' : ''} />
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
        (isUnsupported ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            你的浏览器不支持 WebRTC，或已被浏览器设置 / 扩展拦截。
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Local Interface IPs (LAN) */}
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
                <Cpu size={15} color="var(--accent-cyan)" />
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                  }}
                >
                  本地网络候选地址（LAN）
                </span>
              </div>

              {leakResult.localIps.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {leakResult.localIps.map((ip) => (
                    <div
                      key={ip}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}
                    >
                      <span
                        className="badge badge-cyan"
                        style={{ fontSize: '0.6875rem', flexShrink: 0 }}
                      >
                        Host
                      </span>
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--text-primary)',
                          wordBreak: 'break-all',
                          overflowWrap: 'anywhere',
                          minWidth: 0,
                        }}
                      >
                        {ip}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {isProbing
                    ? '正在探测接口…'
                    : '未暴露本地 IP（mDNS 已保护或隐藏）'}
                </span>
              )}
            </div>

            {/* Public STUN WAN IP */}
            <div
              style={{
                background: 'var(--bg-panel)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: isVpnLeaked
                  ? '1px solid rgba(244, 63, 94, 0.4)'
                  : '1px solid var(--border-subtle)',
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
                <Globe size={15} color="var(--accent-primary)" />
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                  }}
                >
                  STUN 反射候选地址（WAN）
                </span>
              </div>

              {stunWanIp ? (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                      minWidth: 0,
                    }}
                  >
                    <span
                      className="badge badge-emerald"
                      style={{ fontSize: '0.6875rem', flexShrink: 0 }}
                    >
                      srflx
                    </span>
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
                      {stunWanIp}
                    </span>
                  </div>
                  {isVpnLeaked && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-rose)',
                        display: 'block',
                        wordBreak: 'break-word',
                      }}
                    >
                      ⚠️ STUN 检测到的 IP 与你的 HTTP IP（{primaryIpv4}）不同！
                    </span>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {isProbing
                    ? '正在连接 Google STUN 服务器…'
                    : '未返回反射 STUN 候选地址'}
                </span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

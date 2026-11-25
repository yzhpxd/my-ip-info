import { CheckCircle2, Database, EyeOff, Globe, Radio, Shield, ShieldCheck, X } from 'lucide-react';
import type React from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>隐私与数据处理政策</h3>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            title="关闭弹窗"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: 'var(--text-cyan)',
              fontSize: '0.875rem',
            }}
          >
            <ShieldCheck size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>严格零日志政策：</strong>你的 IP 地址、地理位置与请求数据绝不会被存储、记录或用于盈利。
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Section 1: In-Memory Processing */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.375rem',
                }}
              >
                <Database size={16} color="var(--accent-emerald)" />
                <span>零持久化日志</span>
              </div>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                对边缘 API 端点（如 <code className="mono">/api/v1/ip</code>{' '}
                和 <code className="mono">/api/v1/info</code>）的请求仅在边缘 Worker 内存中临时处理，不会将你的 IP 地址或请求元数据保存到任何数据库、服务器日志或追踪存储中。
              </p>
            </div>

            {/* Section 2: Client-Side Multi-Source Queries */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.375rem',
                }}
              >
                <Globe size={16} color="var(--text-cyan)" />
                <span>客户端直连多源请求</span>
              </div>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                对备用服务商（Cloudflare Trace、ipify 等）与你配置的自定义节点的诊断查询均由你的浏览器直接通过 HTTPS 发起，不经过任何中间代理服务器。
              </p>
            </div>

            {/* Section 3: WebRTC STUN Leaks */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.375rem',
                }}
              >
                <Radio size={16} color="var(--accent-amber)" />
                <span>WebRTC STUN 泄漏诊断</span>
              </div>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                WebRTC 泄漏检测会创建一个隔离的本地 WebRTC 对等连接，仅向 Google 与 Cloudflare 的 STUN 服务器发送标准 STUN 请求，以反射你的候选 IP。整个过程不会创建或传输任何媒体、音频或视频流。
              </p>
            </div>

            {/* Section 4: Cookies & Analytics */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.375rem',
                }}
              >
                <EyeOff size={16} color="var(--accent-purple)" />
                <span>无 Cookie、无追踪器、无广告</span>
              </div>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                本应用不设置广告或追踪 Cookie，也不嵌入任何第三方追踪 SDK（如 Google Analytics、Facebook Pixel 等）。你的本地浏览器存储（<code className="mono">localStorage</code>）仅用于保存偏好设置、自定义节点列表、后端地址覆盖与可选的本地 IP 连接历史（默认关闭，100% 保存在你的设备上，绝不会发送到任何服务器）。
              </p>
            </div>

            {/* Section 5: Open Source Transparency */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.375rem',
                }}
              >
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>开源且可公开审计</span>
              </div>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                客户端应用、Cloudflare Workers 后端与 Node.js 运行时的全部源代码均已以 MIT 许可证公开，可供审计。
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '0.5rem',
            }}
          >
            <button type="button" className="btn btn-primary" onClick={onClose}>
              知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

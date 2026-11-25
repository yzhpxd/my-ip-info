import { Check, Copy, Terminal, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface CliToolboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudflareUrl?: string;
}

export const CliToolboxModal: React.FC<CliToolboxModalProps> = ({
  isOpen,
  onClose,
  cloudflareUrl,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const baseEndpoint =
    cloudflareUrl ||
    (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? window.location.origin
      : 'https://my-ip-info.ii2d-dev.workers.dev');

  const commands = [
    {
      id: 'curl-ip',
      label: '获取纯文本 IP（cURL）',
      cmd: `curl -s ${baseEndpoint}/api/v1/ip`,
    },
    {
      id: 'curl-v4',
      label: '仅强制 IPv4',
      cmd: `curl -4 -s ${baseEndpoint}/api/v1/ip`,
    },
    {
      id: 'curl-v6',
      label: '仅强制 IPv6',
      cmd: `curl -6 -s ${baseEndpoint}/api/v1/ip`,
    },
    {
      id: 'curl-info',
      label: '完整终端诊断（cURL）',
      cmd: `curl -s ${baseEndpoint}/api/v1/info`,
    },
    {
      id: 'curl-json',
      label: '完整 JSON 诊断信息（用 jq 格式化）',
      cmd: `curl -s -H "Accept: application/json" ${baseEndpoint}/api/v1/info | jq .`,
    },
    {
      id: 'curl-geo',
      label: '仅地理位置与 ASN',
      cmd: `curl -s ${baseEndpoint}/api/v1/geo | jq .`,
    },
    {
      id: 'curl-yaml',
      label: 'YAML 诊断信息',
      cmd: `curl -s ${baseEndpoint}/api/v1/yaml`,
    },
    {
      id: 'powershell',
      label: 'PowerShell（Windows）',
      cmd: `(Invoke-RestMethod -Uri "${baseEndpoint}/api/v1/info").ip`,
    },
  ];

  const copyCmd = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>CLI 与开发者工具箱</h3>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            直接从命令行、CI/CD 流水线或脚本中查询你部署的节点。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {commands.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-panel-strong)',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}
                  >
                    {item.label}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    style={{ padding: '4px' }}
                    onClick={() => copyCmd(item.cmd, item.id)}
                    title="复制命令"
                  >
                    {copiedKey === item.id ? (
                      <Check size={14} color="var(--text-emerald)" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                <pre
                  className="mono"
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--accent-cyan)',
                    overflowX: 'auto',
                    margin: 0,
                  }}
                >
                  {item.cmd}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

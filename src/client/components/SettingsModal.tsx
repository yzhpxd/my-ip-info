import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  Globe,
  Play,
  Plus,
  Save,
  Server,
  Settings,
  Trash2,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { PUBLIC_PROVIDERS } from '../providers';
import type { CustomEndpoint } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoints: CustomEndpoint[];
  onSaveEndpoints: (endpoints: CustomEndpoint[]) => void;
  config: {
    cloudflareUrl: string;
  };
  onSaveConfig: (config: { cloudflareUrl: string }) => void;
  onRefreshAll: () => void;
  disabledProviderIds: string[];
  onToggleProvider: (id: string) => void;
  onEnableAllProviders?: () => void;
  initialTab?: 'providers' | 'custom' | 'backend';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  endpoints,
  onSaveEndpoints,
  config,
  onSaveConfig,
  onRefreshAll,
  disabledProviderIds = [],
  onToggleProvider,
  onEnableAllProviders,
  initialTab = 'providers',
}) => {
  const [activeTab, setActiveTab] = useState<'providers' | 'custom' | 'backend'>(initialTab);
  const [cloudflareUrl, setCloudflareUrl] = useState(config.cloudflareUrl);

  // Custom Endpoint Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setCloudflareUrl(config.cloudflareUrl);
      setName('');
      setUrl('');
      setTestStatus('idle');
      setTestMessage(null);
    }
  }, [isOpen, initialTab, config.cloudflareUrl]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    const trimmedUrl = cloudflareUrl.trim();
    if (trimmedUrl) {
      try {
        const parsed = new URL(trimmedUrl);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return;
        }
      } catch {
        return;
      }
    }
    onSaveConfig({
      cloudflareUrl: trimmedUrl,
    });
    onClose();
    onRefreshAll();
  };

  const testEndpoint = async (targetUrl: string) => {
    if (!targetUrl) return;
    try {
      const parsed = new URL(targetUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        setTestStatus('error');
        setTestMessage('协议无效：仅支持 http:// 和 https://');
        return;
      }
    } catch {
      setTestStatus('error');
      setTestMessage('URL 格式无效');
      return;
    }

    setTestStatus('testing');
    setTestMessage(null);

    const startTime = performance.now();
    try {
      const res = await fetch(targetUrl, { cache: 'no-store' });
      const latency = Math.round(performance.now() - startTime);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        setTestStatus('success');
        setTestMessage(
          `成功！${latency}ms 内响应。检测到的 IP：${data.ip || data.query || 'N/A'}`
        );
      } else {
        const text = (await res.text()).trim();
        setTestStatus('success');
        setTestMessage(`成功！${latency}ms 内响应。输出：${text.slice(0, 40)}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'CORS 被拦截或无法访问';
      setTestStatus('error');
      setTestMessage(`失败：${errorMessage}`);
    }
  };

  const handleAddEndpoint = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        setTestStatus('error');
        setTestMessage('协议无效：仅支持 http:// 和 https://');
        return;
      }
    } catch {
      setTestStatus('error');
      setTestMessage('URL 格式无效');
      return;
    }

    let endpointName = name.trim();
    if (!endpointName) {
      endpointName = parsedUrl.hostname || '自定义节点';
    }

    const newEndpoint: CustomEndpoint = {
      id: Date.now().toString(),
      name: endpointName,
      url: trimmedUrl,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...endpoints, newEndpoint];
    onSaveEndpoints(updated);
    setName('');
    setUrl('');
    setTestStatus('idle');
    setTestMessage(null);
    onRefreshAll();
  };

  const handleDeleteEndpoint = (id: string) => {
    const updated = endpoints.filter((ep) => ep.id !== id);
    onSaveEndpoints(updated);
    onRefreshAll();
  };

  const handleToggleEndpoint = (id: string) => {
    const updated = endpoints.map((ep) => (ep.id === id ? { ...ep, enabled: !ep.enabled } : ep));
    onSaveEndpoints(updated);
    onRefreshAll();
  };

  const activeEndpointsCount = endpoints.filter((ep) => ep.enabled).length;
  const activePublicCount = PUBLIC_PROVIDERS.filter(
    (p) => !disabledProviderIds.includes(p.id)
  ).length;

  const getRegionBadgeClass = (tag?: string) => {
    if (!tag) return 'badge-cyan';
    if (tag.includes('中国')) return 'badge-rose';
    if (tag.includes('亚太')) return 'badge-amber';
    if (tag.includes('欧洲')) return 'badge-indigo';
    if (tag.includes('美国')) return 'badge-cyan';
    return 'badge-emerald';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>设置与 API 服务商</h3>
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

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab ${activeTab === 'providers' ? 'active' : ''}`}
            onClick={() => setActiveTab('providers')}
          >
            <Globe size={15} />
            <span>公共 API</span>
            <span
              className="badge badge-emerald"
              style={{ padding: '1px 6px', fontSize: '0.6875rem' }}
            >
              {activePublicCount}/{PUBLIC_PROVIDERS.length}
            </span>
          </button>

          <button
            type="button"
            className={`modal-tab ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            <Server size={15} />
            <span>自定义 API</span>
            {activeEndpointsCount > 0 && (
              <span
                className="badge badge-cyan"
                style={{ padding: '1px 6px', fontSize: '0.6875rem' }}
              >
                {activeEndpointsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`modal-tab ${activeTab === 'backend' ? 'active' : ''}`}
            onClick={() => setActiveTab('backend')}
          >
            <Cloud size={15} />
            <span>Worker 覆盖</span>
          </button>
        </div>

        <div className="modal-body">
          {/* TAB 1: Built-in Public Providers */}
          {activeTab === 'providers' && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                  根据你的地区与偏好，启用或停用各个公共查询服务。
                </p>
                {onEnableAllProviders && disabledProviderIds.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={onEnableAllProviders}
                    style={{ fontSize: '0.75rem', padding: '4px 8px', flexShrink: 0 }}
                  >
                    全部启用
                  </button>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '420px',
                  overflowY: 'auto',
                  paddingRight: '2px',
                }}
              >
                {PUBLIC_PROVIDERS.map((provider) => {
                  const isEnabled = !disabledProviderIds.includes(provider.id);
                  return (
                    <div
                      key={provider.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: isEnabled ? 'var(--bg-panel)' : 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isEnabled ? 'var(--border-subtle)' : 'var(--border-subtle)'}`,
                        opacity: isEnabled ? 1 : 0.6,
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <label
                        htmlFor={`provider-toggle-${provider.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          flex: 1,
                        }}
                      >
                        <input
                          id={`provider-toggle-${provider.id}`}
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => onToggleProvider(provider.id)}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              flexWrap: 'wrap',
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: 'var(--text-primary)',
                              }}
                            >
                              {provider.name}
                            </span>
                            {provider.regionTag && (
                              <span
                                className={`badge ${getRegionBadgeClass(provider.regionTag)}`}
                                style={{ fontSize: '0.6875rem', padding: '0 6px' }}
                              >
                                {provider.regionTag}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)',
                              marginTop: '2px',
                            }}
                          >
                            {provider.description}
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB 2: Custom Endpoints */}
          {activeTab === 'custom' && (
            <>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                添加自定义无服务器函数、Cloudflare Worker 或外部 IP API，实时交叉验证你的 IP 与延迟。
              </p>

              {/* Add New Endpoint Form */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="endpoint-name-input">
                    节点名称 / 标签
                  </label>
                  <input
                    id="endpoint-name-input"
                    className="form-input"
                    type="text"
                    placeholder="例如：我的自定义 Cloudflare Worker"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="endpoint-url-input">
                    节点 URL
                  </label>
                  <input
                    id="endpoint-url-input"
                    className="form-input"
                    type="url"
                    placeholder="https://my-ip.example.com/api/v1/info"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                {testMessage && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8125rem',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor:
                        testStatus === 'success'
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(244, 63, 94, 0.1)',
                      color: testStatus === 'success' ? 'var(--text-emerald)' : 'var(--text-rose)',
                      border: `1px solid ${
                        testStatus === 'success'
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(244, 63, 94, 0.2)'
                      }`,
                    }}
                  >
                    {testStatus === 'success' ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    <span>{testMessage}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => testEndpoint(url)}
                    disabled={!url.trim() || testStatus === 'testing'}
                  >
                    <Play size={14} />
                    <span>{testStatus === 'testing' ? '检测中…' : '测试 URL'}</span>
                  </button>

                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleAddEndpoint}
                    disabled={!url.trim()}
                  >
                    <Plus size={15} />
                    <span>添加节点</span>
                  </button>
                </div>
              </div>

              {/* List of Custom Endpoints */}
              <div>
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  已配置的节点（{endpoints.length} 个）
                </h4>

                {endpoints.length === 0 ? (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    尚未添加自定义节点，在上方添加一个试试！
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {endpoints.map((ep) => (
                      <div
                        key={ep.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          background: 'var(--bg-panel)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="checkbox"
                            checked={ep.enabled}
                            onChange={() => handleToggleEndpoint(ep.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: 'var(--text-primary)',
                              }}
                            >
                              {ep.name}
                            </div>
                            <div
                              className="mono"
                              style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                            >
                              {ep.url}
                            </div>
                          </div>
                        </div>

                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => handleDeleteEndpoint(ep.id)}
                          title="删除节点"
                          type="button"
                        >
                          <Trash2 size={15} color="var(--text-rose)" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 3: Backend Worker Override */}
          {activeTab === 'backend' && (
            <>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                默认情况下，本站通过 <code className="mono">/api/v1/info</code>{' '}
                查询自带的统一 Worker。你也可以在这里指定自定义或远程 Worker 地址进行覆盖或测试。
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cloud size={15} color="var(--text-cyan)" />
                    <label className="form-label" htmlFor="cloudflare-worker-url">
                      Cloudflare Worker 地址
                    </label>
                  </div>
                  <input
                    id="cloudflare-worker-url"
                    className="form-input"
                    type="url"
                    placeholder="https://my-ip-info.your-subdomain.workers.dev"
                    value={cloudflareUrl}
                    onChange={(e) => setCloudflareUrl(e.target.value)}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  marginTop: '0.5rem',
                }}
              >
                <button className="btn btn-ghost" onClick={onClose} type="button">
                  取消
                </button>
                <button className="btn btn-primary" onClick={handleSaveConfig} type="button">
                  <Save size={15} />
                  <span>保存并更新</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

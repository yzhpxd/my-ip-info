import {
  Globe,
  History,
  Menu,
  RefreshCw,
  Settings,
  Shield,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface NavbarProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenSettingsModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenPrivacyModal?: () => void;
  activeEndpointsCount: number;
  historyCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isRefreshing,
  onRefresh,
  onOpenSettingsModal,
  onOpenHistoryModal,
  onOpenPrivacyModal,
  activeEndpointsCount,
  historyCount,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <Globe size={22} />
        </div>
        <div className="brand-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-title">IP 信息</span>
          </div>
          <p className="nav-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            多源 IP 与网络连接智能
          </p>
        </div>
      </div>

      <div className="nav-actions">
        {/* Desktop actions: directly visible on wider screens */}
        <div className="nav-desktop-actions">
          <button
            className="btn btn-ghost"
            onClick={onOpenSettingsModal}
            title="配置自定义节点与 Cloudflare Worker"
            type="button"
          >
            <Settings size={16} />
            <span className="nav-btn-text">设置</span>
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
            className="btn btn-ghost"
            onClick={onOpenHistoryModal}
            title="查看本地 IP 连接历史"
            type="button"
          >
            <History size={16} />
            <span className="nav-btn-text">历史</span>
            {historyCount !== undefined && historyCount > 0 && (
              <span
                className="badge badge-indigo"
                style={{ padding: '1px 6px', fontSize: '0.6875rem' }}
              >
                {historyCount}
              </span>
            )}
          </button>

        </div>

        {/* Primary action: standalone on all screen sizes */}
        <button
          className="btn btn-primary"
          onClick={onRefresh}
          disabled={isRefreshing}
          type="button"
          title="刷新全部 IP 来源"
        >
          <RefreshCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
          <span className="nav-btn-text">{isRefreshing ? '检测中…' : '刷新'}</span>
        </button>

        {/* Mobile menu trigger and dropdown (visible only on mobile) */}
        <div className="nav-menu-wrapper">
          <button
            className="btn btn-ghost btn-icon nav-mobile-menu-btn"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            title="更多选项"
            type="button"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            {activeEndpointsCount > 0 && !isMenuOpen && (
              <span className="nav-menu-dot" title={`${activeEndpointsCount} 个已启用的自定义 API`} />
            )}
          </button>

          {isMenuOpen && (
            <>
              <div
                className="nav-dropdown-backdrop"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="nav-dropdown-menu" role="menu">
                <button
                  type="button"
                  className="nav-dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSettingsModal();
                  }}
                >
                  <Settings size={16} />
                  <span style={{ flex: 1 }}>设置与自定义 API</span>
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
                  className="nav-dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenHistoryModal();
                  }}
                >
                  <History size={16} />
                  <span style={{ flex: 1 }}>IP 历史</span>
                  {historyCount !== undefined && historyCount > 0 && (
                    <span
                      className="badge badge-indigo"
                      style={{ padding: '1px 6px', fontSize: '0.6875rem' }}
                    >
                      {historyCount}
                    </span>
                  )}
                </button>

                {onOpenPrivacyModal && (
                  <button
                    type="button"
                    className="nav-dropdown-item"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenPrivacyModal();
                    }}
                  >
                    <Shield size={16} />
                    <span>隐私政策</span>
                  </button>
                )}

              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};

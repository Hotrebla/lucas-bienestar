import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPwaButton: React.FC = () => {
  const [isInstallable, setIsInstallable] = useState(!!(window as any).deferredPrompt);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed / standalone
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Listen to custom installable event
    const handleInstallable = () => {
      setIsInstallable(true);
    };

    window.addEventListener('pwa-installable', handleInstallable);
    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
    };
  }, []);

  const isIos = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  };

  const handleInstallClick = async () => {
    if (isIos()) {
      setShowIosModal(true);
      return;
    }

    const promptEvent = (window as any).deferredPrompt;
    if (!promptEvent) return;

    // Trigger native prompt
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // Reset prompt event
    (window as any).deferredPrompt = null;
    setIsInstallable(false);
  };

  // If already installed, don't show the button
  if (isStandalone) return null;

  // Show if it is installable (Android/Desktop Chrome) OR if it is an iPhone (iOS is always installable manually)
  if (!isInstallable && !isIos()) return null;

  return (
    <>
      <motion.div
        className="install-pwa-banner card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="banner-content">
          <Smartphone className="banner-icon animate-pulse" />
          <div className="banner-text">
            <h4>Instala la App de Lucas</h4>
            <p>Juega más rápido, sin barras de navegación y con acceso offline.</p>
          </div>
        </div>
        <button className="btn btn-primary banner-btn" onClick={handleInstallClick}>
          Instalar <Download size={16} />
        </button>

        <style>{`
          .install-pwa-banner {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 14px 16px;
            border-color: var(--color-primary);
            border-width: 2px;
            background: linear-gradient(135deg, var(--bg-card) 0%, var(--color-primary-light) 100%);
            margin-bottom: 16px;
          }

          .banner-content {
            display: flex;
            align-items: center;
            gap: 12px;
            text-align: left;
            flex: 1;
          }

          .banner-icon {
            color: var(--color-primary);
            flex-shrink: 0;
            width: 24px;
            height: 24px;
          }

          .banner-text h4 {
            font-size: 0.9rem;
            color: var(--text-primary);
          }

          .banner-text p {
            font-size: 0.75rem;
            color: var(--text-secondary);
            line-height: 1.3;
            margin-top: 2px;
          }

          .banner-btn {
            padding: 8px 16px;
            font-size: 0.85rem;
            border-radius: 12px;
            flex-shrink: 0;
            box-shadow: 0 3px 0 #4f46e5;
          }

          .banner-btn:active {
            transform: translateY(3px);
            box-shadow: 0 0px 0 #4f46e5;
          }

          /* iOS Instructions Modal */
          .ios-modal-overlay {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: var(--mobile-width);
            background-color: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(4px);
            z-index: 300;
            display: flex;
            align-items: flex-end;
          }

          .ios-modal-card {
            width: 100%;
            background-color: var(--bg-card);
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            padding: 24px;
            text-align: center;
            box-shadow: 0 -8px 24px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            gap: 16px;
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }

          .ios-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .ios-modal-title {
            font-size: 1.15rem;
            color: var(--text-primary);
          }

          .ios-close-btn {
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-secondary);
          }

          .ios-steps {
            display: flex;
            flex-direction: column;
            gap: 14px;
            text-align: left;
            padding: 10px 0;
          }

          .ios-step {
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }

          .ios-step-num {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: var(--color-primary-light);
            color: var(--color-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 0.8rem;
            flex-shrink: 0;
          }

          .ios-step-text {
            font-size: 0.85rem;
            color: var(--text-secondary);
            line-height: 1.4;
          }

          .ios-icon-visual {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: var(--bg-app);
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid var(--border-color);
            margin: 0 4px;
            font-weight: bold;
          }
        `}</style>
      </motion.div>

      {/* iOS Modal */}
      <AnimatePresence>
        {showIosModal && (
          <div className="ios-modal-overlay" onClick={() => setShowIosModal(false)}>
            <div className="ios-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="ios-modal-header">
                <h3 className="ios-modal-title">Instalar en tu iPhone</h3>
                <button className="ios-close-btn" onClick={() => setShowIosModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="ios-steps">
                <div className="ios-step">
                  <div className="ios-step-num">1</div>
                  <div className="ios-step-text">
                    Toca el botón de <strong>Compartir</strong> en la barra inferior de Safari 
                    (el icono de un cuadrado con una flecha apuntando hacia arriba <ExternalLink size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />).
                  </div>
                </div>

                <div className="ios-step">
                  <div className="ios-step-num">2</div>
                  <div className="ios-step-text">
                    Desplázate hacia abajo y selecciona la opción <strong>Añadir a pantalla de inicio</strong> (Add to Home Screen).
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" onClick={() => setShowIosModal(false)}>
                Entendido
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

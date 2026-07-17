import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, ExternalLink, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPwaButton: React.FC = () => {
  const [hasPrompt, setHasPrompt] = useState(!!(window as any).deferredPrompt);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'pc' | 'android' | 'ios'>('pc');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed / running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Listen to custom installable event
    const handleInstallable = () => {
      setHasPrompt(true);
    };

    window.addEventListener('pwa-installable', handleInstallable);
    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
    };
  }, []);

  const isIos = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  };

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };

  // Set default tab based on user device
  useEffect(() => {
    if (isIos()) {
      setActiveTab('ios');
    } else if (isAndroid()) {
      setActiveTab('android');
    } else {
      setActiveTab('pc');
    }
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt;
    
    // If the browser supports the automatic install prompt, trigger it
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      (window as any).deferredPrompt = null;
      setHasPrompt(false);
    } else {
      // Otherwise, show the manual installation guide modal
      setShowModal(true);
    }
  };

  // If already installed, don't show the button
  if (isStandalone) return null;

  return (
    <>
      <motion.div
        className="install-pwa-banner card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="banner-content">
          <Smartphone className="banner-icon animate-pulse" />
          <div className="banner-text">
            <h4>Descarga la App de Lucas</h4>
            <p>Juega más rápido, en pantalla completa y con acceso offline.</p>
          </div>
        </div>
        <button className="btn btn-primary banner-btn" onClick={handleInstallClick}>
          {hasPrompt ? 'Instalar' : 'Cómo Instalar'} <Download size={16} />
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
            border-width: 2.5px;
            background: linear-gradient(135deg, var(--bg-card) 0%, rgba(79, 70, 229, 0.05) 100%);
            margin-bottom: 16px;
            border-radius: 16px;
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
            font-weight: 800;
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
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 3px 0 #4f46e5;
          }

          .banner-btn:active {
            transform: translateY(3px);
            box-shadow: 0 0px 0 #4f46e5;
          }

          /* Universal Installation Modal */
          .pwa-modal-overlay {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: var(--mobile-width);
            background-color: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(4px);
            z-index: 300;
            display: flex;
            align-items: flex-end;
          }

          .pwa-modal-card {
            width: 100%;
            background-color: var(--bg-card);
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            padding: 24px;
            text-align: center;
            box-shadow: 0 -8px 24px rgba(0,0,0,0.25);
            display: flex;
            flex-direction: column;
            gap: 16px;
            animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            border-top: 3px solid var(--color-primary);
          }

          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }

          .pwa-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .pwa-modal-title {
            font-size: 1.2rem;
            color: var(--text-primary);
            font-weight: 800;
          }

          .pwa-close-btn {
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 4px;
          }

          /* Custom Tabs in Modal */
          .modal-tabs {
            display: flex;
            border-bottom: 2px solid var(--border-color);
            gap: 4px;
          }

          .modal-tab-btn {
            flex: 1;
            padding: 10px;
            font-size: 0.8rem;
            font-weight: 700;
            border: none;
            background: none;
            color: var(--text-secondary);
            border-bottom: 3px solid transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
          }

          .modal-tab-btn.active {
            color: var(--color-primary);
            border-bottom-color: var(--color-primary);
          }

          .pwa-steps {
            display: flex;
            flex-direction: column;
            gap: 12px;
            text-align: left;
            padding: 10px 0;
            min-height: 120px;
          }

          .pwa-step {
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }

          .pwa-step-num {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: var(--color-primary-light);
            color: var(--color-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 0.75rem;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .pwa-step-text {
            font-size: 0.85rem;
            color: var(--text-secondary);
            line-height: 1.4;
          }

          .pwa-highlight {
            font-weight: 700;
            color: var(--text-primary);
          }
        `}</style>
      </motion.div>

      {/* Manual Installation Guide Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="pwa-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="pwa-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="pwa-modal-header">
                <h3 className="pwa-modal-title">Cómo Instalar la App</h3>
                <button className="pwa-close-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="modal-tabs">
                <button 
                  className={`modal-tab-btn ${activeTab === 'pc' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pc')}
                >
                  <Laptop size={14} /> PC (Chrome/Edge)
                </button>
                <button 
                  className={`modal-tab-btn ${activeTab === 'android' ? 'active' : ''}`}
                  onClick={() => setActiveTab('android')}
                >
                  <Smartphone size={14} /> Android
                </button>
                <button 
                  className={`modal-tab-btn ${activeTab === 'ios' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ios')}
                >
                  <Smartphone size={14} /> iPhone (iOS)
                </button>
              </div>

              {/* Steps by Tab */}
              <div className="pwa-steps">
                {activeTab === 'pc' && (
                  <>
                    <div className="pwa-step">
                      <div className="pwa-step-num">1</div>
                      <div className="pwa-step-text">
                        En <span className="pwa-highlight">Google Chrome</span> o <span className="pwa-highlight">Microsoft Edge</span>, busca el icono de <strong>Instalación</strong> (computadora con una flecha hacia abajo) en el extremo derecho de la barra de direcciones.
                      </div>
                    </div>
                    <div className="pwa-step">
                      <div className="pwa-step-num">2</div>
                      <div className="pwa-step-text">
                        Haz clic en él y selecciona <span className="pwa-highlight">Instalar</span>. ¡O ve al menú de 3 puntos (arriba a la derecha) ➜ <strong>Guardar y Compartir</strong> ➜ <strong>Instalar página como aplicación</strong>!
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'android' && (
                  <>
                    <div className="pwa-step">
                      <div className="pwa-step-num">1</div>
                      <div className="pwa-step-text">
                        Abre la aplicación en Chrome desde tu celular.
                      </div>
                    </div>
                    <div className="pwa-step">
                      <div className="pwa-step-num">2</div>
                      <div className="pwa-step-text">
                        Toca el menú de 3 puntos arriba a la derecha y selecciona la opción <strong>Añadir a la pantalla de inicio</strong> o <strong>Instalar aplicación</strong>.
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'ios' && (
                  <>
                    <div className="pwa-step">
                      <div className="pwa-step-num">1</div>
                      <div className="pwa-step-text">
                        Abre el enlace en el navegador <span className="pwa-highlight">Safari</span> de tu iPhone.
                      </div>
                    </div>
                    <div className="pwa-step">
                      <div className="pwa-step-num">2</div>
                      <div className="pwa-step-text">
                        Toca el botón <strong>Compartir</strong> (icono de un cuadrado con una flecha hacia arriba <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />) en la barra inferior.
                      </div>
                    </div>
                    <div className="pwa-step">
                      <div className="pwa-step-num">3</div>
                      <div className="pwa-step-text">
                        Desplázate hacia abajo y selecciona <strong>Añadir a pantalla de inicio</strong>.
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button className="btn btn-primary" onClick={() => setShowModal(false)} style={{ width: '100%', padding: '12px' }}>
                Entendido
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

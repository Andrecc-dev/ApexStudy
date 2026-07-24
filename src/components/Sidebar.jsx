import React, { useState, useEffect } from 'react';
import { X, Calendar, Target, HelpCircle, Moon, Sun, Eye } from 'lucide-react';

export default function Sidebar({ 
  isOpen, 
  onClose, 
  abaAtiva, 
  setAbaAtiva, 
  abrirTutorial,
  temaAtual,
  setTemaAtual 
}) {
  // Controle interno para permitir que a animação de saída termine antes de desmontar o componente
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  // Se não estiver aberto nem em processo de fechamento, não renderiza nada
  if (!shouldRender) return null;

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  const navegarPara = (aba) => {
    setAbaAtiva(aba);
    onClose();
  };

  return (
    <>
      {/* 1. Fundo escuro com Fade-in / Fade-out */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 998,
          backdropFilter: 'blur(3px)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />

      {/* 2. Menu Lateral Gaveta com Slide-in / Slide-out */}
      <aside
        onTransitionEnd={handleAnimationEnd}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '260px',
          height: '100vh',
          backgroundColor: 'var(--bg-secondary, #0f172a)',
          borderRight: '1px solid var(--border-color, #334155)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 16px',
          boxSizing: 'border-box',
          boxShadow: '4px 0 16px rgba(0,0,0,0.5)',
          // Transição de Deslizamento Lateral (Slide)
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Topo do Menu */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent-text, #60a5fa)', fontWeight: 'bold' }}>
            ApexStudy
          </h3>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-secondary, #94a3b8)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Links de Navegação */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748b)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '4px' }}>
            Módulos
          </span>

          <button
            onClick={() => navegarPara('rotina')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: abaAtiva === 'rotina' ? 'var(--accent-color, #2563eb)' : 'transparent',
              color: abaAtiva === 'rotina' ? '#fff' : 'var(--text-primary, #cbd5e1)',
              fontWeight: '500',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.2s'
            }}
          >
            <Calendar size={18} /> Rotina de Estudos
          </button>

          <button
            onClick={() => navegarPara('questoes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: abaAtiva === 'questoes' ? 'var(--accent-color, #2563eb)' : 'transparent',
              color: abaAtiva === 'questoes' ? '#fff' : 'var(--text-primary, #cbd5e1)',
              fontWeight: '500',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.2s'
            }}
          >
            <Target size={18} /> Banco de Questões
          </button>
        </nav>

        {/* SELETOR DE TEMAS */}
        <div style={{ marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color, #334155)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748b)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            Aparência / Tema
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', backgroundColor: 'var(--bg-primary, #0f172a)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color, #334155)' }}>
            <button
              onClick={() => setTemaAtual('dark')}
              title="Tema Escuro"
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: temaAtual === 'dark' ? 'var(--accent-color, #2563eb)' : 'transparent',
                color: temaAtual === 'dark' ? '#fff' : 'var(--text-secondary, #94a3b8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Moon size={16} />
            </button>

            <button
              onClick={() => setTemaAtual('light')}
              title="Tema Claro"
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: temaAtual === 'light' ? 'var(--accent-color, #2563eb)' : 'transparent',
                color: temaAtual === 'light' ? '#fff' : 'var(--text-secondary, #94a3b8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sun size={16} />
            </button>

            <button
              onClick={() => setTemaAtual('high-contrast')}
              title="Alto Contraste"
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: temaAtual === 'high-contrast' ? 'var(--accent-color, #ffff00)' : 'transparent',
                color: temaAtual === 'high-contrast' ? '#000' : 'var(--text-secondary, #94a3b8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Rodapé (Central de Ajuda) */}
        <div>
          <button
            onClick={() => {
              onClose();
              abrirTutorial();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--border-color, #334155)',
              backgroundColor: 'var(--bg-card, #1e293b)',
              color: 'var(--accent-text, #38bdf8)',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={18} /> Como usar este módulo?
          </button>
        </div>
      </aside>
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { X, Calendar, Target, FileText, RefreshCw, BarChart2, HelpCircle, Moon, Sun, Eye } from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  abaAtiva,
  setAbaAtiva,
  abrirTutorial,
  temaAtual,
  setTemaAtual,
  escalaFonte,
  setEscalaFonte
}) {
  if (!isOpen) return null;

  const diminuirFonte = () => {
    if (escalaFonte > 85) setEscalaFonte(escalaFonte - 5);
  };

  const aumentarFonte = () => {
    if (escalaFonte < 125) setEscalaFonte(escalaFonte + 5);
  };

  const resetarFonte = () => {
    setEscalaFonte(100);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 999,
        display: 'flex'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '280px',
          height: '100%',
          backgroundColor: 'var(--bg-card, #1e293b)',
          borderRight: '1px solid var(--border-color, #334155)',
          padding: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* PARTE SUPERIOR: TÍTULO E MÓDULOS */}
        <div>
          {/* Header do Menu */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}
          >
            {/* LOGO ADICIONADA AQUI */}
            <img 
              src="/images/LogoOficial.png" 
              alt="ApexStudy" 
              style={{ height: '64px', objectFit: 'contain' }} 
            />
            
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
              <X size={20} />
            </button>
          </div>

          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 'bold',
              color: 'var(--text-secondary, #64748b)',
              letterSpacing: '1px',
              display: 'block',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}
          >
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
              textAlign: 'left'
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
              textAlign: 'left'
            }}
          >
            <Target size={18} /> Banco de Questões
          </button>

          <button
            onClick={() => navegarPara('simulados')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: abaAtiva === 'simulados' ? 'var(--accent-color, #2563eb)' : 'transparent',
              color: abaAtiva === 'simulados' ? '#fff' : 'var(--text-primary, #cbd5e1)',
              fontWeight: '500',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <FileText size={18} /> Registro de Simulados
          </button>

          <button
            onClick={() => navegarPara('revisoes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: abaAtiva === 'revisoes' ? 'var(--accent-color, #2563eb)' : 'transparent',
              color: abaAtiva === 'revisoes' ? '#fff' : 'var(--text-primary, #cbd5e1)',
              fontWeight: '500',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <RefreshCw size={18} /> Sistema de Revisões
          </button>

          {/* NOVO ITEM: GRÁFICOS E DESEMPENHO */}
          <button
            onClick={() => navegarPara('graficos')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: abaAtiva === 'graficos' ? 'var(--accent-color, #2563eb)' : 'transparent',
              color: abaAtiva === 'graficos' ? '#fff' : 'var(--text-primary, #cbd5e1)',
              fontWeight: '500',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <BarChart2 size={18} /> Gráficos e Desempenho
          </button>
        </div>

        {/* CONTROLE DE TAMANHO DA FONTE */}
        <div style={{ marginBottom: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color, #334155)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748b)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
              Tamanho do Texto
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text, #60a5fa)' }}>
              {escalaFonte}%
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            <button
              onClick={() => {
                setAbaAtiva('rotina');
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor:
                  abaAtiva === 'rotina'
                    ? 'var(--accent-color, #2563eb)'
                    : 'transparent',
                color:
                  abaAtiva === 'rotina'
                    ? 'var(--text-on-accent, #fff)'
                    : 'var(--text-primary, #e2e8f0)',
                fontWeight: abaAtiva === 'rotina' ? 'bold' : 'normal',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <BookOpen size={18} />
              Rotina de Estudos
            </button>

            {/* 2. Módulo Banco de Questões */}
            <button
              onClick={() => {
                setAbaAtiva('questoes');
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor:
                  abaAtiva === 'questoes'
                    ? 'var(--accent-color, #2563eb)'
                    : 'transparent',
                color:
                  abaAtiva === 'questoes'
                    ? 'var(--text-on-accent, #fff)'
                    : 'var(--text-primary, #e2e8f0)',
                fontWeight: abaAtiva === 'questoes' ? 'bold' : 'normal',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Target size={18} />
              Banco de Questões
            </button>
          </div>
        </div>

        {/* PARTE INFERIOR: CONFIGURAÇÕES E TEMA */}
        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border-color, #334155)',
              marginBottom: '16px'
            }}
          />

          {/* Controle de Fonte */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  color: 'var(--text-secondary, #64748b)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                Tamanho do Texto
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: 'var(--accent-text, #60a5fa)'
                }}
              >
                {escalaFonte}%
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                onClick={diminuirFonte}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #475569)',
                  backgroundColor: 'var(--bg-primary, #0f172a)',
                  color: 'var(--text-primary, #fff)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                A -
              </button>
              <button
                onClick={resetarFonte}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--accent-color, #2563eb)',
                  color: 'var(--text-on-accent, #fff)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                100%
              </button>
              <button
                onClick={aumentarFonte}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #475569)',
                  backgroundColor: 'var(--bg-primary, #0f172a)',
                  color: 'var(--text-primary, #fff)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                A +
              </button>
            </div>
          </div>

          {/* Seleção de Tema */}
          <div style={{ marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: 'var(--text-secondary, #64748b)',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}
            >
              Aparência / Tema
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              {/* Tema Escuro */}
              <button
                onClick={() => setTemaAtual('dark')}
                title="Tema Escuro"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border:
                    temaAtual === 'dark'
                      ? '1px solid var(--accent-color, #2563eb)'
                      : '1px solid var(--border-color, #475569)',
                  backgroundColor:
                    temaAtual === 'dark'
                      ? 'var(--accent-color, #2563eb)'
                      : 'var(--bg-primary, #0f172a)',
                  color:
                    temaAtual === 'dark'
                      ? 'var(--text-on-accent, #fff)'
                      : 'var(--text-primary, #fff)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Moon size={16} />
              </button>

              {/* Tema Claro */}
              <button
                onClick={() => setTemaAtual('light')}
                title="Tema Claro"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border:
                    temaAtual === 'light'
                      ? '1px solid var(--accent-color, #2563eb)'
                      : '1px solid var(--border-color, #475569)',
                  backgroundColor:
                    temaAtual === 'light'
                      ? 'var(--accent-color, #2563eb)'
                      : 'var(--bg-primary, #0f172a)',
                  color:
                    temaAtual === 'light'
                      ? 'var(--text-on-accent, #fff)'
                      : 'var(--text-primary, #fff)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Sun size={16} />
              </button>

              {/* Alto Contraste */}
              <button
                onClick={() => setTemaAtual('high-contrast')}
                title="Alto Contraste"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border:
                    temaAtual === 'high-contrast'
                      ? '1px solid var(--accent-color, #2563eb)'
                      : '1px solid var(--border-color, #475569)',
                  backgroundColor:
                    temaAtual === 'high-contrast'
                      ? 'var(--accent-color, #2563eb)'
                      : 'var(--bg-primary, #0f172a)',
                  color:
                    temaAtual === 'high-contrast'
                      ? 'var(--text-on-accent, #fff)'
                      : 'var(--text-primary, #fff)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Eye size={16} />
              </button>
            </div>
          </div>

          {/* Botão de Tutorial */}
          <button
            onClick={() => {
              abrirTutorial();
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--bg-primary, #0f172a)',
              color: 'var(--accent-text, #2563eb)',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={16} /> Como usar este módulo?
          </button>

          {/* Créditos */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border-color, #334155)',
              margin: '16px 0 12px 0'
            }}
          />
          <p
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-secondary, #64748b)',
              textAlign: 'center',
              margin: 0
            }}
          >
            Desenvolvido por{' '}
            <strong style={{ color: 'var(--accent-text, #60a5fa)' }}>
              André Cunha
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
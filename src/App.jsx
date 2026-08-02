import React, { useState, useEffect } from 'react';
import { Download, HelpCircle, X } from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RotinaEstudos from './components/RotinaEstudos';
import BancoQuestoes from './components/BancoQuestoes';
import RegistroSimulados from './components/RegistroSimulados';
import SistemaRevisoes from './components/SistemaRevisoes';
import Graficos from './components/Graficos';

const rotinaInicial = {
  Segunda: [{ id: 1, materia: 'Matemática', bloco: 'Geometria Plana', tempo: 50, concluido: false }, { id: 2, materia: 'Português', bloco: 'Interpretação de Texto', tempo: 50, concluido: false }],
  Terca: [{ id: 3, materia: 'História', bloco: 'Brasil Colônia', tempo: 50, concluido: false }],
  Quarta: [{ id: 4, materia: 'Biologia', bloco: 'Ecologia', tempo: 50, concluido: false }],
  Quinta: [{ id: 5, materia: 'Redação', bloco: 'Introdução e Tese', tempo: 50, concluido: false }],
  Sexta: [{ id: 6, materia: 'Física', bloco: 'Cinemática', tempo: 50, concluido: false }],
  Sabado: [{ id: 7, materia: 'Revisão Geral', bloco: 'Resolução de Questões', tempo: 50, concluido: false }],
  Domingo: []
};

export default function App() {

  // Estado da Escala da Fonte
  const [escalaFonte, setEscalaFonte] = useState(() => {
    return Number(localStorage.getItem('apexstudy_fonte')) || 100;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${escalaFonte}%`;
    localStorage.setItem('apexstudy_fonte', escalaFonte);
  }, [escalaFonte]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('rotina'); 

  // Gestão de Tema
  const [tema, setTema] = useState(() => localStorage.getItem('apexstudy_tema') || 'dark');

  // CRONOGRAMA: Mantido aqui porque os Gráficos precisam dele!
  const [cronograma, setCronograma] = useState(() => JSON.parse(localStorage.getItem('apexstudy_cronograma')) || rotinaInicial);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [mostrarAjudaInstalacao, setMostrarAjudaInstalacao] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('apexstudy_tema', tema);
  }, [tema]);

  useEffect(() => {
    const handleBeforeInstall = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Salva cronograma quando houver alteração
  useEffect(() => { 
    localStorage.setItem('apexstudy_cronograma', JSON.stringify(cronograma)); 
  }, [cronograma]);

  const instalarApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      if ((await deferredPrompt.userChoice).outcome === 'accepted') setDeferredPrompt(null);
    } else {
      setMostrarAjudaInstalacao(true);
    }
  };

  // --- LÓGICA DE INTEGRAÇÃO COM GRÁFICOS ---
  const gerarDadosGrafico = () => {
    const estatisticas = {};
    
    Object.values(cronograma).flat().forEach((tarefa) => {
      if (tarefa.concluido) {
        if (!estatisticas[tarefa.materia]) {
          estatisticas[tarefa.materia] = { name: tarefa.materia, blocos: 0, tempoMinutos: 0 };
        }
        estatisticas[tarefa.materia].blocos += 1;
        estatisticas[tarefa.materia].tempoMinutos += (Number(tarefa.tempo) || 50);
      }
    });

    return Object.values(estatisticas); 
  };

  const dadosEstudo = gerarDadosGrafico();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary, #0f172a)', color: 'var(--text-primary, #e2e8f0)', fontFamily: 'sans-serif', transition: 'background-color 0.3s, color 0.3s', display: 'flex', flexDirection: 'column' }}>
      
      <Header onOpenMenu={() => setIsMenuOpen(true)} onOpenTutorial={() => setIsTutorialOpen(true)} />

      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        abrirTutorial={() => setIsTutorialOpen(true)}
        temaAtual={tema}
        setTemaAtual={setTema}
        escalaFonte={escalaFonte}
        setEscalaFonte={setEscalaFonte}
      />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '16px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Banner PWA */}
        <div style={{ backgroundColor: 'var(--accent-color, #2563eb)', color: 'var(--text-on-accent, #fff)', padding: '8px 12px', borderRadius: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
          <span>Quer usar como App no seu Celular/PC?</span>
          <button onClick={instalarApp} style={{ backgroundColor: 'var(--bg-card, #fff)', color: 'var(--accent-text, #2563eb)', border: 'none', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Download size={14} /> Instalar
          </button>
        </div>

        {mostrarAjudaInstalacao && <AjudaInstalacaoModal onClose={() => setMostrarAjudaInstalacao(false)} />}

        {/* NAVEGAÇÃO DE ABAS */}
        
        {abaAtiva === 'rotina' && (
           <RotinaEstudos cronograma={cronograma} setCronograma={setCronograma} />
        )}

        {abaAtiva === 'questoes' && <BancoQuestoes />}

        {abaAtiva === 'simulados' && <RegistroSimulados />}

        {abaAtiva === 'revisoes' && <SistemaRevisoes />}

        {abaAtiva === 'graficos' && <Graficos dadosEstudo={dadosEstudo} />}

      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '20px 16px', 
        fontSize: '0.75rem', 
        color: 'var(--text-secondary, #64748b)',
        borderTop: '1px solid var(--border-color, #1e293b)',
        marginTop: 'auto'
      }}>
        <p style={{ margin: 0 }}>
          <strong style={{ color: 'var(--text-primary, #cbd5e1)' }}>ApexStudy v2.0</strong> • Desenvolvido por <span style={{ color: 'var(--accent-text, #60a5fa)', fontWeight: '600' }}>André Cunha</span>
        </p>
      </footer>

      {isTutorialOpen && <CentralDuvidasModal abaAtiva={abaAtiva} onClose={() => setIsTutorialOpen(false)} />}
    </div>
  );
}

// Subcomponente Auxiliar: PWA Ajuda
function AjudaInstalacaoModal({ onClose }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', border: '1px solid var(--accent-color, #3b82f6)', padding: '12px', borderRadius: '10px', marginBottom: '16px', position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'var(--text-secondary, #94a3b8)', cursor: 'pointer' }}><X size={16} /></button>
      <h4 style={{ color: 'var(--accent-text, #60a5fa)', marginBottom: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><HelpCircle size={16} /> Instalar na Tela Inicial:</h4>
      <ul style={{ fontSize: '0.75rem', color: 'var(--text-primary, #cbd5e1)', paddingLeft: '16px', margin: 0 }}>
        <li><b>iOS (Safari):</b> Botão Compartilhar &rarr; "Adicionar à Tela de Início".</li>
        <li><b>Android (Chrome):</b> Menu (3 pontos) &rarr; "Instalar aplicativo".</li>
      </ul>
    </div>
  );
}

// Subcomponente Auxiliar: Central de Dúvidas
function CentralDuvidasModal({ abaAtiva, onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px', boxSizing: 'border-box' }}>
      <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', borderRadius: '12px', border: '1px solid var(--border-color, #334155)', width: '100%', maxWidth: '440px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, color: 'var(--accent-text, #60a5fa)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}><HelpCircle size={20} /> Como usar esse módulo?</h3>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-secondary, #94a3b8)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        
        {abaAtiva === 'questoes' && <p style={{ fontSize: '0.85rem', color: 'var(--text-primary, #cbd5e1)' }}>Cadastre suas resoluções de questões por matéria. O ApexStudy calcula sua taxa de acertos e identifica onde você precisa focar mais!</p>}
        {abaAtiva === 'rotina' && <p style={{ fontSize: '0.85rem', color: 'var(--text-primary, #cbd5e1)' }}>Organize seu cronograma semanal, controle o tempo com o timer Pomodoro e acompanhe seu progresso de estudo por dia.</p>}
        {abaAtiva === 'simulados' && <p style={{ fontSize: '0.85rem', color: 'var(--text-primary, #cbd5e1)' }}>Registre seus simulados prestados, escolha provas oficiais ou crie modelos customizados de cursinhos e acompanhe o aproveitamento detalhado por matéria.</p>}
        {abaAtiva === 'revisoes' && <p style={{ fontSize: '0.85rem', color: 'var(--text-primary, #cbd5e1)' }}>Agende tópicos para revisar usando o método de repetição espaçada. O sistema lembra o que você precisa revisar hoje e gerencia as datas futuras!</p>}
        {abaAtiva === 'graficos' && <p style={{ fontSize: '0.85rem', color: 'var(--text-primary, #cbd5e1)' }}>Acompanhe gráficos visuais de desempenho, evolução temporal da sua taxa de acertos e distribuição por matéria.</p>}

        <button onClick={onClose} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--accent-color, #2563eb)', color: '#fff', fontWeight: 'bold', marginTop: '12px', cursor: 'pointer' }}>Entendi</button>
      </div>
    </div>
  );
}
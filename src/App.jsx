import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Circle, BookOpen, Clock, Plus, Trash2, Calendar as CalendarIcon, Award, Flame, BellRing, Download, HelpCircle, X } from 'lucide-react';

const DIAS = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

const CORES_MATERIA = {
  Matemática: '#3b82f6',
  Português: '#ec4899',
  Redação: '#ef4444',
  Física: '#8b5cf6',
  Química: '#10b981',
  Biologia: '#22c55e',
  História: '#f59e0b',
  Geografia: '#d97706',
  'Filosofia/Sociologia': '#a855f7',
  'Revisão Geral': '#06b6d4',
  Outro: '#64748b'
};

const rotinaInicial = {
  Segunda: [
    { id: 1, materia: 'Matemática', bloco: 'Geometria Plana', tempo: 50, concluido: false },
    { id: 2, materia: 'Português', bloco: 'Interpretação de Texto', tempo: 50, concluido: false },
  ],
  Terca: [{ id: 3, materia: 'História', bloco: 'Brasil Colônia', tempo: 50, concluido: false }],
  Quarta: [{ id: 4, materia: 'Biologia', bloco: 'Ecologia', tempo: 50, concluido: false }],
  Quinta: [{ id: 5, materia: 'Redação', bloco: 'Introdução e Tese', tempo: 50, concluido: false }],
  Sexta: [{ id: 6, materia: 'Física', bloco: 'Cinemática', tempo: 50, concluido: false }],
  Sabado: [{ id: 7, materia: 'Revisão Geral', bloco: 'Resolução de Questões', tempo: 50, concluido: false }],
  Domingo: []
};

export default function App() {
  const hojeIndice = new Date().getDay();
  const [diaAtual, setDiaAtual] = useState(DIAS[hojeIndice]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);

  const [cronograma, setCronograma] = useState(() => {
    const salvo = localStorage.getItem('apexstudy_cronograma');
    return salvo ? JSON.parse(salvo) : rotinaInicial;
  });

  const [tempoRestante, setTempoRestante] = useState(50 * 60);
  const [rodando, setRodando] = useState(false);
  const [tempoFinalizado, setTempoFinalizado] = useState(false);

  const [novaMateria, setNovaMateria] = useState('Matemática');
  const [novoTopico, setNovoTopico] = useState('');
  const [novoTempo, setNovoTempo] = useState(50);
  const [mostrarForm, setMostrarForm] = useState(false);

  // Estados para facilitar a instalação
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [mostrarAjudaInstalacao, setMostrarAjudaInstalacao] = useState(false);

  // Captura o evento nativo de instalação do navegador
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const instalarApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setMostrarAjudaInstalacao(true);
    }
  };

  const tocarSomAlarme = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log('Áudio não suportado.');
    }
  };

  useEffect(() => {
    localStorage.setItem('apexstudy_cronograma', JSON.stringify(cronograma));
  }, [cronograma]);

  useEffect(() => {
    let intervalo = null;
    if (rodando && tempoRestante > 0) {
      intervalo = setInterval(() => setTempoRestante((t) => t - 1), 1000);
    } else if (tempoRestante === 0 && rodando) {
      setRodando(false);
      setTempoFinalizado(true);
      tocarSomAlarme();
    }
    return () => clearInterval(intervalo);
  }, [rodando, tempoRestante]);

  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
  };

  const ajustarTempo = (minutos) => {
    setTempoFinalizado(false);
    setTempoRestante((prev) => Math.max(0, prev + minutos * 60));
  };

  const resetarTimer = () => {
    setRodando(false);
    setTempoFinalizado(false);
    setTempoRestante(50 * 60);
  };

  const alternarConclusao = (id) => {
    const novo = { ...cronograma };
    novo[diaAtual] = (novo[diaAtual] || []).map((item) =>
      item.id === id ? { ...item, concluido: !item.concluido } : item
    );
    setCronograma(novo);
  };

  const deletarTarefa = (id, e) => {
    e.stopPropagation();
    const novo = { ...cronograma };
    novo[diaAtual] = novo[diaAtual].filter((item) => item.id !== id);
    setCronograma(novo);
  };

  const adicionarTarefa = (e) => {
    e.preventDefault();
    if (!novaMateria.trim()) return;

    const nova = {
      id: Date.now(),
      materia: novaMateria,
      bloco: novoTopico || 'Estudo Geral',
      tempo: Number(novoTempo) || 50,
      concluido: false
    };

    const novoCronograma = { ...cronograma };
    novoCronograma[diaAtual] = [...(novoCronograma[diaAtual] || []), nova];
    
    setCronograma(novoCronograma);
    setNovoTopico('');
    setMostrarForm(false);
  };

  const todasTarefas = Object.values(cronograma).flat();
  const totalBlocosConcluidos = todasTarefas.filter((t) => t.concluido).length;
  const totalMinutosEstudados = todasTarefas
    .filter((t) => t.concluido)
    .reduce((acc, curr) => acc + (curr.tempo || 50), 0);

  const tarefasDoDia = cronograma[diaAtual] || [];
  const concluidasDia = tarefasDoDia.filter((t) => t.concluido).length;
  const progresso = tarefasDoDia.length > 0 ? Math.round((concluidasDia / tarefasDoDia.length) * 100) : 0;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', color: '#e2e8f0' }}>
      
      {/* 📲 Banner/Botão Facilitado para Baixar/Instalar o App */}
      <div style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 12px', borderRadius: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
        <span style={{ fontWeight: '500' }}>Quer usar como App no seu Celular/PC?</span>
        <button
          onClick={instalarApp}
          style={{ backgroundColor: '#fff', color: '#2563eb', border: 'none', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Download size={14} /> Instalar
        </button>
      </div>

      {/* Header */}
      <header style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen /> ApexStudy Axios
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Seu progresso diário em foco.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e293b', padding: '6px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
          <CalendarIcon size={16} color="#60a5fa" />
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => {
              setDataSelecionada(e.target.value);
              const data = new Date(e.target.value + 'T00:00:00');
              setDiaAtual(DIAS[data.getDay()]);
            }}
            style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
          />
        </div>
      </header>

      {/* Modal / Caixinha de Ajuda de Instalação caso o navegador não responda automático */}
      {mostrarAjudaInstalacao && (
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', padding: '14px', borderRadius: '10px', marginBottom: '16px', position: 'relative' }}>
          <button onClick={() => setMostrarAjudaInstalacao(false)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={16} />
          </button>
          <h4 style={{ color: '#60a5fa', marginBottom: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={16} /> Como criar o ícone na sua tela:
          </h4>
          <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li><strong>iPhone (Safari):</strong> Clique no botão de <i>Compartilhar</i> (quadrado com seta) e selecione <b>"Adicionar à Tela de Início"</b>.</li>
            <li><strong>Android (Chrome):</strong> Clique nos 3 pontinhos no topo e selecione <b>"Adicionar à tela inicial"</b> ou <b>"Instalar aplicativo"</b>.</li>
            <li><strong>Computador:</strong> Clique nos 3 pontinhos do navegador $\rightarrow$ <i>Mais Ferramentas</i> $\rightarrow$ <b>"Criar Atalho..."</b>.</li>
          </ul>
        </div>
      )}

      {/* Cards de Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Flame color="#f97316" size={24} />
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Blocos Concluídos</span>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{totalBlocosConcluidos} blocos</h4>
          </div>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award color="#eab308" size={24} />
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tempo Acumulado</span>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{(totalMinutosEstudados / 60).toFixed(1)} hrs</h4>
          </div>
        </div>
      </div>

      {/* Dias da Semana */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px' }}>
        {['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'].map((dia) => (
          <button
            key={dia}
            onClick={() => setDiaAtual(dia)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: diaAtual === dia ? '#2563eb' : '#1e293b',
              color: '#fff',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.8rem',
              fontWeight: diaAtual === dia ? 'bold' : 'normal',
              boxShadow: diaAtual === dia ? '0 0 10px rgba(37, 99, 235, 0.5)' : 'none'
            }}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Cronômetro */}
      <div style={{ 
        backgroundColor: tempoFinalizado ? '#1e1b4b' : '#1e293b', 
        borderRadius: '12px', 
        padding: '16px', 
        marginBottom: '20px', 
        textAlign: 'center', 
        border: tempoFinalizado ? '2px solid #6366f1' : '1px solid #334155',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', color: tempoFinalizado ? '#818cf8' : '#94a3b8', fontSize: '0.85rem', marginBottom: '6px' }}>
          {tempoFinalizado ? <BellRing size={16} color="#818cf8" /> : <Clock size={15} />} 
          {tempoFinalizado ? 'Bloco Concluído! Hora do Descanso 🎉' : 'Bloco de Foco'}
        </div>

        <div style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'monospace', color: tempoFinalizado ? '#818cf8' : '#f8fafc', margin: '4px 0' }}>
          {formatarTempo(tempoRestante)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <button onClick={() => ajustarTempo(-5)} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer' }}>-5 min</button>
          <button onClick={() => ajustarTempo(5)} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer' }}>+5 min</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={() => { setTempoFinalizado(false); setRodando(!rodando); }}
            style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', backgroundColor: rodando ? '#e11d48' : '#16a34a', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
          >
            {rodando ? <Pause size={16} /> : <Play size={16} />}
            {rodando ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={resetarTimer}
            style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={16} /> Resetar
          </button>
        </div>
      </div>

      {/* Progresso do Dia */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
          <span>Progresso de {diaAtual} ({concluidasDia}/{tarefasDoDia.length})</span>
          <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>{progresso}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${progresso}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Adicionar Matéria */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1rem', color: '#cbd5e1' }}>Matérias Agendadas</h3>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
        >
          <Plus size={16} /> Nova Matéria
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={adicionarTarefa} style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <select
            value={novaMateria}
            onChange={(e) => setNovaMateria(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
          >
            {Object.keys(CORES_MATERIA).map((mat) => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Tópico (ex: Brasil Colônia)"
              value={novoTopico}
              onChange={(e) => setNovoTopico(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
            />
            <input
              type="number"
              placeholder="Minutos"
              value={novoTempo}
              onChange={(e) => setNovoTempo(e.target.value)}
              style={{ width: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
          <button type="submit" style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            Salvar Tarefa
          </button>
        </form>
      )}

      {/* Lista de Matérias */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tarefasDoDia.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>Nenhuma matéria agendada para {diaAtual}.</p>
        ) : (
          tarefasDoDia.map((item) => {
            const corMateria = CORES_MATERIA[item.materia] || CORES_MATERIA.Outro;

            return (
              <div
                key={item.id}
                onClick={() => alternarConclusao(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: item.concluido ? '#0f172a' : '#1e293b',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${corMateria}`,
                  borderTop: item.concluido ? '1px solid #1e293b' : '1px solid #334155',
                  borderRight: item.concluido ? '1px solid #1e293b' : '1px solid #334155',
                  borderBottom: item.concluido ? '1px solid #1e293b' : '1px solid #334155',
                  cursor: 'pointer',
                  opacity: item.concluido ? 0.6 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.concluido ? <CheckCircle2 color="#22c55e" size={20} /> : <Circle color="#64748b" size={20} />}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h4 style={{ margin: 0, textDecoration: item.concluido ? 'line-through' : 'none', fontSize: '0.95rem' }}>{item.materia}</h4>
                      <span style={{ fontSize: '0.65rem', backgroundColor: `${corMateria}33`, color: corMateria, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${corMateria}66` }}>
                        {item.materia}
                      </span>
                    </div>
                    <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>{item.bloco} • {item.tempo} min</p>
                  </div>
                </div>

                <button
                  onClick={(e) => deletarTarefa(item.id, e)}
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  title="Excluir Matéria"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
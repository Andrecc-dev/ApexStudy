import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, CheckCircle2, Circle, BookOpen, Clock, 
  Plus, Trash2, Calendar as CalendarIcon, Award, Flame, BellRing 
} from 'lucide-react';

const DIAS = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

const CORES_MATERIA = {
  Matemática: '#3b82f6', Português: '#ec4899', Redação: '#ef4444',
  Física: '#8b5cf6', Química: '#10b981', Biologia: '#22c55e',
  História: '#f59e0b', Geografia: '#d97706', 'Filosofia/Sociologia': '#a855f7',
  'Revisão Geral': '#06b6d4', Outro: '#64748b'
};

export default function RotinaEstudos({ cronograma, setCronograma }) {
  const [diaAtual, setDiaAtual] = useState(DIAS[new Date().getDay()]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);

  const [tempoRestante, setTempoRestante] = useState(50 * 60);
  const [rodando, setRodando] = useState(false);
  const [tempoFinalizado, setTempoFinalizado] = useState(false);

  const [novaMateria, setNovaMateria] = useState('Matemática');
  const [novoTopico, setNovoTopico] = useState('');
  const [novoTempo, setNovoTempo] = useState(50);
  const [mostrarForm, setMostrarForm] = useState(false);

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
    } catch (e) {}
  };

  const alternarConclusao = (id) => {
    setCronograma({
      ...cronograma,
      [diaAtual]: (cronograma[diaAtual] || []).map((item) => item.id === id ? { ...item, concluido: !item.concluido } : item)
    });
  };

  const deletarTarefa = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Excluir esta matéria agendada?')) {
      setCronograma({ ...cronograma, [diaAtual]: cronograma[diaAtual].filter((item) => item.id !== id) });
    }
  };

  const adicionarTarefa = (e) => {
    e.preventDefault();
    if (!novaMateria.trim()) return;
    const nova = { id: Date.now(), materia: novaMateria, bloco: novoTopico || 'Estudo Geral', tempo: Number(novoTempo) || 50, concluido: false };
    setCronograma({ ...cronograma, [diaAtual]: [...(cronograma[diaAtual] || []), nova] });
    setNovoTopico('');
    setMostrarForm(false);
  };

  const todasTarefas = Object.values(cronograma).flat();
  const totalBlocosConcluidos = todasTarefas.filter((t) => t.concluido).length;
  const totalMinutosEstudados = todasTarefas.filter((t) => t.concluido).reduce((acc, curr) => acc + (curr.tempo || 50), 0);
  const tarefasDoDia = cronograma[diaAtual] || [];
  const concluidasDia = tarefasDoDia.filter((t) => t.concluido).length;
  const progresso = tarefasDoDia.length > 0 ? Math.round((concluidasDia / tarefasDoDia.length) * 100) : 0;

  return (
    <>
      {/* Header Data */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-text, #60a5fa)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} /> Rotina de Estudos
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-card, #1e293b)', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color, #334155)' }}>
          <CalendarIcon size={16} color="var(--accent-text, #60a5fa)" />
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => {
              setDataSelecionada(e.target.value);
              setDiaAtual(DIAS[new Date(e.target.value + 'T00:00:00').getDay()]);
            }}
            style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary, #fff)', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
          />
        </div>
      </div>

      {/* Cards Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color, #334155)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Flame color="#f97316" size={22} />
          <div><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #94a3b8)' }}>Blocos</span><h4 style={{ margin: 0 }}>{totalBlocosConcluidos} feitos</h4></div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color, #334155)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award color="#eab308" size={22} />
          <div><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #94a3b8)' }}>Tempo Horas</span><h4 style={{ margin: 0 }}>{(totalMinutosEstudados / 60).toFixed(1)} h</h4></div>
        </div>
      </div>

      {/* Selector Dias (ROLAGEM LATERAL) */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '16px',
        overflowX: 'auto', // Adiciona a rolagem lateral
        paddingBottom: '8px', // Espaço extra pra barra de rolagem não "comer" a borda dos botões
        WebkitOverflowScrolling: 'touch' // Deixa a rolagem bem suave no celular
      }}>
        {['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'].map((dia) => (
          <button
            key={dia}
            onClick={() => setDiaAtual(dia)}
            style={{
              flex: '0 0 auto', // A mágica aqui: impede que o botão seja esmagado
              padding: '8px 16px',
              borderRadius: '20px',
              border: diaAtual === dia ? '1px solid var(--accent-color, #2563eb)' : '1px solid var(--border-color, #334155)',
              backgroundColor: diaAtual === dia ? 'var(--accent-color, #2563eb)' : 'var(--bg-card, #1e293b)',
              color: diaAtual === dia ? 'var(--text-on-accent, #fff)' : 'var(--text-primary, #e2e8f0)', 
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: diaAtual === dia ? 'bold' : 'normal',
              whiteSpace: 'nowrap' // Garante que a palavra não quebre no meio
            }}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Cronômetro */}
      <div style={{ backgroundColor: tempoFinalizado ? 'var(--bg-card, #1e1b4b)' : 'var(--bg-card, #1e293b)', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'center', border: tempoFinalizado ? '2px solid var(--accent-text, #6366f1)' : '1px solid var(--border-color, #334155)' }}>
        <div style={{ color: tempoFinalizado ? 'var(--accent-text, #818cf8)' : 'var(--text-secondary, #94a3b8)', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {tempoFinalizado ? <BellRing size={16} /> : <Clock size={15} />}
          {tempoFinalizado ? 'Bloco Concluído!' : 'Bloco de Foco'}
        </div>
        <div style={{ fontSize: '2.8rem', fontWeight: 'bold', fontFamily: 'monospace', margin: '4px 0' }}>
          {`${String(Math.floor(tempoRestante / 60)).padStart(2, '0')}:${String(tempoRestante % 60).padStart(2, '0')}`}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
          <button onClick={() => setTempoRestante((t) => Math.max(0, t - 300))} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color, #475569)', backgroundColor: 'transparent', color: 'var(--text-secondary, #94a3b8)', fontSize: '0.75rem', cursor: 'pointer' }}>-5 min</button>
          <button onClick={() => setTempoRestante((t) => t + 300)} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color, #475569)', backgroundColor: 'transparent', color: 'var(--text-secondary, #94a3b8)', fontSize: '0.75rem', cursor: 'pointer' }}>+5 min</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={() => { setTempoFinalizado(false); setRodando(!rodando); }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: rodando ? '#e11d48' : '#16a34a', color: '#fff', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {rodando ? <Pause size={16} /> : <Play size={16} />} {rodando ? 'Pausar' : 'Iniciar'}
          </button>
          <button onClick={() => { setRodando(false); setTempoFinalizado(false); setTempoRestante(50 * 60); }} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color, #475569)', backgroundColor: 'transparent', color: 'var(--text-secondary, #94a3b8)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Progresso do dia */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
          <span>Progresso ({concluidasDia}/{tarefasDoDia.length})</span>
          <span style={{ fontWeight: 'bold', color: 'var(--accent-text, #60a5fa)' }}>{progresso}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color, #334155)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${progresso}%`, height: '100%', backgroundColor: 'var(--accent-color, #2563eb)', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Botão Nova Matéria */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary, #cbd5e1)', margin: 0 }}>Agenda ({diaAtual})</h3>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--accent-color, #2563eb)', color: 'var(--text-on-accent, #fff)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
          <Plus size={16} /> Nova Matéria
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={adicionarTarefa} style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border-color, #334155)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <select value={novaMateria} onChange={(e) => setNovaMateria(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color, #475569)', backgroundColor: 'var(--bg-primary, #0f172a)', color: 'var(--text-primary, #fff)' }}>
            {Object.keys(CORES_MATERIA).map((mat) => <option key={mat} value={mat}>{mat}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Tópico (ex: Geometria)" value={novoTopico} onChange={(e) => setNovoTopico(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color, #475569)', backgroundColor: 'var(--bg-primary, #0f172a)', color: 'var(--text-primary, #fff)' }} />
            <input type="number" placeholder="Min" value={novoTempo} onChange={(e) => setNovoTempo(e.target.value)} style={{ width: '70px', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color, #475569)', backgroundColor: 'var(--bg-primary, #0f172a)', color: 'var(--text-primary, #fff)' }} />
          </div>
          <button type="submit" style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
        </form>
      )}

      {/* Lista de Matérias */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tarefasDoDia.length === 0 ? (
          <p style={{ color: 'var(--text-secondary, #64748b)', textAlign: 'center', padding: '16px', fontSize: '0.85rem' }}>Nenhuma matéria cadastrada.</p>
        ) : (
          tarefasDoDia.map((item) => {
            const cor = CORES_MATERIA[item.materia] || CORES_MATERIA.Outro;
            return (
              <div key={item.id} onClick={() => alternarConclusao(item.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: item.concluido ? 'var(--bg-primary, #0f172a)' : 'var(--bg-card, #1e293b)', borderRadius: '8px', borderLeft: `4px solid ${cor}`, borderTop: '1px solid var(--border-color, #334155)', borderRight: '1px solid var(--border-color, #334155)', borderBottom: '1px solid var(--border-color, #334155)', cursor: 'pointer', opacity: item.concluido ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.concluido ? <CheckCircle2 color="#22c55e" size={18} /> : <Circle color="var(--text-secondary, #64748b)" size={18} />}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h4 style={{ margin: 0, textDecoration: item.concluido ? 'line-through' : 'none', fontSize: '0.9rem' }}>{item.materia}</h4>
                      <span style={{ fontSize: '0.6rem', backgroundColor: `${cor}33`, color: cor, padding: '2px 4px', borderRadius: '4px' }}>{item.materia}</span>
                    </div>
                    <p style={{ margin: '2px 0 0 0', color: 'var(--text-secondary, #94a3b8)', fontSize: '0.75rem' }}>{item.bloco} • {item.tempo} min</p>
                  </div>
                </div>
                <button onClick={(e) => deletarTarefa(item.id, e)} style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
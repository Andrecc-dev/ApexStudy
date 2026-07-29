import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { BarChart2, Award, Target, TrendingUp, Clock, Flame } from 'lucide-react';

export default function Graficos({ dadosEstudo = [] }) {
  const [questoes, setQuestoes] = useState([]);
  const [simulados, setSimulados] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState('mensal'); // 'mensal' | 'total'

  const [dadosEvolucao, setDadosEvolucao] = useState([]);
  const [dadosMaterias, setDadosMaterias] = useState([]);
  const [dadosSimulados, setDadosSimulados] = useState([]);

  useEffect(() => {
    const qSalvas = JSON.parse(localStorage.getItem('apexstudy_questoes') || '[]');
    const sSalvos = JSON.parse(localStorage.getItem('apexstudy_historico_simulados') || '[]');
    
    setQuestoes(qSalvas);
    setSimulados(sSalvos);
    processarDados(qSalvas, sSalvos, filtroPeriodo);
  }, [filtroPeriodo]);

  const processarDados = (listaQuestoes, listaSimulados, periodo) => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    // Filtragem por Período Mensal se ativado
    const qFiltradas = listaQuestoes.filter((q) => {
      if (periodo === 'total') return true;
      if (!q.data) return true;
      const partes = q.data.includes('/') ? q.data.split('/') : q.data.split('-');
      const dataObj = q.data.includes('/')
        ? new Date(partes[2], partes[1] - 1, partes[0])
        : new Date(partes[0], partes[1] - 1, partes[2]);
      
      return dataObj.getMonth() === mesAtual && dataObj.getFullYear() === anoAtual;
    });

    // 1. Evolução da Taxa de Acerto no Tempo
    const porData = {};
    qFiltradas.forEach((q) => {
      const chaveData = q.data || 'Outros';
      if (!porData[chaveData]) {
        porData[chaveData] = { data: chaveData, acertos: 0, total: 0 };
      }
      porData[chaveData].total += Number(q.total) || 0;
      porData[chaveData].acertos += Number(q.acertos) || 0;
    });

    const evolucaoArray = Object.values(porData).map((item) => ({
      data: item.data.length > 5 ? item.data.slice(0, 5) : item.data,
      taxaAcerto: item.total > 0 ? Math.round((item.acertos / item.total) * 100) : 0,
      total: item.total
    }));

    setDadosEvolucao(evolucaoArray);

    // 2. Distribuição por Matéria
    const porMateria = {};
    qFiltradas.forEach((q) => {
      const mat = q.materia || 'Geral';
      if (!porMateria[mat]) {
        porMateria[mat] = { name: mat, total: 0, acertos: 0 };
      }
      porMateria[mat].total += Number(q.total) || 0;
      porMateria[mat].acertos += Number(q.acertos) || 0;
    });

    const materiasArray = Object.values(porMateria).map((item) => ({
      name: item.name,
      value: item.total,
      taxa: item.total > 0 ? Math.round((item.acertos / item.total) * 100) : 0
    }));

    setDadosMaterias(materiasArray);

    // 3. Desempenho em Simulados
    const simuladosFormatados = listaSimulados.slice(-6).map((s) => ({
      nome: s.nomeSimulado ? s.nomeSimulado.slice(0, 12) + '...' : 'Simulado',
      aproveitamento: s.aproveitamento || 0,
      redacao: s.notaRedacao ? Math.round((s.notaRedacao / 1000) * 100) : 0
    }));

    setDadosSimulados(simuladosFormatados);
  };

  const CORES_PIZZA = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const totalQuestoesFeitas = dadosMaterias.reduce((acc, curr) => acc + curr.value, 0);
  const totalMinutosEstudo = dadosEstudo.reduce((acc, curr) => acc + curr.tempoMinutos, 0);
  const totalBlocosEstudo = dadosEstudo.reduce((acc, curr) => acc + curr.blocos, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header com Filtro de Período */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-text, #60a5fa)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <BarChart2 size={22} /> Desempenho & Análise
          </h2>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.75rem', margin: '2px 0 0 0' }}>
            Acompanhe a sua evolução nos estudos, questões e simulados.
          </p>
        </div>

        {/* Seletor Mensal / Geral */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-primary, #0f172a)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color, #334155)' }}>
          <button
            onClick={() => setFiltroPeriodo('mensal')}
            style={{
              padding: '6px 10px', borderRadius: '6px', border: 'none',
              backgroundColor: filtroPeriodo === 'mensal' ? 'var(--accent-color, #2563eb)' : 'transparent',
              color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Mês Atual
          </button>
          <button
            onClick={() => setFiltroPeriodo('total')}
            style={{
              padding: '6px 10px', borderRadius: '6px', border: 'none',
              backgroundColor: filtroPeriodo === 'total' ? 'var(--accent-color, #2563eb)' : 'transparent',
              color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Histórico Total
          </button>
        </div>
      </div>

      {questoes.length === 0 && simulados.length === 0 && dadosEstudo.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '32px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color, #334155)' }}>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.9rem', margin: 0 }}>
            Nenhum dado registrado para gerar gráficos! 📊
          </p>
          <p style={{ color: 'var(--text-secondary, #64748b)', fontSize: '0.75rem', marginTop: '6px' }}>
            Cumpra sua rotina, resolva questões ou cadastre simulados para desbloquear seu painel analítico.
          </p>
        </div>
      ) : (
        <>
          {/* Cards Resumo Rápido */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock color="#8b5cf6" size={24} />
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #94a3b8)' }}>Horas de Estudo</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{(totalMinutosEstudo / 60).toFixed(1)}h</h3>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Flame color="#f97316" size={24} />
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #94a3b8)' }}>Blocos Feitos</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{totalBlocosEstudo}</h3>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target color="#3b82f6" size={24} />
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #94a3b8)' }}>Questões ({filtroPeriodo === 'mensal' ? 'Mês' : 'Total'})</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{totalQuestoesFeitas}</h3>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award color="#10b981" size={24} />
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #94a3b8)' }}>Simulados</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{simulados.length}</h3>
              </div>
            </div>
          </div>

          {/* Grid de Gráficos (Organiza lado a lado em telas maiores) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            
            {/* GRÁFICO: TEMPO DE ESTUDO POR MATÉRIA */}
            {dadosEstudo.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color, #334155)' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#a855f7', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} /> Tempo de Estudo por Matéria
                </h3>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosEstudo} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#94a3b8" unit=" min" style={{ fontSize: '0.7rem' }} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" style={{ fontSize: '0.65rem' }} width={80} />
                      <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '0.75rem' }} />
                      <Bar dataKey="tempoMinutos" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Minutos" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* GRÁFICO: EVOLUÇÃO NO TEMPO */}
            {dadosEvolucao.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color, #334155)' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#60a5fa', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={16} /> Taxa de Acerto (%)
                </h3>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dadosEvolucao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradienteAcertos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="data" stroke="#94a3b8" style={{ fontSize: '0.7rem' }} />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" unit="%" style={{ fontSize: '0.7rem' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '0.75rem' }} />
                      <Area type="monotone" dataKey="taxaAcerto" stroke="#3b82f6" strokeWidth={2} fill="url(#gradienteAcertos)" name="Aproveitamento (%)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Pizza Matérias */}
            {dadosMaterias.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color, #334155)' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#10b981', marginBottom: '14px' }}>
                  🍕 Questões Feitas por Matéria
                </h3>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dadosMaterias} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                        {dadosMaterias.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '0.75rem' }} />
                      <Legend wrapperStyle={{ fontSize: '0.7rem', color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Barras Simulados */}
            {dadosSimulados.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-card, #1e293b)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color, #334155)' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#f59e0b', marginBottom: '14px' }}>
                  🏆 Aproveitamento (Simulados)
                </h3>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosSimulados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="nome" stroke="#94a3b8" style={{ fontSize: '0.65rem' }} />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" unit="%" style={{ fontSize: '0.7rem' }} />
                      <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '0.75rem' }} />
                      <Bar dataKey="aproveitamento" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Acertos (%)" barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
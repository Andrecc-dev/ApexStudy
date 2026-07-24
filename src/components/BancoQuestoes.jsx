import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, XCircle, Plus, Trash2, Brain, TrendingUp, AlertCircle } from 'lucide-react';

const MATERIAS_LISTA = [
  'Matemática',
  'Português',
  'Redação',
  'Física',
  'Química',
  'Biologia',
  'História',
  'Geografia',
  'Filosofia/Sociologia',
  'Outro'
];

export default function BancoQuestoes() {
  const [registros, setRegistros] = useState(() => {
    const salvo = localStorage.getItem('apexstudy_questoes');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [materia, setMateria] = useState('Matemática');
  const [topico, setTopico] = useState('');
  const [totalQuestoes, setTotalQuestoes] = useState('');
  const [acertos, setAcertos] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [visaoGeral, setVisaoGeral] = useState('desempenho'); // 'desempenho' ou 'historico'

  useEffect(() => {
    localStorage.setItem('apexstudy_questoes', JSON.stringify(registros));
  }, [registros]);

  const salvarTreino = (e) => {
    e.preventDefault();
    const qTotal = Number(totalQuestoes);
    const qAcertos = Number(acertos);

    // 1. Validação de números negativos
    if (qTotal < 0 || qAcertos < 0) {
      alert('Não é possível inserir números negativos!');
      return;
    }

    // 2. Validação do total maior que zero
    if (!qTotal || qTotal <= 0) {
      alert('Informe um número válido e maior que zero para o total de questões.');
      return;
    }

    // 3. Validação de acertos coerentes
    if (qAcertos > qTotal) {
      alert('O número de acertos não pode ser maior que o total de questões!');
      return;
    }

    const porcentagem = Math.round((qAcertos / qTotal) * 100);

    const novoRegistro = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      materia,
      topico: topico.trim() || 'Geral',
      total: qTotal,
      acertos: qAcertos,
      erros: qTotal - qAcertos,
      porcentagem
    };

    setRegistros([novoRegistro, ...registros]);
    setTopico('');
    setTotalQuestoes('');
    setAcertos('');
    setMostrarForm(false);
  };

  const deletarRegistro = (id) => {
    if (window.confirm('Excluir este registro de questões?')) {
      setRegistros(registros.filter((item) => item.id !== id));
    }
  };

  // Cálculo por Matéria (Para diagnosticar facilidade/dificuldade)
  const diagnosticoPorMateria = MATERIAS_LISTA.map((mat) => {
    const treinosDaMateria = registros.filter((r) => r.materia === mat);
    const totalFeito = treinosDaMateria.reduce((acc, curr) => acc + curr.total, 0);
    const totalAcertos = treinosDaMateria.reduce((acc, curr) => acc + curr.acertos, 0);
    const aproveitamento = totalFeito > 0 ? Math.round((totalAcertos / totalFeito) * 100) : null;

    let nivel = 'Sem dados';
    let cor = '#64748b';

    if (aproveitamento !== null) {
      if (aproveitamento >= 75) {
        nivel = 'Facilidade (Dominado)';
        cor = '#22c55e';
      } else if (aproveitamento >= 55) {
        nivel = 'Mediano (Atenção)';
        cor = '#eab308';
      } else {
        nivel = 'Dificuldade (Focar!)';
        cor = '#ef4444';
      }
    }

    return {
      materia: mat,
      totalFeito,
      totalAcertos,
      aproveitamento,
      nivel,
      cor
    };
  }).filter((item) => item.totalFeito > 0);

  // Métricas Totais
  const totalQuestoesFeitas = registros.reduce((acc, curr) => acc + curr.total, 0);
  const totalAcertosGerais = registros.reduce((acc, curr) => acc + curr.acertos, 0);
  const taxaAproveitamentoGeral = totalQuestoesFeitas > 0 
    ? Math.round((totalAcertosGerais / totalQuestoesFeitas) * 100) 
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Target size={22} /> Banco de Questões
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
            Acompanhe seu desempenho por matéria.
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}
        >
          <Plus size={16} /> Registrar
        </button>
      </div>

      {/* Cards de Métricas Gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Resolvidas</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#f8fafc' }}>{totalQuestoesFeitas}</h3>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Acertos</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#22c55e' }}>{totalAcertosGerais}</h3>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Geral</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: taxaAproveitamentoGeral >= 70 ? '#22c55e' : '#eab308' }}>
            {taxaAproveitamentoGeral}%
          </h3>
        </div>
      </div>

      {/* Formulário de Novo Registro */}
      {mostrarForm && (
        <form onSubmit={salvarTreino} style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#93c5fd' }}>Registrar Bloco de Questões</h4>
          
          <select
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.85rem' }}
          >
            {MATERIAS_LISTA.map((mat) => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tópico (ex: Porcentagem, Leis de Newton)"
            value={topico}
            onChange={(e) => setTopico(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.85rem' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total de Questões</label>
              <input
                type="number"
                min="1"
                placeholder="Ex: 20"
                value={totalQuestoes}
                onChange={(e) => setTotalQuestoes(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Acertos</label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 16"
                value={acertos}
                onChange={(e) => setAcertos(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button type="submit" style={{ padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}>
            Salvar Resultado
          </button>
        </form>
      )}

      {/* Menu de Troca entre Diagnóstico de Matérias e Histórico */}
      <div style={{ display: 'flex', gap: '8px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
        <button
          onClick={() => setVisaoGeral('desempenho')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: visaoGeral === 'desempenho' ? '#2563eb' : 'transparent',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Brain size={16} /> Diagnóstico de Matérias
        </button>
        <button
          onClick={() => setVisaoGeral('historico')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: visaoGeral === 'historico' ? '#2563eb' : 'transparent',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <TrendingUp size={16} /> Histórico de Treinos
        </button>
      </div>

      {/* ABA 1: DIAGNÓSTICO POR MATÉRIA */}
      {visaoGeral === 'desempenho' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '4px 0' }}>Análise de Rendimento em Estudo</h3>
          
          {diagnosticoPorMateria.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '20px', fontSize: '0.85rem' }}>
              Cadastre questões para ver onde você tem mais facilidade ou dificuldade!
            </p>
          ) : (
            diagnosticoPorMateria.map((item) => (
              <div
                key={item.materia}
                style={{
                  backgroundColor: '#1e293b',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  borderLeft: `4px solid ${item.cor}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f8fafc' }}>{item.materia}</span>
                  <span style={{ fontSize: '0.7rem', color: item.cor, fontWeight: 'bold', backgroundColor: `${item.cor}22`, padding: '2px 8px', borderRadius: '4px', border: `1px solid ${item.cor}55` }}>
                    {item.nivel}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                  <span>{item.totalAcertos} de {item.totalFeito} questões corretas</span>
                  <span style={{ fontWeight: 'bold', color: item.cor }}>{item.aproveitamento}%</span>
                </div>

                <div style={{ width: '100%', height: '6px', backgroundColor: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.aproveitamento}%`, height: '100%', backgroundColor: item.cor, transition: 'width 0.3s' }} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ABA 2: HISTÓRICO DE REGISTROS */}
      {visaoGeral === 'historico' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '4px 0' }}>Últimos Registros</h3>

          {registros.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '20px', fontSize: '0.85rem' }}>
              Nenhum treino de questões registrado ainda.
            </p>
          ) : (
            registros.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#1e293b',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f8fafc' }}>{item.materia}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.data}</span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', color: '#cbd5e1', fontSize: '0.75rem' }}>{item.topico}</p>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', marginTop: '4px' }}>
                    <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <CheckCircle2 size={12} /> {item.acertos} acertos
                    </span>
                    <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <XCircle size={12} /> {item.erros} erros
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: item.porcentagem >= 75 ? '#22c55e' : item.porcentagem >= 55 ? '#eab308' : '#ef4444'
                    }}>
                      {item.porcentagem}%
                    </span>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8' }}>
                      {item.acertos}/{item.total}
                    </span>
                  </div>
                  <button
                    onClick={() => deletarRegistro(item.id)}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
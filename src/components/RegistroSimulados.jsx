import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

// --- CONSTANTES E DADOS INICIAIS ---
const MATERIAS_SUGERIDAS = [
  'Matemática', 'Português', 'Física', 'Química', 
  'Biologia', 'História', 'Geografia', 'Filosofia/Sociologia', 'Inglês/Espanhol'
];

const BANCAS_SUGERIDAS = [
  'ENEM', 'Cebraspe (CESPE)', 'Vunesp', 'FGV', 'FCC', 'IBFC', 'Instituto AOCP', 'Outra'
];

// IDs dos modelos padrão que NÃO podem ser editados nem apagados
const IDS_PROVAS_PADRAO = ['enem_dia1', 'enem_dia2', 'fuvest_fase1'];

const PROVAS_OFICIAIS = [
  {
    id: 'enem_dia1',
    nome: 'ENEM - Dia 1',
    banca: 'Inep / Governo Federal',
    materias: [
      { nome: 'Linguagens e Códigos', questoes: 45 },
      { nome: 'Ciências Humanas', questoes: 45 }
    ],
    temRedacao: true
  },
  {
    id: 'enem_dia2',
    nome: 'ENEM - Dia 2',
    banca: 'Inep / Governo Federal',
    materias: [
      { nome: 'Ciências da Natureza', questoes: 45 },
      { nome: 'Matemática', questoes: 45 }
    ],
    temRedacao: false
  },
  {
    id: 'fuvest_fase1',
    nome: 'FUVEST - 1ª Fase',
    banca: 'Vunesp / USP',
    materias: [{ nome: 'Conhecimentos Gerais', questoes: 90 }],
    temRedacao: false
  }
];

export default function RegistroSimulados() {
  // 1. ESTADOS DE DADOS
  const [modelos, setModelos] = useState(() => {
    const salvos = localStorage.getItem('apexstudy_modelos_simulados');
    return salvos ? JSON.parse(salvos) : PROVAS_OFICIAIS;
  });

  const [historico, setHistorico] = useState(() => {
    const salvos = localStorage.getItem('apexstudy_historico_simulados');
    return salvos ? JSON.parse(salvos) : [];
  });

  // 2. ESTADOS DE NAVEGAÇÃO E EDIÇÃO DE MODELO
  const [aba, setAba] = useState('registrar'); // 'registrar' | 'modelos' | 'historico'
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [modeloEmEdicaoId, setModeloEmEdicaoId] = useState(null); // Guarda o ID se estiver editando

  // 3. ESTADOS DE FORMULÁRIO
  const [formRegistro, setFormRegistro] = useState({
    data: new Date().toISOString().split('T')[0],
    tempo: '',
    respostas: {},
    notaRedacao: ''
  });

  const [formModelo, setFormModelo] = useState({
    nome: '',
    banca: '',
    temRedacao: true,
    materias: [{ nome: 'Matemática', questoes: 15 }]
  });

  // 4. EFEITOS DE PERSISTÊNCIA
  useEffect(() => {
    localStorage.setItem('apexstudy_modelos_simulados', JSON.stringify(modelos));
  }, [modelos]);

  useEffect(() => {
    localStorage.setItem('apexstudy_historico_simulados', JSON.stringify(historico));
  }, [historico]);

  // --- MÁSCARAS E VALIDAÇÕES DO REGISTRO ---
  const handleTempoChange = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = `${v.slice(0, -2)}:${v.slice(-2)}`;
    setFormRegistro(prev => ({ ...prev, tempo: v }));
  };

  const handleAcertosChange = (materiaNome, valor, max) => {
    let num = Math.min(Math.max(parseInt(valor, 10) || 0, 0), max);
    setFormRegistro(prev => ({
      ...prev,
      respostas: { ...prev.respostas, [materiaNome]: num }
    }));
  };

  const handleRedacaoChange = (v) => {
    if (v === '') return setFormRegistro(p => ({ ...p, notaRedacao: '' }));
    let num = Math.min(Math.max(parseInt(v, 10) || 0, 0), 1000);
    setFormRegistro(p => ({ ...p, notaRedacao: num.toString() }));
  };

  // --- GERENCIAMENTO DE MODELOS (CRIAR / EDITAR / EXCLUIR) ---

  // Inicia a edição do modelo customizado
  const iniciarEdicaoModelo = (e, modelo) => {
    e.stopPropagation(); // Evita abrir o formulário de registrar ao clicar no botão de editar
    setModeloEmEdicaoId(modelo.id);
    setFormModelo({
      nome: modelo.nome,
      banca: modelo.banca,
      temRedacao: modelo.temRedacao,
      materias: [...modelo.materias]
    });
    setAba('modelos');
  };

  // Exclui o modelo customizado
  const excluirModelo = (e, id, nome) => {
    e.stopPropagation(); // Evita acionar o clique do card
    if (window.confirm(`Tem certeza que deseja apagar o modelo "${nome}"?`)) {
      setModelos(p => p.filter(m => m.id !== id));
      if (modeloSelecionado?.id === id) setModeloSelecionado(null);
    }
  };

  const adicionarMateria = () => {
    setFormModelo(p => ({
      ...p,
      materias: [...p.materias, { nome: 'Português', questoes: 10 }]
    }));
  };

  const removerMateria = (index) => {
    if (formModelo.materias.length <= 1) return alert('O modelo precisa ter pelo menos 1 matéria.');
    const nome = formModelo.materias[index].nome || 'esta matéria';
    if (window.confirm(`Deseja remover "${nome}" deste modelo?`)) {
      setFormModelo(p => ({
        ...p,
        materias: p.materias.filter((_, i) => i !== index)
      }));
    }
  };

  const salvarModelo = (e) => {
    e.preventDefault();
    if (!formModelo.nome.trim()) return alert('Informe o nome do simulado!');

    if (modeloEmEdicaoId) {
      // Atualiza modelo existente
      setModelos(p => p.map(m => m.id === modeloEmEdicaoId ? { ...m, ...formModelo } : m));
      setModeloEmEdicaoId(null);
    } else {
      // Cria um novo modelo
      const novo = {
        id: `custom_${Date.now()}`,
        ...formModelo,
        banca: formModelo.banca || 'Customizado'
      };
      setModelos(p => [...p, novo]);
    }

    setFormModelo({ nome: '', banca: '', temRedacao: true, materias: [{ nome: 'Matemática', questoes: 15 }] });
    setAba('registrar');
  };

  const cancelarEdicao = () => {
    setModeloEmEdicaoId(null);
    setFormModelo({ nome: '', banca: '', temRedacao: true, materias: [{ nome: 'Matemática', questoes: 15 }] });
    setAba('registrar');
  };

  // --- REGISTRAR DESEMPENHO DO SIMULADO ---
  const salvarResultado = (e) => {
    e.preventDefault();
    if (!modeloSelecionado) return;

    const totalQuestoes = modeloSelecionado.materias.reduce((acc, m) => acc + m.questoes, 0);
    const totalAcertos = Object.values(formRegistro.respostas).reduce((acc, a) => acc + (Number(a) || 0), 0);

    const novoRegistro = {
      id: Date.now(),
      modeloId: modeloSelecionado.id,
      nomeSimulado: modeloSelecionado.nome,
      banca: modeloSelecionado.banca,
      data: formRegistro.data,
      tempo: formRegistro.tempo || 'Não informado',
      totalQuestoes,
      totalAcertos,
      aproveitamento: Math.round((totalAcertos / totalQuestoes) * 100) || 0,
      notaRedacao: modeloSelecionado.temRedacao ? (Number(formRegistro.notaRedacao) || 0) : null,
      detalhesMaterias: modeloSelecionado.materias.map(m => ({
        materia: m.nome,
        questoes: m.questoes,
        acertos: formRegistro.respostas[m.nome] || 0
      }))
    };

    setHistorico(p => [novoRegistro, ...p]);
    setModeloSelecionado(null);
    setFormRegistro({ data: new Date().toISOString().split('T')[0], tempo: '', respostas: {}, notaRedacao: '' });
    setAba('historico');
  };

  const deletarHistorico = (id) => {
    if (window.confirm('Excluir este registro do histórico?')) {
      setHistorico(p => p.filter(item => item.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Datalists Globais */}
      <datalist id="bancas-sugeridas">{BANCAS_SUGERIDAS.map(b => <option key={b} value={b} />)}</datalist>
      <datalist id="materias-sugeridas">{MATERIAS_SUGERIDAS.map(m => <option key={m} value={m} />)}</datalist>

      {/* NAVEGAÇÃO DE SUB-ABAS */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color, #334155)', paddingBottom: '10px' }}>
        <TabButton label="Registrar Simulado" active={aba === 'registrar'} onClick={() => setAba('registrar')} />
        <TabButton 
          label={modeloEmEdicaoId ? "✏️ Editando Modelo" : "+ Criar Modelo"} 
          active={aba === 'modelos'} 
          onClick={() => {
            if (aba !== 'modelos' && modeloEmEdicaoId) cancelarEdicao();
            setAba('modelos');
          }} 
        />
        <TabButton label={`Histórico (${historico.length})`} active={aba === 'historico'} onClick={() => setAba('historico')} />
      </div>

      {/* ---------------- ABA 1: REGISTRAR RESULTADO ---------------- */}
      {aba === 'registrar' && (
        !modeloSelecionado ? (
          <div>
            <h3 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '12px' }}>Escolha o Simulado Realizado:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {modelos.map((m) => {
                const ehPadrao = IDS_PROVAS_PADRAO.includes(m.id);

                return (
                  <div
                    key={m.id}
                    onClick={() => setModeloSelecionado(m)}
                    style={{ ...cardStyle, position: 'relative' }}
                  >
                    {/* Botões de Ação para Modelos Customizados */}
                    {!ehPadrao && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px' }}>
                        <button
                          onClick={(e) => iniciarEdicaoModelo(e, m)}
                          title="Editar Modelo"
                          style={btnIconStyle}
                        >
                          <Edit2 size={14} color="#60a5fa" />
                        </button>
                        <button
                          onClick={(e) => excluirModelo(e, m.id, m.nome)}
                          title="Excluir Modelo"
                          style={btnIconStyle}
                        >
                          <Trash2 size={14} color="#ef4444" />
                        </button>
                      </div>
                    )}

                    <span style={badgeStyle}>{m.banca}</span>
                    <h4 style={{ margin: '8px 0 4px 0', fontSize: '0.95rem', paddingRight: !ehPadrao ? '50px' : '0' }}>{m.nome}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                      {m.materias.reduce((a, b) => a + b.questoes, 0)} Questões • {m.temRedacao ? 'Com Redação' : 'Sem Redação'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={salvarResultado} style={formContainerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#60a5fa', fontSize: '1.1rem' }}>{modeloSelecionado.nome}</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Banca: {modeloSelecionado.banca}</span>
              </div>
              <button type="button" onClick={() => setModeloSelecionado(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>
                Trocar Simulado
              </button>
            </div>

            {/* Data e Tempo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Data da Prova</label>
                <input
                  type="date"
                  min="2000-01-01"
                  max="2026-12-31"
                  value={formRegistro.data}
                  onChange={e => setFormRegistro(p => ({ ...p, data: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Tempo Gasto (HH:MM)</label>
                <input
                  type="text"
                  placeholder="04:30"
                  value={formRegistro.tempo}
                  onChange={handleTempoChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Acertos por Matéria */}
            <h4 style={{ fontSize: '0.85rem', marginBottom: '8px' }}>Acertos por Matéria:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {modeloSelecionado.materias.map((mat) => (
                <div key={mat.nome} style={rowStyle}>
                  <span style={{ fontSize: '0.85rem' }}>
                    {mat.nome} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({mat.questoes} q)</span>
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      min="0"
                      max={mat.questoes}
                      value={formRegistro.respostas[mat.nome] ?? ''}
                      onChange={e => handleAcertosChange(mat.nome, e.target.value, mat.questoes)}
                      placeholder="0"
                      style={{ ...inputStyle, width: '60px', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/ {mat.questoes}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Redação */}
            {modeloSelecionado.temRedacao && (
              <div style={{ ...rowStyle, flexDirection: 'column', alignItems: 'flex-start', marginBottom: '16px' }}>
                <label style={labelStyle}>Nota da Redação (0 a 1000 pts):</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="Ex: 880"
                  value={formRegistro.notaRedacao}
                  onChange={e => handleRedacaoChange(e.target.value)}
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>
            )}

            <button type="submit" style={btnSubmitGreen}>Salvar Resultado</button>
          </form>
        )
      )}

      {/* ---------------- ABA 2: CRIAR / EDITAR MODELO ---------------- */}
      {aba === 'modelos' && (
        <form onSubmit={salvarModelo} style={formContainerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', color: '#60a5fa', margin: 0 }}>
              {modeloEmEdicaoId ? 'Editar Modelo de Prova' : 'Criar Novo Modelo de Prova'}
            </h3>
            {modeloEmEdicaoId && (
              <button type="button" onClick={cancelarEdicao} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>
                Cancelar Edição
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Nome da Prova / Simulado</label>
              <input
                type="text"
                placeholder="Ex: Simulado Bernoulli #1"
                value={formModelo.nome}
                onChange={e => setFormModelo(p => ({ ...p, nome: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Banca / Instituição</label>
              <input
                type="text"
                list="bancas-sugeridas"
                placeholder="Ex: Vunesp ou Cursinho X"
                value={formModelo.banca}
                onChange={e => setFormModelo(p => ({ ...p, banca: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Opção de Redação */}
          <div style={{ ...rowStyle, marginBottom: '16px', gap: '10px' }}>
            <input
              type="checkbox"
              id="checkRedacao"
              checked={formModelo.temRedacao}
              onChange={e => setFormModelo(p => ({ ...p, temRedacao: e.target.checked }))}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <div>
              <label htmlFor="checkRedacao" style={{ fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', display: 'block' }}>
                Incluir Prova de Redação (0 a 1000 pts)
              </label>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                A nota de redação será registrada individualmente e não afetará o total de questões objetivas.
              </span>
            </div>
          </div>

          <h4 style={{ fontSize: '0.85rem', marginBottom: '8px' }}>Matérias Objetivas (Questões):</h4>

          {/* Lista de Matérias */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {formModelo.materias.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  list="materias-sugeridas"
                  placeholder="Nome da Matéria"
                  value={m.nome}
                  onChange={e => {
                    const copia = [...formModelo.materias];
                    copia[idx].nome = e.target.value;
                    setFormModelo(p => ({ ...p, materias: copia }));
                  }}
                  style={{ flex: 1, ...inputStyle }}
                />

                <input
                  type="number"
                  min="1"
                  max="200"
                  placeholder="Qtd Qs"
                  value={m.questoes}
                  onChange={e => {
                    const copia = [...formModelo.materias];
                    copia[idx].questoes = parseInt(e.target.value, 10) || 1;
                    setFormModelo(p => ({ ...p, materias: copia }));
                  }}
                  style={{ ...inputStyle, width: '80px', textAlign: 'center' }}
                />

                <button
                  type="button"
                  onClick={() => removerMateria(idx)}
                  title="Remover Matéria"
                  style={btnDeleteStyle}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={adicionarMateria} style={btnAddMateriaStyle}>
            <Plus size={14} /> Adicionar outra matéria
          </button>

          <button type="submit" style={btnSubmitBlue}>
            {modeloEmEdicaoId ? 'Atualizar Modelo' : 'Salvar Modelo'}
          </button>
        </form>
      )}

      {/* ---------------- ABA 3: HISTÓRICO DE SIMULADOS ---------------- */}
      {aba === 'historico' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {historico.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Nenhum simulado registrado ainda.</p>
          ) : (
            historico.map((reg) => (
              <div key={reg.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>{reg.nomeSimulado}</h4>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{reg.data} • Tempo: {reg.tempo}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: reg.aproveitamento >= 70 ? '#22c55e' : '#f59e0b' }}>
                      {reg.aproveitamento}% acertos
                    </span>
                    <button onClick={() => deletarHistorico(reg.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px' }}>
                  <b>{reg.totalAcertos}</b> de <b>{reg.totalQuestoes}</b> questões acertadas.
                  {reg.notaRedacao !== null && <span> | Redação: <b style={{ color: '#60a5fa' }}>{reg.notaRedacao} pts</b></span>}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {reg.detalhesMaterias.map((d, i) => (
                    <span key={i} style={chipStyle}>
                      {d.materia}: {d.acertos}/{d.questoes}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}

// --- SUBCOMPONENTES E ESTILOS ---

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold',
        backgroundColor: active ? 'var(--accent-color, #2563eb)' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary, #94a3b8)'
      }}
    >
      {label}
    </button>
  );
}

const formContainerStyle = { backgroundColor: 'var(--bg-card, #1e293b)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color, #334155)' };
const cardStyle = { backgroundColor: 'var(--bg-card, #1e293b)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color, #334155)', cursor: 'pointer' };
const rowStyle = { backgroundColor: 'var(--bg-primary, #0f172a)', padding: '8px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color, #475569)', backgroundColor: 'var(--bg-primary, #0f172a)', color: '#fff', boxSizing: 'border-box' };
const labelStyle = { fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' };
const badgeStyle = { fontSize: '0.65rem', backgroundColor: '#3b82f633', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' };
const chipStyle = { fontSize: '0.68rem', backgroundColor: 'var(--bg-primary, #0f172a)', padding: '3px 6px', borderRadius: '4px', border: '1px solid #334155' };
const btnDeleteStyle = { backgroundColor: '#ef444422', border: '1px solid #ef444444', color: '#ef4444', borderRadius: '6px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const btnIconStyle = { backgroundColor: 'var(--bg-primary, #0f172a)', border: '1px solid #334155', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const btnAddMateriaStyle = { padding: '6px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: 'transparent', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' };
const btnSubmitGreen = { width: '100%', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };
const btnSubmitBlue = { width: '100%', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent-color, #2563eb)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };
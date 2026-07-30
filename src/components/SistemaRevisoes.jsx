import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, CheckCircle, Calendar, AlertCircle, 
  Trash2, Link, Image, Sparkles, Clock, RefreshCw 
} from 'lucide-react';

const MATERIAS_LISTA = [
  'Matemática', 'Português', 'Redação', 'Física', 'Química', 
  'Biologia', 'História', 'Geografia', 'Filosofia/Sociologia', 'Outro'
];

export default function SistemaRevisoes() {
  // 1. ESTADO DE REVISÕES NO LOCALSTORAGE
  const [revisoes, setRevisoes] = useState(() => {
    const salvo = localStorage.getItem('apexstudy_revisoes');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtroMateria, setFiltroMateria] = useState('Todas');
  const [toast, setToast] = useState(null);

  // Form de Nova Revisão
  const [materia, setMateria] = useState('Matemática');
  const [topico, setTopico] = useState('');
  const [tipo, setTipo] = useState('erro'); // 'erro' ou 'teoria'
  const [anotacao, setAnotacao] = useState('');
  const [linkQuestao, setLinkQuestao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  // Persistir Dados
  useEffect(() => {
    localStorage.setItem('apexstudy_revisoes', JSON.stringify(revisoes));
  }, [revisoes]);

  const mostrarToast = (msg, status = 'sucesso') => {
    setToast({ msg, status });
    setTimeout(() => setToast(null), 2500);
  };

  // 2. SALVAR REVISÃO MANUALLY
  const salvarRevisao = (e) => {
    e.preventDefault();
    if (!topico.trim()) return mostrarToast('Informe o tópico da revisão!', 'erro');

    const hojeStr = new Date().toISOString().split('T')[0];

    const nova = {
      id: `rev_${Date.now()}`,
      materia,
      topico: topico.trim(),
      tipo,
      anotacao,
      linkQuestao,
      imagemUrl,
      dataCriacao: hojeStr,
      proximaRevisao: hojeStr, // Fica pendente para hoje
      cicloAtual: 0, // 0 = Hoje, 1 = +1 dia, 2 = +7 dias, 3 = +15 dias, 4 = +30 dias
      historicoConclusoes: []
    };

    setRevisoes([nova, ...revisoes]);
    setTopico(''); setAnotacao(''); setLinkQuestao(''); setImagemUrl('');
    setMostrarForm(false);
    mostrarToast('Revisão agendada com sucesso! 🚀');
  };

  // 3. AVANÇAR O CICLO DE REVISÃO (MÉTODO ESPAÇADO)
  const concluirRevisaoDoDia = (id) => {
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split('T')[0];

    // Intervalos de dias para repetição espaçada
    const intervalosDias = [1, 7, 15, 30];

    const atualizadas = revisoes.map((item) => {
      if (item.id === id) {
        const proximoCiclo = (item.cicloAtual || 0) + 1;
        
        // Calcula a próxima data de revisão
        const diasParaSomar = intervalosDias[Math.min(proximoCiclo - 1, intervalosDias.length - 1)];
        const proximaData = new Date();
        proximaData.setDate(hoje.getDate() + diasParaSomar);
        const proximaDataStr = proximaData.toISOString().split('T')[0];

        return {
          ...item,
          cicloAtual: proximoCiclo,
          proximaRevisao: proximaDataStr,
          historicoConclusoes: [...(item.historicoConclusoes || []), hojeStr]
        };
      }
      return item;
    });

    setRevisoes(atualizadas);
    mostrarToast('Revisão concluída! Próxima data agendada. ✨');
  };

  // 4. DELETAR REVISÃO
  const deletarRevisao = (id) => {
    if (window.confirm('Remover este card de revisão?')) {
      setRevisoes(revisoes.filter(r => r.id !== id));
      mostrarToast('Revisão removida.', 'erro');
    }
  };

  // FILTROS E DATAS
  const hojeStr = new Date().toISOString().split('T')[0];

  const pendentesHoje = revisoes.filter(r => 
    r.proximaRevisao <= hojeStr && 
    (filtroMateria === 'Todas' || r.materia === filtroMateria)
  );

  const futuras = revisoes.filter(r => 
    r.proximaRevisao > hojeStr && 
    (filtroMateria === 'Todas' || r.materia === filtroMateria)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
      
      {/* TOAST DISCRETO */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, backgroundColor: toast.status === 'erro' ? '#ef4444' : '#10b981', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} /> {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <BookOpen size={20} /> Caderno de Revisões
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '2px 0 0 0' }}>
            Repetição espaçada inteligente para fixação de conteúdo.
          </p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={btnPrimary}>
          <Plus size={16} /> {mostrarForm ? 'Fechar' : 'Nova Revisão'}
        </button>
      </div>

      {/* FORMULÁRIO DE CADASTRO */}
      {mostrarForm && (
        <form onSubmit={salvarRevisao} style={boxContainer}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#93c5fd' }}>Agendar Novo Tópico</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <select value={materia} onChange={e => setMateria(e.target.value)} style={inputStyle}>
              {MATERIAS_LISTA.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <select value={tipo} onChange={e => setTipo(e.target.value)} style={inputStyle}>
              <option value="erro">🎯 Caderno de Erros (Questão)</option>
              <option value="teoria">📘 Revisão Teórica / Resumo</option>
            </select>
          </div>

          <input 
            type="text" 
            placeholder="Tópico (ex: Leis de Newton, Concordância Verbal...)" 
            value={topico} 
            onChange={e => setTopico(e.target.value)} 
            style={{ ...inputStyle, marginBottom: '8px' }} 
          />

          <textarea 
            placeholder="Anotações / Por que errou? (Opcional)" 
            value={anotacao} 
            onChange={e => setAnotacao(e.target.value)} 
            rows={2} 
            style={{ ...inputStyle, marginBottom: '8px', resize: 'vertical' }} 
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <input type="url" placeholder="Link da Questão (opcional)" value={linkQuestao} onChange={e => setLinkQuestao(e.target.value)} style={inputStyle} />
            <input type="url" placeholder="URL da Imagem/Print (opcional)" value={imagemUrl} onChange={e => setImagemUrl(e.target.value)} style={inputStyle} />
          </div>

          <button type="submit" style={{ ...btnSuccess, width: '100%', justifyContent: 'center' }}>Agendar Revisão</button>
        </form>
      )}

      {/* FILTRO POR MATÉRIA (COM ROLAGEM LATERAL NATIVA) */}
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        overflowX: 'auto', 
        paddingBottom: '8px', /* Aumentei um pouquinho o padding pra barra de rolagem não encostar no botão */
        WebkitOverflowScrolling: 'touch' /* Deixa o scroll suave no mobile */
      }}>
        {['Todas', ...MATERIAS_LISTA].map(m => (
          <button 
            key={m} 
            onClick={() => setFiltroMateria(m)} 
            style={{
              flex: '0 0 auto', /* Impede o botão de esmagar, ativando o carrossel */
              padding: '6px 12px', /* Dei uma leve aumentada no padding pra ficar melhor o toque do dedo */
              borderRadius: '20px', /* Arredondado igual a rotina de estudos pra manter o padrão visual */
              border: '1px solid #334155',
              backgroundColor: filtroMateria === m ? '#2563eb' : '#0f172a',
              color: filtroMateria === m ? '#fff' : '#94a3b8',
              fontSize: '0.8rem', /* Padronizei a fonte com a rotina de estudos */
              cursor: 'pointer',
              whiteSpace: 'nowrap' /* Não deixa o texto quebrar de linha */
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* SEÇÃO 1: REVISÕES PARA HOJE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#ef4444', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={16} /> Para Revisar Hoje ({pendentesHoje.length})
        </h3>

        {pendentesHoje.length === 0 ? (
          <div style={{ ...boxContainer, textAlign: 'center', color: '#64748b', fontSize: '0.8rem', padding: '16px' }}>
            🎉 Nenhuma revisão pendente para hoje nesta matéria!
          </div>
        ) : (
          pendentesHoje.map(item => (
            <CardRevisao 
              key={item.id} 
              item={item} 
              onConcluir={() => concluirRevisaoDoDia(item.id)} 
              onDeletar={() => deletarRevisao(item.id)} 
              isHoje={true}
            />
          ))
        )}
      </div>

      {/* SEÇÃO 2: PRÓXIMAS REVISÕES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} /> Próximas Agendadas ({futuras.length})
        </h3>

        {futuras.map(item => (
          <CardRevisao 
            key={item.id} 
            item={item} 
            onDeletar={() => deletarRevisao(item.id)} 
            isHoje={false}
          />
        ))}
      </div>

    </div>
  );
}

// COMPONENTE DE CARD INDIVIDUAL DE REVISÃO
function CardRevisao({ item, onConcluir, onDeletar, isHoje }) {
  const isErro = item.tipo === 'erro';

  return (
    <div style={{ ...boxContainer, borderLeft: `4px solid ${isHoje ? '#ef4444' : '#3b82f6'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: isErro ? '#f87171' : '#60a5fa', backgroundColor: isErro ? '#ef444422' : '#3b82f622', padding: '2px 6px', borderRadius: '4px' }}>
              {isErro ? '🎯 Erro em Questão' : '📘 Teoria'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' }}>{item.materia}</span>
          </div>

          <h4 style={{ margin: '4px 0', fontSize: '0.85rem', color: '#f8fafc' }}>{item.topico}</h4>

          {item.anotacao && (
            <p style={{ margin: '4px 0', fontSize: '0.75rem', color: '#cbd5e1', whiteSpace: 'pre-line' }}>
              {item.anotacao}
            </p>
          )}

          {/* LINKS E IMAGENS */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            {item.linkQuestao && (
              <a href={item.linkQuestao} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <Link size={12} /> Ver Questão
              </a>
            )}
            {item.imagemUrl && (
              <a href={item.imagemUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <Image size={12} /> Ver Imagem/Print
              </a>
            )}
          </div>
        </div>

        {/* BOTOES E STATUS */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          {isHoje ? (
            <button onClick={onConcluir} style={{ ...btnSuccess, padding: '6px 10px', fontSize: '0.75rem' }}>
              <CheckCircle size={14} /> Revisado!
            </button>
          ) : (
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} /> {item.proximaRevisao.split('-').reverse().join('/')}
            </span>
          )}

          <button onClick={onDeletar} style={btnGhost}>
            <Trash2 size={14} color="#ef4444" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ESTILOS ENXUTOS
const boxContainer = { backgroundColor: '#1e293b', padding: '12px', borderRadius: '10px', border: '1px solid #334155' };
const inputStyle = { width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.8rem', boxSizing: 'border-box' };
const btnPrimary = { padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' };
const btnSuccess = { padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' };
const btnGhost = { background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'inline-flex', alignItems: 'center' };
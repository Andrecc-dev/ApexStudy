import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/Firebase';
import { Lock, Mail, Key, AlertCircle, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modoRecuperacao, setModoRecuperacao] = useState(false);
  
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Função para Fazer Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (err) {
      if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password'
      ) {
        setErro('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/too-many-requests') {
        setErro('Muitas tentativas falhas. Aguarde um instante.');
      } else {
        setErro('Erro ao fazer login. Verifique sua conexão.');
      }
    } finally {
      setCarregando(false);
    }
  };

  // Função para Enviar E-mail de Recuperação de Senha
  const handleRecuperarSenha = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!email) {
      setErro('Digite seu e-mail no campo acima.');
      return;
    }

    setCarregando(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSucesso('✅ E-mail de redefinição enviado! Verifique sua caixa de entrada e spam.');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        setErro('E-mail não encontrado ou inválido.');
      } else {
        setErro('Erro ao enviar e-mail. Tente novamente mais tarde.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        padding: '32px 24px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* LOGO */}
        <img 
          src="/images/LogoOficial.png" 
          alt="ApexStudy Logo" 
          style={{ height: '70px', objectFit: 'contain', marginBottom: '16px' }}
        />
        
        <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', margin: '0 0 6px 0', fontWeight: 'bold' }}>
          {modoRecuperacao ? 'Recuperar Senha' : 'Área do Aluno'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 24px 0', textAlign: 'center' }}>
          {modoRecuperacao 
            ? 'Digite seu e-mail cadastrado para receber o link de redefinição.' 
            : 'Entre com suas credenciais para acessar o ApexStudy.'}
        </p>

        {/* MENSAGEM DE ERRO */}
        {erro && (
          <div style={{
            width: '100%',
            backgroundColor: '#ef444422',
            border: '1px solid #ef4444',
            color: '#f87171',
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxSizing: 'border-box'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{erro}</span>
          </div>
        )}

        {/* MENSAGEM DE SUCESSO */}
        {sucesso && (
          <div style={{
            width: '100%',
            backgroundColor: '#10b98122',
            border: '1px solid #10b981',
            color: '#34d399',
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxSizing: 'border-box'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{sucesso}</span>
          </div>
        )}

        {/* FORMULÁRIO DE LOGIN OU RECUPERAÇÃO */}
        <form onSubmit={modoRecuperacao ? handleRecuperarSenha : handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CAMPO DE E-MAIL */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '6px' }}>
              E-MAIL
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="email" 
                required 
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* CAMPO DE SENHA (Apenas no modo Login) */}
          {!modoRecuperacao && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  SENHA
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setModoRecuperacao(true);
                    setErro('');
                    setSucesso('');
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#60a5fa',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Esqueceu a senha?
                </button>
              </div>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Key size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
                <input 
                  type={mostrarSenha ? 'text' : 'password'} 
                  required 
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 40px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {/* BOTÃO DE MOSTRAR / OCULTAR SENHA */}
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* BOTÃO PRINCIPAL */}
          <button
            type="submit"
            disabled={carregando}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: carregando ? 'not-allowed' : 'pointer',
              opacity: carregando ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {carregando ? (
              'Processando...'
            ) : modoRecuperacao ? (
              'Enviar E-mail de Recuperação'
            ) : (
              <>
                <Lock size={16} /> Acessar Plataforma
              </>
            )}
          </button>

          {/* BOTÃO VOLTAR PARA LOGIN (Apenas na recuperação) */}
          {modoRecuperacao && (
            <button
              type="button"
              onClick={() => {
                setModoRecuperacao(false);
                setErro('');
                setSucesso('');
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '4px'
              }}
            >
              <ArrowLeft size={16} /> Voltar para o Login
            </button>
          )}
        </form>

        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '20px', textAlign: 'center' }}>
          🔒 Acesso exclusivo para alunos cadastrados.
        </p>
      </div>
    </div>
  );
}
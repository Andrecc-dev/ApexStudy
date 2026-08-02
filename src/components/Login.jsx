import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/Firebase'; // Se sua pasta for "config", mude para ../config/firebase
import { Lock, Mail, Key, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      // O Firebase atualiza o estado de login automaticamente!
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
          Área do Aluno
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 24px 0', textAlign: 'center' }}>
          Entre com suas credenciais para acessar o ApexStudy.
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

        {/* FORMULÁRIO */}
        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '6px' }}>
              SENHA
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Key size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
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
              'Entrando...'
            ) : (
              <>
                <Lock size={16} /> Acessar Plataforma
              </>
            )}
          </button>
        </form>

        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '20px', textAlign: 'center' }}>
          🔒 Acesso exclusivo para alunos cadastrados.
        </p>
      </div>
    </div>
  );
}
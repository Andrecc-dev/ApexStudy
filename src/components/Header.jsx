import React from 'react';
import { Menu, HelpCircle } from 'lucide-react';


export default function Header({ onOpenMenu, onOpenTutorial }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #334155',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onOpenMenu}
          aria-label="Menu"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#f8fafc',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Menu size={24} />
        </button>
        <h1 style={{ fontSize: '1.1rem', margin: 0, color: '#f8fafc', fontWeight: 'bold' }}>
          ApexStudy
        </h1>
      </div>

      <button
        onClick={onOpenTutorial}
        title="Dúvidas e Tutorial"
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#60a5fa',
          cursor: 'pointer'
        }}
      >
        <HelpCircle size={20} />
      </button>
    </header>
  );
}


# 📚 ApexStudy Axios

> "O ApexStudy Axios não existe para controlar o estudante. Ele existe para tornar visível o progresso que, muitas vezes, passa despercebido. Cada tarefa concluída, cada hora estudada e cada questão respondida devem reforçar a sensação de avanço rumo ao objetivo final."

---

## 📄 Visão Geral do Produto

O **ApexStudy Axios** é um sistema de gerenciamento de estudos de alta performance projetado para transformar rotinas complexas em jornadas visuais e motivadoras.

Desenvolvido com foco **Mobile-First**, a plataforma elimina a fricção de planilhas e cadernos, entregando uma interface *Dark Mode* limpa, fluida e acessível tanto no celular quanto no computador.

---

## 🎯 Pilares de Design & UX

* ⚡ **Simplicidade Operacional:** Ações principais executáveis com apenas um toque ou clique.
* 📱 **Mobile-First Real:** Projetado para a tela do celular, adaptando-se perfeitamente a desktops.
* 🔔 **Feedback Sensorial:** Alarme sonoro integrado e alertas visuais ao finalizar os blocos de estudo.
* ⚙️ **Flexibilidade Guiada:** Pré-configurado para o ENEM/Vestibulares, mas 100% customizável para qualquer objetivo.
* 📈 **Sensação de Avanço:** Métricas diárias de tempo acumulado e blocos concluídos em tempo real.

---

## 🚀 Funcionalidades do MVP (Fase 1)

O MVP foca no **ciclo diário essencial de estudos** (Executar $\rightarrow$ Registrar $\rightarrow$ Acompanhar):

### 1. Dashboard & Cronômetro de Foco
* **Timer Ajustável:** Contagem regressiva para blocos de estudo (padrão 50 min) com atalhos de $\pm 5\text{ min}$.
* **Alarme Sonoro Nativo:** Bipe de conclusão gerado via áudio nativo do navegador ao zerar o tempo.
* **Barra de Progresso Dinâmica:** Porcentagem do dia calculada automaticamente conforme as tarefas são marcadas.

### 2. Gerenciador de Cronograma Semanal
* **Navegação por Dias:** Filtro rápido de Segunda a Domingo com barra de rolagem customizada.
* **Seletor de Data Integrado:** Sincronização automática do dia da semana ao escolher qualquer data no calendário.
* **Edição & Persistência:** Adição e remoção de tarefas em tempo real com salvamento local automático.

### 3. Gestão Visual de Matérias & Métricas
* **Identificação por Cores:** Codificação visual para Matemática, Português, Redação, Ciências da Natureza, Humanas e Revisões.
* **Painel de Desempenho:** Rastreamento contínuo do total de blocos concluídos e horas líquidas estudadas.

### 4. Suporte PWA (Progressive Web App)
* **Instalação Simplificada:** Botão inteligente no topo para instalar o app direto na tela inicial do celular ou desktop.

---

## 🛠️ Arquitetura Técnica & Stack

* **Core:** [React 18](https://react.dev/) + [Vite]( https://vitejs.dev/)
* **Linguagem:** JavaScript (ES6+)
* **Estilização:** CSS Customizado (CSS-in-JS + Flexbox / CSS Grid / Scrollbar estilizada)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Som:** Web Audio API (Sintetizador nativo sem arquivos de áudio externos)
* **Persistência de Dados:** `LocalStorage` do navegador
* **Deploy & CI/CD:** [Vercel](https://vercel.com/)

---

## 🛣️ Roadmap de Evolução

[ MVP - Fase 1 ] ────────► [ Fase 2 ] ──────────────► [ Fase 3 ]
• Rotina Diária            • Banco de Questões        • Sistema de Conquistas
• Cronograma Adaptável     • Registro de Simulados    • Exportação de Relatórios
• Timer com Alarme         • Sistema de Revisões      • Sincronização em Nuvem
• Suporte PWA / Celular    • Gráficos Mensais         • Timer Pomodoro Configurável
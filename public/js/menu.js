fetch('/user')
  .then(res => res.json())
  .then(user => {
    
    const sidebar = document.getElementById('sidebar');

    let links = `
      <div class="logo">SISGO</div>
      
      <a class="menu-btn" href="/visualizar-notas.html">
        <span>📄</span> Visualizar Notas
      </a>

      <a class="menu-btn" href="/visualizar-ordens.html">
        <span>📋</span> Visualizar Ordens
      </a>
    `;

    if (user.tipo === 'admin') {
      links =
        `
        <div class="logo">SISGO (ADM)</div>

        <a class="menu-btn" href="/criar-nota.html">
          <span>➕</span> Criar Nota
        </a>

        <a class="menu-btn" href="/abrir-ordem.html">
          <span>➕</span> Abrir Ordem
        </a>

        <a class="menu-cadastro" href="/cadastro.html">
          <span>👤</span> Cadastrar Usuário
        </a>
        ` + links;
    }

    links += `
      <a class="menu-sair logout" href="/logout">
        <span>🚪</span> Sair
      </a>
    `;

    sidebar.innerHTML = links;
  });

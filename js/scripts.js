// js/scripts.js
// ======================================
// MÓDULO PRINCIPAL (IIFE pra evitar globais)
// ======================================
(() => {
  // ======================================
  // 1. TEMPLATES (SISTEMA DE TEMPLATES JS)
  // ======================================

  const Templates = {
    projetos: {
      educacao: `
        <article class="card" id="projeto-educacao">
          <header class="card-header">
            <h3 class="card-title">Projeto Educação em Movimento</h3>
            <span class="badge badge-primary">Educação</span>
          </header>

          <img src="img/projeto-1.jpg" alt="Crianças estudando em uma sala de aula comunitária">

          <p>
            O projeto oferece reforço escolar, oficinas de leitura e escrita, além de atividades lúdicas
            para crianças em idade escolar que apresentam dificuldades de aprendizagem.
          </p>

          <ul>
            <li>Mais de 200 crianças atendidas por ano;</li>
            <li>Parceria com escolas públicas da região;</li>
            <li>Melhoria no desempenho escolar e redução da evasão.</li>
          </ul>

          <button class="btn btn-primary" type="button">
            Quero ser voluntário(a)
          </button>
        </article>
      `,
      renda: `
        <article class="card" id="projeto-renda">
          <header class="card-header">
            <h3 class="card-title">Projeto Renda que Transforma</h3>
            <span class="badge badge-secondary">Geração de renda</span>
          </header>

          <img src="img/voluntarios.jpg" alt="Voluntários em oficina de empreendedorismo">

          <p>
            Esse projeto oferece oficinas de capacitação profissional, educação financeira e apoio a pequenos
            empreendedores, especialmente mulheres chefes de família.
          </p>

          <ul>
            <li>Mais de 80 famílias beneficiadas diretamente;</li>
            <li>Mentorias com profissionais voluntários;</li>
            <li>Parcerias com empresas para microcrédito.</li>
          </ul>

          <button class="btn btn-primary" type="button">
            Quero saber mais
          </button>
        </article>
      `
    }
  };

  function renderTemplate(container, html) {
    if (!container) return;
    container.innerHTML = html;
  }

  // ======================================
  // 2. SPA BÁSICO EM "PROJETOS" (DOM + TEMPLATES)
  // ======================================

  function initProjetosSPA() {
    const container = document.querySelector('[data-projetos-spa]');
    const buttons = document.querySelectorAll('[data-project-view]');

    if (!container || !buttons.length) return; // página não é projetos.html

    const viewsMap = {
      educacao: Templates.projetos.educacao,
      renda: Templates.projetos.renda
    };

    function setActiveButton(view) {
      buttons.forEach(btn => {
        const currentView = btn.getAttribute('data-project-view');
        if (currentView === view) {
          btn.classList.remove('btn-secondary');
          btn.classList.add('btn-primary');
        } else {
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-secondary');
        }
      });
    }

    function navigateTo(view) {
      const template = viewsMap[view] || viewsMap.educacao;
      renderTemplate(container, template);
      setActiveButton(view);
      // hash simples pra "simular" rota SPA
      window.location.hash = `#${view}`;
    }

    // Eventos de clique
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-project-view');
        navigateTo(view);
      });
    });

    // Estado inicial baseado na hash (ex: projetos.html#renda)
    const initialHash = window.location.hash.replace('#', '');
    const initialView = viewsMap[initialHash] ? initialHash : 'educacao';
    navigateTo(initialView);
  }

  // ======================================
  // 3. MÁSCARAS DE INPUT (CPF, TEL, CEP)
  // ======================================

  function aplicarMascaraCPF(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function aplicarMascaraTelefone(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2');
  }

  function aplicarMascaraCEP(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
  }

  function initFormMasks() {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');

    if (cpfInput) {
      cpfInput.addEventListener('input', function () {
        this.value = aplicarMascaraCPF(this.value);
      });
    }

    if (telefoneInput) {
      telefoneInput.addEventListener('input', function () {
        this.value = aplicarMascaraTelefone(this.value);
      });
    }

    if (cepInput) {
      cepInput.addEventListener('input', function () {
        this.value = aplicarMascaraCEP(this.value);
      });
    }
  }

  // ======================================
  // 4. TOASTS / FEEDBACK VISUAL
  // ======================================

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.classList.add('toast', 'is-visible');

    // cores simples por tipo
    if (type === 'success') {
      toast.style.backgroundColor = '#16a34a';
    } else if (type === 'error') {
      toast.style.backgroundColor = '#dc2626';
    } else if (type === 'warning') {
      toast.style.backgroundColor = '#eab308';
      toast.style.color = '#111827';
    }

    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  }

  // ======================================
  // 5. VALIDAÇÃO DE CONSISTÊNCIA DO FORMULÁRIO
  // ======================================

  function calcularIdade(dataNascimentoStr) {
    if (!dataNascimentoStr) return null;
    const hoje = new Date();
    const dataNasc = new Date(dataNascimentoStr);
    if (isNaN(dataNasc.getTime())) return null;

    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade;
  }

  function limparErrosForm(form) {
    // Remove mensagens de erro anteriores
    form.querySelectorAll('.field-error').forEach(el => el.remove());
  }

  function adicionarErroCampo(input, mensagem) {
    // Não duplicar mensagens
    const parent = input.closest('div') || input.parentElement;
    if (!parent) return;

    let errorEl = parent.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.classList.add('field-error');
      parent.appendChild(errorEl);
    }
    errorEl.textContent = mensagem;
  }

  function mostrarAlertForm(mensagens) {
    const alertContainer = document.getElementById('form-alert-container');
    if (!alertContainer) return;

    if (!mensagens.length) {
      alertContainer.innerHTML = '';
      return;
    }

    const html = `
      <div class="alert alert-danger" role="alert">
        <div>
          <div class="alert-title">Verifique os campos destacados:</div>
          <ul>
            ${mensagens.map(msg => `<li>${msg}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    alertContainer.innerHTML = html;
  }

  function validarConsistenciaFormulario(form) {
    const mensagensGerais = [];
    limparErrosForm(form);

    const nome = form.querySelector('#nome-completo');
    const email = form.querySelector('#email');
    const cpf = form.querySelector('#cpf');
    const telefone = form.querySelector('#telefone');
    const dataNasc = form.querySelector('#data-nascimento');
    const cep = form.querySelector('#cep');
    const cidade = form.querySelector('#cidade');
    const estado = form.querySelector('#estado');
    const checkboxesTipo = form.querySelectorAll('input[name="tipo-participacao"]');
    const aceiteTermos = form.querySelector('input[name="aceite-termos"]');

    // 1) Nome: pelo menos 3 caracteres e 2 palavras
    if (nome) {
      const valor = nome.value.trim();
      const partes = valor.split(/\s+/);
      if (valor.length < 3 || partes.length < 2) {
        mensagensGerais.push('Informe seu nome completo (nome e sobrenome).');
        adicionarErroCampo(nome, 'Digite seu nome completo (mínimo nome e sobrenome).');
      }
    }

    // 2) Email: checagem simples de padrão
    if (email) {
      const valor = email.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valor)) {
        mensagensGerais.push('E-mail em formato inválido.');
        adicionarErroCampo(email, 'Informe um e-mail válido (ex: nome@dominio.com).');
      }
    }

    // 3) CPF: 11 dígitos depois da máscara
    if (cpf) {
      const somenteDigitos = cpf.value.replace(/\D/g, '');
      if (somenteDigitos.length !== 11) {
        mensagensGerais.push('CPF deve conter 11 dígitos.');
        adicionarErroCampo(cpf, 'CPF deve ter 11 dígitos.');
      }
    }

    // 4) Telefone: pelo menos 10 dígitos
    if (telefone) {
      const digits = telefone.value.replace(/\D/g, '');
      if (digits.length < 10) {
        mensagensGerais.push('Telefone/WhatsApp incompleto.');
        adicionarErroCampo(telefone, 'Informe DDD + número (ex: (11) 99999-0000).');
      }
    }

    // 5) Idade mínima 16 anos
    if (dataNasc) {
      const idade = calcularIdade(dataNasc.value);
      if (idade === null || idade < 16) {
        mensagensGerais.push('Idade mínima para cadastro é de 16 anos.');
        adicionarErroCampo(dataNasc, 'Idade mínima é 16 anos.');
      }
    }

    // 6) CEP: 8 dígitos
    if (cep) {
      const digits = cep.value.replace(/\D/g, '');
      if (digits.length !== 8) {
        mensagensGerais.push('CEP deve conter 8 dígitos.');
        adicionarErroCampo(cep, 'CEP deve ter 8 dígitos (ex: 12345-678).');
      }
    }

    // 7) Cidade/Estado não vazios
    if (cidade && !cidade.value.trim()) {
      mensagensGerais.push('Informe a cidade.');
      adicionarErroCampo(cidade, 'Cidade é obrigatória.');
    }

    if (estado && !estado.value) {
      mensagensGerais.push('Selecione o estado.');
      adicionarErroCampo(estado, 'Selecione um estado.');
    }

    // 8) Pelo menos um tipo de participação
    let algumTipoMarcado = false;
    checkboxesTipo.forEach(cb => {
      if (cb.checked) algumTipoMarcado = true;
    });
    if (!algumTipoMarcado) {
      mensagensGerais.push('Selecione ao menos uma forma de participação (voluntário, doador, parceiro).');
      // coloca erro no primeiro checkbox
      if (checkboxesTipo[0]) {
        adicionarErroCampo(checkboxesTipo[0], 'Selecione pelo menos uma opção.');
      }
    }

    // 9) Aceite dos termos
    if (aceiteTermos && !aceiteTermos.checked) {
      mensagensGerais.push('É necessário aceitar os termos de uso dos dados.');
      adicionarErroCampo(aceiteTermos, 'Marque esta opção para prosseguir.');
    }

    mostrarAlertForm(mensagensGerais);

    return {
      valido: mensagensGerais.length === 0,
      mensagens: mensagensGerais
    };
  }

  function salvarCadastroNoLocalStorage(form) {
    // Exemplo simples de uso de localStorage
    const nome = form.querySelector('#nome-completo')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const cidade = form.querySelector('#cidade')?.value.trim();
    const estado = form.querySelector('#estado')?.value;

    const novoCadastro = {
      nome,
      email,
      cidade,
      estado,
      data: new Date().toISOString()
    };

    const chave = 'ong_cadastros';
    const atual = JSON.parse(localStorage.getItem(chave) || '[]');
    atual.push(novoCadastro);
    localStorage.setItem(chave, JSON.stringify(atual));
  }

  function initFormValidation() {
    const form = document.querySelector('[data-form-cadastro]');
    if (!form) return;

    form.addEventListener('submit', event => {
      event.preventDefault();

      const resultado = validarConsistenciaFormulario(form);

      if (!resultado.valido) {
        showToast('Há campos com erros. Revise o formulário.', 'error');
        // foca no primeiro campo inválido, se existir
        const primeiroErro = form.querySelector('.field-error');
        if (primeiroErro) {
          const campo = primeiroErro.previousElementSibling || primeiroErro.parentElement.querySelector('input, select, textarea');
          if (campo && typeof campo.focus === 'function') {
            campo.focus();
          }
        }
        return;
      }

      // Se passou por toda validação customizada
      salvarCadastroNoLocalStorage(form);
      showToast('Cadastro enviado com sucesso! 🎉', 'success');

      // Limpa alertas e formulário
      mostrarAlertForm([]);
      form.reset();
    });
  }

  // ======================================
  // 6. INICIALIZAÇÃO GERAL
  // ======================================

  document.addEventListener('DOMContentLoaded', () => {
    initProjetosSPA();     // SPA + templates em projetos.html
    initFormMasks();       // Máscaras CPF/Tel/CEP
    initFormValidation();  // Validação de consistência + localStorage
  });
})();

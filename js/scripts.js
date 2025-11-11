// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  // set year in footers
  const ano = new Date().getFullYear();
  document.getElementById('ano')?.textContent = ano;
  document.getElementById('ano-2')?.textContent = ano;
  document.getElementById('ano-3')?.textContent = ano;

  // form masking: CPF, telefone, CEP
  function setInputFilter(el, formatter){
    if(!el) return;
    el.addEventListener('input', e => {
      const pos = el.selectionStart;
      const before = el.value;
      el.value = formatter(el.value);
      // try to keep caret near previous position (basic)
      if (el.setSelectionRange) {
        const diff = el.value.length - before.length;
        el.setSelectionRange(pos + diff, pos + diff);
      }
    });
  }

  const cpfEl = document.getElementById('cpf');
  setInputFilter(cpfEl, v => {
    const digits = v.replace(/\D/g,'').slice(0,11);
    return digits
      .replace(/(\d{3})(\d)/,'$1.$2')
      .replace(/(\d{3})(\d)/,'$1.$2')
      .replace(/(\d{3})(\d{1,2})$/,'$1-$2');
  });

  const telEl = document.getElementById('telefone');
  setInputFilter(telEl, v => {
    const d = v.replace(/\D/g,'').slice(0,11);
    if (d.length <= 10) {
      return d.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3').replace(/-$/,'');
    }
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3');
  });

  const cepEl = document.getElementById('cep');
  setInputFilter(cepEl, v => {
    const d = v.replace(/\D/g,'').slice(0,8);
    return d.replace(/(\d{5})(\d)/,'$1-$2');
  });

  // Simple CPF validity checker (mod 11)
  function validaCPF(cpf){
    if(!cpf) return false;
    const nums = cpf.replace(/\D/g,'');
    if(nums.length !== 11) return false;
    if(/^(\d)\1+$/.test(nums)) return false; // all same digits
    const calc = (t) => {
      let s=0;
      for(let i=0;i<t;i++) s += parseInt(nums[i]) * (t+1-i);
      let r = s % 11;
      return r < 2 ? 0 : 11 - r;
    };
    const d1 = calc(9);
    const d2 = calc(10);
    return d1 === parseInt(nums[9]) && d2 === parseInt(nums[10]);
  }

  const form = document.getElementById('form-cadastro');
  if(form){
    form.addEventListener('submit', (e) => {
      // native validation first
      if(!form.checkValidity()){
        // allow browser to show built-in messages
        return;
      }

      const cpfInput = document.getElementById('cpf');
      if(cpfInput && cpfInput.value){
        if(!validaCPF(cpfInput.value)){
          e.preventDefault();
          cpfInput.setCustomValidity('CPF inválido');
          cpfInput.reportValidity();
          setTimeout(()=> cpfInput.setCustomValidity(''), 3000);
          return;
        }
      }
      // otherwise simulate a submit (for demo)
      e.preventDefault();
      alert('Cadastro enviado com sucesso (simulação). Verifique o console para os dados.');
      const data = new FormData(form);
      const obj = Object.fromEntries(data.entries());
      console.log('Dados do formulário:', obj);
    });
  }

});

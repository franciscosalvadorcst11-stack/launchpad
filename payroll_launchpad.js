/* =========================================================
   Payroll Launchpad - Carrossel de acessos ECP
   Para usar como target "JavaScript" num custom card da
   homepage do SuccessFactors. Ao clicar no cartao, o SF
   injeta este script e o popup abre com o carrossel.
   Puro JavaScript, sem dependencias. Shadow DOM para
   isolar estilos do resto da pagina SF.
   ========================================================= */
(function () {
  'use strict';

  /* Se o script ja correu (SF pode injetar de novo a cada clique),
     apenas reabre o popup existente. */
  if (window.__gsPayrollLaunchpad) {
    window.__gsPayrollLaunchpad.open();
    return;
  }

  var BASE = 'https://my5500523.payroll.hr.cloud.sap/sap/bc/gui/sap/its/webgui' +
             '?sap-client=100&sap-language=PT&~transaction=';

  /* MODO DE TESTE
     true  = todos os cartoes abrem o Google (com o codigo da
             transacao como pesquisa, para validares que cada
             cartao aponta para o sitio certo)
     false = links reais para o ECP (producao) */
  var TEST = true;

  var SECTIONS = [
    'Processo de Payroll',
    'Relat\u00f3rios Legais',
    'Outros Relat\u00f3rios',
    'Transfer\u00eancia Banc\u00e1ria',
    'Contabiliza\u00e7\u00e3o de Payroll'
  ];

  var GRADIENTS = [
    'linear-gradient(135deg,#0a4f7a 0%,#0581ab 60%,#02a4db 100%)',
    'linear-gradient(135deg,#0581ab 0%,#02aee8 100%)',
    'linear-gradient(135deg,#048ebd 0%,#02bef5 100%)',
    'linear-gradient(135deg,#037499 0%,#02a4db 100%)',
    'linear-gradient(135deg,#0b6090 0%,#02aee8 100%)'
  ];

  var DOT_COLORS = ['#0a4f7a', '#0581ab', '#048ebd', '#037499', '#0b6090'];

  /* sec = indice da seccao | icon | title | desc | tcode */
  var ITEMS = [
    { sec: 0, icon: '\uD83D\uDCCB', title: 'Gerir \u00c1rea de Payroll', desc: 'Acesso ao Payroll Control Record. Permite alterar o estado para executar ou simular o payroll', tcode: 'PA03' },
    { sec: 0, icon: '\uD83D\uDD04', title: 'Simula\u00e7\u00e3o de Payroll', desc: 'Simula\u00e7\u00e3o do payroll antes de iniciar o processamento mensal', tcode: 'PC00_M19_CALC_SIMU' },
    { sec: 0, icon: '\u2699\uFE0F', title: 'Execu\u00e7\u00e3o de Payroll', desc: 'In\u00edcio e execu\u00e7\u00e3o do processamento de payroll', tcode: 'PC00_M19_CALC' },
    { sec: 0, icon: '\uD83D\uDEAB', title: 'Exclus\u00e3o de Colaboradores PCC', desc: 'Aceda aqui \u00e0 tabela de exclus\u00e3o de colaboradores para processamento no PCC', tcode: 'zhr005' },
    { sec: 0, icon: '\uD83D\uDC65', title: 'Sele\u00e7\u00e3o de Colaboradores PCC', desc: 'Aceda aqui \u00e0 tabela de sele\u00e7\u00e3o de colaboradores para processamento no PCC', tcode: 'zhr007' },
    { sec: 0, icon: '\uD83D\uDCC5', title: 'Sele\u00e7\u00e3o de Datas PCC', desc: 'Selecione aqui a data de pagamento SEPA e/ou a data de contabiliza\u00e7\u00e3o para o processo PCC pretendido.', tcode: 'zhr200' },
    { sec: 1, icon: '\uD83D\uDCC4', title: 'Declara\u00e7\u00e3o Mensal de Rendimentos', desc: 'Gera\u00e7\u00e3o da declara\u00e7\u00e3o mensal para a Autoridade Tribut\u00e1ria', tcode: 'PC00_M19_RPCMIDP0' },
    { sec: 1, icon: '\uD83D\uDCB0', title: 'Declara\u00e7\u00e3o de Rendimentos via Internet (DRI)', desc: 'Declara\u00e7\u00e3o mensal para a Seguran\u00e7a Social', tcode: 'PC00_M19_DRI' },
    { sec: 1, icon: '\uD83D\uDEE1\uFE0F', title: 'Relat\u00f3rio de Seguros \u2013 Acidentes de Trabalho', desc: 'Relat\u00f3rio para envio \u00e0 seguradora', tcode: 'PC00_M19_WAR' },
    { sec: 1, icon: '\uD83D\uDCCA', title: 'Relat\u00f3rio \u00danico (RU)', desc: 'Relat\u00f3rio \u00danico anual', tcode: 'PC00_M19_RPCUNRP0' },
    { sec: 1, icon: '\uD83D\uDC64', title: 'Declara\u00e7\u00e3o Individual de Rendimentos', desc: 'Declara\u00e7\u00e3o anual por colaborador', tcode: 'PC00_M19_CIID' },
    { sec: 2, icon: '\uD83D\uDDFA\uFE0F', title: 'Relat\u00f3rio de Contribui\u00e7\u00f5es Sindicais', desc: 'Consulta de contribui\u00e7\u00f5es e atividade sindical', tcode: 'PC00_M19_LFEE' },
    { sec: 2, icon: '\uD83D\uDCCB', title: 'Relat\u00f3rio de R\u00fabricas', desc: 'Relat\u00f3rio com todos os wage types do payroll', tcode: 'PC00_M99_CWTR' },
    { sec: 2, icon: '\uD83D\uDCCB', title: 'Relat\u00f3rio de Penhoras', desc: 'Acesso ao relat\u00f3rio de Penhoras', tcode: 'PC00_M99_CWTR' },
    { sec: 2, icon: '\uD83C\uDFE6', title: 'Novo Banco', desc: 'Cria\u00e7\u00e3o de institui\u00e7\u00e3o banc\u00e1ria no sistema', tcode: 'FI01' },
    { sec: 3, icon: '\uD83D\uDD0D', title: 'Transfer\u00eancia Banc\u00e1ria \u2013 Sele\u00e7\u00e3o de Dados', desc: 'Sele\u00e7\u00e3o de colaboradores para pagamento', tcode: 'PC00_M19_CDTA' },
    { sec: 3, icon: '\uD83D\uDCCA', title: 'Transfer\u00eancia Banc\u00e1ria \u2013 Gera\u00e7\u00e3o de Ficheiro', desc: 'Gera\u00e7\u00e3o do ficheiro para envio ao banco', tcode: 'PC00_M99_FPAYM' },
    { sec: 3, icon: '\uD83C\uDFE6', title: 'Transfer\u00eancia Banc\u00e1ria \u2013 SEPA', desc: 'Gera\u00e7\u00e3o do ficheiro SEPA', tcode: 'FDTA' },
    { sec: 4, icon: '\uD83D\uDD0D', title: 'Contabiliza\u00e7\u00e3o \u2013 Sele\u00e7\u00e3o de Dados', desc: 'Sele\u00e7\u00e3o de dados para contabiliza\u00e7\u00e3o', tcode: 'PC00_M99_CIPE' },
    { sec: 4, icon: '\uD83D\uDCCA', title: 'Contabiliza\u00e7\u00e3o \u2013 Gera\u00e7\u00e3o de Ficheiro', desc: 'Gera\u00e7\u00e3o do documento contabil\u00edstico', tcode: 'PCP0' }
  ];

  var TOTAL = ITEMS.length;

  /* ---------- host + shadow root ---------- */
  var host = document.createElement('div');
  host.id = 'gs-payroll-launchpad-host';
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: 'open' });

  var css = [
    ':host{all:initial}',
    '.ovl{position:fixed;inset:0;z-index:2147483000;background:rgba(4,32,50,.55);',
    '  -webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);',
    '  display:none;align-items:center;justify-content:center;',
    '  font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif}',
    '.ovl.on{display:flex}',
    '.modal{width:min(640px,94vw);background:#f8f9fa;border-radius:16px;',
    '  box-shadow:0 24px 70px rgba(2,30,50,.45);padding:16px 18px 20px;position:relative}',
    '.hd{display:flex;align-items:center;justify-content:space-between;margin:0 4px 12px}',
    '.hd h2{margin:0;font-size:16px;font-weight:600;color:#0a4f7a;letter-spacing:.3px}',
    '.x{width:30px;height:30px;border:none;border-radius:50%;background:#e8eef2;color:#0a4f7a;',
    '  font-size:16px;line-height:1;cursor:pointer;transition:background .15s}',
    '.x:hover{background:#d6e4ec}',
    '.stage{position:relative}',
    '.win{overflow:hidden;border-radius:14px;margin:0 44px}',
    '.track{display:flex;transition:transform .35s ease;will-change:transform}',
    '.slide{min-width:100%;box-sizing:border-box}',
    '.card{display:flex;flex-direction:column;gap:8px;height:236px;box-sizing:border-box;',
    '  padding:20px 24px;border-radius:14px;color:#fff;text-decoration:none;',
    '  position:relative;overflow:hidden;box-shadow:0 4px 14px rgba(6,60,95,.25);',
    '  transition:transform .2s ease,box-shadow .2s ease}',
    '.card:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(6,60,95,.35)}',
    '.card::before{content:"";position:absolute;top:-40%;right:-18%;width:55%;height:190%;',
    '  background:rgba(255,255,255,.07);transform:rotate(16deg);pointer-events:none}',
    '.badge{align-self:flex-start;background:rgba(255,255,255,.18);',
    '  border:1px solid rgba(255,255,255,.28);padding:3px 10px;border-radius:999px;',
    '  font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase}',
    '.ico{font-size:34px;line-height:1;margin-top:4px}',
    '.tt{font-size:19px;font-weight:600;line-height:1.25}',
    '.dd{font-size:13px;line-height:1.45;opacity:.92}',
    '.ft{margin-top:auto;display:flex;justify-content:space-between;font-size:11px;opacity:.75}',
    '.arr{position:absolute;top:50%;transform:translateY(-50%);width:38px;height:38px;',
    '  border:none;border-radius:50%;background:#fff;color:#0a4f7a;font-size:18px;font-weight:700;',
    '  display:flex;align-items:center;justify-content:center;cursor:pointer;',
    '  box-shadow:0 2px 10px rgba(6,60,95,.28);z-index:5;',
    '  transition:transform .15s ease,background .15s ease}',
    '.arr:hover{background:#eaf6fc;transform:translateY(-50%) scale(1.1)}',
    '.arr.p{left:0}.arr.n{right:0}',
    '.dots{display:flex;justify-content:center;align-items:center;gap:6px;',
    '  margin-top:14px;flex-wrap:wrap}',
    '.dot{width:9px;height:9px;border:none;border-radius:50%;padding:0;cursor:pointer;',
    '  opacity:.35;transition:opacity .2s ease,transform .2s ease}',
    '.dot:hover{opacity:.7}',
    '.dot.g{margin-left:12px}',
    '.dot.on{opacity:1;transform:scale(1.45)}',
    '@media (max-width:480px){',
    '  .win{margin:0 40px}.card{height:290px;padding:18px 20px}.tt{font-size:17px}}',
    '@media (prefers-reduced-motion:reduce){',
    '  .track,.card,.arr,.dot{transition:none}}'
  ].join('\n');

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var slidesHtml = ITEMS.map(function (it, i) {
    return '<div class="slide">' +
      '<a class="card" style="background:' + GRADIENTS[it.sec] + '" href="' +
      (TEST ? 'https://www.google.com/search?q=' + it.tcode
            : BASE + it.tcode + '#') +
      '" target="_blank" rel="noopener">' +
      '<span class="badge">' + esc(SECTIONS[it.sec]) + '</span>' +
      '<span class="ico">' + it.icon + '</span>' +
      '<span class="tt">' + esc(it.title) + '</span>' +
      '<span class="dd">' + esc(it.desc) + '</span>' +
      '<span class="ft"><span>Clique para abrir \u2197</span><span>' + (i + 1) + ' / ' + TOTAL + '</span></span>' +
      '</a></div>';
  }).join('');

  var dotsHtml = ITEMS.map(function (it, i) {
    var firstOfSection = i > 0 && ITEMS[i - 1].sec !== it.sec;
    return '<button class="dot' + (firstOfSection ? ' g' : '') + (i === 0 ? ' on' : '') +
      '" data-i="' + i + '" style="background:' + DOT_COLORS[it.sec] +
      '" title="' + esc(it.title) + '"></button>';
  }).join('');

  root.innerHTML =
    '<style>' + css + '</style>' +
    '<div class="ovl">' +
    '  <div class="modal" role="dialog" aria-label="Payroll Launchpad">' +
    '    <div class="hd"><h2>Acessos de Payroll</h2>' +
    '      <button class="x" title="Fechar" aria-label="Fechar">\u2715</button></div>' +
    '    <div class="stage">' +
    '      <button class="arr p" aria-label="Anterior">\u276E</button>' +
    '      <div class="win"><div class="track">' + slidesHtml + '</div></div>' +
    '      <button class="arr n" aria-label="Seguinte">\u276F</button>' +
    '    </div>' +
    '    <div class="dots">' + dotsHtml + '</div>' +
    '  </div>' +
    '</div>';

  var ovl = root.querySelector('.ovl');
  var track = root.querySelector('.track');
  var dots = Array.prototype.slice.call(root.querySelectorAll('.dot'));
  var idx = 0;

  function go(n) {
    idx = ((n % TOTAL) + TOTAL) % TOTAL; /* rotacao infinita */
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
  }

  function onKey(e) {
    if (e.key === 'ArrowRight') { go(idx + 1); }
    else if (e.key === 'ArrowLeft') { go(idx - 1); }
    else if (e.key === 'Escape') { close(); }
  }

  function open() {
    ovl.classList.add('on');
    document.addEventListener('keydown', onKey);
  }

  function close() {
    ovl.classList.remove('on');
    document.removeEventListener('keydown', onKey);
  }

  root.querySelector('.arr.p').addEventListener('click', function () { go(idx - 1); });
  root.querySelector('.arr.n').addEventListener('click', function () { go(idx + 1); });
  root.querySelector('.x').addEventListener('click', close);
  ovl.addEventListener('click', function (e) { if (e.target === ovl) { close(); } });
  dots.forEach(function (d) {
    d.addEventListener('click', function () { go(parseInt(d.getAttribute('data-i'), 10)); });
  });

  /* swipe no telemovel */
  var touchX = null;
  track.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (touchX === null) { return; }
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { go(dx < 0 ? idx + 1 : idx - 1); }
    touchX = null;
  }, { passive: true });

  window.__gsPayrollLaunchpad = { open: open, close: close };

  /* o clique no cartao SF e o gatilho, portanto abrimos ja */
  open();
})();

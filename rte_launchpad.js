/* =========================================================
   Launchpad RTE - Carrossel de documentos e informacoes
   Para usar como target "JavaScript" num custom card da
   homepage do SuccessFactors.

   >>> PARA EDITAR OS CARTOES, MEXER APENAS NA LISTA "ITEMS"
   >>> LOGO ABAIXO. Cada linha e um cartao:
   >>>   sec   = numero da seccao (0 a 4, ver lista SECTIONS)
   >>>   icon  = emoji do cartao
   >>>   title = titulo grande
   >>>   desc  = texto descritivo
   >>>   url   = link do documento (gerado no SF)
   >>> Para acrescentar um cartao, copiar uma linha inteira
   >>> { ... }, colar e alterar. Nao esquecer a virgula entre
   >>> linhas.
   ========================================================= */
(function () {
  'use strict';

  if (window.__rteLaunchpad) {
    window.__rteLaunchpad.open();
    return;
  }

  var SECTIONS = [
    'Manual do Utilizador de SuccessFactors',   /* sec: 0 */
    'Agendamento de F\u00e9rias',                /* sec: 1 */
    'Informa\u00e7\u00f5es Importantes RTE',     /* sec: 2 */
    'Objetivos Mensais',                         /* sec: 3 */
    'Promo\u00e7\u00f5es'                        /* sec: 4 */
  ];

  var DOC = 'https://dmscdn.successfactors.com/6eb91ce87f09cce28d371dc87d6e2fbba965a657d8e1783dc3e7adb645d146bf/static_content/3d63bc610c4742239a5c/RTE_Quickguide_Colaborador.pdf';

  var ITEMS = [
    { sec: 0, icon: '\uD83D\uDCD8', title: 'Quickguide do Colaborador', desc: 'Guia r\u00e1pido do colaborador para utiliza\u00e7\u00e3o do SuccessFactors', url: DOC },
    { sec: 1, icon: '\uD83C\uDFD6\uFE0F', title: 'Mapa de F\u00e9rias', desc: 'Consulte aqui a informa\u00e7\u00e3o sobre o agendamento de f\u00e9rias', url: DOC },
    { sec: 2, icon: '\uD83D\uDCE2', title: 'Comunicados', desc: 'Comunica\u00e7\u00f5es e avisos importantes para todos os colaboradores', url: DOC },
    { sec: 3, icon: '\uD83C\uDFAF', title: 'Objetivos do M\u00eas', desc: 'Consulte os objetivos definidos para o m\u00eas em curso', url: DOC },
    { sec: 4, icon: '\u2B50', title: 'Oportunidades Internas', desc: 'Informa\u00e7\u00e3o sobre promo\u00e7\u00f5es e oportunidades internas', url: DOC }
  ];

  /* ---------- a partir daqui e o motor, nao precisa de edicao ---------- */

  var GRADIENTS = [
    'linear-gradient(135deg,#0a4f7a 0%,#0581ab 60%,#02a4db 100%)',
    'linear-gradient(135deg,#0581ab 0%,#02aee8 100%)',
    'linear-gradient(135deg,#048ebd 0%,#02bef5 100%)',
    'linear-gradient(135deg,#037499 0%,#02a4db 100%)',
    'linear-gradient(135deg,#0b6090 0%,#02aee8 100%)'
  ];

  var DOT_COLORS = ['#0a4f7a', '#0581ab', '#048ebd', '#037499', '#0b6090'];

  var TOTAL = ITEMS.length;

  var host = document.createElement('div');
  host.id = 'rte-launchpad-host';
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
      '<a class="card" style="background:' + GRADIENTS[it.sec % GRADIENTS.length] + '" href="' +
      esc(it.url) +
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
      '" data-i="' + i + '" style="background:' + DOT_COLORS[it.sec % DOT_COLORS.length] +
      '" title="' + esc(it.title) + '"></button>';
  }).join('');

  root.innerHTML =
    '<style>' + css + '</style>' +
    '<div class="ovl">' +
    '  <div class="modal" role="dialog" aria-label="Launchpad RTE">' +
    '    <div class="hd"><h2>Informa\u00e7\u00e3o ao Colaborador</h2>' +
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
    idx = ((n % TOTAL) + TOTAL) % TOTAL;
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

  window.__rteLaunchpad = { open: open, close: close };

  open();
})();

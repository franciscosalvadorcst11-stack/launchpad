/* =========================================================
   Launchpad RTE - Carrossel de documentos e informacoes
   Versao coverflow: 3 cartoes em palco, o central focado,
   os laterais com blur. Para usar como target "JavaScript"
   num custom card da homepage do SuccessFactors.

   >>> ZONA EDITAVEL: LISTAS "SECTIONS", "ITEMS" E "COLORS".
   >>> Cada linha de ITEMS e um cartao:
   >>>   sec   = numero da seccao (0 a 4, ver lista SECTIONS)
   >>>   icon  = emoji do cartao
   >>>   title = titulo grande
   >>>   desc  = texto descritivo
   >>>   url   = link do documento (gerado no SF)
   >>>   img   = fotografia de fundo (qualquer URL de imagem;
   >>>           deixar '' para usar o fundo verde liso)
   >>> Para acrescentar um cartao: copiar uma linha inteira
   >>> { ... }, colar e alterar. Nao esquecer a virgula.
   >>> As fotos atuais vem do Pexels (licenca livre, uso
   >>> comercial permitido, sem atribuicao obrigatoria).
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
    { sec: 0, icon: '\uD83D\uDCD8', title: 'Quickguide do Colaborador',
      desc: 'Guia r\u00e1pido do colaborador para utiliza\u00e7\u00e3o do SuccessFactors',
      url: DOC,
      img: 'https://images.pexels.com/photos/5808013/pexels-photo-5808013.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { sec: 1, icon: '\uD83C\uDFD6\uFE0F', title: 'Mapa de F\u00e9rias',
      desc: 'Consulte aqui a informa\u00e7\u00e3o sobre o agendamento de f\u00e9rias',
      url: DOC,
      img: 'https://images.pexels.com/photos/22435505/pexels-photo-22435505.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { sec: 2, icon: '\uD83D\uDCE2', title: 'Comunicados',
      desc: 'Comunica\u00e7\u00f5es e avisos importantes para todos os colaboradores',
      url: DOC,
      img: 'https://images.pexels.com/photos/31628823/pexels-photo-31628823.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { sec: 3, icon: '\uD83C\uDFAF', title: 'Objetivos do M\u00eas',
      desc: 'Consulte os objetivos definidos para o m\u00eas em curso',
      url: DOC,
      img: 'https://images.pexels.com/photos/14452221/pexels-photo-14452221.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { sec: 4, icon: '\u2B50', title: 'Oportunidades Internas',
      desc: 'Informa\u00e7\u00e3o sobre promo\u00e7\u00f5es e oportunidades internas',
      url: DOC,
      img: 'https://images.pexels.com/photos/32143008/pexels-photo-32143008.jpeg?auto=compress&cs=tinysrgb&w=900' }
  ];

  /* Fotos alternativas (Pexels, mesma licenca), para trocar no img:
     Oficina Bordeaux:   https://images.pexels.com/photos/31628832/pexels-photo-31628832.jpeg?auto=compress&cs=tinysrgb&w=900
     Estrada de montanha: https://images.pexels.com/photos/16135515/pexels-photo-16135515.jpeg?auto=compress&cs=tinysrgb&w=900
     Prova em Portugal:   https://images.pexels.com/photos/33347973/pexels-photo-33347973.jpeg?auto=compress&cs=tinysrgb&w=900
     Ciclistas na estrada: https://images.pexels.com/photos/5807590/pexels-photo-5807590.jpeg?auto=compress&cs=tinysrgb&w=900 */

  /* Paleta (trocar aqui quando houver os codigos do manual de marca RTE) */
  var COLORS = {
    ink:   '#0F1519',   /* asfalto / carbono */
    green: '#0E8A4E',   /* verde principal */
    dark:  '#0A5C36',   /* verde escuro */
    lime:  '#C3E84C',   /* acento energia */
    paper: '#F4F6F4'    /* fundo do modal */
  };

  /* ---------- a partir daqui e o motor, nao precisa de edicao ---------- */

  var DOT_COLORS = ['#0A5C36', '#0E8A4E', '#26B36B', '#8CBF3F', '#123B2A'];
  var OVERLAY = 'linear-gradient(170deg, rgba(10,16,14,.90) 0%, rgba(10,16,14,.50) 45%, rgba(14,138,78,.40) 100%)';
  var FALLBACK = 'linear-gradient(135deg,#0A5C36 0%,#0E8A4E 60%,#26B36B 100%)';
  var TOTAL = ITEMS.length;

  /* tipografia: Barlow Condensed (titulos) + Barlow (texto) */
  if (!document.getElementById('rte-lp-fonts')) {
    var fl = document.createElement('link');
    fl.id = 'rte-lp-fonts';
    fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap';
    document.head.appendChild(fl);
  }

  var host = document.createElement('div');
  host.id = 'rte-launchpad-host';
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: 'open' });

  var css = [
    ':host{all:initial}',
    '.ovl{position:fixed;inset:0;z-index:2147483000;background:rgba(8,18,14,.60);',
    '  -webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);',
    '  display:none;align-items:center;justify-content:center;',
    '  font-family:"Barlow","Segoe UI",Tahoma,sans-serif}',
    '.ovl.on{display:flex}',
    '.modal{width:min(900px,96vw);background:' + COLORS.paper + ';border-radius:18px;',
    '  box-shadow:0 26px 80px rgba(4,20,12,.5);padding:16px 18px 20px;position:relative}',
    '.hd{display:flex;align-items:center;justify-content:space-between;margin:0 6px 8px}',
    '.hd h2{margin:0;font-family:"Barlow Condensed","Segoe UI",sans-serif;font-size:20px;',
    '  font-weight:700;color:' + COLORS.ink + ';letter-spacing:.5px;text-transform:uppercase;',
    '  display:flex;align-items:center;gap:9px}',
    '.hd .bar{display:inline-block;width:20px;height:5px;background:' + COLORS.lime + ';border-radius:3px}',
    '.x{width:32px;height:32px;border:none;border-radius:50%;background:#E3EAE4;color:' + COLORS.dark + ';',
    '  font-size:15px;line-height:1;cursor:pointer;transition:background .15s}',
    '.x:hover{background:#D2DED4}',
    '.stage{position:relative;height:308px;overflow:hidden;',
    '  --w:340px;--h:264px;--o1:252px;--o2:460px}',
    '.slide{position:absolute;top:50%;left:50%;width:var(--w);height:var(--h);',
    '  margin-left:calc(var(--w) / -2);margin-top:calc(var(--h) / -2);',
    '  transition:transform .55s cubic-bezier(.22,.61,.36,1),filter .55s ease,opacity .55s ease;',
    '  will-change:transform,filter,opacity}',
    '.p0{transform:translateX(0) scale(1);opacity:1;filter:none;z-index:30}',
    '.pl1{transform:translateX(calc(var(--o1) * -1)) scale(.78);opacity:.8;',
    '  filter:blur(3px) brightness(.7) saturate(.85);z-index:20}',
    '.pr1{transform:translateX(var(--o1)) scale(.78);opacity:.8;',
    '  filter:blur(3px) brightness(.7) saturate(.85);z-index:20}',
    '.pl2{transform:translateX(calc(var(--o2) * -1)) scale(.55);opacity:0;z-index:10;pointer-events:none}',
    '.pr2{transform:translateX(var(--o2)) scale(.55);opacity:0;z-index:10;pointer-events:none}',
    '.card{display:flex;flex-direction:column;gap:7px;width:100%;height:100%;box-sizing:border-box;',
    '  padding:20px 22px;border-radius:16px;color:#fff;text-decoration:none;',
    '  position:relative;overflow:hidden;box-shadow:0 10px 30px rgba(4,20,12,.35);',
    '  background-size:cover;background-position:center}',
    '.p0 .card{cursor:pointer}',
    '.pl1 .card,.pr1 .card{cursor:e-resize}',
    '.pl1 .card{cursor:w-resize}',
    '.card::before{content:"";position:absolute;top:-40%;right:-18%;width:55%;height:190%;',
    '  background:rgba(255,255,255,.05);transform:rotate(16deg);pointer-events:none}',
    '.badge{align-self:flex-start;background:rgba(255,255,255,.16);',
    '  border:1px solid rgba(255,255,255,.30);padding:3px 11px;border-radius:999px;',
    '  font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;',
    '  backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}',
    '.ico{font-size:32px;line-height:1;margin-top:2px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4))}',
    '.tt{font-family:"Barlow Condensed","Segoe UI",sans-serif;font-size:26px;font-weight:700;',
    '  line-height:1.1;letter-spacing:.4px;text-shadow:0 1px 10px rgba(0,0,0,.5)}',
    '.dd{font-size:13px;font-weight:400;line-height:1.45;opacity:.95;',
    '  text-shadow:0 1px 8px rgba(0,0,0,.55)}',
    '.ft{margin-top:auto;display:flex;justify-content:space-between;font-size:11px;',
    '  font-weight:500;opacity:.85;text-shadow:0 1px 6px rgba(0,0,0,.5)}',
    '.arr{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;',
    '  border:none;border-radius:50%;background:#fff;color:' + COLORS.dark + ';font-size:18px;font-weight:700;',
    '  display:flex;align-items:center;justify-content:center;cursor:pointer;',
    '  box-shadow:0 3px 12px rgba(4,20,12,.3);z-index:40;',
    '  transition:transform .15s ease,background .15s ease}',
    '.arr:hover{background:' + COLORS.lime + ';color:' + COLORS.ink + ';transform:translateY(-50%) scale(1.1)}',
    '.arr.p{left:6px}.arr.n{right:6px}',
    '.dots{display:flex;justify-content:center;align-items:center;gap:7px;',
    '  margin-top:12px;flex-wrap:wrap}',
    '.dot{width:9px;height:9px;border:none;border-radius:50%;padding:0;cursor:pointer;',
    '  opacity:.35;transition:opacity .2s ease,transform .2s ease}',
    '.dot:hover{opacity:.7}',
    '.dot.g{margin-left:13px}',
    '.dot.on{opacity:1;transform:scale(1.5)}',
    '@media (max-width:640px){',
    '  .stage{height:330px;--w:76vw;--h:300px;--o1:60vw;--o2:115vw}',
    '  .modal{padding:14px 10px 16px}.tt{font-size:22px}.hd h2{font-size:17px}}',
    '@media (prefers-reduced-motion:reduce){',
    '  .slide,.arr,.dot{transition:none}}'
  ].join('\n');

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var slidesHtml = ITEMS.map(function (it, i) {
    var bg = it.img
      ? OVERLAY + ',url("' + esc(it.img) + '") center/cover no-repeat'
      : FALLBACK;
    return '<div class="slide pr2" data-i="' + i + '">' +
      '<a class="card" style="background:' + bg + '" href="' + esc(it.url) + '"' +
      ' target="_blank" rel="noopener">' +
      '<span class="badge">' + esc(SECTIONS[it.sec]) + '</span>' +
      '<span class="ico">' + it.icon + '</span>' +
      '<span class="tt">' + esc(it.title) + '</span>' +
      '<span class="dd">' + esc(it.desc) + '</span>' +
      '<span class="ft"><span>Clique para abrir \u2197</span><span>' + (i + 1) + ' / ' + TOTAL + '</span></span>' +
      '</a></div>';
  }).join('');

  var dotsHtml = ITEMS.map(function (it, i) {
    var firstOfSection = i > 0 && ITEMS[i - 1].sec !== it.sec;
    return '<button class="dot' + (firstOfSection ? ' g' : '') +
      '" data-i="' + i + '" style="background:' + DOT_COLORS[it.sec % DOT_COLORS.length] +
      '" title="' + esc(it.title) + '"></button>';
  }).join('');

  root.innerHTML =
    '<style>' + css + '</style>' +
    '<div class="ovl">' +
    '  <div class="modal" role="dialog" aria-label="Launchpad RTE">' +
    '    <div class="hd"><h2><span class="bar"></span>Informa\u00e7\u00e3o ao Colaborador</h2>' +
    '      <button class="x" title="Fechar" aria-label="Fechar">\u2715</button></div>' +
    '    <div class="stage">' +
    '      <button class="arr p" aria-label="Anterior">\u276E</button>' +
           slidesHtml +
    '      <button class="arr n" aria-label="Seguinte">\u276F</button>' +
    '    </div>' +
    '    <div class="dots">' + dotsHtml + '</div>' +
    '  </div>' +
    '</div>';

  var ovl = root.querySelector('.ovl');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('.dot'));
  var idx = 0;

  function posClass(rel) {
    if (rel === 0) { return 'p0'; }
    if (rel === -1) { return 'pl1'; }
    if (rel === 1) { return 'pr1'; }
    return rel < 0 ? 'pl2' : 'pr2';
  }

  function go(n) {
    idx = ((n % TOTAL) + TOTAL) % TOTAL; /* rotacao infinita */
    slides.forEach(function (s, i) {
      var rel = ((i - idx) % TOTAL + TOTAL) % TOTAL;
      if (rel > TOTAL / 2) { rel -= TOTAL; }
      s.className = 'slide ' + posClass(rel);
      var a = s.firstChild;
      a.tabIndex = rel === 0 ? 0 : -1;
      s.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
    });
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

  /* clique num cartao lateral traz esse cartao para o centro,
     em vez de abrir o link; so o cartao focado abre o documento */
  slides.forEach(function (s) {
    s.addEventListener('click', function (e) {
      var i = parseInt(s.getAttribute('data-i'), 10);
      if (i !== idx) {
        e.preventDefault();
        e.stopPropagation();
        go(i);
      }
    });
  });

  /* swipe no telemovel */
  var stage = root.querySelector('.stage');
  var touchX = null;
  stage.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (touchX === null) { return; }
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { go(dx < 0 ? idx + 1 : idx - 1); }
    touchX = null;
  }, { passive: true });

  window.__rteLaunchpad = { open: open, close: close };

  go(0);
  open();
})();

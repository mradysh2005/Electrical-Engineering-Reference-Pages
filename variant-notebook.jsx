// RAD.ISH — variant-notebook.jsx
// Carbon palette · Crimson Pro serif + JetBrains Mono · single-file React app
//
// Pages:   Home · Engineering (Sheets + Projects) · Garage (Vehicles + Log + Procedures + Guides)
//          Vehicle detail (Overview | Procedures) · Procedure detail · Project detail
//          Lessons · Costs
//
// Shared component library lives at the top of the IIFE.
// Adding a procedure = one entry in site-data.js. The renderer does the rest.

(() => {
  // ═══════════════════════════════════════════════════════════════════════════
  //  DESIGN TOKENS
  // ═══════════════════════════════════════════════════════════════════════════
  const C = {
    bg:     '#0b0c0e',
    panel:  '#131418',
    panelW: '#171a1f',
    panelD: '#0f1013',
    ink:    '#ecead8',
    ink2:   '#b9b8a8',
    mute:   '#7a7869',
    line:   '#22231e',
    lineL:  '#1a1b17',
    lineS:  '#2f302a',
    accent: '#e6b022',
    accentD:'#c4920f',
    blue:   '#7299c9',
    red:    '#c8634d',
    green:  '#7aa05c',
  };

  const fontHead = '"Crimson Pro","Iowan Old Style","Palatino Linotype",Georgia,serif';
  const fontMono = '"JetBrains Mono","IBM Plex Mono",ui-monospace,Menlo,monospace';

  // Fonts
  if (!document.getElementById('nb-fonts')) {
    const link = document.createElement('link');
    link.id = 'nb-fonts'; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }
  // Global styles
  if (!document.getElementById('nb-styles')) {
    const s = document.createElement('style');
    s.id = 'nb-styles';
    s.textContent = `
      .nb { font-family:${fontMono}; color:${C.ink}; background:${C.bg}; height:100%; overflow:auto; font-size:13px; line-height:1.55; }
      .nb *::-webkit-scrollbar { display:none; }
      .nb * { scrollbar-width:none; }
      .nb-serif { font-family:${fontHead}; font-weight:500; letter-spacing:-0.005em; }
      .nb-mono  { font-family:${fontMono}; font-feature-settings:"tnum"; }
      .nb-sc { font-family:${fontMono}; font-size:10.5px; letter-spacing:.16em; text-transform:uppercase; color:${C.mute}; }
      .nb-mute { color:${C.mute}; }
      .nb-ink2 { color:${C.ink2}; }
      .nb-acc  { color:${C.accent}; }
      .nb-rule { border:0; border-top:1px solid ${C.line}; margin:0; }
      .nb-rule-l { border:0; border-top:1px solid ${C.lineL}; margin:0; }
      .nb-rule-strong { border:0; border-top:1px solid ${C.ink2}; margin:0; }
      .nb-card { background:${C.panelW}; border:1px solid ${C.line}; }
      .nb-row { cursor:pointer; transition:background .12s; }
      .nb-row:hover { background:${C.panel}; }
      .nb-row:hover .nb-row-title { color:${C.accent}; }
      .nb-tag {
        display:inline-flex; align-items:center; gap:5px; padding:2px 8px;
        border:1px solid ${C.lineS}; font-family:${fontMono}; font-size:10.5px;
        letter-spacing:.08em; text-transform:uppercase; color:${C.ink2};
        white-space:nowrap; flex-shrink:0;
      }
      .nb-tag-acc { background:${C.accent}; color:${C.bg}; border-color:${C.accent}; font-weight:500; }
      .nb-btn {
        display:inline-flex; align-items:center; gap:10px; padding:11px 22px;
        background:transparent; color:${C.ink}; border:1px solid ${C.ink2}; cursor:pointer;
        font-family:${fontMono}; font-size:12px; font-weight:500; letter-spacing:.02em;
        transition:background .12s,color .12s,border-color .12s;
      }
      .nb-btn:hover { background:${C.ink}; color:${C.bg}; border-color:${C.ink}; }
      .nb-btn-acc { background:${C.accent}; color:${C.bg}; border-color:${C.accent}; font-weight:600; }
      .nb-btn-acc:hover { background:${C.accentD}; border-color:${C.accentD}; color:${C.bg}; }
      .nb-tab {
        padding:10px 0; background:transparent; border:none; cursor:pointer;
        color:${C.mute}; font-family:${fontMono}; font-size:13px; font-weight:500;
        border-bottom:2px solid transparent; margin-right:28px; white-space:nowrap;
      }
      .nb-tab[data-active="true"] { color:${C.ink}; border-bottom-color:${C.accent}; }
      .nb-tab:hover { color:${C.ink}; }
      .nb-navbtn {
        display:flex; align-items:baseline; gap:6px; padding:14px 16px;
        background:transparent; border:none; cursor:pointer;
        font-family:${fontMono}; font-size:13px; transition:color .12s;
      }
      .nb-navbtn[data-active="true"]  { color:${C.ink}; }
      .nb-navbtn[data-active="false"] { color:${C.mute}; }
      .nb-navbtn:hover { color:${C.ink}; }
      .nb-step-done { opacity:.45; text-decoration:line-through; }
      @keyframes nb-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      .nb-fade { animation:nb-fade .22s ease; }
    `;
    document.head.appendChild(s);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  COLOR HELPERS
  // ═══════════════════════════════════════════════════════════════════════════
  const relColor  = (r) => r >= 7.5 ? C.green : r >= 6 ? C.accent : C.red;
  const kindColor = (k) => k === 'Repair' ? C.red : k === 'PM' ? C.green : k === 'Mod' ? C.blue : C.accent;
  const catColor  = (c) => c === 'routine' ? C.green : c === 'repair' ? C.red : c === 'mod' ? C.blue : C.accent;
  const statusColor = (s) => s === 'complete' ? C.green : s === 'active' ? C.accent : C.mute;

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Render **bold** inside step text as amber monospace spans
  const parseAccents = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color:C.accent, fontWeight:600, fontFamily:fontMono }}>{p}</strong>
        : p
    );
  };

  // Render a title where one accent word is amber + italic
  const renderTitle = (title, accent) => {
    if (!accent) return title;
    const idx = title.indexOf(accent);
    if (idx === -1) return title;
    return (
      <>
        {title.slice(0, idx)}
        <span style={{ color:C.accent, fontStyle:'italic' }}>{accent}</span>
        {title.slice(idx + accent.length)}
      </>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  MARK — logo glyph
  // ═══════════════════════════════════════════════════════════════════════════
  const Mark = ({ size=18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <path d="M0 0 H14 L20 6 V20 H0 Z" fill={C.accent}/>
      <path d="M14 0 V6 H20" stroke={C.bg} strokeWidth="1" fill="none"/>
      <circle cx="6" cy="13" r="1.4" fill={C.bg}/>
    </svg>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  //  VEHICLE TECHNICAL DRAWING
  // ═══════════════════════════════════════════════════════════════════════════
  const VehicleTech = ({ kind, height=100, stroke=C.ink2 }) => {
    if (kind === 'ranger') return (
      <svg viewBox="0 0 240 100" style={{ width:'100%', height }} fill="none" stroke={stroke} strokeWidth="1" strokeLinejoin="round">
        <path d="M14 72 L14 48 L84 48 L100 28 L144 28 L158 48 L222 48 L222 72 Z"/>
        <line x1="84" y1="48" x2="100" y2="28"/><line x1="122" y1="28" x2="122" y2="48"/>
        <circle cx="54" cy="76" r="11"/><circle cx="54" cy="76" r="4"/>
        <circle cx="184" cy="76" r="11"/><circle cx="184" cy="76" r="4"/>
        <line x1="14" y1="92" x2="222" y2="92" strokeWidth="0.7"/>
        <line x1="14" y1="89" x2="14" y2="95" strokeWidth="0.7"/>
        <line x1="222" y1="89" x2="222" y2="95" strokeWidth="0.7"/>
      </svg>
    );
    if (kind === 'civic') return (
      <svg viewBox="0 0 240 100" style={{ width:'100%', height }} fill="none" stroke={stroke} strokeWidth="1" strokeLinejoin="round">
        <path d="M14 68 C36 56,64 44,96 36 L160 36 C188 44,212 56,222 68 Z"/>
        <path d="M64 36 L84 22 L152 22 L170 36"/>
        <circle cx="58" cy="72" r="11"/><circle cx="58" cy="72" r="4"/>
        <circle cx="184" cy="72" r="11"/><circle cx="184" cy="72" r="4"/>
        <line x1="14" y1="92" x2="222" y2="92" strokeWidth="0.7"/>
        <line x1="14" y1="89" x2="14" y2="95" strokeWidth="0.7"/>
        <line x1="222" y1="89" x2="222" y2="95" strokeWidth="0.7"/>
      </svg>
    );
    return (
      <svg viewBox="0 0 240 100" style={{ width:'100%', height }} fill="none" stroke={stroke} strokeWidth="1" strokeLinejoin="round">
        <path d="M14 70 C24 52,42 40,68 34 L168 34 C192 40,214 52,222 70 Z"/>
        <path d="M54 34 L76 20 L168 20 L184 34"/>
        <circle cx="58" cy="74" r="11"/><circle cx="58" cy="74" r="4"/>
        <circle cx="184" cy="74" r="11"/><circle cx="184" cy="74" r="4"/>
        <line x1="14" y1="92" x2="222" y2="92" strokeWidth="0.7"/>
        <line x1="14" y1="89" x2="14" y2="95" strokeWidth="0.7"/>
        <line x1="222" y1="89" x2="222" y2="95" strokeWidth="0.7"/>
      </svg>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  SHARED COMPONENT LIBRARY
  // ═══════════════════════════════════════════════════════════════════════════

  // SectionLabel — uppercase tracked label + thin underline + optional right meta
  const SectionLabel = ({ n, title, right, onRight }) => (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8 }}>
        <span className="nb-sc">
          {n && <span className="nb-acc">{n} · </span>}
          {title}
        </span>
        {right && (
          <span className="nb-sc" style={onRight ? { cursor:'pointer' } : {}} onClick={onRight}>{right}</span>
        )}
      </div>
      <hr className="nb-rule-strong"/>
    </div>
  );

  // Badge — bordered mono caps, color-coded by category / log kind
  const Badge = ({ kind, size='normal' }) => {
    const color = catColor(kind) || kindColor(kind);
    const label = kind.charAt(0).toUpperCase() + kind.slice(1);
    return (
      <span className="nb-tag" style={{
        color, borderColor:color,
        fontSize: size === 'small' ? 9.5 : 10.5,
        padding:  size === 'small' ? '1px 5px' : '2px 8px',
      }}>{label}</span>
    );
  };

  // DifficultyPips — five circles, n filled in amber
  const DifficultyPips = ({ n }) => (
    <span style={{ display:'inline-flex', gap:3, alignItems:'center' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{
          width:6, height:6, borderRadius:'50%', display:'inline-block',
          background: i <= n ? C.accent : C.lineS,
          border: `1px solid ${i <= n ? C.accent : C.lineS}`,
        }}/>
      ))}
    </span>
  );

  // Panel — bordered card with a label row at the top
  const Panel = ({ label, right, children, style }) => (
    <div className="nb-card" style={{ padding:0, overflow:'hidden', ...style }}>
      {label && (
        <div style={{ padding:'8px 14px', borderBottom:`1px solid ${C.line}`, display:'flex', justifyContent:'space-between', alignItems:'center', background:C.panel }}>
          <span className="nb-sc">{label}</span>
          {right && <span className="nb-mono nb-mute" style={{ fontSize:11 }}>{right}</span>}
        </div>
      )}
      {children}
    </div>
  );

  // SpecPanel — key/value list, critical specs highlighted amber
  const SpecPanel = ({ specs }) => (
    <Panel label="Specifications" right={`${specs.filter(s=>s.highlight).length} critical`}>
      {specs.map((s,i) => (
        <div key={i} style={{
          display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:10,
          padding:'9px 14px', borderBottom: i < specs.length-1 ? `1px solid ${C.lineL}` : 'none',
          background: s.highlight ? `${C.accent}08` : 'transparent',
        }}>
          <span className="nb-sc">{s.label}</span>
          <span className="nb-mono" style={{ color:s.highlight ? C.accent : C.ink, fontSize:13, fontWeight:s.highlight ? 600 : 400 }}>
            {s.value}
          </span>
        </div>
      ))}
    </Panel>
  );

  // PartsTable — item, part number, qty × cost, total row
  const PartsTable = ({ parts }) => {
    const total = parts.reduce((a,p) => a + (p.qty * (p.estCost || p.cost || 0)), 0);
    return (
      <Panel label="Parts" right={`est. $${total.toFixed(2)}`}>
        {parts.map((p,i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'1fr auto auto', gap:8,
            padding:'10px 14px', borderBottom: i < parts.length-1 ? `1px solid ${C.lineL}` : 'none',
            alignItems:'start',
          }}>
            <div>
              <div className="nb-serif" style={{ fontSize:14 }}>{p.item || p.name}</div>
              {p.sub && <div className="nb-mute" style={{ fontSize:11, marginTop:2 }}>{p.sub}</div>}
              {(p.partNumber || p.pn) && (
                <div className="nb-mono" style={{ fontSize:10.5, color:C.accent, marginTop:3, cursor:'pointer', letterSpacing:'.05em' }}
                  title="Click to copy"
                  onClick={e => { e.stopPropagation(); try { navigator.clipboard.writeText(p.partNumber || p.pn); } catch(e){} }}>
                  {p.partNumber || p.pn}
                </div>
              )}
            </div>
            {p.qty && <span className="nb-mono nb-mute" style={{ fontSize:11, paddingTop:2 }}>×{p.qty}</span>}
            <span className="nb-mono" style={{ fontSize:13 }}>${((p.qty||1) * (p.estCost||p.cost||0)).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:10, padding:'10px 14px', borderTop:`1px solid ${C.ink2}`, background:C.panelD }}>
          <span className="nb-sc">Total est.</span>
          <span className="nb-mono nb-acc" style={{ fontSize:14, fontWeight:600 }}>${total.toFixed(2)}</span>
        </div>
      </Panel>
    );
  };

  // ToolsList — size in amber on the left, name on the right
  const ToolsList = ({ tools }) => (
    <Panel label="Tools">
      {tools.map((t,i) => (
        <div key={i} style={{
          display:'grid', gridTemplateColumns:'52px 1fr', gap:12,
          padding:'9px 14px', borderBottom: i < tools.length-1 ? `1px solid ${C.lineL}` : 'none',
          alignItems:'baseline',
        }}>
          <span className="nb-mono" style={{ color:C.accent, fontSize:12, fontWeight:600 }}>
            {typeof t === 'string' ? '—' : t.size}
          </span>
          <span style={{ fontSize:13, color:C.ink2, fontFamily:fontMono }}>
            {typeof t === 'string' ? t : t.name}
          </span>
        </div>
      ))}
    </Panel>
  );

  // StepList — numbered, click-to-complete, **bold** → amber
  const StepList = ({ steps }) => {
    const [done, setDone] = React.useState([]);
    const toggle = (i) => setDone(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i]);
    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
          <span className="nb-sc">Procedure</span>
          <span className="nb-mono" style={{ color:C.accent, fontSize:11 }}>{done.length}/{steps.length} done</span>
        </div>
        <hr className="nb-rule-strong"/>
        {steps.map((step, i) => {
          const text  = typeof step === 'string' ? step : step.text;
          const isDone = done.includes(i);
          return (
            <div key={i} onClick={() => toggle(i)} style={{
              display:'grid', gridTemplateColumns:'32px 1fr', gap:14,
              padding:'14px 4px', borderBottom:`1px solid ${C.lineL}`,
              cursor:'pointer', opacity: isDone ? 0.42 : 1, transition:'opacity .18s',
            }}>
              <div style={{
                width:22, height:22, border:`1.5px solid ${isDone ? C.accent : C.mute}`,
                borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center',
                background: isDone ? C.accent : 'transparent', flexShrink:0, marginTop:1,
                transition:'all .15s',
              }}>
                {isDone && <span style={{ color:C.bg, fontSize:11, fontWeight:700, fontFamily:fontMono, lineHeight:1 }}>✓</span>}
              </div>
              <span className="nb-serif" style={{ fontSize:15, lineHeight:1.65, color: isDone ? C.mute : C.ink }}>
                <span className="nb-mono" style={{ color:C.mute, fontSize:10, marginRight:8 }}>{String(i+1).padStart(2,'0')}</span>
                {parseAccents(text)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // NotesBlock — amber left-border callout, serif italic
  const NotesBlock = ({ notes }) => (
    <div style={{ marginTop:28, padding:'16px 20px', background:C.panelW, borderLeft:`3px solid ${C.accent}` }}>
      <span className="nb-sc" style={{ color:C.accent }}>Shop notes</span>
      {(Array.isArray(notes) ? notes : [notes]).map((n,i) => (
        <p key={i} className="nb-serif" style={{ margin:i===0 ? '8px 0 0' : '10px 0 0', fontSize:15, lineHeight:1.65, fontStyle:'italic', color:C.ink }}>
          — {n}
        </p>
      ))}
    </div>
  );

  // BackBtn — small monospace breadcrumb button
  const BackBtn = ({ label, onClick }) => (
    <button onClick={onClick} style={{ background:'none', border:'none', padding:0, color:C.mute, cursor:'pointer', fontSize:12, marginBottom:14, fontFamily:fontMono }}>
      ← {label}
    </button>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  //  FRAME — nav + shell
  // ═══════════════════════════════════════════════════════════════════════════
  function Frame({ page, setPage, children }) {
    const mainNav = [['home','Home','00'],['eng','Engineering','01'],['cars','Garage','02']];
    const crossNav = [['costs','Costs'],['lessons','Lessons']];
    return (
      <div className="nb">
        <div style={{ height:52, background:C.panel, borderBottom:`1px solid ${C.line}`, display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', padding:'0 30px', position:'sticky', top:0, zIndex:100 }}>
          {/* Brand */}
          <button onClick={() => setPage({ name:'home' })} style={{ background:'none', border:'none', padding:0, cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
            <Mark/>
            <span className="nb-serif" style={{ fontSize:20, fontWeight:600, color:C.ink, letterSpacing:-0.3 }}>
              Rad<span style={{ color:C.accent }}>.</span>ish
            </span>
          </button>
          {/* Main nav */}
          <div style={{ justifySelf:'center', display:'flex', alignItems:'center' }}>
            {mainNav.map(([id,label,n]) => (
              <button key={id} className="nb-navbtn" data-active={page === id} onClick={() => setPage({ name:id })}>
                <span className="nb-mono" style={{ fontSize:10, color: page === id ? C.accent : C.mute }}>{n}</span>
                {label}
              </button>
            ))}
            <div style={{ width:1, height:18, background:C.lineS, margin:'0 8px' }}/>
            {crossNav.map(([id,label]) => (
              <button key={id} className="nb-navbtn" data-active={page === id} onClick={() => setPage({ name:id })} style={{ fontSize:12 }}>
                {label}
              </button>
            ))}
          </div>
          <div className="nb-sc" style={{ fontSize:10 }}>M. Radysh · NJIT '27</div>
        </div>
        {children}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  HOME
  // ═══════════════════════════════════════════════════════════════════════════
  function Home({ go }) {
    const s = window.SITE;
    const shopRate = 120;
    const moneySpent = s.stats.totalSpent;
    const moneySaved = Math.round(s.stats.hoursLogged * shopRate);
    const jobsValue  = moneySpent + moneySaved;

    return (
      <div style={{ padding:'56px 60px', maxWidth:1180, margin:'0 auto' }}>
        {/* Hero */}
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:60, alignItems:'flex-end', paddingBottom:36, borderBottom:`1px solid ${C.ink2}` }}>
          <div>
            <div className="nb-sc">Personal reference · since 2025</div>
            <h1 className="nb-serif" style={{ fontSize:54, lineHeight:1.05, margin:'18px 0 6px', letterSpacing:-0.6 }}>
              A working notebook for an EE student
              <br/>who keeps his <span style={{ color:C.accent, fontStyle:'italic' }}>own cars</span> running.
            </h1>
            <div className="nb-mute" style={{ fontSize:13, marginTop:18 }}>
              3 vehicles · 13 reference sheets · {s.stats.projects} projects
            </div>
            <div style={{ display:'flex', gap:10, marginTop:28 }}>
              <button className="nb-btn nb-btn-acc" onClick={() => go({ name:'eng' })}>Engineering →</button>
              <button className="nb-btn" onClick={() => go({ name:'cars' })}>Garage →</button>
            </div>
          </div>

          {/* Recent work */}
          <div>
            <div className="nb-sc" style={{ marginBottom:8 }}>Recent work</div>
            {[
              ['ECE 371', 'Op-Amps & Comparators',       'opamps'],
              ['ECE 342', 'Transformer OC / SC tests',    'transformers'],
              ['ECE 395', 'RISC-V calling convention',    'riscv-isa'],
            ].map(([course,title,id]) => (
              <div key={id} className="nb-row" onClick={() => go({ name:'topic', id })}
                style={{ padding:'10px 4px', borderTop:`1px solid ${C.line}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:14 }}>
                  <div>
                    <span className="nb-mono nb-acc" style={{ fontSize:11 }}>{course}</span>
                    <div className="nb-serif nb-row-title" style={{ fontSize:16, marginTop:3 }}>{title}</div>
                  </div>
                  <span className="nb-mono nb-mute" style={{ fontSize:11 }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent updates — two-column directory */}
        <div style={{ marginTop:40, marginBottom:10, display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <span className="nb-sc">Recent updates</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>
          {/* Engineering */}
          <div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
              <span className="nb-sc"><span className="nb-acc">01 ·</span> Engineering</span>
              <span className="nb-sc">{s.stats.eeTopics} sheets</span>
            </div>
            <hr className="nb-rule-strong"/>
            {s.engineering.map((cat,i) => (
              <div key={cat.id} className="nb-row" onClick={() => go({ name:'eng' })}
                style={{ display:'grid', gridTemplateColumns:'48px 1fr auto', gap:14, padding:'12px 4px', borderBottom:`1px solid ${C.lineL}`, alignItems:'baseline' }}>
                <span className="nb-mono nb-mute" style={{ fontSize:11 }}>01.0{i+1}</span>
                <div>
                  <div className="nb-serif nb-row-title" style={{ fontSize:18 }}>{cat.title}</div>
                  <div className="nb-mute" style={{ fontSize:11.5, marginTop:2 }}>{cat.blurb}</div>
                </div>
                <span className="nb-mono nb-mute" style={{ fontSize:11 }}>{cat.groups.reduce((a,g)=>a+g.topics.length,0)}</span>
              </div>
            ))}
          </div>
          {/* Garage */}
          <div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
              <span className="nb-sc"><span className="nb-acc">02 ·</span> Garage</span>
              <span className="nb-sc">3 vehicles</span>
            </div>
            <hr className="nb-rule-strong"/>
            {s.vehicles.map((v,i) => (
              <div key={v.id} className="nb-row" onClick={() => go({ name:'vehicle', id:v.id })}
                style={{ display:'grid', gridTemplateColumns:'48px 1fr auto', gap:14, padding:'12px 4px', borderBottom:`1px solid ${C.lineL}`, alignItems:'baseline' }}>
                <span className="nb-mono nb-mute" style={{ fontSize:11 }}>02.0{i+1}</span>
                <div>
                  <div className="nb-serif nb-row-title" style={{ fontSize:18 }}>{v.year} {v.make} {v.model}</div>
                  <div className="nb-mute" style={{ fontSize:11.5, marginTop:2 }}>{v.engine} · {v.trans}</div>
                </div>
                <span className="nb-mono nb-mute" style={{ fontSize:11 }}>{(v.mileage/1000).toFixed(0)}k mi</span>
              </div>
            ))}
          </div>
        </div>

        {/* Money Analysis */}
        <div style={{ marginTop:44 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
            <span className="nb-sc">Money analysis</span>
            <span className="nb-sc nb-row" onClick={() => go({ name:'costs' })} style={{ display:'inline-block', cursor:'pointer' }}>Full breakdown →</span>
          </div>
          <hr className="nb-rule-strong"/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', border:`1px solid ${C.line}`, background:C.panelW }}>
            {[
              { label:'Value of jobs done', sub:'what a shop would bill',               val:`$${jobsValue.toLocaleString()}`,  color:C.accent },
              { label:'Money spent',        sub:'parts & supplies (DIY)',               val:`$${moneySpent.toLocaleString()}`, color:C.ink },
              { label:'Money saved',        sub:`${s.stats.hoursLogged} hrs × $${shopRate}/hr shop labor`, val:`$${moneySaved.toLocaleString()}`, color:C.green },
            ].map((st,i) => (
              <div key={i} style={{ padding:'28px 28px 24px', borderRight: i<2 ? `1px solid ${C.line}` : 'none', display:'flex', flexDirection:'column', gap:4 }}>
                <div className="nb-sc">{st.label}</div>
                <div className="nb-serif" style={{ fontSize:42, lineHeight:1.05, letterSpacing:-1, color:st.color, marginTop:8 }}>{st.val}</div>
                <div className="nb-mute" style={{ fontSize:11.5, marginTop:4 }}>{st.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ENGINEERING — three-pane drill + Projects tab
  // ═══════════════════════════════════════════════════════════════════════════
  function Engineering({ go }) {
    const s = window.SITE;
    const [section, setSection] = React.useState('sheets'); // 'sheets' | 'projects'
    const [catId, setCatId]     = React.useState('circuits');
    const [groupId, setGroupId] = React.useState('amplification');
    const cat   = s.engineering.find(c => c.id === catId);
    const group = cat.groups.find(g => g.id === groupId) || cat.groups[0];
    React.useEffect(() => { setGroupId(cat.groups[0].id); }, [catId]);

    return (
      <div>
        <div style={{ padding:'40px 60px 0', borderBottom:`1px solid ${C.line}` }}>
          <div style={{ paddingBottom:18, borderBottom:`1px solid ${C.ink2}` }}>
            <div className="nb-sc"><span className="nb-acc">01</span> · Engineering</div>
            <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1, margin:'10px 0 0', letterSpacing:-0.5 }}>Reference & projects</h1>
          </div>
          <div style={{ display:'flex' }}>
            {[['sheets','Reference Sheets'],['projects','Projects']].map(([id,label]) => (
              <button key={id} onClick={() => setSection(id)} className="nb-tab" data-active={section===id}>{label}</button>
            ))}
          </div>
        </div>

        {section === 'sheets' && (
          <div style={{ display:'grid', gridTemplateColumns:'240px 280px 1fr', minHeight:680 }}>
            {/* Pane 1 */}
            <div style={{ borderRight:`1px solid ${C.line}`, background:C.panel }}>
              <div style={{ padding:'12px 20px', borderBottom:`1px solid ${C.line}`, display:'flex', justifyContent:'space-between' }}>
                <span className="nb-sc">Department</span>
                <span className="nb-mono nb-mute" style={{ fontSize:11 }}>{s.engineering.length}</span>
              </div>
              {s.engineering.map((c,i) => (
                <div key={c.id} className="nb-row" onClick={() => setCatId(c.id)}
                  style={{ padding:'14px 20px', borderBottom:`1px solid ${C.lineL}`, background: c.id===catId ? C.panelW : 'transparent', borderLeft:`3px solid ${c.id===catId ? C.accent : 'transparent'}` }}>
                  <div className="nb-mono nb-mute" style={{ fontSize:11, marginBottom:4 }}>01.0{i+1}</div>
                  <div className="nb-serif" style={{ fontSize:17 }}>{c.title}</div>
                </div>
              ))}
            </div>
            {/* Pane 2 */}
            <div style={{ borderRight:`1px solid ${C.line}`, background:C.panelD }}>
              <div style={{ padding:'12px 20px', borderBottom:`1px solid ${C.line}` }}>
                <span className="nb-sc">{cat.title}</span>
              </div>
              {cat.groups.map(g => (
                <div key={g.id} className="nb-row" onClick={() => setGroupId(g.id)}
                  style={{ padding:'14px 20px', borderBottom:`1px solid ${C.lineL}`, background: g.id===groupId ? C.panel : 'transparent' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
                    <div className="nb-serif" style={{ fontSize:16 }}>{g.title}</div>
                    <span className="nb-tag" style={{ fontSize:10 }}>{g.topics.length}</span>
                  </div>
                  <div className="nb-mute" style={{ fontSize:12, marginTop:4, lineHeight:1.5 }}>{g.blurb}</div>
                </div>
              ))}
            </div>
            {/* Pane 3 */}
            <div style={{ background:C.bg }}>
              <div style={{ padding:'12px 28px', borderBottom:`1px solid ${C.line}` }}>
                <span className="nb-sc">Sheets · {group.topics.length}</span>
              </div>
              <div style={{ padding:'30px 32px' }}>
                <div className="nb-sc"><span className="nb-acc">{cat.title}</span></div>
                <h2 className="nb-serif" style={{ fontSize:32, lineHeight:1.05, margin:'6px 0 8px', letterSpacing:-0.3 }}>{group.title}</h2>
                <p className="nb-ink2" style={{ fontSize:14, lineHeight:1.6, margin:0, maxWidth:520 }}>{group.blurb}</p>
                <hr className="nb-rule-strong" style={{ marginTop:24 }}/>
                {group.topics.map((t,i) => (
                  <div key={t.id} className="nb-row" onClick={() => go({ name:'topic', id:t.id })}
                    style={{ display:'grid', gridTemplateColumns:'56px 1fr auto auto', gap:18, alignItems:'center', padding:'16px 4px', borderBottom:`1px solid ${C.line}` }}>
                    <span className="nb-mono nb-mute" style={{ fontSize:11 }}>01.{String(i+1).padStart(2,'0')}</span>
                    <div>
                      <div className="nb-serif nb-row-title" style={{ fontSize:18 }}>{t.title}</div>
                      <div className="nb-mute" style={{ fontSize:11, marginTop:3 }}>{t.tag}</div>
                    </div>
                    <span className="nb-tag">SHEET</span>
                    <span className="nb-mono nb-acc" style={{ fontSize:14 }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'projects' && <ProjectsList go={go}/>}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PROJECTS LIST
  // ═══════════════════════════════════════════════════════════════════════════
  function ProjectsList({ go }) {
    const projects = window.SITE.projects;
    const statusLabel = { complete:'Complete', active:'In progress', planned:'Planned' };

    return (
      <div style={{ padding:'32px 60px 60px' }}>
        <div style={{ marginBottom:28 }}>
          <SectionLabel n="01" title="Projects" right={`${projects.length} total`}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18 }}>
          {projects.map((p,i) => {
            const partsTotal = p.parts.reduce((a,pt)=>a+(pt.qty||1)*(pt.estCost||0),0);
            return (
              <div key={p.id} className="nb-card nb-row" onClick={() => go({ name:'project', id:p.id })}
                style={{ padding:0, cursor:'pointer' }}>
                <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.lineL}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                    <span className="nb-mono nb-mute" style={{ fontSize:10 }}>01.{String(i+1).padStart(2,'0')} · {p.date}</span>
                    <span className="nb-tag" style={{ color:statusColor(p.status), borderColor:statusColor(p.status), fontSize:9.5, padding:'1px 5px' }}>
                      {statusLabel[p.status]}
                    </span>
                  </div>
                  <h3 className="nb-serif nb-row-title" style={{ fontSize:19, margin:0 }}>
                    {renderTitle(p.title, p.titleAccent)}
                  </h3>
                  <p className="nb-mute" style={{ fontSize:12.5, lineHeight:1.5, marginTop:8 }}>
                    {p.summary.slice(0,90)}…
                  </p>
                </div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', padding:'10px 16px', borderBottom:`1px solid ${C.lineL}` }}>
                  {p.tags.map(t => <span key={t} className="nb-tag" style={{ fontSize:9.5, padding:'1px 5px' }}>{t}</span>)}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderTop:`1px solid ${C.lineL}` }}>
                  <div style={{ padding:'9px 14px', borderRight:`1px solid ${C.lineL}` }}>
                    <div className="nb-sc" style={{ fontSize:9, marginBottom:2 }}>Est. cost</div>
                    <div className="nb-mono" style={{ fontSize:14, color:C.ink }}>${partsTotal.toFixed(0)}</div>
                  </div>
                  <div style={{ padding:'9px 14px' }}>
                    <div className="nb-sc" style={{ fontSize:9, marginBottom:2 }}>Hours</div>
                    <div className="nb-mono" style={{ fontSize:14, color:C.ink }}>{p.hours}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PROJECT DETAIL (engineering + cross)
  // ═══════════════════════════════════════════════════════════════════════════
  function ProjectDetail({ go, id }) {
    const p = window.findProject(id);
    if (!p) return null;
    const partsTotal = p.parts.reduce((a,pt) => a + (pt.qty||1)*(pt.estCost||0), 0);
    const v = p.vehicleId ? window.findVehicle(p.vehicleId) : null;
    const statusLabel = { complete:'Complete', active:'In progress', planned:'Planned' };

    return (
      <div className="nb-fade">
        {/* Header */}
        <div style={{ padding:'32px 60px 22px', borderBottom:`1px solid ${C.ink2}` }}>
          <BackBtn label="Engineering / Projects" onClick={() => go({ name:'eng' })}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div>
              <div className="nb-sc" style={{ marginBottom:6 }}>
                <span className="nb-acc">01 · PROJECT</span>
                <span style={{ margin:'0 10px' }}>·</span>
                {p.date}
                {p.area === 'cross' && <><span style={{ margin:'0 10px' }}>·</span>CROSS-DOMAIN</>}
              </div>
              <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1, margin:'8px 0 0', letterSpacing:-0.5 }}>
                {renderTitle(p.title, p.titleAccent)}
              </h1>
              <div className="nb-mute" style={{ fontSize:13, marginTop:10, display:'flex', gap:14, flexWrap:'wrap', fontFamily:fontMono }}>
                <span>{p.hours} hrs logged</span>
                <span>·</span>
                <span>${partsTotal.toFixed(2)} parts</span>
                {v && <><span>·</span><span style={{ color:C.ink2 }}>Linked: {v.year} {v.model}</span></>}
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:12 }}>
                {p.tags.map(t => <span key={t} className="nb-tag" style={{ fontSize:9.5, padding:'1px 5px' }}>{t}</span>)}
              </div>
            </div>
            <span className="nb-tag" style={{ color:statusColor(p.status), borderColor:statusColor(p.status), padding:'4px 12px', fontSize:12, alignSelf:'flex-start' }}>
              {statusLabel[p.status]}
            </span>
          </div>
          <p className="nb-serif" style={{ fontSize:16, lineHeight:1.65, fontStyle:'italic', maxWidth:760, marginTop:16, color:C.ink }}>{p.summary}</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:0 }}>
          {/* Left: journal + lessons */}
          <div style={{ padding:'30px 60px 60px', borderRight:`1px solid ${C.line}` }}>
            <div className="nb-sc" style={{ marginBottom:8 }}>Build journal</div>
            <hr className="nb-rule-strong"/>
            {p.journal.map((entry,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'64px 1fr', gap:18, padding:'14px 4px', borderBottom:`1px solid ${C.lineL}`, alignItems:'baseline' }}>
                <span className="nb-mono" style={{ color:C.accent, fontSize:11 }}>{entry.date}</span>
                <span className="nb-serif" style={{ fontSize:15, lineHeight:1.65 }}>{entry.note}</span>
              </div>
            ))}

            {p.lessons && p.lessons.length > 0 && (
              <div style={{ marginTop:32 }}>
                <div className="nb-sc" style={{ marginBottom:8 }}>Lessons learned</div>
                <hr className="nb-rule-strong"/>
                {p.lessons.map((l,i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'20px 1fr', gap:14, padding:'14px 4px', borderBottom:`1px solid ${C.lineL}` }}>
                    <span className="nb-mono nb-acc" style={{ fontSize:11 }}>↳</span>
                    <div>
                      <p className="nb-serif" style={{ fontSize:15, lineHeight:1.65, margin:0 }}>{l.text}</p>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:6 }}>
                        {l.tags.map(t => <span key={t} className="nb-tag" style={{ fontSize:9, padding:'1px 4px' }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Related topics */}
            {p.relatedTopics && p.relatedTopics.length > 0 && (
              <div style={{ marginTop:32 }}>
                <div className="nb-sc" style={{ marginBottom:8 }}>Related reference sheets</div>
                <hr className="nb-rule-strong"/>
                {p.relatedTopics.map(id => {
                  const f = window.findTopic(id); if (!f) return null;
                  return (
                    <div key={id} className="nb-row" onClick={() => go({ name:'topic', id })}
                      style={{ display:'grid', gridTemplateColumns:'1fr auto', padding:'12px 4px', borderBottom:`1px solid ${C.lineL}`, alignItems:'center' }}>
                      <div>
                        <span className="nb-mono nb-mute" style={{ fontSize:10, marginRight:8 }}>{f.cat.title}</span>
                        <span className="nb-serif nb-row-title" style={{ fontSize:15 }}>{f.topic.title}</span>
                      </div>
                      <span className="nb-mono nb-mute" style={{ fontSize:11 }}>→</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: parts + vehicle link */}
          <div style={{ padding:'30px 24px 60px', background:C.panel, display:'flex', flexDirection:'column', gap:20 }}>
            <PartsTable parts={p.parts}/>
            {v && (
              <div className="nb-card nb-row" onClick={() => go({ name:'vehicle', id:v.id })} style={{ padding:'14px 16px', cursor:'pointer' }}>
                <div className="nb-sc" style={{ marginBottom:4 }}>Linked vehicle</div>
                <div className="nb-serif nb-row-title" style={{ fontSize:16 }}>{v.year} {v.make} {v.model}</div>
                <div className="nb-mute" style={{ fontSize:12, marginTop:2 }}>{v.engine} · {v.trans}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  TOPIC DETAIL
  // ═══════════════════════════════════════════════════════════════════════════
  function TopicDetail({ go }) {
    const t = window.SITE.topicDetail;
    return (
      <div>
        <div style={{ padding:'32px 60px 22px', borderBottom:`1px solid ${C.ink2}` }}>
          <BackBtn label={`Engineering / ${t.category}`} onClick={() => go({ name:'eng' })}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div>
              <div className="nb-sc"><span className="nb-acc">{t.course}</span><span style={{ marginLeft:14 }}>{t.reading}</span></div>
              <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1, margin:'10px 0 0', letterSpacing:-0.5 }}>{t.title}</h1>
            </div>
            <span className="nb-tag nb-tag-acc">Reference</span>
          </div>
          <p className="nb-ink2" style={{ fontSize:15, lineHeight:1.6, maxWidth:760, margin:'14px 0 0' }}>{t.summary}</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:0 }}>
          <div style={{ padding:'30px 60px 60px', borderRight:`1px solid ${C.line}` }}>
            {t.sections.map((sec,i) => (
              <div key={i} style={{ marginBottom:34 }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:14, marginBottom:10 }}>
                  <span className="nb-mono nb-acc" style={{ fontSize:13, fontWeight:600 }}>§ {String(i+1).padStart(2,'0')}</span>
                  <h2 className="nb-serif" style={{ fontSize:22, margin:0 }}>{sec.title}</h2>
                </div>
                {sec.body && <pre style={{ fontFamily:fontMono, fontSize:13, lineHeight:1.75, whiteSpace:'pre-wrap', margin:0, color:C.ink }}>{sec.body}</pre>}
                {sec.table && (
                  <div className="nb-card" style={{ marginTop:12 }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                      <tbody>
                        {sec.table.map((row,ri) => (
                          <tr key={ri} style={{ background: ri===0 ? C.panel : 'transparent', borderBottom: ri<sec.table.length-1 ? `1px solid ${C.lineL}` : 'none' }}>
                            {row.map((cell,ci) => (
                              <td key={ci} style={{ padding:'10px 16px',
                                color: ri===0 ? C.mute : (ci===0 ? C.mute : C.ink),
                                fontFamily: ri===0 ? fontMono : (ci===0 ? fontHead : fontMono),
                                fontSize: ri===0 ? 11 : (ci===0 ? 15 : 13),
                                fontWeight: ri===0 ? 500 : (ci===0 ? 500 : 400),
                                letterSpacing: ri===0 ? '.14em' : 'normal',
                                textTransform: ri===0 ? 'uppercase' : 'none',
                                borderRight: ci<row.length-1 ? `1px solid ${C.lineL}` : 'none',
                              }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {sec.callout && (
                  <div style={{ marginTop:14, padding:'12px 16px', background:C.panelW, borderLeft:`3px solid ${C.accent}` }}>
                    <span className="nb-sc" style={{ color:C.accent }}>Note</span>
                    <div className="nb-serif" style={{ marginTop:4, fontSize:16, fontStyle:'italic' }}>{sec.callout}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ padding:'30px 24px', background:C.panel }}>
            <div className="nb-sc" style={{ marginBottom:10 }}>Formulas</div>
            <div className="nb-card" style={{ padding:0 }}>
              {t.formulas.map((f,i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:14, padding:'10px 14px', borderBottom: i<t.formulas.length-1 ? `1px solid ${C.lineL}` : 'none', alignItems:'baseline' }}>
                  <span className="nb-mono nb-acc" style={{ fontSize:13 }}>{f.sym}</span>
                  <span className="nb-mono" style={{ fontSize:13 }}>= {f.eq}</span>
                </div>
              ))}
            </div>
            <div className="nb-sc" style={{ marginTop:24, marginBottom:10 }}>See also</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {['schmitt','555','wien'].map(id => {
                const f = window.findTopic(id); if (!f) return null;
                return (
                  <div key={id} className="nb-row" onClick={() => go({ name:'topic', id })}
                    style={{ padding:'10px 14px', border:`1px solid ${C.line}`, background:C.panelW }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                      <span className="nb-serif nb-row-title" style={{ fontSize:14 }}>{f.topic.title}</span>
                      <span className="nb-mono nb-mute" style={{ fontSize:11 }}>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  GARAGE — Vehicles | Service Log | Procedures | Buying Guides
  // ═══════════════════════════════════════════════════════════════════════════
  function Garage({ go }) {
    const s = window.SITE;
    const [tab, setTab] = React.useState('vehicles');

    return (
      <div>
        <div style={{ padding:'40px 60px 0', borderBottom:`1px solid ${C.line}` }}>
          <div style={{ paddingBottom:18, borderBottom:`1px solid ${C.ink2}` }}>
            <div className="nb-sc"><span className="nb-acc">02</span> · Garage</div>
            <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1, margin:'10px 0 0', letterSpacing:-0.5 }}>Three cars, one set of hands</h1>
          </div>
          <div style={{ display:'flex' }}>
            {[['vehicles','Vehicles'],['log','Service Log'],['procedures','Procedures'],['guides','Buying Guides']].map(([id,label]) => (
              <button key={id} onClick={() => setTab(id)} className="nb-tab" data-active={tab===id}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ padding:'32px 60px 60px' }}>
          {/* ── VEHICLES ── */}
          {tab === 'vehicles' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
              {s.vehicles.map((v,i) => (
                <div key={v.id} className="nb-card nb-row" onClick={() => go({ name:'vehicle', id:v.id })}>
                  <div style={{ padding:18, borderBottom:`1px solid ${C.lineL}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <div className="nb-mono nb-acc" style={{ fontSize:11 }}>02.0{i+1}</div>
                        <h3 className="nb-serif nb-row-title" style={{ fontSize:20, margin:'4px 0 0' }}>{v.year} {v.make} {v.model}</h3>
                        <div className="nb-mute" style={{ fontSize:12, marginTop:4 }}>{v.engine} · {v.trans} · {v.drive}</div>
                      </div>
                      <span className="nb-tag" style={{ color:relColor(v.reliability), borderColor:relColor(v.reliability) }}>{v.reliability.toFixed(1)}</span>
                    </div>
                  </div>
                  <div style={{ padding:'14px 18px 18px' }}>
                    <VehicleTech kind={v.id} height={92}/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderTop:`1px solid ${C.lineL}` }}>
                    <div style={{ padding:'10px 14px', borderRight:`1px solid ${C.lineL}` }}>
                      <div className="nb-sc">Mileage</div>
                      <div className="nb-serif" style={{ fontSize:18, marginTop:2 }}>{(v.mileage/1000).toFixed(0)}k</div>
                    </div>
                    <div style={{ padding:'10px 14px' }}>
                      <div className="nb-sc">Procedures</div>
                      <div className="nb-mono" style={{ fontSize:14, marginTop:4, color:C.ink2 }}>{(v.procedures||[]).length} on file</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SERVICE LOG ── */}
          {tab === 'log' && (
            <div className="nb-card">
              <div style={{ display:'grid', gridTemplateColumns:'120px 80px 1fr 140px 100px', gap:14, padding:'10px 18px', borderBottom:`1px solid ${C.line}`, background:C.panel }} className="nb-sc">
                <span>Date</span><span>Type</span><span>Job</span><span>Vehicle</span><span style={{ textAlign:'right' }}>Cost</span>
              </div>
              {s.recent.map((r,i) => {
                const v = window.findVehicle(r.vehicle);
                return (
                  <div key={i} className="nb-row"
                    onClick={() => r.procedureId
                      ? go({ name:'procedure', vehicleId:r.vehicle, id:r.procedureId })
                      : go({ name:'garage-project' })}
                    style={{ display:'grid', gridTemplateColumns:'120px 80px 1fr 140px 100px', gap:14, padding:'13px 18px', borderBottom: i<s.recent.length-1 ? `1px solid ${C.lineL}` : 'none', alignItems:'center', fontSize:13 }}>
                    <span className="nb-mono">{r.date}</span>
                    <span className="nb-tag" style={{ color:kindColor(r.kind), borderColor:kindColor(r.kind) }}>{r.kind}</span>
                    <span className="nb-serif" style={{ fontSize:15 }}>{r.label}</span>
                    <span className="nb-mute" style={{ fontSize:12.5 }}>{v.year} {v.model}</span>
                    <span className="nb-mono" style={{ textAlign:'right' }}>${r.cost.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── PROCEDURES (cross-vehicle index) ── */}
          {tab === 'procedures' && (
            <div>
              {s.vehicles.map((v,vi) => (
                (v.procedures||[]).length > 0 && (
                  <div key={v.id} style={{ marginBottom:36 }}>
                    <SectionLabel
                      n={`02.${String(vi+1).padStart(2,'0')}`}
                      title={`${v.year} ${v.make} ${v.model}`}
                      right={`${v.procedures.length} procedures · ${v.engine}`}
                      onRight={() => go({ name:'vehicle', id:v.id })}
                    />
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                      {v.procedures.map((proc,pi) => {
                        const lastLog = s.recent.filter(r=>r.procedureId===proc.id).sort((a,b)=>b.date.localeCompare(a.date))[0];
                        const pLetter = String.fromCharCode(65+pi);
                        return (
                          <div key={proc.id} className="nb-card nb-row" onClick={() => go({ name:'procedure', vehicleId:v.id, id:proc.id })}
                            style={{ padding:0, cursor:'pointer' }}>
                            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${C.lineL}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                              <div>
                                <span className="nb-mono nb-mute" style={{ fontSize:10 }}>02.{String(vi+1).padStart(2,'0')}.{pLetter}</span>
                                <h4 className="nb-serif nb-row-title" style={{ fontSize:17, margin:'4px 0 0', fontFamily:fontHead, fontWeight:500 }}>{proc.title}</h4>
                              </div>
                              <Badge kind={proc.category} size="small"/>
                            </div>
                            <div style={{ padding:'10px 16px', display:'flex', flexDirection:'column', gap:6 }}>
                              <div style={{ display:'flex', justifyContent:'space-between' }}>
                                <span className="nb-sc">Interval</span>
                                <span className="nb-mono" style={{ fontSize:11, color:C.ink2 }}>
                                  {proc.interval.miles ? `${proc.interval.miles.toLocaleString()} mi` : `${proc.interval.months} mo`}
                                  {proc.interval.miles && proc.interval.months ? ` / ${proc.interval.months} mo` : ''}
                                </span>
                              </div>
                              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                <span className="nb-sc">Difficulty</span>
                                <DifficultyPips n={proc.difficulty}/>
                              </div>
                              <div style={{ display:'flex', justifyContent:'space-between' }}>
                                <span className="nb-sc">Last logged</span>
                                <span className="nb-mono" style={{ fontSize:11, color: lastLog ? C.green : C.mute }}>
                                  {lastLog ? lastLog.date : 'not logged'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {/* ── BUYING GUIDES ── */}
          {tab === 'guides' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
              {[
                { era:'1998–2011', what:'Ford Ranger 3.0 / 4.0',    verdict:'BUY',  color:C.green, body:'Cheap, simple, parts everywhere. The 3.0 Vulcan is anemic but bulletproof. 4.0 SOHC has a timing-chain reputation — verify service.' },
                { era:'2016–2021', what:'Honda Civic 2.0 NA',        verdict:'BUY',  color:C.green, body:'Avoid the 1.5T head-gasket lottery. The 2.0 NA is the sensible choice. CVT is fine at this power level.' },
                { era:'2014–2020', what:'Nissan Rogue (JF017E CVT)', verdict:'PASS', color:C.red,   body:'Or commit to 30k fluid swaps for the life of the car. JF017E CVT is the catch — inspect service history obsessively.' },
              ].map((g,i) => (
                <div key={i} className="nb-card">
                  <div style={{ padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:`1px solid ${C.lineL}` }}>
                    <span className="nb-mono nb-mute" style={{ fontSize:11 }}>{g.era}</span>
                    <span className="nb-tag" style={{ color:g.color, borderColor:g.color }}>{g.verdict}</span>
                  </div>
                  <div style={{ padding:18 }}>
                    <h4 className="nb-serif" style={{ fontSize:19, margin:'0 0 10px', fontFamily:fontHead, fontWeight:500 }}>{g.what}</h4>
                    <p className="nb-ink2" style={{ fontSize:13.5, lineHeight:1.6, margin:0 }}>{g.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  VEHICLE DETAIL — Overview | Procedures
  // ═══════════════════════════════════════════════════════════════════════════
  function VehicleDetail({ go, id }) {
    const v   = window.findVehicle(id) || window.SITE.vehicles[0];
    const idx = window.SITE.vehicles.indexOf(v);
    const [tab, setTab] = React.useState('overview');

    return (
      <div>
        {/* Header */}
        <div style={{ padding:'32px 60px 0', borderBottom:`1px solid ${C.line}` }}>
          <div style={{ paddingBottom:18, borderBottom:`1px solid ${C.ink2}` }}>
            <BackBtn label="Garage" onClick={() => go({ name:'cars' })}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <div className="nb-sc">
                  <span className="nb-acc">02.0{idx+1}</span>
                  <span style={{ marginLeft:14 }}>Acquired {v.acquired}</span>
                </div>
                <h1 className="nb-serif" style={{ fontSize:50, lineHeight:1, margin:'10px 0 0', letterSpacing:-0.5 }}>
                  {v.year} {v.make} <span style={{ color:C.accent }}>{v.model}</span>
                </h1>
                <div className="nb-ink2" style={{ fontSize:14, marginTop:8 }}>
                  {v.trim} · {v.engine} · {v.trans} · {v.drive} · {v.color}
                </div>
              </div>
              <span className="nb-tag" style={{ color:relColor(v.reliability), borderColor:relColor(v.reliability), fontSize:12, padding:'4px 12px' }}>
                Reliability {v.reliability.toFixed(1)} / 10
              </span>
            </div>
          </div>
          <div style={{ display:'flex' }}>
            {[['overview','Overview'],['procedures','Procedures']].map(([id,label]) => (
              <button key={id} onClick={() => setTab(id)} className="nb-tab" data-active={tab===id}>{label}</button>
            ))}
          </div>
        </div>

        {tab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:0 }}>
            <div style={{ padding:'30px 60px', borderRight:`1px solid ${C.line}` }}>
              <div className="nb-card" style={{ padding:0 }}>
                <div style={{ padding:'10px 16px', borderBottom:`1px solid ${C.lineL}`, display:'flex', justifyContent:'space-between' }}>
                  <span className="nb-sc">Fig. 01 · Vehicle elevation</span>
                  <span className="nb-mono nb-mute" style={{ fontSize:11 }}>{v.color}</span>
                </div>
                <div style={{ aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
                  <VehicleTech kind={v.id} height={170} stroke={C.ink}/>
                </div>
              </div>
              <p className="nb-serif" style={{ marginTop:24, fontSize:18, lineHeight:1.55, fontStyle:'italic', color:C.ink }}>{v.summary}</p>
              <div className="nb-sc" style={{ marginTop:30, marginBottom:10 }}>Service log · {v.model}</div>
              <hr className="nb-rule-strong"/>
              {window.SITE.recent.filter(r => r.vehicle===v.id).map((r,i,arr) => (
                <div key={i} className="nb-row"
                  onClick={() => r.procedureId ? go({ name:'procedure', vehicleId:v.id, id:r.procedureId }) : go({ name:'garage-project' })}
                  style={{ display:'grid', gridTemplateColumns:'120px 80px 1fr 90px', gap:14, padding:'12px 4px', borderBottom: i<arr.length-1 ? `1px solid ${C.lineL}` : 'none', alignItems:'center', fontSize:13 }}>
                  <span className="nb-mono">{r.date}</span>
                  <span className="nb-tag" style={{ color:kindColor(r.kind), borderColor:kindColor(r.kind) }}>{r.kind}</span>
                  <span className="nb-serif" style={{ fontSize:15 }}>{r.label}</span>
                  <span className="nb-mono" style={{ textAlign:'right' }}>${r.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ padding:'30px 28px 60px', background:C.panel }}>
              <div className="nb-sc" style={{ marginBottom:10 }}>Specification</div>
              <hr className="nb-rule"/>
              {[
                ['Engine', v.engine], ['Transmission', v.trans], ['Drive', v.drive],
                ['Mileage', `${v.mileage.toLocaleString()} mi`], ['Color', v.color],
                ['Acquired', v.acquired], ['Status', v.status],
              ].map(([k,val]) => (
                <div key={k} style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:14, padding:'10px 0', borderBottom:`1px solid ${C.lineL}`, fontSize:13 }}>
                  <span className="nb-sc">{k}</span>
                  <span className="nb-mono" style={{ color:C.ink }}>{val}</span>
                </div>
              ))}

              <div className="nb-sc" style={{ marginTop:28, marginBottom:10 }}>Ownership totals</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, border:`1px solid ${C.line}`, background:C.panelW }}>
                {[
                  { label:'Spent', val:`$${v.stats.spent}`, big:true },
                  { label:'$/1k mi', val:`$${(v.stats.spent/v.mileage*1000).toFixed(2)}`, big:true },
                  { label:'Hours', val:v.stats.hours, big:false },
                  { label:'Jobs', val:v.stats.projects, big:false },
                ].map((st,i) => (
                  <div key={i} style={{ padding:'14px 16px', borderRight: i%2===0 ? `1px solid ${C.lineL}` : 'none', borderBottom: i<2 ? `1px solid ${C.lineL}` : 'none' }}>
                    <div className="nb-sc">{st.label}</div>
                    <div className="nb-serif" style={{ fontSize: st.big ? 28 : 24, marginTop:2 }}>{st.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop:20 }}>
                <button className="nb-btn" style={{ width:'100%', justifyContent:'center', marginTop:8 }}
                  onClick={() => setTab('procedures')}>
                  View {(v.procedures||[]).length} procedures →
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'procedures' && (
          <div style={{ padding:'32px 60px 60px' }}>
            <div style={{ marginBottom:24 }}>
              <SectionLabel n={`02.${String(idx+1).padStart(2,'0')}`} title="Procedures" right={`${(v.procedures||[]).length} on file`}/>
            </div>
            {(v.procedures||[]).length === 0 && (
              <div className="nb-mute" style={{ fontSize:14, fontFamily:fontMono }}>No procedures on file yet.</div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
              {(v.procedures||[]).map((proc,pi) => {
                const lastLog = window.SITE.recent.filter(r=>r.procedureId===proc.id).sort((a,b)=>b.date.localeCompare(a.date))[0];
                const pLetter = String.fromCharCode(65+pi);
                const partsEst = proc.parts.reduce((a,p)=>a+(p.qty||1)*p.estCost,0);
                return (
                  <div key={proc.id} className="nb-card nb-row" onClick={() => go({ name:'procedure', vehicleId:v.id, id:proc.id })}
                    style={{ padding:0, cursor:'pointer' }}>
                    <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.lineL}` }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                        <span className="nb-mono nb-mute" style={{ fontSize:10 }}>
                          02.{String(idx+1).padStart(2,'0')}.{pLetter}
                        </span>
                        <Badge kind={proc.category} size="small"/>
                      </div>
                      <h3 className="nb-serif nb-row-title" style={{ fontSize:19, margin:0, fontFamily:fontHead, fontWeight:500 }}>{proc.title}</h3>
                      <div className="nb-mute" style={{ fontSize:12, marginTop:4 }}>~{proc.estMinutes} min · est. ${partsEst.toFixed(0)}</div>
                    </div>
                    <div style={{ padding:'10px 16px', display:'flex', flexDirection:'column', gap:7 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span className="nb-sc">Interval</span>
                        <span className="nb-mono" style={{ fontSize:11, color:C.ink2 }}>
                          {proc.interval.miles ? `every ${proc.interval.miles.toLocaleString()} mi` : `every ${proc.interval.months} mo`}
                          {proc.interval.miles && proc.interval.months ? ` / ${proc.interval.months} mo` : ''}
                        </span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span className="nb-sc">Difficulty</span>
                        <DifficultyPips n={proc.difficulty}/>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span className="nb-sc">Last logged</span>
                        <span className="nb-mono" style={{ fontSize:11, color: lastLog ? C.green : C.mute }}>
                          {lastLog ? lastLog.date : 'not logged'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PROCEDURE DETAIL
  // ═══════════════════════════════════════════════════════════════════════════
  function ProcedureDetail({ go, vehicleId, id }) {
    const v    = window.findVehicle(vehicleId);
    const proc = window.findProcedure(vehicleId, id);
    if (!proc || !v) return null;

    const vIdx  = window.SITE.vehicles.indexOf(v) + 1;
    const pIdx  = (v.procedures||[]).indexOf(proc);
    const pLett = String.fromCharCode(65 + pIdx);
    const kicker = `02.${String(vIdx).padStart(2,'0')}.${pLett}`;

    const interval = [
      proc.interval.miles ? `${proc.interval.miles.toLocaleString()} mi` : null,
      proc.interval.months ? `${proc.interval.months} mo` : null,
    ].filter(Boolean).join(' / ');

    const lastLog = window.SITE.recent
      .filter(r => r.procedureId === proc.id)
      .sort((a,b) => b.date.localeCompare(a.date))[0];

    const [showModal, setShowModal] = React.useState(false);
    const [logged,    setLogged]    = React.useState(false);

    const partsTotal = proc.parts.reduce((a,p) => a + (p.qty||1)*p.estCost, 0);
    const logKind = proc.category === 'routine' ? 'PM' : proc.category === 'repair' ? 'Repair' : 'Mod';

    return (
      <div className="nb-fade">
        {/* Header */}
        <div style={{ padding:'32px 60px 22px', borderBottom:`1px solid ${C.ink2}` }}>
          <BackBtn label={`${v.year} ${v.make} ${v.model} / Procedures`} onClick={() => go({ name:'vehicle', id:vehicleId })}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div style={{ flex:1 }}>
              <div className="nb-sc" style={{ marginBottom:6 }}>
                <span className="nb-acc">{kicker}</span>
                <span style={{ margin:'0 10px' }}>·</span>
                SERVICE PROCEDURE
                <span style={{ margin:'0 10px' }}>·</span>
                {proc.category.toUpperCase()}
              </div>
              <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1, margin:'8px 0 0', letterSpacing:-0.5 }}>
                {renderTitle(proc.title, proc.titleAccent)}
              </h1>
              <div className="nb-mute" style={{ fontSize:13, marginTop:10, display:'flex', gap:14, flexWrap:'wrap', fontFamily:fontMono }}>
                <span>{v.year} {v.make} {v.model}</span>
                <span>·</span>
                <span>{v.engine}</span>
                <span>·</span>
                <span>Every {interval}</span>
                <span>·</span>
                <span>~{proc.estMinutes} min</span>
                {lastLog && (
                  <><span>·</span><span style={{ color:C.green }}>Last: {lastLog.date}</span></>
                )}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end', marginLeft:32, flexShrink:0 }}>
              <Badge kind={proc.category}/>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className="nb-sc">Difficulty</span>
                <DifficultyPips n={proc.difficulty}/>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px' }}>
          {/* Left: steps + notes + log action */}
          <div style={{ padding:'30px 60px 60px', borderRight:`1px solid ${C.line}` }}>
            <StepList steps={proc.steps}/>
            <NotesBlock notes={proc.notes}/>

            {/* Lessons from this procedure */}
            {(proc.lessons||[]).length > 0 && (
              <div style={{ marginTop:32 }}>
                <div className="nb-sc" style={{ marginBottom:8 }}>Lessons from this job</div>
                <hr className="nb-rule-strong"/>
                {proc.lessons.map((l,i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'20px 1fr', gap:14, padding:'12px 4px', borderBottom:`1px solid ${C.lineL}` }}>
                    <span className="nb-mono nb-acc" style={{ fontSize:11 }}>↳</span>
                    <div>
                      <p className="nb-serif" style={{ fontSize:15, lineHeight:1.65, margin:0 }}>{l.text}</p>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:6 }}>
                        {l.tags.map(t => <span key={t} className="nb-tag" style={{ fontSize:9, padding:'1px 4px' }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Log this job */}
            <div style={{ marginTop:32, paddingTop:24, borderTop:`1px solid ${C.line}` }}>
              {logged ? (
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', border:`1px solid ${C.green}`, background:`${C.green}10` }}>
                  <span style={{ color:C.green, fontFamily:fontMono, fontSize:13 }}>✓ Entry added to service log</span>
                </div>
              ) : (
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <button className="nb-btn nb-btn-acc" onClick={() => setShowModal(true)}>Log this job →</button>
                  <span className="nb-mute" style={{ fontSize:12 }}>Pre-fills date, vehicle, parts cost</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: spec, parts, tools */}
          <div style={{ padding:'30px 24px 60px', background:C.panel, display:'flex', flexDirection:'column', gap:20 }}>
            <SpecPanel specs={proc.specs}/>
            <PartsTable parts={proc.parts}/>
            <ToolsList tools={proc.tools}/>
          </div>
        </div>

        {/* Log job modal */}
        {showModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.78)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}
            onClick={() => setShowModal(false)}>
            <div style={{ background:C.panel, border:`1px solid ${C.line}`, width:500, padding:36 }}
              onClick={e => e.stopPropagation()}>
              <div className="nb-sc" style={{ color:C.accent, marginBottom:20 }}>Log this job</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                {[
                  ['Date',       new Date().toISOString().slice(0,10)],
                  ['Vehicle',    `${v.year} ${v.make} ${v.model}`],
                  ['Type',       logKind],
                  ['Job',        proc.title],
                  ['Parts cost', `$${partsTotal.toFixed(2)}`],
                  ['Procedure',  proc.id],
                ].map(([k,val]) => (
                  <div key={k} style={{ display:'grid', gridTemplateColumns:'110px 1fr', gap:14, fontSize:13, padding:'8px 0', borderBottom:`1px solid ${C.lineL}` }}>
                    <span className="nb-sc">{k}</span>
                    <span className="nb-mono" style={{ color:C.ink }}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="nb-mute" style={{ fontSize:12, marginBottom:20 }}>
                Enter actual mileage and any additional notes in the log after saving.
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="nb-btn nb-btn-acc" onClick={() => { setShowModal(false); setLogged(true); }}>Confirm</button>
                <button className="nb-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  GARAGE PROJECT DETAIL (Ranger clutch, etc.)
  // ═══════════════════════════════════════════════════════════════════════════
  function GarageProjectDetail({ go }) {
    const p = window.SITE.projectDetail;
    const v = window.findVehicle(p.vehicle);
    const partsTotal = p.parts.reduce((a,b) => a + b.cost, 0);
    return (
      <div>
        <div style={{ padding:'32px 60px 22px', borderBottom:`1px solid ${C.ink2}` }}>
          <BackBtn label={`${v.year} ${v.make} ${v.model}`} onClick={() => go({ name:'vehicle', id:v.id })}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div>
              <div className="nb-sc">
                <span className="nb-acc">Job</span>
                <span style={{ marginLeft:14 }}>{p.date}</span>
                <span style={{ marginLeft:14 }}>{p.duration}</span>
              </div>
              <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1.02, margin:'10px 0 0', letterSpacing:-0.5 }}>{p.title}</h1>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <span className="nb-tag">Difficulty {p.difficulty}/5</span>
              <span className="nb-tag nb-tag-acc">${p.cost.toFixed(2)}</span>
            </div>
          </div>
          <p className="nb-serif" style={{ marginTop:14, fontSize:16, lineHeight:1.6, fontStyle:'italic', maxWidth:760 }}>{p.summary}</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px' }}>
          <div style={{ padding:'30px 60px 60px', borderRight:`1px solid ${C.line}` }}>
            <div className="nb-sc" style={{ marginBottom:14 }}>Procedure</div>
            <hr className="nb-rule-strong"/>
            {p.steps.map((step,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'50px 1fr', gap:18, padding:'16px 0', borderBottom: i<p.steps.length-1 ? `1px solid ${C.line}` : 'none' }}>
                <div style={{ fontFamily:fontMono, fontSize:13, fontWeight:600, color:C.accent }}>{String(i+1).padStart(2,'0')}</div>
                <div className="nb-serif" style={{ fontSize:15.5, lineHeight:1.6, color:C.ink }}>{step}</div>
              </div>
            ))}
            <div style={{ marginTop:24, padding:'14px 16px', background:C.panelW, borderLeft:`3px solid ${C.accent}` }}>
              <span className="nb-sc" style={{ color:C.accent }}>Shop note</span>
              <p className="nb-serif" style={{ margin:'4px 0 0', fontSize:15, lineHeight:1.6, fontStyle:'italic' }}>{p.notes}</p>
            </div>
          </div>
          <div style={{ padding:'30px 28px 60px', background:C.panel }}>
            <PartsTable parts={p.parts.map(pt => ({ item:pt.name, partNumber:pt.pn, qty:1, estCost:pt.cost }))}/>
            <div style={{ marginTop:20 }}>
              <ToolsList tools={p.tools}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  LESSONS
  // ═══════════════════════════════════════════════════════════════════════════
  function Lessons({ go }) {
    const all    = window.allLessons();
    const allTags = [...new Set(all.flatMap(l => l.tags||[]))].sort();
    const [filter, setFilter] = React.useState('all');

    const filtered = filter === 'all' ? all : all.filter(l => (l.tags||[]).includes(filter));

    return (
      <div style={{ padding:'40px 60px 60px', maxWidth:1180, margin:'0 auto' }}>
        <div style={{ paddingBottom:28, borderBottom:`1px solid ${C.ink2}`, marginBottom:32 }}>
          <div className="nb-sc"><span className="nb-acc">—</span> · Cross-cutting</div>
          <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1, margin:'10px 0 0', letterSpacing:-0.5 }}>
            Lessons learned
          </h1>
          <p className="nb-ink2" style={{ fontSize:15, lineHeight:1.6, maxWidth:640, marginTop:12 }}>
            Every procedure and project logs what it taught. Filtered by tag.
            {` ${all.length} entries across ${window.SITE.vehicles.length} vehicles and ${window.SITE.projects.length} projects.`}
          </p>
        </div>

        {/* Tag filter */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:24 }}>
          <button className="nb-btn" style={{ padding:'5px 12px', fontSize:11, background: filter==='all' ? C.accent : 'transparent', color: filter==='all' ? C.bg : C.ink2, borderColor: filter==='all' ? C.accent : C.lineS }}
            onClick={() => setFilter('all')}>All ({all.length})</button>
          {allTags.map(t => (
            <button key={t} className="nb-btn" onClick={() => setFilter(t)}
              style={{ padding:'5px 12px', fontSize:11, background: filter===t ? C.accent : 'transparent', color: filter===t ? C.bg : C.mute, borderColor: filter===t ? C.accent : C.lineS }}>
              {t}
            </button>
          ))}
        </div>

        {/* Lesson feed */}
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {filtered.length === 0 && <div className="nb-mute" style={{ fontSize:14, fontFamily:fontMono }}>No lessons match this filter.</div>}
          {filtered.map((l,i) => (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'24px 1fr', gap:20,
              padding:'18px 4px', borderBottom:`1px solid ${C.lineL}`,
            }}>
              <span className="nb-mono nb-acc" style={{ fontSize:12, paddingTop:3 }}>↳</span>
              <div>
                <p className="nb-serif" style={{ fontSize:16, lineHeight:1.7, margin:0 }}>{l.text}</p>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginTop:8 }}>
                  {(l.tags||[]).map(t => (
                    <button key={t} className="nb-tag" onClick={() => setFilter(t)}
                      style={{ cursor:'pointer', background: filter===t ? `${C.accent}15` : 'transparent', borderColor: filter===t ? C.accent : C.lineS, color: filter===t ? C.accent : C.mute }}>
                      {t}
                    </button>
                  ))}
                  {l.sourceLabel && (
                    <span className="nb-mono nb-mute" style={{ fontSize:10.5, marginLeft:4 }}>
                      Source: {l.sourceLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  COSTS
  // ═══════════════════════════════════════════════════════════════════════════
  function Costs({ go }) {
    const s        = window.SITE;
    const shopRate = 120;
    const totalSpent = s.stats.totalSpent;
    const totalSaved = Math.round(s.stats.hoursLogged * shopRate);
    const jobsValue  = totalSpent + totalSaved;

    // Per-vehicle rows
    const vehicleRows = s.vehicles.map(v => {
      const saved = Math.round(v.stats.hours * shopRate);
      return { v, saved, value: v.stats.spent + saved };
    });

    // Per-project rows
    const projectRows = s.projects.map(p => ({
      p,
      total: p.parts.reduce((a,pt) => a + (pt.qty||1)*(pt.estCost||0), 0),
    }));

    // Shopping list — all procedure parts
    const shopList = [];
    for (const v of s.vehicles) {
      for (const proc of (v.procedures||[])) {
        for (const part of (proc.parts||[])) {
          shopList.push({ ...part, vehicleId:v.id, vehicleLabel:`${v.year} ${v.model}`, procTitle:proc.title });
        }
      }
    }
    const shopTotal = shopList.reduce((a,p) => a + (p.qty||1)*p.estCost, 0);

    const StatBox = ({ label, val, sub, color, big }) => (
      <div style={{ padding: big ? '28px 28px 24px' : '20px 22px 18px', display:'flex', flexDirection:'column', gap:4 }}>
        <div className="nb-sc">{label}</div>
        <div className="nb-serif" style={{ fontSize: big ? 42 : 32, lineHeight:1.05, letterSpacing:-1, color: color||C.ink, marginTop:6 }}>{val}</div>
        {sub && <div className="nb-mute" style={{ fontSize:11.5, marginTop:4 }}>{sub}</div>}
      </div>
    );

    return (
      <div style={{ padding:'40px 60px 60px', maxWidth:1180, margin:'0 auto' }}>
        <div style={{ paddingBottom:28, borderBottom:`1px solid ${C.ink2}`, marginBottom:36 }}>
          <div className="nb-sc"><span className="nb-acc">—</span> · Cross-cutting</div>
          <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1, margin:'10px 0 0', letterSpacing:-0.5 }}>Cost analysis</h1>
          <p className="nb-ink2" style={{ fontSize:15, lineHeight:1.6, maxWidth:640, marginTop:12 }}>
            Everything derived from logged jobs and procedure parts. Shop rate set at ${shopRate}/hr.
          </p>
        </div>

        {/* Headline totals */}
        <div style={{ marginBottom:36 }}>
          <SectionLabel title="Headline totals"/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', border:`1px solid ${C.line}`, background:C.panelW }}>
            <div style={{ borderRight:`1px solid ${C.line}` }}>
              <StatBox big label="Value of jobs done" val={`$${jobsValue.toLocaleString()}`} sub="what a shop would bill (parts + labor)" color={C.accent}/>
            </div>
            <div style={{ borderRight:`1px solid ${C.line}` }}>
              <StatBox big label="Money spent"         val={`$${totalSpent.toLocaleString()}`} sub="parts & supplies, all vehicles" color={C.ink}/>
            </div>
            <div>
              <StatBox big label="Money saved"         val={`$${totalSaved.toLocaleString()}`} sub={`${s.stats.hoursLogged} hrs × $${shopRate}/hr shop labor`} color={C.green}/>
            </div>
          </div>
        </div>

        {/* Per-vehicle breakdown */}
        <div style={{ marginBottom:36 }}>
          <SectionLabel title="By vehicle"/>
          <div className="nb-card" style={{ padding:0 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 110px 110px', gap:14, padding:'10px 18px', borderBottom:`1px solid ${C.line}`, background:C.panel }} className="nb-sc">
              <span>Vehicle</span><span style={{ textAlign:'right' }}>Spent</span><span style={{ textAlign:'right' }}>Hours</span><span style={{ textAlign:'right' }}>Jobs</span><span style={{ textAlign:'right' }}>Saved</span><span style={{ textAlign:'right' }}>Value</span>
            </div>
            {vehicleRows.map(({ v, saved, value },i) => (
              <div key={v.id} className="nb-row" onClick={() => go({ name:'vehicle', id:v.id })}
                style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 110px 110px', gap:14, padding:'14px 18px', borderBottom: i<vehicleRows.length-1 ? `1px solid ${C.lineL}` : 'none', alignItems:'center' }}>
                <div>
                  <div className="nb-serif nb-row-title" style={{ fontSize:16 }}>{v.year} {v.make} {v.model}</div>
                  <div className="nb-mute" style={{ fontSize:11, marginTop:2 }}>{v.engine} · {v.mileage.toLocaleString()} mi</div>
                </div>
                <span className="nb-mono" style={{ textAlign:'right' }}>${v.stats.spent.toLocaleString()}</span>
                <span className="nb-mono" style={{ textAlign:'right' }}>{v.stats.hours}</span>
                <span className="nb-mono" style={{ textAlign:'right' }}>{v.stats.projects}</span>
                <span className="nb-mono" style={{ textAlign:'right', color:C.green }}>${saved.toLocaleString()}</span>
                <span className="nb-mono" style={{ textAlign:'right', color:C.accent, fontWeight:600 }}>${value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects breakdown */}
        <div style={{ marginBottom:36 }}>
          <SectionLabel title="Engineering projects" right={`${projectRows.length} total`}/>
          <div className="nb-card" style={{ padding:0 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px 140px', gap:14, padding:'10px 18px', borderBottom:`1px solid ${C.line}`, background:C.panel }} className="nb-sc">
              <span>Project</span><span style={{ textAlign:'right' }}>Hours</span><span style={{ textAlign:'right' }}>Parts</span><span style={{ textAlign:'right' }}>Status</span>
            </div>
            {projectRows.map(({ p, total },i) => (
              <div key={p.id} className="nb-row" onClick={() => go({ name:'project', id:p.id })}
                style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px 140px', gap:14, padding:'13px 18px', borderBottom: i<projectRows.length-1 ? `1px solid ${C.lineL}` : 'none', alignItems:'center' }}>
                <div>
                  <div className="nb-serif nb-row-title" style={{ fontSize:15 }}>{p.title}</div>
                  <div style={{ display:'flex', gap:4, marginTop:4, flexWrap:'wrap' }}>
                    {p.tags.slice(0,3).map(t => <span key={t} className="nb-tag" style={{ fontSize:9, padding:'1px 4px' }}>{t}</span>)}
                  </div>
                </div>
                <span className="nb-mono" style={{ textAlign:'right' }}>{p.hours}</span>
                <span className="nb-mono" style={{ textAlign:'right' }}>${total.toFixed(0)}</span>
                <span className="nb-tag" style={{ color:statusColor(p.status), borderColor:statusColor(p.status), justifySelf:'end' }}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Parts shopping list */}
        <div>
          <SectionLabel title="Procedure parts register" right={`est. $${shopTotal.toFixed(2)} to stock all`}/>
          <div className="nb-card" style={{ padding:0 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 120px 80px 80px 90px', gap:14, padding:'10px 18px', borderBottom:`1px solid ${C.line}`, background:C.panel }} className="nb-sc">
              <span>Part</span><span>Part number</span><span style={{ textAlign:'right' }}>Qty</span><span style={{ textAlign:'right' }}>Unit</span><span style={{ textAlign:'right' }}>Total</span>
            </div>
            {shopList.map((p,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 120px 80px 80px 90px', gap:14, padding:'11px 18px', borderBottom: i<shopList.length-1 ? `1px solid ${C.lineL}` : 'none', alignItems:'start', fontSize:13 }}>
                <div>
                  <div className="nb-serif" style={{ fontSize:14 }}>{p.item}</div>
                  {p.sub && <div className="nb-mute" style={{ fontSize:11, marginTop:1 }}>{p.sub}</div>}
                  <div className="nb-mute" style={{ fontSize:10.5, marginTop:2 }}>{p.vehicleLabel} · {p.procTitle}</div>
                </div>
                <span className="nb-mono" style={{ color:C.accent, fontSize:11, cursor:'pointer', paddingTop:2 }}
                  title="Copy"
                  onClick={() => { try { navigator.clipboard.writeText(p.partNumber); } catch(e){} }}>
                  {p.partNumber}
                </span>
                <span className="nb-mono" style={{ textAlign:'right' }}>×{p.qty}</span>
                <span className="nb-mono" style={{ textAlign:'right' }}>${p.estCost.toFixed(2)}</span>
                <span className="nb-mono" style={{ textAlign:'right', color:C.ink2 }}>${((p.qty||1)*p.estCost).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ROUTER
  // ═══════════════════════════════════════════════════════════════════════════
  function VariantNotebook() {
    const [page, setPage] = React.useState({ name:'home' });

    let body;
    switch (page.name) {
      case 'eng':           body = <Engineering go={setPage}/>; break;
      case 'topic':         body = <TopicDetail go={setPage} id={page.id}/>; break;
      case 'projects':      body = <ProjectsList go={setPage}/>; break;
      case 'project':       body = <ProjectDetail go={setPage} id={page.id}/>; break;
      case 'cars':          body = <Garage go={setPage}/>; break;
      case 'vehicle':       body = <VehicleDetail go={setPage} id={page.id}/>; break;
      case 'procedure':     body = <ProcedureDetail go={setPage} vehicleId={page.vehicleId} id={page.id}/>; break;
      case 'garage-project':body = <GarageProjectDetail go={setPage}/>; break;
      case 'lessons':       body = <Lessons go={setPage}/>; break;
      case 'costs':         body = <Costs go={setPage}/>; break;
      default:              body = <Home go={setPage}/>;
    }

    return <Frame page={page.name} setPage={setPage}>{body}</Frame>;
  }

  window.VariantNotebook = VariantNotebook;
})();

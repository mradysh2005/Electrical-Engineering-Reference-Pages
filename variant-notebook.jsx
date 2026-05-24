// THE POLISHED COMMIT
// Carbon palette (near-black + cad-yellow) + Blueprint fonts (Crimson Pro serif
// + JetBrains Mono) + tightened IA:
//   - Home: slogan, doors, recent log. No stats dashboard.
//   - Engineering: three-pane drill, terse blurbs.
//   - Topic: course tag, title, summary, sections, sidebar formulas. No filler.
//   - Garage: 3 tabs (Vehicles · Service Log · Buying Guides). Reliability is
//     a property of each vehicle card — no separate tab, no column in the log.
//   - Vehicle: hero + spec + reliability + service log (for this car) + ownership.
//   - Service Log table: Date · Type · Job · Vehicle · Cost. That's it.
//   - Project: steps + parts + tools + shop note.

(() => {
  const C = {
    bg:     '#0b0c0e',
    panel:  '#131418',
    panelW: '#171a1f',
    panelD: '#0f1013',
    ink:    '#ecead8',          // slightly warm paper-white (matches Blueprint's cream-on-dark feel)
    ink2:   '#b9b8a8',
    mute:   '#7a7869',
    line:   '#22231e',
    lineL:  '#1a1b17',
    lineS:  '#2f302a',
    accent: '#e6b022',           // cad yellow, slightly warmer than pure CAD yellow to read serif
    accentD:'#c4920f',
    blue:   '#7299c9',
    red:    '#c8634d',
    green:  '#7aa05c',
  };

  const fontHead = '"Crimson Pro", "Iowan Old Style", "Palatino Linotype", Georgia, serif';
  const fontMono = '"JetBrains Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace';

  if (!document.getElementById('nb-fonts')) {
    const link = document.createElement('link');
    link.id = 'nb-fonts'; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }
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
      .nb-row { cursor:pointer; transition: background .12s; }
      .nb-row:hover { background:${C.panel}; }
      .nb-row:hover .nb-row-title { color:${C.accent}; }
      .nb-tag {
        display:inline-flex; align-items:center; gap:5px; padding:2px 8px;
        border:1px solid ${C.lineS}; font-family:${fontMono}; font-size:10.5px;
        letter-spacing:.08em; text-transform:uppercase; color:${C.ink2};
      }
      .nb-tag-acc { background:${C.accent}; color:${C.bg}; border-color:${C.accent}; font-weight:500; }
      .nb-btn {
        display:inline-flex; align-items:center; gap:10px; padding:11px 22px;
        background:transparent; color:${C.ink}; border:1px solid ${C.ink2}; cursor:pointer;
        font-family:${fontMono}; font-size:12px; font-weight:500; letter-spacing:.02em;
        transition: background .12s, color .12s, border-color .12s;
      }
      .nb-btn:hover { background:${C.ink}; color:${C.bg}; border-color:${C.ink}; }
      .nb-btn-acc { background:${C.accent}; color:${C.bg}; border-color:${C.accent}; font-weight:600; }
      .nb-btn-acc:hover { background:${C.accentD}; border-color:${C.accentD}; color:${C.bg}; }
      .nb-tab {
        padding:10px 0; background:transparent; border:none; cursor:pointer;
        color:${C.mute}; font-family:${fontMono}; font-size:13px; font-weight:500;
        border-bottom:2px solid transparent; margin-right:28px;
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
    `;
    document.head.appendChild(s);
  }

  // ───────── Mark — small square with a corner cut + radish accent dot
  const Mark = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <path d="M0 0 H14 L20 6 V20 H0 Z" fill={C.accent}/>
      <path d="M14 0 V6 H20" stroke={C.bg} strokeWidth="1" fill="none"/>
      <circle cx="6" cy="13" r="1.4" fill={C.bg}/>
    </svg>
  );

  // ───────── Vehicle technical drawing
  const VehicleTech = ({ kind, height = 100, stroke = C.ink2 }) => {
    if (kind === 'ranger') return (
      <svg viewBox="0 0 240 100" style={{ width:'100%', height }} fill="none" stroke={stroke} strokeWidth="1" strokeLinejoin="round">
        <path d="M14 72 L 14 48 L 84 48 L 100 28 L 144 28 L 158 48 L 222 48 L 222 72 Z"/>
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
        <path d="M14 68 C 36 56, 64 44, 96 36 L 160 36 C 188 44, 212 56, 222 68 Z"/>
        <path d="M64 36 L 84 22 L 152 22 L 170 36"/>
        <circle cx="58" cy="72" r="11"/><circle cx="58" cy="72" r="4"/>
        <circle cx="184" cy="72" r="11"/><circle cx="184" cy="72" r="4"/>
        <line x1="14" y1="92" x2="222" y2="92" strokeWidth="0.7"/>
        <line x1="14" y1="89" x2="14" y2="95" strokeWidth="0.7"/>
        <line x1="222" y1="89" x2="222" y2="95" strokeWidth="0.7"/>
      </svg>
    );
    return (
      <svg viewBox="0 0 240 100" style={{ width:'100%', height }} fill="none" stroke={stroke} strokeWidth="1" strokeLinejoin="round">
        <path d="M14 70 C 24 52, 42 40, 68 34 L 168 34 C 192 40, 214 52, 222 70 Z"/>
        <path d="M54 34 L 76 20 L 168 20 L 184 34"/>
        <circle cx="58" cy="74" r="11"/><circle cx="58" cy="74" r="4"/>
        <circle cx="184" cy="74" r="11"/><circle cx="184" cy="74" r="4"/>
        <line x1="14" y1="92" x2="222" y2="92" strokeWidth="0.7"/>
        <line x1="14" y1="89" x2="14" y2="95" strokeWidth="0.7"/>
        <line x1="222" y1="89" x2="222" y2="95" strokeWidth="0.7"/>
      </svg>
    );
  };

  // Reliability color — one source of truth so every appearance agrees.
  const relColor = (r) => r >= 7.5 ? C.green : r >= 6 ? C.accent : C.red;
  // Service-log type color (Repair / PM / Mod / Diag). Used in vehicle service
  // list and in the main Service Log table.
  const kindColor = (k) => k === 'Repair' ? C.red : k === 'PM' ? C.green : k === 'Mod' ? C.blue : C.accent;

  // ───────── FRAME
  function Frame({ page, setPage, children }) {
    const nav = [['home','Home','00'],['eng','Engineering','01'],['cars','Garage','02']];
    return (
      <div className="nb">
        <div style={{ height:52, background:C.panel, borderBottom:`1px solid ${C.line}`, display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', padding:'0 30px' }}>
          <button onClick={() => setPage({ name:'home' })} style={{ background:'none', border:'none', padding:0, cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
            <Mark/>
            <span className="nb-serif" style={{ fontSize:20, fontWeight:600, color:C.ink, letterSpacing:-0.3 }}>
              Rad<span style={{ color:C.accent }}>.</span>ish
            </span>
          </button>
          <div style={{ justifySelf:'center', display:'flex', alignItems:'center' }}>
            {nav.map(([id,label,n]) => (
              <button key={id} className="nb-navbtn" data-active={page === id} onClick={() => setPage({ name:id })}>
                <span className="nb-mono" style={{ fontSize:10, color: page === id ? C.accent : C.mute }}>{n}</span>
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

  // ───────── HOME
  // Layout: confident asymmetric hero on the left, "currently studying" on the
  // right. Below: two doors (Engineering / Garage) as a flat two-column list of
  // contents. Bottom: recent service log strip.
  // No stats dashboard. No reliability anywhere on home.
  function Home({ go }) {
    const s = window.SITE;
    return (
      <div style={{ padding:'56px 60px 56px', maxWidth:1180, margin:'0 auto' }}>
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

          {/* Recent work — small focused list, not a dashboard */}
          <div>
            <div className="nb-sc" style={{ marginBottom:8 }}>Recent work</div>
            {[
              ['ECE 371', 'Op-Amps & Comparators', 'opamps'],
              ['ECE 342', 'Transformer OC / SC tests', 'transformers'],
              ['ECE 395', 'RISC-V calling convention', 'riscv-isa'],
            ].map(([course, title, id], i) => (
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

        {/* Recent Updates */}
        <div style={{ marginTop:40, marginBottom:10, display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <span className="nb-sc">Recent updates</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>
          {/* Engineering — categories */}
          <div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
              <span className="nb-sc"><span className="nb-acc">01 ·</span> Engineering</span>
              <span className="nb-sc">{s.stats.eeTopics} sheets</span>
            </div>
            <hr className="nb-rule-strong"/>
            {s.engineering.map((cat,i)=>(
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

          {/* Garage — vehicles (no reliability badge — that's on the vehicle page itself) */}
          <div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
              <span className="nb-sc"><span className="nb-acc">02 ·</span> Garage</span>
              <span className="nb-sc">3 vehicles</span>
            </div>
            <hr className="nb-rule-strong"/>
            {s.vehicles.map((v,i)=>(
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
        {(() => {
          const shopRate = 120;
          const moneySpent = s.stats.totalSpent;
          const moneySaved = Math.round(s.stats.hoursLogged * shopRate);
          const jobsValue  = moneySpent + moneySaved;
          const stats = [
            { label:'Value of jobs done', sub:'what a shop would bill', val:`$${jobsValue.toLocaleString()}`, color:C.accent },
            { label:'Money spent',        sub:'parts & supplies (DIY)', val:`$${moneySpent.toLocaleString()}`, color:C.ink },
            { label:'Money saved',        sub:`${s.stats.hoursLogged} hrs × $${shopRate} shop labor`, val:`$${moneySaved.toLocaleString()}`, color:C.green },
          ];
          return (
            <div style={{ marginTop:42 }}>
              <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
                <span className="nb-sc">Money analysis</span>
                <span className="nb-sc nb-row" onClick={() => go({ name:'cars' })} style={{ display:'inline-block' }}>Full log →</span>
              </div>
              <hr className="nb-rule-strong"/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0, marginTop:0, border:`1px solid ${C.line}`, background:C.panelW }}>
                {stats.map((st, i) => (
                  <div key={i} style={{ padding:'28px 28px 24px', borderRight: i < 2 ? `1px solid ${C.line}` : 'none', display:'flex', flexDirection:'column', gap:4 }}>
                    <div className="nb-sc">{st.label}</div>
                    <div className="nb-serif" style={{ fontSize:42, lineHeight:1.05, letterSpacing:-1, color:st.color, marginTop:8 }}>{st.val}</div>
                    <div className="nb-mute" style={{ fontSize:11.5, marginTop:4 }}>{st.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // ───────── ENGINEERING
  function Engineering({ go }) {
    const s = window.SITE;
    const [catId, setCatId] = React.useState('circuits');
    const [groupId, setGroupId] = React.useState('amplification');
    const cat = s.engineering.find(c => c.id === catId);
    const group = cat.groups.find(g => g.id === groupId) || cat.groups[0];
    React.useEffect(() => { setGroupId(cat.groups[0].id); }, [catId]);

    return (
      <div>
        <div style={{ padding:'40px 60px 22px', borderBottom:`1px solid ${C.ink2}` }}>
          <div className="nb-sc"><span className="nb-acc">01</span> · Engineering</div>
          <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1, margin:'10px 0 0', letterSpacing:-0.5 }}>Reference sheets</h1>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'240px 280px 1fr', minHeight:680 }}>
          <div style={{ borderRight:`1px solid ${C.line}`, background:C.panel }}>
            <div style={{ padding:'12px 20px', borderBottom:`1px solid ${C.line}`, display:'flex', justifyContent:'space-between' }}>
              <span className="nb-sc">Department</span>
              <span className="nb-mono nb-mute" style={{ fontSize:11 }}>{s.engineering.length}</span>
            </div>
            {s.engineering.map((c,i) => (
              <div key={c.id} className="nb-row" onClick={() => setCatId(c.id)}
                style={{ padding:'14px 20px', borderBottom:`1px solid ${C.lineL}`,
                  background: c.id === catId ? C.panelW : 'transparent',
                  borderLeft: `3px solid ${c.id === catId ? C.accent : 'transparent'}` }}>
                <div className="nb-mono nb-mute" style={{ fontSize:11, marginBottom:4 }}>01.0{i+1}</div>
                <div className="nb-serif" style={{ fontSize:17 }}>{c.title}</div>
              </div>
            ))}
          </div>

          <div style={{ borderRight:`1px solid ${C.line}`, background:C.panelD }}>
            <div style={{ padding:'12px 20px', borderBottom:`1px solid ${C.line}` }}>
              <span className="nb-sc">{cat.title}</span>
            </div>
            {cat.groups.map((g) => (
              <div key={g.id} className="nb-row" onClick={() => setGroupId(g.id)}
                style={{ padding:'14px 20px', borderBottom:`1px solid ${C.lineL}`,
                  background: g.id === groupId ? C.panel : 'transparent' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
                  <div className="nb-serif" style={{ fontSize:16 }}>{g.title}</div>
                  <span className="nb-tag" style={{ fontSize:10 }}>{g.topics.length}</span>
                </div>
                <div className="nb-mute" style={{ fontSize:12, marginTop:4, lineHeight:1.5 }}>{g.blurb}</div>
              </div>
            ))}
          </div>

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
                <div key={t.id} className="nb-row" onClick={() => go({ name:'topic', id: t.id })}
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
      </div>
    );
  }

  // ───────── TOPIC DETAIL
  function TopicDetail({ go }) {
    const t = window.SITE.topicDetail;
    return (
      <div>
        <div style={{ padding:'32px 60px 22px', borderBottom:`1px solid ${C.ink2}` }}>
          <button onClick={() => go({ name:'eng' })} style={{ background:'none', border:'none', padding:0, color:C.mute, cursor:'pointer', fontSize:12, marginBottom:14, fontFamily:fontMono }}>
            ← Engineering / {t.category}
          </button>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div>
              <div className="nb-sc">
                <span className="nb-acc">{t.course}</span>
                <span style={{ marginLeft:14 }}>{t.reading}</span>
              </div>
              <h1 className="nb-serif" style={{ fontSize:46, lineHeight:1, margin:'10px 0 0', letterSpacing:-0.5 }}>{t.title}</h1>
            </div>
            <span className="nb-tag nb-tag-acc">Reference</span>
          </div>
          <p className="nb-ink2" style={{ fontSize:15, lineHeight:1.6, maxWidth:760, margin:'14px 0 0' }}>{t.summary}</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:0 }}>
          <div style={{ padding:'30px 60px 60px', borderRight:`1px solid ${C.line}` }}>
            {t.sections.map((sec,i)=>(
              <div key={i} style={{ marginBottom:34 }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:14, marginBottom:10 }}>
                  <span className="nb-mono nb-acc" style={{ fontSize:13, fontWeight:600 }}>§ {String(i+1).padStart(2,'0')}</span>
                  <h2 className="nb-serif" style={{ fontSize:22, margin:0 }}>{sec.title}</h2>
                </div>
                {sec.body && (
                  <pre style={{ fontFamily:fontMono, fontSize:13, lineHeight:1.75, whiteSpace:'pre-wrap', margin:0, color:C.ink }}>{sec.body}</pre>
                )}
                {sec.table && (
                  <div className="nb-card" style={{ marginTop:12 }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                      <tbody>
                        {sec.table.map((row, ri) => (
                          <tr key={ri} style={{ background: ri === 0 ? C.panel : 'transparent', borderBottom: ri < sec.table.length-1 ? `1px solid ${C.lineL}` : 'none' }}>
                            {row.map((cell, ci) => (
                              <td key={ci} style={{ padding:'10px 16px',
                                color: ri === 0 ? C.mute : (ci === 0 ? C.mute : C.ink),
                                fontFamily: ri === 0 ? fontMono : (ci === 0 ? fontHead : fontMono),
                                fontSize: ri === 0 ? 11 : (ci === 0 ? 15 : 13),
                                fontWeight: ri === 0 ? 500 : (ci === 0 ? 500 : 400),
                                letterSpacing: ri === 0 ? '.14em' : 'normal',
                                textTransform: ri === 0 ? 'uppercase' : 'none',
                                borderRight: ci < row.length-1 ? `1px solid ${C.lineL}` : 'none'
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

          {/* Sidebar — formulas + see also. No metadata filler. */}
          <div style={{ padding:'30px 24px', background:C.panel }}>
            <div className="nb-sc" style={{ marginBottom:10 }}>Formulas</div>
            <div className="nb-card" style={{ padding:0 }}>
              {t.formulas.map((f,i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:14, padding:'10px 14px', borderBottom: i < t.formulas.length-1 ? `1px solid ${C.lineL}` : 'none', alignItems:'baseline' }}>
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

  // ───────── GARAGE
  // Tabs: Vehicles · Service Log · Buying Guides. Reliability is NOT a tab —
  // it's a property of each vehicle. Service Log does NOT carry a reliability
  // column — the log is about jobs done, not vehicle health.
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
            {[['vehicles','Vehicles'],['log','Service Log'],['guides','Buying Guides']].map(([id,label]) => (
              <button key={id} onClick={() => setTab(id)} className="nb-tab" data-active={tab === id}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ padding:'32px 60px 60px' }}>
          {tab === 'vehicles' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18 }}>
              {s.vehicles.map((v,i) => (
                <div key={v.id} className="nb-card nb-row" onClick={() => go({ name:'vehicle', id:v.id })}>
                  <div style={{ padding:18, borderBottom:`1px solid ${C.lineL}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <div className="nb-mono nb-acc" style={{ fontSize:11 }}>02.0{i+1}</div>
                        <h3 className="nb-serif nb-row-title" style={{ fontSize:20, margin:'4px 0 0' }}>{v.year} {v.make} {v.model}</h3>
                        <div className="nb-mute" style={{ fontSize:12, marginTop:4 }}>{v.engine} · {v.trans} · {v.drive}</div>
                      </div>
                      <span className="nb-tag" style={{ color: relColor(v.reliability), borderColor: relColor(v.reliability) }}>
                        {v.reliability.toFixed(1)}
                      </span>
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
                      <div className="nb-sc">Status</div>
                      <div className="nb-mono" style={{ fontSize:13, marginTop:4, color:C.ink2 }}>{v.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'log' && (
            // Date · Type · Job · Vehicle · Cost. That's it. No reliability column.
            <div className="nb-card">
              <div style={{ display:'grid', gridTemplateColumns:'120px 80px 1fr 140px 100px', gap:14, padding:'10px 18px', borderBottom:`1px solid ${C.line}`, background:C.panel }} className="nb-sc">
                <span>Date</span><span>Type</span><span>Job</span><span>Vehicle</span><span style={{ textAlign:'right' }}>Cost</span>
              </div>
              {s.recent.map((r,i)=>{
                const v = window.findVehicle(r.vehicle);
                return (
                  <div key={i} className="nb-row" onClick={() => go({ name:'project', id:'ranger-clutch' })}
                    style={{ display:'grid', gridTemplateColumns:'120px 80px 1fr 140px 100px', gap:14, padding:'13px 18px', borderBottom: i < s.recent.length-1 ? `1px solid ${C.lineL}` : 'none', alignItems:'center', fontSize:13 }}>
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

          {tab === 'guides' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18 }}>
              {[
                { era:'1998-2011', what:'Ford Ranger 3.0 / 4.0', verdict:'BUY', color:C.green,
                  body:'Cheap, simple, parts everywhere. The 3.0 Vulcan is anemic but bulletproof. 4.0 SOHC has a timing-chain reputation — verify service.' },
                { era:'2016-2021', what:'Honda Civic 2.0 NA', verdict:'BUY', color:C.green,
                  body:'Avoid the 1.5T head-gasket lottery. The 2.0 NA is the sensible choice. CVT is fine.' },
                { era:'2014-2020', what:'Nissan Rogue (JF017E)', verdict:'PASS', color:C.red,
                  body:'Or commit to 30k fluid swaps for the life of the car. JF017E CVT is the catch.' },
              ].map((g,i)=>(
                <div key={i} className="nb-card">
                  <div style={{ padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:`1px solid ${C.lineL}` }}>
                    <span className="nb-mono nb-mute" style={{ fontSize:11 }}>{g.era}</span>
                    <span className="nb-tag" style={{ color:g.color, borderColor:g.color }}>{g.verdict}</span>
                  </div>
                  <div style={{ padding:18 }}>
                    <h4 className="nb-serif" style={{ fontSize:19, margin:'0 0 10px' }}>{g.what}</h4>
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

  // ───────── VEHICLE DETAIL
  // Reliability lives here — with the rest of the spec.
  // Ownership totals live here — not on the home page.
  function VehicleDetail({ go, id }) {
    const v = window.findVehicle(id) || window.SITE.vehicles[0];
    const idx = window.SITE.vehicles.indexOf(v);
    return (
      <div>
        <div style={{ padding:'32px 60px 22px', borderBottom:`1px solid ${C.ink2}` }}>
          <button onClick={() => go({ name:'cars' })} style={{ background:'none', border:'none', padding:0, color:C.mute, cursor:'pointer', fontSize:12, marginBottom:14, fontFamily:fontMono }}>
            ← Garage
          </button>
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
            <span className="nb-tag" style={{ color: relColor(v.reliability), borderColor: relColor(v.reliability), fontSize:12, padding:'4px 12px' }}>
              Reliability {v.reliability.toFixed(1)} / 10
            </span>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:0 }}>
          <div style={{ padding:'30px 60px', borderRight:`1px solid ${C.line}` }}>
            {/* Hero drawing */}
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
            {window.SITE.recent.filter(r => r.vehicle === v.id).map((r,i,arr)=>(
              <div key={i} className="nb-row" onClick={() => go({ name:'project', id:'ranger-clutch' })}
                style={{ display:'grid', gridTemplateColumns:'120px 80px 1fr 90px', gap:14, padding:'12px 4px', borderBottom: i < arr.length-1 ? `1px solid ${C.lineL}` : 'none', alignItems:'center', fontSize:13 }}>
                <span className="nb-mono">{r.date}</span>
                <span className="nb-tag" style={{ color:kindColor(r.kind), borderColor:kindColor(r.kind) }}>{r.kind}</span>
                <span className="nb-serif" style={{ fontSize:15 }}>{r.label}</span>
                <span className="nb-mono" style={{ textAlign:'right' }}>${r.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Spec sheet + ownership totals */}
          <div style={{ padding:'30px 28px 60px', background:C.panel }}>
            <div className="nb-sc" style={{ marginBottom:10 }}>Specification</div>
            <hr className="nb-rule"/>
            {[
              ['Engine', v.engine],
              ['Transmission', v.trans],
              ['Drive', v.drive],
              ['Mileage', `${v.mileage.toLocaleString()} mi`],
              ['Color', v.color],
              ['Acquired', v.acquired],
              ['Status', v.status],
            ].map(([k,val]) => (
              <div key={k} style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:14, padding:'10px 0', borderBottom:`1px solid ${C.lineL}`, fontSize:13 }}>
                <span className="nb-sc">{k}</span>
                <span className="nb-mono" style={{ color:C.ink }}>{val}</span>
              </div>
            ))}

            <div className="nb-sc" style={{ marginTop:28, marginBottom:10 }}>Ownership</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, border:`1px solid ${C.line}`, background:C.panelW }}>
              <div style={{ padding:'14px 16px', borderRight:`1px solid ${C.lineL}`, borderBottom:`1px solid ${C.lineL}` }}>
                <div className="nb-sc">Spent</div>
                <div className="nb-serif" style={{ fontSize:28, marginTop:2 }}>${v.stats.spent}</div>
              </div>
              <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.lineL}` }}>
                <div className="nb-sc">$ / 1k mi</div>
                <div className="nb-serif" style={{ fontSize:28, marginTop:2 }}>${(v.stats.spent / v.mileage * 1000).toFixed(2)}</div>
              </div>
              <div style={{ padding:'14px 16px', borderRight:`1px solid ${C.lineL}` }}>
                <div className="nb-sc">Hours</div>
                <div className="nb-serif" style={{ fontSize:24, marginTop:2 }}>{v.stats.hours}</div>
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div className="nb-sc">Jobs</div>
                <div className="nb-serif" style={{ fontSize:24, marginTop:2 }}>{v.stats.projects}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ───────── PROJECT DETAIL
  function ProjectDetail({ go }) {
    const p = window.SITE.projectDetail;
    const v = window.findVehicle(p.vehicle);
    const partsTotal = p.parts.reduce((a,b)=>a+b.cost,0);
    return (
      <div>
        <div style={{ padding:'32px 60px 22px', borderBottom:`1px solid ${C.ink2}` }}>
          <button onClick={() => go({ name:'vehicle', id:v.id })} style={{ background:'none', border:'none', padding:0, color:C.mute, cursor:'pointer', fontSize:12, marginBottom:14, fontFamily:fontMono }}>
            ← {v.year} {v.make} {v.model}
          </button>
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

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:0 }}>
          <div style={{ padding:'30px 60px 60px', borderRight:`1px solid ${C.line}` }}>
            <div className="nb-sc" style={{ marginBottom:14 }}>Procedure</div>
            <hr className="nb-rule-strong"/>
            {p.steps.map((step,i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'50px 1fr', gap:18, padding:'16px 0', borderBottom: i < p.steps.length-1 ? `1px solid ${C.line}` : 'none' }}>
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
            <div className="nb-sc" style={{ marginBottom:10 }}>Parts</div>
            <div className="nb-card">
              {p.parts.map((part,i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:10, padding:'12px 14px', borderBottom: i < p.parts.length-1 ? `1px solid ${C.lineL}` : 'none' }}>
                  <div>
                    <div className="nb-serif" style={{ fontSize:14 }}>{part.name}</div>
                    <div className="nb-mono nb-mute" style={{ fontSize:10.5, marginTop:2 }}>P/N {part.pn}</div>
                  </div>
                  <span className="nb-mono" style={{ fontSize:13 }}>${part.cost.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:10, padding:'12px 14px', borderTop:`1px solid ${C.ink2}`, background:C.panelD }}>
                <span className="nb-sc">Subtotal</span>
                <span className="nb-mono nb-acc" style={{ fontSize:15, fontWeight:600 }}>${partsTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="nb-sc" style={{ marginTop:24, marginBottom:10 }}>Tools</div>
            <div className="nb-card">
              {p.tools.map((t,i)=>(
                <div key={i} style={{ padding:'10px 14px', borderBottom: i < p.tools.length-1 ? `1px solid ${C.lineL}` : 'none', fontSize:13 }}>
                  <span className="nb-mono nb-mute" style={{ marginRight:10, fontSize:11 }}>{String(i+1).padStart(2,'0')}</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ───────── ROUTER
  function VariantNotebook() {
    const [page, setPage] = React.useState({ name:'home' });
    let body;
    switch (page.name) {
      case 'eng':     body = <Engineering go={setPage} />; break;
      case 'topic':   body = <TopicDetail go={setPage} id={page.id} />; break;
      case 'cars':    body = <Garage go={setPage} />; break;
      case 'vehicle': body = <VehicleDetail go={setPage} id={page.id} />; break;
      case 'project': body = <ProjectDetail go={setPage} />; break;
      default:        body = <Home go={setPage} />;
    }
    return <Frame page={page.name} setPage={setPage}>{body}</Frame>;
  }

  window.VariantNotebook = VariantNotebook;
})();

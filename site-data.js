// Shared content tree for all three variants.
// Mirrors the live site at mradysh2005.github.io/Electrical-Engineering-Reference-Pages
// plus the user's stated scope (garage / project log / reliability / buying guides).

window.SITE = {
  owner: { name: 'Mike Radysh', school: 'NJIT', program: 'B.S. Electrical Engineering', grad: 'Class of 2027' },

  stats: {
    vehicles: 3,
    eeTopics: 13,
    projects: 18,
    totalSpent: 4280,
    hoursLogged: 142,
  },

  // Hierarchical: Category → Subcategory → Topic
  // Every node has a `blurb` so no page is ever blank.
  engineering: [
    {
      id: 'circuits', title: 'Circuits & Electronics', glyph: '⚡',
      blurb: 'Op-amps, oscillators, filters. The analog layer between sensors and MCUs.',
      groups: [
        {
          id: 'amplification', title: 'Amplification',
          blurb: 'Op-amps, comparators, and feedback rules.',
          topics: [
            { id: 'opamps', title: 'Op-Amps & Comparators', tag: 'ECE 371' },
            { id: 'schmitt', title: 'Schmitt Triggers & Hysteresis', tag: 'ECE 371' },
          ],
        },
        {
          id: 'timing', title: 'Timing & Oscillation',
          blurb: 'Clocks, tones, and oscillators.',
          topics: [
            { id: '555', title: '555 Timers', tag: 'ECE 371' },
            { id: 'wien', title: 'Wien-Bridge Oscillators', tag: 'ECE 371' },
          ],
        },
        {
          id: 'filters', title: 'Frequency Response',
          blurb: 'Low-pass, high-pass, band-pass. Cutoffs and roll-off.',
          topics: [
            { id: 'filters', title: 'Filters & Frequency', tag: 'ECE 371' },
          ],
        },
      ],
    },
    {
      id: 'power', title: 'Power Systems', glyph: '⚙',
      blurb: 'Transformers, conversion, three-phase. ECE 342.',
      groups: [
        {
          id: 'transformers', title: 'Transformers',
          blurb: 'Theory, OC and SC tests, loss separation.',
          topics: [
            { id: 'transformers', title: 'Transformer Theory & Tests', tag: 'ECE 342' },
          ],
        },
        {
          id: 'conversion', title: 'Energy Conversion',
          blurb: 'Magnetic circuits and three-phase basics.',
          topics: [
            { id: 'magnetic', title: 'Magnetic Circuits & 3-Phase', tag: 'ECE 342' },
            { id: 'acdc', title: 'AC / DC Fundamentals', tag: 'ECE 342' },
          ],
        },
      ],
    },
    {
      id: 'embedded', title: 'Embedded Systems', glyph: '◧',
      blurb: 'Bare-metal RISC-V. Memory-mapped I/O, GPIO.',
      groups: [
        {
          id: 'mcu', title: 'MCU & GPIO',
          blurb: 'SiFive FE310. Memory-mapped registers, GPIO.',
          topics: [
            { id: 'gpio', title: 'Memory-Mapped GPIO', tag: 'ECE 395' },
          ],
        },
        {
          id: 'riscv', title: 'RISC-V Assembly',
          blurb: 'Load/store, calling convention, the stack.',
          topics: [
            { id: 'riscv-isa', title: 'Essential Instructions', tag: 'ECE 395' },
            { id: 'riscv-calls', title: 'Calling Convention & Stack', tag: 'ECE 395' },
          ],
        },
      ],
    },
    {
      id: 'fundamentals', title: 'Fundamentals', glyph: '∑',
      blurb: 'Decibels, two-port networks, device comparisons.',
      groups: [
        {
          id: 'units', title: 'Units & Conversions',
          blurb: 'Decibels, ratios, logarithmic shortcuts.',
          topics: [
            { id: 'db', title: 'Decibel Conversions', tag: 'ECE 371' },
          ],
        },
        {
          id: 'networks', title: 'Network Analysis',
          blurb: 'Two-port parameter sets — h, g, y, z.',
          topics: [
            { id: 'two-port', title: 'Two-Port Networks (g-parameters)', tag: 'ECE 371' },
          ],
        },
        {
          id: 'devices', title: 'Devices',
          blurb: 'Active devices, head-to-head.',
          topics: [
            { id: 'fets-vs-bjts', title: 'MOSFETs vs BJTs', tag: 'ECE 271 · 371' },
          ],
        },
      ],
    },
  ],

  // A single fully-realized topic for the "topic detail" page in every variant.
  topicDetail: {
    id: 'opamps',
    title: 'Op-Amps & Comparators',
    category: 'Circuits & Electronics',
    course: 'ECE 371',
    reading: 'Jaeger & Blalock Ch. 10',
    summary: 'The ideal op-amp model is two assumptions. Get those, get everything downstream — inverting, non-inverting, comparators.',
    sections: [
      {
        title: 'The Two Golden Rules',
        body: 'Rule 1: V₊ = V₋ (virtual short).\nRule 2: I₊ = I₋ = 0 (no input current).\n\nBoth ONLY apply in the linear region, i.e. with negative feedback. Open-loop or positive-feedback (comparator mode) → no virtual short, output rails to ±V_sat.',
        callout: 'Negative feedback → virtual short. Positive feedback → comparator.',
      },
      {
        title: 'Inverting vs Non-Inverting',
        table: [
          ['', 'Inverting', 'Non-Inverting'],
          ['Gain Av', '−Rf / R1', '1 + Rf / R1'],
          ['Input Z', 'R1', '≈ ∞'],
          ['Phase', '180° out', 'In phase'],
          ['Min |Av|', '0 (attenuator OK)', '1'],
        ],
      },
      {
        title: 'Comparators',
        body: 'Op-amp run open-loop. Compares V₊ and V₋:\n  V₊ > V₋ → Vout = +V_sat\n  V₊ < V₋ → Vout = −V_sat (or 0V single supply)\n\nLM311 is open-collector — needs a pull-up resistor for HIGH.',
        callout: 'No feedback. No virtual short. Output slams to a rail.',
      },
    ],
    formulas: [
      { sym: 'A_v,inv', eq: '−Rf / R1' },
      { sym: 'A_v,non', eq: '1 + Rf / R1' },
      { sym: 'GBW', eq: 'A · f₃ᵈᴮ = constant' },
      { sym: 'SR', eq: 'dVout/dt max' },
    ],
  },

  vehicles: [
    {
      id: 'ranger',
      year: 2001, make: 'Ford', model: 'Ranger', trim: 'Edge',
      engine: '3.0L V6 Vulcan', drive: 'RWD', trans: '5-spd Manual',
      mileage: 187420, acquired: 'Mar 2023', color: 'Toreador Red',
      status: 'Daily driver',
      reliability: 7.5,
      photoCaption: 'Project shot · Ranger from passenger 3/4',
      summary: 'Bought for cash, 187k miles. The 3.0 Vulcan is forgiving — every job has gone in clean.',
      stats: { spent: 1840, hours: 62, projects: 9 },
      tags: ['daily', 'pickup', 'manual'],
    },
    {
      id: 'civic',
      year: 2019, make: 'Honda', model: 'Civic', trim: 'Sport',
      engine: '2.0L NA i-VTEC', drive: 'FWD', trans: 'CVT',
      mileage: 71200, acquired: 'Aug 2024', color: 'Aegean Blue',
      status: 'Family runaround',
      reliability: 9.0,
      photoCaption: 'Project shot · Civic front 3/4',
      summary: '2.0 NA. Family runaround. Boring on purpose; maintenance is straightforward.',
      stats: { spent: 620, hours: 18, projects: 4 },
      tags: ['daily', 'sedan', 'CVT'],
    },
    {
      id: 'rogue',
      year: 2016, make: 'Nissan', model: 'Rogue', trim: 'SV',
      engine: '2.5L QR25DE', drive: 'AWD', trans: 'CVT (JF017E)',
      mileage: 112900, acquired: 'Jan 2024', color: 'Pearl White',
      status: 'Watching the CVT',
      reliability: 5.5,
      photoCaption: 'Project shot · Rogue side profile',
      summary: 'The JF017E CVT is the catch. Fluid every 30k, monitor temps, never tow. Otherwise competent.',
      stats: { spent: 1820, hours: 62, projects: 5 },
      tags: ['family', 'CVT', 'AWD'],
    },
  ],

  // The DIY project detail page used by every variant.
  projectDetail: {
    id: 'ranger-clutch',
    vehicle: 'ranger',
    title: 'Clutch Master & Slave Replacement',
    date: 'Apr 2025',
    duration: '6.5 hrs',
    difficulty: 3, // 1-5
    cost: 184.62,
    summary: 'Pedal went soft over a week. Bled — no change. Slave was weeping past the boot. Replaced both master and slave; gravity-bled over an afternoon.',
    parts: [
      { name: 'Clutch master cyl (LuK)', pn: 'LMC358', cost: 89.40 },
      { name: 'Clutch slave (LuK)', pn: 'LSC404', cost: 62.20 },
      { name: 'DOT 3 fluid (32 oz)', pn: '—', cost: 8.50 },
      { name: 'Hose clamp + misc', pn: '—', cost: 24.52 },
    ],
    tools: ['10mm flare nut wrench', '13mm socket', '1/4 drive ratchet', 'fluid catch pan', 'turkey baster (reservoir)', 'jack stands ×2'],
    steps: [
      'Suck reservoir empty with the baster. Cap immediately so nothing gets in.',
      'From the cabin, pop the clutch pedal pin (cotter + clip). Pedal will hang loose.',
      'Master cyl is two 13mm bolts on the firewall, then the hydraulic line — 10mm flare nut, do NOT round it.',
      'Under the truck: slave is bolted to the bellhousing, two 13mm. Line is the same flare-nut routine.',
      'New units in reverse order. Bench-bleed the master before installing (this is the part everyone skips).',
      'Refill, gravity-bleed slave with a clear hose into a bottle of fluid. Pump pedal slowly — no fast strokes.',
      'Test in gear, engine off. Then engine on, find the engagement point. Adjust pedal stop if needed.',
    ],
    notes: 'The flare nuts will fight you. Spray PB Blaster the night before. Bench-bleeding the master saved me an hour of cursing.',
    photos: 3,
  },

  // Maintenance & reliability log entries surfaced on the Cars home/garage.
  recent: [
    { date: '2026-04-18', vehicle: 'ranger', kind: 'Repair', label: 'Clutch master + slave', cost: 184.62 },
    { date: '2026-03-02', vehicle: 'rogue',  kind: 'PM',     label: 'CVT fluid swap (30k)', cost: 96.10 },
    { date: '2026-02-14', vehicle: 'civic',  kind: 'PM',     label: 'Oil + filter (5w20)',  cost: 38.40 },
    { date: '2026-01-22', vehicle: 'ranger', kind: 'Mod',    label: 'New brake hardware',   cost: 72.00 },
    { date: '2025-12-08', vehicle: 'rogue',  kind: 'Diag',   label: 'P0420 — cat efficiency (cleared)', cost: 0 },
    { date: '2025-11-30', vehicle: 'civic',  kind: 'PM',     label: 'Tire rotation + balance', cost: 60.00 },
  ],
};

// Helper: find vehicle / topic by id
window.findVehicle = (id) => window.SITE.vehicles.find((v) => v.id === id);
window.findTopic = (id) => {
  for (const cat of window.SITE.engineering) {
    for (const g of cat.groups) {
      for (const t of g.topics) if (t.id === id) return { cat, group: g, topic: t };
    }
  }
  return null;
};

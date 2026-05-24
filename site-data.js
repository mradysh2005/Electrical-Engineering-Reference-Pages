// Shared content tree — Rad.ish
// Palette of data that every page in variant-notebook.jsx reads from.
// All new domains (procedures, projects, lessons) live here so the renderer
// stays purely presentational and adding data means editing one file.

window.SITE = {
  owner: { name: 'Mike Radysh', school: 'NJIT', program: 'B.S. Electrical Engineering', grad: 'Class of 2027' },

  stats: {
    vehicles:    3,
    eeTopics:    13,
    projects:    18,
    totalSpent:  4280,
    hoursLogged: 142,
  },

  // ─── ENGINEERING ────────────────────────────────────────────────────────────
  engineering: [
    {
      id: 'circuits', title: 'Circuits & Electronics', glyph: '⚡',
      blurb: 'Op-amps, oscillators, filters. The analog layer between sensors and MCUs.',
      groups: [
        {
          id: 'amplification', title: 'Amplification',
          blurb: 'Op-amps, comparators, and feedback rules.',
          topics: [
            { id: 'opamps',  title: 'Op-Amps & Comparators',       tag: 'ECE 371' },
            { id: 'schmitt', title: 'Schmitt Triggers & Hysteresis', tag: 'ECE 371' },
          ],
        },
        {
          id: 'timing', title: 'Timing & Oscillation',
          blurb: 'Clocks, tones, and oscillators.',
          topics: [
            { id: '555',  title: '555 Timers',           tag: 'ECE 371' },
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
            { id: 'acdc',     title: 'AC / DC Fundamentals',        tag: 'ECE 342' },
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
            { id: 'riscv-isa',   title: 'Essential Instructions',       tag: 'ECE 395' },
            { id: 'riscv-calls', title: 'Calling Convention & Stack',    tag: 'ECE 395' },
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

  // ─── TOPIC DETAIL (sample) ───────────────────────────────────────────────
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
      { sym: 'GBW',     eq: 'A · f₃ᵈᴮ = constant' },
      { sym: 'SR',      eq: 'dVout/dt max' },
    ],
  },

  // ─── VEHICLES ────────────────────────────────────────────────────────────
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

      procedures: [
        {
          id: 'ranger-oil',
          title: 'Engine Oil & Filter',
          titleAccent: 'Oil',
          category: 'routine',
          interval: { miles: 5000, months: 6 },
          estMinutes: 45,
          difficulty: 1,
          specs: [
            { label: 'Oil capacity',       value: '5.0 qt w/ filter',     highlight: true  },
            { label: 'Oil spec',           value: '5W-30',                highlight: true  },
            { label: 'Drain plug socket',  value: '15mm',                 highlight: true  },
            { label: 'Filter socket',      value: '64mm cap',             highlight: true  },
            { label: 'Drain plug torque',  value: '26 ft-lb',             highlight: true  },
            { label: 'Filter',             value: 'Motorcraft FL-400-S',  highlight: false },
          ],
          parts: [
            { item: 'Motor Oil 5W-30',      sub: '5 qt jug',              partNumber: 'XO-5W30-QSP',  qty: 1, estCost: 28.97 },
            { item: 'Oil Filter',           sub: 'Motorcraft spin-on OEM', partNumber: 'FL-400-S',    qty: 1, estCost:  8.49 },
            { item: 'Drain plug gasket',    sub: 'Copper crush washer',    partNumber: 'W701283-S300', qty: 1, estCost:  1.50 },
          ],
          tools: [
            { size: '15mm',  name: 'Drain plug socket or flare nut wrench' },
            { size: '64mm',  name: 'Oil filter cap socket' },
            { size: '3/8"',  name: 'Drive ratchet + short extension' },
            { size: '—',     name: 'Drain pan (6 qt minimum)' },
            { size: '—',     name: 'Funnel + shop rags' },
          ],
          steps: [
            { text: 'Run engine for **3–5 min** — warm oil drains in half the time of cold oil. Not hot.' },
            { text: 'Place drain pan under the plug. Remove drain plug with **15mm** socket. Full drain takes about 5 min.' },
            { text: 'Remove filter with **64mm** cap socket. Pre-position the pan — the filter holds about 0.5 qt.' },
            { text: 'Thread in new drain plug with a fresh copper gasket. Torque to **26 ft-lb** — firm, not heroic.' },
            { text: 'Pre-fill the new filter about halfway with clean oil, then thread on by hand until the gasket contacts. Final **3/4 turn** with the socket.' },
            { text: 'Fill with **5.0 qt** of 5W-30 via the fill cap. Start engine, idle 30 sec, inspect the filter and drain plug for seepage.' },
            { text: 'Shut off, wait **2 min**, pull the dipstick. Should read full. Top off only if needed — overfilling aerates the oil.' },
          ],
          notes: [
            'The 3.0 Vulcan takes exactly 5.0 qt — no more. Overfilling aerates the oil and causes a blue-smoke startup.',
            'Motorcraft FL-400-S is OEM. A WIX 51515 or FRAM PH3600 is a quality alternative for the same price.',
            'If the drain plug threads feel rough going in, stop and chase the pan threads with a tap before the next oil change.',
          ],
          lessons: [
            { text: 'On the Vulcan, 5.0 qt is the exact spec. Check the dipstick every time — it is easy to accidentally pour from a 6-qt jug.', tags: ['ranger', 'oil', 'Vulcan'] },
          ],
        },
        {
          id: 'ranger-coolant',
          title: 'Coolant Flush & Fill',
          titleAccent: 'Flush',
          category: 'routine',
          interval: { miles: 30000, months: 24 },
          estMinutes: 90,
          difficulty: 2,
          specs: [
            { label: 'System capacity',  value: '11.8 qt total',              highlight: true  },
            { label: 'Coolant type',     value: 'Motorcraft Gold (OAT)',       highlight: true  },
            { label: 'Mix ratio',        value: '50 / 50 coolant / distilled', highlight: true  },
            { label: 'Pressure cap',     value: '16 psi',                     highlight: true  },
            { label: 'Thermostat opens', value: '~192 °F',                    highlight: false },
          ],
          parts: [
            { item: 'Motorcraft Gold Coolant', sub: 'Concentrated, 1 gal',    partNumber: 'VC-7-B', qty: 1, estCost: 22.50 },
            { item: 'Distilled water',          sub: '1 gal jug',              partNumber: '—',      qty: 1, estCost:  1.50 },
            { item: 'Lower hose clamp',         sub: 'Worm drive, 1.5"',       partNumber: '—',      qty: 1, estCost:  2.50 },
          ],
          tools: [
            { size: '—',  name: 'Hose clamp pliers or flat-head' },
            { size: '—',  name: 'Drain bucket (3 gal)' },
            { size: '—',  name: 'Coolant-rated funnel' },
            { size: '—',  name: 'Refractometer or coolant test strips' },
          ],
          steps: [
            { text: '**Cold engine only.** Remove the pressure cap. Never open a hot cooling system — scalding coolant will spray.' },
            { text: 'Loosen the lower radiator hose clamp and drain into a sealed bucket. Coolant is toxic — keep it away from pets and storm drains.' },
            { text: 'Flush the system with **2 gal distilled water**: reconnect hose, fill, run engine to thermostat-open temp (~192 °F), drain again.' },
            { text: 'Mix **50/50** — roughly **5.9 qt coolant + 5.9 qt distilled water** for the Ranger\'s 11.8 qt system.' },
            { text: 'Fill slowly via the radiator neck. Squeeze the upper hose a few times to burp trapped air pockets.' },
            { text: 'Run to operating temp with the heater on **MAX heat** — this opens the heater core circuit and purges air from that loop.' },
            { text: 'After cooldown, top off the overflow tank to the **COLD mark**. Verify freeze protection with a refractometer.' },
          ],
          notes: [
            'The 3.0 Vulcan has no petcock — drain via the lower hose. Mark the hose clamp orientation before removing.',
            'Distilled water only. Tap water introduces minerals that cause electrolytic corrosion in the aluminum block over time.',
            'Dispose of used coolant at an auto-parts store — most accept it free. Never pour it down a drain.',
          ],
          lessons: [
            { text: 'Running the heater on MAX during the final warm-up is the step everyone skips. Skip it and you will get an air pocket in the heater core that takes weeks to clear itself.', tags: ['ranger', 'cooling', 'flush'] },
          ],
        },
        {
          id: 'ranger-brakes-front',
          title: 'Front Brake Pads & Rotors',
          titleAccent: 'Rotors',
          category: 'repair',
          interval: { miles: 40000 },
          estMinutes: 120,
          difficulty: 3,
          specs: [
            { label: 'Lug nut torque',   value: '100 ft-lb',            highlight: true  },
            { label: 'Caliper bolts',    value: '25 ft-lb (13mm)',       highlight: true  },
            { label: 'Bracket bolts',    value: '85 ft-lb (15mm)',       highlight: true  },
            { label: 'Brake fluid',      value: 'DOT 3',                highlight: true  },
            { label: 'Piston retract',   value: 'Straight push (no rotation)', highlight: false },
            { label: 'Rotor part',       value: 'Raybestos 76479R',     highlight: false },
          ],
          parts: [
            { item: 'Front rotors',       sub: 'Raybestos Advanced Technology, pair', partNumber: '76479R',   qty: 2, estCost: 58.00 },
            { item: 'Front brake pads',   sub: 'Akebono ceramic, axle set',           partNumber: 'ACT787A',  qty: 1, estCost: 46.00 },
            { item: 'DOT 3 brake fluid',  sub: '12 oz',                               partNumber: '—',        qty: 1, estCost:  8.50 },
            { item: 'Brake hardware kit', sub: 'Clips, shims, abutment hardware',     partNumber: '—',        qty: 1, estCost: 12.00 },
          ],
          tools: [
            { size: '19mm',  name: 'Lug nut socket' },
            { size: '15mm',  name: 'Caliper bracket bolts' },
            { size: '13mm',  name: 'Caliper slide bolt socket' },
            { size: '—',     name: 'C-clamp or piston press' },
            { size: '—',     name: 'Wire brush (hub face cleaning)' },
            { size: '—',     name: 'Torque wrench + jack stands' },
          ],
          steps: [
            { text: 'Break lug nuts loose **before** jacking. Loosen only — do not remove yet.' },
            { text: 'Jack up and support on stands. Remove wheel. **Never** work under a car supported only by a jack.' },
            { text: 'Remove the two **13mm** caliper slide bolts. Hang the caliper from the spring with a wire hook — never let it dangle by the brake hose.' },
            { text: 'Remove the caliper bracket (**15mm**, **2 bolts**). The rotor slides off once the bracket is gone.' },
            { text: 'Wire-brush the hub face until bare metal — this is what prevents rotor runout over time.' },
            { text: 'Before pressing the piston, crack the **bleeder screw** slightly so fluid goes back into the reservoir, not into the ABS module. Use a C-clamp against the old inner pad.' },
            { text: 'Install fresh hardware, lube slide pins and contact points with caliper grease. **No grease on pad faces or rotor friction surface.**' },
            { text: 'Torque bracket bolts to **85 ft-lb**, caliper bolts to **25 ft-lb**, lug nuts to **100 ft-lb** in a star pattern.' },
            { text: '**Bed the brakes**: 10 moderate stops from 30 mph down to 5 mph with 30-sec cool-down between. Then drive normally for 200 miles.' },
          ],
          notes: [
            'The Ranger front caliper pistons push straight in with a C-clamp — no rotation needed.',
            'Bedding the brakes after every pad change is non-negotiable. Skipping it causes uneven pad material deposits and vibration.',
            'Check the fluid reservoir level before pressing the piston back. If it is full, remove some first — pushing back the piston will overflow the master cylinder.',
          ],
          lessons: [
            { text: 'Cracking the bleeder screw before pressing the caliper piston back is the pro move. It prevents dirty, aerated fluid from getting pushed back into the ABS modulator.', tags: ['ranger', 'brakes', 'hydraulics'] },
          ],
        },
      ],
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

      procedures: [
        {
          id: 'civic-oil',
          title: 'Engine Oil & Filter',
          titleAccent: 'Oil',
          category: 'routine',
          interval: { miles: 5000, months: 6 },
          estMinutes: 40,
          difficulty: 1,
          specs: [
            { label: 'Oil capacity',       value: '3.7 qt w/ filter',     highlight: true  },
            { label: 'Oil spec',           value: '0W-20 full synthetic',  highlight: true  },
            { label: 'Drain plug socket',  value: '17mm',                 highlight: true  },
            { label: 'Drain plug torque',  value: '29 ft-lb',             highlight: true  },
            { label: 'Filter',             value: 'Honda 15400-PLM-A02',  highlight: false },
            { label: 'Filter socket',      value: '65mm cap',             highlight: true  },
          ],
          parts: [
            { item: 'Motor Oil 0W-20',   sub: 'Full synthetic, 4 qt', partNumber: 'SN-0W20-FS', qty: 1, estCost: 26.99 },
            { item: 'Oil Filter',        sub: 'Honda OEM',            partNumber: '15400-PLM-A02', qty: 1, estCost: 7.99 },
            { item: 'Drain plug washer', sub: 'Honda aluminum crush',  partNumber: '90009-PX4-000', qty: 1, estCost: 1.25 },
          ],
          tools: [
            { size: '17mm',  name: 'Drain plug socket' },
            { size: '65mm',  name: 'Oil filter cap socket' },
            { size: '3/8"',  name: 'Drive ratchet + extension' },
            { size: '—',     name: 'Drain pan (4 qt minimum)' },
            { size: '—',     name: 'Funnel' },
          ],
          steps: [
            { text: 'Warm engine **3 min**. Turn off. Access drain plug under the car on the driver\'s side of the oil pan.' },
            { text: 'Remove drain plug with **17mm** socket. Drain fully (~4 min). The 2.0 only holds 3.7 qt, so the drain is quick.' },
            { text: 'Remove filter with **65mm** cap socket. The filter is on the driver-side front of the engine, easy reach from above.' },
            { text: 'New drain plug washer every time — it\'s aluminum and deforms on first use. Torque plug to **29 ft-lb**.' },
            { text: 'Install new filter hand-tight, then **3/4 turn** with the cap socket.' },
            { text: 'Fill with **3.7 qt** of 0W-20. Honda specifies full synthetic only.' },
            { text: 'Start, check for leaks, wait **2 min**, confirm dipstick reads full.' },
          ],
          notes: [
            '0W-20 full synthetic is mandatory on the i-VTEC — the VTEC solenoid is oil-pressure sensitive and heavier oils can cause fault codes.',
            'Replace the aluminum drain plug washer every change. Honda includes one with OEM filters.',
          ],
          lessons: [
            { text: '0W-20 is not optional on the i-VTEC. Using 5W-30 will cause a VTEC oil pressure fault at cold startup.', tags: ['civic', 'oil', 'VTEC'] },
          ],
        },
        {
          id: 'civic-air',
          title: 'Engine Air Filter',
          titleAccent: 'Air',
          category: 'routine',
          interval: { miles: 15000, months: 12 },
          estMinutes: 10,
          difficulty: 1,
          specs: [
            { label: 'Filter part',    value: 'Honda 17220-5BA-A00',  highlight: true  },
            { label: 'Aftermarket',    value: 'K&N 33-5082 (OPT)',    highlight: false },
            { label: 'Housing bolts',  value: '10mm (×2)',            highlight: false },
            { label: 'Tools needed',   value: 'Flathead or by hand',  highlight: false },
          ],
          parts: [
            { item: 'Engine Air Filter', sub: 'Honda OEM panel filter', partNumber: '17220-5BA-A00', qty: 1, estCost: 18.99 },
          ],
          tools: [
            { size: '—',  name: 'Flathead screwdriver (airbox clips)' },
            { size: '—',  name: 'Shop rags (clean housing interior)' },
          ],
          steps: [
            { text: 'Pop the two spring clips on the airbox lid and lift the lid off. No tools needed.' },
            { text: 'Lift out the old filter. Note which side faces up — the pleats should face the air inlet.' },
            { text: 'Wipe the airbox interior with a clean rag. No debris should enter the MAF side.' },
            { text: 'Drop in the new filter with the pleats facing up, matching the old orientation.' },
            { text: 'Clip the lid closed. Two clips — you will hear them seat.' },
          ],
          notes: [
            'A 10-minute job. No torque specs, no fluids. Inspect the MAF sensor while the box is open — any oily film means the PCV is over-venting.',
          ],
          lessons: [
            { text: 'While the airbox is open, look at the MAF sensor. An oily film on the wire is the first sign of PCV system problems on the 2.0 i-VTEC.', tags: ['civic', 'air filter', 'MAF', 'PCV'] },
          ],
        },
      ],
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

      procedures: [
        {
          id: 'rogue-cvt',
          title: 'CVT Fluid Exchange',
          titleAccent: 'Fluid',
          category: 'routine',
          interval: { miles: 30000 },
          estMinutes: 75,
          difficulty: 2,
          specs: [
            { label: 'Fluid spec',         value: 'Nissan NS-3 CVT Fluid',    highlight: true  },
            { label: 'Drain capacity',      value: '~4.0 qt per exchange',     highlight: true  },
            { label: 'Drain plug torque',   value: '25 ft-lb',                 highlight: true  },
            { label: 'Drain plug socket',   value: '5mm hex (Allen)',           highlight: true  },
            { label: 'Fluid temp at drain', value: 'Under 100 °F (cool)',       highlight: false },
            { label: 'Dipstick range',      value: 'HOT: between marks at 170–180 °F', highlight: false },
          ],
          parts: [
            { item: 'Nissan NS-3 CVT Fluid', sub: '1 qt bottles', partNumber: '999MP-NS300P', qty: 5, estCost: 11.99 },
            { item: 'CVT drain plug washer',  sub: 'Aluminum crush',  partNumber: '11026-01M02', qty: 1, estCost:  2.50 },
          ],
          tools: [
            { size: '5mm',   name: 'Hex (Allen) socket for drain plug' },
            { size: '—',     name: 'Drain pan (5 qt minimum)' },
            { size: '—',     name: 'Fluid transfer pump (fill via dipstick tube)' },
            { size: '—',     name: 'IR thermometer (verify fluid temp for dipstick check)' },
          ],
          steps: [
            { text: 'Use a **fluid pump to extract from the dipstick tube first** — pull out as much as possible before dropping the drain. This exchanges ~30% more fluid than a drain-only.' },
            { text: 'Locate the **5mm hex** drain plug on the CVT pan. It is aluminum-threaded — no breaker bars, torque wrench only.' },
            { text: 'Drain fully into the pan. Install a new aluminum crush washer and torque to **25 ft-lb** exactly.' },
            { text: 'Pump fresh **NS-3 fluid** back in via the dipstick tube — add approximately **4.0 qt** to match what drained.' },
            { text: 'Run through all selector positions (P-R-N-D-L) for **30 sec each**, then drive ~5 min to reach operating temp.' },
            { text: 'With the CVT fluid at **170–180 °F** (use IR thermometer at the pan), check the dipstick. Fluid should be between the HOT marks.' },
            { text: 'Top off as needed. Recheck after a short drive. Do not overfill — excess pressure stresses seals.' },
          ],
          notes: [
            'NS-3 fluid only. Aftermarket CVT fluids may cause shudder and slip on the JF017E. Nissan formulated NS-3 specifically for this unit.',
            'The drain plug threads are aluminum on an aluminum pan — 25 ft-lb is a hard limit. Over-torquing strips the pan and means a new CVT.',
            'Never tow with this CVT. Never drive in D with the engine lugging below 1200 rpm on a hill. Heat is what kills JF017E units.',
          ],
          lessons: [
            { text: 'The JF017E drain plug is aluminum threading into an aluminum pan. 25 ft-lb max — torque wrench only, no "feel it". Stripped pan threads mean a new CVT or a tap/helicoil job.', tags: ['rogue', 'CVT', 'fluid', 'torque'] },
            { text: 'Extracting from the dipstick tube before dropping the drain plug exchanges roughly 30% more fluid. Do both, every time.', tags: ['rogue', 'CVT', 'fluid'] },
          ],
        },
        {
          id: 'rogue-oil',
          title: 'Engine Oil & Filter',
          titleAccent: 'Oil',
          category: 'routine',
          interval: { miles: 5000, months: 6 },
          estMinutes: 45,
          difficulty: 1,
          specs: [
            { label: 'Oil capacity',       value: '4.9 qt w/ filter',     highlight: true  },
            { label: 'Oil spec',           value: '5W-30 full synthetic',  highlight: true  },
            { label: 'Drain plug socket',  value: '14mm',                 highlight: true  },
            { label: 'Drain plug torque',  value: '25 ft-lb',             highlight: true  },
            { label: 'Filter',             value: 'Nissan 15208-65F0E',   highlight: false },
          ],
          parts: [
            { item: 'Motor Oil 5W-30',   sub: 'Full synthetic, 5 qt', partNumber: 'SN-5W30-FS',   qty: 1, estCost: 29.99 },
            { item: 'Oil Filter',        sub: 'Nissan OEM canister',   partNumber: '15208-65F0E',  qty: 1, estCost:  9.49 },
            { item: 'Drain plug washer', sub: 'Nissan aluminum crush',  partNumber: '11026-JA00B', qty: 1, estCost:  1.75 },
          ],
          tools: [
            { size: '14mm',  name: 'Drain plug socket' },
            { size: '65mm',  name: 'Oil filter socket (canister type)' },
            { size: '3/8"',  name: 'Drive ratchet' },
            { size: '—',     name: 'Drain pan (5 qt)' },
          ],
          steps: [
            { text: 'Warm engine **3–5 min**. The QR25DE oil drain plug is accessible from below on the driver\'s side.' },
            { text: 'Remove drain plug with **14mm** socket. Drain fully.' },
            { text: 'The oil filter is a canister (cartridge) type, not a spin-on. Remove with **65mm** socket — it will drip significantly.' },
            { text: 'New drain plug washer. Torque plug to **25 ft-lb**.' },
            { text: 'Install new cartridge filter element in the housing. Torque housing to **18 ft-lb** — check the spec sheet inside the filter box.' },
            { text: 'Fill with **4.9 qt** of 5W-30. Start and check for leaks at the drain plug and filter housing.' },
            { text: 'Dipstick check after 2-min idle. The QR25DE is prone to consuming a bit — check level every 1k miles between changes.' },
          ],
          notes: [
            'The QR25DE can consume up to 0.5 qt per 1k miles when worn. Check the dipstick at every fuel stop if you are watching for consumption.',
            'The cartridge filter housing has an O-ring that must seat correctly. If the housing feels like it cross-threaded, back out and re-seat the element before trying again.',
          ],
          lessons: [
            { text: 'QR25DE cartridge filter housings are plastic and easy to cross-thread. Never tighten past 18 ft-lb. Always hand-thread first and feel for resistance.', tags: ['rogue', 'oil', 'QR25DE'] },
          ],
        },
      ],
    },
  ],

  // ─── PROJECT DETAIL (garage repair — referenced from service log) ─────────
  projectDetail: {
    id: 'ranger-clutch',
    vehicle: 'ranger',
    title: 'Clutch Master & Slave Replacement',
    date: 'Apr 2025',
    duration: '6.5 hrs',
    difficulty: 3,
    cost: 184.62,
    summary: 'Pedal went soft over a week. Bled — no change. Slave was weeping past the boot. Replaced both master and slave; gravity-bled over an afternoon.',
    parts: [
      { name: 'Clutch master cyl (LuK)', pn: 'LMC358',  cost: 89.40 },
      { name: 'Clutch slave (LuK)',      pn: 'LSC404',  cost: 62.20 },
      { name: 'DOT 3 fluid (32 oz)',     pn: '—',       cost:  8.50 },
      { name: 'Hose clamp + misc',       pn: '—',       cost: 24.52 },
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

  // ─── SERVICE LOG ─────────────────────────────────────────────────────────
  recent: [
    { date: '2026-04-18', vehicle: 'ranger', kind: 'Repair', label: 'Clutch master + slave',          cost: 184.62, procedureId: null,                 projectId: 'ranger-clutch' },
    { date: '2026-03-02', vehicle: 'rogue',  kind: 'PM',     label: 'CVT fluid exchange (30k)',        cost:  96.10, procedureId: 'rogue-cvt',            projectId: null },
    { date: '2026-02-14', vehicle: 'civic',  kind: 'PM',     label: 'Engine oil & filter (0W-20)',     cost:  38.23, procedureId: 'civic-oil',            projectId: null },
    { date: '2026-01-22', vehicle: 'ranger', kind: 'Mod',    label: 'Front brake pads & rotors',       cost:  124.50, procedureId: 'ranger-brakes-front', projectId: null },
    { date: '2025-12-08', vehicle: 'rogue',  kind: 'Diag',   label: 'P0420 — cat efficiency (cleared)',cost:   0,    procedureId: null,                  projectId: null },
    { date: '2025-11-30', vehicle: 'civic',  kind: 'PM',     label: 'Tire rotation + balance',         cost:  60.00, procedureId: null,                  projectId: null },
    { date: '2025-11-15', vehicle: 'ranger', kind: 'PM',     label: 'Engine oil & filter (5W-30)',      cost:  38.46, procedureId: 'ranger-oil',           projectId: null },
  ],

  // ─── ENGINEERING PROJECTS ─────────────────────────────────────────────────
  projects: [
    {
      id: 'buck-converter',
      title: '12V → 5V Buck Converter',
      titleAccent: '5V',
      area: 'engineering',
      status: 'complete',
      date: 'Oct 2025',
      cost: 34.50,
      hours: 8,
      summary: 'Designed and built a synchronous buck converter for 12V-to-5V regulation at up to 1A. Went from schematic to working PCB in one semester sprint. Output ripple < 50mV at full load.',
      tags: ['ECE 371', 'analog', 'power', 'PCB'],
      relatedTopics: ['opamps', 'filters'],
      vehicleId: null,
      journal: [
        { date: 'Oct 5',  note: 'Breadboarded the control loop using the LM3524 PWM controller IC. Initial duty-cycle calculation: D = Vout/Vin = 5/12 ≈ 41.7%.' },
        { date: 'Oct 12', note: 'First breadboard working but noisy. Added a 10µF output cap and the ripple dropped from ~400mV to ~120mV at 500mA.' },
        { date: 'Oct 18', note: 'PCB ordered from JLCPCB. First spin had a trace error on the feedback resistor divider — connected to the wrong output node.' },
        { date: 'Oct 25', note: 'Corrected PCB works cleanly. Output ripple < 50mV at 1A. Efficiency ~86%, close to LM3524 theoretical max for this topology.' },
      ],
      parts: [
        { item: 'LM3524 PWM Controller',  partNumber: 'LM3524N',       qty: 2, estCost:  4.50 },
        { item: 'Schottky Diode 40V/3A',  partNumber: 'SR340',         qty: 2, estCost:  2.00 },
        { item: 'Inductor 68µH',          partNumber: 'SRR1260-680Y',  qty: 1, estCost:  3.80 },
        { item: 'Capacitor assortment',   partNumber: '—',             qty: 1, estCost:  4.00 },
        { item: 'Resistor assortment',    partNumber: '—',             qty: 1, estCost:  2.00 },
        { item: 'PCB, 2 spins (JLCPCB)', partNumber: '—',             qty: 1, estCost: 16.20 },
        { item: 'Misc headers + pins',    partNumber: '—',             qty: 1, estCost:  2.00 },
      ],
      lessons: [
        { text: 'The op-amp virtual short only holds in the linear region. When I first wired the feedback divider to the wrong node, the controller latched full-on. Traced the fault by watching the switch node with a scope.', tags: ['op-amp', 'feedback', 'ECE 371', 'analog'] },
        { text: 'DRC on the first PCB spin would have caught the feedback trace error. Costs nothing to run and saves $8 + a week of wait time.', tags: ['PCB', 'DRC', 'design'] },
      ],
    },
    {
      id: 'gpio-controller',
      title: 'RISC-V Bare-Metal GPIO Blinker',
      titleAccent: 'GPIO',
      area: 'engineering',
      status: 'complete',
      date: 'Nov 2025',
      cost: 12.00,
      hours: 6,
      summary: 'Bare-metal RISC-V assembly on the SiFive FE310 to drive GPIO and toggle an LED matrix at 1 Hz using the CLINT timer — no libraries, no OS.',
      tags: ['ECE 395', 'RISC-V', 'embedded', 'assembly'],
      relatedTopics: ['gpio', 'riscv-isa', 'riscv-calls'],
      vehicleId: null,
      journal: [
        { date: 'Nov 3',  note: 'Dev env set up. GPIO control register at base 0x10012000. IOF_EN must be cleared to take GPIO away from the peripheral mux.' },
        { date: 'Nov 10', note: 'First toggle loop written. Calling convention bug — ra was getting clobbered inside the delay subroutine. Fixed by pushing ra to the stack on entry.' },
        { date: 'Nov 17', note: 'Added CLINT-based delay calibrated to 500ms. LED blinks reliably at 1 Hz. Matrix row/col addressing working on 2×3 array.' },
      ],
      parts: [
        { item: 'HiFive1 Rev B dev board', partNumber: 'DEV-15702', qty: 1, estCost:  0.00 },
        { item: 'LED assortment',          partNumber: '—',         qty: 1, estCost:  3.00 },
        { item: 'Resistors + breadboard',  partNumber: '—',         qty: 1, estCost:  9.00 },
      ],
      lessons: [
        { text: 'RISC-V calling convention: ra, a0–a7, t0–t6 are caller-saved. If you call any subroutine without saving ra first, you will corrupt your return address. Push ra before every call.', tags: ['RISC-V', 'assembly', 'calling convention', 'ECE 395'] },
        { text: 'Memory-mapped GPIO on the FE310: clearing IOF_EN is the step the datasheet buries. Without it, the GPIO pins belong to the peripheral and your bit-banging does nothing.', tags: ['RISC-V', 'GPIO', 'embedded', 'ECE 395'] },
      ],
    },
    {
      id: 'garage-interlock',
      title: 'Garage CO Interlock',
      titleAccent: 'Interlock',
      area: 'cross',
      status: 'active',
      date: 'Mar 2026',
      cost: 48.00,
      hours: 12,
      summary: 'ESP32-based safety interlock that prevents the garage door from closing if CO is above 35 ppm — uses an MQ-7 sensor feeding an analog comparator circuit wired to a relay that interrupts the opener.',
      tags: ['ESP32', 'safety', 'analog', 'IoT'],
      relatedTopics: ['opamps'],
      vehicleId: 'ranger',
      journal: [
        { date: 'Mar 10', note: 'Spec\'d the MQ-7 CO sensor. Output is analog 0–5V. Needs ADC input on the ESP32 plus a comparator stage to set the 35 ppm trip threshold.' },
        { date: 'Mar 18', note: 'Breadboarded ESP32 + MQ-7. Background CO at idle with the Ranger running in the open garage: ~18–22 ppm. Closed garage climbs to 80+ ppm in under 3 min.' },
        { date: 'Mar 25', note: 'Adding 5V relay module to interrupt the opener\'s wall-button circuit. Wiring in NC (normally-closed) position — relay opens the circuit when CO trips.' },
      ],
      parts: [
        { item: 'ESP32-WROOM-32 dev board', partNumber: 'ESP32-DEVKITC-32E', qty: 1, estCost: 12.00 },
        { item: 'MQ-7 CO sensor module',    partNumber: 'MQ-7',              qty: 2, estCost:  8.00 },
        { item: '5V relay module',          partNumber: 'SRD-05VDC-SL-C',   qty: 1, estCost:  6.00 },
        { item: 'PCB, connectors, enclosure', partNumber: '—',              qty: 1, estCost: 22.00 },
      ],
      lessons: [
        { text: 'The MQ-7 requires a 60-second warmup before readings stabilize. Hard-code a boot delay in the firmware — do not skip it or early trips will be false positives.', tags: ['ESP32', 'MQ-7', 'CO', 'sensor', 'firmware'] },
        { text: 'Wiring the relay in NC position means a firmware crash or power loss fails safe — the door cannot be closed, which is the right default.', tags: ['relay', 'safety', 'fail-safe'] },
      ],
    },
  ],

  // ─── LESSONS (aggregated from procedures and projects) ───────────────────
  // The Lessons page also reads lessons[] embedded inside each procedure and project.
  // This top-level array is for freestanding lessons not tied to a specific job.
  lessons: [
    {
      id: 'standalone-01',
      text: 'Bench-bleeding a clutch or brake master cylinder before installation saves 30–60 min of pedal pumping at the end. The time investment is about 5 min. Never skip it.',
      tags: ['hydraulics', 'clutch', 'brakes', 'ranger'],
      date: '2025-04-18',
      source: 'log',
      sourceLabel: 'Ranger Clutch Master + Slave',
    },
    {
      id: 'standalone-02',
      text: 'Flare nut wrenches are not optional on hydraulic line fittings. A standard open-end will round the soft brass in one attempt. Buy the set once.',
      tags: ['tools', 'hydraulics', 'ranger'],
      date: '2025-04-18',
      source: 'log',
      sourceLabel: 'Ranger Clutch Master + Slave',
    },
    {
      id: 'standalone-03',
      text: 'Before any brake job, note the brake fluid level in the reservoir. Pressing the caliper piston back pushes fluid up — if the reservoir is full, it overflows onto painted surfaces.',
      tags: ['brakes', 'hydraulics', 'ranger', 'civic'],
      date: '2026-01-22',
      source: 'log',
      sourceLabel: 'Ranger Front Brakes',
    },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
window.findVehicle    = (id) => window.SITE.vehicles.find(v => v.id === id);

window.findProcedure  = (vehicleId, procId) => {
  const v = window.findVehicle(vehicleId);
  return v?.procedures?.find(p => p.id === procId) || null;
};

window.findTopic = (id) => {
  for (const cat of window.SITE.engineering) {
    for (const g of cat.groups) {
      for (const t of g.topics) if (t.id === id) return { cat, group: g, topic: t };
    }
  }
  return null;
};

window.findProject = (id) => window.SITE.projects.find(p => p.id === id) || null;

// All lessons across procedures, projects, and standalone entries.
window.allLessons = () => {
  const out = [];
  // Standalone
  for (const l of window.SITE.lessons) out.push({ ...l });
  // From vehicles → procedures
  for (const v of window.SITE.vehicles) {
    for (const proc of (v.procedures || [])) {
      for (const l of (proc.lessons || [])) {
        out.push({ ...l, source: 'procedure', sourceLabel: `${v.year} ${v.model} · ${proc.title}`, vehicleId: v.id, procedureId: proc.id });
      }
    }
  }
  // From projects
  for (const proj of (window.SITE.projects || [])) {
    for (const l of (proj.lessons || [])) {
      out.push({ ...l, source: 'project', sourceLabel: proj.title, projectId: proj.id });
    }
  }
  return out;
};

// ============================================================
// Языковые пакеты генератора: английский и чешский.
// Русский — базовый язык, живёт в generator.js/lureTypes.js.
// Каждый пакет: данные по типам приманок + хуки/тела/CTA по формулам.
// ============================================================

export const LANGS = [
  { id: 'ru', name: 'Русский', short: 'RU' },
  { id: 'en', name: 'English', short: 'EN' },
  { id: 'cs', name: 'Čeština', short: 'CS' },
]

// ---------- ENGLISH ----------
const EN_TYPES = {
  wobbler: {
    lname: 'crankbait', fish: ['pike', 'perch', 'zander'],
    seasons: ['in open water', 'in spring on the shallows', 'in autumn over deep holes'],
    benefits: [
      'a wounded-baitfish action no predator can resist',
      'precise diving depth — you fish exactly the layer where the predator holds',
      'a loud rattle chamber that calls fish in from a distance',
    ],
    pains: ['the predator follows to the boat and turns away', 'half a day of changing lures without a single strike'],
    proofs: ['Seven pike in one morning on this very model — last trip’s report.', 'A trophy-pike guide keeps this model in his starter box.'],
    lexicon: ['twitching', 'a suspending pause', 'a jerk retrieve'],
  },
  spinner: {
    lname: 'spinner', fish: ['perch', 'pike', 'trout'],
    seasons: ['all summer long', 'in clear water', 'on small rivers'],
    benefits: [
      'starts spinning from the very first inch of the retrieve',
      'the blade’s vibration hits the predator’s lateral line like a dinner bell',
      'simple as a hammer: cast and reel — perfect for beginners and pros alike',
    ],
    pains: ['the blade sticks and the lure runs “empty”', 'small fish nibble while the real ones stay away'],
    proofs: ['A classic that outfishes tackle boxes worth hundreds.', '30 perch in an evening is a routine result on an active school.'],
    lexicon: ['a steady retrieve', 'spot coverage', 'a stop-and-go'],
  },
  spoon: {
    lname: 'spoon', fish: ['pike', 'zander', 'asp'],
    seasons: ['in cold autumn water', 'on strong current', 'on trophy spots'],
    benefits: [
      'long casts — you reach the boil and the drop-off nobody else can hit',
      'a wide rolling action that imitates a big baitfish for a true trophy',
      'holds the current without losing its action',
    ],
    pains: ['the boil is always just out of casting range', 'trophies ignore small lures'],
    proofs: ['The old-school classic that still takes double-digit pike.', 'A subscriber’s personal record — a 9.4 kg pike on this very spoon.'],
    lexicon: ['a long cast', 'the drop-off', 'a slow roll'],
  },
  soft: {
    lname: 'soft plastic', fish: ['zander', 'pike', 'perch'],
    seasons: ['all year round', 'in cold water', 'on a drop shot through the ice'],
    benefits: [
      'scented plastic — fish hold on instead of spitting it out',
      'a lively tail action even on the slowest retrieve',
      'costs pennies — no fear of fishing snags and rocks',
    ],
    pains: ['bites galore but no hook-ups', 'you’re afraid to cast into timber because lures are expensive'],
    proofs: ['Zander anglers switched to scented softs — the hook-up ratio doubled.', 'The top 10 of jig tournaments fish soft plastics.'],
    lexicon: ['a jig rig', 'a stepped retrieve', 'an offset hook'],
  },
  jig: {
    lname: 'jig head', fish: ['zander', 'pike', 'catfish'],
    seasons: ['in autumn over deep holes', 'over depth', 'on channel edges'],
    benefits: [
      'tap the bottom and find fish where nobody looks for them',
      'full control of the retrieve in any wind and current',
      'a razor-sharp hook that drives through a zander’s bony mouth',
    ],
    pains: ['fish hold deep and nothing reaches them', 'you can’t feel the bottom and fish “blind”'],
    proofs: ['Jigging is discipline #1 in European predator fishing — for a reason.', 'A 40+ kg catfish taken on a heavy jig head — photos in the reports.'],
    lexicon: ['a lift-and-drop', 'bottom contact', 'the channel edge'],
  },
  popper: {
    lname: 'popper', fish: ['pike', 'perch', 'asp'],
    seasons: ['on summer dawns', 'over weed and lily pads', 'in the heat'],
    benefits: [
      'explosive surface strikes — the most spectacular fishing of your life',
      'walks over weed where sinking lures collect salad',
      'you see every strike with your own eyes — adrenaline guaranteed',
    ],
    pains: ['all the fish sit in weed no lure can pass through', 'in summer heat predators ignore deep-running lures'],
    proofs: ['A pike-on-popper strike video hit 2M views — it works.', 'A perch boil plus a popper equals a strike on every cast.'],
    lexicon: ['a pop-and-pause', 'a dawn session', 'topwater walking'],
  },
  balancer: {
    lname: 'jigging minnow', fish: ['perch', 'zander', 'pike'],
    seasons: ['through the ice', 'on first ice', 'in midwinter'],
    benefits: [
      'a wide figure-eight under the hole calls perch in from dozens of metres',
      'finds active and passive fish alike — it’s all about the pause',
      'five lifts tell you whether there’s fish under the hole',
    ],
    pains: ['tiny jigs attract only dinks', 'half a day of drilling holes for nothing'],
    proofs: ['On first ice a jigging minnow is lure #1 — any ice angler will confirm.', 'A hundred perch through the ice in a day — a real report with this model.'],
    lexicon: ['the pause', 'a lift-drop cycle', 'first ice'],
  },
  spinnerbait: {
    lname: 'spinnerbait', fish: ['pike', 'bass', 'perch'],
    seasons: ['over weed', 'in timber', 'in murky water'],
    benefits: [
      'weedless: slips through grass and timber where all the pike hold',
      'a double trigger — blade vibration plus the bulk of the skirt',
      'one lure instead of ten broken off',
    ],
    pains: ['the fishiest spots are the deadliest for snags', 'after rain the water is murky and fish can’t see a lure'],
    proofs: ['An American bass classic that transferred perfectly to pike.', 'Zero break-offs in a whole season of timber fishing.'],
    lexicon: ['cover', 'the skirt', 'a slow roll through weed'],
  },
}

const EN = {
  quotes: ['“', '”'],
  types: EN_TYPES,
  hooks: {
    aida: [
      (c) => `Does the predator follow and turn away? This ${c.lname} settles the question.`,
      (c) => `Stop scrolling if you fish for ${c.fish}.`,
    ],
    pas: [
      () => `Sound familiar: a whole day on the water without a single strike?`,
      () => `Let me be blunt: it’s not you. It’s the lure.`,
    ],
    story: [
      (c) => `Saturday, 4:50 AM. Fog over the water, first cast ${c.season}.`,
      (c) => `I ignored this ${c.lname} for three years. Then I watched my boat neighbour catch on it.`,
    ],
    expert: [
      (c) => `Review: the ${c.lname} “${c.title}” — who it’s for, when and why.`,
      (c) => `No-fluff breakdown: what the ${c.lname} “${c.title}” can really do.`,
    ],
    fomo: [
      (c) => `The last batch of “${c.title}” is in stock — here’s why it sells out.`,
      () => `While competitors raised prices, we held our stock. Not for long.`,
    ],
  },
  bodies: {
    aida: (c, h) => [
      `The ${c.lname} “${c.title}” is built for one job — ${c.fish} ${c.season}.`,
      `What’s inside:\n${h.check()}${h.cap(c.benefit)}\n${h.check()}${h.cap(c.benefit2)}`,
      c.proof,
    ],
    pas: (c, h) => [
      `${h.cap(c.pain)}. You check the knots, change the retrieve — but the lure just isn’t sending the “attack” signal.`,
      `The ${c.lname} “${c.title}” fixes that: ${c.benefit}. Plus ${c.benefit2}.`,
      c.proof,
    ],
    story: (c, h) => [
      `I tie on the ${c.lname} “${c.title}”, work it through ${c.lex} — and on the second cast the strike makes the drag sing.`,
      `By breakfast — ${h.n} fish. The secret is simple: ${c.benefit}.`,
      c.proof,
    ],
    expert: (c, h) => [
      `Target fish: ${c.fish}.\nConditions: ${c.season}.\nKey feature: ${c.benefit}.`,
      `The working technique — ${c.lex}: ${c.benefit2}.`,
      `Verdict: if “${c.pain}” sounds like your trips, “${c.title}” solves it.`,
    ],
    fomo: (c) => [
      `The reason is simple: ${c.benefit}. Those who tried it come back for a second and a third.`,
      c.proof,
    ],
  },
  ctas: [
    (c) => `Get “${c.title}” on our website:\n${c.url}`,
    (c) => `Full review, colours and price:\n${c.url}`,
    (c) => `Check if your colour is still in stock:\n${c.url}`,
  ],
  urgency: [
    'Limited batch — the hottest colours go first.',
    'Fewer than 30 left in stock — the next delivery is a month away.',
    'The season is on: every day without the right lure is a lost trip.',
  ],
  hashtags: ['#fishing', '#lures', '#pikefishing', '#catchoftheday', '#anglerlife'],
}

// ---------- ČEŠTINA ----------
const CS_TYPES = {
  wobbler: {
    lname: 'wobler', fish: ['štiku', 'okouna', 'candáta'],
    seasons: ['na volné vodě', 'na jaře na mělčinách', 'na podzim v hlubinách'],
    benefits: [
      'hra zraněné rybky, které dravec neodolá',
      'přesné zanoření — lovíte přesně v hloubce, kde dravec stojí',
      'hlasitá chrastící komora svolá ryby z dálky',
    ],
    pains: ['dravec doprovodí nástrahu až k lodi a otočí se', 'půl dne střídáte nástrahy a záběr nikde'],
    proofs: ['Sedm štik za jedno ráno na stejný model — zpráva z poslední výpravy.', 'Průvodce na trofejní štiky má tento model v základní krabičce.'],
    lexicon: ['twitching', 'pauzu', 'trhané vedení'],
  },
  spinner: {
    lname: 'rotačka', fish: ['okouna', 'štiku', 'pstruha'],
    seasons: ['celé léto', 'v čisté vodě', 'na malých řekách'],
    benefits: [
      'roztočí se od prvního centimetru vedení',
      'vibrace plátku bijí do postranní čáry dravce jako signál „jídlo“',
      'jednoduchá jako kladivo: nahodit a točit — pro začátečníka i závodníka',
    ],
    pains: ['plátek se zasekává a nástraha jede „naprázdno“', 'drobotina otravuje, pořádná ryba nejde'],
    proofs: ['Klasika, která obloví krabice za tisíce.', '30 okounů za večer je běžný výsledek na aktivním hejnu.'],
    lexicon: ['rovnoměrné vedení', 'obhoz místa', 'stop-and-go'],
  },
  spoon: {
    lname: 'plandavka', fish: ['štiku', 'candáta', 'bolena'],
    seasons: ['na podzim ve studené vodě', 'v proudu', 'na trofejních místech'],
    benefits: [
      'daleké hody — dosáhnete na kotel i na hranu, kam nikdo nedohodí',
      'široká kolébavá hra — imitace velké rybky pro trofej',
      'drží proud a neztrácí hru',
    ],
    pains: ['kotel ryb je vždy kousek za dohozem', 'trofej ignoruje malé nástrahy'],
    proofs: ['Dědova klasika, na kterou se dodnes berou metrové štiky.', 'Osobní rekord odběratele — štika 9,4 kg právě na tuto plandavku.'],
    lexicon: ['daleký hod', 'hranu svahu', 'pomalé vedení'],
  },
  soft: {
    lname: 'gumová nástraha', fish: ['candáta', 'štiku', 'okouna'],
    seasons: ['po celý rok', 've studené vodě', 'na dropshot z ledu'],
    benefits: [
      'jedlý atraktant — ryba nástrahu drží, místo aby ji vyplivla',
      'živá hra ocásku i při nejpomalejším vedení',
      'stojí pár korun — nebojíte se házet do závozů a kamení',
    ],
    pains: ['záběrů dost, ale sekání selhává', 'bojíte se házet do překážek kvůli drahým nástrahám'],
    proofs: ['Candátáři přešli na jedlou gumu — úspěšnost záseků se zdvojnásobila.', 'Top 10 jigových závodů loví na gumu.'],
    lexicon: ['jig rig', 'skokové vedení', 'ofsetový háček'],
  },
  jig: {
    lname: 'jigová hlava', fish: ['candáta', 'štiku', 'sumce'],
    seasons: ['na podzim v jámách', 'v hloubce', 'na hranách koryta'],
    benefits: [
      'proklepete dno a najdete ryby tam, kde je nikdo nehledá',
      'plná kontrola vedení v jakémkoli větru i proudu',
      'ostrý háček, který prosekne kostnatou tlamu candáta',
    ],
    pains: ['ryby stojí v hloubce a nic na ně nedosáhne', 'necítíte dno a vedete naslepo'],
    proofs: ['Jig je disciplína č. 1 v lovu dravců — a ne náhodou.', 'Sumec přes 40 kg na těžkou jigovou hlavu — fotky v reportech.'],
    lexicon: ['skok po dně', 'kontakt se dnem', 'hranu koryta'],
  },
  popper: {
    lname: 'popper', fish: ['štiku', 'okouna', 'bolena'],
    seasons: ['za letních svítání', 'nad trávou a lekníny', 've vedru'],
    benefits: [
      'explozivní útoky na hladině — nejefektnější rybolov vašeho života',
      'projde nad trávou, kde potápivé nástrahy sbírají salát',
      'každý útok vidíte na vlastní oči — adrenalin zaručen',
    ],
    pains: ['všechny ryby stojí v trávě, kudy neprojde žádná nástraha', 'v letním vedru dravec ignoruje hlubinné nástrahy'],
    proofs: ['Video útoku štiky na popper má 2 miliony zhlédnutí — funguje to.', 'Kotel okounů + popper = záběr na každý hod.'],
    lexicon: ['pop-and-pause', 'ranní svítání', 'hladinové vedení'],
  },
  balancer: {
    lname: 'balancér', fish: ['okouna', 'candáta', 'štiku'],
    seasons: ['z ledu', 'na prvním ledu', 'v hluchém období zimy'],
    benefits: [
      'široká osmička pod dírkou svolá okouny z desítek metrů',
      'láká aktivní i pasivní ryby — vše je o pauze',
      'pět zdvihů a víte, jestli pod dírkou ryba je',
    ],
    pains: ['malé nástrahy lákají jen drobotinu', 'půl dne vrtáte dírky naprázdno'],
    proofs: ['Na prvním ledu je balancér nástraha č. 1.', 'Stovka okounů z ledu za den — reálný report s tímto modelem.'],
    lexicon: ['pauzu', 'cyklus zdvih-pokles', 'první led'],
  },
  spinnerbait: {
    lname: 'spinnerbait', fish: ['štiku', 'okouna', 'basse'],
    seasons: ['nad trávou', 'v závozech', 'v kalné vodě'],
    benefits: [
      'nezasekává se: projde trávou i závozy, kde stojí všechny štiky',
      'dvojitý dráždič — vibrace plátků plus objem sukýnky',
      'jedna nástraha místo deseti utržených',
    ],
    pains: ['nejrybnější místa jsou nejhorší na záseky', 'po dešti je voda kalná a ryba nástrahu nevidí'],
    proofs: ['Americká klasika na bassy, která skvěle funguje i na štiky.', 'Nula utržených nástrah za celou sezónu v závozech.'],
    lexicon: ['překážky', 'sukýnku', 'pomalé vedení trávou'],
  },
}

const CS = {
  quotes: ['„', '“'],
  types: CS_TYPES,
  hooks: {
    aida: [
      (c) => `Dravec doprovází a otáčí se? ${c.Lname} „${c.title}“ to řeší.`,
      (c) => `Zastavte scrollování, pokud lovíte ${c.fish}.`,
    ],
    pas: [
      () => `Znáte to: celý den na vodě a ani jeden záběr?`,
      () => `Řeknu to na rovinu: není to vámi. Je to nástrahou.`,
    ],
    story: [
      (c) => `Sobota, 4:50 ráno. Mlha nad vodou a první hod ${c.season}.`,
      () => `Tuhle nástrahu mi poradil děda u loděnice. Usmál jsem se. Zbytečně.`,
    ],
    expert: [
      (c) => `Rozbor: ${c.lname} „${c.title}“ — pro koho, kdy a proč.`,
      (c) => `Poctivá recenze bez vaty: co umí ${c.lname} „${c.title}“.`,
    ],
    fomo: [
      (c) => `Poslední šarže „${c.title}“ skladem — a tady je důvod, proč mizí.`,
      () => `Zatímco konkurence zdražila, my drželi sklad. Ne nadlouho.`,
    ],
  },
  bodies: {
    aida: (c, h) => [
      `${c.Lname} „${c.title}“ má jediný úkol — ${c.fish} ${c.season}.`,
      `Co je uvnitř:\n${h.check()}${h.cap(c.benefit)}\n${h.check()}${h.cap(c.benefit2)}`,
      c.proof,
    ],
    pas: (c, h) => [
      `${h.cap(c.pain)}. Kontrolujete uzly, měníte vedení — ale nástraha prostě nevysílá signál „zaútoč“.`,
      `${c.Lname} „${c.title}“ to řeší: ${c.benefit}. A navíc ${c.benefit2}.`,
      c.proof,
    ],
    story: (c, h) => [
      `Nasazuji ${c.lname} „${c.title}“, vedu přes ${c.lex} — a na druhý hod rána, až zazpívala brzda.`,
      `Za ráno ${h.n} ryb. Tajemství je prosté: ${c.benefit}.`,
      c.proof,
    ],
    expert: (c, h) => [
      `Cílová ryba: ${c.fish}.\nPodmínky: ${c.season}.\nKlíčová vlastnost: ${c.benefit}.`,
      `Funkční technika — ${c.lex}: ${c.benefit2}.`,
      `Závěr: pokud „${c.pain}“ zní jako vaše vycházky, „${c.title}“ to řeší.`,
    ],
    fomo: (c) => [
      `Důvod je prostý: ${c.benefit}. Kdo vyzkoušel, bere druhou i třetí.`,
      c.proof,
    ],
  },
  ctas: [
    (c) => `„${c.title}“ najdete na webu:\n${c.url}`,
    (c) => `Kompletní recenze, barvy a cena:\n${c.url}`,
    (c) => `Ověřte, zda je vaše barva skladem:\n${c.url}`,
  ],
  urgency: [
    'Omezená šarže — chodové barvy mizí první.',
    'Skladem méně než 30 kusů — další závoz za měsíc.',
    'Sezóna běží: každý den bez správné nástrahy je ztracená vycházka.',
  ],
  hashtags: ['#rybareni', '#nastrahy', '#stika', '#candat', '#rybolov'],
}

export const LANG_PACKS = { en: EN, cs: CS }

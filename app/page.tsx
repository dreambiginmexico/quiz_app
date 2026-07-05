"use client";

import { FormEvent, useMemo, useState } from "react";

type AreaKey =
  | "nuevo"
  | "bucerias"
  | "lacruz"
  | "puntamita"
  | "sayulita"
  | "sanpancho"
  | "lodemarcos"
  | "sanblas";

type Scores = Partial<Record<AreaKey, number>>;

type Option = {
  label: string;
  helper: string;
  scores: Scores;
};

type Question = {
  prompt: string;
  detail: string;
  options: Option[];
};

type Area = {
  name: string;
  tagline: string;
  bestFor: string;
  homeFit: string;
  architecture: string;
  community: string;
  activities: string[];
  cautions: string;
  buyerAngle: string;
  nextStep: string;
};

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  timeline: string;
  country: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const areas: Record<AreaKey, Area> = {
  nuevo: {
    name: "Nuevo Nayarit / Flamingos",
    tagline: "Resort comfort, easy services, and polished condo living.",
    bestFor:
      "People who want predictable infrastructure, golf, wide beaches, condo inventory, and a quieter resort rhythm.",
    homeFit:
      "Modern condos, resort residences, gated communities, golf-view homes, and lock-and-leave vacation properties.",
    architecture:
      "Contemporary resort architecture, landscaped condominium towers, and planned-community villas.",
    community:
      "A strong fit for retirees, snowbirds, families, and buyers who prefer established services over bohemian bustle.",
    activities: ["Golf", "beach walking", "pickleball", "spa days", "easy dining", "marina access nearby"],
    cautions: "It can feel more resort-planned than village-like, especially compared with older towns.",
    buyerAngle:
      "This is often a strong first look for US and Canadian buyers who want an easier ownership experience, newer buildings, and less day-to-day friction.",
    nextStep: "Compare condo buildings, HOA costs, beach access, and rental rules before narrowing your shortlist."
  },
  bucerias: {
    name: "Bucerias",
    tagline: "Walkable, social, artsy, and practical without losing the beach-town feel.",
    bestFor:
      "People who want restaurants, galleries, markets, long beach walks, and everyday convenience close at hand.",
    homeFit:
      "Town condos, beach-adjacent apartments, older casitas, small villas, and mixed-use streets near services.",
    architecture:
      "A mix of traditional Mexican town fabric, colorful facades, newer condos, and renovated beach homes.",
    community:
      "Good for active retirees, couples, remote workers, and multi-generational visitors who want neighbors and choices.",
    activities: ["Restaurants", "coffee", "markets", "cycling", "beach access", "day trips around the bay"],
    cautions: "Popular central blocks can be busy in high season.",
    buyerAngle:
      "Bucerias is one of the easiest areas to understand from a buyer perspective: walkability, services, restaurants, and broad resale appeal.",
    nextStep: "Decide whether you want Centro energy, Golden Zone convenience, or a quieter pocket farther from the busiest streets."
  },
  lacruz: {
    name: "La Cruz de Huanacaxtle",
    tagline: "A marina town with local texture and a grown-up, nautical pace.",
    bestFor:
      "Sailors, seafood lovers, and people who want a village feel with marina energy and calmer evenings.",
    homeFit:
      "Hillside condos, marina-view homes, village houses, and boutique developments with water access nearby.",
    architecture:
      "Fishing-village roots, marina residences, tiled roofs, terraces, and breezy indoor-outdoor plans.",
    community:
      "Well suited to mature couples, boaters, independent retirees, and people who like a quieter social scene.",
    activities: ["Boating", "fish market visits", "live music", "paddleboarding", "Sunday market", "bay excursions"],
    cautions: "Nightlife is lower-key, and some errands still pull you toward Bucerias or Puerto Vallarta.",
    buyerAngle:
      "La Cruz works well for buyers who want personality and marina access without paying Punta Mita pricing.",
    nextStep: "Look closely at hillside access, parking, marina proximity, and whether you want village or ocean-view living."
  },
  puntamita: {
    name: "Punta Mita / Punta de Mita",
    tagline: "Luxury, privacy, surf, golf, and polished coastal living.",
    bestFor:
      "Buyers prioritizing premium amenities, golf, private communities, refined hospitality, and privacy.",
    homeFit:
      "Luxury villas, branded residences, golf estates, beachfront condos, and staffed vacation homes.",
    architecture:
      "High-end tropical modern design, expansive terraces, stone, wood, palapa accents, and ocean-forward layouts.",
    community:
      "Best for affluent families, executives, privacy seekers, and active adults who want services handled beautifully.",
    activities: ["Golf", "surfing", "boat trips", "fine dining", "private amenities", "whale watching in season"],
    cautions: "It is one of the pricier and more exclusive choices in the region.",
    buyerAngle:
      "This is the premium lane: strong lifestyle appeal, luxury inventory, and a very different budget conversation than most bay towns.",
    nextStep: "Clarify whether you want inside-gate services, nearby village access, rental income, or maximum privacy."
  },
  sayulita: {
    name: "Sayulita",
    tagline: "Surf, nightlife, color, youth, and constant motion.",
    bestFor:
      "People who want energy, casual social life, beginner surf, boutiques, music, and a dense town center.",
    homeFit:
      "Hillside villas, surf rentals, colorful casitas, compact condos, and investment-friendly short-stay properties.",
    architecture:
      "Bohemian color, tropical courtyards, open-air living, murals, palapas, and eclectic renovations.",
    community:
      "A natural match for younger travelers, young families, digital nomads, and highly social adults.",
    activities: ["Surf lessons", "nightlife", "yoga", "boutiques", "cafes", "walkable dining"],
    cautions: "It can be noisy and crowded, so tranquility seekers may prefer nearby San Pancho or Lo de Marcos.",
    buyerAngle:
      "Sayulita can be compelling for rental-minded buyers, but the tradeoff is congestion, noise, and a more intense visitor rhythm.",
    nextStep: "Separate lifestyle appeal from investment math: access, noise, management, and legal rental rules matter here."
  },
  sanpancho: {
    name: "San Pancho",
    tagline: "Creative, thoughtful, village-scaled, and calmer than Sayulita.",
    bestFor:
      "People who want culture, beach, wellness, local projects, and a smaller community with style.",
    homeFit:
      "Boutique villas, garden casitas, small condos, architect-designed retreats, and homes tucked into greener streets.",
    architecture:
      "Artful tropical homes, natural materials, courtyards, shaded patios, and low-rise village design.",
    community:
      "Strong for creative adults, families, mindful retirees, and people who prefer community over nightlife.",
    activities: ["Yoga", "community events", "beach sunsets", "small restaurants", "music", "wellness"],
    cautions: "There are fewer big-resort services, and inventory can be limited.",
    buyerAngle:
      "San Pancho is for buyers who want a calmer, more curated village experience and are comfortable with less inventory.",
    nextStep: "Watch inventory quality, road access, lot conditions, and how close you really want to be to the center."
  },
  lodemarcos: {
    name: "Lo de Marcos / Guayabitos / Chacala",
    tagline: "Slow beaches, value, and a more traditional coastal rhythm.",
    bestFor:
      "People who want a relaxed pace, less polish, family beach time, and better value than the busiest bay towns.",
    homeFit:
      "Simple beach houses, small lots, casitas, low-rise condos, and practical homes for longer quiet stays.",
    architecture:
      "Traditional coastal houses, modest villas, shaded patios, and informal beach-town streets.",
    community:
      "Good for budget-aware retirees, families, quiet couples, and travelers who like local life more than amenities.",
    activities: ["Swimming", "fishing", "beach picnics", "local markets", "bike rides", "quiet restaurants"],
    cautions: "Expect fewer upscale restaurants, medical options, and English-speaking services than farther south.",
    buyerAngle:
      "This lane can appeal to value-focused buyers, but it requires more comfort with local rhythms and fewer services.",
    nextStep: "Balance purchase price against medical access, property management, resale demand, and daily convenience."
  },
  sanblas: {
    name: "San Blas",
    tagline: "History, nature, fishing, and an older Mexico feel.",
    bestFor:
      "Explorers who value port-town history, fishing, authenticity, and lower-density living over resort convenience.",
    homeFit:
      "Historic homes, practical town houses, rustic beach properties, and lower-density residences.",
    architecture:
      "Older port-town buildings, simple coastal homes, colonial references, and less manicured streetscapes.",
    community:
      "Best for self-sufficient adults, artists, independent retirees, and people comfortable outside expat centers.",
    activities: ["Fishing", "history walks", "local food", "surf breaks", "quiet exploration", "traditional town life"],
    cautions: "It is farther from Puerto Vallarta services and less polished than the southern Riviera Nayarit towns.",
    buyerAngle:
      "San Blas is not the default foreign-buyer path. It suits independent buyers who value authenticity over convenience.",
    nextStep: "Confirm medical access, travel time, property condition, and how much support you want after purchase."
  }
};

const questions: Question[] = [
  {
    prompt: "What kind of daily pace feels best?",
    detail: "Think about the rhythm you want most days, not just a vacation week.",
    options: [
      { label: "Resort-calm and organized", helper: "Easy, polished, low-friction days.", scores: { nuevo: 4, puntamita: 3, lacruz: 1 } },
      { label: "Social and walkable", helper: "Restaurants, errands, and neighbors close by.", scores: { bucerias: 4, sayulita: 2, sanpancho: 2 } },
      { label: "Creative and mellow", helper: "Culture, wellness, and slower evenings.", scores: { sanpancho: 4, lacruz: 2, lodemarcos: 2 } },
      { label: "Quiet and traditional", helper: "Less polish, more local texture.", scores: { lodemarcos: 4, sanblas: 3, lacruz: 1 } }
    ]
  },
  {
    prompt: "Which activities matter most?",
    detail: "Pick the set that would make you happiest over a full season.",
    options: [
      { label: "Easy beach access", helper: "Simple, repeatable days near the sand.", scores: { nuevo: 4, bucerias: 4, puntamita: 3, lodemarcos: 2 } },
      { label: "Restaurants and cafes", helper: "Walkable meals, coffee, and casual social life.", scores: { bucerias: 5, sayulita: 3, sanpancho: 3, lacruz: 2 } },
      { label: "Golf, spa, and wellness", helper: "A polished lifestyle with recreation close by.", scores: { puntamita: 4, nuevo: 4, sanpancho: 1 } },
      { label: "Boating and seafood", helper: "Marina access, fishing culture, and fresh local meals.", scores: { lacruz: 5, puntamita: 2, bucerias: 1 } }
    ]
  },
  {
    prompt: "What type of home sounds most appealing?",
    detail: "Choose the property type you would actually enjoy maintaining.",
    options: [
      { label: "Modern condo or lock-and-leave", helper: "Convenient, secure, and easy to manage.", scores: { nuevo: 4, bucerias: 3, lacruz: 2 } },
      { label: "Luxury villa or branded residence", helper: "Privacy, service, and premium finishes.", scores: { puntamita: 5, nuevo: 2 } },
      { label: "Colorful casita or hillside rental", helper: "Character, views, and personality.", scores: { sayulita: 4, sanpancho: 3, bucerias: 1 } },
      { label: "Simple beach house or town home", helper: "Practical, relaxed, and lower-key.", scores: { lodemarcos: 4, sanblas: 3, lacruz: 1 } }
    ]
  },
  {
    prompt: "Do you prefer a gated community?",
    detail: "This helps separate private, managed living from open town neighborhoods.",
    options: [
      { label: "Yes, gated is important", helper: "I want controlled access, security, and a managed setting.", scores: { nuevo: 5, puntamita: 5 } },
      { label: "Maybe, if it feels convenient", helper: "I like security, but do not want to feel isolated.", scores: { nuevo: 4, lacruz: 2, bucerias: 2, puntamita: 2 } },
      { label: "No, I prefer town living", helper: "I want restaurants, neighbors, and local life outside my door.", scores: { bucerias: 4, lacruz: 3, sanpancho: 3, sayulita: 2 } },
      { label: "Not important either way", helper: "The area, home quality, and lifestyle matter more than the gate.", scores: { bucerias: 2, lacruz: 2, sanpancho: 2, lodemarcos: 2, sanblas: 1 } }
    ]
  },
  {
    prompt: "Which architecture pulls you in?",
    detail: "This helps separate resort modern from village character.",
    options: [
      { label: "Tropical modern", helper: "Clean lines, terraces, pools, and ocean views.", scores: { puntamita: 4, nuevo: 3, sanpancho: 1 } },
      { label: "Traditional Mexican town", helper: "Color, tile, patios, and street life.", scores: { bucerias: 4, lacruz: 3, sanblas: 2 } },
      { label: "Bohemian beach style", helper: "Palapas, murals, open-air rooms, and surf-town texture.", scores: { sayulita: 4, sanpancho: 3 } },
      { label: "Rustic coastal simplicity", helper: "Unfussy homes close to nature.", scores: { lodemarcos: 4, sanblas: 3 } }
    ]
  },
  {
    prompt: "Who should the local scene fit best?",
    detail: "Age fit is about community rhythm, not who is allowed anywhere.",
    options: [
      { label: "Retirees and snowbirds", helper: "Calmer, service-friendly, and social.", scores: { nuevo: 4, bucerias: 3, lacruz: 3, lodemarcos: 1 } },
      { label: "Families and mixed ages", helper: "Enough activities for several generations.", scores: { bucerias: 3, nuevo: 3, puntamita: 3, sanpancho: 2 } },
      { label: "Younger and highly social", helper: "Nightlife, surf, cafes, and movement.", scores: { sayulita: 5, bucerias: 2 } },
      { label: "Independent and nature-focused", helper: "Less age-defined, more self-directed.", scores: { sanblas: 4, sanpancho: 2, lodemarcos: 2 } }
    ]
  },
  {
    prompt: "How much nightlife do you want nearby?",
    detail: "A good match depends on how much sound and activity you enjoy.",
    options: [
      { label: "Plenty", helper: "Music, bars, late dinners, and busy streets.", scores: { sayulita: 5, bucerias: 2 } },
      { label: "Some, but not wild", helper: "Dinner, live music, then sleep.", scores: { bucerias: 4, lacruz: 3, sanpancho: 2 } },
      { label: "Very little", helper: "Quiet evenings are the point.", scores: { lodemarcos: 4, sanblas: 3, nuevo: 2 } },
      { label: "Private, polished social life", helper: "Curated restaurants and controlled energy.", scores: { puntamita: 5, nuevo: 2 } }
    ]
  },
  {
    prompt: "What budget posture feels right?",
    detail: "Not exact pricing, just the comfort zone you want the app to respect.",
    options: [
      { label: "Value matters most", helper: "Trade polish for space or savings.", scores: { lodemarcos: 4, sanblas: 4, bucerias: 1 } },
      { label: "Mid-range and practical", helper: "Convenience without chasing the top shelf.", scores: { bucerias: 4, lacruz: 3, nuevo: 2 } },
      { label: "Premium is fine", helper: "Amenities and finish matter.", scores: { nuevo: 3, puntamita: 3, sanpancho: 1 } },
      { label: "Luxury first", helper: "Best-in-class properties and privacy.", scores: { puntamita: 5 } }
    ]
  },
  {
    prompt: "How important is walkability?",
    detail: "Some areas are best on foot; others reward having a car.",
    options: [
      { label: "Essential", helper: "I want to walk to food, shops, and the beach.", scores: { bucerias: 5, sayulita: 4, sanpancho: 3 } },
      { label: "Useful, not mandatory", helper: "A walkable pocket is enough.", scores: { lacruz: 3, nuevo: 3, lodemarcos: 2 } },
      { label: "I will drive", helper: "Privacy and space matter more.", scores: { puntamita: 4, sanblas: 2, lodemarcos: 2 } },
      { label: "I want resort-style convenience", helper: "Easy movement inside a managed area.", scores: { puntamita: 4, nuevo: 3, lacruz: 2 } }
    ]
  },
  {
    prompt: "Which setting feels most like home?",
    detail: "This is the emotional compass question.",
    options: [
      { label: "Wide beach and planned grounds", helper: "Open, orderly, and comfortable.", scores: { nuevo: 5, puntamita: 2 } },
      { label: "Town center near the sand", helper: "Daily life and beach life overlap.", scores: { bucerias: 4, sayulita: 3, sanpancho: 2 } },
      { label: "Marina and fishing village", helper: "Boats, seafood, and bay views.", scores: { lacruz: 5 } },
      { label: "Small town with slower services", helper: "Less polish, more room to breathe.", scores: { lodemarcos: 4, sanblas: 3 } }
    ]
  },
  {
    prompt: "What tradeoff are you most willing to make?",
    detail: "Every coastal area has a compromise. Pick the one you can live with.",
    options: [
      { label: "Less local grit for convenience", helper: "I value smooth services.", scores: { nuevo: 4, puntamita: 3 } },
      { label: "More crowds for more energy", helper: "I would rather be where things happen.", scores: { sayulita: 4, bucerias: 3 } },
      { label: "Fewer services for more calm", helper: "Quiet is worth a longer errand.", scores: { sanpancho: 3, lodemarcos: 3, sanblas: 3 } },
      { label: "Higher cost for privacy", helper: "I value exclusivity and finish.", scores: { puntamita: 5 } }
    ]
  }
];

function scoreAnswers(answers: number[]) {
  const totals = Object.keys(areas).reduce((acc, key) => {
    acc[key as AreaKey] = 0;
    return acc;
  }, {} as Record<AreaKey, number>);

  answers.forEach((answerIndex, questionIndex) => {
    const option = questions[questionIndex]?.options[answerIndex];
    if (!option) return;

    Object.entries(option.scores).forEach(([area, points]) => {
      totals[area as AreaKey] += points ?? 0;
    });
  });

  return Object.entries(totals)
    .map(([key, score]) => ({ key: key as AreaKey, score }))
    .sort((a, b) => b.score - a.score);
}

function pushTracking(eventName: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event: eventName, ...payload });
  window.gtag?.("event", eventName, payload);
  window.fbq?.("trackCustom", eventName, payload);
}

export default function Home() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [leadUnlocked, setLeadUnlocked] = useState(false);

  const progress = Math.round((answers.length / questions.length) * 100);
  const results = useMemo(() => scoreAnswers(answers), [answers]);
  const winner = results[0];
  const runnersUp = results.slice(1, 4);

  const chooseOption = (optionIndex: number) => {
    const nextAnswers = [...answers];
    nextAnswers[activeQuestion] = optionIndex;
    setAnswers(nextAnswers);

    if (activeQuestion === questions.length - 1) {
      setShowResults(true);
      pushTracking("quiz_completed", { match: results[0]?.key ?? "pending" });
      return;
    }

    setActiveQuestion((current) => current + 1);
  };

  const goBack = () => {
    if (showResults) {
      setShowResults(false);
      setActiveQuestion(questions.length - 1);
      return;
    }

    setActiveQuestion((current) => Math.max(0, current - 1));
  };

  const restart = () => {
    setAnswers([]);
    setActiveQuestion(0);
    setShowResults(false);
    setLeadUnlocked(false);
  };

  const unlockResults = () => {
    setLeadUnlocked(true);
  };

  return (
    <main>
      <section className="hero">
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="eyebrow">Riviera Nayarit Buyer Match</p>
          <h1>Find the Riviera Nayarit area that fits how you actually want to live.</h1>
          <p className="intro">
            A 2-minute fit quiz for US and Canadian buyers comparing beach access, restaurants, property type,
            lifestyle pace, budget, and community feel.
          </p>
        </div>
      </section>

      <section className="appShell" aria-label="Riviera Nayarit buyer quiz">
        <div className="panel">
          <div className="statusRow">
            <span>{showResults ? "Match ready" : `Question ${activeQuestion + 1} of ${questions.length}`}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="progressTrack" aria-hidden="true">
            <div className="progressFill" style={{ width: `${progress}%` }} />
          </div>

          {showResults && winner ? (
            <ResultView
              answers={answers}
              leadUnlocked={leadUnlocked}
              onBack={goBack}
              onRestart={restart}
              onUnlock={unlockResults}
              runnersUp={runnersUp}
              winner={winner}
            />
          ) : (
            <QuestionView
              canGoBack={activeQuestion > 0}
              onBack={goBack}
              onChoose={chooseOption}
              question={questions[activeQuestion]}
              selectedIndex={answers[activeQuestion]}
            />
          )}
        </div>
      </section>

      <section className="seoBand" aria-label="Buyer guidance">
        <div>
          <p className="eyebrow">Built for foreign buyers</p>
          <h2>Use the match as a starting point, then pressure-test the real estate details.</h2>
        </div>
        <div className="seoGrid">
          <article>
            <h3>For Canadian snowbirds</h3>
            <p>Compare walkability, medical access, condo rules, property management, and seasonal social life.</p>
          </article>
          <article>
            <h3>For US vacation-home buyers</h3>
            <p>Look at beach access, rental demand, building quality, HOA fees, and how easy the area is to use without friction.</p>
          </article>
          <article>
            <h3>For investors</h3>
            <p>Match lifestyle appeal with rental rules, occupancy patterns, management costs, and realistic resale demand.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function QuestionView({
  question,
  selectedIndex,
  onChoose,
  onBack,
  canGoBack
}: {
  question: Question;
  selectedIndex?: number;
  onChoose: (index: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}) {
  return (
    <div className="questionBlock">
      <div>
        <h2>{question.prompt}</h2>
        <p>{question.detail}</p>
      </div>

      <div className="optionsGrid">
        {question.options.map((option, index) => (
          <button
            className={selectedIndex === index ? "option selected" : "option"}
            key={option.label}
            onClick={() => onChoose(index)}
            type="button"
          >
            <span className="optionTitle">{option.label}</span>
            <span className="optionHelper">{option.helper}</span>
          </button>
        ))}
      </div>

      <div className="buttonRow">
        <button className="secondaryButton" disabled={!canGoBack} onClick={onBack} type="button">
          Back
        </button>
      </div>
    </div>
  );
}

function ResultView({
  winner,
  runnersUp,
  answers,
  leadUnlocked,
  onBack,
  onRestart,
  onUnlock
}: {
  winner: { key: AreaKey; score: number };
  runnersUp: { key: AreaKey; score: number }[];
  answers: number[];
  leadUnlocked: boolean;
  onBack: () => void;
  onRestart: () => void;
  onUnlock: () => void;
}) {
  const area = areas[winner.key];

  return (
    <div className="resultBlock">
      <div className="resultHeader">
        <p className="eyebrow">Your best starting match</p>
        <h2>{area.name}</h2>
        <p>{area.tagline}</p>
      </div>

      <div className="teaserBox">
        <h3>Quick read</h3>
        <p>{area.buyerAngle}</p>
      </div>

      {!leadUnlocked ? (
        <LeadCapture answers={answers} matchKey={winner.key} onUnlock={onUnlock} />
      ) : (
        <FullResult area={area} onBack={onBack} onRestart={onRestart} runnersUp={runnersUp} />
      )}
    </div>
  );
}

function LeadCapture({
  answers,
  matchKey,
  onUnlock
}: {
  answers: number[];
  matchKey: AreaKey;
  onUnlock: () => void;
}) {
  const [form, setForm] = useState<LeadForm>({
    name: "",
    email: "",
    phone: "",
    timeline: "",
    country: ""
  });
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  const updateField = (field: keyof LeadForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          match: matchKey,
          answers,
          source: "riviera-nayarit-area-quiz"
        })
      });

      if (!response.ok) {
        throw new Error("Lead capture failed");
      }

      pushTracking("lead_submitted", { match: matchKey, country: form.country, timeline: form.timeline });
      onUnlock();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="leadForm" onSubmit={submitLead}>
      <div>
        <p className="eyebrow">Get the full breakdown</p>
        <h3>See why this area fits, what to compare next, and which other towns are worth a look.</h3>
      </div>

      <div className="formGrid">
        <label>
          Name
          <input required value={form.name} onChange={(event) => updateField("name", event.target.value)} />
        </label>
        <label>
          Email
          <input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
        </label>
        <label>
          Country
          <select required value={form.country} onChange={(event) => updateField("country", event.target.value)}>
            <option value="">Select one</option>
            <option value="Canada">Canada</option>
            <option value="United States">United States</option>
            <option value="Mexico">Mexico</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="wideField">
          Buying timeline
          <select value={form.timeline} onChange={(event) => updateField("timeline", event.target.value)}>
            <option value="">Select one</option>
            <option value="0-3 months">0-3 months</option>
            <option value="3-6 months">3-6 months</option>
            <option value="6-12 months">6-12 months</option>
            <option value="Just researching">Just researching</option>
          </select>
        </label>
      </div>

      <div className="buttonRow leadActions">
        <p>Submitting also makes this quiz usable as a CRM lead source once your webhook is connected.</p>
        <button className="primaryButton" disabled={status === "saving"} type="submit">
          {status === "saving" ? "Saving..." : "Show my full result"}
        </button>
      </div>
      {status === "error" ? <p className="errorText">Something did not save. Try once more.</p> : null}
    </form>
  );
}

function FullResult({
  area,
  runnersUp,
  onBack,
  onRestart
}: {
  area: Area;
  runnersUp: { key: AreaKey; score: number }[];
  onBack: () => void;
  onRestart: () => void;
}) {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "/book";

  return (
    <>
      <div className="resultGrid">
        <article>
          <h3>Why it fits</h3>
          <p>{area.bestFor}</p>
        </article>
        <article>
          <h3>Home match</h3>
          <p>{area.homeFit}</p>
        </article>
        <article>
          <h3>Architecture</h3>
          <p>{area.architecture}</p>
        </article>
        <article>
          <h3>Community fit</h3>
          <p>{area.community}</p>
        </article>
      </div>

      <div className="activityBand">
        {area.activities.map((activity) => (
          <span key={activity}>{activity}</span>
        ))}
      </div>

      <div className="note">
        <strong>Worth knowing:</strong> {area.cautions}
      </div>

      <div className="nextStepBox">
        <h3>Smart next step</h3>
        <p>{area.nextStep}</p>
        <a className="primaryLink" href={bookingUrl}>
          Book a fit call
        </a>
      </div>

      <div className="runnerBlock">
        <h3>Also worth comparing</h3>
        <div className="runnerGrid">
          {runnersUp.map((result) => (
            <div className="runner" key={result.key}>
              <span>{areas[result.key].name}</span>
              <small>{areas[result.key].tagline}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="buttonRow">
        <button className="secondaryButton" onClick={onBack} type="button">
          Edit answers
        </button>
        <button className="secondaryButton" onClick={onRestart} type="button">
          Start over
        </button>
      </div>
    </>
  );
}

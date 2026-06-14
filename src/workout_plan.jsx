import { useState } from "react";

const DAY_COLORS = {
  push: { bg: "#FEF2F2", border: "#EF4444", accent: "#DC2626", light: "#FCA5A5", tag: "#7F1D1D" },
  pull: { bg: "#EFF6FF", border: "#3B82F6", accent: "#2563EB", light: "#93C5FD", tag: "#1E3A8A" },
  legs: { bg: "#F0FDF4", border: "#22C55E", accent: "#16A34A", light: "#86EFAC", tag: "#14532D" },
  arms: { bg: "#FAF5FF", border: "#A855F7", accent: "#9333EA", light: "#D8B4FE", tag: "#581C87" },
  rest: { bg: "#F8FAFC", border: "#CBD5E1", accent: "#64748B", light: "#CBD5E1", tag: "#334155" },
};

const PHASES = [
  {
    weeks: "Weeks 1–2", name: "Foundation", subtitle: "Ease Back In", color: "#3B82F6",
    rules: [
      "Start at ~60–70% of what you think you can handle — no ego here",
      "Stop 3 full reps before failure on every single set",
      "Focus entirely on form and feeling the target muscle working",
      "Expect soreness — don't panic and don't go harder than prescribed",
      "These weeks protect your joints and connective tissue, not just your muscles",
    ]
  },
  {
    weeks: "Weeks 3–4", name: "Building", subtitle: "Progressive Overload Starts", color: "#22C55E",
    rules: [
      "The rule: hit ALL reps of ALL sets with 2 reps in reserve → add weight next session",
      "Upper body: add 2.5–5 lbs (if machine jumps are too big, add a rep instead)",
      "Lower body: add 5–10 lbs when the rule above is met",
      "Stop 2 reps before failure — one step closer to your limit than before",
    ]
  },
  {
    weeks: "Weeks 5–6", name: "Intensity", subtitle: "Push Closer to the Edge", color: "#F59E0B",
    rules: [
      "Continue adding weight every time you hit all reps with clean form",
      "Push to 1–2 reps before failure on your main compound exercises",
      "Can add 1 extra set to main lifts if energy allows",
      "You should feel noticeably stronger than Week 1 by now",
    ]
  },
  {
    weeks: "Week 7", name: "Deload", subtitle: "Active Recovery", color: "#8B5CF6",
    rules: [
      "Reduce ALL weights by ~40% — yes, this feels too easy. That's the point.",
      "Drop to 2 sets per exercise instead of 3–4",
      "Same days, same exercises — just much lighter",
      "This is when your body repairs and comes back stronger. Do NOT skip it.",
    ]
  },
  {
    weeks: "Week 8", name: "Reload", subtitle: "Reassess + Return", color: "#EF4444",
    rules: [
      "Return to Week 5–6 intensity",
      "You'll likely feel stronger — especially on machines",
      "Write down your working weights this week vs Week 1",
      "After Week 8: consider running the program again or moving to a new phase",
    ]
  }
];

const SCHEDULE = [
  { day: "Mon", label: "Push", type: "push" },
  { day: "Tue", label: "Pull", type: "pull" },
  { day: "Wed", label: "Rest", type: "rest" },
  { day: "Thu", label: "Legs", type: "legs" },
  { day: "Fri", label: "Arms", type: "arms" },
  { day: "Sat", label: "Optional", type: "rest" },
  { day: "Sun", label: "Rest", type: "rest" },
];

const DAYS = [
  {
    id: "push", name: "Day 1 — Push", subtitle: "Chest · Shoulders · Triceps", type: "push",
    warmup: [
      "5 min easy treadmill or stationary bike",
      "Arm circles: 10 forward, 10 backward each arm",
      "Band pull-aparts or light shoulder rotations (2 × 15)",
      "1 warm-up set on machine chest press @ ~50% of working weight",
    ],
    exercises: [
      { name: "Flat Machine Chest Press", sets: 4, reps: "8–10", notes: "Main chest builder. Stop 2–3 reps before failure. Think about squeezing your chest, not just pushing the weight away." },
      { name: "Incline Machine Press", sets: 3, reps: "10–12", notes: "Upper chest emphasis — builds the 'shelf' look. Control the descent (2 sec down). Adjust the seat so the handles line up with your upper chest." },
      { name: "Pec Deck / Cable Flyes", sets: 3, reps: "12–15", notes: "Isolation. Squeeze hard at peak contraction. Use a weight you can fully feel, not just push. No momentum." },
      { name: "Seated Machine Shoulder Press", sets: 3, reps: "10–12", notes: "Don't flare elbows too far out. Stop 2 reps before failure — shoulders fatigue quickly after chest work." },
      { name: "Cable Lateral Raises", sets: 3, reps: "12–15", notes: "⭐ Shoulder width builder. Light weight, slow and fully controlled. Lead with your elbow, not your wrist. These pay dividends over time." },
      { name: "Tricep Pushdown (straight bar or rope)", sets: 3, reps: "12–15", notes: "Keep elbows pinned to your sides throughout. Full range of motion — all the way down and a full squeeze at the bottom." },
      { name: "Overhead Cable Tricep Extension", sets: 3, reps: "12–15", notes: "Hits the long head — adds real thickness to the back of the arm. Face away from the cable stack, lean slightly forward." },
    ],
    cooldown: [
      "Doorway chest stretch: 30 sec each side",
      "Overhead tricep stretch: 30 sec each arm",
      "Cross-body shoulder stretch: 30 sec each arm",
    ],
  },
  {
    id: "pull", name: "Day 2 — Pull", subtitle: "Back · Biceps", type: "pull",
    warmup: [
      "5 min easy cardio",
      "Light band pull-aparts or face pulls (2 × 15, very light — warms up rotator cuff)",
      "1 warm-up set on lat pulldown @ ~50% of working weight",
    ],
    exercises: [
      { name: "Lat Pulldown (wide overhand grip)", sets: 4, reps: "8–10", notes: "Pull the bar to your upper chest, squeezing your lats at the bottom. Lean back slightly. Don't swing or use momentum — control it." },
      { name: "Seated Cable Row (neutral grip)", sets: 3, reps: "10–12", notes: "Sit tall. Pull to your lower chest/belly, thinking about squeezing your shoulder blades together at the end of each rep." },
      { name: "Chest-Supported Machine Row", sets: 3, reps: "10–12", notes: "The chest pad eliminates lower-back involvement entirely — perfect for your preferences. Go full range of motion every rep." },
      { name: "Cable Face Pulls (rope)", sets: 3, reps: "15–20", notes: "⚠️ DO NOT SKIP THIS. Light weight, high reps. Trains rear delts and rotator cuff — directly protects your shoulder joints from all the pressing work on Push day." },
      { name: "EZ Bar Curl or Preacher Machine Curl", sets: 3, reps: "10–12", notes: "Control the lowering phase (2 sec down). The eccentric (lowering) is where a lot of bicep growth happens. Don't just drop the weight." },
      { name: "Dumbbell Hammer Curls", sets: 3, reps: "12", notes: "Neutral grip (thumbs up). Targets the brachialis — adds serious thickness to the arm, making it look bigger from more angles." },
      { name: "Cable Curl (rope or bar)", sets: 2, reps: "15", notes: "Pump finisher. Light weight, full squeeze at the top. Gets blood into the muscle to cap off the session." },
    ],
    cooldown: [
      "Doorway lat stretch (lean away from a pole or rack): 30 sec",
      "Bicep wall stretch: 30 sec each arm",
      "Chin tucks / gentle neck rolls: 30 sec",
    ],
    homeNote: "🏠 Home bonus (optional on rest days): 2–3 sets of pull-ups or chin-ups on your bar. Even 3–5 reps build real back and bicep strength over time — the effort compounds.",
  },
  {
    id: "legs", name: "Day 3 — Legs + Core", subtitle: "Quads · Hamstrings · Calves · Core", type: "legs",
    warmup: [
      "5 min stationary bike at moderate pace",
      "Leg swings front-to-back: 10 each leg",
      "Hip circles: 10 each direction per leg",
      "1 light set on hack squat or leg press to groove the movement pattern",
    ],
    exercises: [
      { name: "Hack Squat Machine", sets: 4, reps: "8–10", notes: "3 sec controlled descent. Don't let knees cave inward. Leg strength directly supports your upper body pressing and pulling ability — don't skip this because it's not 'aesthetic'." },
      { name: "Leg Press (machine)", sets: 3, reps: "10–12", notes: "Feet shoulder-width apart, keep your lower back flat on the pad. Don't fully lock your knees at the top. This is a safer high-volume leg builder." },
      { name: "Leg Extension (machine)", sets: 3, reps: "12–15", notes: "Quad isolation. Squeeze hard at full extension, slow 2 sec lowering. When done correctly, actually supports knee health." },
      { name: "Seated Leg Curl (machine)", sets: 3, reps: "12–15", notes: "Hamstring balance work. Important for long-term knee joint health — the hamstrings counterbalance all the quad-dominant work above." },
      { name: "Standing Calf Raise (machine)", sets: 4, reps: "15–20", notes: "1 sec pause at the top. Full range of motion — all the way up and all the way down. Calves respond well to higher reps and strict form." },
      { name: "Plank", sets: 3, reps: "30–45 sec", notes: "Brace hard — like you're about to take a punch to the stomach. Don't hold your breath. A strong core makes every upper body movement more stable and effective." },
      { name: "Cable Crunch or Ab Machine", sets: 3, reps: "15", notes: "Controlled tempo, full contraction. Core training transfers directly to how you look and perform on every other movement." },
    ],
    cooldown: [
      "Standing quad stretch: 30 sec each leg",
      "Seated hamstring stretch: 30 sec each leg",
      "Hip flexor lunge stretch: 30 sec each side",
    ],
  },
  {
    id: "arms", name: "Day 4 — Arms + Shoulders", subtitle: "Biceps · Triceps · Shoulders (Priority Day)", type: "arms",
    warmup: [
      "5 min light cardio",
      "Arm swings and shoulder circles: 30 sec each",
      "Light cable lateral raises: 1 × 15 at very light weight to warm up the shoulder joint",
    ],
    exercises: [
      { name: "Seated Cable Lateral Raise", sets: 3, reps: "12–15", notes: "⭐ Your shoulder width builder — consistent work here transforms your silhouette. Light weight, fully controlled rep. Lead with your elbow." },
      { name: "Machine Shoulder Press", sets: 3, reps: "10–12", notes: "Overall shoulder size and strength. Excellent complement to the lateral raises — one builds width, the other builds overall mass." },
      { name: "Cable Front Raise", sets: 2, reps: "12", notes: "Light weight. Targets the anterior deltoid for a full, rounded shoulder look from the front." },
      { name: "Incline Dumbbell Curl", sets: 3, reps: "10–12", notes: "⭐ Excellent for bicep peak. Lie back on an incline bench, arms hanging straight down. Full stretch at the bottom — this range of motion is what makes it so effective." },
      { name: "Machine Preacher Curl or EZ Bar", sets: 3, reps: "10–12", notes: "Strict isolation. The machine removes all cheating completely. Control every rep — don't just let the weight drop." },
      { name: "Rope Tricep Pushdown", sets: 3, reps: "12–15", notes: "Spread the rope apart at the very bottom for a better contraction. Feel the squeeze, don't just move weight." },
      { name: "Overhead Cable Tricep Extension", sets: 3, reps: "12–15", notes: "Long head emphasis again. Adds mass to the back of the arm — the long head is the biggest portion of your tricep and the one that shows most." },
      { name: "Pec Deck / Cable Flyes (optional)", sets: 2, reps: "15", notes: "Light weight chest pump finisher if you have energy left. Keeps your chest stimulated during the week." },
    ],
    cooldown: [
      "Bicep wall stretch: 30 sec each arm",
      "Overhead tricep stretch: 30 sec each arm",
      "Shoulder cross-body stretch: 30 sec each arm",
    ],
  },
];

const FOLLOWUPS = [
  "I'm having a super busy week — how do I condense this to 3 days without losing much progress?",
  "My shoulders are feeling irritated after push day — what exercises should I swap out or avoid?",
  "I'm not gaining weight even though I'm training hard — can you give me a specific meal plan?",
  "I want more chest volume — how do I safely add more chest work without overtraining?",
  "I've finished the 8 weeks — what should my next training phase look like?",
];

function ExerciseCard({ ex, index, accentColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "white", border: "1px solid #E5E7EB", borderRadius: 10,
        padding: "12px 14px", marginBottom: 8, cursor: "pointer",
        boxShadow: open ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: accentColor,
          color: "white", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800, flexShrink: 0,
        }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, fontWeight: 700, fontSize: 13, color: "#111" }}>{ex.name}</div>
        <div style={{ background: "#F3F4F6", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>
          {ex.sets} × {ex.reps}
        </div>
      </div>
      {open && (
        <div style={{ marginTop: 10, paddingLeft: 36, fontSize: 13, color: "#555", lineHeight: 1.55 }}>
          {ex.notes}
        </div>
      )}
    </div>
  );
}

export default function WorkoutPlan() {
  const [tab, setTab] = useState("overview");

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "schedule", label: "Schedule" },
    { id: "push",  label: "🔴 Push" },
    { id: "pull",  label: "🔵 Pull" },
    { id: "legs",  label: "🟢 Legs" },
    { id: "arms",  label: "🟣 Arms" },
    { id: "progression", label: "Progression" },
    { id: "nextsteps", label: "Next Steps" },
  ];

  const activeDay = DAYS.find(d => d.id === tab);
  const colors = activeDay ? DAY_COLORS[activeDay.type] : null;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", maxWidth: 680, margin: "0 auto", padding: 16, background: "#F4F5F7", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "#1C1C28", borderRadius: 14, padding: "20px 20px 16px", marginBottom: 14, color: "white" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 6 }}>8-Week Program</div>
        <h1 style={{ fontSize: 21, fontWeight: 900, margin: "0 0 4px", lineHeight: 1.2 }}>
          Chest, Arms & Shoulder<br />Hypertrophy Plan
        </h1>
        <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
          {[["🏋️", "Machine-Focused"], ["📅", "4 Days/Week"], ["⏱", "45–75 min"], ["📍", "LA Fitness + Home"]].map(([icon, label]) => (
            <div key={label} style={{ fontSize: 11, color: "#D1D5DB", display: "flex", alignItems: "center", gap: 4 }}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Banner */}
      <div style={{ background: "#FFFBEB", border: "2px solid #F59E0B", borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: "#92400E", marginBottom: 6 }}>⚠️ Most Important Thing In This Entire Plan: Eat More</div>
        <div style={{ fontSize: 13, color: "#78350F", marginBottom: 10, lineHeight: 1.5 }}>
          At <strong>5'10" / 130 lbs</strong>, your diet determines 70%+ of your results. No program builds muscle without a caloric surplus — this is non-negotiable.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {[["~3,000 cal", "per day target"], ["~140g protein", "daily minimum"], ["3–4 meals", "don't skip breakfast"]].map(([val, lbl]) => (
            <div key={lbl} style={{ background: "white", border: "1px solid #F59E0B", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#92400E" }}>{val}</div>
              <div style={{ fontSize: 10, color: "#78350F", marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#92400E" }}>
          Best sources: chicken, eggs, Greek yogurt, cottage cheese, ground beef, rice, oats. Add a protein shake if hitting 140g through food alone is hard.
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "7px 13px", borderRadius: 20, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
            background: tab === t.id ? "#1C1C28" : "white",
            color: tab === t.id ? "white" : "#555",
            boxShadow: tab === t.id ? "0 2px 6px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div>
          <div style={{ background: "white", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>The Plan in Plain Language</div>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, margin: "0 0 10px" }}>
              This is an 8-week machine-focused hypertrophy program built around your three priorities: <strong>chest, arms, and shoulders</strong>. You'll train 4 days a week on a Push / Pull / Legs / Arms+Shoulders split, with sessions lasting 45–75 minutes.
            </p>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, margin: "0 0 10px" }}>
              Because you're returning after 3–6 months away, the <strong>first two weeks are intentionally conservative</strong>. Your muscles will adapt faster than your tendons and joints, so don't be tempted to push harder than prescribed early on. After that, you'll add weight progressively — the only real mechanism for building muscle.
            </p>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, margin: 0 }}>
              Every exercise is machine or cable-based, avoids unnecessary spinal loading, and is chosen to build the look you're after. <strong>Week 7 is a scheduled deload</strong> — it sounds counterintuitive, but that lighter week is what allows your body to repair and grow. Don't skip it.
            </p>
          </div>

          <div style={{ background: "white", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>What Each Day Targets</div>
            {DAYS.map(d => {
              const c = DAY_COLORS[d.type];
              return (
                <div key={d.id} onClick={() => setTab(d.id)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0", borderBottom: "1px solid #F3F4F6", cursor: "pointer",
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.border, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{d.subtitle}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{d.exercises.length} exercises →</div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 14, fontSize: 13, color: "#1E40AF", lineHeight: 1.5 }}>
            <strong>⚕️ Medical disclaimer:</strong> Please consult with a doctor or qualified coach before starting, especially if you have any medical concerns. If something hurts (joint pain, not muscle burn) — stop that exercise immediately. This plan is educational guidance, not individualized medical advice.
          </div>
        </div>
      )}

      {/* ── SCHEDULE ── */}
      {tab === "schedule" && (
        <div>
          <div style={{ background: "white", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Weekly Structure (Repeats Each Week)</div>
            <div style={{ display: "flex", gap: 4 }}>
              {SCHEDULE.map(({ day, label, type }) => {
                const c = DAY_COLORS[type];
                return (
                  <div key={day} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#888", marginBottom: 4 }}>{day}</div>
                    <div style={{
                      background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8,
                      padding: "8px 2px", fontSize: 10, fontWeight: 700, color: c.tag, lineHeight: 1.3,
                    }}>
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: "#777", marginTop: 14, lineHeight: 1.5 }}>
              💡 You don't have to train Mon–Fri exactly. What matters is the <em>sequence</em>: Push → Pull → Rest → Legs → Arms. Just don't train the same muscle group on back-to-back days.
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 12, padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>8-Week Phase Overview</div>
            {PHASES.map((phase, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < PHASES.length - 1 ? "1px solid #F3F4F6" : "none", alignItems: "center" }}>
                <div style={{ width: 4, height: 36, borderRadius: 2, background: phase.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{phase.weeks}</div>
                  <div style={{ fontSize: 12, color: "#777" }}>{phase.name}: {phase.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DAY WORKOUT TABS ── */}
      {activeDay && colors && (
        <div>
          <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 18, color: colors.tag }}>{activeDay.name}</div>
            <div style={{ fontSize: 13, color: colors.accent, fontWeight: 600, marginTop: 2 }}>{activeDay.subtitle}</div>
          </div>

          <div style={{ background: "white", borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              🔥 Warm-Up <span style={{ fontWeight: 400, fontSize: 11, color: "#888" }}>(5–7 min)</span>
            </div>
            {activeDay.warmup.map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: "#555", display: "flex", gap: 8, padding: "4px 0", lineHeight: 1.4 }}>
                <span style={{ color: colors.accent, fontWeight: 700, flexShrink: 0 }}>·</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#333" }}>
              Main Exercises <span style={{ fontWeight: 400, fontSize: 11, color: "#888" }}>— tap any exercise to see coaching notes</span>
            </div>
            {activeDay.exercises.map((ex, i) => (
              <ExerciseCard key={i} ex={ex} index={i} accentColor={colors.accent} />
            ))}
          </div>

          {activeDay.homeNote && (
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 13, color: "#166534", lineHeight: 1.5 }}>
              {activeDay.homeNote}
            </div>
          )}

          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#1D4ED8", marginBottom: 8 }}>🧊 Cool-Down Stretches</div>
            {activeDay.cooldown.map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: "#1E40AF", display: "flex", gap: 8, padding: "3px 0" }}>
                <span>·</span><span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROGRESSION ── */}
      {tab === "progression" && (
        <div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 14, lineHeight: 1.5 }}>
            The exercises stay largely the same throughout the 8 weeks. What changes is the weight, the number of sets, and how close to failure you work.
          </div>

          {PHASES.map((phase, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 12, padding: 14, marginBottom: 10,
              borderLeft: `4px solid ${phase.color}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{phase.weeks}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: phase.color, background: `${phase.color}18`, padding: "3px 10px", borderRadius: 20 }}>
                  {phase.name}
                </div>
              </div>
              {phase.rules.map((rule, j) => (
                <div key={j} style={{ fontSize: 13, color: "#444", display: "flex", gap: 8, padding: "4px 0", lineHeight: 1.4 }}>
                  <span style={{ color: phase.color, fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#991B1B", marginBottom: 8 }}>😴 Bad Day Protocol</div>
            {[
              "Drop all weights 15–20% for that session — no ego",
              "Do 2 sets per exercise instead of 3–4",
              "Skip optional finisher exercises entirely",
              "Still show up — 60% effort beats skipping every time",
              "Genuinely sick (fever, vomiting)? Rest completely. No exceptions.",
            ].map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: "#7F1D1D", display: "flex", gap: 8, padding: "3px 0", lineHeight: 1.4 }}>
                <span style={{ flexShrink: 0 }}>·</span><span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NEXT STEPS ── */}
      {tab === "nextsteps" && (
        <div>
          <div style={{ background: "white", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>5 Follow-Up Questions to Ask</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Tap any question to send it and get a tailored answer →</div>
            {FOLLOWUPS.map((q, i) => (
              <div key={i} onClick={() => sendPrompt(q)} style={{
                display: "flex", gap: 10, padding: "12px 0",
                borderBottom: i < FOLLOWUPS.length - 1 ? "1px solid #F3F4F6" : "none",
                cursor: "pointer", alignItems: "flex-start",
              }}>
                <div style={{
                  background: "#1C1C28", color: "white", width: 22, height: 22,
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, color: "#333", lineHeight: 1.45, fontStyle: "italic" }}>
                  "{q}"
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: 14, marginBottom: 10, fontSize: 13, color: "#14532D", lineHeight: 1.5 }}>
            <strong>🌙 Sleep note:</strong> You're getting 7–8 hours — solid. Keep it consistent. At 18, growth hormone is released primarily during deep sleep. Treat rest as part of the program, not optional downtime.
          </div>

          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 14, fontSize: 13, color: "#1E3A8A", lineHeight: 1.5 }}>
            <strong>📊 Track your weights:</strong> Keep a simple note on your phone of what you lifted each session. Progressive overload only works when you can see the numbers going up. It also tells you when something's stalling so you can adjust.
          </div>
        </div>
      )}
    </div>
  );
}

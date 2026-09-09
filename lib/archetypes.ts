import type { FullVector, SignalKey } from "./signals";

/**
 * The twelve archetypes.
 *
 * Each is a point in the eight-signal space. A result is the archetype whose
 * direction most closely matches the user's own — see scoring.ts.
 *
 * Every archetype carries a `shadow`. This is a credibility requirement, not a
 * courtesy: a result that only flatters reads as a horoscope. Naming the cost
 * is what makes the strength believable. PRD §5.4.
 */

export type Archetype = {
  id: string;
  name: string;
  tagline: string;
  primary: SignalKey;
  secondary: SignalKey;
  vector: FullVector;
  /** Two or three sentences on what this person actually does. */
  essence: string;
  /** Why the world pays for it — stage-agnostic. */
  worth: string;
  /** The cost. When the strength turns against them. */
  shadow: string;
  /** Two archetype-specific moves, merged with the stage's two. */
  moves: string[];
  /** A first-person line they can copy and actually say out loud. */
  pitch: string;
  /** Two-word feel used in the share card. */
  glyph: string;
};

const v = (parts: Partial<FullVector>): FullVector => ({
  pattern: 0,
  insight: 0,
  craft: 0,
  drive: 0,
  people: 0,
  signal: 0,
  care: 0,
  play: 0,
  ...parts,
});

export const ARCHETYPES: Archetype[] = [
  {
    id: "cartographer",
    name: "The Cartographer",
    tagline: "You map the territory nobody else can see.",
    primary: "pattern",
    secondary: "insight",
    glyph: "◈",
    vector: v({ pattern: 3, insight: 2.4, craft: 0.8, play: 0.8, signal: 0.6 }),
    essence:
      "You walk into a mess and, without particularly trying, you can see how the pieces relate. Where other people experience a pile of separate problems, you experience one problem with a shape. This is why you're often quiet early in a conversation and then say the thing that reorganises it.",
    worth:
      "Most confusion in organisations, families and projects is not a shortage of information — it's a shortage of structure. People will pay, defer and stay loyal to whoever can hand them a map, because a map converts anxiety into a plan.",
    shadow:
      "You can see the whole map before anyone else has left the car park, and you get impatient when they need to walk it themselves. You also risk building beautiful models of things nobody asked you to model. A map with no traveller is a hobby.",
    moves: [
      "Next time you see the structure, don't explain it — draw it. One page, five boxes. People adopt pictures; they resist monologues.",
      "Pick one place where you've mapped the territory but never told anyone. Tell someone this week. Unspoken clarity does nothing for you.",
    ],
    pitch:
      "I'm the person you want when the problem is a mess and nobody can agree on what it even is.",
  },
  {
    id: "translator",
    name: "The Translator",
    tagline: "You turn the complicated into the obvious.",
    primary: "signal",
    secondary: "insight",
    glyph: "◇",
    vector: v({ signal: 3, insight: 2.4, pattern: 1.2, people: 1, care: 0.6 }),
    essence:
      "You understand a thing properly and then — the rarer half — you can hand it to someone else without losing it on the way. You instinctively find the sentence, the analogy, the one example that makes a hard idea click. People leave conversations with you feeling cleverer, which is not an accident.",
    worth:
      "Expertise that can't cross a room is worth a fraction of expertise that can. Every field is full of people who know things and can't transmit them. Whoever stands in that gap ends up in the room where decisions are made, regardless of their title.",
    shadow:
      "You can make a shaky idea sound excellent, including your own. Fluency is a superpower with no built-in truth check. And because explaining is easy for you, you can end up narrating work rather than doing it.",
    moves: [
      "This week, explain something in half the words you'd normally use. Compression is where your edge actually lives.",
      "Once, deliberately, say “I don't know how to explain that yet.” It protects the currency of everything else you say.",
    ],
    pitch:
      "I take the thing everyone's confused about and make it obvious — usually in one sentence.",
  },
  {
    id: "builder",
    name: "The Builder",
    tagline: "You turn “someone should” into “it exists”.",
    primary: "craft",
    secondary: "drive",
    glyph: "▣",
    vector: v({ craft: 3, drive: 2.4, pattern: 1, care: 1, play: 0.6 }),
    essence:
      "The distance between an idea and a real object is where most people quietly give up. You don't. You'd rather have a rough working version tonight than a perfect plan next month, and once it exists you keep going back to make it better. Things you touch tend to still be standing years later.",
    worth:
      "Ideas are abundant and nearly worthless. Finished things are scarce and enormously valuable. Anyone who reliably converts one into the other is the constraint the whole system is waiting on — and everybody knows it.",
    shadow:
      "You build before you've checked whether it's the right thing to build, and sunk effort makes you defend it. You also absorb work silently — rebuilding what someone else broke instead of saying it was broken.",
    moves: [
      "Before the next build, write one sentence: who is worse off if this doesn't exist. If you can't name them, don't start.",
      "Show one unfinished thing to one person this week. Your instinct to polish first is costing you feedback you'd have wanted early.",
    ],
    pitch: "I'm the one who actually makes the thing. Not a plan for the thing — the thing.",
  },
  {
    id: "catalyst",
    name: "The Catalyst",
    tagline: "You make things happen through other people.",
    primary: "drive",
    secondary: "people",
    glyph: "◆",
    vector: v({ drive: 3, people: 2.4, signal: 1.4, play: 1, craft: 0.6 }),
    essence:
      "Rooms move faster when you're in them. You have an intolerance for stalling that most people don't, and instead of doing everything yourself you find who's already half-willing and give them the push. Momentum follows you around, and people frequently do more than they intended to.",
    worth:
      "Almost nothing fails from a shortage of talent; things fail from a shortage of motion. Someone who reliably converts a stuck group into a moving one is worth more than any individual contributor in the room, because the effect multiplies across everyone present.",
    shadow:
      "Motion can masquerade as progress. You can drag a group at speed toward something nobody has questioned — and because you're persuasive, they'll go. Slow, careful people find you exhausting; some of them are right.",
    moves: [
      "Once this week, ask “should we be doing this at all?” before you ask “who's doing it?”. You almost never do, and it's your cheapest upgrade.",
      "Name one person you've been pushing who needs backing instead. The push works; it isn't always what's needed.",
    ],
    pitch: "I get stuck things moving — usually by getting other people moving first.",
  },
  {
    id: "anchor",
    name: "The Anchor",
    tagline: "You're the reason it doesn't fall apart.",
    primary: "care",
    secondary: "craft",
    glyph: "▲",
    vector: v({ care: 3, craft: 2.4, pattern: 1.2, people: 1.2, insight: 0.6 }),
    essence:
      "You notice the thing that would have gone wrong, and you handle it before it does — usually without mentioning it. You keep the standard steady when everyone else is improvising. The clearest evidence of your work is a long run of nothing going wrong, which is precisely why it's easy to miss.",
    worth:
      "Reliability is the rarest thing in any group, and the only one that compounds. Organisations that survive have someone doing exactly this. The value is invisible in good times and blindingly obvious in the first crisis.",
    shadow:
      "Prevented disasters are invisible, so you get systematically under-credited — and you make it worse by never mentioning them. You also absorb strain silently until it costs you something real, and you can mistake “nobody complained” for “this is fine”.",
    moves: [
      "Say one of them out loud this month: “here's what would have happened if I hadn't caught that.” Not a boast. Information your team doesn't have.",
      "Find one thing you're holding together that shouldn't need holding. Fix the system instead of carrying it — that's the version of this that scales.",
    ],
    pitch: "I'm the reason things keep working when nobody's watching.",
  },
  {
    id: "inventor",
    name: "The Inventor",
    tagline: "You find the third option nobody considered.",
    primary: "play",
    secondary: "craft",
    glyph: "✳",
    vector: v({ play: 3, craft: 2.2, pattern: 1.4, insight: 1.2, drive: 1 }),
    essence:
      "When a room has narrowed to two bad choices, you're the one who says “or…” and produces something neither camp had thought of. You're constitutionally unable to accept that the current way is the only way, and you have enough making-ability to prove it rather than just suggest it.",
    worth:
      "Most competition is a race along a track everyone agreed on. Whoever can find a different track wins without racing. That capacity is rare, undelegatable, and worth disproportionately more than incremental improvement.",
    shadow:
      "You get bored precisely when a thing starts working, and boredom masquerades as “this could be better”. You also change things that were fine, which costs other people trust they'd built on the old version.",
    moves: [
      "Take one thing you've already made and improve it instead of replacing it. Sit with the boredom — that's the muscle you're missing.",
      "Before proposing the third option, say the two obvious ones out loud first. People accept novelty far more readily once they know you understood the ordinary answer.",
    ],
    pitch: "I'm the person who finds the option that wasn't on the list.",
  },
  {
    id: "connector",
    name: "The Connector",
    tagline: "You know who — and you know how to ask.",
    primary: "people",
    secondary: "signal",
    glyph: "◉",
    vector: v({ people: 3, signal: 2.4, drive: 1.4, care: 1.2, play: 0.8 }),
    essence:
      "You carry an unusually accurate map of people: who's good at what, who owes whom, who'd get on. And you actually make the introduction rather than thinking about it. Things happen around you that look like luck and are in fact a network you've been maintaining without calling it that.",
    worth:
      "Opportunity travels through people, not applications. Someone who can route a problem to the right human in one hop compresses months into a conversation — and accumulates enormous quiet leverage doing it.",
    shadow:
      "You can end up brokering everything and owning nothing, which feels productive and builds no depth. There's also a version of this that's transactional, and people can smell it from a long way off.",
    moves: [
      "Make one introduction this week with no upside for you. That's the deposit; the whole thing runs on it.",
      "Name one thing you're deep in rather than connected to. If nothing comes, that's your gap — and it's the one that eventually limits this.",
    ],
    pitch: "I know who you need to talk to, and I'll make the introduction properly.",
  },
  {
    id: "diagnostician",
    name: "The Diagnostician",
    tagline: "You find what's actually wrong, not what's loudest.",
    primary: "insight",
    secondary: "care",
    glyph: "◎",
    vector: v({ insight: 3, care: 2.2, pattern: 1.8, signal: 1, people: 0.8 }),
    essence:
      "You don't accept the presented problem. You ask two more questions than are comfortable, and you keep going until the answer stops moving. What you find is often not what anyone came in with — and you deliver it in a way people can actually hear, which is why they come back.",
    worth:
      "Most effort is spent solving the wrong problem beautifully. Someone who can identify the real one before the resources are committed saves more value than the whole team that implements the fix — and is trusted accordingly.",
    shadow:
      "You can diagnose past the point of usefulness, and “let me understand this properly first” becomes a place to hide from deciding. Being right early also isn't the same as being helpful; people sometimes need support, not accuracy.",
    moves: [
      "Set yourself a limit on the next one: two questions, then a provisional answer. You can revise it. Precision has a deadline.",
      "Once this week, notice you know what's wrong and say nothing. Not every accurate observation improves the moment it lands in.",
    ],
    pitch: "I find the real problem — usually not the one you came in with.",
  },
  {
    id: "provocateur",
    name: "The Provocateur",
    tagline: "You ask the question that reroutes the room.",
    primary: "play",
    secondary: "signal",
    glyph: "✦",
    vector: v({ play: 3, signal: 2.4, insight: 1.6, drive: 1.2, pattern: 0.8 }),
    essence:
      "You have a reliable instinct for the unsaid thing and enough nerve to say it. Not to be difficult — because the conversation was heading somewhere untrue and you can feel it. One sentence from you and a meeting changes direction. People find you slightly alarming and invite you anyway.",
    worth:
      "Groups drift toward comfortable consensus, and comfortable consensus is how expensive mistakes get unanimous approval. A person who can puncture that without blowing up the room is the cheapest insurance any group can carry.",
    shadow:
      "The line between necessary and gratuitous is thinner than it feels from the inside, and you're not always the best judge of which side you're on. Do it too often and people stop hearing the signal — they just brace for the noise.",
    moves: [
      "Spend one of these, not five. Ask the hard question once in a meeting and then genuinely help with the answer. That combination is what makes it welcome.",
      "Before you say it, ask yourself whether you want the room to change or want to be seen being brave. The honest answer will sometimes surprise you.",
    ],
    pitch: "I ask the question everyone's avoiding, and I stay to help with the answer.",
  },
  {
    id: "steward",
    name: "The Steward",
    tagline: "You make it safe to do good work.",
    primary: "care",
    secondary: "people",
    glyph: "❍",
    vector: v({ care: 3, people: 2.6, signal: 1.2, craft: 1, insight: 0.8 }),
    essence:
      "You pay attention to how people are actually doing, and you act on it. You notice who's gone quiet, who's out of their depth, who's about to burn out — and you intervene early enough to matter. People do better work around you and often can't articulate why.",
    worth:
      "Talent doesn't produce anything in an unsafe environment; it hedges. Whoever creates the conditions where people take real risks and tell the truth is generating output across everybody at once. It rarely shows on a dashboard and it's the difference between teams that last and teams that churn.",
    shadow:
      "You can protect people from things they needed to face, which is kindness that costs them growth. You also carry other people's weather, and there's a limit to that which you'll find late rather than early.",
    moves: [
      "Let one person struggle this week without stepping in. Discomfort you'd have absorbed is sometimes the whole lesson.",
      "Ask someone to do for you what you routinely do for others. You're almost certainly running a deficit and calling it a temperament.",
    ],
    pitch: "I build the conditions where people can do their best work and tell the truth.",
  },
  {
    id: "architect",
    name: "The Architect",
    tagline: "You design the thing that survives scale.",
    primary: "pattern",
    secondary: "craft",
    glyph: "▤",
    vector: v({ pattern: 3, craft: 2.6, insight: 1.6, care: 1.2, drive: 1 }),
    essence:
      "You think in systems and then you actually build them. You're the one who asks what happens when there are ten of these, or a hundred, and then designs so the answer isn't “it breaks”. You'd rather spend a week on the foundation than a year on repairs, and you're usually right about that trade.",
    worth:
      "Anything that grows eventually meets the limits of how it was designed. Someone who anticipates that before it's expensive is the reason a thing scales instead of collapsing — and the savings are enormous, if invisible, because they're the disasters that never occurred.",
    shadow:
      "You can over-build for a future that doesn't arrive, and “doing it properly” becomes an argument for delay. Elegance is genuinely seductive to you, and not every problem deserves it.",
    moves: [
      "Ship one deliberately temporary thing this week and mark it as temporary. You need practice at proportionate.",
      "Ask what actually breaks first, and design for that only. Your instinct is to protect against everything; the cost of that is arriving late.",
    ],
    pitch: "I design things so they still work when they get big.",
  },
  {
    id: "closer",
    name: "The Closer",
    tagline: "You get it over the line.",
    primary: "drive",
    secondary: "signal",
    glyph: "▶",
    vector: v({ drive: 3, signal: 2.6, people: 1.6, craft: 1.2, pattern: 0.8 }),
    essence:
      "The last ten percent is where most efforts die — the follow-ups, the final objection, the thing that needs one more push nobody has energy for. That's where you're at your best. You can hold a clear line while reading exactly what the other side needs, and you don't mistake enthusiasm for agreement.",
    worth:
      "Unfinished work has a value of zero, however good it was. Someone who reliably converts nearly-done into done — deals, decisions, sign-offs, launches — is the person the whole pipeline depends on, and the only one whose contribution is unambiguous.",
    shadow:
      "You optimise for the close, and sometimes the close isn't the win — a yes obtained at the wrong moment costs more than a no. You can also leave a trail of people who agreed and then quietly regretted it.",
    moves: [
      "On the next one, close and then check in a week later. Whether it held is your real scoreboard, not whether it landed.",
      "Let one thing take longer than you want it to. Speed is your default setting, not always the right one, and knowing the difference is what makes this senior.",
    ],
    pitch: "I take things that are nearly done and make them done.",
  },
];

export const ARCHETYPE_BY_ID = Object.fromEntries(
  ARCHETYPES.map((a) => [a.id, a]),
) as Record<string, Archetype>;

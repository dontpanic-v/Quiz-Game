/**
 * Medal
 * ─────
 * FILE    src/components/Leaderboard/Medal.jsx
 *
 * PURPOSE
 *   Flat two-tone medal for leaderboard ranks 1 to 3: a dark ring with a bright wedge
 *   in the upper-left half of the inner disc. Gold is sampled from the familiar Kaggle
 *   medal; silver and bronze reuse gold's two lightness levels (OKLCH 0.60 and 0.88)
 *   so all three read with equal weight. Every ring is at least 3:1 against white.
 *
 * EXPORT
 *   export default function Medal({ rank })   rank 1, 2 or 3; anything else renders nothing
 */
const MEDALS = {
  1: { label: 'Gold medal', dark: '#ab7522', light: '#ffd249' },
  2: { label: 'Silver medal', dark: '#7c8289', light: '#d4d8db' },
  3: { label: 'Bronze medal', dark: '#a26440', light: '#f3b680' },
}

export default function Medal({ rank }) {
  const medal = MEDALS[rank]
  if (!medal) return null

  return (
    <svg viewBox="0 0 24 24" width="22" height="22" role="img" aria-label={medal.label}>
      <circle cx="12" cy="12" r="11" fill={medal.dark} />
      {/* Upper-left half of the inner disc, cut along the bottom-left to top-right diagonal. */}
      <path d="M6.34 17.66 A8 8 0 0 1 17.66 6.34 Z" fill={medal.light} />
    </svg>
  )
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bucerias vs La Cruz vs Nuevo Nayarit",
  description:
    "Compare Bucerias, La Cruz de Huanacaxtle, and Nuevo Nayarit for Riviera Nayarit real estate buyers."
};

export default function ComparePage() {
  return (
    <main className="contentPage">
      <section className="contentHero">
        <p className="eyebrow">Area comparison</p>
        <h1>Bucerias vs La Cruz vs Nuevo Nayarit</h1>
        <p>
          These are three of the most practical starting points for many foreign buyers, but they solve different
          problems. Bucerias is social and walkable, La Cruz is marina-focused and calmer, and Nuevo Nayarit is
          planned and convenient.
        </p>
        <Link className="primaryLink" href="/">
          Take the quiz
        </Link>
      </section>

      <section className="comparisonTable" aria-label="Area comparison">
        <div>
          <h2>Bucerias</h2>
          <p>Restaurants, beach access, shops, markets, and a social rhythm that works well for snowbirds.</p>
        </div>
        <div>
          <h2>La Cruz</h2>
          <p>Marina access, seafood, quieter evenings, and a more local village feel.</p>
        </div>
        <div>
          <h2>Nuevo Nayarit</h2>
          <p>Newer condos, resort convenience, wide beaches, and easier lock-and-leave ownership.</p>
        </div>
      </section>
    </main>
  );
}

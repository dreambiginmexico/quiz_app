import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Riviera Nayarit Areas for Retirees and Snowbirds",
  description:
    "Compare Riviera Nayarit areas for retirees and snowbirds by walkability, medical access, community, services, and seasonal lifestyle."
};

export default function RetirePage() {
  return (
    <main className="contentPage">
      <section className="contentHero">
        <p className="eyebrow">Retirees and snowbirds</p>
        <h1>Best Riviera Nayarit areas for a seasonal life in Mexico</h1>
        <p>
          The right answer is rarely just the prettiest beach. Retirees and snowbirds usually need the right mix of
          walkability, services, community, healthcare access, building quality, and comfort with the local pace.
        </p>
        <Link className="primaryLink" href="/">
          Find your best-fit area
        </Link>
      </section>

      <section className="contentGrid">
        <article>
          <h2>Most practical</h2>
          <p>Bucerias and Nuevo Nayarit often make sense when convenience, social life, and services matter.</p>
        </article>
        <article>
          <h2>Quieter but connected</h2>
          <p>La Cruz can work beautifully for people who want marina culture and calmer evenings.</p>
        </article>
        <article>
          <h2>More independent</h2>
          <p>San Pancho, Lo de Marcos, and San Blas can fit buyers who are comfortable with fewer services.</p>
        </article>
      </section>
    </main>
  );
}

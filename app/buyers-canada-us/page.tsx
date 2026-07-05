import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Riviera Nayarit Areas for US and Canadian Buyers",
  description:
    "A practical guide for US and Canadian buyers comparing Riviera Nayarit towns by walkability, beach access, restaurants, ownership ease, and lifestyle fit."
};

export default function BuyersCanadaUsPage() {
  return (
    <main className="contentPage">
      <section className="contentHero">
        <p className="eyebrow">US and Canadian buyers</p>
        <h1>Where should foreign buyers start in Riviera Nayarit?</h1>
        <p>
          Start with the lifestyle question, then test the real estate details: building quality, HOA rules,
          property management, medical access, rental rules, and how easy the area is to use for a full season.
        </p>
        <Link className="primaryLink" href="/">
          Take the area quiz
        </Link>
      </section>

      <section className="contentGrid">
        <article>
          <h2>Bucerias</h2>
          <p>Best first look for buyers who want walkability, restaurants, services, and broad resale appeal.</p>
        </article>
        <article>
          <h2>Nuevo Nayarit / Flamingos</h2>
          <p>Best for condo convenience, newer infrastructure, wide beaches, and a smoother ownership experience.</p>
        </article>
        <article>
          <h2>La Cruz</h2>
          <p>Best for a quieter marina-town lifestyle with seafood, boating, and village texture.</p>
        </article>
        <article>
          <h2>Punta Mita</h2>
          <p>Best for luxury buyers who want privacy, golf, premium amenities, and polished service.</p>
        </article>
      </section>
    </main>
  );
}

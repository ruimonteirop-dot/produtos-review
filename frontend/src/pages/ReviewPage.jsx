import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "../components/clean/Header";
import { Footer } from "../components/clean/Footer";
import { PriceButton } from "../components/clean/Base";
import { api, imgSrc } from "../lib/api";
import { parseBody, inlineParts } from "../lib/body";
import { DISCLOSURE_AFFILIATE, DISCLOSURE_GIFT, formatScore, SITE } from "../data/reviews";

const Inline = ({ text }) => inlineParts(text).map((p, i) => (p.bold ? <strong key={i}>{p.text}</strong> : <span key={i}>{p.text}</span>));

const Body = ({ text }) => (
  <div className="review-body">
    {parseBody(text).map((b, i) => {
      if (b.type === "h2") return <h2 key={i} className="font-display text-3xl sm:text-4xl tracking-[-0.02em] mt-14 mb-4">{b.text}</h2>;
      if (b.type === "h3") return <h3 key={i} className="font-display text-xl mt-8 mb-2">{b.text}</h3>;
      if (b.type === "ul") return (
        <ul key={i} className="my-5 space-y-2 pl-5 list-disc marker:text-[var(--accent)]">
          {b.items.map((it, j) => <li key={j} className="leading-relaxed"><Inline text={it} /></li>)}
        </ul>
      );
      return <p key={i} className="my-4 leading-[1.75] text-[17px]"><Inline text={b.text} /></p>;
    })}
  </div>
);

const setMeta = (name, content, attr = "name") => {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute("content", content);
};

export default function ReviewPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, review: null });
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    let alive = true;
    window.scrollTo(0, 0);
    api.get(`/reviews/${slug}`)
      .then((res) => alive && setState({ loading: false, review: res.data }))
      .catch(() => alive && setState({ loading: false, review: null }));
    return () => { alive = false; };
  }, [slug]);

  const r = state.review;
  useEffect(() => {
    if (!r) return;
    document.title = `${r.name}: review | ${SITE.name}`;
    setMeta("description", r.summary || `Review do ${r.name}`);
  }, [r]);

  if (state.loading) return <div className="min-h-screen" />;

  if (!r) return (
    <div className="App">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-40 pb-32">
        <h1 className="font-display text-4xl tracking-tight">Esta review não existe ou foi retirada.</h1>
        <Link to="/" className="mt-8 inline-block underline underline-offset-4">Ver todas as reviews</Link>
      </main>
      <Footer />
    </div>
  );

  const [main, ...rest] = r.photos || [];
  return (
    <div data-testid="review-page" className="App">
      <Header />
      <main>
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-32 sm:pt-40 pb-14 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <p className="text-sm text-[var(--muted)]">
              <Link to="/" className="hover:text-[var(--ink)]">Reviews</Link> / {r.category}
            </p>
            <h1 className="font-display tracking-[-0.035em] leading-[1.02] text-5xl sm:text-6xl mt-5">{r.name}</h1>
            {r.summary && <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed max-w-xl">{r.summary}</p>}
            <p className="mt-6 text-sm text-[var(--muted)]">
              {r.vine ? "Produto oferecido para teste. " : ""}
              <a href="#divulgacao-review" className="underline underline-offset-4 hover:text-[var(--ink)]">Contém links de afiliado</a>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <PriceButton url={r.price_url} testId="review-price-top" label="Ver preço na Amazon" />
              {r.score != null && (
                <p className="font-display text-5xl tracking-tight leading-none">
                  {formatScore(r.score)}<span className="text-base text-[var(--muted)]">/10</span>
                </p>
              )}
            </div>
          </div>
          <div className="lg:col-span-6">
            {main && <img src={imgSrc(main.src)} alt={`${r.name}: ${main.label}`} className="w-full rounded-[28px] aspect-[4/3] object-cover bg-[var(--surface)]" />}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-[28px] bg-[var(--surface)] p-6 sm:p-10 grid md:grid-cols-2 gap-10">
            <div>
              <p className="font-display text-xl mb-4">Gostei</p>
              <ul className="space-y-3">{(r.pros || []).map((t) => <li key={t} className="flex gap-3"><span className="text-[var(--accent)] font-medium">+</span>{t}</li>)}</ul>
            </div>
            <div>
              <p className="font-display text-xl mb-4">Menos bom</p>
              <ul className="space-y-3">{(r.cons || []).map((t) => <li key={t} className="flex gap-3"><span className="text-[var(--muted)] font-medium">−</span>{t}</li>)}</ul>
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
          <Body text={r.body} />

          {rest.length > 0 && (
            <>
              <h2 className="font-display text-3xl sm:text-4xl tracking-[-0.02em] mt-14 mb-5">Fotos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {rest.map((p) => (
                  <button key={p.src} type="button" onClick={() => setZoom(p)} className="overflow-hidden rounded-2xl bg-[var(--surface)] cursor-zoom-in">
                    <img src={imgSrc(p.src)} alt={`${r.name}: ${p.label}`} loading="lazy" className="w-full aspect-[4/3] object-cover" />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">Fotos próprias. Toca para ampliar.</p>
            </>
          )}

          {r.specs?.length > 0 && (
            <>
              <h2 className="font-display text-3xl sm:text-4xl tracking-[-0.02em] mt-14 mb-5">Especificações</h2>
              <dl className="border-t border-[var(--line)]">
                {r.specs.map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-[40%_1fr] gap-4 py-3 border-b border-[var(--line)] text-[15px]">
                    <dt className="text-[var(--muted)]">{label}</dt><dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <div className="mt-14 rounded-[24px] bg-[var(--ink)] text-[var(--on-ink)] p-8">
            <p className="font-display text-2xl">{r.name}</p>
            {r.score != null && <p className="mt-2 opacity-70">Nota {formatScore(r.score)}/10</p>}
            <div className="mt-6"><PriceButton url={r.price_url} testId="review-price-bottom" label="Ver preço na Amazon" dark={false} /></div>
          </div>

          <p id="divulgacao-review" className="mt-10 pt-6 border-t border-[var(--line)] text-sm text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--ink)]">Transparência.</strong> {r.vine ? `${DISCLOSURE_GIFT} ` : ""}{DISCLOSURE_AFFILIATE}
          </p>
        </article>
      </main>
      <Footer />

      {zoom && (
        <div role="dialog" aria-modal="true" aria-label={zoom.label} onClick={() => setZoom(null)} className="fixed inset-0 z-[60] bg-black/85 grid place-items-center p-4 cursor-zoom-out">
          <img src={imgSrc(zoom.src)} alt={`${r.name}: ${zoom.label}`} className="max-h-[88vh] max-w-full rounded-2xl" />
          <button type="button" onClick={() => setZoom(null)} className="absolute top-4 right-4 rounded-full bg-white text-black px-4 py-2 text-sm font-medium">Fechar</button>
        </div>
      )}
    </div>
  );
}

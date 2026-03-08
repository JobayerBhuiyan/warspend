import { getTrackerData } from "@/lib/getTrackerData";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { CountdownClock } from "@/components/CountdownClock";
import { GasPriceTracker } from "@/components/GasPriceTracker";
import { StatCard } from "@/components/StatCard";
import dynamic from "next/dynamic";
const CostComparisonChart = dynamic(
  () => import("@/components/CostComparisonChart").then((mod) => mod.CostComparisonChart),
  { loading: () => <div className="h-64 animate-pulse rounded-2xl glass" /> }
);
import { CostRates } from "@/components/CostRates";
import { CostTimeline } from "@/components/CostTimeline";
import { LatestNews } from "@/components/LatestNews";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AdSense } from "@/components/AdSense";
import {
  Users,
  Swords,
  Building2,
  ExternalLink,
  Phone,
  AlertTriangle,
  Shield,
  Megaphone,
} from "lucide-react";

export const revalidate = 900;

export default async function Home() {
  const data = await getTrackerData();

  return (
    <div className="min-h-screen">
      <AdSense />

      {/* ─── Top Banner ────────────────────────────────── */}
      <div className="border-b border-white/5 bg-gradient-to-r from-red-950/30 via-transparent to-red-950/30">
        <div className="mx-auto max-w-4xl px-4 py-2.5 flex items-center justify-center gap-2 text-xs font-mono tracking-[0.15em] text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-live-dot" />
          <span>LIVE ESTIMATE</span>
          <span className="text-zinc-700">·</span>
          <span>{data.trackerConfig.operationName.toUpperCase()}</span>
          <span className="text-zinc-700">·</span>
          <span>{data.trackerConfig.strikesStartLabel.toUpperCase()}</span>
        </div>
      </div>

      {/* ─── Hero Header ───────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 20, 20, 0.15), transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-4xl px-4 pt-10 pb-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold tracking-[0.1em] text-zinc-200 uppercase">
            Iran War Cost Tracker
          </h1>
          <p className="mt-2 text-sm text-zinc-500 tracking-wide">
            Estimated U.S. Taxpayer Spending
          </p>

          {/* Pentagon estimate link */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-xs font-mono tracking-[0.1em] text-zinc-400">
            BASED ON THE{" "}
            <a
              href="https://x.com/nancyayoussef/status/2029260834564604070"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-zinc-600 underline-offset-2 hover:text-zinc-200 transition-colors"
            >
              PENTAGON&apos;S PRELIMINARY ESTIMATE
            </a>{" "}
            OF $1 BILLION PER DAY
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">

        {/* ─── Main Counter ────────────────────────────── */}
        <ScrollReveal>
          <section className="relative rounded-2xl glass p-8 sm:p-12 animate-pulse-glow overflow-hidden text-center">
            <div
              className="absolute inset-0 opacity-[0.015] pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
              }}
            />

            <div className="relative">
              <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">
                Est. U.S. Cost Since Strikes Began
              </p>
              <div className="mt-4">
                <AnimatedCounter
                  startDateIso={data.startDateIso}
                  dailyCostUsd={data.trackerConfig.dailyCostUsd}
                  className="text-4xl font-bold text-gradient-red sm:text-5xl md:text-6xl lg:text-7xl"
                />
              </div>
              <p className="mt-4 text-sm text-zinc-500 font-mono">
                ${(data.trackerConfig.dailyCostUsd).toLocaleString()} / day · Pentagon estimate via congressional official
              </p>

              {/* Countdown Clock */}
              <div className="mt-6">
                <CountdownClock startDateIso={data.startDateIso} />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── Cost Rates & Share ──────────────────────── */}
        <ScrollReveal delay={0.1}>
          <CostRates dailyCostUsd={data.trackerConfig.dailyCostUsd} />
        </ScrollReveal>

        {/* ─── Pain at the Pump ────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <GasPriceTracker
            preConflictPrice={data.gasPrices.preConflictPrice}
            currentPrice={data.gasPrices.currentPrice}
            brentCrudePrice={data.gasPrices.brentCrudePrice}
            brentCrudeChange={data.gasPrices.brentCrudeChange}
          />
        </ScrollReveal>

        {/* ─── Real Cost / Missile Defense ─────────────── */}
        <ScrollReveal delay={0.1}>
          <section>
            <h2 className="text-xs font-mono font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">
              The Real Cost May Be Higher
            </h2>
            <div className="rounded-xl glass overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-xs font-mono font-semibold tracking-[0.15em] text-red-400 uppercase">
                  Missile Defense Alone: ~$5 Billion / Day
                </span>
              </div>
              <div className="p-5">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Jennifer Kavanagh of Defense Priorities estimates the U.S.{" "}
                  <strong className="text-zinc-200">&quot;easily&quot; spent more than $10 billion on air-defense systems in the first 48 hours</strong>.
                  Iran launched 2,000+ drones and 500+ ballistic missiles (CSIS).
                  CSIS separately estimates interceptor costs at{" "}
                  <strong className="text-zinc-200">$1.2B–$3.7B</strong> for the first 100 hours.
                </p>

                {/* Equipment cost table */}
                <div className="mt-5 space-y-0">
                  {[
                    { label: "THAAD interceptor", value: `$${data.equipmentCosts.thaadInterceptor.toLocaleString()} each`, color: "text-red-400" },
                    { label: "Patriot PAC-3", value: `$${data.equipmentCosts.patriotPac3.toLocaleString()} each`, color: "text-red-400" },
                    { label: "Iranian Shahed-136 drone", value: `$${data.equipmentCosts.iranianShahed136.toLocaleString()} each`, color: "text-red-400" },
                    { label: "Cost ratio (interceptor vs. drone)", value: `${data.costRatio} : 1`, color: "text-amber-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.03] last:border-0">
                      <span className="text-sm text-zinc-400">{row.label}</span>
                      <span className={`text-sm font-mono font-medium tabular-nums ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs text-zinc-500 italic">
                  Source: NYT DealBook, Mar 4, 2026 (Niko Gallogly)
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── Cost Comparison Chart ───────────────────── */}
        <ScrollReveal delay={0.1}>
          <section className="rounded-2xl glass p-6 sm:p-8">
            <CostComparisonChart
              data={data.costComparisonChartData}
              costRatio={data.costRatio}
            />
          </section>
        </ScrollReveal>

        {/* ─── Stockpile Depletion ─────────────────────── */}
        <ScrollReveal delay={0.1}>
          <section>
            <h2 className="text-xs font-mono font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">
              Stockpile Depletion
            </h2>
            <div className="rounded-xl glass overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
                <Shield className="h-4 w-4 text-red-400" />
                <span className="text-xs font-mono font-semibold tracking-[0.15em] text-red-400 uppercase">
                  Interceptor Inventory
                </span>
              </div>
              <div className="p-5 space-y-0">
                {[
                  { label: "THAAD interceptors (Dec 2025)", value: String(data.stockpile.totalThaadInterceptors), color: "text-zinc-200" },
                  { label: `Used in June 2025 (12-day war)`, value: `${data.stockpile.usedInJune2025War} THAAD`, color: "text-red-400" },
                  { label: "THAAD production rate", value: "96/yr → 400/yr (ramping)", color: "text-red-400" },
                  { label: "PAC-3 production rate", value: "~600/yr → 2,000/yr (ramping)", color: "text-red-400" },
                  { label: "Full depletion at current usage", value: "4–5 weeks", color: "text-amber-400" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.03] last:border-0">
                    <span className="text-sm text-zinc-400">{row.label}</span>
                    <span className={`text-sm font-mono font-medium tabular-nums ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  In June 2025&apos;s 12-day war, the U.S. expended{" "}
                  <strong className="text-zinc-200">up to 30% of its THAAD stockpile</strong>.
                  Production cannot keep pace: even at quadrupled rates, replacing {data.stockpile.usedInJune2025War} THAAD interceptors
                  takes <strong className="text-zinc-200">nearly 5 months</strong>.
                </p>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                  At sustained conflict consumption, the entire U.S. interceptor stockpile could be{" "}
                  <strong className="text-red-400">exhausted in 4–5 weeks</strong> — creating vulnerabilities for{" "}
                  <strong className="text-zinc-200">NATO, Ukraine, Taiwan, and Japan</strong>, all of which depend on U.S. defense supplies.
                </p>
                <p className="mt-3 text-xs text-zinc-500 italic">
                  Source: Military Times, Mar 6, 2026
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── Timeline ────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <section>
            <CostTimeline extraEvents={data.timelineEvents} />
          </section>
        </ScrollReveal>

        {/* ─── Human Cost ──────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <section>
            <div className="section-divider mb-8" />
            <h2 className="text-xs font-mono font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-6 text-center">
              The Human Cost
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl glass p-6 text-center" style={{ borderTop: "2px solid rgba(59, 130, 246, 0.4)" }}>
                <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">U.S. Service Members</p>
                <p className="mt-3 text-3xl font-bold text-blue-400 tabular-nums">{data.humanCost.usKilled}</p>
                <p className="text-sm text-zinc-500">killed</p>
                <p className="mt-2 text-2xl font-bold text-blue-400 tabular-nums">{data.humanCost.usWounded}</p>
                <p className="text-sm text-zinc-500">wounded</p>
              </div>
              <div className="rounded-xl glass p-6 text-center" style={{ borderTop: "2px solid rgba(239, 68, 68, 0.4)" }}>
                <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">Iranian Military</p>
                <p className="mt-3 text-3xl font-bold text-red-400 tabular-nums">{data.humanCost.iranianMilitaryKilled.toLocaleString()}+</p>
                <p className="text-sm text-zinc-500">killed</p>
                <p className="mt-2 text-xs text-zinc-500 uppercase tracking-wider">{data.humanCost.iranianMilitaryNote}</p>
              </div>
              <div className="rounded-xl glass p-6 text-center" style={{ borderTop: "2px solid rgba(245, 158, 11, 0.4)" }}>
                <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">Iranian Civilians</p>
                <p className="mt-3 text-3xl font-bold text-amber-400 tabular-nums">{data.humanCost.iranianCiviliansKilled.toLocaleString()}+</p>
                <p className="text-sm text-zinc-500">killed</p>
                <p className="mt-2 text-2xl font-bold text-amber-400 tabular-nums">{data.humanCost.iranianCiviliansWounded.toLocaleString()}+</p>
                <p className="text-sm text-zinc-500">wounded</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-zinc-500 text-center font-mono">
              Sources: DoD/CENTCOM, Hengaw, Iranian Red Crescent, AP, Reuters, Al Jazeera
            </p>
          </section>
        </ScrollReveal>

        {/* ─── Other Estimates ─────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <section>
            <h2 className="text-xs font-mono font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">
              Other Estimates
            </h2>
            <div className="rounded-xl glass overflow-hidden">
              {data.otherEstimates.map((est) => (
                <div
                  key={`${est.source}-${est.label}`}
                  className="flex items-center justify-between px-5 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm text-zinc-400">
                    {est.source} — {est.label}
                  </span>
                  <span className="text-sm font-mono font-medium text-red-400 tabular-nums">
                    {est.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ─── Latest News ─────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <LatestNews items={data.latestNews} />
        </ScrollReveal>

        {/* ─── Sources ─────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <section>
            <h2 className="text-xs font-mono font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">
              Sources
            </h2>
            <div className="rounded-xl glass p-5">
              <ul className="space-y-2 text-sm text-zinc-500">
                {[
                  { text: "Nancy Youssef (WSJ)", href: "https://x.com/nancyayoussef/status/2029260834564604070", desc: "Pentagon preliminary estimate: $1B/day via congressional official" },
                  { text: "NYT DealBook (Niko Gallogly, Mar 4 2026)", href: "https://www.nytimes.com/2026/03/04/business/dealbook/iran-war-cost.html", desc: "Kavanagh/Defense Priorities interceptor analysis" },
                  { text: "Military Times (Mar 6, 2026)", href: null, desc: "Interceptor stockpile data, production rates, depletion timeline" },
                  { text: "CSIS (Cancian & Park, Mar 5 2026)", href: "https://www.csis.org/", desc: "$3.7B first 100 hours; munitions, aircraft losses, interceptor breakdown" },
                  { text: "Penn Wharton Budget Model (Kent Smetters)", href: "https://budgetmodel.wharton.upenn.edu/", desc: "$40B–$95B direct, up to $210B economic impact" },
                  { text: "Center for American Progress", href: "https://www.americanprogress.org/", desc: ">$5B through Day 4" },
                  { text: "DoD Comptroller FY2024/25", href: "https://comptroller.defense.gov/", desc: "reimbursable flight-hour rates" },
                  { text: "Congressional Budget Office (CBO)", href: "https://www.cbo.gov/", desc: "cost reports" },
                  { text: "Government Accountability Office (GAO)", href: "https://www.gao.gov/", desc: "sustainment reports" },
                  { text: "Brown University Costs of War Project", href: "https://watson.brown.edu/costsofwar/", desc: null },
                  { text: "AAA Gas Prices", href: "https://gasprices.aaa.com/", desc: "National average gas price data; +$0.27/week post-conflict" },
                  { text: "DoD/CENTCOM official statements", href: null, desc: null },
                  { text: "AP, Reuters, AFP, Al Jazeera reporting", href: null, desc: null },
                ].map((src) => (
                  <li key={src.text} className="leading-relaxed">
                    <span className="text-zinc-600">· </span>
                    {src.href ? (
                      <a href={src.href} target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline decoration-zinc-700 underline-offset-2 hover:text-zinc-100 transition-colors">
                        {src.text}
                      </a>
                    ) : (
                      <span className="text-zinc-400">{src.text}</span>
                    )}
                    {src.desc && <span className="text-zinc-500"> — {src.desc}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── Methodology Footer ──────────────────────── */}
        <ScrollReveal delay={0.1}>
          <div className="text-center">
            <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl mx-auto">
              This tracker exists because the public deserves real-time transparency about the cost of military
              operations — not just after-the-fact reports years later. The counter uses the{" "}
              <a
                href="https://x.com/nancyayoussef/status/2029260834564604070"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 font-semibold underline decoration-zinc-600 underline-offset-2 hover:text-zinc-100 transition-colors"
              >
                Pentagon&apos;s own preliminary estimate
              </a>{" "}
              of $1 billion per day. Independent analyses suggest the true cost may be significantly higher.
            </p>
            {data.lastUpdated && (
              <p className="mt-4 text-xs text-zinc-500">
                Data updated {new Date(data.lastUpdated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* ─── CTAs ────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <div className="space-y-4">
            {/* Sign the Petition */}
            <a
              href="https://act.winwithoutwar.org/sign/supplemental-funding-iran?source=costs-of-war"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl glass glass-hover p-5 transition-all duration-300"
              style={{ borderLeft: "2px solid rgba(239, 68, 68, 0.4)" }}
            >
              <div className="rounded-lg bg-red-500/10 p-2.5">
                <Megaphone className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-mono font-semibold tracking-[0.15em] text-red-400 uppercase">
                  Sign the Petition
                </p>
                <p className="mt-0.5 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  Demand Congress block supplemental funding for unauthorized military action in Iran
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-red-400 transition-colors" />
            </a>

            {/* Call Your Rep */}
            <a
              href="https://www.house.gov/representatives/find-your-representative"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl glass glass-hover p-5 transition-all duration-300"
              style={{ borderLeft: "2px solid rgba(59, 130, 246, 0.4)" }}
            >
              <div className="rounded-lg bg-blue-500/10 p-2.5">
                <Phone className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-mono font-semibold tracking-[0.15em] text-blue-400 uppercase">
                  Call Your Representative
                </p>
                <p className="mt-0.5 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  Demand Congress invoke the War Powers Resolution to end unauthorized military action in Iran
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
            </a>
          </div>
        </ScrollReveal>
      </main>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="mt-8 border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row">
          <p>War Spend Tracker · Built for transparency</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

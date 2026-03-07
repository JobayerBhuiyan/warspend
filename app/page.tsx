import { getTrackerData } from "@/lib/getTrackerData";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { DaysElapsed } from "@/components/DaysElapsed";
import { CostComparisonChart } from "@/components/CostComparisonChart";
import { StatCard } from "@/components/StatCard";
import { CostRates } from "@/components/CostRates";
import { CostTimeline } from "@/components/CostTimeline";
import {
  Users,
  Swords,
  Building2,
  ExternalLink,
  Phone,
} from "lucide-react";

export const revalidate = 3600;

export default async function Home() {
  const data = await getTrackerData();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Live Estimate · {data.trackerConfig.operationName} ·{" "}
            {data.trackerConfig.strikesStartLabel}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Iran War Cost Tracker
          </h1>
          <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400">
            Estimated U.S. Taxpayer Spending
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Main counter */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-12">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Est. U.S. Cost Since Strikes Began
            </p>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
              Live
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <AnimatedCounter
              startDateIso={data.startDateIso}
              dailyCostUsd={data.trackerConfig.dailyCostUsd}
              className="text-4xl font-bold text-red-600 dark:text-red-400 sm:text-5xl md:text-6xl"
            />
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            <DaysElapsed
              startDateIso={data.startDateIso}
              className="font-medium"
            />{" "}
            · ${(data.trackerConfig.dailyCostUsd / 1e9).toFixed(1)} billion / day ·
            Pentagon estimate via congressional official
          </p>
        </section>

        {/* Cost Rates and Sharing */}
        <section className="mt-8">
          <CostRates dailyCostUsd={data.trackerConfig.dailyCostUsd} />
        </section>

        {/* Real cost warning */}
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/30">
          <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
            The Real Cost May Be Higher
          </h2>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            Jennifer Kavanagh of Defense Priorities estimates the U.S.{" "}
            <strong>&quot;easily&quot;</strong> spent more than $10 billion on
            air-defense systems in the first 48 hours. Iran launched 2,000+
            drones and 771+ ballistic missiles, each requiring interceptors
            costing millions.
          </p>
        </section>

        {/* Cost comparison chart */}
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <CostComparisonChart
            data={data.costComparisonChartData}
            costRatio={data.costRatio}
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                THAAD interceptor
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                ${data.equipmentCosts.thaadInterceptor.toLocaleString()} each
              </p>
            </div>
            <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Patriot PAC-3
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                ${data.equipmentCosts.patriotPac3.toLocaleString()} each
              </p>
            </div>
            <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Iranian Shahed-136 drone
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                ${data.equipmentCosts.iranianShahed136.toLocaleString()} each
              </p>
            </div>
          </div>
        </section>

        {/* Stockpile depletion */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Stockpile Depletion
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            In Israel&apos;s 12-day war in June 2025, the U.S. used ~
            {data.stockpile.usedInJune2025War} of its ~{data.stockpile.totalThaadInterceptors}{" "}
            THAAD interceptors — a quarter of the entire stockpile. In 2025, the
            U.S. purchased only {data.stockpile.purchased2025} new THAAD
            interceptors, with {data.stockpile.planned2026} more planned for 2026.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            At current consumption rates, interceptor depletion creates
            vulnerabilities for <strong>NATO, Ukraine, Taiwan, and Japan</strong>{" "}
            — all of which depend on U.S. defense supplies.
          </p>
        </section>

        {/* What has that money bought / Human cost */}
        <section className="mt-10">
          <CostTimeline />

          <h3 className="mt-12 mb-4 text-lg font-medium text-zinc-800 dark:text-zinc-200">
            The Human Cost
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="U.S. Service Members"
              value={`${data.humanCost.usKilled} killed`}
              subtitle={`${data.humanCost.usWounded} wounded`}
              icon={<Users className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />}
              delay={0}
            />
            <StatCard
              title="Iranian Military"
              value={`${data.humanCost.iranianMilitaryKilled} killed`}
              subtitle={data.humanCost.iranianMilitaryNote}
              icon={<Swords className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />}
              delay={0.05}
            />
            <StatCard
              title="Iranian Civilians"
              value={`${data.humanCost.iranianCiviliansKilled} killed`}
              subtitle={`${data.humanCost.iranianCiviliansWounded} wounded`}
              icon={<Building2 className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />}
              delay={0.1}
            />
          </div>
        </section>

        {/* Other estimates */}
        <section className="mt-10">
          <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Other Estimates
          </h2>
          <div className="space-y-3">
            {data.otherEstimates.map((est) => (
              <div
                key={est.source}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {est.source}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {est.label}
                  </p>
                </div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {est.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology & sources */}
        <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Methodology & Sources
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {data.methodologyText}
          </p>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            {data.methodologyFooter}
          </p>
          {data.lastUpdated && (
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              Data updated {new Date(data.lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </section>

        {/* CTA */}
        <section className="mt-10 rounded-2xl border-2 border-zinc-900 bg-zinc-900 p-6 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Call Your Representative</h2>
              <p className="mt-1 text-sm opacity-90">
                Demand Congress invoke the War Powers Resolution to end
                unauthorized military action in Iran
              </p>
            </div>
            <a
              href="https://www.house.gov/representatives/find-your-representative"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              <Phone className="h-5 w-5" />
              Find Your Rep
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-zinc-200 py-6 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          War Cost Tracker · Built for transparency
        </div>
      </footer>
    </div>
  );
}

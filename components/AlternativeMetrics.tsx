"use client";

import { useEffect, useState } from "react";
import { Home, Brain, Baby, GraduationCap } from "lucide-react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TOTAL_US_HOMELESS = 653104; // HUD 2023 AHAR estimate

interface AlternativeMetricsProps {
  startDateIso: string;
  dailyCostUsd: number;
  costs: {
    homelessHoused: number;
    mentalHealthTreated: number;
    childrenFed: number;
    studentLoansForgiven: number;
  };
}

export function AlternativeMetrics({
  startDateIso,
  dailyCostUsd,
  costs,
}: AlternativeMetricsProps) {
  const startTime = new Date(startDateIso).getTime();
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState({
    homeless: 0,
    mentalHealth: 0,
    children: 0,
    students: 0,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let animationFrameId: number;

    const animate = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const days = elapsed / MS_PER_DAY;
      const totalCostUsd = days * dailyCostUsd;

      setMetrics({
        homeless: Math.floor(totalCostUsd / costs.homelessHoused),
        mentalHealth: Math.floor(totalCostUsd / costs.mentalHealthTreated),
        children: Math.floor(totalCostUsd / costs.childrenFed),
        students: Math.floor(totalCostUsd / costs.studentLoansForgiven),
      });

      // We use requestAnimationFrame to keep it buttery smooth with the main counter
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, startTime, dailyCostUsd, costs]);

  if (!mounted) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl glass p-6 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Homeless Housed",
      value: metrics.homeless,
      icon: Home,
      color: "text-emerald-400",
      border: "rgba(16, 185, 129, 0.4)",
      desc: `for 1yr (${((metrics.homeless / TOTAL_US_HOMELESS) * 100).toFixed(1)}% of US total)`,
    },
    {
      label: "Mental Health Treated",
      value: metrics.mentalHealth,
      icon: Brain,
      color: "text-purple-400",
      border: "rgba(168, 85, 247, 0.4)",
      desc: "patients per year",
    },
    {
      label: "Children Fed",
      value: metrics.children,
      icon: Baby,
      color: "text-pink-400",
      border: "rgba(244, 114, 182, 0.4)",
      desc: "for one year",
    },
    {
      label: "Student Loans Forgiven",
      value: metrics.students,
      icon: GraduationCap,
      color: "text-sky-400",
      border: "rgba(56, 189, 248, 0.4)",
      desc: "borrowers completely",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-xs font-mono font-semibold tracking-[0.2em] text-zinc-500 uppercase text-center">
          What Else Could This Fund?
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-xl glass p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]"
              style={{ borderTop: `2px solid ${item.border}` }}
            >
              <div className="mb-3 p-2.5 rounded-full bg-white/5">
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <p className="text-xs font-mono tracking-[0.1em] text-zinc-400 uppercase mb-2">
                {item.label}
              </p>
              <p className={`text-2xl font-bold ${item.color} tabular-nums`}>
                {item.value.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-5 text-[10px] text-zinc-500 text-center font-mono max-w-4xl mx-auto space-y-1.5">
        <p>
          <strong>Housing:</strong> ~$40k/yr (
          <a
            href="https://endhomelessness.org/resource/ending-chronic-homelessness-saves-taxpayers-money-2/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 underline underline-offset-2"
          >
            Permanent Supportive Housing est.
          </a>
          ) •{" "}
          <strong>Mental Health:</strong> ~$10k/yr (
          <a
            href="https://www.psychiatry.org/patients-families/what-is-mental-illness"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 underline underline-offset-2"
          >
            Intensive Outpatient Care
          </a>
          )
        </p>
        <p>
          <strong>Child Nutrition:</strong> ~$106/yr (
          <a
            href="https://www.fmsc.org/about-us"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 underline underline-offset-2"
          >
            $0.29/meal via Feed My Starving Children
          </a>
          ) •{" "}
          <strong>Student Debt:</strong> ~$37k/borrower (
          <a
            href="https://educationdata.org/student-loan-debt-statistics"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 underline underline-offset-2"
          >
            Education Data Initiative
          </a>
          )
        </p>
        <p className="text-zinc-600/80 mt-2">
          * US homeless population baseline: 653,104 (
          <a
            href="https://www.huduser.gov/portal/sites/default/files/pdf/2023-AHAR-Part-1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 underline underline-offset-2"
          >
            HUD 2023 AHAR Report
          </a>
          )
        </p>
      </div>
    </div>
  );
}

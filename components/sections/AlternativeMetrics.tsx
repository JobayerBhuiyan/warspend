"use client";

import { useEffect, useRef } from "react";
import { Home, Brain, Baby, GraduationCap } from "lucide-react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TOTAL_US_HOMELESS = 770000; // HUD 2024 AHAR estimate
const numFmt = new Intl.NumberFormat("en-US");

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
  const homelessRef = useRef<HTMLParagraphElement>(null);
  const mentalRef = useRef<HTMLParagraphElement>(null);
  const childrenRef = useRef<HTMLParagraphElement>(null);
  const studentsRef = useRef<HTMLParagraphElement>(null);
  const homelessDescRef = useRef<HTMLParagraphElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const valueRefs = [homelessRef, mentalRef, childrenRef, studentsRef];
    const costDivisors = [costs.homelessHoused, costs.mentalHealthTreated, costs.childrenFed, costs.studentLoansForgiven];

    const update = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const days = elapsed / MS_PER_DAY;
      const totalCostUsd = days * dailyCostUsd;

      for (let i = 0; i < 4; i++) {
        const val = Math.floor(totalCostUsd / costDivisors[i]);
        const ref = valueRefs[i];
        if (ref.current) {
          ref.current.textContent = numFmt.format(val);
        }
        if (i === 0 && homelessDescRef.current) {
          homelessDescRef.current.textContent = `for 1yr (${((val / TOTAL_US_HOMELESS) * 100).toFixed(1)}% of US total)`;
        }
      }
    };

    update();
    const intervalId = setInterval(update, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, dailyCostUsd, costs]);

  const items = [
    {
      label: "Homeless Housed",
      ref: homelessRef,
      descRef: homelessDescRef,
      icon: Home,
      color: "text-emerald-400",
      border: "rgba(16, 185, 129, 0.4)",
      desc: "for 1yr",
    },
    {
      label: "Mental Health Treated",
      ref: mentalRef,
      icon: Brain,
      color: "text-purple-400",
      border: "rgba(168, 85, 247, 0.4)",
      desc: "patients per year",
    },
    {
      label: "Children Fed",
      ref: childrenRef,
      icon: Baby,
      color: "text-pink-400",
      border: "rgba(244, 114, 182, 0.4)",
      desc: "for one year",
    },
    {
      label: "Student Loans Forgiven",
      ref: studentsRef,
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
              className="rounded-xl glass p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-[1.02]"
              style={{ borderTop: `2px solid ${item.border}` }}
            >
              <div className="mb-3 p-2.5 rounded-full bg-white/5">
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <p className="text-xs font-mono tracking-[0.1em] text-zinc-400 uppercase mb-2">
                {item.label}
              </p>
              <p ref={item.ref} className={`text-2xl font-bold ${item.color} tabular-nums`}>
                0
              </p>
              <p ref={item.descRef} className="text-xs text-zinc-500 mt-1">{item.desc}</p>
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
          * US homeless population baseline: 770,000 (
          <a
            href="https://www.huduser.gov/portal/sites/default/files/pdf/2024-AHAR-Part-1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 underline underline-offset-2"
          >
            HUD 2024 AHAR Report
          </a>
          )
        </p>
      </div>
    </div>
  );
}

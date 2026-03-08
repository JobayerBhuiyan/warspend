import { ShareActions } from "./ShareActions";

export function CostRates({ dailyCostUsd }: { dailyCostUsd: number }) {
    const perSecond = Math.round(dailyCostUsd / 24 / 60 / 60);
    const perHour = Math.round(dailyCostUsd / 24);
    const perDay = dailyCostUsd;

    const rates = [
        { label: "Per Second", value: perSecond },
        { label: "Per Hour", value: perHour },
        { label: "Per Day", value: perDay },
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-3xl">
                {rates.map((rate) => (
                    <div
                        key={rate.label}
                        className="group relative flex flex-col items-center justify-center rounded-xl p-6 glass transition-transform duration-300 hover:scale-[1.02]"
                        style={{
                            borderTop: "1px solid rgba(239, 68, 68, 0.2)",
                        }}
                    >
                        {/* Gradient top accent */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent rounded-t-xl" />
                        <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 mb-3 uppercase">
                            {rate.label}
                        </p>
                        <p className="text-2xl font-mono text-gradient-red font-bold tabular-nums">
                            ${rate.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-center w-full">
                <ShareActions />
            </div>
            <div className="section-divider mt-10 w-full max-w-3xl" />
        </div>
    );
}

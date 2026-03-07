import { ShareActions } from "./ShareActions";

export function CostRates({ dailyCostUsd }: { dailyCostUsd: number }) {
    const perSecond = Math.round(dailyCostUsd / 24 / 60 / 60);
    const perHour = Math.round(dailyCostUsd / 24);
    const perDay = dailyCostUsd;

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-3xl">
                <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-[#151515] p-6 shadow-sm">
                    <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 mb-2 uppercase">Per Second</p>
                    <p className="text-2xl font-mono text-[#ffaa99] font-medium">${perSecond.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-[#151515] p-6 shadow-sm">
                    <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 mb-2 uppercase">Per Hour</p>
                    <p className="text-2xl font-mono text-[#ffaa99] font-medium">${perHour.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-[#151515] p-6 shadow-sm">
                    <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 mb-2 uppercase">Per Day</p>
                    <p className="text-2xl font-mono text-[#ffaa99] font-medium">${perDay.toLocaleString()}</p>
                </div>
            </div>
            <div className="mt-8 flex justify-center w-full">
                <ShareActions />
            </div>
            <div className="mt-10 h-px w-full max-w-3xl bg-zinc-800"></div>
        </div>
    );
}

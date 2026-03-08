"use client";

import { useState } from "react";
import { Copy, Check, Bitcoin, Coins } from "lucide-react";

export function DonationSection() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const addresses = [
    {
      name: "Bitcoin (BTC)",
      address: "bc1q6l6puvt2h6804me7fjex9rghtakw48qw0lzhp8",
      icon: Bitcoin,
      color: "text-[#F7931A]",
      bgHover: "hover:bg-[#F7931A]/10",
    },
    {
      name: "Ethereum (ETH)",
      address: "0x944c9754E7b22c75438c964A5E995a9Ec05B81B5",
      icon: Coins, // Using Coins as a fallback for ETH
      color: "text-[#627EEA]",
      bgHover: "hover:bg-[#627EEA]/10",
    },
    {
      name: "Solana (SOL)",
      address: "25VuVvqgkTx13RrwFaiCwPRLgjLN9YBqwQT4D6aRuprm",
      icon: Coins, // Using Coins as a fallback for SOL
      color: "text-[#14F195]",
      bgHover: "hover:bg-[#14F195]/10",
    },
  ];

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <section className="relative rounded-2xl glass p-6 sm:p-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      <div className="relative text-center mb-6">
        <h2 className="text-sm font-mono font-semibold tracking-[0.2em] text-zinc-300 uppercase">
          Support Independent Journalism
        </h2>
        <p className="mt-2 text-xs text-zinc-500 max-w-lg mx-auto leading-relaxed">
          Maintaining this tracker and gathering accurate data takes time and resources. 
          If you value this transparency, consider supporting our independent journalism with crypto.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-1 max-w-2xl mx-auto">
        {addresses.map((crypto) => {
          const Icon = crypto.icon;
          const isCopied = copiedAddress === crypto.address;

          return (
            <div
              key={crypto.name}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors gap-3"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${crypto.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-mono font-medium text-zinc-300">
                    {crypto.name}
                  </p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5 break-all line-clamp-1 sm:line-clamp-none">
                    {crypto.address}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleCopy(crypto.address)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-[background-color,color,border-color] duration-200 border border-white/10 ${
                  isCopied 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : `bg-white/5 text-zinc-400 ${crypto.bgHover} hover:text-white hover:border-white/20`
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  className = "",
  delay = 0,
  accentColor = "rgba(239, 68, 68, 0.4)",
}: StatCardProps) {
  return (
    <div
      className={`group relative rounded-xl glass p-5 transition-all duration-300 hover:scale-[1.02] ${className}`}
      style={{ borderLeft: `2px solid ${accentColor}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-zinc-400">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-zinc-100">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-zinc-500">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-white/5 p-2.5 ring-1 ring-white/10 transition-colors group-hover:bg-white/10">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

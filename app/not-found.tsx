import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100">
                    404
                </h1>
                <h2 className="mt-4 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                    Page Not Found
                </h2>
                <p className="mt-3 text-zinc-500 dark:text-zinc-400">
                    The page you&apos;re looking for doesn&apos;t exist.
                    Return to the Iran War Spend Tracker to see live cost estimates.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    Back to Tracker
                </Link>
            </div>
        </div>
    );
}

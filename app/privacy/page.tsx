import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdSense } from "@/components/AdSense";

export const metadata = {
    title: "Privacy Policy | Iran War Spend Tracker",
    description: "Privacy Policy for the Iran War Spend Tracker website.",
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <AdSense />
            <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Tracker
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Last updated: March 7, 2026
                    </p>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <article className="prose prose-zinc dark:prose-invert max-w-none">
                    <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
                        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            1. Introduction
                        </h2>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            Welcome to the Iran War Spend Tracker (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you visit our website (warspend.com) and use our services.
                        </p>
                    </section>

                    <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
                        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            2. Information We Collect
                        </h2>
                        <p className="mb-4 text-zinc-700 dark:text-zinc-300">
                            We do not directly collect or store personal data (such as your name, email address, or physical address) unless you voluntarily provide it to us through direct communication.
                        </p>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            However, when you visit our site, we and our third-party service providers may automatically collect certain information (like your IP address, browser type, device information, and browsing activity) using cookies and similar tracking technologies.
                        </p>
                    </section>

                    <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
                        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            3. Advertising & Cookies (Google AdSense)
                        </h2>
                        <p className="mb-4 text-zinc-700 dark:text-zinc-300">
                            We use Google AdSense to display advertisements on our website. To serve these ads, Google and its partners use cookies to collect information regarding your visits to our site and other websites across the Internet.
                        </p>
                        <ul className="mb-4 list-disc pl-6 text-zinc-700 dark:text-zinc-300">
                            <li className="mb-2">Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</li>
                            <li className="mb-2">Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.</li>
                            <li className="mb-2">
                                Users may opt out of personalized advertising by visiting{" "}
                                <a
                                    href="https://myadcenter.google.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Ads Settings
                                </a>
                                . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
                                <a
                                    href="https://www.aboutads.info/choices/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    www.aboutads.info
                                </a>
                                .
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
                        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            4. Your Privacy Rights (GDPR & CCPA)
                        </h2>
                        <div className="mb-6">
                            <h3 className="mb-2 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                                General Data Protection Regulation (GDPR) - EEA & UK Users
                            </h3>
                            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
                                If you are a resident of the European Economic Area (EEA) or the United Kingdom, you have certain data protection rights, including the right to access, update, delete, or restrict the processing of your personal data. You will be prompted with a cookie consent banner to manage your preferences upon your first visit.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                                California Consumer Privacy Act (CCPA)
                            </h3>
                            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
                                If you are a California resident, the CCPA grants you specific rights regarding your personal information. These include the right to know what personal information is collected, the right to request deletion of your data, and the right to opt out of the &quot;sale&quot; of your personal information.
                            </p>
                            <p className="text-zinc-700 dark:text-zinc-300">
                                We do not &quot;sell&quot; your personal information in the traditional sense. However, the sharing of data with advertising partners for personalized ads may be considered a &quot;sale&quot; under CCPA. You can opt out of this using the links provided in the Advertising &amp; Cookies section above.
                            </p>
                        </div>
                    </section>

                    <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
                        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            5. Changes to This Privacy Policy
                        </h2>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this page periodically.
                        </p>
                    </section>
                </article>
            </main>

            <footer className="mt-8 border-t border-zinc-200 py-6 dark:border-zinc-800">
                <div className="mx-auto max-w-4xl px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    War Spend Tracker · Built for transparency
                </div>
            </footer>
        </div>
    );
}

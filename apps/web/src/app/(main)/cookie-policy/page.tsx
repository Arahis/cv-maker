import type { Metadata } from "next";
import CookiePreferences from "@/components/analytics/CookiePreferences";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Cvoop uses essential and analytics cookies.",
  openGraph: {
    title: "Cookie Policy | Cvoop",
    description: "How Cvoop uses essential and analytics cookies.",
    type: "article",
    siteName: "Cvoop",
    url: "https://cvoop.com/cookie-policy",
  },
};

const Page = () => (
  <main className="policy_page mx-auto max-w-250 px-4 py-20">
    <p className="mb-2">
      <strong>Last updated:</strong> August 2026
    </p>
    <article className="space-y-12">
      <h1 className="text-3xl font-bold">Cookie Policy</h1>

      <section>
        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files or similar technologies stored on your
          device when you visit a website. They help websites remember your
          preferences, keep you signed in, and understand how the service is
          used.
        </p>
      </section>

      <section>
        <h2>How Cvoop uses cookies</h2>
        <p>Cvoop uses the following categories of cookies and storage:</p>
        <ol>
          <li>
            <strong>Essential cookies:</strong> required for authentication,
            sessions, security, and core account functionality. These cannot be
            disabled through the cookie banner.
          </li>
          <li>
            <strong>Analytics cookies:</strong> Google Analytics cookies or
            similar technologies help us understand aggregate website usage.
            These are loaded only after consent from visitors in the European
            Union.
          </li>
        </ol>
      </section>

      <section>
        <h2>Analytics consent</h2>
        <p>
          Visitors from European Union countries can accept or decline
          analytics cookies through the cookie banner. If analytics are
          declined, Google Analytics is not loaded. Your choice is stored in
          your browser under <code>cvoop_analytics_consent</code>.
        </p>
        <p>
          You can remove or change this preference by clearing Cvoop site data
          in your browser settings.
        </p>
      </section>

      <section>
        <h2>Third-party services</h2>
        <p>
          Google Analytics is provided by Google and may process information in
          accordance with Google&apos;s privacy policy and terms. Cvoop does not
          use analytics cookies for advertising or cross-site tracking.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about this Cookie Policy? Contact us at{" "}
          <a href="mailto:support@cvoop.com">support@cvoop.com</a>.
        </p>
      </section>

      <CookiePreferences />
    </article>
  </main>
);

export default Page;

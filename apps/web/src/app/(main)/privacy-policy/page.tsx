export const metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Cvoop handles your data. We do not require registration and store resume data locally on your device. Privacy-first resume builder.",
  openGraph: {
    title: "Privacy Policy | Cvoop",
    description:
      "How Cvoop handles your data. No registration. Local data storage.",
    type: "article",
    siteName: "Cvoop",
    url: "https://cvoop.com/privacy-policy",
  },
};

const Page = async () => {
  return (
    <main className="policy_page mx-auto max-w-250 px-4 py-20">
      <p className="mb-2">
        <strong>Last updated:</strong> February 2026
      </p>
      <article className="space-y-12">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>

        <section>
          <h2>Overview</h2>
          <p>
            Cvoop is a privacy-focused resume builder. We are committed to
            keeping your personal data safe and minimizing data collection.
          </p>
          <ol>
            <li>
              We do <b>not</b> require registration
            </li>
            <li>
              Your resume data is stored <b>locally on your device</b>{" "}
            </li>
            <li>
              We do <b>not</b> sell or share your personal data
            </li>
          </ol>
        </section>

        <section>
          <h2>Information We Do Not Collect</h2>
          <p>We do not collect:</p>
          <ol>
            <li>Names, addresses, or contact details</li>
            <li>Resume content (text, images, or files)</li>
            <li>Account credentials (because accounts do not exist)</li>
            <li>
              Payment information (donations are handled by third-party
              providers)
            </li>
          </ol>
          <p>
            Your resume data stays in your browser (e.g. IndexedDB / local
            storage) and is not transmitted to our servers.
          </p>
        </section>

        <section>
          <h2>Analytics</h2>
          <p>
            We use <b>Google Analytics 4 (GA4)</b> to understand how visitors
            use our website.
          </p>
          <p>The analytics data may include:</p>
          <ol>
            <li>Pages visited</li>
            <li>Device type and browser</li>
            <li>Approximate location (country level)</li>
            <li>General usage patterns</li>
          </ol>
          <p>This data is:</p>
          <ol>
            <li>Aggregated</li>
            <li>Anonymized</li>
            <li>Used only to improve the product</li>
          </ol>
          <p>We do not use analytics to identify individual users.</p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            Cvoop does <b>not</b> use cookies for tracking or advertising
            purposes.
          </p>
          <p>
            Google Analytics may use cookies or similar technologies as part of
            its standard operation. You can control or disable cookies through
            your browser settings.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>We may use third-party services for:</p>
          <ol>
            <li>Website analytics (Google Analytics)</li>
            <li>Donations or payments (e.g. PayPal or similar providers)</li>
          </ol>
          <p>These services operate under their own privacy policies.</p>
          <p>
            We recommend reviewing their policies if you choose to use them.
          </p>
        </section>

        <section>
          <h2>Data Storage and Security</h2>
          <p>Because resume data is stored locally on your device:</p>
          <ol>
            <li>We do not have access to it</li>
            <li>We cannot view, edit, or recover it</li>
            <li>Deleting your browser data will remove your resume</li>
          </ol>
          <p>
            We take reasonable measures to protect the website itself, but no
            online service can guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>Your Rights (GDPR)</h2>
          <p>
            If you are located in the European Union or EEA, you have the right
            to:
          </p>
          <ol>
            <li>Access information about data processing</li>
            <li>Request clarification about analytics data usage</li>
            <li>Object to data processing where applicable</li>
          </ol>
          <p>
            Since we do not store personal data, most requests can be resolved
            by disabling analytics or clearing browser data.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time.</p>
          <p>
            Any changes will be posted on this page with an updated revision
            date.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            If you have questions about this Privacy Policy or other, you can
            contact us at:
          </p>
          <address>
            <p>
              <b>Email:</b>{" "}
              <a href="mailto:support@cvoop.com">support@cvoop.com</a>
            </p>
            <p>
              <b>Website:</b>{" "}
              <a href="mailto:https://cvoop.com">https://cvoop.com</a>
            </p>
          </address>
        </section>
      </article>
    </main>
  );
};

export default Page;

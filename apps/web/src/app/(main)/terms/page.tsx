export const metadata = {
  title: "Terms of Service",
  description:
    "These Terms of Service describe the rules and conditions for using the Cvoop website and resume builder.",
  openGraph: {
    title: "Terms of Service | Cvoop",
    description:
      "The terms and conditions for using the Cvoop website and resume builder.",
    type: "article",
    siteName: "Cvoop",
    url: "https://cvoop.com/terms",
  },
};

const Page = async () => {
  return (
    <main className="policy_page mx-auto max-w-250 flex-1 px-4 py-20">
      <p className="mb-2">
        <strong>Last updated:</strong> February 2026
      </p>
      <article className="space-y-12">
        <h1 className="text-3xl font-bold">Terms of Service</h1>

        <p>
          These Terms of Service (“Terms”) govern your access to and use of the{" "}
          <strong>Cvoop</strong> website and resume builder (the “Service”). By
          using the Service, you agree to these Terms.
        </p>

        <section>
          <h2>About the Service</h2>
          <p>
            Cvoop is an online resume builder that allows users to create and
            edit resumes directly in their browser.
          </p>
          <p>The Service does not require registration.</p>
          <p>
            Resume data is stored locally on the user’s device and is not
            uploaded to Cvoop servers.
          </p>
        </section>

        <section>
          <h2>Eligibility</h2>
          <p>You must be at least 13 years old to use the Service.</p>

          <p>By using Cvoop, you confirm that you meet this requirement.</p>
        </section>

        <section>
          <h2>User Content</h2>
          <p>
            You retain full ownership of the content you create using the
            Service, including resume text and uploaded images.
          </p>
          <p>
            Cvoop does not access, store, or process your resume content on its
            servers.
          </p>
        </section>

        <section>
          <h2>Acceptable Use</h2>
          <p>You agree not to:</p>
          <ol>
            <li>Use the Service for unlawful purposes</li>
            <li>Attempt to interfere with or disrupt the Service</li>
            <li>
              Reverse engineer, copy, or misuse the Service in a way that
              violates applicable laws
            </li>
          </ol>
        </section>

        <section>
          <h2>Availability and Changes</h2>
          <p>The Service is provided on an “as is” and “as available” basis.</p>

          <p>
            We may update, modify, or discontinue parts of the Service at any
            time without prior notice.
          </p>
        </section>

        <section>
          <h2>Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our{" "}
            <b>Privacy Policy.</b>
          </p>
          <p>Because resume data is stored locally:</p>
          <ol>
            <li>Cvoop cannot recover lost data</li>
            <li>Clearing browser data may permanently remove your resume</li>
          </ol>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            The Service may include links to or integrations with third-party
            services (such as analytics or payment providers).
          </p>

          <p>
            Cvoop is not responsible for the content, policies, or practices of
            third-party services.
          </p>
        </section>

        <section>
          <h2>Disclaimer of Warranties</h2>
          <p>
            Cvoop makes no warranties regarding the accuracy, reliability, or
            suitability of the Service for any particular purpose.
          </p>
          <p>Use of the Service is at your own risk.</p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Cvoop shall not be liable
            for any indirect, incidental, or consequential damages arising from
            the use of the Service.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            We reserve the right to restrict or terminate access to the Service
            if these Terms are violated.
          </p>
        </section>

        <section>
          <h2>Changes to These Terms</h2>
          <p>We may update these Terms from time to time.</p>
          <p>
            The updated version will be posted on this page with a revised “Last
            updated” date.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>If you have questions about these Terms, you can contact us at:</p>
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

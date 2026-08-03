import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions for using Cvoop, including account registration and Google Sign-In.",
  openGraph: {
    title: "Terms of Service | Cvoop",
    description:
      "The terms and conditions for using Cvoop, including account registration and Google Sign-In.",
    type: "article",
    siteName: "Cvoop",
    url: "https://cvoop.com/terms",
  },
};

const Page = () => {
  return (
    <main className="policy_page mx-auto max-w-250 px-4 py-20">
      <p className="mb-2">
        <strong>Last updated:</strong> August 2026
      </p>
      <article className="space-y-12">
        <h1 className="text-3xl font-bold">Terms of Service</h1>

        <p>
          These Terms of Service ("Terms") govern your access to and use of the{" "}
          <strong>Cvoop</strong> website and resume builder (the "Service"). By
          using the Service, creating an account, or signing in with Google, you
          agree to these Terms and our{" "}
          <a href="/privacy-policy">Privacy Policy</a>.
        </p>

        <section>
          <h2>About the Service</h2>
          <p>
            Cvoop provides tools to create, edit, import, store, and export
            resumes. Guest users can use the basic builder with local browser
            storage. Registered users can save resumes and related images to
            their account and access them through the Service.
          </p>
          <p>
            Some features, including AI-assisted resume parsing, are provided
            through third-party services and may be subject to limits or
            availability restrictions.
          </p>
        </section>

        <section>
          <h2>Accounts and Google Sign-In</h2>
          <p>
            You may register with an email address and password or, where
            available, use Google Sign-In. When you use Google Sign-In, you
            authorize Cvoop to receive the Google account information described
            in our Privacy Policy solely to authenticate your Cvoop account.
            Cvoop does not request access to your Gmail, Google Drive, or other
            Google content.
          </p>
          <p>
            You are responsible for providing accurate information, keeping your
            credentials secure, and all activity under your account. Do not
            share your password or use another person&apos;s account. Notify us
            promptly if you believe your account has been compromised.
          </p>
        </section>

        <section>
          <h2>Eligibility</h2>
          <p>
            You must be at least 13 years old to use the Service. By using
            Cvoop, you confirm that you meet this requirement and can agree to
            these Terms.
          </p>
        </section>

        <section>
          <h2>User Content</h2>
          <p>
            You retain ownership of the text, images, files, and other content
            you submit to Cvoop ("User Content"). You grant Cvoop a limited,
            non-exclusive license to host, process, reproduce, and display User
            Content only as needed to operate, secure, and improve the Service
            at your request.
          </p>
          <p>
            You are responsible for User Content and confirm that you have the
            rights and permissions needed to submit it. Do not upload unlawful,
            infringing, harmful, or confidential information that you are not
            authorized to share.
          </p>
        </section>

        <section>
          <h2>AI-Assisted Features</h2>
          <p>
            If you request resume parsing or another AI-assisted feature, your
            submitted content may be sent to an AI service provider for that
            purpose. AI-generated or extracted results may be incomplete or
            inaccurate. You are responsible for reviewing all results before
            using or sharing a resume.
          </p>
        </section>

        <section>
          <h2>Acceptable Use</h2>
          <p>You agree not to:</p>
          <ol>
            <li>
              Use the Service for unlawful, fraudulent, or abusive purposes
            </li>
            <li>Upload content that infringes another person&apos;s rights</li>
            <li>Attempt to access another user&apos;s account or data</li>
            <li>
              Interfere with, overload, or test the Service without permission
            </li>
            <li>
              Reverse engineer, copy, or misuse the Service in violation of law
            </li>
            <li>Use automated means to scrape or abuse the Service</li>
          </ol>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            The Service may use or link to third-party services, including
            Google Sign-In, Google Analytics, email delivery, cloud storage, AI
            processing, and payment providers. Their services are governed by
            their own terms and privacy policies. Cvoop is not responsible for
            third-party services or interruptions outside our control.
          </p>
        </section>

        <section>
          <h2>Account Deletion and Termination</h2>
          <p>
            You may stop using the Service at any time. Signed-in users may
            delete their account from Account Settings or request deletion by
            contacting support@cvoop.com. Deletion is permanent and may remove
            account records and saved resumes, subject to limited retention
            required for legal, security, backup, or fraud-prevention purposes.
            You may also revoke Cvoop from your Google Account settings.
          </p>
          <p>
            We may suspend or terminate access if you violate these Terms,
            create a security risk, or use the Service unlawfully.
          </p>
        </section>

        <section>
          <h2>Intellectual Property</h2>
          <p>
            Cvoop and its software, design, branding, templates, and other
            materials are owned by Cvoop or its licensors. Except for the rights
            expressly granted in these Terms, no rights are transferred to you.
          </p>
        </section>

        <section>
          <h2>Availability and Disclaimers</h2>
          <p>
            The Service is provided on an “as is” and “as available” basis. We
            do not guarantee that it will be uninterrupted, error-free, secure,
            or suitable for a particular purpose. You are responsible for
            keeping copies of important content, especially content stored only
            in a guest browser.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Cvoop will not be liable for
            indirect, incidental, special, consequential, or lost-profit damages
            arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2>Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. The updated version
            will be posted on this page with a revised “Last updated” date. Your
            continued use of the Service after an update means you accept the
            revised Terms.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions about these Terms can be sent to:</p>
          <address>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@cvoop.com">support@cvoop.com</a>
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a href="https://cvoop.com">https://cvoop.com</a>
            </p>
          </address>
        </section>
      </article>
    </main>
  );
};

export default Page;

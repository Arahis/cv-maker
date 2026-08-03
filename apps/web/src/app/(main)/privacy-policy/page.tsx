import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Cvoop collects, uses, stores, and protects account and resume data, including data used for Google Sign-In.",
  openGraph: {
    title: "Privacy Policy | Cvoop",
    description:
      "How Cvoop handles account, resume, analytics, and Google Sign-In data.",
    type: "article",
    siteName: "Cvoop",
    url: "https://cvoop.com/privacy-policy",
  },
};

const Page = () => {
  return (
    <main className="policy_page mx-auto max-w-250 px-4 py-20">
      <p className="mb-2">
        <strong>Last updated:</strong> August 2026
      </p>
      <article className="space-y-12">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>

        <section>
          <h2>Overview</h2>
          <p>
            This Privacy Policy explains how Cvoop collects, uses, stores, and
            protects information when you use our website and resume builder
            (the "Service").
          </p>
          <p>
            You can use the basic resume builder without an account. An account
            is optional and lets you save resumes and access them from supported
            devices.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>Depending on how you use the Service, we may collect:</p>
          <ol>
            <li>
              <strong>Account information:</strong> your email address, account
              creation and verification details, and authentication records.
              Passwords are stored only as cryptographic hashes, not in plain
              text.
            </li>
            <li>
              <strong>Google Sign-In information:</strong> if you choose to sign
              in with Google, we receive the Google account identifier and email
              address needed to create or access your Cvoop account. We may also
              receive basic profile information made available by the
              authorization scopes you approve. We use this information only to
              authenticate you, associate your Cvoop account, and provide the
              Service. We do not request or access Gmail, Google Drive,
              Contacts, Calendar, or other Google content.
            </li>
            <li>
              <strong>Resume content:</strong> resume text, templates, imported
              resume files, and images that you choose to save to an account or
              send for processing. Information entered into a resume may include
              names, contact details, employment history, education, and other
              information you provide.
            </li>
            <li>
              <strong>Technical and security information:</strong> session
              identifiers, approximate request information, IP address, user
              agent, and security events used to operate and protect accounts.
            </li>
            <li>
              <strong>Analytics information:</strong> pages visited, device and
              browser information, approximate country-level location, and
              general usage events.
            </li>
          </ol>
        </section>

        <section>
          <h2>Local and Account Storage</h2>
          <p>
            In guest mode, resume data is kept in your browser (for example, in
            IndexedDB or local storage) and is not uploaded to Cvoop merely
            because you edit it. Clearing browser data can permanently remove
            guest resumes.
          </p>
          <p>
            If you create an account or choose an account feature, the resumes
            and images you submit are stored on our servers or our cloud storage
            providers so that we can save, synchronize, and display them to you.
            They are not public by default.
          </p>
        </section>

        <section>
          <h2>How We Use Information</h2>
          <ol>
            <li>Provide, maintain, and improve the Service</li>
            <li>Create and secure accounts and authenticate sign-ins</li>
            <li>Send email verification and password-reset messages</li>
            <li>Store, synchronize, and export resumes at your request</li>
            <li>Process imported resumes when you request that feature</li>
            <li>
              Prevent abuse, fraud, unauthorized access, and security incidents
            </li>
            <li>Understand aggregate usage through analytics</li>
          </ol>
          <p>
            We do not sell personal information or use Google user data for
            advertising. Google user data is used only for the purposes
            described above and in accordance with Google API Services User Data
            Policy, including its Limited Use requirements.
          </p>
        </section>

        <section>
          <h2>Service Providers and Sharing</h2>
          <p>
            We share information only as needed to provide the Service, comply
            with the law, or protect the Service and its users. Our providers
            may include:
          </p>
          <ol>
            <li>Google, for Google Sign-In and website analytics</li>
            <li>
              Email service providers, for verification and password-reset
              messages
            </li>
            <li>
              Cloud storage providers, for account resumes, files, and images
            </li>
            <li>
              AI service providers, when you explicitly request resume parsing
            </li>
            <li>
              Payment providers, if you choose to make a donation or payment
            </li>
          </ol>
          <p>
            These providers process information under their own terms and
            privacy policies. We do not share Google user data with third
            parties except service providers acting on our instructions or when
            required by law.
          </p>
        </section>

        <section>
          <h2>Cookies and Analytics</h2>
          <p>
            We use essential cookies or similar storage for authentication and
            account sessions. These cookies are not used for advertising or
            cross-site tracking. Google Analytics 4 may use analytics cookies or
            similar technologies to measure website usage. You can control
            cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2>Retention, Access, and Deletion</h2>
          <p>
            We keep account and account-resume data while your account is
            active, or for as long as needed for the purposes described in this
            Policy and our legal obligations. You can sign out at any time and
            request access, correction, or deletion by emailing us.
          </p>
          <p>
            Signed-in users can delete their account from Account Settings.
            Account deletion removes the account and associated application
            records from our database, subject to limited retention required by
            law, security, backup, or fraud-prevention obligations. To request
            deletion of data received from Google, email{" "}
            <a href="mailto:support@cvoop.com">support@cvoop.com</a> or use the
            account deletion function. We do not retain Google user data after
            it is no longer needed for the disclosed purpose.
          </p>
        </section>

        <section>
          <h2>Security and International Transfers</h2>
          <p>
            We use reasonable technical and organizational measures, including
            password hashing, access controls, encrypted connections, and
            limited-access session records. No online service can guarantee
            absolute security. Our providers may process information in
            countries other than your own, subject to their applicable
            safeguards.
          </p>
        </section>

        <section>
          <h2>Children&apos;s Privacy</h2>
          <p>
            The Service is not directed to children under 13. We do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>
            Depending on where you live, you may have rights to access, correct,
            delete, restrict, or object to processing of your personal
            information. Contact us to exercise these rights. You may also
            revoke Cvoop&apos;s access from your Google Account security
            settings; this may prevent Google Sign-In from working until you
            reconnect it.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post
            the updated version on this page and change the revision date.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions or privacy requests can be sent to:</p>
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

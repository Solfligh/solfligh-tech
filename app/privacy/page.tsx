import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export default function PrivacyPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Legal • Privacy"
        title="Privacy Policy"
        subtitle="This Privacy Policy explains how SOLFLIGH TECH collects, uses, and protects information when you use our website and contact forms."
      />

      <div className="mt-10 card-premium p-8">
        <div className="space-y-6 text-sm font-semibold text-slate-800">
          <p>
            <span className="font-bold text-slate-950">Effective date:</span>{" "}
            January 1, 2019
          </p>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              1) Information we collect
            </h2>
            <p className="mt-2">
              We may collect information you provide directly, such as your name,
              email address, and message when you submit a form (Contact, Partner
              With Us, or Investors). We may also collect basic technical data
              such as browser type, device information, and pages visited for
              performance and security purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              2) How we use information
            </h2>
            <p className="mt-2">
              We use information to respond to inquiries, evaluate partnership
              requests, communicate about potential services, improve our website,
              and protect against abuse or security threats.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              3) Sharing of information
            </h2>
            <p className="mt-2">
              We do not sell your personal information. We may share information
              with trusted service providers (such as email delivery services)
              solely to operate the website and respond to you. We may also
              disclose information if required by law or to protect our rights and
              security.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              4) Data retention
            </h2>
            <p className="mt-2">
              We retain messages and inquiry information as long as reasonably
              necessary to respond, maintain business records, and comply with
              legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              5) Security
            </h2>
            <p className="mt-2">
              We take reasonable measures to protect your information. However,
              no internet transmission or storage system is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              6) Cookies and analytics
            </h2>
            <p className="mt-2">
              We may use cookies or similar technologies to understand site usage
              and improve performance. You can control cookies through your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              7) Your choices
            </h2>
            <p className="mt-2">
              You may request access, correction, or deletion of your personal
              information by contacting us. We will respond where applicable under
              relevant laws.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              8) Third-party links
            </h2>
            <p className="mt-2">
              Our website may link to third-party sites. We are not responsible
              for the privacy practices of those third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              9) Contact us
            </h2>
            <p className="mt-2">
              If you have questions about this Privacy Policy, contact us via the
              Contact page.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}

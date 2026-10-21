import type { ReactNode } from "react";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

/** Where privacy requests go. One constant so the page and any future form agree. */
const PRIVACY_EMAIL = "support@solflightech.org";

const LAST_UPDATED = "21 October 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold text-slate-950">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Legal • Privacy"
        title="Privacy Policy"
        subtitle="How SOLFLIGH TECH collects, uses and protects personal data on this website, under the Nigeria Data Protection Act 2023."
      />

      <div className="mt-10 card-premium p-8">
        <div className="space-y-6 text-sm font-semibold text-slate-800">
          <p>
            <span className="font-bold text-slate-950">Last updated:</span> {LAST_UPDATED}
          </p>

          <Section title="1) Who we are">
            <p>
              SOLFLIGH TECH is the data controller for the personal data described here. To reach
              us about your data, email{" "}
              <a className="underline" href={`mailto:${PRIVACY_EMAIL}`}>
                {PRIVACY_EMAIL}
              </a>
              . This page covers this website.
            </p>
          </Section>

          <Section title="2) What we collect, why, and on what basis">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-bold text-slate-950">Contact, Partner and Investor forms:</span>{" "}
                your name, email, company, message and which form you used. We use it to reply and
                to assess your request. Basis: taking steps at your request, and our legitimate
                interest in answering enquiries.
              </li>
              <li>
                <span className="font-bold text-slate-950">Waitlists:</span> your email, and the
                name, phone, company or note you choose to add. We use it to tell you about the
                product you signed up for. Basis: your consent, which you can withdraw at any time.
              </li>
              <li>
                <span className="font-bold text-slate-950">Blog comments:</span> the name and
                comment you submit. Approved comments are shown publicly with your name. Basis: your
                consent.
              </li>
              <li>
                <span className="font-bold text-slate-950">Abuse prevention:</span> when you submit
                a form or comment, we store a one-way hash of your IP address and a coarse browser
                type, to limit spam and flooding. We do not store your IP address itself. Basis: our
                legitimate interest in keeping the site secure.
              </li>
              <li>
                <span className="font-bold text-slate-950">Analytics:</span> if you accept, Google
                Analytics records which pages you visit and basic device information. Basis: your
                consent. If you decline, or do not answer, nothing is sent to Google.
              </li>
            </ul>
            <p>
              We do not sell personal data, and we do not use it for automated decisions about you.
            </p>
          </Section>

          <Section title="3) Who receives it">
            <p>
              We use service providers to run the site: Supabase (database), Resend (email), Vercel
              (hosting) and, only if you accept analytics, Google (Analytics). They process data for
              us under their own terms. We may also disclose data where the law requires, or to
              protect our rights and security.
            </p>
          </Section>

          <Section title="4) Transfers outside Nigeria">
            <p>
              Some of these providers store or process data outside Nigeria. We choose providers
              that publish security and data-protection commitments, and we share only what each
              needs to do its job.
            </p>
          </Section>

          <Section title="5) How long we keep it">
            <ul className="list-disc space-y-2 pl-5">
              <li>Enquiries: up to 24 months after our last contact with you, then deleted.</li>
              <li>
                Waitlist entries: until the product launches and we have sent the launch notice, or
                until you ask us to remove you, then deleted within 12 months.
              </li>
              <li>Comments: until you ask us to remove them.</li>
              <li>Abuse-prevention hashes: kept with the submission they belong to.</li>
              <li>
                Analytics: held by Google under its own retention setting, and only if you accepted.
              </li>
            </ul>
          </Section>

          <Section title="6) Security">
            <p>
              Access to stored data is limited to the people who need it, and the database is not
              open to the public. No system is completely secure, and we cannot promise otherwise.
              If a breach puts your data at risk, we will report it to the Nigeria Data Protection
              Commission and tell you where the law requires.
            </p>
          </Section>

          <Section title="7) Cookies and analytics">
            <p>
              The only cookies we ask about are Google Analytics cookies, and only after you accept.
              You can change your answer any time with{" "}
              <span className="font-bold">Cookie choices</span> in the footer. Your answer is stored
              in your own browser. Likes on articles are remembered the same way and never leave
              your device.
            </p>
          </Section>

          <Section title="8) Your rights">
            <p>
              You can ask to see the personal data we hold about you, correct it, delete it,
              restrict or object to how we use it, withdraw consent, or receive a copy in a common
              format. Email{" "}
              <a className="underline" href={`mailto:${PRIVACY_EMAIL}`}>
                {PRIVACY_EMAIL}
              </a>{" "}
              from the address you used with us. We may ask you to confirm who you are, and we will
              reply within one month.
            </p>
            <p>
              If you are not satisfied with our answer, you can complain to the Nigeria Data
              Protection Commission (NDPC).
            </p>
          </Section>

          <Section title="9) Children">
            <p>This site is not aimed at children, and we do not knowingly collect their data.</p>
          </Section>

          <Section title="10) Third-party links and changes">
            <p>
              Linked sites have their own privacy practices. When we change this policy, we update
              the date above, and for material changes we will say so on this page.
            </p>
          </Section>
        </div>
      </div>
    </Container>
  );
}

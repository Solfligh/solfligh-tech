import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export default function TermsPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Legal • Terms"
        title="Terms of Service"
        subtitle="These Terms of Service govern your use of the SOLFLIGH TECH website. By using this website, you agree to these terms."
      />

      <div className="mt-10 card-premium p-8">
        <div className="space-y-6 text-sm font-semibold text-slate-800">
          <p>
            <span className="font-bold text-slate-950">Effective date:</span>{" "}
            January 1, 2019
          </p>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              1) Use of the website
            </h2>
            <p className="mt-2">
              You may use this website for lawful purposes only. You agree not to
              misuse the website, attempt unauthorized access, disrupt services,
              or violate applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              2) No guarantees
            </h2>
            <p className="mt-2">
              Content on this website is provided for general information. While
              we strive for accuracy, we do not guarantee completeness, accuracy,
              or availability of the website or its content.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              3) Intellectual property
            </h2>
            <p className="mt-2">
              All content, branding, and materials on this website are owned by
              SOLFLIGH TECH or licensed to us, unless otherwise stated. You may
              not copy, reproduce, or distribute our materials without permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              4) Third-party services
            </h2>
            <p className="mt-2">
              The website may reference third-party services or links. We are not
              responsible for third-party content, policies, or availability.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              5) Inquiries and communications
            </h2>
            <p className="mt-2">
              If you submit a form, you confirm the information is accurate to
              the best of your knowledge. Submission does not create a client
              relationship. Any services are subject to separate written
              agreements.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              6) Limitation of liability
            </h2>
            <p className="mt-2">
              To the maximum extent permitted by law, SOLFLIGH TECH is not liable
              for any indirect, incidental, special, or consequential damages
              arising from your use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              7) Changes to these terms
            </h2>
            <p className="mt-2">
              We may update these Terms from time to time. Continued use of the
              website after updates means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-950">
              8) Contact
            </h2>
            <p className="mt-2">
              If you have questions about these Terms, contact us via the Contact
              page.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}

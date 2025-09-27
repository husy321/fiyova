import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="mt-4 text-lg text-default-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-default-600 leading-relaxed">
              By accessing and using Fiyova (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-default-600 leading-relaxed">
              Fiyova is a digital marketplace that provides premium digital products including software tools, templates, design assets, e-books, courses, and other downloadable content. All products are sold on a one-time purchase basis with no recurring fees or subscriptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Purchase Terms</h2>
            <div className="space-y-4 text-default-600">
              <p><strong>One-Time Purchase:</strong> All products are sold as one-time purchases. No recurring payments or subscription fees apply.</p>
              <p><strong>Instant Access:</strong> Upon successful payment, you will receive immediate access to download your purchased products.</p>
              <p><strong>Payment Processing:</strong> All payments are processed securely through our payment partners. We accept major credit cards and digital payment methods.</p>
              <p><strong>Pricing:</strong> All prices are displayed in USD and include applicable taxes where required.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. No Refund Policy</h2>
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-6 mb-6">
              <p className="text-warning-800 font-medium mb-2">IMPORTANT: ALL SALES ARE FINAL</p>
              <p className="text-warning-700">
                Due to the digital nature of our products and the instant access provided upon purchase, <strong>all sales are final and non-refundable</strong>. No refunds, exchanges, or cancellations will be provided under any circumstances.
              </p>
            </div>
            <div className="text-default-600 space-y-4">
              <p>This policy applies to all digital products sold on Fiyova, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Software applications and tools</li>
                <li>Digital templates and design assets</li>
                <li>E-books and written content</li>
                <li>Online courses and educational materials</li>
                <li>Any other downloadable digital content</li>
              </ul>
              <p>
                We strongly encourage you to review product descriptions, previews, specifications, and system requirements carefully before making a purchase decision.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. License and Usage Rights</h2>
            <div className="text-default-600 space-y-4">
              <p>Upon purchase, you are granted specific usage rights as defined by each product&apos;s license terms:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Personal Use:</strong> Some products are licensed for personal use only</li>
                <li><strong>Commercial Use:</strong> Other products may include commercial usage rights</li>
                <li><strong>Restrictions:</strong> You may not resell, redistribute, or share purchased products</li>
                <li><strong>Modification:</strong> Modification rights vary by product and license type</li>
              </ul>
              <p>
                Always review the specific license terms provided with each product before use.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-default-600 leading-relaxed">
              All products sold on Fiyova are protected by intellectual property laws. Purchasing a product grants you usage rights as specified in the product license but does not transfer ownership of the underlying intellectual property. Unauthorized copying, distribution, or resale of products is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Digital Delivery</h2>
            <div className="text-default-600 space-y-4">
              <p><strong>Download Links:</strong> Products are delivered via email with secure download links.</p>
              <p><strong>Access Duration:</strong> Download links remain active indefinitely for re-downloading.</p>
              <p><strong>File Formats:</strong> Products are provided in their original formats as specified.</p>
              <p><strong>Technical Requirements:</strong> Users are responsible for ensuring compatibility with their systems.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. User Responsibilities</h2>
            <div className="text-default-600 space-y-4">
              <p>As a user of Fiyova, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and truthful information during purchase</li>
                <li>Use products in accordance with their license terms</li>
                <li>Maintain the security of your download links and purchased content</li>
                <li>Respect intellectual property rights of all products</li>
                <li>Not attempt to reverse engineer, decompile, or modify protected products</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Privacy and Data Protection</h2>
            <p className="text-default-600 leading-relaxed">
              We are committed to protecting your privacy and personal information. We collect only necessary information for processing purchases and delivering products. Your data is never shared with third parties without your explicit consent, except as required for payment processing and legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="text-default-600 leading-relaxed">
              Fiyova and its affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services. Products are provided &quot;as is&quot; without warranties of any kind, either express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Prohibited Uses</h2>
            <div className="text-default-600 space-y-4">
              <p>You may not use Fiyova or its products for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any unlawful purpose or to solicit unlawful acts</li>
                <li>Violating any international, federal, provincial, or state regulations or laws</li>
                <li>Infringing upon or violating intellectual property rights</li>
                <li>Harassing, abusing, insulting, harming, defaming, or intimidating others</li>
                <li>Submitting false or misleading information</li>
                <li>Uploading or transmitting viruses or malicious code</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p className="text-default-600 leading-relaxed">
              We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason, including if you breach the Terms of Service. Upon termination, your right to use the service will cease immediately, though previously purchased products remain accessible via your download links.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p className="text-default-600 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. Continued use of the service after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
            <p className="text-default-600 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which Fiyova operates, without regard to its conflict of law provisions. Any disputes arising from these terms will be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p className="text-default-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our support channels. We are committed to addressing your concerns and ensuring compliance with these terms.
            </p>
          </section>

          <div className="mt-12 p-6 bg-default-100 rounded-xl">
            <p className="text-sm text-default-600">
              By using Fiyova, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Fiyova.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
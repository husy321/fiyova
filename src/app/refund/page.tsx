import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";

export default function RefundPage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Refund Policy</h1>
          <p className="mt-4 text-lg text-default-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-6 mb-6">
              <p className="text-warning-800 font-medium mb-2 text-lg">IMPORTANT: ALL SALES ARE FINAL</p>
              <p className="text-warning-700">
                Due to the digital nature of our products and the instant access provided upon purchase, <strong>all sales are final and non-refundable</strong>. No refunds, exchanges, or cancellations will be provided under any circumstances.
              </p>
            </div>
            <p className="text-default-600 leading-relaxed">
              This Refund Policy explains our policy regarding refunds for digital products purchased through Fiyova. Please read this policy carefully before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. No Refund Policy</h2>
            <div className="text-default-600 space-y-4">
              <p>
                <strong>All sales are final.</strong> Once a purchase is completed and payment is processed, we do not offer refunds, exchanges, or cancellations for any digital products sold on Fiyova.
              </p>
              <p>
                This policy applies to all digital products, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Software applications and tools</li>
                <li>Digital templates and design assets</li>
                <li>E-books and written content</li>
                <li>Online courses and educational materials</li>
                <li>Digital graphics, illustrations, and media files</li>
                <li>Any other downloadable digital content</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Why We Have This Policy</h2>
            <div className="text-default-600 space-y-4">
              <p>
                Digital products differ from physical goods in several important ways that make refunds impractical:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Instant Access:</strong> Digital products are immediately accessible upon purchase, making it impossible to &quot;return&quot; them</li>
                <li><strong>No Physical Return:</strong> Unlike physical products, digital files cannot be physically returned</li>
                <li><strong>Replication Risk:</strong> Once downloaded, digital products can be easily copied and retained even after a refund</li>
                <li><strong>Intellectual Property:</strong> Digital products contain intellectual property that cannot be &quot;unused&quot; once accessed</li>
              </ul>
              <p>
                This policy protects both our business and ensures fair treatment for all customers.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Before You Purchase</h2>
            <div className="text-default-600 space-y-4">
              <p>
                To ensure you make an informed purchase decision, we strongly encourage you to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Read Product Descriptions:</strong> Carefully review all product details, features, and specifications</li>
                <li><strong>Check Previews:</strong> View product previews, screenshots, or demo videos when available</li>
                <li><strong>Review System Requirements:</strong> Ensure your system meets all technical requirements</li>
                <li><strong>Read License Terms:</strong> Understand the usage rights and restrictions for each product</li>
                <li><strong>Check Compatibility:</strong> Verify that the product is compatible with your intended use case</li>
                <li><strong>Contact Support:</strong> Reach out to our support team with any questions before purchasing</li>
              </ul>
              <p className="mt-4">
                By completing a purchase, you acknowledge that you have reviewed the product information and agree to this no-refund policy.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. What Happens After Purchase</h2>
            <div className="text-default-600 space-y-4">
              <p>After your purchase is completed:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You will receive an email confirmation with your order details</li>
                <li>Download links will be provided immediately after payment confirmation</li>
                <li>You can access your purchased products through your account</li>
                <li>Download links remain active for future re-downloads</li>
              </ul>
              <p className="mt-4">
                Once you have accessed or downloaded a product, the sale is considered final and no refund will be issued.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Exceptions</h2>
            <div className="text-default-600 space-y-4">
              <p>
                <strong>There are no exceptions to this policy.</strong> This includes, but is not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Change of mind or buyer&apos;s remorse</li>
                <li>Accidental purchases</li>
                <li>Duplicate purchases</li>
                <li>Technical issues (we will work to resolve technical problems, but refunds are not provided)</li>
                <li>Compatibility issues (customers are responsible for verifying compatibility before purchase)</li>
                <li>Dissatisfaction with product quality or features</li>
                <li>Inability to use the product</li>
                <li>Product updates or new versions being released</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Technical Issues and Support</h2>
            <div className="text-default-600 space-y-4">
              <p>
                If you experience technical issues with a purchased product, we are committed to helping resolve them:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Support Assistance:</strong> Contact our support team for help with download issues, access problems, or technical difficulties</li>
                <li><strong>Product Updates:</strong> We may provide updates or fixes for products when available</li>
                <li><strong>Alternative Solutions:</strong> We will work with you to find solutions to technical problems</li>
              </ul>
              <p className="mt-4">
                However, technical support does not constitute grounds for a refund. We will make every effort to resolve issues, but refunds will not be issued for technical problems.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Payment Processing Errors</h2>
            <div className="text-default-600 space-y-4">
              <p>
                In the rare event of a payment processing error (such as duplicate charges or incorrect amounts):
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact us immediately with details of the error</li>
                <li>We will investigate the issue with our payment processor</li>
                <li>If an error is confirmed, we will work to resolve it appropriately</li>
                <li>This may include refunding the erroneous charge, but not the original purchase</li>
              </ul>
              <p className="mt-4">
                Payment processing errors are different from product refunds and will be handled on a case-by-case basis.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Chargebacks and Disputes</h2>
            <div className="text-default-600 space-y-4">
              <p>
                If you initiate a chargeback or dispute with your payment provider:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will provide evidence of the completed transaction and product delivery</li>
                <li>Your account may be suspended pending resolution</li>
                <li>Access to purchased products may be revoked</li>
                <li>We reserve the right to take appropriate action to protect our business</li>
              </ul>
              <p className="mt-4">
                Chargebacks initiated without valid reason may result in permanent account suspension and legal action.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Your Rights</h2>
            <div className="text-default-600 space-y-4">
              <p>
                While we do not offer refunds, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Receive accurate product descriptions and information</li>
                <li>Access purchased products as described</li>
                <li>Receive customer support for technical issues</li>
                <li>Re-download purchased products when needed</li>
                <li>Contact us with questions or concerns</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-default-600 leading-relaxed">
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services after changes are posted constitutes acceptance of the modified policy. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-default-600 leading-relaxed">
              If you have questions about this Refund Policy or need assistance with a purchase, please contact our support team. While we cannot provide refunds, we are committed to providing excellent customer service and will do our best to address your concerns.
            </p>
          </section>

          <div className="mt-12 p-6 bg-default-100 rounded-xl">
            <p className="text-sm text-default-600">
              By making a purchase on Fiyova, you acknowledge that you have read, understood, and agree to this Refund Policy. You understand that all sales are final and that no refunds will be provided under any circumstances.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


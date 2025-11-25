import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="mt-4 text-lg text-default-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-default-600 leading-relaxed">
              Fiyova (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <div className="text-default-600 space-y-4">
              <p>We collect information that you provide directly to us and information that is automatically collected when you use our services:</p>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Name, email address, password, and other registration details</li>
                  <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through our payment partners)</li>
                  <li><strong>Purchase Information:</strong> Products purchased, purchase history, and transaction details</li>
                  <li><strong>Communication Data:</strong> Messages, inquiries, and feedback you send to us</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, and navigation paths</li>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                  <li><strong>Cookies and Tracking:</strong> Information collected through cookies, web beacons, and similar technologies</li>
                  <li><strong>Log Data:</strong> Server logs, error reports, and performance data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <div className="text-default-600 space-y-4">
              <p>We use the information we collect for various purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Delivery:</strong> Process purchases, deliver products, and provide customer support</li>
                <li><strong>Account Management:</strong> Create and manage your account, authenticate your identity</li>
                <li><strong>Communication:</strong> Send order confirmations, product updates, and respond to inquiries</li>
                <li><strong>Improvement:</strong> Analyze usage patterns to improve our website and services</li>
                <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security threats</li>
                <li><strong>Legal Compliance:</strong> Comply with legal obligations and enforce our terms</li>
                <li><strong>Marketing:</strong> Send promotional communications (with your consent, which you can opt out of)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
            <div className="text-default-600 space-y-4">
              <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Service Providers</h3>
                <p>We share information with third-party service providers who perform services on our behalf, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Payment processors for transaction handling</li>
                  <li>Email service providers for communications</li>
                  <li>Hosting and cloud service providers</li>
                  <li>Analytics and performance monitoring services</li>
                </ul>
                <p className="mt-2">These providers are contractually obligated to protect your information and use it only for specified purposes.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Legal Requirements</h3>
                <p>We may disclose information if required by law, court order, or government regulation, or to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Comply with legal processes or respond to government requests</li>
                  <li>Enforce our Terms of Service and other agreements</li>
                  <li>Protect our rights, property, or safety, or that of our users</li>
                  <li>Prevent fraud or investigate potential violations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Business Transfers</h3>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <div className="text-default-600 space-y-4">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure payment processing through certified providers</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
            <div className="text-default-600 space-y-4">
              <p>We use cookies and similar tracking technologies to track activity on our website and store certain information. Types of cookies we use include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Privacy Rights</h2>
            <div className="text-default-600 space-y-4">
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us using the information provided in the Contact section below. We will respond to your request within a reasonable timeframe and in accordance with applicable law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-default-600 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it. Account information is retained while your account is active and for a reasonable period thereafter for legal and business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-default-600 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child without verification of parental consent, we will take steps to delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="text-default-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our services, you consent to the transfer of your information to these countries. We take appropriate safeguards to ensure your information receives adequate protection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Third-Party Links</h2>
            <p className="text-default-600 leading-relaxed">
              Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-default-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-default-600 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through our support channels. We are committed to addressing your privacy concerns and ensuring compliance with applicable data protection laws.
            </p>
          </section>

          <div className="mt-12 p-6 bg-default-100 rounded-xl">
            <p className="text-sm text-default-600">
              By using Fiyova, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


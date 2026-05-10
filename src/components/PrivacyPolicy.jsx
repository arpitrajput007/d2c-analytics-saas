import React from 'react';
import { AuroraBackground } from './aurora-background';
import { SiteNav } from './site-nav';
import { CtaFooter } from './cta-footer';

export default function PrivacyPolicy() {
  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased selection:bg-accent/20">
      <AuroraBackground />
      <SiteNav />
      
      <main className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-glass-border bg-glass/50 p-8 sm:p-12 shadow-glow backdrop-blur-md">
            
            <div className="mb-10 border-b border-glass-border pb-8">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-4">
                Privacy Policy <span className="text-muted-foreground">— Pocket Dashboard</span>
              </h1>
              <p className="text-muted-foreground">Last Updated: May 2026</p>
            </div>

            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p className="lead text-lg text-foreground mb-8">
                Welcome to Pocket Dashboard (“Pocket Dashboard”, “we”, “our”, or “us”).
                Pocket Dashboard is an operational analytics and business intelligence platform designed for modern D2C brands, e-commerce operators, and online businesses. This Privacy Policy explains how we collect, use, process, store, and protect information when you access our website, applications, integrations, dashboards, AI systems, and related services (collectively, the “Services”).
                By accessing or using Pocket Dashboard, you acknowledge and agree to the practices described in this Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">1.1 Account Information</h3>
              <p>When creating or managing an account, we may collect:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Full name</li>
                <li>Business/store name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing information</li>
                <li>Account credentials</li>
                <li>Subscription details</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">1.2 Connected Platform Data</h3>
              <p>When you connect third-party services such as Shopify, WooCommerce, Meta Ads, Shiprocket, Razorpay, Cashfree, or similar platforms, Pocket Dashboard may securely access operational business data including:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Orders and fulfilment data</li>
                <li>Product and SKU information</li>
                <li>Shipping and logistics data</li>
                <li>Payment and transaction metadata</li>
                <li>Advertising metrics and campaign performance</li>
                <li>Revenue and profitability metrics</li>
                <li>Inventory-related information</li>
                <li>Operational performance indicators</li>
              </ul>
              <p className="mb-6">Pocket Dashboard accesses only the permissions and data necessary to provide analytics, synchronization, operational intelligence, reporting, and AI-assisted insights.</p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">1.3 AI & Operational Intelligence Data</h3>
              <p>To provide contextual insights and AI-assisted features, our systems may process:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Historical operational patterns</li>
                <li>Business performance trends</li>
                <li>Aggregated analytical metrics</li>
                <li>User queries and interactions with AI systems</li>
                <li>Dashboard usage behavior</li>
                <li>Performance summaries and generated insights</li>
              </ul>
              <p className="mb-4">This data helps create a business-specific operational intelligence layer designed to improve the relevance and usefulness of insights over time.</p>
              <div className="bg-glass-strong border border-glass-border rounded-lg p-4 mb-6">
                <strong className="text-foreground">IMPORTANT:</strong> Pocket Dashboard does not use private customer business data to train public AI models.
              </div>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">1.4 Technical & Device Information</h3>
              <p>We may automatically collect certain technical information including:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device information</li>
                <li>Operating system</li>
                <li>Session identifiers</li>
                <li>Usage analytics</li>
                <li>Error logs</li>
                <li>Cookie and diagnostic information</li>
              </ul>
              <p className="mb-6">This information helps maintain platform stability, security, and performance.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">2. How We Use Information</h2>
              <p>We use collected information to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Provide and maintain Services</li>
                <li>Generate analytics and operational insights</li>
                <li>Synchronize business data across integrations</li>
                <li>Improve AI-assisted recommendations</li>
                <li>Enhance platform reliability and performance</li>
                <li>Detect operational anomalies and system abuse</li>
                <li>Provide customer support</li>
                <li>Process billing and subscription management</li>
                <li>Monitor infrastructure health and security</li>
                <li>Improve user experience and product functionality</li>
              </ul>
              <p className="mb-6 font-medium text-foreground">We do not sell customer data or personal information to third parties.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">3. AI Systems & Business Intelligence</h2>
              <p className="mb-4">Pocket Dashboard includes AI-assisted operational intelligence systems designed to help users better understand business performance and operational patterns. Our AI systems may:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Analyze historical trends</li>
                <li>Surface operational anomalies</li>
                <li>Generate summaries and recommendations</li>
                <li>Identify inefficiencies and margin leakage</li>
                <li>Provide context-aware business insights</li>
              </ul>
              <p className="mb-6">These systems are designed to assist decision-making and operational visibility. They do not guarantee financial outcomes, business performance improvements, or predictive certainty. All AI-generated insights should be independently reviewed before making financial or operational decisions.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">4. Read-Only Platform Access</h2>
              <p className="mb-4">Pocket Dashboard primarily operates using read-only integrations wherever possible. We:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Do not modify your store content</li>
                <li>Do not create or edit orders without explicit authorization</li>
                <li>Do not manage customer payments</li>
                <li>Do not access unnecessary permissions</li>
              </ul>
              <p className="mb-6">Our systems are designed to retrieve and process data for analytics and operational intelligence purposes only.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">5. Data Security</h2>
              <p className="mb-4">We implement commercially reasonable safeguards intended to protect customer information, including:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>HTTPS/SSL encrypted communication</li>
                <li>Access control mechanisms</li>
                <li>Encrypted credential storage</li>
                <li>Infrastructure monitoring</li>
                <li>Authentication and authorization controls</li>
                <li>Internal access restrictions</li>
                <li>Secure cloud infrastructure practices</li>
              </ul>
              <p className="mb-6">While we strive to protect information, no digital system can guarantee absolute security.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">6. Data Retention</h2>
              <p className="mb-4">We retain information only for as long as reasonably necessary to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Provide Services</li>
                <li>Maintain account functionality</li>
                <li>Improve platform operations</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce agreements</li>
              </ul>
              <p className="mb-6">Users may request deletion of their account and associated data subject to applicable legal or operational requirements.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">7. Third-Party Integrations</h2>
              <p className="mb-4">Pocket Dashboard integrates with third-party platforms and service providers. Your use of those services remains subject to their respective terms and privacy policies. These services may include:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Shopify</li>
                <li>WooCommerce</li>
                <li>Meta</li>
                <li>Google</li>
                <li>Shiprocket</li>
                <li>Razorpay</li>
                <li>Cashfree</li>
                <li>OpenAI or AI infrastructure providers</li>
                <li>Cloud hosting providers</li>
              </ul>
              <p className="mb-6">Pocket Dashboard is not responsible for the privacy practices or operational behavior of third-party services.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">8. Cookies & Analytics Technologies</h2>
              <p className="mb-4">We may use cookies, session storage, and similar technologies to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Maintain authentication sessions</li>
                <li>Remember user preferences</li>
                <li>Analyze platform usage</li>
                <li>Improve performance and reliability</li>
                <li>Enhance security</li>
              </ul>
              <p className="mb-6">Users may disable cookies through browser settings, though certain features may become unavailable.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">9. User Responsibilities</h2>
              <p className="mb-4">Users are responsible for:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Maintaining credential confidentiality</li>
                <li>Ensuring lawful platform usage</li>
                <li>Managing permissions granted to integrations</li>
                <li>Reviewing AI-generated recommendations independently</li>
                <li>Ensuring compliance with applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">10. Confidentiality & Business Data</h2>
              <p className="mb-4">Pocket Dashboard recognizes that operational business data is commercially sensitive. Accordingly:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Customer business data is treated as confidential</li>
                <li>Internal access is restricted to authorized personnel only</li>
                <li>We do not publicly expose private store information</li>
                <li>We do not knowingly share proprietary operational metrics with unrelated third parties</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">11. Limitation of Liability</h2>
              <p className="mb-4">Pocket Dashboard is provided on an “as available” and “as is” basis. We do not guarantee:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Business profitability</li>
                <li>Operational outcomes</li>
                <li>Data accuracy from third-party platforms</li>
                <li>Continuous uptime</li>
                <li>Error-free AI outputs</li>
                <li>Predictive certainty</li>
              </ul>
              <p className="mb-6">Pocket Dashboard shall not be liable for indirect, incidental, consequential, or business-related losses arising from platform usage, external platform failures, operational decisions, or reliance on generated insights.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">12. International Users</h2>
              <p className="mb-6">By using Pocket Dashboard, users understand that information may be processed or stored in jurisdictions outside their local region depending on infrastructure providers and operational requirements.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">13. Changes to This Privacy Policy</h2>
              <p className="mb-6">We may update this Privacy Policy periodically to reflect operational, legal, technical, or product changes. Updated versions will be published on this page with a revised effective date. Continued use of the Services following updates constitutes acceptance of the revised Privacy Policy.</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">14. Contact Information</h2>
              <p className="mb-6">For privacy-related inquiries, support requests, or data concerns, contact:<br />
              <strong>Pocket Dashboard</strong><br />
              Email: support@pocketdashboard.app</p>

              <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">15. Consent</h2>
              <p className="mb-6">By accessing or using Pocket Dashboard, you acknowledge that you have read, understood, and agreed to this Privacy Policy and our data handling practices.</p>

            </div>
          </div>
        </div>
      </main>
      
      <CtaFooter />
    </div>
  );
}

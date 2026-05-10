import React, { useState } from "react";
import { ArrowRight, Building2, CheckCircle2, ChevronDown, Clock, Loader2, Lock, MessageSquare, ShieldCheck, Zap } from "lucide-react";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset after some time
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Animated grid background & ambient glow */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 items-start">
          
          {/* LEFT SIDE: Copy & Trust Positioning */}
          <div className="flex flex-col justify-center max-w-lg">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
              <MessageSquare className="h-3 w-3 text-accent" />
              Contact Us
            </div>
            
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[54px] lg:leading-[1.1] mb-6">
              Built for growing brands. <span className="text-gradient">Let's talk.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Whether you need onboarding help, a custom integration, or want to discuss enterprise requirements — our team is ready to build your business command center.
            </p>

            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-glass border border-glass-border">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Fast, founder-focused support</div>
                  <div className="text-xs text-muted-foreground">Average response time: under 24 hours</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-glass border border-glass-border">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Secure & Encrypted</div>
                  <div className="text-xs text-muted-foreground">Read-only integrations. No spam. Ever.</div>
                </div>
              </div>
            </div>

            {/* Enterprise Block */}
            <div className="gradient-border rounded-2xl p-[1px] group">
              <div className="rounded-2xl p-6 h-full transition-all duration-300"
                   style={{
                     background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                   }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                       style={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)" }}>
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Need a custom operational dashboard?</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Multi-store management, advanced reporting, dedicated onboarding, and custom internal team workflows.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground">
                   <span className="bg-glass-strong border border-glass-border px-2 py-1 rounded-md">Enterprise Workflows</span>
                   <span className="bg-glass-strong border border-glass-border px-2 py-1 rounded-md">Custom Integrations</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Premium Form UI */}
          <div className="relative">
            {/* Soft background glow behind form */}
            <div className="absolute -inset-4 rounded-[3rem] bg-indigo-500/10 blur-3xl opacity-50 pointer-events-none" />
            
            <div className="relative rounded-3xl border border-glass-border bg-[#0a0a0f]/90 p-8 shadow-2xl backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mb-4">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">Request Sent</h3>
                    <p className="text-muted-foreground">We've received your details and will be in touch shortly.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-foreground/80">Full Name</label>
                        <input type="text" required placeholder="Jane Doe" 
                               className="w-full rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-indigo-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-foreground/80">Business / Brand Name</label>
                        <input type="text" required placeholder="Acme D2C" 
                               className="w-full rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-indigo-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-foreground/80">Work Email</label>
                        <input type="email" required placeholder="jane@acme.com" 
                               className="w-full rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-indigo-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-foreground/80">Phone Number</label>
                        <input type="tel" required placeholder="+91 98765 43210" 
                               className="w-full rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-indigo-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5 relative">
                        <label className="text-[13px] font-medium text-foreground/80">Monthly Order Volume</label>
                        <div className="relative">
                          <select required className="w-full appearance-none rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-foreground transition-all focus:border-indigo-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                            <option value="" disabled selected className="text-muted-foreground">Select volume...</option>
                            <option value="<1000">Less than 1,000</option>
                            <option value="1000-5000">1,000 - 5,000</option>
                            <option value="5000-10000">5,000 - 10,000</option>
                            <option value="10000+">10,000+</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5 relative">
                        <label className="text-[13px] font-medium text-foreground/80">Platform Used</label>
                        <div className="relative">
                          <select required className="w-full appearance-none rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-foreground transition-all focus:border-indigo-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                            <option value="" disabled selected className="text-muted-foreground">Select platform...</option>
                            <option value="shopify">Shopify</option>
                            <option value="woocommerce">WooCommerce</option>
                            <option value="custom">Custom Build</option>
                            <option value="amazon">Amazon / Marketplaces</option>
                            <option value="multiple">Multiple Platforms</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 relative">
                      <label className="text-[13px] font-medium text-foreground/80">What do you need help with?</label>
                      <div className="relative">
                        <select required className="w-full appearance-none rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-foreground transition-all focus:border-indigo-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                          <option value="" disabled selected className="text-muted-foreground">Select a topic...</option>
                          <option value="demo">Dashboard Demo</option>
                          <option value="starter">Starter Plan Questions</option>
                          <option value="pro">Pro Plan Questions</option>
                          <option value="custom">Custom Dashboard Request</option>
                          <option value="ai">AI Co-Pilot Inquiry</option>
                          <option value="integration">Integration Support</option>
                          <option value="enterprise">Enterprise Setup</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-foreground/80">Message</label>
                      <textarea required rows={4} placeholder="Tell us about your business, current workflow or requirements..." 
                                className="w-full resize-none rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-indigo-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-aurora group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-80"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Sending Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Start Conversation</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Your information is secure and confidential.
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

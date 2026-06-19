"use client";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
            Get in Touch
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-neutral-900 mb-4">
            Contact Us
          </h1>
          <p className="text-neutral-600 text-lg font-light leading-relaxed mb-12">
            We&apos;d love to hear from you. Whether you have a question about our collections, need help with an order, or want to commission a custom piece, our team is here to help.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-neutral-500 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-neutral-500 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full h-12 px-4 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-neutral-500 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-neutral-500 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2 resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#C9A84C] hover:bg-[#B8973A] text-white font-medium rounded-sm transition-colors text-sm tracking-wide uppercase"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium tracking-wider uppercase text-neutral-900 mb-3">
                  Visit Our Studio
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Ratnagiri Jewelry Studio<br />
                  Jaipur, Rajasthan<br />
                  India
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium tracking-wider uppercase text-neutral-900 mb-3">
                  Email
                </h3>
                <p className="text-neutral-600 text-sm">hello@ratnagiri.com</p>
              </div>
              <div>
                <h3 className="text-sm font-medium tracking-wider uppercase text-neutral-900 mb-3">
                  Phone
                </h3>
                <p className="text-neutral-600 text-sm">+91 141 234 5678</p>
              </div>
              <div>
                <h3 className="text-sm font-medium tracking-wider uppercase text-neutral-900 mb-3">
                  Business Hours
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Monday – Saturday: 10:00 AM – 7:00 PM IST<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find your perfect fit with our comprehensive Indian jewelry size guide.",
};

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
          Size Guide
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-8">
          Find Your Perfect Fit
        </h1>

        <div className="space-y-10 text-neutral-700">
          <section>
            <h2 className="text-xl font-serif text-neutral-900 mb-4">Ring Size Guide</h2>
            <p className="text-sm leading-relaxed mb-4">
              Measure the circumference of your finger with a thin strip of paper or string. Use the chart below to find your size.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-[#F8F5F0]">
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Size</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Circumference (mm)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Diameter (mm)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">US Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ["Small", "49.3", "15.7", "5"],
                    ["Medium", "51.8", "16.5", "6"],
                    ["Regular", "54.4", "17.3", "7"],
                    ["Large", "56.9", "18.1", "8"],
                    ["Extra Large", "59.5", "18.9", "9"],
                  ].map(([size, circ, dia, us]) => (
                    <tr key={size} className="border-b border-neutral-100">
                      <td className="px-4 py-3 font-medium text-neutral-900">{size}</td>
                      <td className="px-4 py-3">{circ}</td>
                      <td className="px-4 py-3">{dia}</td>
                      <td className="px-4 py-3">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-neutral-900 mb-4">Necklace Length Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-[#F8F5F0]">
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Style</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Length (inches)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Length (cm)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Sits At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ["Choker", "14–16", "36–41", "Base of neck"],
                    ["Princess", "18–20", "46–51", "Just below collarbone"],
                    ["Matinee", "22–24", "56–61", "Above bust"],
                    ["Opera", "28–34", "71–86", "Bustline / can be doubled"],
                    ["Rope", "36+", "91+", "Below bust / versatile"],
                  ].map(([style, inches, cm, sits]) => (
                    <tr key={style} className="border-b border-neutral-100">
                      <td className="px-4 py-3 font-medium text-neutral-900">{style}</td>
                      <td className="px-4 py-3">{inches}</td>
                      <td className="px-4 py-3">{cm}</td>
                      <td className="px-4 py-3">{sits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-neutral-900 mb-4">Bangle Size Guide</h2>
            <p className="text-sm leading-relaxed mb-4">
              Measure your hand circumference by bringing your thumb and little finger together, then measure around the widest part of your hand.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-[#F8F5F0]">
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Size</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Inner Diameter (mm)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider uppercase text-neutral-500">Hand Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ["2.4 (Small)", "60.5", "190–200"],
                    ["2.6 (Medium)", "66", "200–210"],
                    ["2.8 (Regular)", "71.5", "210–220"],
                    ["2.10 (Large)", "76.5", "220–230"],
                  ].map(([size, dia, circ]) => (
                    <tr key={size} className="border-b border-neutral-100">
                      <td className="px-4 py-3 font-medium text-neutral-900">{size}</td>
                      <td className="px-4 py-3">{dia}</td>
                      <td className="px-4 py-3">{circ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-neutral-900 mb-4">Need Help?</h2>
            <p className="text-sm leading-relaxed">
              If you&apos;re unsure about sizing, our team is happy to help. Contact us at{" "}
              <span className="text-[#C9A84C]">hello@ratnagiri.com</span> and we&apos;ll guide you to the perfect fit.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
import type { Carousel, DesignSystem, FrameStyle } from '../types';

// Initial carousel data with text variations
export const initialCarousels: Carousel[] = [
  {
    id: 1,
    name: "The Deal That Got Away",
    subtitle: "Investors / Acquisitions",
    frameSize: "portrait",
    frames: [
      {
        id: 1,
        variants: [
          { headline: "A 200-unit value-add hit the market at 9am.", body: "The clock starts now.", formatting: {} },
          { headline: "The deal dropped at 9am. 200 units. Prime submarket.", body: "Everyone saw it.", formatting: {} },
          { headline: "9:00 AM: New listing alert. 200 units.", body: "Your competition just woke up too.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "dark-single-pin"
      },
      {
        id: 2,
        variants: [
          { headline: "By 2pm, you're still pulling comps manually.", body: "Spreadsheets. Browser tabs. Guesswork.", formatting: {} },
          { headline: "Five hours later. Still no underwriting.", body: "Manual comps are killing your velocity.", formatting: {} },
          { headline: "2:00 PM: You're on your third data source.", body: "Nothing matches. Nothing's current.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "dark-chaos"
      },
      {
        id: 3,
        variants: [
          { headline: "By 4pm, three groups have already toured.", body: "They moved faster. They had better data.", formatting: {} },
          { headline: "The property manager says you're fourth in line.", body: "Three offers already on the table.", formatting: {} },
          { headline: "4:00 PM: Your competitors aren't guessing.", body: "They're already submitting LOIs.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "dark-competition"
      },
      {
        id: 4,
        variants: [
          { headline: "What if you had comps, expenses, and NOI in 60 seconds?", body: "Rent comps. Expense benchmarks. Similarity scores. Instantly.", formatting: {} },
          { headline: "Same deal. Different outcome.", body: "AI-powered underwriting from just an address.", formatting: {} },
          { headline: "One address. Complete analysis.", body: "97% accuracy. 60 seconds. No manual work.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "reveal-product"
      },
      {
        id: 5,
        variants: [
          { headline: "Screen faster. Bid smarter. Win more.", body: "Join 25,000+ multifamily professionals →", formatting: {} },
          { headline: "Stop losing deals to slower data.", body: "Get a demo of HelloData →", formatting: {} },
          { headline: "The fastest teams win the best deals.", body: "See HelloData in action →", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "cta-win"
      }
    ]
  },
  {
    id: 2,
    name: "Where Rents Are Heading",
    subtitle: "Rent Forecast Launch",
    frameSize: "portrait",
    frames: [
      {
        id: 1,
        variants: [
          { headline: "Your rent projections are 90 days old.", body: "The moment you get them.", formatting: {} },
          { headline: "Q3 forecast in Q4. Sound familiar?", body: "Static reports can't keep pace.", formatting: {} },
          { headline: "That rent growth assumption in your model?", body: "It's already outdated.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "static-gray"
      },
      {
        id: 2,
        variants: [
          { headline: "Markets move daily. Static forecasts can't.", body: "Concessions shift. Demand spikes. Rents adjust.", formatting: {} },
          { headline: "Last quarter's data. Today's decisions.", body: "That's the problem with traditional forecasts.", formatting: {} },
          { headline: "The market moved 47 times since your last report.", body: "Your forecast didn't.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "cracking"
      },
      {
        id: 3,
        variants: [
          { headline: "What if your forecast updated every single day?", body: "Real-time market signals. Daily projections.", formatting: {} },
          { headline: "Imagine seeing rent movement as it happens.", body: "Not quarterly. Daily.", formatting: {} },
          { headline: "Live rent intelligence. Continuous updates.", body: "The forecast that never gets stale.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "heatmap-transform"
      },
      {
        id: 4,
        variants: [
          { headline: "Introducing Rent Forecast", body: "12-month projections powered by real-time market data.", formatting: {} },
          { headline: "NEW: Rent Forecast by HelloData", body: "Forward-looking projections. Updated daily.", formatting: {} },
          { headline: "Rent Forecast: See the next 12 months.", body: "Property, submarket, and market-level predictions.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "product-forecast"
      },
      {
        id: 5,
        variants: [
          { headline: "See where your market is heading.", body: "Get early access to Rent Forecast →", formatting: {} },
          { headline: "Stop guessing. Start forecasting.", body: "Request your demo →", formatting: {} },
          { headline: "The future of rent projections is here.", body: "Be first to see it →", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "cta-forecast"
      }
    ]
  },
  {
    id: 3,
    name: "5 Hours You'll Never Get Back",
    subtitle: "Property Managers",
    frameSize: "portrait",
    frames: [
      {
        id: 1,
        variants: [
          { headline: "Monday: Call Oakwood Apartments.", body: "Wait on hold. Get voicemail.", formatting: {} },
          { headline: "Monday 9am: Start your comp calls.", body: "First three go straight to voicemail.", formatting: {} },
          { headline: "Another Monday. Another round of phone surveys.", body: "Let's see who actually picks up.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "monday"
      },
      {
        id: 2,
        variants: [
          { headline: "Tuesday: Finally reach The Meridian.", body: "'We don't give out pricing over the phone.'", formatting: {} },
          { headline: "Tuesday 2pm: Success! Someone answered.", body: "'That information is confidential.'", formatting: {} },
          { headline: "Tuesday: Three callbacks. One useful number.", body: "And it might already be wrong.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "tuesday"
      },
      {
        id: 3,
        variants: [
          { headline: "Wednesday: Check 12 competitor websites.", body: "Pricing already changed on half of them.", formatting: {} },
          { headline: "Wednesday: Manual website audits.", body: "Copy. Paste. Repeat. Repeat. Repeat.", formatting: {} },
          { headline: "Wednesday: The spreadsheet grows.", body: "But is any of this data still accurate?", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "wednesday"
      },
      {
        id: 4,
        variants: [
          { headline: "Thursday: Enter everything into Excel.", body: "Friday: Half the data is already stale.", formatting: {} },
          { headline: "Thursday-Friday: Format the report.", body: "Monday: Start over. Prices changed.", formatting: {} },
          { headline: "End of week: Finally done.", body: "Just in time for the data to be outdated.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "thursday-friday"
      },
      {
        id: 5,
        variants: [
          { headline: "Or get it all delivered to your inbox.", body: "Automatically. Every week. Try it free →", formatting: {} },
          { headline: "5 hours back. Every single week.", body: "Automate your market surveys →", formatting: {} },
          { headline: "Stop calling. Start automating.", body: "Free trial — no card required →", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "cta-automated"
      }
    ]
  }
];

// Frame background styles
type FrameStyleResult = { background: string; accent: string };

export const getFrameStyle = (carouselId: number, frameStyle: string, ds: DesignSystem): FrameStyleResult => {
  const styles: Record<string, FrameStyleResult> = {
    "dark-single-pin": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`, accent: ds.primary },
    "dark-chaos": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: '#ef4444' },
    "dark-competition": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`, accent: ds.accent },
    "reveal-product": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.secondary} 100%)`, accent: ds.primary },
    "cta-win": { background: `linear-gradient(135deg, ${ds.secondary} 0%, ${ds.primary} 100%)`, accent: ds.neutral3 },
    "static-gray": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: '#9ca3af' },
    "cracking": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: ds.accent },
    "heatmap-transform": { background: `linear-gradient(135deg, ${ds.secondary} 0%, ${ds.primary} 100%)`, accent: ds.accent },
    "product-forecast": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.secondary} 100%)`, accent: ds.primary },
    "cta-forecast": { background: `linear-gradient(135deg, ${ds.primary} 0%, ${ds.secondary} 100%)`, accent: ds.neutral3 },
    "monday": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`, accent: ds.primary },
    "tuesday": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`, accent: ds.accent },
    "wednesday": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: ds.primary },
    "thursday-friday": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: '#f87171' },
    "cta-automated": { background: `linear-gradient(135deg, ${ds.secondary} 0%, ${ds.primary} 100%)`, accent: ds.neutral3 },
  };
  return styles[frameStyle] || styles["dark-single-pin"];
};


import { JERE_OFFLINE_ANSWER, jereOfflineSteps, jereWorkflowGuides } from "@/app/lib/jereKnowledge";
import { JERE_DOMAIN_ORIGIN, JERE_LEGACY_PATH, jereDomainEnabled } from "@/app/lib/jereDomain";
import { SITE_URL } from "@/app/lib/site";

/** When the wording of these short pages was last checked against the product. */
export const JERE_SEARCH_PAGES_REVIEWED = "2026-11-01";

export type JereSearchPage = {
  slug: string;
  /** The page title in search results. */
  title: string;
  /** The short summary shown under the title in search results. */
  description: string;
  h1: string;
  /** The direct answer, written to stand alone if a search engine quotes it. */
  answer: string;
  stepsTitle: string;
  steps: string[];
  /** Plain warnings and limits, stated honestly. */
  notes: string[];
  faqs: { question: string; answer: string }[];
  /** Slugs of the other short pages worth reading next. */
  related: string[];
};

const productSteps = jereWorkflowGuides.find((w) => w.id === "product-sales")!.steps;

export const jereSearchPages: JereSearchPage[] = [
  {
    slug: "record-daily-sales",
    title: "How to record daily sales for a small shop in Nigeria | Jèrè",
    description: "A simple way to record every sale for a small shop: cash, transfer, POS or on credit. See your totals by day, week, month or year with Jèrè.",
    h1: "How to record daily sales for a small shop",
    answer:
      "Write each sale down as it happens, with what was sold, how many and how it was paid. A notebook works for a few days, but it is slow to add up and easy to lose. Jèrè (Jere) lets you record each sale on your phone as cash, transfer, POS or credit, and shows your figures by day, week, month or year.",
    stepsTitle: "Record your sales with Jèrè",
    steps: productSteps,
    notes: [
      "Jèrè records what you tell it. It does not take money from your customer. For transfers and POS payments, check the money through your bank or POS provider.",
      "You can share a receipt through WhatsApp or another app you choose.",
      "Cashiers can record sales without seeing your costs or profit.",
    ],
    faqs: [
      { question: "Which payment methods can I record?", answer: "Cash, transfer, POS or customer credit. For credit sales you can also record any amount paid now." },
      { question: "Can my cashier record sales without seeing my profit?", answer: "Yes. Invite a cashier by code and choose what they can see. Cashiers can record sales without seeing your costs or profit." },
      { question: "Do I need to download an app?", answer: "Jèrè runs in your browser. You can also add it to your phone’s home screen." },
    ],
    related: ["know-your-profit", "track-customer-debts", "sell-without-internet-nigeria"],
  },
  {
    slug: "know-your-profit",
    title: "How to know your profit as a small business | Jèrè",
    description: "Sales are not profit. See how to work out your estimated profit from what you sold, what it cost you and your expenses, and how Jèrè does it for you.",
    h1: "How to know your profit as a small business",
    answer:
      "Your profit is what is left after you take away what the goods cost you and what you spent to run the business. Money in your hand is not the same thing: it can include money that must go on stock and bills. Jèrè (Jere) shows an estimated profit from the sales, costs and expenses you record.",
    stepsTitle: "See your estimated profit in Jèrè",
    steps: [
      "Add each product with its selling price and what it cost you. Record new stock when you buy it, with its cost.",
      "Record every sale. Jèrè keeps the price and the cost from that day, so a later price change does not rewrite past profit.",
      "Record your expenses, such as transport, electricity and rent. For expenses that come round regularly, set a reminder.",
      "Open Today and read your estimated profit for the day. Switch to the week, month or year to compare with the period before.",
      "Open Which products make me money to see your best earners, products sold below cost and stock that has not sold.",
    ],
    notes: [
      "The profit figure is an estimate. It is only as good as the prices, costs and expenses that you or your team record. If something is missing or wrong, the estimate will be wrong too.",
      "Sales on credit count when you record them, before the customer pays, so profit can be ahead of the cash you have in hand.",
      "Money you put into the business, loans and money you take out are kept separate from sales and estimated profit.",
    ],
    faqs: [
      { question: "Is money collected the same as profit?", answer: "No. Money collected and profit answer different questions. Costs, expenses and returns you record all affect your estimated profit." },
      { question: "Why is it called estimated profit?", answer: "Because it depends on the costs and expenses you enter. Jèrè works with what you record and cannot know what you leave out." },
      { question: "Can I see which products make me money?", answer: "Yes. Jèrè shows your best earners, products sold below cost and stock that has not sold." },
    ],
    related: ["record-daily-sales", "track-customer-debts"],
  },
  {
    slug: "track-customer-debts",
    title: "How to keep track of customers who owe you | Jèrè",
    description: "Stop customers slipping through. Record sales on credit, take part-payments and see who still owes you, with Jèrè for small businesses in Nigeria.",
    h1: "How to keep track of customers who owe you",
    answer:
      "Give each customer who buys on credit a name in your records, write down what they owe when they take the goods, and record every payment they make. Jèrè (Jere) keeps customer debts and payments together, so you can see who still owes you and how much.",
    stepsTitle: "Track customer credit in Jèrè",
    steps: [
      "When a customer buys on credit, open Sell, choose the goods and the payment method On credit. Choose the customer, and enter any amount they paid now.",
      "Open Owing to see every customer who still owes you, with the amount for each.",
      "When a customer pays something later, open their page and record the payment. The amount owed comes down.",
      "To remind a customer, use Remind. Jèrè opens WhatsApp with the message ready, and you press send. Nothing is sent until you do.",
    ],
    notes: [
      "A customer’s debt is shared across all their credit sales. A single order shows what was paid when it was recorded, not what is still owed on that order alone.",
      "A new customer needs internet to be added. Offline credit sales use customers already saved on your phone.",
      "Cashiers see customer balances only if you allow it.",
    ],
    faqs: [
      { question: "Can I record part-payments?", answer: "Yes. Enter any amount paid now when you record the sale, and record later payments on the customer’s page." },
      { question: "Does Jèrè send reminders to my customers?", answer: "Not by itself. Remind opens WhatsApp with the message ready, and you press send." },
      { question: "Can I download my records?", answer: "Yes. Open My data and account in Jèrè to download your business records." },
    ],
    related: ["record-daily-sales", "know-your-profit"],
  },
  {
    slug: "sell-without-internet-nigeria",
    title: "Record sales without internet: a sales app for small shops | Jèrè",
    description: "What to use to record sales when the network drops. Jèrè Plus saves your sales on the phone and sends them when the connection returns. What works, and what does not.",
    h1: "How to record sales when the internet goes down",
    answer: JERE_OFFLINE_ANSWER,
    stepsTitle: "Set up and use offline recording",
    steps: jereOfflineSteps.map((s) => `${s.title}. ${s.text}`),
    notes: [
      "Offline recording is part of Plus. Basic needs internet.",
      "Keep entries waiting to send on the same phone. Clearing browser storage, resetting the phone or removing its saved app data can remove unsent entries.",
      "Adding a new customer, changing an existing product’s price or stock, cancelling a sale and changing your PIN need internet.",
      "Offline recording saves the sale’s details. Confirm bank transfers and card payments through your usual bank or POS provider.",
    ],
    faqs: [
      { question: "Does Jèrè work without internet?", answer: "On Plus, yes. You can record product sales, customer payments, expenses and new products offline. Open Jèrè online first so it can save a copy on your phone. Entries send automatically when you reconnect." },
      { question: "What still needs internet?", answer: "Business modes, service jobs, invoices, online orders, returns and refunds need internet. So do adding a new customer, cancelling a sale and changing your PIN or account." },
      { question: "When do offline sales count in my records?", answer: "After they have been sent. Entries waiting on the phone are not yet part of your shared business records." },
    ],
    related: ["record-daily-sales", "track-customer-debts"],
  },
];

export const jereSearchSlugs = jereSearchPages.map((p) => p.slug);

export function getJereSearchPage(slug: string): JereSearchPage | undefined {
  return jereSearchPages.find((p) => p.slug === slug);
}

/** The public address of a short page, on the Jèrè website once that is switched on. */
export function getJereSearchUrl(slug: string): string {
  return jereDomainEnabled() ? `${JERE_DOMAIN_ORIGIN}/learn/${slug}` : `${SITE_URL}${JERE_LEGACY_PATH}/learn/${slug}`;
}

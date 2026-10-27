import { getJereUrl, getJereGuideUrl } from "@/app/lib/jereDomain";
import { getProduct } from "@/app/lib/products";
import { SITE_URL } from "@/app/lib/site";

export const JERE_REVIEWED = "2026-10-27";
export const JERE_DESCRIPTION = "Jèrè (Jere) is business management software for small businesses in Nigeria. Track sales, stock, expenses, customer and supplier debts, and estimated profit. Plus adds offline recording.";
export const JERE_OFFLINE_ANSWER = "Jèrè (Jere) helps small shops in Nigeria record sales without internet on Plus. Open Sell online first to save your products on that phone. Offline entries stay on the phone and send automatically when the connection returns. They count in your business records once sent. Basic needs internet.";
export const jereOfflineSteps = [
  { title: "Prepare Sell while online", text: "Sign in to Jèrè on the phone you will use. Check that your business has Plus, then open Sell and let your products and customer names load. Open Today and Owing online with your PIN set if you want saved figures too." },
  { title: "Disconnect and open Sell", text: "Turn off Wi-Fi and mobile data on that phone. Open Sell from Jèrè. The offline screen uses the copy saved on the phone. Prices and stock are the last saved values, adjusted for entries waiting there." },
  { title: "Record two separate sales", text: "Choose a product and payment method, then record a sale. Wait for “Saved on this phone”. Start another sale and record it separately. Both should appear in Waiting to send. Offline credit sales use customers already saved on the phone." },
  { title: "Check the waiting entries", text: "Reopen Jèrè on the same phone before reconnecting and check Waiting to send. Keep the phone’s browser data. Entries waiting on that phone are not yet part of the shared business records." },
  { title: "Reconnect and check your records", text: "Turn internet access back on and reopen Jèrè. Waiting entries send automatically. If sign-in is requested, sign in again. Once sending finishes, check Sales for both entries. An entry that needs attention stays visible with a reason; resolve it before treating it as sent." },
];
export const JERE_AUDIENCE = "Jèrè suits Nigerian shop owners and small business teams who sell products, keep stock, take cash, transfer or POS payments, or let customers buy on credit. It has an Africa-first focus and is built by SOLFLIGH TECH.";
export { getJereGuideUrl } from "@/app/lib/jereDomain";

export const jereFeatures = [
  { title: "Keep trading without internet", text: "With Plus, record sales, customer payments, expenses and new products offline. Entries wait on your phone and send automatically when the connection returns.", label: "Offline with Plus" },
  { title: "Record every sale", text: "Cash, transfer, POS or credit. Record part-payments and share a receipt through WhatsApp or another app you choose.", label: "Sales & receipts" },
  { title: "Know what is on the shelf", text: "Keep a stock list, record restocking and spot products running low before the next customer asks for them.", label: "Stock" },
  { title: "Keep expenses in the picture", text: "Record transport, electricity, rent and other business costs. Set reminders for expenses that come round regularly.", label: "Expenses" },
  { title: "Remember who owes you", text: "Keep customer debts and payments together. See what is still owed and send a reminder yourself.", label: "Customer debts" },
  { title: "Give your team the right access", text: "Invite a cashier by code and choose what they can see. Cashiers can record sales without seeing your costs or profit.", label: "Team access" },
  { title: "Track what you owe suppliers", text: "Keep supplier credit and payments together. See who you still need to pay and how much is outstanding.", label: "Supplier debts" },
  { title: "Check the cash before you close", text: "Enter the cash you counted and compare it with what your records say you should have. See the amount that matches, is short or is extra.", label: "Cash checks" },
  { title: "See which products make you money", text: "Find your best earners, products sold below cost and stock that has not sold. Compare your business figures by day, week, month or year.", label: "Profit & reports" },
  { title: "Find what needs attention", text: "A business check-up uses your records to show what is going well and what needs a look. You can also choose to receive a weekly email summary.", label: "Business check-up" },
  { title: "Keep track of staff pay", text: "List who you pay, how much and when it is due. Record a payment as a staff expense when you pay them.", label: "Staff pay" },
  { title: "Keep capital separate from earnings", text: "Record money you put into the business, loans, repayments and money taken out. Keep those movements separate from sales and estimated profit.", label: "Business capital" },
];

export const jereQuestions = [
  { question: "What app can I use to record sales offline for my small shop in Nigeria?", answer: JERE_OFFLINE_ANSWER },
  { question: "What is Jèrè?", answer: "Jèrè (Jere) is business management software for small businesses in Nigeria. It brings sales, stock, expenses and customer debts together so you can see your estimated profit. It is built by SOLFLIGH TECH with an Africa-first focus." },
  { question: "Can I sign up now?", answer: "Yes. Jèrè is open for sign-up in early access. Choose Create your account to get started, or sign in if you already have an account. We will tell you before we start to charge." },
  { question: "Does Jèrè work without internet?", answer: "Yes. Plus lets you record sales, customer payments, expenses and new products offline, check saved stock, and read saved Today and Owing figures with your PIN. Open Jèrè online first so it can save a copy on your phone. Entries send automatically when you reconnect and only then count in your business records. Saved figures show when they were last updated. Basic needs an internet connection." },
  { question: "What still needs internet?", answer: "Adding a new customer, changing an existing product’s price or stock, cancelling a sale, and changing your PIN or account need internet. Offline credit sales use customers already saved on your phone. Keep entries waiting to send on that phone until they have been sent; clearing browser storage can remove them." },
  { question: "Can I download my records?", answer: "Yes. Open My data and account in Jèrè to download your business records." },
  { question: "Is money collected the same as profit?", answer: "Money collected and profit answer different questions. Jèrè estimates profit by taking the cost of the goods sold and your recorded expenses away from sales. That can include credit sales customers have not paid for yet. Your estimate depends on the records you enter." },
  { question: "Can my cashier use Jèrè without seeing my profit?", answer: "Yes. You can invite a cashier by code and choose their access. Cashiers can record sales without seeing your costs or profit." },
  { question: "Do I need to download an app?", answer: "Jèrè runs in your browser. You can also add it to your phone’s home screen." },
];

export function jereApplicationSchema() {
  const home = getJereUrl();
  return {
    "@context": "https://schema.org", "@type": "SoftwareApplication",
    "@id": `${home}#application`, name: "Jèrè", alternateName: "Jere",
    applicationCategory: "BusinessApplication", operatingSystem: "Web",
    description: JERE_DESCRIPTION, url: home,
    featureList: jereFeatures.map(f => `${f.label}: ${f.text}`),
    image: `${SITE_URL}/projects/profitpilot/today.jpg`,
    publisher: { "@type": "Organization", name: "SOLFLIGH TECH", url: SITE_URL },
  };
}

/** Public product information, shared with the visible guide. No agent instructions. */
export function jereFactsMarkdown(full = false) {
  const app = getProduct("profitpilot")!;
  const links = `- [Website](${getJereUrl()})\n- [Product guide](${getJereGuideUrl()})\n- [Create your account](${app.ctaHref})\n- [Sign in](${app.appUrl}sign-in)\n- [Help](${app.appUrl}help)\n- [Privacy](${app.appUrl}privacy)\n- [Terms](${app.appUrl}terms)`;
  return `# Jèrè (Jere)\n\n> ${JERE_DESCRIPTION}\n\n${JERE_AUDIENCE}\n\nStatus: Live / Near Launch. Open for sign-up in early access.\nReviewed: ${JERE_REVIEWED}. Publisher: SOLFLIGH TECH.\n\n## Official links\n${links}\n\n${full ? `## Recording sales offline\n${JERE_OFFLINE_ANSWER}\n\n${jereOfflineSteps.map((step, index) => `### ${index + 1}. ${step.title}\n${step.text}`).join("\n\n")}\n\n## Features\n${jereFeatures.map(f => `### ${f.label}\n${f.text}`).join("\n\n")}\n\n## Questions and limitations\n${jereQuestions.map(q => `### ${q.question}\n${q.answer}`).join("\n\n")}` : `## Detailed product information\n- [Public product facts and answers](${getJereUrl().replace(/\/$/, "")}/llms-full.txt): Features, offline requirements, access and limitations. All facts are also visible in the product guide.`}\n`;
}

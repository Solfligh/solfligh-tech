import { getJereUrl, getJereGuideUrl } from "@/app/lib/jereDomain";
import { getProduct } from "@/app/lib/products";
import { SITE_URL } from "@/app/lib/site";

export const JERE_REVIEWED = "2026-10-27";
export const JERE_DESCRIPTION = "Jèrè (Jere) is business management software for small businesses in Nigeria and across Africa. Combine Product Business, Online Business and Service Business modes to manage sales, stock, orders, delivery, jobs, invoices, deposits, costs and estimated profit. Plus adds offline product sales and other supported entries.";
export const JERE_OFFLINE_ANSWER = "Jèrè (Jere) helps small shops in Nigeria record sales without internet on Plus. Open Sell online first to save your products on that phone. Offline entries stay on the phone and send automatically when the connection returns. They count in your business records once sent. Basic needs internet.";
export const jereOfflineSteps = [
  { title: "Prepare Sell while online", text: "Sign in to Jèrè on the phone you will use. Check that your business has Plus, then open Sell and let your products and customer names load. Open Today and Owing online with your PIN set if you want saved figures too." },
  { title: "Disconnect and open Sell", text: "Turn off Wi-Fi and mobile data on that phone. Open Sell from Jèrè. The offline screen uses the copy saved on the phone. Prices and stock are the last saved values, adjusted for entries waiting there." },
  { title: "Record two separate sales", text: "Choose a product and payment method, then record a sale. Wait for “Saved on this phone”. Start another sale and record it separately. Both should appear in Waiting to send. Offline credit sales use customers already saved on the phone." },
  { title: "Check the waiting entries", text: "Reopen Jèrè on the same phone before reconnecting and check Waiting to send. Keep the phone’s browser data. Entries waiting on that phone are not yet part of the shared business records." },
  { title: "Reconnect and check your records", text: "Turn internet access back on and reopen Jèrè. Waiting entries send automatically. If sign-in is requested, sign in again. Once sending finishes, check Sales for both entries. An entry that needs attention stays visible with a reason; resolve it before treating it as sent." },
];
export const JERE_AUDIENCE = "Jèrè is built for shop owners, online sellers and service businesses, with an Africa-first focus. A shop can take WhatsApp orders and offer services in the same business. It is built by SOLFLIGH TECH.";
export { getJereGuideUrl } from "@/app/lib/jereDomain";

export const jereBusinessModes = [
  { id: "product", title: "Product Business", text: "Record sales, manage stock, keep product costs and see estimated profit. Use cash, transfer, POS or customer credit." },
  { id: "online", title: "Online Business", text: "Record orders from WhatsApp, social media, a website or phone. Track confirmation, packing, delivery, returns and customer refunds." },
  { id: "service", title: "Service Business", text: "Manage customer jobs, quotes, invoices, deposits, payments, job costs and recorded work time. Compare results for your jobs." },
];
export const jereModeSteps = [
  "After creating your business, choose the modes that fit your work. Existing owners can open More, then Business modes.",
  "Select Product Business, Online Business, Service Business or a combination. Online selling shares your existing products and stock.",
  "Choose your main workflow and save. It sets the shortcuts on your home screen and navigation.",
  "Change modes later without deleting records. All your existing workflows remain accessible in More. Mode selection does not change your plan or team permissions.",
];
export const jereWorkflowGuides = [
  { id: "product-sales", title: "Record product sales and keep stock", help: "selling", intro: "Product Business keeps your existing sales, stock, expenses and customer credit records together.", steps: [
    "Open Stock and add each product with its selling price, cost and starting quantity. Record new stock when you buy it.",
    "Open Sell and choose the goods, quantity and payment method. For a credit sale, choose the customer and enter any amount paid now.",
    "Collect later product payments from Owing on the customer’s page. Share receipts yourself using the app you choose.",
    "Review Today and product results. Estimated profit depends on the costs and expenses you record. Prepare Sell online first for supported offline recording on Plus.",
  ] },
  { id: "online-orders", title: "Take an online order through to delivery", help: "orders", intro: "Orders are entered by the owner. This workflow does not automatically import messages or orders from other platforms.", steps: [
    "Open More, then Online orders, and choose New online order. Add the customer, order channel, products, agreed prices and pickup or delivery details. Include any delivery charge paid by the customer.",
    "Save a draft while checking the order. Drafts do not reserve stock, record a sale or change money figures.",
    "Confirm the order when the customer is ready. Confirmation records one sale and deducts stock. Choose cash, transfer or POS for a full payment, or unpaid / pay on delivery / part-paid for customer credit.",
    "Record later credit payments on the customer’s page. Product debts are shared across that customer’s credit sales, so the order shows what was paid at confirmation rather than a current amount owed for that order alone.",
    "Update packing, dispatch and delivery, or collection for pickup. These updates do not record another sale or payment. Record what you pay a courier separately in Expenses.",
  ] },
  { id: "service-jobs", title: "Manage a service job, deposit and invoice", help: "services", intro: "Quotes describe agreed or proposed work. Money received, earned service income and job results are shown separately.", steps: [
    "Open More, then Service jobs, and add a job with its customer, title, optional quote, due date and work notes. Saving a job or quote does not record a sale or payment.",
    "Issue an invoice for the agreed amount. You can issue it before work is completed, then record a deposit or part-payment on that invoice. Jèrè records money received; it does not charge the customer.",
    "Mark the job completed when the work is done. Its active invoice then counts as earned service income. If the job was already completed, issuing the invoice records that income. Completing a job without an invoice does not create service income.",
    "Record later service payments on the invoice, rather than using the product-debt payment form. Later collections do not become another sale.",
    "Link recorded expenses to the job or record a new job expense once. Record time worked separately. Job results show earned invoice income less assigned costs; time alone does not create wages, and unassigned overhead or unrecorded costs are excluded.",
  ] },
  { id: "returns-refunds", title: "Record an online return and any refund", help: "returns", intro: "A return changes the goods and agreed amount. A refund records money you have already given back. They are separate steps.", steps: [
    "Open the confirmed order and find Returns and refunds. Choose the product and quantity returned, or credit a delivery charge. Returns use the original selling price and cannot exceed the goods or delivery charge remaining.",
    "Mark goods as resalable only if they should go back into stock. Their original cost is then reversed. Damaged goods that are not restocked keep their original cost in your results.",
    "Jèrè reduces any eligible unpaid product debt first. The remaining amount becomes a refund you owe the customer. Find outstanding refunds on Today, the customer page or Online orders, then Customer refunds due.",
    "After giving the money back through cash, your bank or a POS reversal, record the amount and method against that return. Part-refunds are supported up to the remaining amount due. Jèrè does not send money or trigger a payment-provider refund.",
    "Returns reduce sales and, for restocked goods, the original item cost on the return date. Actual refunds are money out, not another expense. Keep mistake corrections separate: cancelling a mistaken sale is not a way to record a real return.",
  ] },
];

export const jereFeatures = [
  { title: "Choose how your business works", text: "Combine Product Business, Online Business and Service Business. Choose a main workflow for your shortcuts and change it later without deleting records.", label: "Business modes" },
  { title: "Follow orders from confirmation to delivery", text: "Save drafts without changing stock or money. Confirm once to record the sale, then track packing, dispatch and delivery or pickup separately.", label: "Online orders" },
  { title: "Keep customer jobs and invoices together", text: "Record jobs, quotes, invoices, deposits and part-payments. An active invoice becomes earned service income when its job is completed.", label: "Service jobs & invoices" },
  { title: "See the costs behind each job", text: "Assign existing expenses or record a new job expense once, log time worked and compare earned invoice income with assigned costs. Unrecorded costs and unassigned overhead are excluded.", label: "Job costs & time" },
  { title: "Keep returns and refunds clear", text: "Record returned goods and delivery credits, restore resalable stock and reduce eligible unpaid debt. Record full or partial refunds of money already returned and see what is still due.", label: "Returns & refunds" },
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
  { question: "Can I combine product, online and service business modes?", answer: "Yes. Open More, then Business modes, select the modes you use and choose your main workflow. It changes shortcuts, not records, your plan or team permissions. Existing records remain accessible in More." },
  { question: "When does an online order become a sale?", answer: "When the owner confirms it. Saving a draft does not reserve stock or record money. Confirmation records one sale and deducts stock. Packing and delivery updates do not record a second sale or collect payment." },
  { question: "Can a customer pay a deposit before a service job is completed?", answer: "Yes. Issue the agreed service invoice and record the deposit on it. The deposit is money received. The invoice becomes earned service income when the job is completed; later payments reduce its balance without becoming another sale." },
  { question: "Does Jèrè automatically send customer refunds?", answer: "No. Jèrè records money you have already returned by cash, transfer or POS reversal. Record the goods or delivery credit first, then record full or partial refunds against the amount still due. Any eligible unpaid product debt is reduced before a cash refund becomes due." },
  { question: "Can cashiers manage service jobs, online orders or refunds?", answer: "These workflows and business mode settings are owner-only. Cashiers retain their existing product sales and permitted customer-payment access. Choosing a mode does not grant new permissions." },
  { question: "What app can I use to record sales offline for my small shop in Nigeria?", answer: JERE_OFFLINE_ANSWER },
  { question: "What is Jèrè?", answer: "Jèrè (Jere) brings product sales, online orders and service jobs into one business, alongside stock, expenses, customer balances and estimated profit. Choose or combine three business modes. It is built by SOLFLIGH TECH with an Africa-first focus." },
  { question: "Can I sign up now?", answer: "Yes. Jèrè is open for sign-up in early access. Choose Create your account to get started, or sign in if you already have an account. We will tell you before we start to charge." },
  { question: "Does Jèrè work without internet?", answer: "Yes. Plus lets you record product sales, product customer payments, expenses and new products offline, check saved stock, and read saved Today and Owing figures with your PIN. Open Jèrè online first so it can save a copy on your phone. Entries send automatically when you reconnect and only then count in your business records. Saved figures show when they were last updated. Basic needs an internet connection." },
  { question: "What still needs internet?", answer: "Business mode changes, service jobs, invoices, deposits, job costs and time, online orders, delivery updates, returns and refunds need internet on both Basic and Plus. Adding a new customer, changing an existing product’s price or stock, cancelling a sale, and changing your PIN or account also need internet. Offline credit sales use customers already saved on your phone. Keep entries waiting to send on that phone until they have been sent; clearing browser storage can remove them." },
  { question: "Can I download my records?", answer: "Yes. Open My data and account in Jèrè to download your business records." },
  { question: "Is money collected the same as profit?", answer: "Money collected and profit answer different questions. Product sales count when recorded, and online order sales count when confirmed. Service invoices count as earned income on job completion; earlier deposits are money in, not earned income. Costs, expenses and recorded returns affect your estimated profit. Later payments do not create another sale. Your estimate depends on the records you enter." },
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
  return `# Jèrè (Jere)\n\n> ${JERE_DESCRIPTION}\n\n${JERE_AUDIENCE}\n\nStatus: Live / Near Launch. Open for sign-up in early access.\nReviewed: ${JERE_REVIEWED}. Publisher: SOLFLIGH TECH.\n\n## Official links\n${links}\n\n${full ? `## Business modes\n${jereBusinessModes.map(m => `### ${m.title}\n${m.text}`).join("\n\n")}\n\n${jereModeSteps.map((step,i) => `${i+1}. ${step}`).join("\n")}\n\n${jereWorkflowGuides.map(w => `## ${w.title}\n${w.intro}\n\n${w.steps.map((step,i) => `${i+1}. ${step}`).join("\n")}`).join("\n\n")}\n\n## Recording sales offline\n${JERE_OFFLINE_ANSWER}\n\n${jereOfflineSteps.map((step, index) => `### ${index + 1}. ${step.title}\n${step.text}`).join("\n\n")}\n\n## Features\n${jereFeatures.map(f => `### ${f.label}\n${f.text}`).join("\n\n")}\n\n## Questions and limitations\n${jereQuestions.map(q => `### ${q.question}\n${q.answer}`).join("\n\n")}` : `## Detailed product information\n- [Public product facts and answers](${getJereUrl().replace(/\/$/, "")}/llms-full.txt): Features, offline requirements, access and limitations. All facts are also visible in the product guide.`}\n`;
}

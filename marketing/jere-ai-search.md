# Jèrè AI-search visibility

Reviewed 26 October 2026. These changes improve public discovery and factual understanding; they do not guarantee citations or recommendations.

## Search needs covered by the product guide

- Offline sales recording for small businesses in Nigeria (Plus, with initial online setup).
- Shop stock/inventory tracking and low-stock visibility.
- Customer credit, debts and part-payments.
- Sales, item costs, expenses and estimated profit.
- Cashier access without disclosing costs or profit.

The canonical `/guide` explains these uses and limitations in visible HTML. The homepage and footer link to it, and the branded sitemap includes it. Shared product facts feed the homepage, guide, SoftwareApplication schema and optional `/llms.txt` and `/llms-full.txt` resources. `WebSite` schema identifies Jèrè/Jere; the guide links to the same application entity. No prices, ratings or customer results are invented.

## Baseline and verification

Before changes, requests with Googlebot, OAI-SearchBot, Claude-SearchBot and PerplexityBot user-agent strings received HTTP 200 and server-rendered product content. This does not verify access from the services' actual IPs or prove indexing.

The external `is-agentic@1.0.1` public-domain report scanned at `2026-10-26T15:29:24.241Z` scored 71. It reported weak brand search and missing Markdown negotiation, among other gaps. Report: https://is-agentic.com/scan/www.xn--jr-7iab.com. This vendor score is not an AI ranking or recommendation metric. Negotiated Markdown responses are outside this change; separate factual text resources are provided instead.

After deployment, check `/`, `/guide`, `/sitemap.xml`, `/llms.txt` and `/llms-full.txt` on `https://www.xn--jr-7iab.com`, then rerun the external audit. Check its scan timestamp: a cached report is not an after measurement. Submit the new guide for indexing through the owner's Search Console account. The sitemap URL is unchanged.

## Recommendation measurement

Use web-search-enabled modes in ChatGPT, Claude and Perplexity. Record engine/mode, date, exact prompt, response, citations and whether Jèrè is only mentioned or actually recommended. Repeat each prompt three times; results vary. No recommendation baseline has been established yet.

1. What is Jèrè business software and does it work offline?
2. What app can help a small shop in Nigeria record sales when the internet goes down?
3. Suggest software for a Nigerian shop to track inventory and customer debts.
4. How can I track sales, expenses and estimated profit for my small business in Nigeria?
5. Which shop-management apps let a cashier record sales without seeing profit?

Accurate third-party listings, independent reviews and real customer experience are further evidence to build after launch. They require real accounts and content; this change submits no external listings or outreach and adds no fabricated endorsements.

## Official references

- OpenAI search access and separate training crawler: https://developers.openai.com/api/docs/bots
- Anthropic crawler roles: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity crawler roles: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- Google AI search guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

Search crawler access remains allowed. Training preferences and firewall settings are unchanged. The optional llms files are not a Google ranking requirement.

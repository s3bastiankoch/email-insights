# 📧 Email Insights using Cloudflare Email Worker

Email Insights is an open-source project built with Cloudflare Email Workers that allows you to intercept emails and analyze them with ChatGPT to gain insights into customer feedback, bug reports, and other information at scale. This can for example help you to prioritize certain feedback if it’s quite frequently requested. For now, this project is quite experimental and not really ready for actual use.

## Installation

Email Insights is built on Cloudflare Email Workers, so you will need a Cloudflare account to use it. You will also need an OpenAI API key and for now a Planetscale database URL. Once you have everything set up, simply clone this repo and follow these steps:

1. Configure your Cloudflare Email Worker by following the instructions provided in the Cloudflare Email Workers documentation (https://developers.cloudflare.com/email-routing/email-workers), you can for example point your contact@example.com to this worker. 📚
2. Deploy the Email Insights worker to your Cloudflare account by running `pnpm worker:deploy` and add the OPENAI_API_KEY and the DATABASE_URL in the Cloudflare dashboard as encrypted environment variables to your worker. (https://developers.cloudflare.com/workers/platform/environment-variables/#environment-variables-via-the-dashboard) 🚀
3. Start analyzing your emails to gain insight from your customer emails 📈

[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">market-stats</h1>

> Stats endpoint to deliver key numbers to market UI.

[![Vercel deployment](https://flat.badgen.net/badge/vercel/auto-deployment/21c4dd?icon=now)](https://vercel.com/oceanprotocol/market)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)

```ts
interface MarketStatsResponse {
  datasets: number // total number of published datasets
  owners: number // total number of different owner accounts
  ocean: number // total number of pooled OCEAN
  datatoken: number // total number of pooled Datatokens
}
```

Deployed under https://market-stats.oceanprotocol.com

## ⬆️ Deployment

Every branch or Pull Request is automatically deployed by [Vercel](https://vercel.com) with their GitHub integration. A link to a deployment will appear under each Pull Request.

### Manual Deployment

If needed, app can be deployed manually to Vercel. Make sure to switch to Ocean Protocol org before deploying:

```bash
# first run
vercel login
vercel switch

# deploy
vercel
# switch alias to new deployment
vercel alias
```

## 🏛 License

```text
Copyright 2021 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

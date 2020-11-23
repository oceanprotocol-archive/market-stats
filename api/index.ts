import fetch from 'node-fetch'
import { NowRequest, NowResponse } from '@vercel/node'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'

export interface MarketStatsResponse {
  datasets: {
    pools: number
    exchanges: number
    none: number
    total: number
  }
  owners: number
  ocean: number
  datatoken: number
}

const queryAllDdos = {
  page: 1,
  offset: 10000,
  query: {
    nativeSearch: 1,
    query_string: {
      query: `-isInPurgatory:true`
    }
  },
  sort: { created: -1 }
}

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')

  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(queryAllDdos)
    }
    const response = await fetch(
      'https://aquarius.mainnet.oceanprotocol.com/api/v1/aquarius/assets/ddo/query',
      options
    )

    if (!response || !response.ok || response.status !== 200) {
      res
        .status(response.status || 500)
        .send(`Error from Aquarius: ${response.statusText}`)
      return
    }

    const responseJson: QueryResult = await response.json()
    const allAssets = responseJson.results

    const totalPools = allAssets.filter((ddo) => ddo.price.type === 'pool')
      .length
    const totalExchanges = allAssets.filter(
      (ddo) => ddo.price.type === 'exchange'
    ).length
    const totalNone = allAssets.filter((ddo) => ddo.price.type === '').length

    let totalOcean = 0
    let totalDatatoken = 0
    const allOwners: string[] = []

    for (let i = 0; i < allAssets.length; i++) {
      const ddo = allAssets[i]
      allOwners.push(ddo.publicKey[0].owner)

      const { ocean, datatoken } = ddo.price

      if (ocean) {
        totalOcean += ocean
      }

      if (datatoken) {
        totalDatatoken += datatoken
      }
    }

    const result: MarketStatsResponse = {
      datasets: {
        pools: totalPools,
        exchanges: totalExchanges,
        none: totalNone,
        total: allAssets.length
      },
      // Convert to Set to strip duplicates from allOwners
      owners: [...new Set(allOwners)].length,
      ocean: totalOcean,
      datatoken: totalDatatoken
    }

    res.status(200).send(result)
  } catch (error) {
    res.status(500).send(error)
  }
}

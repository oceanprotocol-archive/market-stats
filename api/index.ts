import fetch from 'node-fetch'
import { NowRequest, NowResponse } from '@vercel/node'
import { DDO } from '@oceanprotocol/lib'

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

export default async (req: NowRequest, res: NowResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const response = await fetch(
    'https://aquarius.mainnet.oceanprotocol.com/api/v1/aquarius/assets/ddo'
  )
  const ddos = await response.json()

  // transform Aquarius weird object of objects to array of objects
  const ddosArray = Object.entries(ddos).map((e) => e[1] as DDO)

  const totalPools = ddosArray.filter((ddo) => ddo.price.type === 'pool').length
  const totalExchanges = ddosArray.filter(
    (ddo) => ddo.price.type === 'exchange'
  ).length
  const totalNone = ddosArray.filter((ddo) => ddo.price.type === '').length

  let totalOcean = 0
  let totalDatatoken = 0
  let allOwners: string[] = []

  ddosArray.forEach((ddo) => {
    const { owner } = ddo.publicKey[0]
    allOwners.push(owner)

    const { ocean, datatoken } = ddo.price

    if (ocean) {
      totalOcean += ocean
    }

    if (datatoken) {
      totalDatatoken += datatoken
    }
  })

  const result: MarketStatsResponse = {
    datasets: {
      pools: totalPools,
      exchanges: totalExchanges,
      none: totalNone,
      total: ddosArray.length
    },
    // Convert to Set to strip duplicates from allOwners
    owners: [...new Set(allOwners)].length,
    ocean: totalOcean,
    datatoken: totalDatatoken
  }

  res.status(200).send(result)
}

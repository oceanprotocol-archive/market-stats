import fetch from 'node-fetch'
import { NowRequest, NowResponse } from '@vercel/node'
import { DDO } from '@oceanprotocol/lib'

export interface MarketStatsResponse {
  datasets: {
    pools: number
    exchange: number
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
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')

  const response = await fetch(
    'https://aquarius.mainnet.oceanprotocol.com/api/v1/aquarius/assets/ddo'
  )
  const ddos = await response.json()

  // transform Aquarius weird object of objects to array of objects
  const ddosArray = Object.entries(ddos).map((e) => e[1] as DDO)

  let totalOcean = 0
  let totalDatatoken = 0
  let owners = []

  ddosArray.forEach((ddo) => {
    const { ocean, datatoken } = ddo.price
    ocean && (totalOcean += ocean)
    datatoken && (totalDatatoken += datatoken)

    const { owner } = ddo.publicKey[0]
    owner && owners.push(owner)
  })

  const result: MarketStatsResponse = {
    datasets: {
      pools: ddosArray.filter((ddo) => ddo.price.type === 'pool').length,
      exchange: ddosArray.filter((ddo) => ddo.price.type === 'exchange').length,
      none: ddosArray.filter((ddo) => ddo.price.type === '').length,
      total: ddosArray.length
    },
    owners: owners.length,
    ocean: totalOcean,
    datatoken: totalDatatoken
  }

  res.status(200).send(result)
}

import fetch from 'node-fetch'
import { NowRequest, NowResponse } from '@vercel/node'

//
// Proxy for 3Box API, returning `200` in most cases.
// See https://github.com/oceanprotocol/market/pull/264#discussion_r530434946
//
// https://docs.3box.io/api/rest-api
//
const apiUri = 'https://ipfs.3box.io'

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')

  try {
    const response = await fetch(
      `${apiUri}/profile?address=${req.query.address}`
    )

    if (!response || !response.ok || response.status !== 200) {
      res.status(200).send({ status: 'error' })
    }

    const responseJson = await response.json()
    res.status(200).send(responseJson)
  } catch (error) {
    res.status(500).send({ status: 'error' })
  }
}

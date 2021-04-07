
import fetch from 'node-fetch'
import { VercelRequest, VercelResponse } from '@vercel/node'

import { apiUri, apiId, token } from './../helpers/endpoint-helper'
import { validatePeriod, validateResolution } from './../utils/validator'

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")

    const {from, to, timezone, account_id, resolution} =  req.query

    validatePeriod(from, to, res)
    validateResolution(resolution, res)

    const options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8', 
            'Authorization': `Bearer ${token}` 
          },
      }

    const endpoint = `${apiUri}/${apiId}/bandwidth?from=${from}&to=${to}&timezone=${timezone}&account_id=${account_id}&resolution=${resolution}`  
    const response = await fetch(endpoint, options)

    if (!response || !response.ok || response.status !== 200) {
      res.status(200).json({ status: 'error'})
      return
    }

    const responseJson = await response.json()
    res.status(200).send(responseJson)
  } catch (error) {
    res.status(200).json({ status: 'error' })
  }
}
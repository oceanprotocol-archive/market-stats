import fetch from 'node-fetch'
import { VercelRequest, VercelResponse } from '@vercel/node'

import { apiUri, apiId, token } from './../helpers/endpoint-helper'
import { validatePeriod, validateLimit } from './../utils/validator'

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const {from, to, timezone, limit} =  req.body

    validatePeriod(from, to, res)
    validateLimit(limit, res)

    const options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8', 
            'Authorization': `Bearer ${token}` 
          },
      }

    const endpoint = `${apiUri}/${apiId}/ranking/not_found?from=${from}&to=${to}&timezone=${timezone}&limit=${limit}`  
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
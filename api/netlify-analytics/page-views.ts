import fetch from 'node-fetch'
import { VercelRequest, VercelResponse } from '@vercel/node'

import { apiUri, apiId, token } from './../helpers/endpoint-helper'
import { validatePeriod, validateResolution } from './../utils/validator'

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const {from, to, timezone, resolution} =  req.body

    validatePeriod(from, to, res)
    validateResolution(resolution, res)

    const options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8', 
            'Authorization': `Bearer ${token}` 
          },
      }

    const endpoint = `${apiUri}/${apiId}/pageviews?from=${from}&to=${to}&timezone=${timezone}&resolution=${resolution}`  
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
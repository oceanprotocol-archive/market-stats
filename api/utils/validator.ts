import { VercelResponse } from '@vercel/node'
import { RESOLUTION_TYPE } from './../helpers/resolution-types'

export function validatePeriod(from: number, to: number, res: VercelResponse) {
  if (from.toString().length !== 13 || to.toString().length !== 13) {
    res.status(200).json({
      status: 'error',
      message: `Invalid value. The 'from' & 'to' values should be an UNIX timestamp represented in milliseconds`
    })
    return
  }
}

export function validateResolution(resolution: string, res: VercelResponse) {
  if (resolution !== RESOLUTION_TYPE.DAY && resolution !== RESOLUTION_TYPE.RANGE) {
    res.status(200).json({
      status: 'error',
      message: `Invalid resolution value. The value should '${RESOLUTION_TYPE.DAY}' or '${RESOLUTION_TYPE.RANGE}'`
    })
    return
  }
}

export function validateLimit(limit: number, res: VercelResponse) {
  if (limit < 0) {
    res.status(200).json({
      status: 'error',
      message: `Invalid value. The 'limit' value can't be a negative number`
    })
    return
  }
}
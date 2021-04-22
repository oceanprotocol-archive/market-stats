import { VercelResponse } from '@vercel/node'
import { RESOLUTION_TYPE } from './../helpers/resolution-types'

export function validatePeriod(from: string, to: string, res: VercelResponse) {
  if (from.length !== 13 || to.length !== 13) {
    res.status(200).json({
      status: 'error',
      message: `Invalid value. The 'from' & 'to' values should be an UNIX timestamp represented in milliseconds`
    })
  }
}

export function validateResolution(resolution: string, res: VercelResponse) {
  if (
    resolution !== RESOLUTION_TYPE.DAY &&
    resolution !== RESOLUTION_TYPE.RANGE
  ) {
    res.status(200).json({
      status: 'error',
      message: `Invalid resolution value. The value should '${RESOLUTION_TYPE.DAY}' or '${RESOLUTION_TYPE.RANGE}'`
    })
  }
}

export function validateLimit(limit: string, res: VercelResponse) {
  if (Number(limit) < 0) {
    res.status(200).json({
      status: 'error',
      message: `Invalid value. The 'limit' value can't be a negative number`
    })
  }
}

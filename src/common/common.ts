// import HttpsProxyAgent from 'https-proxy-agent'
import axios from 'axios'

export async function customRequest(params: {
  url: string
  option?: any
  notUseProxy?: boolean
  method?: string
}) {
  const { url, option, method } = params
  const retryLimit = +(process.env.RETRY_MAX || 3)

  for (let i = 0; i < retryLimit; i += 1) {
    try {
      // const proxis = getProxy()
      // const proxy = `http://${proxis[randomInteger(0, proxis.length)]}`

      const req = await axios({
        url,
        method,
        timeout: 1000 * 10,
        maxRedirects: 5,
        ...option
      })

      return req.data
    } catch (error) {
      console.error({
        status: 'Fail',
        url,
        method: method || 'GET',
        ...option
      })
      await sleep(1000)
    }
  }
  return url
}

export async function fetchPaginatedData(
  url: string,
  queryParams: any,
  totalPages: number,
  paginationParamName: string = 'pageNo'
): Promise<any[]> {
  let allData: any[] = []
  for (let pageNo = 1; pageNo <= totalPages; pageNo += 1) {
    try {
      const options = {
        params: {
          ...queryParams,
          [paginationParamName]: pageNo
        }
      }

      const req = await customRequest({
        url,
        method: 'GET',
        option: options
      })

      if (req) {
        allData = allData.concat(req.data)
      }

      await sleep(1000)
    } catch (error) {
      console.error(`Failed to fetch page ${pageNo}:`, error)
    }
  }

  return allData
}

export function randomInteger(start: number, maxValue: number) {
  return start + Math.floor(Math.random() * (maxValue - start + 1))
}

export function sleep(ms: number): Promise<any> {
  return new Promise((r) => setTimeout(r, ms))
}

export function getNumber(str: string) {
  const regex = /[^0-9]/g
  const result = str.replace(regex, '')
  return result
}

export function cookieToText(arr: Array<any>) {
  return arr.reduce((accumulator, current) => `${accumulator}${current.name}=${current.value};`, '')
}

export function csvToJSON(csvString: string) {
  const rows = csvString.split('\n')
  const res = []
  const header = rows[0].split('","')
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i].split('","')
    const obj = {} as any
    for (let j = 0; j < header.length; j += 1) {
      obj[header[j].replaceAll('"', '')] = row[j]?.replaceAll('"', '')
    }
    res.push(obj)
  }
  return res
}

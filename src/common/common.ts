// import HttpsProxyAgent from 'https-proxy-agent'
import axios, { AxiosRequestConfig } from 'axios'
import { JSDOM } from 'jsdom'

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

export function waitForElement(selector: string, dom: JSDOM): Promise<Element | null> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const element = dom.window.document.querySelector(selector)
      if (element) {
        clearInterval(interval)
        resolve(element)
      }
    }, 100)
  })
}

interface extractPriceParams {
  xSite: string;
  productNo: string;
  sellPrice: string;
  sellerNo: string;
}

export async function makeRequestWithAccountDetails({
  xSite,
  productNo,
  sellPrice,
  sellerNo
}: extractPriceParams) {
  const requestData = {
    productNo,
    sellPrice,
    xSite,
    sellerNo
  }

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://www.11st.co.kr/products/v1/pc/products/max-discount',
    headers: {
      'content-type': 'application/json'
    },
    data: requestData
  }

  try {
    const response = await axios(config)
    return response.data
  } catch (error) {
    console.error('Request failed:', error)
    return JSON.stringify(error)
  }
}

export async function extractScriptContentUsingJsdom(url: string) : Promise<string> {
  try {
    const { data: html } = await axios.get(url)

    const { window } = new JSDOM(html)

    const scripts = window.document.querySelectorAll('script')
    scripts.forEach((script) => {
      if (script.src) {
        console.info('External script src:', script.src)
      } else {
        console.info('Inline script content:', script.textContent)
      }
    })
    return scripts[0].textContent || ''
  } catch (error) {
    console.error('Error fetching page:', error)
    return ''
  }
}

export const extractProductIDFromURl = (url: string) => {
  const urlObj = new URL(url)
  const pathSegments = urlObj.pathname.split('/').filter(Boolean)
  const productId = pathSegments[pathSegments.length - 1]
  return productId
}

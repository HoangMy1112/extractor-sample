import dotenv from 'dotenv'
import { customRequest } from '../../common/common'
import { productDetailsParams, st11ProductDetailApiExtractor, st11ProductDetailHTMLExtractor, st11SearchExtractor } from './extractor'

dotenv.config()
const allProducts: productDetailsParams[] = []

export async function st11Main() {
  for (let pageNo = 1; pageNo <= 10; pageNo += 1) {
    const data1 = await customRequest({
      url: `https://apis.11st.co.kr/search/api/tab?kwd=apple&tabId=PRICE_COMPARE&pageNo=${pageNo}`,
      method: 'GET'
    })
    const data2 = await customRequest({
      url: `https://apis.11st.co.kr/search/api/tab/?kwd=iphone&tabId=TOTAL_SEARCH&pageNo=${pageNo}`,
      method: 'GET'
    })
    st11SearchExtractor(data1, allProducts)
    st11SearchExtractor(data2, allProducts)
  }
  console.info(allProducts) // Log or return all products after the loop
}

export const st11MainDetailPage = async (url: string) => {
  try {
    const content = await customRequest({ url, method: 'GET' })

    let productDetails: any
    if (url.includes('/v1/')) {
      productDetails = st11ProductDetailApiExtractor(content)
    } else {
      productDetails = st11ProductDetailHTMLExtractor(content)
    }

    console.info(productDetails)
    return productDetails
  } catch (error) {
    console.info('Error:', error)
    throw error
  }
}

st11MainDetailPage('https://www.11st.co.kr/products/2366299950')

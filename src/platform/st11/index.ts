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

export const st11MainDetailPage = async (url: string, url2? : string) => {
  try {
    const content = await customRequest({ url, method: 'GET' })
    let content2;
    if (url2) {
      content2 = await customRequest({ url: url2, method: 'GET' });
    }

    let productDetails: any
    if (url.includes('/v1/')) {
      productDetails = st11ProductDetailApiExtractor(content, content2)
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

st11MainDetailPage('https://www.11st.co.kr/products/v1/pc/products/6280549329/detail?redirectedOptionYn=N&trTypeCd=MAS99&trCtgrNo=585021&redirectedRequestYn=N', 'https://www.11st.co.kr/products/v1/products/6280549329/tab-property')
//st11MainDetailPage('https://www.11st.co.kr/products/pa/6280549329?trTypeCd=MAS99&trCtgrNo=585021&redirectedRequestYn=N&redirectedOptionYn=N')

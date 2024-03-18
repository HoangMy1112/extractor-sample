import dotenv from 'dotenv'
import { customRequest, extractProductIDFromURl, makeRequestWithAccountDetails } from '../../common/common'
import {
  productDetailsParams,
  st11NormalProductDetailExtractor,
  st11NormalProductPriceExtractor,
  st11NormalProductRequiredInfoForQueryPrice,
  st11PAProductDetailExtractor,
  st11PAProductEmailExtractor, st11PAProductOptionsExtractor, st11SearchExtractor,
  GMarketSearchExtractor, GMarketProductDetailExtractor,
  GMarketSellerInformation
} from './extractor'

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
  console.info(allProducts)
}
export async function GMarket(kwd:string){
  let url = `https://browse.gmarket.co.kr/search?keyword=${kwd}`
  console.log(url)
  const data = await customRequest({ url:url, method: 'GET' })
  const products = GMarketSearchExtractor(data, allProducts)
  return products
}

export const st11MainDetailPage = async (url: string) => {
  try {
    const content = await customRequest({ url, method: 'GET' })
    console.log(content)

    let productDetails: any

    // This is a PA product (More explanation below)
    if (url.includes('/pa/')) {
      const productID = extractProductIDFromURl(url)
      const productDetailUrl = `https://www.11st.co.kr/products/v1/pc/products/${productID}/detail`
      const productDetailJson = await customRequest({ url: productDetailUrl,
        method: 'GET' })
      productDetails = st11PAProductDetailExtractor(productDetailJson)

      const emailUrl = `https://www.11st.co.kr/products/v1/products/${productID}/tab-property`
      const emailJson = await customRequest({ url: emailUrl, method: 'GET' })
      const email = st11PAProductEmailExtractor(emailJson)
      productDetails.sellerEmail = email

      const optionURL = `https://www.11st.co.kr/products/v1/pc/products/${productID}/variations`
      const optionJson = await customRequest({ url: optionURL, method: 'GET' })
      const options = st11PAProductOptionsExtractor(optionJson)
      productDetails.options = options
    } else {
      // This is a normal product (More explanation below)
      productDetails = st11NormalProductDetailExtractor(content)
      const productPriceRequiredParams = st11NormalProductRequiredInfoForQueryPrice(content)
      const maxDisCountJson = await makeRequestWithAccountDetails(productPriceRequiredParams)
      productDetails.price = st11NormalProductPriceExtractor(maxDisCountJson)
    }

    console.info(productDetails)
    return productDetails
  } catch (error) {
    console.info('Error:', error)
    throw error
  }
}

export const G9Main = async (url: string) => {
  try {
    const content = await customRequest({ url, method: 'GET' })
    let productDetails: any
    productDetails = GMarketProductDetailExtractor(content)
    const sellerInfo = await customRequest({ url: productDetails.sellerURL,
      method: 'GET' })
    const {sellerEmail, sellerName, sellerNumber} = GMarketSellerInformation(sellerInfo)
    Object.assign(productDetails, { sellerEmail, sellerName, sellerNumber });
    console.info(productDetails)
    return productDetails
  } catch (error) {
    console.info('Error:', error)
    throw error
  }
}

// This is a PA product
//st11MainDetailPage('https://www.11st.co.kr/products/pa/6280550258')
//GMarket('phone')
G9Main('https://item.gmarket.co.kr/Item?goodscode=2518000839&buyboxtype=ad')
// THis is a normal product
//st11MainDetailPage('https://www.11st.co.kr/products/5609468845')

/* Explanation:
There are 2 kinds of product each with a different link with different data structure:

1. Normal product: https://www.11st.co.kr/products/5609468845
Note: This is a normal product. The product details are available in the HTML content of the page.
The price details are available in a separate API call.
The product details are extracted from the HTML content and the price details are extracted from the API call.

2. PA product: https://www.11st.co.kr/products/pa/6280550258
Note: This is a PA product. The product details are available in a separate API call.
The price details are available in a separate API call.
The product details are extracted from the API call and the price details are extracted from the API call.
*/

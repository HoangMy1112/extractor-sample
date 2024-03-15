import { JSDOM } from 'jsdom'

const titlesOfInterest = new Set([
  '플러스상품',
  '추천상품',
  '파워상품',
  '이런 상품은 어때요?',
  '광고상품',
  '리뷰 4점 이상 상품',
  '일반상품'
])

export type productDetailsParams = {
  id: string
  linkUrl: string
  name: string
  price: string
  buyUrl?: string
}

export function st11SearchExtractor(json: any, products: productDetailsParams[]): any[] {
  try {
    if (json && json.data && json.data.length > 0) {
      json.data.forEach((item: any) => {
        const { title, groupName, items } = item
        if ((title && titlesOfInterest.has(title)) || groupName === 'list' || groupName === 'searchTabPriceCompare') {
          items.forEach((i: any) => {
            const productDetails: productDetailsParams = {
              id: i.id,
              linkUrl: i.linkUrl,
              name: i.title,
              price: i.finalPrc
            }

            const isDuplicate = products.some((product) => product.id === i.id)
            if (!isDuplicate) {
              products.push(productDetails)
            }
          })
        }
      })
    }
  } catch (e) {
    console.error(e)
  }

  return products
}

export const st11ProductDetailApiExtractor = (jsonData: any, jsonData2? : any) => {
  const productName = jsonData?.title?.name || 'No product name available'

  const originalPrice = jsonData?.price?.sellPrice || 0
  const price = jsonData?.price?.finalDscPrice || 0
  const sellerName = jsonData?.storeArea?.sellerName || 'No seller name'
  const productID = jsonData?.productNo
  const uid = `${productID}_${Date.now()}`
  const sellerNumber = jsonData?.storeArea?.sellerNo || 'No seller number'
  const productDetailUrl = jsonData?.links.shareLinkUrl
  const discountPrice = originalPrice - price
  const point = discountPrice - price
  const discountRate = 100 - (price * 100 / originalPrice)
  const deliveryText = jsonData?.retailDelivery?.deliveryInfo.deliveryText.text || jsonData?.delivery?.text || ''
  let sellerEmail = jsonData2?.seller?.email || 'No email available';
  const optionInfo = ''
  const jobUrl = ''
  const options = ''
  const deliveryFee = ''



  const productDetails = {
    uid,
    productName,
    originalPrice,
    price,
    sellerName,
    sellerEmail,
    productID,
    discountRate,
    sellerNumber,
    url: productDetailUrl,
    discountPrice,
    deliveryText,
    point,
    optionInfo,
    jobUrl,
    options,
    deliveryFee
  }

  return productDetails
}

export const st11ProductDetailHTMLExtractor = (html: string) => {
  console.log(html)
  const dom = new JSDOM(html)
  const { document } = dom.window
  const Price = '0'
  const originalPriceSelector = '#finalDscPrcArea > dd > strong > span.value'

  const productNameSelector = '.c_product_info_title h1'
  const sellerSelector = '#productSellerWrap > div.b_product_seller > h4 > a'
  const pageUrlSelector = 'head > link:nth-child(6)'
  const sellerEmailSelector = '#tabpanelDetail4 > div > table:nth-child(9) > tbody > tr:nth-child(4) > td'
  const productIDSelector = '#tabpanelDetail1 > table > tbody > tr:nth-child(1) > td:nth-child(4)'
  const deliveryFeeSelector = '#layBodyWrap > div > div.s_product.s_product_detail > div.l_product_cont_wrap > div > div.l_product_buy_wrap.fixed_sm > div.l_product_buy_result > div.total_wrap.c_product_buy_price > ul > li:nth-child(2) > span'


  const productName = document.querySelector(productNameSelector)?.textContent?.trim() || ''
  const originalPrice = document.querySelector(originalPriceSelector)?.textContent?.trim().replace(/[^\d,]/g, '').replace(/,/g, '') || '0'
  const productID = document.querySelector(productIDSelector)?.textContent?.trim() || ''
  const sellerEmail = document.querySelector(sellerEmailSelector)?.textContent?.trim() || ''
  const sellerName = document.querySelector(sellerSelector)?.textContent?.trim() || ''
  const url = document.querySelector(pageUrlSelector)?.getAttribute('href') || ''
  const uid = `${productID}_${Date.now()}`
  const deliveryFee = document.querySelector(deliveryFeeSelector)?.textContent?.trim() || ''
  const discountRate =  100 - (parseInt(Price) * 100 / parseInt(originalPrice))
  const sellerNumber = ''
  const discountPrice = parseInt(originalPrice) - parseInt(Price) 
  const point = discountPrice - parseInt(Price) 
  const deliveryText = ''
  const optionInfo = ''
  const jobUrl = ''
  const options = ''

  return {
    uid,
    productName,
    originalPrice,
    Price,
    sellerName,
    sellerEmail,
    productID,
    url,
    discountRate,
    sellerNumber,
    discountPrice,
    deliveryText,
    point,
    optionInfo,
    jobUrl,
    options,
    deliveryFee,
  }
}




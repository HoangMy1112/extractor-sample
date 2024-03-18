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

export function GMarketSearchExtractor(html: string, products: productDetailsParams[]): productDetailsParams[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Loop to extract first 10 products
  for (let i = 1; i <= 3; i++) {
    const productSelector = `#section__inner-content-body-container > div:nth-child(3) > div:nth-child(${i}) > div.box__item-container > div.box__information > div.box__information-major > div.box__item-title > span > a > span.text__item`;
    console.log(productSelector)
    const productNameElement = document.querySelector(productSelector);
    console.log(productNameElement)
    if (productNameElement) {
      let productName = productNameElement.textContent || '';
      productName = productName.trim().replace(/^"|"$/g, '');
      const productDetails: productDetailsParams = {
        name: productName,
        id: '',
        linkUrl: '',
        price: ''
      };
      
      products.push(productDetails);
    }
  }

  return products;

}

export const st11PAProductDetailExtractor = (
  jsonData: any
) => {
  const productName = jsonData?.title?.name || 'No product name available'
  const originalPrice = jsonData?.price?.sellPrice || 0
  const price = jsonData?.price?.finalDscPrice || 0
  const sellerName = jsonData?.storeArea?.sellerName || 'No seller name'
  const productID = jsonData?.productNo
  const uid = `${productID}_${Date.now()}`
  const sellerNumber = jsonData?.storeArea?.sellerNo || 'No seller number'
  const productDetailUrl = jsonData?.links.shareLinkUrl
  const discountPrice = originalPrice - price
  const point = jsonData.maxRewardPoint.value
  const discountRate = 100 - (price * 100) / originalPrice
  const deliveryText = jsonData?.retailDelivery?.deliveryInfo.deliveryText.text
    || jsonData?.delivery?.text
    || ''
  const jobUrl = ''
  const deliveryFee = jsonData?.retailDelivery?.dlvText
  const sellerEmail = ''
  const options = ''

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
    jobUrl,
    options,
    deliveryFee
  }

  return productDetails
}

export const st11PAProductEmailExtractor = (jsonData: any) => jsonData?.seller?.email || 'No email available'

export const st11PAProductOptionsExtractor = (jsonData: any) => {
  let optionItems: any[] = []
  jsonData.forEach((i: any) => {
    optionItems = optionItems.concat(i.items).concat(', ')
  })
  return JSON.stringify(optionItems)
}
export function GMarketProductDetailExtractor(html:string) {
  const dom = new JSDOM(html)
  const { document } = dom.window
  const priceSelector = '#itemcase_basic > div.box__item-title > div.price > span.price_innerwrap > strong'
  const originalPriceSelector = '#itemcase_basic > div.box__item-title > div.price > span.price_innerwrap > span.price_original > span.text__price'
  
  const price = document.querySelector(priceSelector)?.textContent?.trim() || ''
  const originalPrice = document.querySelector(originalPriceSelector)?.textContent?.trim() || ''

  const productIDSelector = '#vip-tab_detail > div.vip-detailarea_productinfo.box__product-notice.js-toggle-content > div.box__product-notice-list > table:nth-child(1) > tbody > tr:nth-child(1) > td'
  const productID = document.querySelector(productIDSelector)?.textContent?.trim() || ''

  const discountPrice = parseInt(originalPrice, 10) - parseInt(price,10)

  const shippingFeeSelector = '#container > div.item-topinfowrap > div.item-topinfo.item-topinfo--additional.box__item-info--vip > div.box__item-detailinfo.box__item-detailinfo--additional > ul > li.list-item__delivery-predict.list-item__delivery-today.uxeslide_item > div > div:nth-child(4) > font > span:nth-child(1) > span'
  const shippingFee = document.querySelector(shippingFeeSelector)?.textContent?.trim() || ''

  const productNameSelector = '#itemcase_basic > div.box__item-title > h1'
  const productName = document.querySelector(productNameSelector)?.textContent?.trim() || ''

  const uid = `${productID}_${Date.now()}`

  const sellerNameSelector = '#vip-tab_detail > div.vip-detailarea_productinfo.box__product-notice.js-toggle-content.on > div.box__product-notice-list > table:nth-child(2) > tbody > tr:nth-child(1) > td'
  const sellerName = document.querySelector(sellerNameSelector)?.textContent?.trim() || ''
  
  const discountRate = 100 - ((parseInt(price, 10) * 100) / parseInt(originalPrice, 10))
  const url =''
  const dlvTextSelector = '#container > div.item-topinfowrap > div.item-topinfo.item-topinfo--additional.box__item-info--vip > div.box__item-detailinfo.box__item-detailinfo--additional > ul > li.list-item__delivery-predict.list-item__delivery-today.uxeslide_item > div > div:nth-child(2) > span > span.text'
  const dlvText = document.querySelector(dlvTextSelector)?.textContent?.trim() || ''
  const point = ''
  const sellerSelector = '#container > div.item-topinfowrap > div.item-topinfo.item-topinfo--additional.box__item-info--vip > div.item-topinfo_headline > p > span > a'
  const sellerURL = document.querySelector(sellerSelector)?.getAttribute('href') || ''

  return {
    uid,
    price,
    originalPrice,
    discountPrice,
    shippingFee,
    productID,
    productName,
    discountRate,
    dlvText,
    sellerURL
  }
}

export function st11NormalProductDetailExtractor(html: string) {
  const dom = new JSDOM(html)
  const { document } = dom.window

  const originalPriceSelector = '#finalDscPrcArea > dd > strong > span.value'
  const productNameSelector = '.c_product_info_title h1'
  const sellerSelector = '#productSellerWrap > div.b_product_seller > h4 > a'
  const pageUrlSelector = 'head > link:nth-child(6)'
  const sellerEmailSelector = '#tabpanelDetail4 > div > table:nth-child(9) > tbody > tr:nth-child(4) > td'
  const productIDSelector = '#tabpanelDetail1 > table > tbody > tr:nth-child(1) > td:nth-child(4)'
  const sellerNumberSelector = '#tabpanelDetail4 > div > table:nth-child(9) > tbody > tr:nth-child(3) > td:nth-child(2)'
  const deliveryTextSelector = '#arDialogDelivery > div > div.dialog_cont > div.delivery_information'
  const deliveryFeeSelector = '#ar-layerTitleDeliveryPay2 > span'
  const optionsSelector = '#buyList > li > div > div.accordion_body.dropdown_list > ul'
  const pointSelector = '#max_saveing_point_layer > div > dl > div.point.elevenpay_point > dd > p'

  const productName = document.querySelector(productNameSelector)?.textContent?.trim() || ''
  const originalPrice = document.querySelector(originalPriceSelector)?.textContent?.trim()
    .replace(/[^\d,]/g, '').replace(/,/g, '') || '0'
  const productID = document.querySelector(productIDSelector)?.textContent?.trim() || ''
  const sellerEmail = document.querySelector(sellerEmailSelector)?.textContent?.trim() || ''
  const sellerName = document.querySelector(sellerSelector)?.textContent?.trim() || ''
  const url = document.querySelector(pageUrlSelector)?.getAttribute('href') || ''
  const uid = `${productID}_${Date.now()}`
  const deliveryFee = document.querySelector(deliveryFeeSelector)?.textContent?.trim()
    .replace(/[^\d,]/g, '').replace(/,/g, '') || ''
  const point = document.querySelector(pointSelector)?.textContent?.trim().replace(/[^\d,]/g, '')
  const price = '0'

  const discountRate = 100 - ((parseInt(price, 10) * 100) / parseInt(originalPrice, 10))
  const sellerNumber = document.querySelector(sellerNumberSelector)?.textContent?.trim() || ''
  const discountPrice = parseInt(originalPrice, 10) - parseInt(price, 10)
  const tempDeliveryText = document.querySelector(deliveryTextSelector)?.textContent?.trim()
    .replace(/\n/g, ', ').split(',') || []
  const deliveryText = tempDeliveryText.map((line) => line.trim()).filter((line) => line !== '').join(', ')
  const jobUrl = ''
  const tempOptions = document.querySelector(optionsSelector)?.textContent?.trim().replace(/\n/g, ', ').split(',') || []
  const options = tempOptions.map((line) => line.trim()).filter((line) => line !== '').join(', ')

  return {
    uid,
    productName,
    originalPrice,
    price,
    sellerName,
    sellerEmail,
    productID,
    url,
    discountRate,
    sellerNumber,
    discountPrice,
    deliveryText,
    point,
    jobUrl,
    options,
    deliveryFee
  }
}

export function st11NormalProductRequiredInfoForQueryPrice(html: string) {
  const dom = new JSDOM(html)
  const { document } = dom.window

  const productNumSelector = '#tabpanelDetail1 > table > tbody > tr:nth-child(1) > td:nth-child(4)'
  const originalPriceSelector = '#finalDscPrcArea > dd > strong > span.value'

  const productNo = document.querySelector(productNumSelector)?.textContent?.trim() || ''
  const sellPrice = document.querySelector(originalPriceSelector)?.textContent?.trim()
    .replace(/[^\d,]/g, '').replace(/,/g, '') || '0'

  let sellerNo = ''
  const anchorEle = document.querySelector('#reportProductPop')
  if (anchorEle) {
    const anchorEleData = anchorEle.getAttribute('data-selMnbdNo')
    if (anchorEleData) {
      sellerNo = anchorEleData
    }
  }

  return {
    xSite: '1000966141',
    productNo,
    sellPrice,
    sellerNo
  }
}

export function st11NormalProductPriceExtractor(json: any) {
  return json.maxDiscount?.maxDiscountPrice || '0'
}
export function GMarketSellerInformation(html:string){
  const dom = new JSDOM(html)
  const { document } = dom.window
  const sellerNameSelector = '#ms_shopInfo > div.ms_shopInfo_box > div.shop_data > div.shop_data_b > div > div > dl > dd:nth-child(2)'
  const sellerName = document.querySelector(sellerNameSelector)?.textContent?.trim() || ''

  const sellerEmailSelector = '#ms_shopInfo > div.ms_shopInfo_box > div.shop_data > div.shop_data_b > div > div > dl > dd:nth-child(12) > a'
  const sellerEmail = document.querySelector(sellerEmailSelector)?.getAttribute('href') || ''

  const sellerNumberSelector = '#ms_shopInfo > div.ms_shopInfo_box > div.shop_data > div.shop_data_b > div > div > dl > dd:nth-child(14)'
  const sellerNumber = document.querySelector(sellerNumberSelector)?.textContent?.trim() || ''

  return {
    sellerName,
    sellerEmail,
    sellerNumber
  }
}
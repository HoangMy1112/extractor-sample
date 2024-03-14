import moment from 'moment'
import { customRequest } from './common'

export async function getCookieBankApi(type: string) {
  try {
    const req = await customRequest({
      url: `${process.env.NEXUS_HOST_SERVER}/api/v1/token/platform?type=${type}`,
      method: 'GET'
    })
    const { data } = JSON.parse(req)
    return data.filter((elm: any) => deleteData(elm))
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function insertCookieBankApi(type: string, body: string) {
  try {
    const req = await customRequest({
      url: `${process.env.NEXUS_HOST_SERVER}/api/v1/token/platform?type=${type}`,
      method: 'POST',
      option: {
        data: body,
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json'
        }
      }
    })
    return req
  } catch (e) {
    console.error(e)
    return e
  }
}

async function deleteCookieBankApi(type: string, id: number) {
  try {
    const req = await customRequest({
      url: `${process.env.NEXUS_HOST_SERVER}/api/v1/token/platform?type=${type}&id=${id}`,
      method: 'DELETE',
      option: {}
    })
    return req
  } catch (e) {
    console.error(e)
    return e
  }
}

// 넥서스 서버 코드 업데이트되면 확인 필요함
function deleteData(elm: any) {
  const now = moment().unix()
  if (now + 86400 >= elm.expires) {
    deleteCookieBankApi(elm.type, elm.id)
    return false
  }
  return true
}

export async function getATUserIDApi(platform: string) {
  try {
    const req = await customRequest({
      url: `${process.env.AT_HOST_SERVER}/v1/at/platforms/users?isEntireUser=true&platform=${platform}`,
      method: 'GET'
    })
    const { data } = JSON.parse(req)
    return data
  } catch (e) {
    console.error(e)
    return []
  }
}

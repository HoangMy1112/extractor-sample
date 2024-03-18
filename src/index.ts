import { ipMain } from './etc/ipChange'
import { coupangWingPremium } from './platform/coupang/wing'
// import { st11Main } from './platform/st11'

const jobs = [
  ipMain,
  coupangWingPremium
]

async function main() {
  for (const job of jobs) {
    await job()
  }
  return 0
}

main()

// pm2 start npm --name 'cookie-bank-job' --no-autorestart --cron-restart='0 0 * * *' -- run cookie

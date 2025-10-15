import http from '../services/http';

export const getC2CList = () => {
  const params = {
    fiat: 'CNY',
    page: 1,
    rows: 10,
    tradeType: 'SELL',
    asset: 'USDT',
    countries: [],
    proMerchantAds: false,
    shieldMerchantAds: false,
    filterType: 'all',
    periods: [],
    additionalKycVerifyFilter: 0,
    publisherType: null,
    payTypes: ['ALIPAY', 'WECHAT'],
    classifies: ['mass', 'profession', 'fiat_trade'],
    tradedWith: false,
    followed: false,
  };
  return http.post('https://c2c.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', params);
};

const store_name = "";
const key = "";
const password = "";

const shopifyStore = new Shopify({
  shopName: store_name,
  apiKey: key,
  password: secret,
  autoLimit: { calls: 2, interval: 1000, bucketSize: 35 },
});

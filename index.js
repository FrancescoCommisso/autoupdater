const mvr_products = require("./DATA/all_mvr_products.json");
const shopify_products = require("./DATA/all_products_real.json");

const go = async () => {
  const productUpdater = await require("./ProductUpdater/config")();

  let updated = 0;
  updates = [];
  let errors = [];
  console.time("update");
  for (let i = 0; i < shopify_products.length; i++) {
    try {
      const current_shopify_product = shopify_products[i];
      const mvr_product = mvr_products.find(
        (mvrp) => mvrp.UPC_CODE == current_shopify_product.SKU
      );
      if (!mvr_product) {
        errors.push(current_shopify_product);
        throw new Error(`${current_shopify_product.SKU}`);
      }
      const updated_shopify_product = productUpdater.productResolver.mvrToShopifyProduct(
        mvr_product
      );

      await productUpdater.shopifyService.shopifyStore.product.update(
        current_shopify_product["Product ID"],
        updated_shopify_product
      );
      console.log(i);
      updated++;
      updates.push(updated_shopify_product);
    } catch (e) {
      console.log(e);
    }
  }
  console.timeEnd("update");
  console.log("DONE");
  console.log({
    updated,
    percent: `${(updated / shopify_products.length) * 100}%`,
    errors,
  });
  fs.writeFileSync(`${__dirname}/update_errors.json`, JSON.stringify(errors));
  fs.writeFileSync(`${__dirname}/update_success.json`, JSON.stringify(updates));
};

go();

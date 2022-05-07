import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
  logging: false,
});

const DB = sequelize.define("Items", {
  sku: DataTypes.STRING,
  productId: DataTypes.STRING,
  name: DataTypes.STRING,
  price: DataTypes.REAL,
  lastUpdatedPrice: DataTypes.REAL,
  oldPrice: DataTypes.REAL,
  discount: DataTypes.NUMBER,
  url: DataTypes.STRING,
  img: DataTypes.STRING,
});

/**
 * Connects to the local db
 */
export const connectToDatabase = () => {
  try {
    sequelize.authenticate();
    sequelize.sync();
  } catch (error) {
    console.log("Oops! Error connecting to the db :( ", error);
  }
};

/**
 * Processes raw product data and format it according to the db specification
 * @param {*} data raw product data
 * @returns formatted product data
 */
export const proccessItemsData = (data) => {
  let formattedItemsList = [];
  for (let item of data) {
    formattedItemsList.push({
      sku: item.sku,
      productId: item.baseProduct,
      name: item.name,
      price: item.price.value,
      oldPrice: item.originalPrice.value,
      discount: (
        ((item.originalPrice.value - item.price.value) /
          item.originalPrice.value) *
        100
      ).toFixed(0),
      url: `https://footlocker.com/product/~/${item.sku}.html`,
      img: item.images[0].url,
    });
  }
  return formattedItemsList;
};

/**
 * Persists a list of items to the local db
 * @param {*} items raw product data
 */
export const saveItems = async (items) => {
  for (let item of items) {
    let itemAlreadyExists = await DB.findOne({ where: { sku: item.sku } });
    if (itemAlreadyExists && itemAlreadyExists.price !== item.price) {
      /**
       * Updates item if it already exists in db and
       * saves last price to lastUpdatedPrice
       */
      await itemAlreadyExists
        .update({
          sku: item.sku,
          productId: item.productId,
          name: item.name,
          price: item.price,
          lastUpdatedPrice: itemAlreadyExists.price,
          oldPrice: item.oldPrice,
          discount: item.discount,
          url: item.url,
          img: item.img,
        })
        .catch(console.error);
    } else {
      await DB.create(item).catch(console.error);
    }
  }
};

export default {};

import axios from "axios";

/**
 * Gets items data from the Coach Outlet API
 * @param {number} page page number to query by
 * @returns raw items data as html
 */
export const getItems = async (page) => {
  let items;
  try {
    let response = await axios.get(
      `https://www.footlocker.com/api/products/search?query=sale%3Arelevance%3AstyleDiscountPercent%3ASALE&currentPage=${page}&sort=relevance&pageSize=48&timestamp=3`,
      {
        headers: {
          authority: "www.footlocker.com",
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
          "x-api-lang": "en-GB",
          "accept-language": "en-GB,en;q=0.9",
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
          accept: "application/json",
          "x-fl-request-id": "bdd5a4a0-b5a1-11ec-b877-53cd23479d52",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer:
            "https://www.footlocker.com/en/category/sale.html?currentPage=2",
        },
      }
    );
    if (response && response.status === 200) {
      items = response.data.products;
    } else {
      throw new Error("Unable to get products");
    }
  } catch (error) {
    console.log(error.message);
  }
  return items;
};

export default {};

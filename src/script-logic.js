import { getItems } from "./data-fetcher.js";
import { proccessItemsData, saveItems } from "./db-connector.js";
import { timeout } from "./utils.js";

const startScraping = async () => {
  let flag = true;
  let pageNumber = 1;
  const timeToWaitInMinutes = 2;
  const timeToWaitInHours = 1;
  while (flag) {
    const items = await getItems(pageNumber);
    const parsedItems = proccessItemsData(items);
    if (parsedItems.length === 0) {
      flag = false;
      break;
    } else {
      await saveItems(parsedItems);
      pageNumber++;
    }
    await timeout(timeToWaitInMinutes * 60000);
  }
  await timeout(timeToWaitInHours * 3600000);
  startScraping();
};

export default startScraping;

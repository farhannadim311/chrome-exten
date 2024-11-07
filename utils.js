export async function getActiveTabUrl()
{
   let queryOptions = {active: true, currentWindow: true};
   let [tab] = chrome.tab.query(queryOptions);
   return tab;
}
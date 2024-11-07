import {getActiveTabURL} from "./utils.js";
// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = (currentBookmark =[]) => {
    const bookmarkElement = document.getElementById("bookmarks");
    bookmarkElement.innerHTML = "";
    if(currentBookmark.length > 0)
    {
        for (let i =0; i < currentBookmark.length; i++)
        {
            const bookmark = currentBookmark[i];
            addNewBookmark(bookmarkElement,bookmark)
        }
    }
    else
    {
        bookmarkElement.innerHTML = '<i class = "row">No Bookmarks to show </i>';
    }
};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", async() => {
    const activeTab = await getActiveTabURL();
    const queryParameters = activeTab.url.split('?');
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo = urlParameters.get("v");
    if(activeTab.url.includes("youtube.com/watch") && currentVideo)
    {
        chrome.storage.sync.get([currentVideo], data =>
            {
                const currentBookmark = data[currentVideo] ? JSON.parse(data[currentVideo]):[];
                viewBookmarks(currentBookmark);
            }
        )
    }
    else{
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title">This is not a YouTube video</div>';

    }
})

  

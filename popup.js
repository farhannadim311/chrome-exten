import { getActiveTabUrl, getActiveTabURL } from "./utils.js";

// Adding a new bookmark row to the popup
const addNewBookmark = (bookmarkElement, bookmark) => {
    const BookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");

    BookmarkTitleElement.textContent = bookmark.desc;
    BookmarkTitleElement.className = "bookmark-title";
    controlsElement.className = "bookmark-controls";
    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);  // Fixed setAttribute

    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);

    newBookmarkElement.appendChild(BookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarkElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmark = []) => {
    const bookmarkElement = document.getElementById("bookmarks");
    bookmarkElement.innerHTML = "";
    if (currentBookmark.length > 0) {
        for (let i = 0; i < currentBookmark.length; i++) {
            const bookmark = currentBookmark[i];
            addNewBookmark(bookmarkElement, bookmark);
        }
    } else {
        bookmarkElement.innerHTML = '<i class="row">No Bookmarks to show </i>';
    }
};

const onPlay = async (e) => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");  // Fixed attribute access
    const activeTab = await getActiveTabURL();
    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",  // Changed to string type
        value: bookmarkTime
    });
};

const onDelete = async (e) => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");  // Fixed attribute access
    const activeTab = await getActiveTabURL();
    const bookmarkElementToDelete = document.getElementById("bookmark-" + bookmarkTime);
    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarkTime
    }, viewBookmarks);  // Fixed the syntax error
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    const queryParameters = activeTab.url.split('?');
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], data => {
            const currentBookmark = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
            viewBookmarks(currentBookmark);
        });
    } else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title">This is not a YouTube video</div>';
    }
});


  

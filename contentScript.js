(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmark = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoID } = obj;

        if (type === "NEW") {
            currentVideo = videoID;
            newVideoLoaded();
        }
        else if (type === "PLAY") {
            youtubePlayer.currentTime = value;
        }
        else if (type === "DELETE") {
            currentVideoBookmark = currentVideoBookmark.filter((b) => b.time != value);
            chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmark) });
            response(currentVideoBookmark);
        }
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
            });
        });
    };

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmark = await fetchBookmarks(); // Fixed async call
        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    };

    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        currentVideoBookmark = await fetchBookmarks(); // Fixed async call

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify(
                currentVideoBookmark.concat(newBookmark).sort((a, b) => a.time - b.time)
            ),
        });
    };
})();

const getTime = (t) => {
    const date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substr(11, 8);
};

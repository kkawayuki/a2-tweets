function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined) {
        window.alert("No tweets returned");
        return;
    }

    //global variable btw
    tweet_array = runkeeper_tweets
        .map(function (tweet) {
            return new Tweet(tweet.text, tweet.created_at);
        })
        .filter(function (tweet) {
            return tweet.written;
        });
}

function addEventHandlerForSearch() {
    //TODO: Search the written tweets as text is entered into the search box, and add them to the table
    const textFilter = document.getElementById("textFilter");
    const tweetTable = document.getElementById("tweetTable");
    const searchCount = document.getElementById("searchCount");
    const searchText = document.getElementById("searchText");

    textFilter.addEventListener("input", function () {
        if ((textFilter.value === "")) {
            tweetTable.innerText = "";
            searchCount.innerText = 0;
            searchText.innerText = "";
            return;
        } else {
            const matches = tweet_array.filter((tweet) => {
                return(tweet.writtenText.toLowerCase().includes(
                    textFilter.value.toLowerCase(),
                ));
            });
			searchText.innerText = textFilter.value;
			searchCount.innerText = matches.length; 
			const rows = matches.map((tweet, i) => {
				return(tweet.getHTMLTableRow(i+1));
			}).join("");
			tweetTable.innerHTML = rows;
        }
    });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
    addEventHandlerForSearch();
    loadSavedRunkeeperTweets().then(parseTweets);
});

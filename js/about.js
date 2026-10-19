function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined) {
        window.alert("No tweets returned");
        return;
    }

    //build array, mapping tweets to array
    tweet_array = runkeeper_tweets.map(function (tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    //This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
    //It works correctly, your task is to update the text of the other tags in the HTML file!
    document.getElementById("numberTweets").innerText = tweet_array.length;

    //1.1 for earliest/latest tweets
    {
        //parse array of Tweet objects, finding earliest, latest tweets
        //note: These vars would crash the file if tweet array were empty
        let earliest = tweet_array[0].time;
        let latest = tweet_array[0].time;
        for (let i = 1; i < tweet_array.length; i++) {
            if (tweet_array[i].time < earliest) earliest = tweet_array[i].time;
            if (tweet_array[i].time > latest) latest = tweet_array[i].time;
        }
        //format
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        //post first/last
        document.getElementById("firstDate").innerText =
            earliest.toLocaleDateString("en-US", options);
        document.getElementById("lastDate").innerText =
            latest.toLocaleDateString("en-US", options);
    }

    //1.2 for achievement type
    {
        let achievement = 0,
            live = 0,
            completed = 0,
            misc = 0;
        for (const tweet of tweet_array) {
            switch (tweet.source) {
                case "achievement":
                    achievement++;
                    break;
                case "live_event":
                    live++;
                    break;
                case "completed_event":
                    completed++;
                    break;
                default:
                    misc++;
                    break;
            }
        }
        //post
        const completedSpans =
            document.getElementsByClassName("completedEvents");
        for (const span of completedSpans) {
            span.innerText = completed;
        }
        const completedSpansPct =
            document.getElementsByClassName("completedEventsPct");
        for (const span of completedSpansPct) {
            span.innerText =
                math.format((completed / tweet_array.length) * 100, {
                    notation: "fixed",
                    precision: 2,
                }) + "%";
        }
        const liveSpans = document.getElementsByClassName("liveEvents");
        for (const span of liveSpans) {
            span.innerText = live;
        }
        const liveSpansPct = document.getElementsByClassName("liveEventsPct");
        for (const span of liveSpansPct) {
            span.innerText =
                math.format((live / tweet_array.length) * 100, {
                    notation: "fixed",
                    precision: 2,
                }) + "%";
        }
        const achievementSpans =
            document.getElementsByClassName("achievements");
        for (const span of achievementSpans) {
            span.innerText = achievement;
        }
        const achievementSpansPct =
            document.getElementsByClassName("achievementsPct");
        for (const span of achievementSpansPct) {
            span.innerText =
                math.format((achievement / tweet_array.length) * 100, {
                    notation: "fixed",
                    precision: 2,
                }) + "%";
        }
        const miscSpans = document.getElementsByClassName("miscellaneous");
        for (const span of miscSpans) {
            span.innerText = misc;
        }
        const miscSpansPct =
            document.getElementsByClassName("miscellaneousPct");
        for (const span of miscSpansPct) {
            span.innerText =
                math.format((misc / tweet_array.length) * 100, {
                    notation: "fixed",
                    precision: 2,
                }) + "%";
        }
    }

    //1.3 for user-created posts (they always tag someone)
    {
        let userGen = 0;
        for (const tweet of tweet_array) {
            if (tweet.written) userGen++;
        }
        const writtenSpans = document.getElementsByClassName("written");
        for (const span of writtenSpans) {
            span.innerText = userGen;
        }
        const writtenSpansPct = document.getElementsByClassName("writtenPct");
        for (const span of writtenSpansPct) {
            span.innerText =
                math.format((userGen / tweet_array.length) * 100, {
                    notation: "fixed",
                    precision: 2,
                }) + "%";
        }
    }
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
    loadSavedRunkeeperTweets().then(parseTweets);
});

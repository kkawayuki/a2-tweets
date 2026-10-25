function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined) {
        window.alert("No tweets returned");
        return;
    }

    tweet_array = runkeeper_tweets.map(function (tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    }).filter(function (tweet) {
        return tweet.source === "completed_event";
    });

    //create array of data to feed graph creator
    let obj_array = tweet_array.map(function (tweet) {
        return {
            activity: tweet.activityType,
            distance: tweet.distance,
            day: tweet.time.toLocaleDateString("en-US", { weekday: "short" }),
        };
    });

    //for building the actual graph, references tweet_array values
    activity_vis_spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description:
            "A graph of the number of Tweets containing each type of activity.",
        data: {
            values: obj_array,
        },
        width: { step: 80 },
        mark: "bar",
        encoding: {
            x: {
                field: "activity",
                type: "nominal",
                sort: "-y",
                axis: { labelAngle: 0 },
            },
            y: {
                aggregate: "count",
                type: "quantitative",
                title: "number of tweets",
            },
        },
    };
    vegaEmbed("#activityVis", activity_vis_spec, { actions: false });

	//filter out three most popular
	const top3 = ["run", "walk", "bike"];	
	data_arr = tweet_array.filter(function (tweet) {
        return top3.includes(tweet.activityType);
    });

	obj_array = data_arr.map(function (tweet) {
        return {
            activity: tweet.activityType,
            distance: tweet.distance,
            day: tweet.time.toLocaleDateString("en-US", { weekday: "short" }),
        };
    });

    distance_vis_spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "A graph of the distance (in miles) of every run, walk, and bike Tweet by day of the week, colored by activity type.",
        data: {
            values: obj_array,
        },
        width: { step: 50 },
        mark: "point",
        encoding: {
            x: { field: "day", type: "nominal", axis: { labelAngle: 0 }, sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
            y: { field: "distance", type: "quantitative" },
			//color to visually separate activities
			color: { field: "activity", type: "nominal" },
			
        }
		
    };
    vegaEmbed("#distanceVis", distance_vis_spec, { actions: false });

	distance_agg_spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "A graph of the mean distance (in miles) of run, walk, and bike Tweets by day of the week, colored by activity type.",
        data: {
            values: obj_array,
        },
        width: { step: 50 },
        mark: "point",
        encoding: {
            x: { field: "day", type: "nominal", axis: { labelAngle: 0 }, sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
            y: { field: "distance", type: "quantitative", aggregate: "mean" },
			color: { field: "activity", type: "nominal" },
			
        }
		
    };
    vegaEmbed("#distanceVisAggregated", distance_agg_spec, { actions: false });

	//logic for HTML display toggling
	const aggDisplay = document.getElementById("distanceVisAggregated");
	aggDisplay.style.display = "none";
	const visDisplay = document.getElementById("distanceVis");
	visDisplay.style.display = "block";

	//add button functionality
	document.getElementById("aggregate").addEventListener("click", function () { 
		if(aggDisplay.style.display === "none")
		{
			aggDisplay.style.display = "block";
			visDisplay.style.display = "none";
			document.getElementById("aggregate").innerText = "Show all activities";
		}
		else
		{
			aggDisplay.style.display = "none";
			visDisplay.style.display = "block";
			document.getElementById("aggregate").innerText = "Show means";
		}
	})
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
    loadSavedRunkeeperTweets().then(parseTweets);
});

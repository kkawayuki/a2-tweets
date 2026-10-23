class Tweet {
    private text: string;
    time: Date;

    constructor(tweet_text: string, tweet_time: string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source(): string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        //Tweet classes built on DOM load, pushed to tweet_array in about.js
        //Using this.text and information from saved_tweets.json, infer type by using simple
        //string checking
        if (
            this.text.includes("PB") ||
            this.text.includes("Achieved")
        ) //tentative
        {
            return "achievement";
        } else if (
            this.text.includes("right now") ||
            this.text.includes("live")
        ) //tentative
        {
            return "live_event";
        } else if (
            this.text.includes("completed") ||
            this.text.includes("posted")
        ) {
            return "completed_event";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written(): boolean {
        return(this.text.includes(" - "));
    }

    get writtenText(): string {
        if (!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType(): string {
        if (this.source != "completed_event") {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        if (
            this.text.toLowerCase().includes("swim")
        ) return "swim";
            
        else if (
            this.text.toLowerCase().includes("bike") ||
            this.text.toLowerCase().includes("cycle")
        )return "bike";
        
        else if (
            this.text.toLowerCase().includes("ski") || 
            this.text.toLowerCase().includes("snow")
        ) return "ski";

        else if (
            this.text.toLowerCase().includes("walk")
        ) return "walk";

        else if (
            this.text.toLowerCase().includes("km run") ||
            this.text.toLowerCase().includes("mi run") 
        ) return "run";
            
        return "other";
    }

    get distance(): number {
        if (this.source != "completed_event") {
            return 0;
        }

        //regex for digit as 
        const regex = /(\d+(?:\.\d+)?) (km|mi)\b/;
        const match = this.text.match(regex);
        if(!match) return 0;
        
        const distance = parseFloat(match[1]);

        //return, handle case km conversion -> mi
        return match[2] == "km" ? distance / 1.609 : distance;
    }

    getHTMLTableRow(rowNumber: number): string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}

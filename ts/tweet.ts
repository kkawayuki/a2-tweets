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

        let indexStart = this.text.indexOf("-" + 3);
        let indexEnd = this.text.indexOf("https://");

        let written = this.text.substring(indexStart,indexEnd);
        return written;
    }

    get activityType(): string {
        if (this.source != "completed_event") {
            return "unknown";
        }
        
        //pull the activity name out of the auto-generated part, e.g. "Just completed a 4.87 km run with @Runkeeper"
        //so the user's own written text can't affect the category
        const regex = /just (?:completed|posted) an? (?:[\d.]+ ?(?:km|mi) )?(.+?)(?: with @?Runkeeper| - | in \d|\s+https)/i;
        const match = this.text.match(regex);
        if(!match) return "other";

        //keep the 7 most common activities, everything else (including the generic "activity") goes to other
        switch(match[1].toLowerCase())
        {
            case("run"):
                return "run";
            case("walk"):
            case("nordic walk"):
                return "walk";
            case("bike"):
            case("mtn bike"):
                return "bike";
            case("elliptical workout"):
                return "elliptical";
            case("strength workout"):
                return "strength";
            case("hike"):
                return "hike";
            case("swim"):
                return "swim";
            default:
                return "other";
        }
    }

    get distance(): number {
        if (this.source != "completed_event") {
            return 0;
        }

        //regex for isolating distance digit
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

import * as React from "react";
import { DiscordIcon, Icons } from "@instill-ai/design-system";

const FeaturedBanner = () => {
    const [showBanner, setShowBanner] = React.useState(true);

    return (
        <>
            {showBanner && (
                <div className="mb-3 flex items-center justify-between rounded-sm bg-semantic-accent-bg px-4 py-2 text-semantic-fg-secondary">
                    <p className="flex items-center font-normal">
                        Want to feature your pipeline? Drop a message in &nbsp;
                        <span className="font-bold">#show-your-work</span>&nbsp;on&nbsp;
                        <a
                            href="https://discord.com/invite/sevxWsqpGh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-semantic-accent-default"
                        >
                            <span className="relative inline-flex items-center space-x-1 font-semibold">
                                <span>Discord</span>
                                <span className="inline-flex h-4 w-4 text-semantic-accent-default">
                                    <DiscordIcon color="fill-semantic-accent-default" />
                                </span>
                                <span className="absolute -left-1 bottom-0 right-0 h-0.5 bg-semantic-accent-default"></span>
                            </span>
                        </a>
                    </p>
                    <button onClick={() => setShowBanner(false)}>
                        <Icons.X className="h-5 w-5 stroke-semantic-fg-secondary" />
                    </button>
                </div>
            )}
        </>
    );
};

export default FeaturedBanner;
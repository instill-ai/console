import * as React from "react";
import { Button, Icons, Input, ScrollArea, Skeleton } from "@instill-ai/design-system";
import { EntityAvatar } from "../../../components";
import { Logo } from "@instill-ai/design-system";
import { AuthenticatedUser } from "../../../lib";
import { Citations } from "./Citations";
import { useMockMessages } from "../../../lib/react-query-service/applications";

type MessagesProps = {
    me: AuthenticatedUser | undefined;
};

export const Messages: React.FC<MessagesProps> = ({ me }) => {
    const { data: mockMessages = [], isLoading: isMessagesLoading, isError: isMessagesError } = useMockMessages();

    const copyBotResponse = () => {
        const botResponse = mockMessages.find((message) => message.ownerID === "assistant")?.content;
        if (botResponse) {
            navigator.clipboard.writeText(botResponse);
        }
    };

    if (isMessagesLoading) {
        return (
            <div className="flex flex-col flex-1 p-6 gap-4">
                <Skeleton className="h-8 w-full bg-semantic-bg-line" />
                <Skeleton className="h-8 w-full bg-semantic-bg-line" />
                <Skeleton className="h-8 w-full bg-semantic-bg-line" />
            </div>
        );
    }

    if (isMessagesError) {
        return <div>Error occurred while fetching messages.</div>;
    }

    return (
        <div className="flex flex-col flex-1 p-6 gap-4">
            <ScrollArea.Root className="h-96">
                {mockMessages.map((message) => (
                    <div key={message.id} className="flex gap-7 rounded-lg">
                        {message.ownerID === "assistant" ? (
                            <Logo variant="colourLogomark" width={32} className="mt-2" />
                        ) : (
                            <EntityAvatar
                                src={me?.profile?.avatar ?? null}
                                className="h-8 w-8"
                                entityName={me?.name ?? ""}
                                fallbackImg={
                                    <div className="flex h-8 w-8 mt-2 shrink-0 grow-0 rounded-full bg-semantic-bg-line">
                                        <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
                                    </div>
                                }
                            />
                        )}
                        <div className="flex-1 pt-2 text-semantic-fg-primary whitespace-pre-wrap product-body-text-3-regular">
                            {message.content.split("\n").map((line, index) => (
                                <React.Fragment key={index}>
                                    {line.startsWith("$") ? (
                                        <span className="bg-semantic-bg-secondary">{line.slice(1)}</span>
                                    ) : (
                                        <div>{line}</div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
            </ScrollArea.Root>
            <div className="flex justify-between items-end w-full mb-auto">
                <Citations />
                <Button variant="tertiaryGrey" size="sm" className="p-4" onClick={copyBotResponse}>
                    <Icons.Copy07 className="h-4 w-4 stroke-semantic-fg-secondary active:stroke-semantic-accent-default" />
                </Button>
            </div>
            <Input.Root className="flex items-center gap-2 !rounded px-2 py-4">
                <Input.Core placeholder="Message..." />
                <Button variant="primary" className="px-2 !mr-4" size="sm">
                    <Icons.ArrowNarrowRight className="h-4 w-4 stroke-semantic-fg-on-default" />
                </Button>
            </Input.Root>
        </div>
    );
};

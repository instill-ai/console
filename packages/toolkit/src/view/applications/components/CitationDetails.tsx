import * as React from "react";
import { ScrollArea, Icons } from "@instill-ai/design-system";

type CitationDetailsProps = {
    snippet: {
        id: string;
        content: string;
        fileName: string;
        sectionTitle: string;
    };
};

export const CitationDetails: React.FC<CitationDetailsProps> = ({ snippet }) => (
    <div className="flex flex-col p-6 bg-semantic-bg-primary gap-4">
        <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12  rounded-[10px] shadow border border-semantic-bg-line">
                <Icons.X className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
                <div className="text-semantic-fg-disabled product-headings-heading-6">{snippet.fileName}</div>
                <div className="text-semantic-fg-primary product-headings-heading-5">{snippet.sectionTitle}</div>
            </div>
        </div>
        <div className="flex flex-col gap-4">
            <ScrollArea.Root>
                <div className="p-4 text-semantic-fg-primary product-body-text-3-regular">
                    <div className=" mb-4">Here is a brief summary of three AI startups focused on productivity:</div>
                    <div className="pl-4 space-y-4 mb-4">
                        <div className=" ">
                            Airtable: This company has developed a platform that combines database functionality with the familiarity of a spreadsheet. Users can create collaborative, customizable databases to organize their work and streamline their processes. Airtable leverages machine learning and AI to power smart features such as automated workflows, predictive suggestions, and natural language processing for data search and filtering.
                        </div>
                        <div className=" space-y-2">
                            <div className="bg-semantic-bg-secondary">Clockwise: Clockwise uses AI to optimize calendars and improve time </div>
                            <div>management for teams. Its platform automatically schedules focus time for deep work, while also ensuring that important meetings are prioritized.</div>
                            <div>
                                <span className="bg-semantic-bg-secondary">Clockwise's AI-powered features include smart calendar assistance,</span> which
                            </div>
                            <div>suggests optimal meeting times and durations, and time-blocking capabilities that help users allocate their time efficiently.</div>
                        </div>
                        <div className="">
                            Otter.ai: Otter.ai offers an AI-powered assistant that generates rich transcripts from voice conversations, such as meetings and interviews. Its speech recognition technology can distinguish between multiple speakers and convert speech to text in real time. Otter.ai's productivity benefits include efficient meeting note-taking, improved accessibility, and the ability to quickly search and share voice conversations via text.
                        </div>
                    </div>
                    <div className="">
                        These startups demonstrate how AI is being leveraged to enhance productivity by automating mundane tasks, optimizing workflows, and improving information management and accessibility.
                    </div>
                </div>
            </ScrollArea.Root>
        </div>
    </div>
);

export const mockSnippets = [
    {
        id: "citation-01",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac justo vitae sem ultricies consectetur. Import your own text data or write in real-time via Webhook to enhance your LLM context. Effortlessly build a comprehensive knowledge base.",
        fileName: "file1.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
    {
        id: "citation-02",
        content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
        sectionTitle: "Section Title",
    },
];
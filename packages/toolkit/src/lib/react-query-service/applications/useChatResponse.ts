import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const mockMessages = [
  {
    id: 1,
    content:
      "I'm interested in learning more about AI startups focused on productivity. Give me a summary of the top 3.",
    ownerID: "user123",
  },
  {
    id: 2,
    content:
      "Here is a brief summary of three AI startups focused on productivity:\n\nAirtable: This company has developed a platform that combines database functionality with the familiarity of a spreadsheet. Users can create collaborative, customizable databases to organize their work and streamline their processes. Airtable leverages machine learning and AI to power smart features such as automated workflows, predictive suggestions, and natural language processing for data search and filtering.\n\nClockwise: Clockwise uses AI to optimize calendars and improve time management for teams. Its platform automatically schedules focus time for deep work, while also ensuring that important meetings are prioritized. Clockwise's AI-powered features include smart calendar assistance, which suggests optimal meeting times and durations, and time-blocking capabilities that help users allocate their time efficiently.\n\nOtter.ai: Otter.ai offers an AI-powered assistant that generates rich transcripts from voice conversations, such as meetings and interviews. Its speech recognition technology can distinguish between multiple speakers and convert speech to text in real time. Otter.ai's productivity benefits include efficient meeting note-taking, improved accessibility, and the ability to quickly search and share voice conversations via text.",
    ownerID: "assistant",
  },
];

const mockCitations = [
  {
    id: "citation-01",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac justo vitae sem ultricies consectetur. Import your own text data or write in real-time via Webhook to enhance your LLM context. Effortlessly build a comprehensive knowledge base.",
    fileName: "file1.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
  {
    id: "citation-02",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    fileName: "file2.pdf",
    sectionTitle: "Section Title",
  },
];

export const useMockMessages = () => {
  return useQuery({
    queryKey: ["mockMessages"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockMessages;
    },
  });
};

export const useMockCitations = () => {
  return useQuery({
    queryKey: ["mockCitations"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockCitations;
    },
  });
};

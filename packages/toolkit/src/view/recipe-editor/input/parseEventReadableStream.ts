import {
  GeneralRecord,
  TriggerNamespacePipelineStreamEvent,
  TriggerNamespacePipelineStreamEventType,
} from "instill-sdk";
import { Nullable } from "vitest";

export function parseEventReadableStream(chunk: Uint8Array | string) {
  const text =
    typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk);
  const eventStrings = text.split("\n\n").filter((str) => str.trim() !== "");

  const events: TriggerNamespacePipelineStreamEvent[] = [];

  for (const eventString of eventStrings) {
    const lines = eventString.split("\n");
    let eventType: Nullable<TriggerNamespacePipelineStreamEventType> = null;
    let data = "";
    let parsedData: Nullable<GeneralRecord> = null;

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventType = line
          .slice(6)
          .trim() as TriggerNamespacePipelineStreamEventType;
      } else if (line.startsWith("data:")) {
        data = line.slice(5).trim();
      }
    }

    // Parse the data as JSON if possible
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      console.error(e);
    }

    if (eventType && parsedData) {
      events.push({
        event: eventType,
        data: parsedData,
      } as TriggerNamespacePipelineStreamEvent);
    }
  }

  return events;
}

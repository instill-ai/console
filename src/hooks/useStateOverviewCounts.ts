import {
  Destination,
  DestinationWithPipelines,
  ModelInstance,
  ModelWithInstance,
  Pipeline,
  Source,
  SourceWithPipelines,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useEffect, useState } from "react";

type Item =
  | Pipeline
  | Source
  | Destination
  | ModelInstance
  | DestinationWithPipelines
  | SourceWithPipelines
  | ModelWithInstance;

export type StateOverviewCounts = {
  online: number;
  offline: number;
  error: number;
};

export const useStateOverviewCounts = (items: Item[] | null) => {
  const [stateOverviewCount, setStateOverviewCount] =
    useState<Nullable<StateOverviewCounts>>(null);

  useEffect(() => {
    if (!items || !items[0]) return;

    const counts: StateOverviewCounts = {
      online: 0,
      offline: 0,
      error: 0,
    };

    const itemNameList = items[0].name.split("/");

    if (itemNameList[0] === "pipelines") {
      for (const item of items as Pipeline[]) {
        if (item.state === "STATE_ACTIVE") {
          counts.online += 1;
        } else if (
          item.state === "STATE_INACTIVE" ||
          item.state === "STATE_UNSPECIFIED"
        ) {
          counts.offline += 1;
        } else {
          counts.error += 1;
        }
      }
      setStateOverviewCount(counts);
      return;
    }

    if (itemNameList[0] === "source-connectors") {
      for (const item of items as Source[]) {
        if (item.connector.state === "STATE_CONNECTED") {
          counts.online += 1;
        } else if (item.connector.state === "STATE_DISCONNECTED") {
          counts.offline += 1;
        } else {
          counts.error += 1;
        }
      }
      setStateOverviewCount(counts);
      return;
    }

    if (itemNameList[0] === "destination-connectors") {
      for (const item of items as Destination[]) {
        if (item.connector.state === "STATE_CONNECTED") {
          counts.online += 1;
        } else if (item.connector.state === "STATE_DISCONNECTED") {
          counts.offline += 1;
        } else {
          counts.error += 1;
        }
      }
      setStateOverviewCount(counts);
      return;
    }

    if (itemNameList[0] === "model" && itemNameList[2] !== "instances") {
      for (const item of items as ModelWithInstance[]) {
        if (item.state === "STATE_ONLINE") {
          counts.online += 1;
        } else if (item.state === "STATE_OFFLINE") {
          counts.offline += 1;
        } else {
          counts.error += 1;
        }
      }
    }

    for (const item of items as ModelInstance[]) {
      if (item.state === "STATE_ONLINE") {
        counts.online += 1;
      } else if (item.state === "STATE_OFFLINE") {
        counts.offline += 1;
      } else {
        counts.error += 1;
      }
    }

    setStateOverviewCount(counts);
  }, [items]);

  return stateOverviewCount;
};

const isPipeline = (item: Item): item is Pipeline => {
  const itemNameList = item.name.split("/");

  if (itemNameList[0] === "pipelines") {
    return true;
  } else {
    return false;
  }
};

const isSource = (item: Item): item is Source => {
  const itemNameList = item.name.split("/");

  if (itemNameList[0] === "source-connectors") {
    return true;
  } else {
    return false;
  }
};

const isDestination = (item: Item): item is Destination => {
  const itemNameList = item.name.split("/");

  if (itemNameList[0] === "destination-connectors") {
    return true;
  } else {
    return false;
  }
};

const isModelInstance = (item: Item): item is ModelInstance => {
  const itemNameList = item.name.split("/");

  if (itemNameList[2] === "instances") {
    return true;
  } else {
    return false;
  }
};

const isModel = (item: Item): item is ModelWithInstance => {
  const itemNameList = item.name.split("/");

  if (itemNameList[0] === "model" && itemNameList[2] !== "instances") {
    return true;
  } else {
    return false;
  }
};

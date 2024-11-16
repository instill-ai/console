import { Nullable } from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import { getReferencesFromString } from "../..";
import { ImageWithFallback } from "../../../components";

export type listenWithType = {
  reference: string;
  type: string;
};

export const EventField = ({
  title,
  key,
  listensWithType,
}: {
  title: Nullable<string>;
  key: string;
  listensWithType: listenWithType[];
}) => {
  return (
    <div key={key} className="flex flex-col gap-y-2.5">
      <p className="max-w-[120px] line-clamp-1 font-sans text-sm font-semibold text-semantic-fg-primary">
        {title}
      </p>
      {listensWithType.map((listenItem) => {
        const displayValue = getReferencesFromString(
          listenItem.reference,
        )[0]?.referenceValue.withoutCurlyBraces.replace("on.", "");

        return (
          <div
            className="flex rounded"
            key={`${key}-${listenItem}`}
            style={{ backgroundColor: "#CBD2E1" }}
          >
            <div className="flex flex-row gap-x-1 h-6 items-center mx-auto">
              <ImageWithFallback
                src={`/icons/${listenItem.type}.svg`}
                width={16}
                height={16}
                alt={`${listenItem.type}-icon`}
                fallbackImg={
                  <Icons.Box className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                }
              />
              <p
                className="font-sans font-normal text-xs"
                style={{ color: "#3D4047" }}
              >
                {displayValue}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

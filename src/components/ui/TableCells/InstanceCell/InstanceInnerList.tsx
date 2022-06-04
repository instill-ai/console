import { FC, useEffect, useState } from "react";
import cn from "clsx";

import { getTextWidth } from "../../../../utils";
import { Instance } from "./InstanceCell";
import InstanceInnerListItem, {
  InstanceInnerListItemProps,
} from "./InstanceInnerListItem";

export type InstanceInnerListProps = {
  listItemsContainerWidth: number;
  enableItemBgColor: InstanceInnerListItemProps["enableItemBgColor"];
  indicator: InstanceInnerListItemProps["indicator"];
  textStyle: InstanceInnerListItemProps["textStyle"];
  items: Instance[];
};

const InstanceInnerList: FC<InstanceInnerListProps> = ({
  listItemsContainerWidth,
  items,
  enableItemBgColor,
  indicator,
  textStyle,
}) => {
  const remainItemsIndicatorWidth = 26;

  const [displayLimit, setDisplayLimit] = useState(0);
  const [isExpand, setIsExpand] = useState(false);

  useEffect(() => {
    if (!items) return;

    let itemsAccumulatedWidth = 0;
    let limit = 0;

    for (const item of items) {
      const textWidth = getTextWidth(item.name, "normal 14px sans");
      if (!textWidth) {
        continue;
      }

      const paddingX = 5;
      const stateIndicatorWidth = 12;
      const gapBetweenTextAndIndicator = 5;
      const gapBetweenItem = 5;

      const listItemComponentWidth =
        textWidth +
        paddingX * 2 +
        stateIndicatorWidth +
        gapBetweenTextAndIndicator +
        gapBetweenItem;

      if (
        itemsAccumulatedWidth + listItemComponentWidth >
        listItemsContainerWidth - remainItemsIndicatorWidth
      ) {
        break;
      } else {
        limit += 1;
        itemsAccumulatedWidth += listItemComponentWidth;
      }
    }

    setDisplayLimit(limit);
  }, [items, listItemsContainerWidth]);

  const handleExpand = () => {
    setIsExpand(true);
    setDisplayLimit(items.length);
  };

  return (
    <div className="flex flex-row gap-x-[5px]">
      <div className="flex flex-wrap gap-x-[5px] gap-y-[5px]">
        {items.map((e, index) => {
          if (displayLimit === 0 && index === 0) {
            return (
              <InstanceInnerListItem
                enableItemBgColor={enableItemBgColor}
                indicator={indicator}
                textStyle={textStyle}
                key={e.name}
                item={e}
              />
            );
          }

          if (index >= displayLimit) {
            return null;
          }

          return (
            <InstanceInnerListItem
              enableItemBgColor={enableItemBgColor}
              indicator={indicator}
              textStyle={textStyle}
              key={e.name}
              item={e}
            />
          );
        })}
      </div>
      {items.length === 1 ? null : (
        <div
          onClick={() => handleExpand()}
          className={cn(
            "flex cursor-pointer bg-instillGrey05 px-[5px] py-0.5",
            isExpand
              ? "hidden"
              : items.length - displayLimit === 0
              ? "hidden"
              : ""
          )}
        >
          <p className="instill-text-small my-auto text-instillGrey70">{`+ ${
            items.length - displayLimit
          }`}</p>
        </div>
      )}
    </div>
  );
};

export default InstanceInnerList;

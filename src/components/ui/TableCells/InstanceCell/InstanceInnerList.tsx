import { FC, useEffect, useState } from "react";
import { getTextWidth } from "../../../../utils";
import { Instance } from "./InstanceCell";
import InstanceInnerListItem from "./InstanceInnerListItem";
import cn from "clsx";

export type InstanceInnerListProps = {
  listItemsContainerWidth: number;
  items: Instance[];
};

const InstanceInnerList: FC<InstanceInnerListProps> = ({
  listItemsContainerWidth,
  items,
}) => {
  const remainItemsIndicatorWidth = 26;

  const [displayLimit, setDisplayLimit] = useState(0);
  const [isExpand, setIsExpand] = useState(false);

  useEffect(() => {
    let itemsAccumulatedWidth = 0;
    let limit = 0;

    for (const item of items) {
      const textWidth = getTextWidth(item.name, "normal 12px mono");
      if (!textWidth) {
        continue;
      }

      const paddingX = 5;
      const statusIndicatorWidth = 12;
      const gapBetweenTextAndIndicator = 5;
      const gapBetweenItem = 5;

      const listItemComponentWidth =
        textWidth +
        paddingX * 2 +
        statusIndicatorWidth +
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
  }, []);

  const handleExpand = () => {
    setIsExpand(true);
    setDisplayLimit(items.length - 1);
  };

  return (
    <div className="flex flex-row gap-x-[5px]">
      <div
        className="flex flex-wrap gap-x-[5px] gap-y-[5px]"
        style={{ width: isExpand ? `${listItemsContainerWidth}px` : "" }}
      >
        {items.map((e, index) => {
          if (displayLimit === 0 && index === 0) {
            return <InstanceInnerListItem key={e.name} item={e} />;
          }

          if (index > displayLimit || index === displayLimit) {
            return null;
          }

          return <InstanceInnerListItem key={e.name} item={e} />;
        })}
      </div>
      <div
        onClick={() => handleExpand()}
        className={cn(
          "flex cursor-pointer bg-instillGrey05 px-[5px] py-0.5",
          isExpand ? "hidden" : ""
        )}
      >
        <p className="instill-text-small my-auto text-instillGrey70">{`+ ${
          items.length - displayLimit
        }`}</p>
      </div>
    </div>
  );
};

export default InstanceInnerList;

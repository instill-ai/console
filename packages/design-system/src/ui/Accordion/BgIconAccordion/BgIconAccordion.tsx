import { MinusIcon, PlusIcon } from "../../Icons";
import AccordionBase, { AccordionBaseProps } from "../AccordionBase";

type BgIconAccordionRequiredKeys =
  | "enableHeaderIcon"
  | "items"
  | "bgIconPosition"
  | "activeIndex"
  | "setActiveIndex"
  | "allowMultiItems";

type BgIconAccordionOmitKeys =
  | "type"
  | "headerFont"
  | "headerFontWeight"
  | "headerTextSize"
  | "headerPadding"
  | "headerActiveIcon"
  | "headerInActiveIcon";

type BgIconAccordionConfig = Pick<AccordionBaseProps, BgIconAccordionOmitKeys>;

type FullBgIconAccordionProps = Omit<
  AccordionBaseProps,
  BgIconAccordionOmitKeys
>;

type BgIconAccordionRequiredProps = Pick<
  FullBgIconAccordionProps,
  BgIconAccordionRequiredKeys
>;

type BgIconAccordionOptionalProps = Partial<
  Omit<FullBgIconAccordionProps, BgIconAccordionRequiredKeys>
>;

export type BgIconAccordionProps = BgIconAccordionRequiredProps &
  BgIconAccordionOptionalProps & {
    headerIconColor?: string;
  };

const BgIconAccordion = (props: BgIconAccordionProps) => {
  const {
    items,
    itemGapY,
    activeIndex,
    setActiveIndex,
    enableHeaderIcon,
    bgIconPosition,
    headerIconColor,
    allowMultiItems,
    width,
  } = props;

  const headerIconStyle = {
    width: "w-[30px]",
    height: "h-[30px]",
    color: headerIconColor ?? "fill-white",
    position: "my-auto",
  };

  const config: BgIconAccordionConfig = {
    type: "withIcon",
    headerFont: "font-sans",
    headerFontWeight: "font-medium",
    headerTextSize: "text-2xl",
    headerPadding: "p-5",
    headerActiveIcon: <MinusIcon {...headerIconStyle} />,
    headerInActiveIcon: <PlusIcon {...headerIconStyle} />,
  };

  return (
    <AccordionBase
      items={items}
      width={width ?? "w-full"}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      enableHeaderIcon={enableHeaderIcon}
      bgIconPosition={bgIconPosition}
      itemGapY={itemGapY ?? null}
      allowMultiItems={allowMultiItems}
      {...config}
    />
  );
};

export default BgIconAccordion;

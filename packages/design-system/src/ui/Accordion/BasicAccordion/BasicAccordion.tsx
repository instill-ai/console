import { MinusIcon, PlusIcon } from "../../Icons";
import AccordionBase, { AccordionBaseProps } from "../AccordionBase";

type BasicAccordionRequiredKeys =
  | "enableHeaderIcon"
  | "items"
  | "activeIndex"
  | "setActiveIndex"
  | "allowMultiItems";

type BasicAccordionOmitKeys =
  | "type"
  | "headerFont"
  | "headerFontWeight"
  | "headerTextSize"
  | "headerPadding"
  | "headerActiveIcon"
  | "headerInActiveIcon"
  | "bgIconPosition";

type BasicAccordionConfig = Pick<AccordionBaseProps, BasicAccordionOmitKeys>;

type FullBasicAccordionProps = Omit<AccordionBaseProps, BasicAccordionOmitKeys>;

type BasicAccordionRequiredProps = Pick<
  FullBasicAccordionProps,
  BasicAccordionRequiredKeys
>;

type BasicAccordionOptionalProps = Partial<
  Omit<FullBasicAccordionProps, BasicAccordionRequiredKeys>
>;

export type BasicAccordionProps = BasicAccordionRequiredProps &
  BasicAccordionOptionalProps & {
    headerIconColor?: string;
  };

const BasicAccordion = (props: BasicAccordionProps) => {
  const {
    items,
    width,
    itemGapY,
    activeIndex,
    setActiveIndex,
    enableHeaderIcon,
    headerIconColor,
    allowMultiItems,
  } = props;

  const headerIconStyle = {
    width: "w-[30px]",
    height: "h-[30px]",
    color: headerIconColor ?? "fill-white",
    position: "my-auto",
  };

  const config: BasicAccordionConfig = {
    type: "basic",
    headerFont: "font-sans",
    headerFontWeight: "font-medium",
    headerTextSize: "text-2xl",
    headerPadding: "p-5",
    headerActiveIcon: <MinusIcon {...headerIconStyle} />,
    headerInActiveIcon: <PlusIcon {...headerIconStyle} />,
    bgIconPosition: null,
  };

  return (
    <AccordionBase
      items={items}
      width={width ?? "w-full"}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      itemGapY={itemGapY ?? null}
      enableHeaderIcon={enableHeaderIcon}
      allowMultiItems={allowMultiItems}
      {...config}
    />
  );
};

export default BasicAccordion;

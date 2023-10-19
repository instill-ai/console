export type ModelLogoProps = {
  variant: "square" | "expand";
  className?: string;
  width: number;
};

export const ModelLogo = (props: ModelLogoProps) => {
  const { variant, width, className } = props;

  switch (variant) {
    case "square": {
      return (
        <svg
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: `${width}px` }}
          className={className}
        >
          <path
            d="M19.9704 13.2625H13.2754V46.7375H19.9704V26.7481H26.6654V20.0531H19.9704V13.2625ZM40.0554 20.0531H33.3604V26.7481H40.0554V46.7375H46.7505V13.2625H40.0554V20.0531ZM33.3604 33.4431V26.7481H26.6654V33.4431H33.3604Z"
            fill="#F6F6F6"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.2329 10V16.7907H29.9279V23.4857H30.098V16.7907H36.793V10H50.0129V50H36.793V30.0106H36.6229V36.7056H23.403V30.0106H23.2329V50H10.0129V10H23.2329ZM19.9704 13.2625V20.0531H26.6654V26.7481H19.9704V46.7375H13.2754V13.2625H19.9704ZM26.6654 26.7481V33.4431H33.3604V26.7481H40.0554V46.7375H46.7505V13.2625H40.0554V20.0531H33.3604V26.7481H26.6654Z"
            fill="#2B2B2B"
          />
          <path
            d="M13.2496 13.2625H20.1859V26.7995H13.2496V13.2625Z"
            fill="#FFDF3A"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.98709 10H23.4483V30.062H9.98709V10ZM13.2496 13.2625V26.7995H20.1859V13.2625H13.2496Z"
            fill="#2B2B2B"
          />
          <path
            d="M19.9621 19.9751H26.6747V26.7995H19.9621V19.9751Z"
            fill="#FFDF3A"
          />
          <path
            d="M46.7508 46.7993H40.0559L40.0559 26.7471H46.7508V46.7993Z"
            fill="#40A8F5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M46.7508 30.0095V26.7471H40.0559L40.0559 30.0095H46.7508Z"
            fill="#2B2B2B"
          />
          <path
            d="M26.6573 26.7373H33.3613V33.4413H26.6573V26.7373Z"
            fill="#28F67E"
          />
        </svg>
      );
    }
    default: {
      return (
        <svg
          viewBox="0 0 71 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: `${width}px` }}
          className={className}
        >
          <path
            d="M55.0182 2.74929H50.5729V24.8183H68.2281V20.373H55.0182V2.74929Z"
            fill="#F6F6F6"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M57.1632 0.604324V18.228H70.373V26.9633H48.4279V0.604324H57.1632ZM68.2281 20.373V24.8183H50.5729V2.74929H55.0182V20.373H68.2281Z"
            fill="#2B2B2B"
          />
          <path
            d="M50.5729 2.74929H55.0662V7.16898H50.5729V2.74929Z"
            fill="#40A8F5"
          />
          <path
            d="M50.5729 7.16898H55.0662L55.0662 11.5887H50.5729L50.5729 7.16898Z"
            fill="#40A8F5"
          />
          <path
            d="M50.5729 11.5887H55.0662V16.0083H50.5729V11.5887Z"
            fill="#40A8F5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M50.5729 14.9359H55.0662V17.0808H50.5729V14.9359Z"
            fill="#2B2B2B"
          />
          <path
            d="M44.0141 7.19983V2.78603H26.3589V24.855H44.0141V20.4412H30.7727V7.19983H44.0141ZM44.0141 20.4412H48.4279V7.19983H44.0141V20.4412Z"
            fill="#F6F6F6"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M46.1591 0.641069V5.05487H50.5729V22.5862H46.1591V27H24.214V0.641069H46.1591ZM44.0141 20.4412V24.855H26.3589V2.78603H44.0141V7.19983H30.7727V20.4412H44.0141ZM32.9177 18.2963H41.8692V9.3448H32.9177V18.2963ZM44.0141 7.19983V20.4412H48.4279V7.19983H44.0141Z"
            fill="#2B2B2B"
          />
          <path
            d="M26.3589 20.4648H30.7786V24.8845H26.3589V20.4648Z"
            fill="#FFDF3A"
          />
          <path
            d="M30.7295 20.3911H35.1492V24.8845H30.7295V20.3911Z"
            fill="#FFDF3A"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M34.0767 24.8845V20.3911H36.2217V24.8845H34.0767Z"
            fill="#2B2B2B"
          />
          <path
            d="M30.7786 20.4648H26.3589L26.3589 16.0451H30.7786L30.7786 20.4648Z"
            fill="#FFDF3A"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.7786 17.1176H26.3589V14.9726H30.7786V17.1176Z"
            fill="#2B2B2B"
          />
          <path
            d="M6.55876 2.78599H2.14496V24.855H6.55876V11.6766H10.9726V7.26284H6.55876V2.78599ZM19.8002 7.26284H15.3864V11.6766H19.8002V24.855H24.214V2.78599H19.8002V7.26284ZM15.3864 16.0904V11.6766H10.9726V16.0904H15.3864Z"
            fill="#F6F6F6"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.70372 0.641023V5.11788H13.1175V9.53168H13.2414V5.11788H17.6552V0.641023H26.3589V27H17.6552V13.8216H17.5313V18.2354H8.8276V13.8216H8.70372V27H0V0.641023H8.70372ZM6.55876 2.78599V7.26284H10.9726V11.6766H6.55876V24.855H2.14496V2.78599H6.55876ZM10.9726 11.6766V16.0904H15.3864V11.6766H19.8002V24.855H24.214V2.78599H19.8002V7.26284H15.3864V11.6766H10.9726Z"
            fill="#2B2B2B"
          />
          <path
            d="M10.9672 11.6696H15.3868V16.0893H10.9672V11.6696Z"
            fill="#28F67E"
          />
        </svg>
      );
    }
  }
};

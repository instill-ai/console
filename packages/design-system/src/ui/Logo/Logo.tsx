import * as React from "react";
import cn from "clsx";

export type LogoColorVariant =
  | "responsiveColourLogomarkWhiteType"
  | "ColourLogomarkWhiteType"
  | "responsiveColourLogomarkBlackType"
  | "ColourLogomarkBlackType"
  | "responsiveWhiteLogomarkWhiteType"
  | "whiteLogomarkWhiteType"
  | "responsiveBlackLogomarkBlackType"
  | "blackLogomarkBlackType"
  | "whiteLogomark"
  | "blueLogomark"
  | "colourLogomark"
  | "blackLogomark";

export type LogoProps = {
  className?: string;
  variant: LogoColorVariant;
  width: number;
};

export const Logo = (props: LogoProps) => {
  const { className, variant, width } = props;

  let logo: React.ReactNode;

  const getWhiteLogomarkWhiteType = (
    width: number,
    className?: string
  ): React.ReactElement => {
    return (
      <svg
        viewBox="0 0 400 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: `${width}px` }}
        data-testid="white-logomark-white-type"
      >
        <path
          d="M77.4185 0H0V87.9804H83.8535V0H77.4185ZM6.44997 6.76741H12.9037V27.0736H6.44997V6.76741ZM6.44997 33.8449H12.9037V54.0765H6.44997V33.8449ZM25.8074 81.2287H6.44997V60.8478H12.9037V60.9225H19.3537V60.8478H25.8074V81.2287ZM25.8074 54.0765H19.3537V33.8449H25.8074V54.0765ZM25.8074 27.0736H19.3537V6.76741H25.7625V13.5898H25.8074V27.0736ZM32.2574 33.8449H38.7111V54.0765H32.2574V33.8449ZM32.2574 60.8478H38.7111V67.5249H32.2574V60.8478ZM51.5362 74.4691H38.786V67.6506H45.1499V60.8478H51.5138L51.5362 74.4691ZM51.5362 54.0883H45.1723V33.8449H51.5362V54.0883ZM51.5362 20.2708H45.1723V27.0854H32.2574V13.5898H38.6699V20.2669H45.1237V13.4681H38.7074V6.76741H51.5362V20.2708ZM64.4998 81.2287H57.9899V60.8478H64.4998V81.2287ZM77.4035 81.2287H70.9685V60.8478H77.4185L77.4035 81.2287ZM77.4035 54.0765H57.975V33.8449H77.4035V54.0765ZM77.4035 27.0736H57.975V20.3062H77.4035V27.0736ZM77.4035 13.5388H57.975V6.76741H77.4035V13.5388Z"
          fill="#F7F7F7"
        />
        <path
          d="M348.385 54.1514H341.936V60.9188H348.385V54.1514Z"
          fill="#F7F7F7"
        />
        <path
          d="M374.012 27.0929V27.0771H361.288V33.8446H367.742V47.3833H354.838V40.6159H361.288V33.8446H354.838V40.6159H348.385V54.1508H351.245H354.838H367.742V60.9221H374.192V27.0929H374.012Z"
          fill="#F7F7F7"
        />
        <path
          d="M400 33.8446V27.0771H380.643V33.8446H387.096V54.1508H380.643V60.9221H400V54.1508H393.546V33.8446H400Z"
          fill="#F7F7F7"
        />
        <path
          d="M187.098 40.6159V33.8446H206.452V27.0771H187.098H180.645V47.3833H187.098H206.452V54.1507H212.902V40.6159H206.452H187.098Z"
          fill="#F7F7F7"
        />
        <path
          d="M206.291 54.1514H180.645V60.9188H206.291V54.1514Z"
          fill="#F7F7F7"
        />
        <path
          d="M116.13 33.8446H122.58V54.1508H116.13V60.9221H135.484V54.1508H129.034V33.8446H135.484V27.0771H116.13V33.8446Z"
          fill="#F7F7F7"
        />
        <path
          d="M212.901 33.8446H225.805V60.9221H232.255V33.8446H245.312V27.0771H212.901V33.8446Z"
          fill="#F7F7F7"
        />
        <path
          d="M251.688 33.8446H258.1V54.1508H251.688V60.9221H270.966V54.1508H264.554V33.8446H270.966V27.0771H251.688V33.8446Z"
          fill="#F7F7F7"
        />
        <path
          d="M283.87 27.0771H277.42V54.1508V60.7571V60.9221H296.774V54.1508H283.87V27.0771Z"
          fill="#F7F7F7"
        />
        <path
          d="M309.677 27.0771H303.224V54.1508V60.7571V60.9221H322.581V54.1508H309.677V27.0771Z"
          fill="#F7F7F7"
        />
        <path
          d="M148.387 33.8446V27.0771H141.934V33.8446V40.6159V60.9221H148.387V40.6159H154.837V33.8446H148.387Z"
          fill="#F7F7F7"
        />
        <path
          d="M161.287 40.6162H154.837V47.3836H161.287V40.6162Z"
          fill="#F7F7F7"
        />
        <path
          d="M167.741 47.3833H161.291V54.1508H167.741V60.9221H174.195V54.1508V47.3833V27.0771H167.741V47.3833Z"
          fill="#F7F7F7"
        />
      </svg>
    );
  };

  const getBlackLogomarkBlackType = (
    width: number,
    className?: string
  ): React.ReactElement => {
    return (
      <svg
        viewBox="0 0 195 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: `${width}px` }}
        data-testid="black-logomark-black-type"
      >
        <g clipPath="url(#clip0_2_8133)">
          <path
            d="M38.048 0H0.5V41.9906H41.1689V0H38.048ZM3.62824 3.2299H6.75829V12.9215H3.62824V3.2299ZM3.62824 16.1533H6.75829V25.8092H3.62824V16.1533ZM13.0166 38.7682H3.62824V29.041H6.75829V29.0766H9.88654V29.041H13.0166V38.7682ZM13.0166 25.8092H9.88654V16.1533H13.0166V25.8092ZM13.0166 12.9215H9.88654V3.2299H12.9948V6.48605H13.0166V12.9215ZM16.1448 16.1533H19.2749V25.8092H16.1448V16.1533ZM16.1448 29.041H19.2749V32.2278H16.1448V29.041ZM25.4951 35.5421H19.3112V32.2878H22.3977V29.041H25.4842L25.4951 35.5421ZM25.4951 25.8149H22.4086V16.1533H25.4951V25.8149ZM25.4951 9.67471H22.4086V12.9271H16.1448V6.48605H19.2549V9.67284H22.385V6.42794H19.2731V3.2299H25.4951V9.67471ZM31.7824 38.7682H28.6251V29.041H31.7824V38.7682ZM38.0407 38.7682H34.9197V29.041H38.048L38.0407 38.7682ZM38.0407 25.8092H28.6179V16.1533H38.0407V25.8092ZM38.0407 12.9215H28.6179V9.69158H38.0407V12.9215ZM38.0407 6.46168H28.6179V3.2299H38.0407V6.46168Z"
            fill="#1A1A1A"
          />
          <path
            d="M169.467 25.8447H166.339V29.0746H169.467V25.8447Z"
            fill="#1A1A1A"
          />
          <path
            d="M181.896 12.9313V12.9238H175.725V16.1537H178.855V22.6154H172.597V19.3855H175.725V16.1537H172.597V19.3855H169.467V25.8453H170.854H172.597H178.855V29.0771H181.983V12.9313H181.896Z"
            fill="#1A1A1A"
          />
          <path
            d="M194.5 16.1537V12.9238H185.111V16.1537H188.241V25.8453H185.111V29.0771H194.5V25.8453H191.37V16.1537H194.5Z"
            fill="#1A1A1A"
          />
          <path
            d="M91.2424 19.3855V16.1537H100.629V12.9238H91.2424H88.1123V22.6154H91.2424H100.629V25.8453H103.757V19.3855H100.629H91.2424Z"
            fill="#1A1A1A"
          />
          <path
            d="M100.551 25.8447H88.1123V29.0746H100.551V25.8447Z"
            fill="#1A1A1A"
          />
          <path
            d="M56.8232 16.1537H59.9515V25.8453H56.8232V29.0771H66.2098V25.8453H63.0816V16.1537H66.2098V12.9238H56.8232V16.1537Z"
            fill="#1A1A1A"
          />
          <path
            d="M103.758 16.1537H110.016V29.0771H113.144V16.1537H119.477V12.9238H103.758V16.1537Z"
            fill="#1A1A1A"
          />
          <path
            d="M122.568 16.1537H125.678V25.8453H122.568V29.0771H131.919V25.8453H128.808V16.1537H131.919V12.9238H122.568V16.1537Z"
            fill="#1A1A1A"
          />
          <path
            d="M138.177 12.9238H135.049V25.8453V28.9984V29.0771H144.435V25.8453H138.177V12.9238Z"
            fill="#1A1A1A"
          />
          <path
            d="M150.694 12.9238H147.563V25.8453V28.9984V29.0771H156.952V25.8453H150.694V12.9238Z"
            fill="#1A1A1A"
          />
          <path
            d="M72.468 16.1537V12.9238H69.3379V16.1537V19.3855V29.0771H72.468V19.3855H75.5962V16.1537H72.468Z"
            fill="#1A1A1A"
          />
          <path
            d="M78.724 19.3848H75.5957V22.6147H78.724V19.3848Z"
            fill="#1A1A1A"
          />
          <path
            d="M81.8538 22.6154H78.7256V25.8453H81.8538V29.0771H84.9839V25.8453V22.6154V12.9238H81.8538V22.6154Z"
            fill="#1A1A1A"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_8133">
            <rect
              width="194"
              height="42"
              fill="white"
              transform="translate(0.5)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const getWhiteLogomark = (
    width: number,
    className?: string
  ): React.ReactElement => {
    return (
      <svg
        viewBox="0 0 33 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${width}px` }}
        className={className}
        data-testid="white-logomark"
      >
        <path
          d="M30.4675 0H0V33H33V0H30.4675ZM2.53835 2.53835H5.07817V10.1549H2.53835V2.53835ZM2.53835 12.6947H5.07817V20.2832H2.53835V12.6947ZM10.1563 30.4675H2.53835V22.823H5.07817V22.851H7.61652V22.823H10.1563V30.4675ZM10.1563 20.2832H7.61652V12.6947H10.1563V20.2832ZM10.1563 10.1549H7.61652V2.53835H10.1387V5.09732H10.1563V10.1549ZM12.6947 12.6947H15.2345V20.2832H12.6947V12.6947ZM12.6947 22.823H15.2345V25.3275H12.6947V22.823ZM20.2817 27.9321H15.264V25.3746H17.7684V22.823H20.2729L20.2817 27.9321ZM20.2817 20.2876H17.7773V12.6947H20.2817V20.2876ZM20.2817 7.60326H17.7773V10.1593H12.6947V5.09732H15.2183V7.60178H17.7581V5.05165H15.233V2.53835H20.2817V7.60326ZM25.3835 30.4675H22.8216V22.823H25.3835V30.4675ZM30.4616 30.4675H27.9292V22.823H30.4675L30.4616 30.4675ZM30.4616 20.2832H22.8157V12.6947H30.4616V20.2832ZM30.4616 10.1549H22.8157V7.61651H30.4616V10.1549ZM30.4616 5.07817H22.8157V2.53835H30.4616V5.07817Z"
          fill="#F7F7F7"
        />
      </svg>
    );
  };

  const getBlackLogomark = (
    width: number,
    className?: string
  ): React.ReactElement => {
    return (
      <svg
        viewBox="0 0 225 225"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${width}px` }}
        className={className}
        data-testid="black-logomark"
      >
        <g>
          <path
            d="M206.81 0H0V224H224.08V0H206.81ZM17.24 17.24H34.47V68.94H17.24V17.24ZM17.24 86.17H34.47V137.68H17.24V86.17ZM68.94 206.81H17.24V154.92H34.47V155.11H51.7V154.92H68.94V206.81ZM68.94 137.68H51.7V86.17H68.94V137.68ZM68.94 68.94H51.7V17.24H68.82V34.59H68.94V68.94ZM86.17 86.17H103.41V137.68H86.17V86.17ZM86.17 154.92H103.41V171.92H86.17V154.92ZM137.68 189.58H103.61V172.3H120.61V154.92H137.61L137.68 189.58ZM137.68 137.68H120.68V86.17H137.68V137.68ZM137.68 51.59H120.68V68.94H86.17V34.59H103.31V51.59H120.54V34.3H103.41V17.3H137.68V51.59ZM172.35 206.81H154.91V154.92H172.35V206.81ZM206.81 206.81H189.58V154.92H206.81V206.81ZM206.81 137.68H154.91V86.17H206.81V137.68ZM206.81 68.94H154.91V51.7H206.81V68.94ZM206.81 34.47H154.91V17.24H206.81V34.47Z"
            fill="#1A1A1A"
          />
        </g>
      </svg>
    );
  };

  const getBlueLogomark = (
    width: number,
    className?: string
  ): React.ReactElement => {
    return (
      <svg
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${width}px` }}
        className={className}
        data-testid="blue-logomark"
      >
        <g clipPath="url(#clip0_2_3148)">
          <path
            d="M29 26.769V28.999H0V0H29V26.769ZM26.769 26.769V20.0525H24.538V26.769H26.769ZM26.769 17.8215V11.154H20.0505V17.8215H26.769ZM26.769 8.923V6.69199H20.0505V8.923H26.769ZM26.769 4.46099V2.231H20.0505V4.46099H26.769ZM22.307 26.769V20.0525H20.0505V26.769H22.307ZM17.8185 24.538V20.0495H15.6129V22.2937H13.4105V24.538H17.8185ZM17.8185 17.8215V11.154H15.6129V17.8215H17.8185ZM17.8185 6.67771V2.231H13.3819V4.43855L13.3687 4.47731H11.156V8.923H15.617V6.67873L17.8185 6.67771ZM13.3819 22.258V20.0525H11.156V22.258H13.3819ZM13.3819 17.8215V11.154H11.156V17.8215H13.3819ZM8.92095 26.769V20.0525H2.22896V26.769H8.92095ZM8.92095 17.8215V11.154H6.68995V17.8215H8.92095ZM8.92095 8.923V4.47731H8.91178V2.23304H6.69608V8.92504L8.92095 8.923ZM4.45997 17.8215V11.154H2.22896V17.8215H4.45997ZM4.45997 8.923V2.231H2.22896V8.923H4.45997Z"
            fill="black"
          />
          <path
            d="M26.7691 20.0532H24.5381V26.7697H26.7691V20.0532Z"
            fill="#38B8FF"
          />
          <path
            d="M26.7688 11.1538H20.0503V17.8213H26.7688V11.1538Z"
            fill="#24ABFF"
          />
          <path
            d="M26.7688 6.69189H20.0503V8.9229H26.7688V6.69189Z"
            fill="#005DFF"
          />
          <path
            d="M26.7688 2.23145H20.0503V4.46245H26.7688V2.23145Z"
            fill="#26A6FF"
          />
          <path
            d="M22.3068 20.0532H20.0503V26.7697H22.3068V20.0532Z"
            fill="#005EFF"
          />
          <path
            d="M17.8206 20.0532V24.5387H13.4106V22.2954H15.6151V20.0532H17.8206Z"
            fill="#2982FF"
          />
          <path
            d="M17.8197 11.1538H15.6152V17.8213H17.8197V11.1538Z"
            fill="#0033FF"
          />
          <path
            d="M17.8208 2.23145V6.67815H15.6153H15.602V4.43899H13.3843V2.23145H17.8208Z"
            fill="#0009FF"
          />
          <path
            d="M15.6148 6.67794V8.92323H11.1538V4.47754H13.3705V6.67794H15.6015H15.6148Z"
            fill="#24ABFF"
          />
          <path
            d="M15.6016 4.43848V6.67764H13.3706V4.47724L13.3839 4.43848H15.6016Z"
            fill="black"
          />
          <path
            d="M13.3848 20.0532H11.1538V22.2587H13.3848V20.0532Z"
            fill="#006CFF"
          />
          <path
            d="M13.3848 11.1538H11.1538V17.8213H13.3848V11.1538Z"
            fill="#38B8FF"
          />
          <path
            d="M6.69195 20.0532H8.92295V26.7697H2.23096V20.0532H4.46094H6.69195Z"
            fill="#006CFF"
          />
          <path
            d="M8.9229 11.1538H6.69189V17.8213H8.9229V11.1538Z"
            fill="#0033FF"
          />
          <path
            d="M8.9229 4.47775V8.92344H6.69189V2.23145H8.9076V4.47775H8.9229Z"
            fill="#26A6FF"
          />
          <path
            d="M4.46196 11.1538H2.23096V17.8213H4.46196V11.1538Z"
            fill="#005EFF"
          />
          <path
            d="M4.46196 2.23145H2.23096V8.92344H4.46196V2.23145Z"
            fill="#005DFF"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_3148">
            <rect width="29" height="29" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const getColourLogomark = (
    width: number,
    className?: string
  ): React.ReactElement => {
    return (
      <svg
        viewBox="0 0 202 202"
        style={{ width: `${width}px` }}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="colour-logomark"
      >
        <g clipPath="url(#clip0_387_1129)">
          <path
            d="M202.007 186.532V202.078H1.52588e-05V0H202.007V186.532ZM186.467 186.532V139.73H170.92V186.532H186.467ZM186.467 124.184V77.7234H139.662V124.184H186.467ZM186.467 62.1773V46.6312H139.662V62.1773H186.467ZM186.467 31.0923V15.5461H139.662V31.0923H186.467ZM155.387 186.532V139.73H139.662V186.532H155.387ZM124.122 170.986V139.709H108.767V155.347H93.4111V170.986H124.122ZM124.122 124.184V77.7234H108.767V124.184H124.122ZM124.122 46.5317V15.5461H93.2335V30.9287L93.1411 31.1989H77.6934V62.1773H108.767V46.5388L124.122 46.5317ZM93.2335 155.099V139.73H77.6934V155.099H93.2335ZM93.2335 124.184V77.7234H77.6934V124.184H93.2335ZM62.1533 186.532V139.73H15.5401V186.532H62.1533ZM62.1533 124.184V77.7234H46.6132V124.184H62.1533ZM62.1533 62.1773V31.1989H62.0254V15.5603H46.6132V62.1916L62.1533 62.1773ZM31.0802 124.184V77.7234H15.5401V124.184H31.0802ZM31.0802 62.1773V15.5461H15.5401V62.1773H31.0802Z"
            fill="#1A1A1A"
          />
          <path
            d="M186.46 139.73H170.92V186.532H186.46V139.73Z"
            fill="#40A8F5"
          />
          <path
            d="M186.46 77.7236H139.662V124.184H186.46V77.7236Z"
            fill="#40A8F5"
          />
          <path
            d="M186.46 46.6309H139.662V62.177H186.46V46.6309Z"
            fill="#FF5353"
          />
          <path
            d="M186.46 15.5459H139.662V31.092H186.46V15.5459Z"
            fill="#FFDF3A"
          />
          <path
            d="M155.38 139.73H139.662V186.532H155.38V139.73Z"
            fill="#FFDF3A"
          />
          <path
            d="M124.129 139.73V170.986H93.4111V155.355H108.767V139.73H124.129Z"
            fill="#FF5353"
          />
          <path
            d="M124.122 77.7236H108.767V124.184H124.122V77.7236Z"
            fill="#FFDF3A"
          />
          <path
            d="M124.129 15.5459V46.5315H108.767H108.674V30.9285H93.2264V15.5459H124.129Z"
            fill="#40A8F5"
          />
          <path
            d="M108.766 46.5321V62.1777H77.6934V31.1992H93.134V46.5321H108.674H108.766Z"
            fill="#FFDF3A"
          />
          <path
            d="M108.674 30.9287V46.5317H93.134V31.1988L93.2264 30.9287H108.674Z"
            fill="#1A1A1A"
          />
          <path
            d="M93.2335 139.73H77.6934V155.099H93.2335V139.73Z"
            fill="#28F77E"
          />
          <path
            d="M93.2335 77.7236H77.6934V124.184H93.2335V77.7236Z"
            fill="#FF5353"
          />
          <path
            d="M62.1533 139.73V186.532H15.5401V139.73H31.0731H46.6132H62.1533Z"
            fill="#40A8F5"
          />
          <path
            d="M62.1533 77.7236H46.6132V124.184H62.1533V77.7236Z"
            fill="#40A8F5"
          />
          <path
            d="M62.1533 31.1986V62.1771H46.6132V15.5459H62.0467V31.1986H62.1533Z"
            fill="#FFDF3A"
          />
          <path
            d="M31.0802 77.7236H15.5401V124.184H31.0802V77.7236Z"
            fill="#FFDF3A"
          />
          <path
            d="M31.0802 15.5459H15.5401V62.1771H31.0802V15.5459Z"
            fill="#FF5353"
          />
        </g>
        <defs>
          <clipPath id="clip0_387_1129">
            <rect width="202" height="202" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const getColourLogomarkBlackType = (
    width: number,
    className?: string
  ): React.ReactElement => {
    return (
      <svg
        viewBox="0 0 1069 224"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${width}px` }}
        className={className}
        data-testid="colour-logomark-black-type"
      >
        <path
          d="M930.65 137.881H913.42V155.111H930.65V137.881Z"
          fill="#1A1A1A"
        />
        <path
          d="M999.12 68.9894V68.9395H965.13V86.1695H982.36V120.639H947.89V103.409H965.13V86.1695H947.89V103.409H930.66V137.879H938.29H947.89H982.36V155.109H999.6V68.9894H999.12Z"
          fill="#1A1A1A"
        />
        <path
          d="M1068.53 86.1695V68.9395H1016.83V86.1695H1034.06V137.879H1016.83V155.109H1068.53V137.879H1051.3V86.1695H1068.53Z"
          fill="#1A1A1A"
        />
        <path
          d="M499.8 103.409V86.1695H551.5V68.9395H499.8H482.57V120.639H499.8H551.5V137.879H568.74V103.409H551.5H499.8Z"
          fill="#1A1A1A"
        />
        <path
          d="M551.08 137.881H482.57V155.111H551.08V137.881Z"
          fill="#1A1A1A"
        />
        <path
          d="M310.22 86.1695H327.46V137.879H310.22V155.109H361.93V137.879H344.69V86.1695H361.93V68.9395H310.22V86.1695Z"
          fill="#1A1A1A"
        />
        <path
          d="M568.74 86.1695H603.21V155.109H620.44V86.1695H655.31V68.9395H568.74V86.1695Z"
          fill="#1A1A1A"
        />
        <path
          d="M672.35 86.1695H689.48V137.879H672.35V155.109H723.85V137.879H706.71V86.1695H723.85V68.9395H672.35V86.1695Z"
          fill="#1A1A1A"
        />
        <path
          d="M758.32 68.9395H741.08V137.879V154.689V155.109H792.78V137.879H758.32V68.9395Z"
          fill="#1A1A1A"
        />
        <path
          d="M827.25 68.9395H810.02V137.879V154.689V155.109H861.72V137.879H827.25V68.9395Z"
          fill="#1A1A1A"
        />
        <path
          d="M396.4 86.1695V68.9395H379.16V86.1695V103.409V155.109H396.4V103.409H413.63V86.1695H396.4Z"
          fill="#1A1A1A"
        />
        <path d="M430.86 103.41H413.63V120.64H430.86V103.41Z" fill="#1A1A1A" />
        <path
          d="M448.1 120.639H430.86V137.879H448.1V155.109H465.33V137.879V120.639V68.9395H448.1V120.639Z"
          fill="#1A1A1A"
        />
        <g clipPath="url(#clip0_387_1359)">
          <path
            d="M224.008 206.847V224.087H0V0H224.008V206.847ZM206.775 206.847V154.948H189.535V206.847H206.775ZM206.775 137.709V86.1884H154.873V137.709H206.775ZM206.775 68.9491V51.7099H154.873V68.9491H206.775ZM206.775 34.4785V17.2393H154.873V34.4785H206.775ZM172.31 206.847V154.948H154.873V206.847H172.31ZM137.64 189.608V154.925H120.612V172.266H103.585V189.608H137.64ZM137.64 137.709V86.1884H120.612V137.709H137.64ZM137.64 51.5995V17.2393H103.388V34.2972L103.285 34.5967H86.155V68.9491H120.612V51.6074L137.64 51.5995ZM103.388 171.99V154.948H86.155V171.99H103.388ZM103.388 137.709V86.1884H86.155V137.709H103.388ZM68.9224 206.847V154.948H17.2326V206.847H68.9224ZM68.9224 137.709V86.1884H51.6899V137.709H68.9224ZM68.9224 68.9491V34.5967H68.7806V17.255H51.6899V68.9649L68.9224 68.9491ZM34.4652 137.709V86.1884H17.2326V137.709H34.4652ZM34.4652 68.9491V17.2393H17.2326V68.9491H34.4652Z"
            fill="#1A1A1A"
          />
          <path
            d="M206.767 154.949H189.535V206.848H206.767V154.949Z"
            fill="#40A8F5"
          />
          <path
            d="M206.767 86.1875H154.873V137.708H206.767V86.1875Z"
            fill="#40A8F5"
          />
          <path
            d="M206.767 51.709H154.873V68.9482H206.767V51.709Z"
            fill="#FF5353"
          />
          <path
            d="M206.767 17.2383H154.873V34.4775H206.767V17.2383Z"
            fill="#FFDF3A"
          />
          <path
            d="M172.302 154.949H154.873V206.848H172.302V154.949Z"
            fill="#FFDF3A"
          />
          <path
            d="M137.648 154.949V189.609H103.585V172.275H120.612V154.949H137.648Z"
            fill="#FF5353"
          />
          <path
            d="M137.64 86.1875H120.612V137.708H137.64V86.1875Z"
            fill="#FFDF3A"
          />
          <path
            d="M137.648 17.2383V51.5985H120.612H120.51V34.2962H103.38V17.2383H137.648Z"
            fill="#40A8F5"
          />
          <path
            d="M120.612 51.6004V68.95H86.1551V34.5977H103.277V51.6004H120.51H120.612Z"
            fill="#FFDF3A"
          />
          <path
            d="M120.51 34.2969V51.5992H103.277V34.5964L103.38 34.2969H120.51Z"
            fill="#1A1A1A"
          />
          <path
            d="M103.388 154.949H86.1551V171.991H103.388V154.949Z"
            fill="#28F77E"
          />
          <path
            d="M103.388 86.1875H86.1551V137.708H103.388V86.1875Z"
            fill="#FF5353"
          />
          <path
            d="M68.9225 154.949V206.848H17.2326V154.949H34.4573H51.6899H68.9225Z"
            fill="#40A8F5"
          />
          <path
            d="M68.9225 86.1875H51.6899V137.708H68.9225V86.1875Z"
            fill="#40A8F5"
          />
          <path
            d="M68.9225 34.5958V68.9481H51.6899V17.2383H68.8043V34.5958H68.9225Z"
            fill="#FFDF3A"
          />
          <path
            d="M34.4652 86.1875H17.2326V137.708H34.4652V86.1875Z"
            fill="#FFDF3A"
          />
          <path
            d="M34.4652 17.2383H17.2326V68.9481H34.4652V17.2383Z"
            fill="#FF5353"
          />
        </g>
        <defs>
          <clipPath id="clip0_387_1359">
            <rect width="224" height="224" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const getColourLogomarkWhiteType = (
    width: number,
    className?: string
  ): React.ReactElement => {
    return (
      <svg
        viewBox="0 0 1069 225"
        fill="none"
        style={{ width: `${width}px` }}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        data-testid="colour-logomark-white-type"
      >
        <path
          d="M930.65 137.883H913.42V155.113H930.65V137.883Z"
          fill="#F7F7F7"
        />
        <path
          d="M999.12 68.9914V68.9414H965.13V86.1714H982.36V120.641H947.89V103.411H965.13V86.1714H947.89V103.411H930.66V137.881H938.29H947.89H982.36V155.111H999.6V68.9914H999.12Z"
          fill="#F7F7F7"
        />
        <path
          d="M1068.53 86.1714V68.9414H1016.83V86.1714H1034.06V137.881H1016.83V155.111H1068.53V137.881H1051.3V86.1714H1068.53Z"
          fill="#F7F7F7"
        />
        <path
          d="M499.8 103.411V86.1714H551.5V68.9414H499.8H482.57V120.641H499.8H551.5V137.881H568.74V103.411H551.5H499.8Z"
          fill="#F7F7F7"
        />
        <path
          d="M551.08 137.883H482.57V155.113H551.08V137.883Z"
          fill="#F7F7F7"
        />
        <path
          d="M310.22 86.1714H327.46V137.881H310.22V155.111H361.93V137.881H344.69V86.1714H361.93V68.9414H310.22V86.1714Z"
          fill="#F7F7F7"
        />
        <path
          d="M568.74 86.1714H603.21V155.111H620.44V86.1714H655.31V68.9414H568.74V86.1714Z"
          fill="#F7F7F7"
        />
        <path
          d="M672.35 86.1714H689.48V137.881H672.35V155.111H723.85V137.881H706.71V86.1714H723.85V68.9414H672.35V86.1714Z"
          fill="#F7F7F7"
        />
        <path
          d="M758.32 68.9414H741.08V137.881V154.691V155.111H792.78V137.881H758.32V68.9414Z"
          fill="#F7F7F7"
        />
        <path
          d="M827.25 68.9414H810.02V137.881V154.691V155.111H861.72V137.881H827.25V68.9414Z"
          fill="#F7F7F7"
        />
        <path
          d="M396.4 86.1714V68.9414H379.16V86.1714V103.411V155.111H396.4V103.411H413.63V86.1714H396.4Z"
          fill="#F7F7F7"
        />
        <path
          d="M430.86 103.412H413.63V120.642H430.86V103.412Z"
          fill="#F7F7F7"
        />
        <path
          d="M448.1 120.641H430.86V137.881H448.1V155.111H465.33V137.881V120.641V68.9414H448.1V120.641Z"
          fill="#F7F7F7"
        />
        <g clipPath="url(#clip0_532_621)">
          <path
            d="M224.008 206.849V224.089H0V0.00195312H224.008V206.849ZM206.775 206.849V154.95H189.535V206.849H206.775ZM206.775 137.711V86.1903H154.873V137.711H206.775ZM206.775 68.9511V51.7118H154.873V68.9511H206.775ZM206.775 34.4805V17.2412H154.873V34.4805H206.775ZM172.31 206.849V154.95H154.873V206.849H172.31ZM137.64 189.61V154.927H120.612V172.268H103.585V189.61H137.64ZM137.64 137.711V86.1903H120.612V137.711H137.64ZM137.64 51.6015V17.2412H103.388V34.2992L103.285 34.5987H86.155V68.9511H120.612V51.6094L137.64 51.6015ZM103.388 171.992V154.95H86.155V171.992H103.388ZM103.388 137.711V86.1903H86.155V137.711H103.388ZM68.9224 206.849V154.95H17.2326V206.849H68.9224ZM68.9224 137.711V86.1903H51.6899V137.711H68.9224ZM68.9224 68.9511V34.5987H68.7806V17.257H51.6899V68.9669L68.9224 68.9511ZM34.4652 137.711V86.1903H17.2326V137.711H34.4652ZM34.4652 68.9511V17.2412H17.2326V68.9511H34.4652Z"
            fill="#1A1A1A"
          />
          <path
            d="M206.768 154.951H189.535V206.85H206.768V154.951Z"
            fill="#40A8F5"
          />
          <path
            d="M206.767 86.1895H154.873V137.71H206.767V86.1895Z"
            fill="#40A8F5"
          />
          <path
            d="M206.767 51.7129H154.873V68.9521H206.767V51.7129Z"
            fill="#FF5353"
          />
          <path
            d="M206.767 17.2422H154.873V34.4814H206.767V17.2422Z"
            fill="#FFDF3A"
          />
          <path
            d="M172.302 154.951H154.873V206.85H172.302V154.951Z"
            fill="#FFDF3A"
          />
          <path
            d="M137.648 154.951V189.611H103.585V172.277H120.612V154.951H137.648Z"
            fill="#FF5353"
          />
          <path
            d="M137.64 86.1895H120.612V137.71H137.64V86.1895Z"
            fill="#FFDF3A"
          />
          <path
            d="M137.648 17.2422V51.6024H120.612H120.51V34.3001H103.38V17.2422H137.648Z"
            fill="#40A8F5"
          />
          <path
            d="M120.612 51.6024V68.952H86.155V34.5996H103.277V51.6024H120.51H120.612Z"
            fill="#FFDF3A"
          />
          <path
            d="M120.51 34.2988V51.6011H103.277V34.5984L103.38 34.2988H120.51Z"
            fill="#1A1A1A"
          />
          <path
            d="M103.388 154.951H86.155V171.993H103.388V154.951Z"
            fill="#28F77E"
          />
          <path
            d="M103.388 86.1895H86.155V137.71H103.388V86.1895Z"
            fill="#FF5353"
          />
          <path
            d="M68.9226 154.951V206.85H17.2327V154.951H34.4574H51.69H68.9226Z"
            fill="#40A8F5"
          />
          <path
            d="M68.9225 86.1895H51.6899V137.71H68.9225V86.1895Z"
            fill="#40A8F5"
          />
          <path
            d="M68.9225 34.5997V68.952H51.6899V17.2422H68.8043V34.5997H68.9225Z"
            fill="#FFDF3A"
          />
          <path
            d="M34.4653 86.1895H17.2327V137.71H34.4653V86.1895Z"
            fill="#FFDF3A"
          />
          <path
            d="M34.4653 17.2422H17.2327V68.952H34.4653V17.2422Z"
            fill="#FF5353"
          />
        </g>
        <defs>
          <clipPath id="clip0_532_621">
            <rect
              width="224"
              height="224"
              fill="white"
              transform="translate(0 0.00195312)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  };

  switch (variant) {
    case "responsiveWhiteLogomarkWhiteType": {
      logo = (
        <div className="flex flex-col">
          {getWhiteLogomark(width / 5, "block md:hidden")}
          {getWhiteLogomarkWhiteType(width, "hidden md:block")}
        </div>
      );
      break;
    }
    case "whiteLogomarkWhiteType": {
      logo = <>{getWhiteLogomarkWhiteType(width)}</>;
      break;
    }
    case "responsiveColourLogomarkWhiteType": {
      logo = (
        <div className="flex flex-col">
          {getColourLogomark(width / 5, "block md:hidden")}
          {getColourLogomarkWhiteType(width, "hidden md:block")}
        </div>
      );
      break;
    }
    case "ColourLogomarkWhiteType": {
      logo = <>{getColourLogomarkWhiteType(width)}</>;
      break;
    }
    case "responsiveColourLogomarkBlackType": {
      logo = (
        <div className="flex flex-col">
          {getColourLogomark(width / 5, "block md:hidden")}
          {getColourLogomarkBlackType(width, "hidden md:block")}
        </div>
      );
      break;
    }
    case "responsiveBlackLogomarkBlackType": {
      logo = (
        <div className="flex flex-col">
          {getBlackLogomark(width / 5, "block md:hidden")}
          {getBlackLogomarkBlackType(width, "hidden md:block")}
        </div>
      );
      break;
    }
    case "blackLogomarkBlackType": {
      logo = <>{getBlackLogomarkBlackType(width)}</>;
      break;
    }
    case "ColourLogomarkBlackType": {
      logo = <>{getColourLogomarkBlackType(width)}</>;
      break;
    }
    case "whiteLogomark": {
      logo = <>{getWhiteLogomark(width)}</>;
      break;
    }
    case "blackLogomark": {
      logo = <>{getBlackLogomark(width)}</>;
      break;
    }
    case "blueLogomark": {
      logo = <>{getBlueLogomark(width)}</>;
      break;
    }
    case "colourLogomark": {
      logo = <>{getColourLogomark(width)}</>;
      break;
    }
  }

  return <div className={cn("my-auto", className)}>{logo}</div>;
};

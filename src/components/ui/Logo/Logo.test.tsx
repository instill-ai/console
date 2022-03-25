import { render } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("should render responsive colour logomark with black type", () => {
    const { getByTestId } = render(
      <Logo type="responsiveColourLogomarkBlackType" width={300} />
    );

    const colourLogomark = getByTestId("colour-logomark");

    expect(colourLogomark).toHaveClass("block md:hidden");
    expect(colourLogomark).toHaveStyle("width: 60px");

    const colourLogomarkBlackType = getByTestId("colour-logomark-black-type");

    expect(colourLogomarkBlackType).toHaveClass("hidden md:block");
    expect(colourLogomarkBlackType).toHaveStyle("width: 300px");
  });

  it("should render non-responsive colour logomark with black type", () => {
    const { getByTestId } = render(
      <Logo type="ColourLogomarkBlackType" width={300} />
    );

    const colourLogomarkBlackType = getByTestId("colour-logomark-black-type");
    expect(colourLogomarkBlackType).not.toHaveClass();
    expect(colourLogomarkBlackType).toHaveStyle("width: 300px");
  });

  it("should render responsive colour logomark with white type", () => {
    const { getByTestId } = render(
      <Logo type="responsiveColourLogomarkWhiteType" width={300} />
    );

    const colourLogomark = getByTestId("colour-logomark");

    expect(colourLogomark).toHaveClass("block md:hidden");
    expect(colourLogomark).toHaveStyle("width: 60px");

    const colourLogomarkWhiteType = getByTestId("colour-logomark-white-type");

    expect(colourLogomarkWhiteType).toHaveClass("hidden md:block");
    expect(colourLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render non-responsive colour logomark with white type", () => {
    const { getByTestId } = render(
      <Logo type="ColourLogomarkWhiteType" width={300} />
    );

    const colourLogomarkWhiteType = getByTestId("colour-logomark-white-type");
    expect(colourLogomarkWhiteType).not.toHaveClass();
    expect(colourLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render responsive white logomark with white type", () => {
    const { getByTestId } = render(
      <Logo type="responsiveWhiteLogomarkWhiteType" width={300} />
    );

    const whiteLogomark = getByTestId("white-logomark");

    expect(whiteLogomark).toHaveClass("block md:hidden");
    expect(whiteLogomark).toHaveStyle("width: 60px");

    const whiteLogomarkWhiteType = getByTestId("white-logomark-white-type");

    expect(whiteLogomarkWhiteType).toHaveClass("hidden md:block");
    expect(whiteLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render non-responsive white logomark with white type", () => {
    const { getByTestId } = render(
      <Logo type="whiteLogomarkWhiteType" width={300} />
    );

    const whiteLogomarkWhiteType = getByTestId("white-logomark-white-type");
    expect(whiteLogomarkWhiteType).not.toHaveClass();
    expect(whiteLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render responsive black logomark with black type", () => {
    const { getByTestId } = render(
      <Logo type="responsiveBlackLogomarkBlackType" width={300} />
    );

    const blackLogomark = getByTestId("black-logomark");

    expect(blackLogomark).toHaveClass("block md:hidden");
    expect(blackLogomark).toHaveStyle("width: 60px");

    const blackLogomarkWhiteType = getByTestId("black-logomark-black-type");

    expect(blackLogomarkWhiteType).toHaveClass("hidden md:block");
    expect(blackLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render non-responsive black logomark with black type", () => {
    const { getByTestId } = render(
      <Logo type="blackLogomarkBlackType" width={300} />
    );

    const blackLogomarkWhiteType = getByTestId("black-logomark-black-type");
    expect(blackLogomarkWhiteType).not.toHaveClass();
    expect(blackLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render black logomark", () => {
    const { getByTestId } = render(<Logo type="blackLogomark" width={300} />);

    const blackLogomark = getByTestId("black-logomark");
    expect(blackLogomark).not.toHaveClass();
    expect(blackLogomark).toHaveStyle("width: 300px");
  });

  it("should render white logomark", () => {
    const { getByTestId } = render(<Logo type="whiteLogomark" width={300} />);

    const whiteLogomark = getByTestId("white-logomark");
    expect(whiteLogomark).not.toHaveClass();
    expect(whiteLogomark).toHaveStyle("width: 300px");
  });

  it("should render blue logomark", () => {
    const { getByTestId } = render(<Logo type="blueLogomark" width={300} />);

    const blueLogomark = getByTestId("blue-logomark");
    expect(blueLogomark).not.toHaveClass();
    expect(blueLogomark).toHaveStyle("width: 300px");
  });

  it("should render colour logomark", () => {
    const { getByTestId } = render(<Logo type="colourLogomark" width={300} />);

    const colourLogomark = getByTestId("colour-logomark");
    expect(colourLogomark).not.toHaveClass();
    expect(colourLogomark).toHaveStyle("width: 300px");
  });
});

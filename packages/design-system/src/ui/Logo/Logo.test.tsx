import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";
import { describe, it, expect } from "vitest";

describe("Logo", () => {
  it("should render responsive colour logomark with black type", () => {
    render(<Logo variant="responsiveColourLogomarkBlackType" width={300} />);

    const colourLogomark = screen.getByTestId("colour-logomark");

    expect(colourLogomark).toHaveClass("block md:hidden");
    expect(colourLogomark).toHaveStyle("width: 60px");

    const colourLogomarkBlackType = screen.getByTestId(
      "colour-logomark-black-type"
    );

    expect(colourLogomarkBlackType).toHaveClass("hidden md:block");
    expect(colourLogomarkBlackType).toHaveStyle("width: 300px");
  });

  it("should render non-responsive colour logomark with black type", () => {
    render(<Logo variant="ColourLogomarkBlackType" width={300} />);

    const colourLogomarkBlackType = screen.getByTestId(
      "colour-logomark-black-type"
    );
    expect(colourLogomarkBlackType).not.toHaveClass();
    expect(colourLogomarkBlackType).toHaveStyle("width: 300px");
  });

  it("should render responsive colour logomark with white type", () => {
    render(<Logo variant="responsiveColourLogomarkWhiteType" width={300} />);

    const colourLogomark = screen.getByTestId("colour-logomark");

    expect(colourLogomark).toHaveClass("block md:hidden");
    expect(colourLogomark).toHaveStyle("width: 60px");

    const colourLogomarkWhiteType = screen.getByTestId(
      "colour-logomark-white-type"
    );

    expect(colourLogomarkWhiteType).toHaveClass("hidden md:block");
    expect(colourLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render non-responsive colour logomark with white type", () => {
    render(<Logo variant="ColourLogomarkWhiteType" width={300} />);

    const colourLogomarkWhiteType = screen.getByTestId(
      "colour-logomark-white-type"
    );
    expect(colourLogomarkWhiteType).not.toHaveClass();
    expect(colourLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render responsive white logomark with white type", () => {
    render(<Logo variant="responsiveWhiteLogomarkWhiteType" width={300} />);

    const whiteLogomark = screen.getByTestId("white-logomark");

    expect(whiteLogomark).toHaveClass("block md:hidden");
    expect(whiteLogomark).toHaveStyle("width: 60px");

    const whiteLogomarkWhiteType = screen.getByTestId(
      "white-logomark-white-type"
    );

    expect(whiteLogomarkWhiteType).toHaveClass("hidden md:block");
    expect(whiteLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render non-responsive white logomark with white type", () => {
    render(<Logo variant="whiteLogomarkWhiteType" width={300} />);

    const whiteLogomarkWhiteType = screen.getByTestId(
      "white-logomark-white-type"
    );
    expect(whiteLogomarkWhiteType).not.toHaveClass();
    expect(whiteLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render responsive black logomark with black type", () => {
    render(<Logo variant="responsiveBlackLogomarkBlackType" width={300} />);

    const blackLogomark = screen.getByTestId("black-logomark");

    expect(blackLogomark).toHaveClass("block md:hidden");
    expect(blackLogomark).toHaveStyle("width: 60px");

    const blackLogomarkWhiteType = screen.getByTestId(
      "black-logomark-black-type"
    );

    expect(blackLogomarkWhiteType).toHaveClass("hidden md:block");
    expect(blackLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render non-responsive black logomark with black type", () => {
    render(<Logo variant="blackLogomarkBlackType" width={300} />);

    const blackLogomarkWhiteType = screen.getByTestId(
      "black-logomark-black-type"
    );
    expect(blackLogomarkWhiteType).not.toHaveClass();
    expect(blackLogomarkWhiteType).toHaveStyle("width: 300px");
  });

  it("should render black logomark", () => {
    render(<Logo variant="blackLogomark" width={300} />);

    const blackLogomark = screen.getByTestId("black-logomark");
    expect(blackLogomark).not.toHaveClass();
    expect(blackLogomark).toHaveStyle("width: 300px");
  });

  it("should render white logomark", () => {
    render(<Logo variant="whiteLogomark" width={300} />);

    const whiteLogomark = screen.getByTestId("white-logomark");
    expect(whiteLogomark).not.toHaveClass();
    expect(whiteLogomark).toHaveStyle("width: 300px");
  });

  it("should render blue logomark", () => {
    render(<Logo variant="blueLogomark" width={300} />);

    const blueLogomark = screen.getByTestId("blue-logomark");
    expect(blueLogomark).not.toHaveClass();
    expect(blueLogomark).toHaveStyle("width: 300px");
  });

  it("should render colour logomark", () => {
    render(<Logo variant="colourLogomark" width={300} />);

    const colourLogomark = screen.getByTestId("colour-logomark");
    expect(colourLogomark).not.toHaveClass();
    expect(colourLogomark).toHaveStyle("width: 300px");
  });
});

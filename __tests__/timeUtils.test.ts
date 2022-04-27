import { getHumanReadableStringFromTime } from "../src/utils";

describe("test getTimeAgo", () => {
  test("should return 1 second ago", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-01T00:00:01"
    );
    expect(result).toBe("a second ago");
  });

  test("should return x seconds ago", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-01T00:00:10"
    );
    expect(result).toBe("10 seconds ago");
  });

  test("should return 1 minute ago", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-01T00:01:00"
    );
    expect(result).toBe("a minute ago");

    const result2 = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-01T00:01:01"
    );
    expect(result2).toBe("a minute ago");
  });

  test("should return x minutes ago", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-01T00:02:00"
    );
    expect(result).toBe("2 minutes ago");
  });

  test("should return an hour ago", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-01T01:00:00"
    );
    expect(result).toBe("an hour ago");

    const result2 = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-01T01:01:00"
    );
    expect(result2).toBe("an hour ago");
  });

  test("should return x hours ago", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-01T10:00:00"
    );
    expect(result).toBe("10 hours ago");
  });

  test("should return yesterday", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-02T00:00:00"
    );
    expect(result).toBe("yesterday");

    const result2 = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-02T00:02:00"
    );
    expect(result2).toBe("yesterday");
  });

  test("should return x days ago", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1995-12-10T00:00:00"
    );
    expect(result).toBe("9 days ago");
  });

  test("should return 1 month ago", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1996-01-01T00:00:00"
    );
    expect(result).toBe("last month");

    const result2 = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1996-01-10T00:00:00"
    );
    expect(result2).toBe("last month");
  });

  test("should return x months ago", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1996-03-01T00:00:00"
    );
    expect(result).toBe("3 months ago");
  });

  test("should return Date string", () => {
    const result = getHumanReadableStringFromTime(
      "1995-12-01T00:00:00",
      "1997-03-01T00:00:00"
    );
    expect(result).toBe("Fri Dec 01 1995");
  });
});

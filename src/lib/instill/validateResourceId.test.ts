import { validateResourceId } from "./validateResourceId";

describe("Should validate resource ID", () => {
  test("should only contain alphanumeric characters or hyphens", () => {
    const id = "test--??";
    expect(validateResourceId(id)).toBeFalsy();
  });

  test("should enclose by alphanumeric characters", () => {
    const id = "test-";
    expect(validateResourceId(id)).toBeFalsy();
  });

  test("should only contain lower case characters", () => {
    const id = "Test";
    expect(validateResourceId(id)).toBeFalsy();
    const correctId = "test-foo";
    expect(validateResourceId(correctId)).toBeTruthy();
  });

  test("should have first character as letter", () => {
    const id = "12foo-foo";
    expect(validateResourceId(id)).toBeFalsy();
    const correctId = "foo-bar";
    expect(validateResourceId(correctId)).toBeTruthy();
  });

  test("can have multiple sequence hyphen", () => {
    const id = "foo---bar";
    expect(validateResourceId(id)).toBeTruthy();
  });

  test("can have 63 character maximum", () => {
    const id =
      "foo-bar-woo-aoo-too-aaa-ggg-rrr-eee-ggg-eee-ggg-hhh-eee-ggg-yyy-out-of-index";
    expect(validateResourceId(id)).toBeFalsy();
  });
});

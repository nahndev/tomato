import { describe, expect, it } from "vitest";
import { insertToken, stripTokensForValidation } from "./component-token";

describe("insertToken", () => {
  it("inserts the token at the cursor and moves the cursor after it", () => {
    expect(insertToken("/users/", 7, "Id")).toEqual({ text: "/users/{{Id}}", cursorPosition: 13 });
  });

  it("inserts in the middle of the text", () => {
    expect(insertToken("ab", 1, "X")).toEqual({ text: "a{{X}}b", cursorPosition: 6 });
  });
});

describe("stripTokensForValidation", () => {
  it("makes a payload with quoted tokens valid JSON", () => {
    const stripped = stripTokensForValidation('{ "name": "{{Full name}}", "age": "{{Age}}" }');

    expect(() => JSON.parse(stripped)).not.toThrow();
  });

  it("keeps a bare token invalid JSON, so it has to be quoted", () => {
    expect(() => JSON.parse(stripTokensForValidation('{ "age": {{Age}} }'))).toThrow();
  });

  it("leaves unbalanced braces for the caller to flag", () => {
    expect(stripTokensForValidation("/a/{{b")).toContain("{{");
  });
});

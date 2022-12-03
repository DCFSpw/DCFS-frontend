import { describe, it, expect } from "vitest";
import { convertByteToGb, convertGbToByte } from "src/modules/Disk/helpers.js";

describe("test helper", () => {
  it("should round converted bytes", async () => {
    const gb = 3.41;
    const result = convertGbToByte(gb);
    expect(result).toBe(Math.round(result));
  });

  it("should set fixed decimal in gigabytes", async () => {
    const bytes = 19311;
    const result = convertByteToGb(bytes);
    expect(result).toBe(parseFloat(result).toFixed(1));
  });
});

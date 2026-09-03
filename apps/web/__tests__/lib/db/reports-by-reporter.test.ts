jest.unmock("@/lib/db/local");

import { closePool } from "@/lib/db/local";
import { getReportsByReporter } from "@/lib/db/queries";

describe("getReportsByReporter", () => {
  beforeAll(() => {
    process.env.ALLOW_IN_MEMORY_DB = "true";
    let sequence = 0;
    global.crypto.randomUUID = () => `00000000-0000-4000-8000-${String(++sequence).padStart(12, "0")}`;
  });

  afterAll(async () => {
    await closePool();
  });

  it("works with pg-mem and returns report media and assessments without a correlated alias", async () => {
    const reports = await getReportsByReporter("11111111-1111-1111-1111-111111111111");

    expect(reports.length).toBeGreaterThan(0);
    expect(reports[0]).toEqual(expect.objectContaining({
      reporter_id: "11111111-1111-1111-1111-111111111111",
      lat: expect.any(Number),
      lng: expect.any(Number),
    }));
    expect(Array.isArray(reports[0].media) || reports[0].media === null).toBe(true);
    expect(Array.isArray(reports[0].assessments) || reports[0].assessments === null).toBe(true);
  });
});

import { createSessionToken } from "@/lib/auth/token";
import { verifySessionTokenAtEdge } from "@/lib/auth/token-edge";
import { webcrypto } from "crypto";

Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });

describe("edge session verification", () => {
  it("accepts a server-issued session token", async () => {
    const token = createSessionToken("11111111-1111-1111-1111-111111111111", "citizen");
    await expect(verifySessionTokenAtEdge(token)).resolves.toMatchObject({
      userId: "11111111-1111-1111-1111-111111111111",
      role: "citizen",
    });
  });

  it("rejects a tampered token", async () => {
    const token = createSessionToken("11111111-1111-1111-1111-111111111111", "citizen");
    await expect(verifySessionTokenAtEdge(`${token}x`)).resolves.toBeNull();
  });
});

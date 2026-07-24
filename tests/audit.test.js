const nock = require("nock");
const request = require("supertest");
const { app } = require("../src/app");

describe("Page Pulse audit API", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test("audits a normal website", async () => {
    nock("https://google.com")
      .get("/")
      .reply(
        200,
        `
        <html>
          <head>
            <title>Google</title>
            <meta name="description" content="Search page">
          </head>
          <body>
            <h1>Search</h1>
            <p>Find useful information quickly.</p>
            <img src="/logo.png">
            <img src="/icon.png" alt="Google icon">
          </body>
        </html>
        `,
        { "Content-Type": "text/html" }
      );

    const response = await request(app)
      .post("/audit")
      .send({ url: "google.com" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(response.body.title).toBe("Google");
    expect(response.body.metaDescription).toBe("Search page");
    expect(response.body.h1Count).toBe(1);
    expect(response.body.missingAltImages).toBe(1);
    expect(response.body.wordCount).toBeGreaterThan(0);
  });

  test("returns error for invalid URL", async () => {
    const response = await request(app)
      .post("/audit")
      .send({ url: "abc" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_URL");
  });

  test("rejects PDF or non-HTML URL", async () => {
    nock("https://example.com")
      .get("/sample.pdf")
      .reply(200, "%PDF-1.4", { "Content-Type": "application/pdf" });

    const response = await request(app)
      .post("/audit")
      .send({ url: "https://example.com/sample.pdf" });

    expect(response.status).toBe(415);
    expect(response.body.error.code).toBe("NON_HTML");
  });
});
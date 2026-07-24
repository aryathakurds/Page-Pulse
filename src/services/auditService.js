const axios = require("axios");
const cheerio = require("cheerio");

const {
  InvalidUrlError,
  NonHtmlError,
  TimeoutError,
  FetchError,
} = require("../utils/errors");

function normalizeUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== "string") {
    throw new InvalidUrlError();
  }

  const trimmedUrl = inputUrl.trim();

  const urlWithProtocol = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  let parsedUrl;

  try {
    parsedUrl = new URL(urlWithProtocol);
  } catch (error) {
    throw new InvalidUrlError();
  }

  if (!parsedUrl.hostname.includes(".")) {
    throw new InvalidUrlError();
  }

  return parsedUrl.toString();
}

function parseHtml(html) {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || "No title found";

  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    "No meta description found";

  const h1Count = $("h1").length;

  const missingAltImages = $("img")
    .toArray()
    .filter((img) => !($(img).attr("alt") || "").trim()).length;

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();

  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;

  return {
    title,
    metaDescription,
    h1Count,
    missingAltImages,
    wordCount,
  };
}

async function auditUrl(inputUrl) {
  const url = normalizeUrl(inputUrl);
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      responseType: "text",
      validateStatus: () => true,
      headers: {
        "User-Agent": "PagePulseBot/1.0",
        Accept: "text/html",
      },
    });

    const responseTime = `${Date.now() - startTime}ms`;
    const contentType = response.headers["content-type"] || "";

    if (!contentType.includes("text/html")) {
      throw new NonHtmlError();
    }

    return {
      url,
      status: response.status,
      responseTime,
      ...parseHtml(response.data),
    };
  } catch (error) {
    if (error instanceof NonHtmlError || error instanceof InvalidUrlError) {
      throw error;
    }

    if (error.code === "ECONNABORTED") {
      throw new TimeoutError();
    }

    throw new FetchError();
  }
}

module.exports = {
  auditUrl,
  parseHtml,
  normalizeUrl,
};
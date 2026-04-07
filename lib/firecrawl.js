import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          schema: {
            type: "object",
            properties: {
              productName: { type: "string" },
              currentPrice: { type: "number" },
              currencyCode: { type: "string" },
              productImageUrl: { type: "string" },
            },
            required: ["productName", "currentPrice"],
          },
          prompt: "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', and an ABSOLUTE product image URL as 'productImageUrl' if available. Ensure the image URL includes the protocol and domain.",
        }
      ],
    });

    // Some SDK versions don't return success at top level, check for json data directly
    const isSuccess = result.success !== undefined ? result.success : (!!result.json || !!result.data?.json);

    if (!isSuccess) {
      throw new Error(result.error || "Failed to extract product details");
    }

    // Modern SDK returns .json directly or in .data.json
    const extractedData = result.json || result.data?.json;

    if (!extractedData || !extractedData.productName) {
      throw new Error("No data extracted from URL");
    }

    return extractedData;
  } catch (error) {
    console.error("Firecrawl scrape error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}

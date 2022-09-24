export async function getFundingForUnderlying(
  underlying: string
): Promise<[number, number][]> {
  try {
    const response = await fetch(
      `https://stats.entropy.trade/volt04_funding_apy?symbol=${underlying}`,
      {
        mode: "cors",
      }
    );
    const data: [number, number][] = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

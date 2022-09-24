class ElementHandler {
  constructor(ogtag) {
    this.ogtag = ogtag;
  }
  element(element) {
    element.append(this.ogtag, { html: true });
  }
}

const twitterMetadataOgForPages = {
  "/": {
    title: "Friktion",
    description: "Smarter returns on your crypto",
    image: "https://friktion.fi/TwitterCard_Home.png",
  },
  "/volt": {
    title: "Friktion - Volts",
    description: "Volts are powerful investment strategies.",
    image: "https://friktion.fi/TwitterCard_Volts.png",
  },
  "/income": {
    title: "Friktion - Generate Income",
    description:
      "Enhance returns on volatile assets with call option overwriting.",
    image: "https://friktion.fi/TwitterCard_Income.png",
  },
  "/stables": {
    title: "Friktion - Sustainable Stables",
    description: "Earn on stablecoins using automated cash secured puts.",
    image: "https://friktion.fi/TwitterCard_Stables.png",
  },
  "/crab": {
    title: "Friktion - Crab Strategy",
    description: "Monetize range-bound crab markets.",
    image: "https://friktion.fi/TwitterCard_Crab.png",
  },
  "/basis": {
    title: "Friktion - Basis Yield",
    description: "Harvest basis yield via delta-neutral funding.",
    image: "https://friktion.fi/TwitterCard_Basis.png",
  },
  "/protection": {
    title: "Friktion - Capital Protection",
    description: "Outperform in volatile markets with principal protection.",
    image: "https://friktion.fi/TwitterCard_Protection.png",
  },
  "/circuits": {
    title: "Friktion - Circuits",
    description:
      "Treasury management built to maximize long-term protocol value.",
    image: "https://friktion.fi/TwitterCard_Circuits.png",
  },
};

export async function onRequest(context) {
  const { request, next } = context;
  const res = await next();
  const { pathname } = new URL(request.url);

  // if (!(pathname === "/index.html" || pathname === "/")) {
  //   return res;
  // }

  let data = twitterMetadataOgForPages["/"];
  for (const [pathPrefix, specialData] of Object.entries(
    twitterMetadataOgForPages
  )) {
    if (pathname.startsWith(pathPrefix)) {
      data = specialData;
    }
  }

  return new HTMLRewriter()
    .on(
      "head",
      new ElementHandler(`
        <!-- ${request.url} -->
        <title>${data.title}</title>
        <meta property="og:title" content="${data.title}" />
        <meta name="twitter:title" content="${data.title}" />
        <meta name="description" content="${data.description}" />
        <meta property="og:description" content="${data.description}" />
        <meta name="twitter:description" content="${data.description}" />
        <meta property="og:image" content="${data.image}" />
        <meta name="twitter:image" content="${data.image}" />
      `)
    )
    .transform(res);
}

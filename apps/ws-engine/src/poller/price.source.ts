import fetch from "node-fetch";

const URL = process.env.GRAPHQL_URL!;

type GraphQLResponse<T> = {
  data?: T;
  errors?: any[];
};

type Pair = {
  address: string;
  firstToken: { ticker: string };
  secondToken: { ticker: string };
  firstTokenPrice?: string;
};

/* 🔥 CACHE */
const pairCache = new Map<string, Pair>();

/* STEP 1 – find pair address */
export async function findPair(pair: string) {

  if (pairCache.has(pair)) {
    return pairCache.get(pair)!; // ✅ reuse cached
  }

  const [base, quote] = pair.split("/");

  const query = `
    query {
      pairs(offset:0, limit:500) {
        address
        firstToken { ticker }
        secondToken { ticker }
      }
    }
  `;

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "novax-bot"
    },
    body: JSON.stringify({ query })
  });

  const json = (await res.json()) as GraphQLResponse<{ pairs: Pair[] }>;

  if (!json.data) {
    throw new Error("GraphQL error while finding pair");
  }

  const found = json.data.pairs.find(
    p =>
      p.firstToken.ticker === base &&
      p.secondToken.ticker === quote
  );

  if (!found) {
    throw new Error(`Pair not found: ${pair}`);
  }

  pairCache.set(pair, found); // ✅ store

  console.log("PAIR FOUND:", pair, found.address);

  return found;
}

/* STEP 2 – fetch price using address */
export async function fetchPairByAddress(address: string) {

  const query = `
    query($addr: [String!]) {
      pairs(offset:0, limit:1, addresses:$addr) {
        firstToken { ticker }
        secondToken { ticker }
        firstTokenPrice
      }
    }
  `;

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "novax-bot"
    },
    body: JSON.stringify({
      query,
      variables: { addr: [address] }
    })
  });

  const json = (await res.json()) as GraphQLResponse<{ pairs: Pair[] }>;

  if (!json.data) {
    throw new Error("GraphQL error while fetching price");
  }

  return json.data.pairs[0];
}

/* MAIN API */
export async function fetchPairs(pair: string) {
  const pairObj = await findPair(pair);
  return fetchPairByAddress(pairObj.address);
}

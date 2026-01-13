import fs from "node:fs";
import path from "node:path";

const API =
"https://internal-graph.xexchange.com/trading-view/history";

const SYMBOL = "WEGLD-bd4d79";

const TIMEFRAMES: Record<string, number> = {
  "1m": 1,
  "5m": 5,
  "15m": 15,
  "1h": 60
};

// ===== CONFIG =====
const DAYS = 30;
const INTERVAL_MINUTES = 60;
// ==================

const now = () =>
  Math.floor(Date.now() / 1000);

function buildURL(
  tf: number,
  from: number,
  to: number
) {
  return `${API}?symbol=${SYMBOL}&resolution=${tf}&from=${from}&to=${to}`;
}

async function fetchJSON(url: string) {

  const r = await fetch(url);

  if (!r.ok)
    throw new Error(`HTTP ${r.status}`);

  const j: any = await r.json();

  if (j.s !== "ok")
    throw j;

  return j;
}

function toCSV(d: any) {

  const rows = [
    "time,open,high,low,close,volume"
  ];

  for (let i = 0; i < d.t.length; i++) {
    rows.push(
      `${d.t[i]},${d.o[i]},${d.h[i]},${d.l[i]},${d.c[i]},${d.v[i]}`
    );
  }

  return rows.join("\n");
}

async function importTF(
  name: string,
  tf: number
) {
  try {

    console.log(`📡 ${name}`);

    const end = now();
    const start =
      end - DAYS * 24 * 60 * 60;

    const url =
      buildURL(tf, start, end);

    const data =
      await fetchJSON(url);

    // 👇 save inside src/data
    const base = path.resolve(
      __dirname,
      "../../data"
    );

    if (!fs.existsSync(base))
      fs.mkdirSync(base, { recursive: true });

    const file = path.join(
      base,
      `candles_${name}.csv`
    );

    fs.writeFileSync(
      file,
      toCSV(data)
    );

    console.log(`✅ ${file}`);

  } catch (e) {
    console.log(
      `❌ ${name} failed`,
      e
    );
  }
}

async function runOnce() {

  console.log(
    `\n⏰ Update @ ${new Date().toLocaleString()}`
  );

  for (const [k, v] of
    Object.entries(TIMEFRAMES)) {

    await importTF(k, v);
  }
}

async function main() {

  await runOnce();

  setInterval(
    runOnce,
    INTERVAL_MINUTES * 60 * 1000
  );
}

main();

export async function runSimulation(config: any) {

  const r = await fetch("http://localhost:4000/api/simulate", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(config)
  });

  return r.json();
}

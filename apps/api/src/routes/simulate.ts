import { Router } from "express";
import { runSingleEngine } from "../../../strategy-test/src/singleEngine";
import type { SimulationConfig } from "../../../ui/src/types/simulation";

const router = Router();

router.post("/", (req, res) => {
  try {
    const { candles, config } = req.body as {
      candles: any[];
      config: SimulationConfig;
    };

    const result = runSingleEngine(
      candles,
      config
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Simulation failed"
    });
  }
});

export default router;

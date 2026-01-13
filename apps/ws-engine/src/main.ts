import "dotenv/config";
import "./ws/ws.server";
import { startPoller } from "./poller/poller";

startPoller();

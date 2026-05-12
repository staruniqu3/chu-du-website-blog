import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blogsRouter from "./blogs";
import orderRulesRouter from "./orderRules";
import welcomeRouter from "./welcome";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blogsRouter);
router.use(orderRulesRouter);
router.use(welcomeRouter);

export default router;

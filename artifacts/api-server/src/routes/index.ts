import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blogsRouter from "./blogs";
import orderRulesRouter from "./orderRules";
import welcomeRouter from "./welcome";
import featuresRouter from "./features";
import portfolioRouter from "./portfolio";
import adminAuthRouter from "./adminAuth";
import contactSettingsRouter from "./contactSettings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blogsRouter);
router.use(orderRulesRouter);
router.use(welcomeRouter);
router.use(featuresRouter);
router.use(portfolioRouter);
router.use(adminAuthRouter);
router.use(contactSettingsRouter);

export default router;

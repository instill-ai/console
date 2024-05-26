import { KnowledgeBaseController } from "./knowledgeBaseController ";

const router = express.Router();
const knowledgeBaseController = new KnowledgeBaseController();

router.post(
  "/v1alpha/artifact/kb",
  knowledgeBaseController.createKnowledgeBase.bind(knowledgeBaseController)
);
router.get(
  "/v1alpha/artifact/kb",
  knowledgeBaseController.getKnowledgeBases.bind(knowledgeBaseController)
);
router.put(
  "/v1alpha/artifact/kb/:id",
  knowledgeBaseController.updateKnowledgeBase.bind(knowledgeBaseController)
);
router.delete(
  "/v1alpha/artifact/kb/:id",
  knowledgeBaseController.deleteKnowledgeBase.bind(knowledgeBaseController)
);

export default router;

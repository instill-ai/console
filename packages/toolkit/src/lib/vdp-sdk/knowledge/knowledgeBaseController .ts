import { KnowledgeBaseService } from "./knowledgeBaseService";

export class KnowledgeBaseController {
  private knowledgeBaseService: KnowledgeBaseService;

  constructor() {
    this.knowledgeBaseService = new KnowledgeBaseService();
  }

  async createKnowledgeBase(req, res) {
    try {
      const data = req.body;
      const knowledgeBase =
        await this.knowledgeBaseService.createKnowledgeBase(data);
      res.json({
        body: knowledgeBase,
        error_msg: "",
        status_code: 0,
      });
    } catch (error) {
      res.status(400).json({
        error_msg: "Invalid input data",
        status_code: 1001,
      });
    }
  }

  async getKnowledgeBases(req, res) {
    try {
      const knowledgeBases =
        await this.knowledgeBaseService.getKnowledgeBases();
      res.json({
        body: {
          knowledgebases: knowledgeBases,
        },
        error_msg: "",
        status_code: 0,
      });
    } catch (error) {
      res.status(400).json({
        body: {},
        error_msg: "Invalid input data",
        status_code: 1001,
      });
    }
  }

  async updateKnowledgeBase(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const knowledgeBase = await this.knowledgeBaseService.updateKnowledgeBase(
        id,
        data
      );
      res.json({
        body: knowledgeBase,
        error_msg: "",
        status_code: 0,
      });
    } catch (error) {
      res.status(400).json({
        error_msg: "Invalid input data",
        status_code: 1001,
      });
    }
  }

  async deleteKnowledgeBase(req, res) {
    try {
      const id = req.params.id;
      await this.knowledgeBaseService.deleteKnowledgeBase(id);
      res.json({
        body: {},
        error_msg: "",
        status_code: 0,
      });
    } catch (error) {
      res.status(500).json({
        error_message: "An error occurred on the server",
        status_code: 2001,
      });
    }
  }
}

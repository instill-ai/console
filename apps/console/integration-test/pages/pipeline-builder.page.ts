import { Locator, Page } from "@playwright/test";
import { getSelectContent } from "../helpers/component-helpers/select";

export class PipelineBuilderPage {
  readonly page: Page;
  readonly pipelineBuilderPagePath: string;
  readonly startNode: Locator;
  readonly startNodeAddFieldButton: Locator;
  readonly startNodeSaveFieldButton: Locator;
  readonly endNodeAddFieldButton: Locator;
  readonly endNodeSaveFieldButton: Locator;
  readonly endNode: Locator;
  readonly mainSaveButton: Locator;
  readonly mainRunButton: Locator;
  readonly selectComponentDialogTrigger: Locator;

  constructor(page: Page, pipelineID: string) {
    this.page = page;
    this.pipelineBuilderPagePath = `/admin/pipelines/${pipelineID}/builder`;
    this.startNode = page.locator("[data-id='variable']");
    this.startNodeAddFieldButton = this.startNode.getByRole("button", {
      name: "Add Field",
      exact: true,
    });
    this.startNodeSaveFieldButton = this.startNode.getByRole("button", {
      name: "Save",
    });
    this.endNode = page.locator("[data-id='response']");
    this.endNodeAddFieldButton = this.endNode.getByRole("button", {
      name: "Add Field",
      exact: true,
    });
    this.endNodeSaveFieldButton = this.endNode.getByRole("button", {
      name: "Save",
    });
    this.mainSaveButton = page.getByRole("button", { name: "Save" });
    this.mainRunButton = page.getByRole("button", { name: "Run" });
    this.selectComponentDialogTrigger = page.getByRole("button", {
      name: "Component",
    });
  }

  async goto() {
    await this.page.goto(this.pipelineBuilderPagePath);
  }

  async expectOnIt() {
    await this.page.waitForURL(this.pipelineBuilderPagePath);
  }

  async expectToSave() {
    await Promise.all([
      this.page
        .getByText("Pipeline is saved", { exact: true })
        .waitFor({ state: "visible" }),
      this.mainSaveButton.click(),
    ]);
  }

  async createStartComponentField({
    inputType,
    key,
  }: {
    inputType: string;
    key: string;
  }) {
    await this.startNodeAddFieldButton.click();
    const startComponentTypeSelectTrigger =
      this.startNode.getByLabel("Input Type");
    await startComponentTypeSelectTrigger.click();
    const startComponentTypeSelectContent = await getSelectContent(
      this.page,
      startComponentTypeSelectTrigger
    );
    await startComponentTypeSelectContent.getByText(inputType).click();
    await this.startNode.getByPlaceholder("My prompt").fill(key);
    await this.startNodeSaveFieldButton.click();
  }

  async editStartComponentField({
    key,
    newKey,
    newTitle,
    newInputType,
  }: {
    key: string;
    newKey?: string;
    newTitle?: string;
    newInputType?: string;
  }) {
    const editTextsFieldButton = this.startNode.locator(
      `button[aria-label='Edit start operator ${key} field']`
    );
    await editTextsFieldButton.click();

    if (newKey) {
      await this.startNode.getByPlaceholder("The key of this field").clear();
      await this.startNode
        .getByPlaceholder("The key of this field")
        .fill(newKey);
    }

    if (newTitle) {
      await this.startNode.getByPlaceholder("My prompt").fill(newTitle);
    }

    if (newInputType) {
      const startComponentTypeSelectTrigger =
        this.startNode.getByLabel("Input Type");
      await startComponentTypeSelectTrigger.click();
      const startComponentTypeSelectContent = await getSelectContent(
        this.page,
        startComponentTypeSelectTrigger
      );
      await startComponentTypeSelectContent.getByText(newInputType).click();
    }

    await this.startNodeSaveFieldButton.click();
  }

  async createEndComponentField({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) {
    await this.endNodeAddFieldButton.click();
    await this.endNode.getByPlaceholder("My prompt").fill(key);
    await this.endNode.locator(`textarea[name='value']`).fill(value);
    await this.endNodeSaveFieldButton.click();
  }

  async editEndComponentField({
    key,
    newKey,
    newTitle,
    newValue,
  }: {
    key: string;
    newKey?: string;
    newTitle?: string;
    newValue?: string;
  }) {
    const editFooFieldButton = this.endNode.locator(
      `button[aria-label='Edit end operator ${key} field']`
    );

    await editFooFieldButton.click();

    if (newKey) {
      await this.endNode.getByPlaceholder("The key of this field").clear();
      await this.endNode.getByPlaceholder("The key of this field").fill(newKey);
    }

    if (newTitle) {
      await this.endNode.getByPlaceholder("My prompt").clear();
      await this.endNode.getByPlaceholder("My prompt").fill(newTitle);
    }

    if (newValue) {
      await this.endNode.locator(`textarea[name='value']`).clear();
      await this.endNode.locator(`textarea[name='value']`).fill(newValue);
    }

    await this.endNodeSaveFieldButton.click();
  }
}

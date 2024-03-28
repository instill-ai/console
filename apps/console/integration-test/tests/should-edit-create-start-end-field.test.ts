import { test, expect } from "@playwright/test";
import { PipelineBuilderPage } from "../pages/pipeline-builder.page";
import { createPipeline, deletePipeline } from "../helpers/actions/pipeline";

export function shouldEditAndCreateStartAndEndOperatorField() {
  const pipelineID = "start_field_test";
  const textsFieldID = "texts";
  const promptsFieldID = "prompts";
  const jsonFieldID = "json";
  const resultFooID = "result_foo";
  const resultBarID = "result_bar";
  const resultTestID = "result_test";

  test.describe.serial("Start Operator create/edit field test", () => {
    test("should create pipeline", async ({ page }) => {
      await createPipeline(page, pipelineID);
    });

    test("should create correct start field", async ({ page }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      await pipelineBuilderPage.startNodeAddFieldButton.click();
      await pipelineBuilderPage.startNode
        .getByRole("button", { name: "Multiple Texts" })
        .click();
      await pipelineBuilderPage.startNode
        .getByPlaceholder("My prompt")
        .fill(textsFieldID);
      await pipelineBuilderPage.startNodeSaveFieldButton.click();

      await pipelineBuilderPage.startNodeAddFieldButton.click();
      await pipelineBuilderPage.startNode
        .getByRole("button", { name: "JSON" })
        .click();
      await pipelineBuilderPage.startNode
        .getByPlaceholder("My prompt")
        .fill(jsonFieldID);
      await pipelineBuilderPage.startNodeSaveFieldButton.click();

      await expect(
        pipelineBuilderPage.startNode.getByText(textsFieldID, { exact: true }),
      ).toHaveCount(1);
      await expect(
        pipelineBuilderPage.startNode.getByText(jsonFieldID, { exact: true }),
      ).toHaveCount(1);

      await pipelineBuilderPage.mainSaveButton.click();
      await page.reload();

      await expect(
        pipelineBuilderPage.startNode.getByText(textsFieldID, { exact: true }),
      ).toHaveCount(1);
      await expect(
        pipelineBuilderPage.startNode.getByText(jsonFieldID, { exact: true }),
      ).toHaveCount(1);
    });

    test("should block user from using the same field ID when creating new start field", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();
      await pipelineBuilderPage.startNodeAddFieldButton.click();
      await pipelineBuilderPage.startNode
        .getByRole("button", { name: "Multiple Texts" })
        .click();
      await pipelineBuilderPage.startNode
        .getByPlaceholder("My prompt")
        .fill(textsFieldID);
      await pipelineBuilderPage.startNodeSaveFieldButton.click();

      await expect(
        pipelineBuilderPage.startNode.getByText("Key already exists", {
          exact: true,
        }),
      ).toHaveCount(1);
    });

    test("should block user from using the same field ID when editing start field", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();
      const editTextsFieldButton = pipelineBuilderPage.startNode.locator(
        `button[aria-label='Edit start operator ${textsFieldID} field']`,
      );
      await editTextsFieldButton.click();

      // Can save without any change
      await pipelineBuilderPage.startNode
        .getByRole("button", { name: "Save" })
        .click();
      await expect(
        pipelineBuilderPage.startNode.getByText(textsFieldID, { exact: true }),
      ).toHaveCount(1);

      // Should block user from using duplicated key
      await editTextsFieldButton.click();
      await pipelineBuilderPage.startNode
        .getByPlaceholder("The key of this field")
        .clear();
      await pipelineBuilderPage.startNode
        .getByPlaceholder("The key of this field")
        .fill(jsonFieldID);
      await pipelineBuilderPage.startNode
        .getByRole("button", { name: "Save" })
        .click();
      await expect(
        pipelineBuilderPage.startNode.getByText("Key already exists", {
          exact: true,
        }),
      ).toHaveCount(1);
    });

    test("should edit the start field's name", async ({ page }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      const editTextsFieldButton = pipelineBuilderPage.startNode.locator(
        `button[aria-label='Edit start operator ${textsFieldID} field']`,
      );
      await editTextsFieldButton.click();
      await pipelineBuilderPage.startNode.getByPlaceholder("My prompt").clear();
      await pipelineBuilderPage.startNode
        .getByPlaceholder("My prompt")
        .fill(promptsFieldID);
      await pipelineBuilderPage.startNode
        .getByRole("button", { name: "Save" })
        .click();

      await expect(
        pipelineBuilderPage.startNode.getByText(promptsFieldID, {
          exact: true,
        }),
      ).toHaveCount(1);

      await pipelineBuilderPage.expectToSave();
      await page.reload();

      await expect(
        pipelineBuilderPage.startNode.getByText(promptsFieldID, {
          exact: true,
        }),
      ).toHaveCount(1);
    });

    test("should create correct end field", async ({ page }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      await pipelineBuilderPage.endNodeAddFieldButton.click();
      await pipelineBuilderPage.endNode
        .getByPlaceholder("My prompt")
        .fill(resultFooID);
      await pipelineBuilderPage.endNode
        .locator(`textarea[name='value']`)
        .fill("foo");
      await pipelineBuilderPage.endNodeSaveFieldButton.click();

      await pipelineBuilderPage.endNodeAddFieldButton.click();
      await pipelineBuilderPage.endNode
        .getByPlaceholder("My prompt")
        .fill(resultBarID);
      await pipelineBuilderPage.endNode
        .locator(`textarea[name='value']`)
        .fill("bar");
      await pipelineBuilderPage.endNodeSaveFieldButton.click();

      await expect(
        pipelineBuilderPage.endNode.getByText(resultFooID, { exact: true }),
      ).toHaveCount(1);
      await expect(
        pipelineBuilderPage.endNode.getByText(resultBarID, { exact: true }),
      ).toHaveCount(1);

      await pipelineBuilderPage.mainSaveButton.click();
      await page.reload();

      await expect(
        pipelineBuilderPage.endNode.getByText(resultFooID, { exact: true }),
      ).toHaveCount(1);
      await expect(
        pipelineBuilderPage.endNode.getByText(resultBarID, { exact: true }),
      ).toHaveCount(1);
    });

    test("should block user from using the same field ID when creating new end field", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();
      await pipelineBuilderPage.endNodeAddFieldButton.click();
      await pipelineBuilderPage.endNode
        .getByPlaceholder("My prompt")
        .fill(resultBarID);
      await pipelineBuilderPage.endNode
        .locator(`textarea[name='value']`)
        .fill("bar");
      await pipelineBuilderPage.endNodeSaveFieldButton.click();

      await expect(
        pipelineBuilderPage.endNode.getByText("Key already exists", {
          exact: true,
        }),
      ).toHaveCount(1);
    });

    test("should block user from using the same field ID when editing end field", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();
      const editFooFieldButton = pipelineBuilderPage.endNode.locator(
        `button[aria-label='Edit end operator ${resultFooID} field']`,
      );
      await editFooFieldButton.click();

      // Can save without any change
      await pipelineBuilderPage.endNode
        .getByRole("button", { name: "Save" })
        .click();
      await expect(
        pipelineBuilderPage.endNode.getByText(resultFooID, { exact: true }),
      ).toHaveCount(1);

      // Should block user from using duplicated key
      await editFooFieldButton.click();
      await pipelineBuilderPage.endNode
        .getByPlaceholder("The key of this field")
        .clear();
      await pipelineBuilderPage.endNode
        .getByPlaceholder("The key of this field")
        .fill(resultBarID);
      await pipelineBuilderPage.endNode
        .getByRole("button", { name: "Save" })
        .click();
      await pipelineBuilderPage.endNodeSaveFieldButton.click();
      await expect(
        pipelineBuilderPage.endNode.getByText("Key already exists", {
          exact: true,
        }),
      ).toHaveCount(1);
    });

    test("should edit the end field's name", async ({ page }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      const editFooFieldButton = pipelineBuilderPage.endNode.locator(
        `button[aria-label='Edit end operator ${resultFooID} field']`,
      );
      await editFooFieldButton.click();
      await pipelineBuilderPage.endNode.getByPlaceholder("My prompt").clear();
      await pipelineBuilderPage.endNode
        .getByPlaceholder("My prompt")
        .fill(resultTestID);
      await pipelineBuilderPage.endNode
        .getByRole("button", { name: "Save" })
        .click();

      await expect(
        pipelineBuilderPage.endNode.getByText(resultTestID, { exact: true }),
      ).toHaveCount(1);

      await pipelineBuilderPage.expectToSave();
      await page.reload();

      await expect(
        pipelineBuilderPage.endNode.getByText(resultTestID, { exact: true }),
      ).toHaveCount(1);
    });

    test("should delete pipeline", async ({ page }) => {
      await deletePipeline(page, pipelineID);
    });
  });
}

import { test, expect } from "@playwright/test";
import { PipelineBuilderPage } from "../pages/pipeline-builder.page";
import { createPipeline, deletePipeline } from "../helpers/actions/pipeline";

export function shouldEditAndCreateStartAndEndOperatorField() {
  const pipelineID = "start_field_test";
  const textsFieldKey = "texts";
  const promptsFieldKey = "prompts";
  const jsonFieldKey = "json";
  const resultFooKey = "result_foo";
  const resultBarKey = "result_bar";
  const resultTestKey = "result_test";

  test.describe.serial("Start Operator create/edit field test", () => {
    test("should create pipeline", async ({ page }) => {
      await createPipeline(page, pipelineID);
    });

    test("should create correct start field", async ({ page }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      await pipelineBuilderPage.createStartComponentField({
        inputType: "Multiple Texts",
        key: textsFieldKey,
      });
      await pipelineBuilderPage.createStartComponentField({
        inputType: "JSON",
        key: jsonFieldKey,
      });

      await expect(
        pipelineBuilderPage.startNode.getByText(textsFieldKey, { exact: true })
      ).toHaveCount(1);
      await expect(
        pipelineBuilderPage.startNode.getByText(jsonFieldKey, { exact: true })
      ).toHaveCount(1);

      await pipelineBuilderPage.expectToSave();
      await page.reload();

      await expect(
        pipelineBuilderPage.startNode.getByText(textsFieldKey, { exact: true })
      ).toHaveCount(1);
      await expect(
        pipelineBuilderPage.startNode.getByText(jsonFieldKey, { exact: true })
      ).toHaveCount(1);
    });

    test("should block user from using the same field ID when creating new start field", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();
      await pipelineBuilderPage.createStartComponentField({
        inputType: "Multiple Texts",
        key: textsFieldKey,
      });
      await expect(
        pipelineBuilderPage.startNode.getByText("Key already exists", {
          exact: true,
        })
      ).toHaveCount(1);
    });

    test("should block user from using the same field ID when editing start field", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      // Can save without any change
      await pipelineBuilderPage.editStartComponentField({
        key: textsFieldKey,
      });
      await expect(
        pipelineBuilderPage.startNode.getByText(textsFieldKey, { exact: true })
      ).toHaveCount(1);

      // Should block user from using duplicated key
      await pipelineBuilderPage.editStartComponentField({
        key: textsFieldKey,
        newKey: jsonFieldKey,
      });
      await expect(
        pipelineBuilderPage.startNode.getByText("Key already exists", {
          exact: true,
        })
      ).toHaveCount(1);
    });

    test("should edit the start field's name", async ({ page }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      await pipelineBuilderPage.editStartComponentField({
        key: textsFieldKey,
        newTitle: promptsFieldKey,
      });

      await expect(
        pipelineBuilderPage.startNode.getByText(promptsFieldKey, {
          exact: true,
        })
      ).toHaveCount(1);

      await pipelineBuilderPage.expectToSave();
      await page.reload();

      await expect(
        pipelineBuilderPage.startNode.getByText(promptsFieldKey, {
          exact: true,
        })
      ).toHaveCount(1);
    });

    test("should create correct end field", async ({ page }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      await pipelineBuilderPage.createEndComponentField({
        key: resultFooKey,
        value: "foo",
      });
      await expect(
        pipelineBuilderPage.endNode.getByText(resultFooKey, { exact: true })
      ).toHaveCount(1);

      await pipelineBuilderPage.createEndComponentField({
        key: resultBarKey,
        value: "bar",
      });
      await expect(
        pipelineBuilderPage.endNode.getByText(resultBarKey, { exact: true })
      ).toHaveCount(1);

      await pipelineBuilderPage.expectToSave();
      await page.reload();

      await expect(
        pipelineBuilderPage.endNode.getByText(resultFooKey, { exact: true })
      ).toHaveCount(1);
      await expect(
        pipelineBuilderPage.endNode.getByText(resultBarKey, { exact: true })
      ).toHaveCount(1);
    });

    test("should block user from using the same field ID when creating new end field", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      await pipelineBuilderPage.createEndComponentField({
        key: resultBarKey,
        value: "bar",
      });

      await expect(
        pipelineBuilderPage.endNode.getByText("Key already exists", {
          exact: true,
        })
      ).toHaveCount(1);
    });

    test("should block user from using the same field ID when editing end field", async ({
      page,
    }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      // Can save without any change
      await pipelineBuilderPage.editEndComponentField({
        key: resultFooKey,
      });
      await expect(
        pipelineBuilderPage.endNode.getByText(resultFooKey, { exact: true })
      ).toHaveCount(1);

      // Should block user from using duplicated key
      await pipelineBuilderPage.editEndComponentField({
        key: resultFooKey,
        newKey: resultBarKey,
      });
      await expect(
        pipelineBuilderPage.endNode.getByText("Key already exists", {
          exact: true,
        })
      ).toHaveCount(1);
    });

    test("should edit the end field's name", async ({ page }) => {
      const pipelineBuilderPage = new PipelineBuilderPage(page, pipelineID);
      await pipelineBuilderPage.goto();

      await pipelineBuilderPage.editEndComponentField({
        key: resultFooKey,
        newTitle: resultTestKey,
      });
      await expect(
        pipelineBuilderPage.endNode.getByText(resultTestKey, { exact: true })
      ).toHaveCount(1);

      await pipelineBuilderPage.expectToSave();
      await page.reload();

      await expect(
        pipelineBuilderPage.endNode.getByText(resultTestKey, { exact: true })
      ).toHaveCount(1);
    });

    test("should delete pipeline", async ({ page }) => {
      await deletePipeline(page, pipelineID);
    });
  });
}

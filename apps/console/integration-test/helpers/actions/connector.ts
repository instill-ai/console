import { Page, expect } from "@playwright/test";
import { ConnectorListPage } from "../../pages/connector-list";
import { DataTestID } from "../../data-testid";

export async function deleteConnector(page: Page, connectorID: string) {
  const connectorListPage = new ConnectorListPage(page);
  await connectorListPage.goto();
  await page.getByTestId(`${connectorID}-delete-button`).click();
  const deleteConnectorDialog = page.getByTestId(
    DataTestID.deleteResourceDialog,
  );
  await deleteConnectorDialog
    .locator("input#confirmationCode")
    .fill(connectorID);
  await deleteConnectorDialog.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText(connectorID)).toHaveCount(0);
}

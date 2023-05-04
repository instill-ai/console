import { env, expectToSelectOption } from "./helper";
import { test, expect } from "@playwright/test";
import { expectToDeleteConnector } from "./common/connector";

export function handleAsyncDestinationTest() {
  const destinationId = `destination-async-${Math.floor(
    Math.random() * 10000
  )}`;
  const destinationDescription = "Hi, I am";
  const destinationType = "S3";
  const s3Key = "key_123";
  const s3SecretKey = "key_secret_123";
  const s3BucketName = "bucket_123";
  const s3BucketPath = "bucket_path_123";
  const s3BucketRegion = "us-east-1";
  const s3OutputFormat = "Avro: Apache Avro";
  const s3OutputCompression = "No Compression";

  test.describe.serial("Async destination", () => {
    test("should warn wrong resource ID", async ({ page }) => {
      await page.goto("/destinations/create", { waitUntil: "networkidle" });

      // Should input destination id
      const idField = page.locator("input#destination-id");
      await idField.fill("Wrong-id");

      // Should select destination source - S3
      await expectToSelectOption(
        page.locator("#destination-definition"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(destinationType)
      );

      // Should click set up button
      const setupButton = page.locator("button", { hasText: "Set up" });
      await setupButton.click();

      // Should have warning label
      const warningLabel = page.locator(
        "data-testid=destination-id-label-error"
      );
      await expect(warningLabel).toHaveText(
        "Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum."
      );
    });

    test("should create async destination", async ({ page }) => {
      await page.goto("/destinations/create", { waitUntil: "networkidle" });

      // Should input destination id
      const idField = page.locator("input#destination-id");
      await idField.fill(destinationId);

      // Should select destination source - S3
      await expectToSelectOption(
        page.locator("#destination-definition"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(destinationType)
      );

      // Should input destination description
      const descriptionField = page.locator("textarea#destination-description");
      await descriptionField.fill(destinationDescription);

      // Should input S3 key
      const s3KeyField = page.locator("input#access_key_id");
      await s3KeyField.fill(s3Key);

      // Should input S3 secret key
      const s3SecretField = page.locator("input#secret_access_key");
      await s3SecretField.fill(s3SecretKey);

      // Should input S3 bucket name
      const s3BucketField = page.locator("input#s3_bucket_name");
      await s3BucketField.fill(s3BucketName);

      // Should input S3 bucket path
      const s3BucketPathField = page.locator("input#s3_bucket_path");
      await s3BucketPathField.fill(s3BucketPath);

      // Should Select S3 bucket region
      await expectToSelectOption(
        page.locator("#s3_bucket_region"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(s3BucketRegion)
      );

      // Should select output format
      await expectToSelectOption(
        page.locator("#format"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(s3OutputFormat)
      );

      const compressionCodecOptionTitle = page.locator("h3", {
        hasText: "Compression Codec *",
      });
      await expect(compressionCodecOptionTitle).toHaveCount(1);

      // Should select compression codec
      await expectToSelectOption(
        page.locator("#format\\.compression_codec"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(s3OutputCompression)
      );

      // Should set up destination
      const setupButton = page.locator("button", { hasText: "Set up" });

      await setupButton.isEnabled();

      await Promise.all([
        page.waitForURL(`${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/destinations`),
        setupButton.click(),
      ]);
    });

    test("should have destination list and navigate to destination details page", async ({
      page,
    }) => {
      await page.goto("/destinations", { waitUntil: "networkidle" });

      // Should have model item in list
      const destinationItemTitle = page.locator("h3", {
        hasText: destinationId,
      });
      await expect(destinationItemTitle).toHaveCount(1);

      // Should navigate to destination details page
      await Promise.all([
        page.waitForURL(
          `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/destinations/${destinationId}`
        ),
        page.locator("h3", { hasText: destinationId }).click(),
      ]);
    });

    test("should have proper destination details page", async ({ page }) => {
      await page.goto(`/destinations/${destinationId}`, {
        waitUntil: "networkidle",
      });

      // Should have correct title
      const destinationTitle = page.locator("h2", { hasText: destinationId });
      await expect(destinationTitle).toHaveCount(1);

      // Should have correct destination type
      const destinationTypeOption = page.locator("#destination-definition");
      await expect(destinationTypeOption).toHaveText(destinationType);

      // Should enable edit button
      const editButton = page.locator("button", {
        hasText: "Edit",
      });
      expect(await editButton.isEnabled()).toBeTruthy();

      // Should have correct description
      const descriptionField = page.locator("textarea#destination-description");
      await expect(descriptionField).toHaveValue(destinationDescription);

      // Should have correct S3 Key
      const s3KeyField = page.locator("input#access_key_id");
      await expect(s3KeyField).toHaveValue(s3Key);

      // Should have correct S3 secret key
      const s3SecretField = page.locator("input#secret_access_key");
      await expect(s3SecretField).toHaveValue(s3SecretKey);

      // Should have correct S3 bucket name
      const s3BucketField = page.locator("input#s3_bucket_name");
      await expect(s3BucketField).toHaveValue(s3BucketName);

      // Should have correct S3 bucket path
      const s3BucketPathField = page.locator("#s3_bucket_path");
      await expect(s3BucketPathField).toHaveValue(s3BucketPath);

      // Should have correct S3 bucket region
      await expect(page.locator("#s3_bucket_region")).toHaveText(
        s3BucketRegion
      );

      // Should have correct output format
      await expect(page.locator("#format")).toHaveText(s3OutputFormat);

      // Should have correct compression codec
      await expect(page.locator("#format\\.compression_codec")).toHaveText(
        s3OutputCompression
      );
    });

    test("should update destination configuration", async ({ page }) => {
      const newDestinationDescription = "Hi, I am new";
      const newS3Key = "new_key_123";
      const newS3SecretKey = "new_key_secret_123";
      const newS3BucketName = "new_bucket_123";
      const newS3BucketPath = "new_bucket_path_123";
      const newS3BucketRegion = "us-east-2";
      const newS3OutputFormat = "JSON Lines: Newline-delimited JSON";
      const newS3OutputCompression = "GZIP";

      await page.goto(`/destinations/${destinationId}`, {
        waitUntil: "networkidle",
      });

      // Should have enabled edit button
      const editButton = page.locator("button", { hasText: "Edit" });
      await editButton.click();

      // Should update destination description
      const descriptionField = page.locator("textarea#destination-description");
      expect(await descriptionField.isEditable()).toBeTruthy();
      await descriptionField.fill("");
      await descriptionField.fill(newDestinationDescription);
      await expect(descriptionField).toHaveValue(newDestinationDescription);

      // Should update S3 key
      const s3KeyField = page.locator("input#access_key_id");
      expect(await s3KeyField.isEditable()).toBeTruthy();
      await s3KeyField.fill("");
      await s3KeyField.fill(newS3Key);
      await expect(s3KeyField).toHaveValue(newS3Key);

      // Should update S3 secret key
      const s3SecretField = page.locator("input#secret_access_key");
      expect(await s3SecretField.isEditable()).toBeTruthy();
      await s3SecretField.fill("");
      await s3SecretField.fill(newS3SecretKey);
      await expect(s3SecretField).toHaveValue(newS3SecretKey);

      // Should update S3 bucket name
      const s3BucketField = page.locator("input#s3_bucket_name");
      expect(await s3BucketField.isEditable()).toBeTruthy();
      await s3BucketField.fill("");
      await s3BucketField.fill(newS3BucketName);
      await expect(s3BucketField).toHaveValue(newS3BucketName);

      // Should update S3 bucket path
      const s3BucketPathField = page.locator("input#s3_bucket_path");
      expect(await s3BucketPathField.isEditable()).toBeTruthy();
      await s3BucketPathField.fill("");
      await s3BucketPathField.fill(newS3BucketPath);
      await expect(s3BucketPathField).toHaveValue(newS3BucketPath);

      // Should update S3 bucket region
      await expectToSelectOption(
        page.locator("#s3_bucket_region"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(newS3BucketRegion)
      );

      // Should update output format
      // Should select output format
      await expectToSelectOption(
        page.locator("#format"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(newS3OutputFormat)
      );

      const compressionOptionTitle = page.locator("h3", {
        hasText: "Compression",
      });
      await expect(compressionOptionTitle).toHaveCount(1);

      await expectToSelectOption(
        page.locator("#format\\.compression"),
        page
          .locator(`[data-radix-select-viewport=""]`)
          .getByText(newS3OutputCompression)
      );

      // Save new value
      const saveButton = page.locator("button", { hasText: "Save" });
      await Promise.all([
        page.waitForResponse(
          new URL(
            `/${env(
              "NEXT_PUBLIC_API_VERSION"
            )}/destination-connectors/${destinationId}`,
            `${env("NEXT_PUBLIC_API_GATEWAY_BASE_URL")}`
          ).toString(),
          { timeout: 50000 }
        ),
        saveButton.click(),
      ]);

      // Reload page
      await page.goto(`/destinations/${destinationId}`, {
        waitUntil: "networkidle",
      });

      // Should have updated destination description
      await expect(descriptionField).toHaveValue(newDestinationDescription);

      // Should have updated S3 key
      await expect(s3KeyField).toHaveValue(newS3Key);

      // Should have updated S3 secret key
      await expect(s3SecretField).toHaveValue(newS3SecretKey);

      // Should have updated S3 bucket name
      await expect(s3BucketField).toHaveValue(newS3BucketName);

      // Should have updated S3 bucket path
      await expect(s3BucketPathField).toHaveValue(newS3BucketPath);

      // Should have updated S3 bucket region
      await expect(page.locator("#s3_bucket_region")).toHaveText(
        newS3BucketRegion
      );

      // Should have updated output format
      await expect(page.locator("#format")).toHaveText(newS3OutputFormat);

      // Should have updated compression codec
      await expect(page.locator("#format\\.compression")).toHaveText(
        newS3OutputCompression
      );
    });

    test("should have delete destination modal and correctly delete destination", async ({
      page,
    }) => {
      await expectToDeleteConnector(page, "destination", destinationId);
    });
  });
}

import { test, expect } from "@playwright/test";
import { expectToDeleteConnector } from "./common/connector";
import { deleteDestination, expectToSelectReactSelectOption } from "./helper";

const destinationId = `destination-async-${Math.floor(Math.random() * 10000)}`;
const destinationDescription = "Hi, I am";
const destinationType = "S3";
const s3Key = "key_123";
const s3SecretKey = "key_secret_123";
const s3BucketName = "bucket_123";
const s3BucketPath = "bucket_path_123";
const s3BucketRegion = "us-east-1";
const s3OutputFormat = "Avro: Apache Avro";
const s3OutputCompression = "No Compression";

test.use({
  launchOptions: {
    slowMo: 50,
  },
});

test.afterAll(async () => {
  await deleteDestination(destinationId);
});

test.describe.serial("Async destination", () => {
  test("should create async destination", async ({ page }) => {
    await page.goto("/destinations/create");

    // Should input destination id
    const idField = page.locator("input#id");
    await idField.fill(destinationId);

    // Should select destination source - S3
    await expectToSelectReactSelectOption(
      page.locator("#react-select-definition-input"),
      page.locator("data-testid=definition-selected-option", {
        hasText: destinationType,
      })
    );

    // Should input destination description
    const descriptionField = page.locator("textarea#description");
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
    await expectToSelectReactSelectOption(
      page.locator("#react-select-s3_bucket_region-input"),
      page.locator("data-testid=s3_bucket_region-selected-option", {
        hasText: s3BucketRegion,
      })
    );

    // Should select output format
    await expectToSelectReactSelectOption(
      page.locator("#react-select-format-input"),
      page.locator("data-testid=format-selected-option", {
        hasText: s3OutputFormat,
      })
    );

    const compressionCodecOptionTitle = page.locator("h3", {
      hasText: "Compression Codec *",
    });
    await expect(compressionCodecOptionTitle).toHaveCount(1);

    // Should select compression codec
    await expectToSelectReactSelectOption(
      page.locator("input[id='react-select-format.compression_codec-input']"),
      page.locator(
        "div[data-testid='format.compression_codec-selected-option']",
        {
          hasText: s3OutputCompression,
        }
      )
    );

    // Should set up destination
    const setupButton = page.locator("button", { hasText: "Set up" });
    await Promise.all([page.waitForNavigation(), setupButton.click()]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/destinations`
    );
  });

  test("should have destination list and navigate to destination details page", async ({
    page,
  }) => {
    await page.goto("/destinations");

    // Should have model item in list
    const destinationItemTitle = page.locator("h3", { hasText: destinationId });
    await expect(destinationItemTitle).toHaveCount(1);

    // Should navigate to destination details page
    await Promise.all([
      page.waitForNavigation(),
      page.locator("h3", { hasText: destinationId }).click(),
    ]);
    expect(page.url()).toEqual(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/destinations/${destinationId}`
    );
  });

  test("should have proper destination details page", async ({ page }) => {
    await page.goto(`/destinations/${destinationId}`);

    // Should have correct title
    const destinationTitle = page.locator("h2", { hasText: destinationId });
    await expect(destinationTitle).toHaveCount(1);

    // Should have correct destination type
    const destinationTypeOption = page.locator(
      "data-testid=definition-selected-option"
    );
    await expect(destinationTypeOption).toHaveText(destinationType);

    // Should enable edit button
    const editButton = page.locator("button", {
      hasText: "Edit",
    });
    expect(await editButton.isEnabled()).toBeTruthy();

    // Should have correct description
    const descriptionField = page.locator("textarea#description");
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
    const s3BucketPathField = page.locator("input#s3_bucket_path");
    await expect(s3BucketPathField).toHaveValue(s3BucketPath);

    // Should have correct S3 bucket region
    await expect(
      page.locator("data-testid=s3_bucket_region-selected-option")
    ).toHaveText(s3BucketRegion);

    // Should have correct output format
    await expect(page.locator("data-testid=format-selected-option")).toHaveText(
      s3OutputFormat
    );

    // Should have correct compression codec
    await expect(
      page.locator(
        "div[data-testid='format.compression_codec-selected-option']"
      )
    ).toHaveText(s3OutputCompression);
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

    await page.goto(`/destinations/${destinationId}`);

    // Should have enabled edit button
    const editButton = page.locator("button", { hasText: "Edit" });
    await editButton.click();

    // Should update destination description
    const descriptionField = page.locator("textarea#description");
    expect(await descriptionField.isEditable()).toBeTruthy();
    await descriptionField.fill("");
    await descriptionField.type(newDestinationDescription);
    await expect(descriptionField).toHaveValue(newDestinationDescription);

    // Should update S3 key
    const s3KeyField = page.locator("input#access_key_id");
    expect(await s3KeyField.isEditable()).toBeTruthy();
    await s3KeyField.fill("");
    await s3KeyField.type(newS3Key);
    await expect(s3KeyField).toHaveValue(newS3Key);

    // Should update S3 secret key
    const s3SecretField = page.locator("input#secret_access_key");
    expect(await s3SecretField.isEditable()).toBeTruthy();
    await s3SecretField.fill("");
    await s3SecretField.type(newS3SecretKey);
    await expect(s3SecretField).toHaveValue(newS3SecretKey);

    // Should update S3 bucket name
    const s3BucketField = page.locator("input#s3_bucket_name");
    expect(await s3BucketField.isEditable()).toBeTruthy();
    await s3BucketField.fill("");
    await s3BucketField.type(newS3BucketName);
    await expect(s3BucketField).toHaveValue(newS3BucketName);

    // Should update S3 bucket path
    const s3BucketPathField = page.locator("input#s3_bucket_path");
    expect(await s3BucketPathField.isEditable()).toBeTruthy();
    await s3BucketPathField.fill("");
    await s3BucketPathField.type(newS3BucketPath);
    await expect(s3BucketPathField).toHaveValue(newS3BucketPath);

    // Should update S3 bucket region
    await expectToSelectReactSelectOption(
      page.locator("#react-select-s3_bucket_region-input"),
      page.locator("data-testid=s3_bucket_region-selected-option", {
        hasText: newS3BucketRegion,
      })
    );

    // Should update output format
    await expectToSelectReactSelectOption(
      page.locator("#react-select-format-input"),
      page.locator("data-testid=format-selected-option", {
        hasText: newS3OutputFormat,
      })
    );

    const compressionOptionTitle = page.locator("h3", {
      hasText: "Compression",
    });
    await expect(compressionOptionTitle).toHaveCount(1);

    // Should select compression option
    await expectToSelectReactSelectOption(
      page.locator("input[id='react-select-format.compression-input']"),
      page.locator("div[data-testid='format.compression-selected-option']", {
        hasText: newS3OutputCompression,
      })
    );

    // Save new value
    const saveButton = page.locator("button", { hasText: "Save" });
    await Promise.all([
      page.waitForResponse(
        new URL(
          `/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors/${destinationId}`,
          `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}`
        ).toString(),
        { timeout: 50000 }
      ),
      saveButton.click(),
    ]);

    // Reload page
    await page.goto(`/destinations/${destinationId}`);

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
    await expect(
      page.locator("data-testid=s3_bucket_region-selected-option")
    ).toHaveText(newS3BucketRegion);

    // Should have updated output format
    await expect(page.locator("data-testid=format-selected-option")).toHaveText(
      newS3OutputFormat
    );

    // Should have updated compression codec
    await expect(
      page.locator("div[data-testid='format.compression-selected-option']")
    ).toHaveText(newS3OutputCompression);
  });

  test("should have delete destination modal and correctly delete destination", async ({
    page,
  }) => {
    await expectToDeleteConnector(page, "destination", destinationId);
  });
});

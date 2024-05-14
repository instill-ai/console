"use client";

import cn from "clsx";
import { Form, Icons, Select, Tooltip } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, InstillCredentialMap } from "../../types";
import { FieldDescriptionTooltip } from "../common";
import { InstillCredit } from "../../../../constant";

export const SingleSelectField = ({
  form,
  path,
  title,
  options,
  description,
  shortDescription,
  disabled,
  size,
  isHidden,
  instillCredentialMap,
  updateSupportInstillCredit,
  updateForceCloseCollapsibleFormGroups,
  updateForceOpenCollapsibleFormGroups,
  updateIsUsingInstillCredit,
}: {
  options: string[];
  shortDescription?: string;
  disabled?: boolean;
  instillCredentialMap?: InstillCredentialMap;
  updateSupportInstillCredit?: React.Dispatch<React.SetStateAction<boolean>>;
  updateForceCloseCollapsibleFormGroups?: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  updateForceOpenCollapsibleFormGroups?: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  updateIsUsingInstillCredit?: React.Dispatch<React.SetStateAction<boolean>>;
} & AutoFormFieldBaseProps) => {
  return isHidden ? null : (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item>
            <div className="flex flex-row gap-x-2">
              <Form.Label
                className={size === "sm" ? "!product-body-text-4-medium" : ""}
              >
                {title}
              </Form.Label>
              <FieldDescriptionTooltip description={description} />
            </div>
            <Select.Root
              onValueChange={(e) => {
                field.onChange(e);

                // Operate credit related flow
                // 1. When user select option that support credit, we will check
                //    whether the field has value, if not, we will fill in the
                //    credit key into the field
                // 2. When user select option that doesn't support credit, we will
                //    clear the field value and focus on the field

                if (instillCredentialMap) {
                  const currentCredentialFieldPath =
                    instillCredentialMap.targets[0];

                  const currentCredentialFieldValue = form.getValues(
                    currentCredentialFieldPath
                  );

                  // Deal with case that support instill credit, if the secret field
                  // is empty, we will fill in the instill credit key into that field
                  if (instillCredentialMap.values.includes(e)) {
                    if (!currentCredentialFieldValue) {
                      form.setValue(
                        currentCredentialFieldPath,
                        "${secret." + `${InstillCredit.key}` + "}"
                      );
                    }

                    if (updateSupportInstillCredit) {
                      updateSupportInstillCredit(true);
                    }

                    if (updateIsUsingInstillCredit) {
                      updateIsUsingInstillCredit(true);
                    }

                    if (updateForceCloseCollapsibleFormGroups) {
                      const toplevelPath =
                        currentCredentialFieldPath.split(".")[0];
                      updateForceCloseCollapsibleFormGroups((prev) => [
                        ...prev,
                        toplevelPath,
                      ]);
                    }
                  } else {
                    // Deal with case that don't support instil credit. We
                    // will focus on the secret field and clear the value

                    if (currentCredentialFieldValue) {
                      form.setValue(currentCredentialFieldPath, "");
                      form.clearErrors(currentCredentialFieldPath);
                    }

                    if (updateSupportInstillCredit) {
                      updateSupportInstillCredit(false);
                    }

                    if (updateForceOpenCollapsibleFormGroups) {
                      const toplevelPath =
                        currentCredentialFieldPath.split(".")[0];
                      updateForceOpenCollapsibleFormGroups((prev) => [
                        ...prev,
                        toplevelPath,
                      ]);
                    }

                    // We can not make the value change and focus event at the same
                    // cycle, due to the field render will wash out the focus event
                    // So we need to set a timeout to make sure the focus event will
                    // be triggered after the value change event
                    setTimeout(() => {
                      form.setFocus(currentCredentialFieldPath);
                    }, 200);
                  }
                }
              }}
              // Sometime airbyte will put "" in their enum, this will break Radix select
              value={field.value === "" ? undefined : field.value ?? undefined}
              disabled={disabled}
            >
              <Form.Control>
                <Select.Trigger
                  className={cn(
                    "w-full",
                    size === "sm" ? "!product-body-text-4-regular" : ""
                  )}
                >
                  <Select.Value />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {options
                  .filter((e) => e !== "")
                  .map((option) => {
                    return (
                      <Select.Item
                        key={option}
                        value={option}
                        className={cn(
                          "group my-auto !flex !flex-row justify-between text-semantic-fg-primary group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary",
                          size === "sm"
                            ? "!product-body-text-4-regular"
                            : "product-body-text-3-regular"
                        )}
                      >
                        <Select.ItemText>
                          <p className="my-auto">{option}</p>
                        </Select.ItemText>
                        {instillCredentialMap &&
                        instillCredentialMap.values.includes(option) ? (
                          <Tooltip.Provider>
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <Icons.CoinsStacked01 className="my-auto h-4 w-4 cursor-pointer stroke-semantic-fg-secondary group-hover:stroke-semantic-bg-primary" />
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  className="w-[320px]"
                                  sideOffset={5}
                                  side="right"
                                >
                                  <div className="flex flex-col gap-y-1 rounded-sm bg-semantic-bg-primary p-3">
                                    <p className="text-semantic-fg-primary product-body-text-4-medium">
                                      Instill Credit
                                    </p>
                                    <p className="text-semantic-fg-primary product-body-text-4-medium">
                                      {`This ${title} support Instill Credit.`}
                                    </p>
                                  </div>
                                  <Tooltip.Arrow
                                    className="fill-white"
                                    offset={5}
                                    width={9}
                                    height={6}
                                  />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          </Tooltip.Provider>
                        ) : null}
                      </Select.Item>
                    );
                  })}
              </Select.Content>
            </Select.Root>
            <Form.Message
              className={cn(
                "nodrag nopan cursor-text select-text",
                size === "sm" ? "!product-body-text-4-medium" : ""
              )}
            />
          </Form.Item>
        );
      }}
    />
  );
};

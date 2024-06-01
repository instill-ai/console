"use client";

import * as React from "react";
import cn from "clsx";
import { Form, Icons, Select, Tooltip } from "@instill-ai/design-system";
import {
  AutoFormFieldBaseProps,
  InstillCredentialMap,
  InstillFormTree,
} from "../../types";
import { FieldDescriptionTooltip } from "../common";
import { InstillCredit } from "../../../../constant";
import { dot } from "../../../dot";

export const SingleSelectField = ({
  tree,
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
  tree: InstillFormTree;
  options: string[];
  shortDescription?: string;
  disabled?: boolean;
  instillCredentialMap?: InstillCredentialMap;
  updateSupportInstillCredit?: React.Dispatch<React.SetStateAction<boolean>>;
  updateIsUsingInstillCredit?: React.Dispatch<React.SetStateAction<boolean>>;
  updateForceCloseCollapsibleFormGroups?: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  updateForceOpenCollapsibleFormGroups?: React.Dispatch<
    React.SetStateAction<string[]>
  >;
} & AutoFormFieldBaseProps) => {
  const { watch } = form;

  // Operate credit related flow
  // 1. When user select option that support credit, we will check
  //    whether the field has value, if not, we will fill in the
  //    credit key into the field
  // 2. When user select option that doesn't support credit, we will
  //    clear the field value and focus on the field
  // 3. when user first time switch to TASK_TEXT_GENERATION, we will
  //    set the model value to gpt-3.5-turbo, and this model support
  //    instill credit.
  React.useEffect(() => {
    const sub = watch((values, { name }) => {
      const fieldValue = dot.getter(values, path);

      // This is a workaround before we clean up the initial value bug
      // in the useInstillForm, the issue is around the name will be
      // undefined from time to time when we switch the task
      let isInstillCreditField = false;

      if (name === path && instillCredentialMap) {
        isInstillCreditField = true;
      } else {
        if (
          name === undefined &&
          (path === "input.engine" || path === "input.model")
        ) {
          isInstillCreditField = true;
        }
      }

      if (isInstillCreditField && instillCredentialMap) {
        const currentCredentialFieldPath = instillCredentialMap.targets[0];

        const currentCredentialFieldValue = dot.getter(
          values,
          currentCredentialFieldPath
        );

        // Deal with case that support instill credit, if the secret field
        // is empty, we will fill in the instill credit key into that field
        if (instillCredentialMap.values.includes(fieldValue)) {
          if (
            !currentCredentialFieldValue &&
            name !== currentCredentialFieldPath
          ) {
            form.setValue(
              currentCredentialFieldPath,
              "${secret." + `${InstillCredit.key}` + "}"
            );

            if (updateForceCloseCollapsibleFormGroups) {
              const toplevelPath = currentCredentialFieldPath.split(".")[0];
              updateForceCloseCollapsibleFormGroups((prev) => [
                ...prev,
                toplevelPath,
              ]);
            }
          }

          if (updateSupportInstillCredit) {
            updateSupportInstillCredit(true);
          }

          if (updateIsUsingInstillCredit) {
            updateIsUsingInstillCredit(true);
          }
        } else {
          // Deal with case that don't support instil credit. We
          // will focus on the secret field and clear the value

          if (
            currentCredentialFieldValue &&
            name &&
            name !== currentCredentialFieldPath
          ) {
            form.setValue(currentCredentialFieldPath, "");
            form.clearErrors(currentCredentialFieldPath);
          }

          if (updateSupportInstillCredit) {
            updateSupportInstillCredit(false);
          }

          if (updateIsUsingInstillCredit) {
            updateIsUsingInstillCredit(false);
          }

          if (updateForceOpenCollapsibleFormGroups) {
            const toplevelPath = currentCredentialFieldPath.split(".")[0];
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

      if (isInstillCreditField && !instillCredentialMap) {
        if (updateSupportInstillCredit) {
          updateSupportInstillCredit(false);
        }

        if (updateIsUsingInstillCredit) {
          updateIsUsingInstillCredit(false);
        }
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [
    watch,
    instillCredentialMap,
    updateSupportInstillCredit,
    form,
    path,
    updateIsUsingInstillCredit,
    updateForceCloseCollapsibleFormGroups,
    updateForceOpenCollapsibleFormGroups,
    tree,
  ]);

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
            <Form.Description
              className={cn(
                "nodrag nopan cursor-text select-text",
                size === "sm" ? "!product-body-text-4-regular" : ""
              )}
              text={shortDescription ?? null}
            />
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

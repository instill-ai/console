import cn from "clsx";
import {
  Button,
  Dialog,
  Icons,
  Switch,
  Tooltip,
  useToast,
} from "@instill-ai/design-system";
import * as React from "react";
import {
  Nullable,
  UpdateUserPipelinePayload,
  env,
  getInstillApiErrorMessage,
  useUpdateUserPipeline,
  useUserPipeline,
} from "../../../lib";
import { useRouter } from "next/router";
import { isAxiosError } from "axios";
import { LoadingSpin } from "../../../components";
import { usePipelineBuilderStore } from "../usePipelineBuilderStore";

export type SharePipelineDialogProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const SharePipelineDialog = (props: SharePipelineDialogProps) => {
  const { accessToken, enableQuery } = props;
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const router = useRouter();
  const { id, entity } = router.query;
  const [isUpdatingUsersPermission, setIsUpdatingUsersPermission] =
    React.useState(false);
  const [isUpdatingShareCodePermission, setIsUpdatingShareCodePermission] =
    React.useState(false);

  const pipelineIsNew = usePipelineBuilderStore((state) => state.pipelineIsNew);

  const { toast } = useToast();

  const pipeline = useUserPipeline({
    pipelineName: `users/${entity}/pipelines/${id}`,
    accessToken,
    enabled: enableQuery && !pipelineIsNew,
  });

  const updatePipeline = useUpdateUserPipeline();

  const pipelineIsPublic = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return false;
    }

    const toplevelRule = pipeline.data.permission.users["users/*"];

    if (toplevelRule && toplevelRule.enabled) {
      return true;
    } else {
      return false;
    }
  }, [pipeline.data, pipeline.isSuccess]);

  const enableShareCode = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return false;
    }

    const toplevelRule = pipeline.data.permission.share_code;

    if (toplevelRule && toplevelRule.enabled) {
      return true;
    } else {
      return false;
    }
  }, [pipeline.isSuccess, pipeline.data]);

  const disableCopyLink = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return true;
    }

    if (pipelineIsPublic) {
      return false;
    }

    if (enableShareCode) {
      return false;
    }

    return true;
  }, [pipeline.isSuccess, pipelineIsPublic, enableShareCode]);

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger asChild>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          variant="primary"
          size="lg"
          disabled={!pipeline.isSuccess}
        >
          Share
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="!p-0 !w-[480px]">
        <div className="flex w-full h-full flex-col">
          <div className="px-6 py-3 flex border-b border-semantic-bg-line">
            <p className="my-auto product-button-button-2 text-semantic-accent-pressed">
              Share
            </p>
          </div>
          <div className="flex flex-col px-6 py-3 gap-y-3">
            <div className="flex flex-col">
              <div className="mb-3 flex flex-row gap-x-2">
                <p className="product-body-text-3-semibold">
                  Make the Pipeline Public
                </p>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild={true}>
                      <Icons.HelpCircle className="w-4 h-4 stroke-semantic-fg-secondary" />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className="!px-3 !py-2 !w-[300px] rounded-sm !product-body-text-4-semibold bg-semantic-bg-primary">
                        A public pipeline can be viewed by any logged in user in
                        Instill Cloud, but it can not be edited or triggered.
                        <Tooltip.Arrow
                          className="fill-semantic-bg-primary"
                          offset={10}
                          width={9}
                          height={6}
                        />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
              <div className="flex flex-row gap-x-3">
                <Switch
                  checked={pipelineIsPublic}
                  onCheckedChange={async (check) => {
                    if (!pipeline.isSuccess) return;

                    setIsUpdatingUsersPermission(true);

                    const payload: UpdateUserPipelinePayload = {
                      name: `users/${entity}/pipelines/${id}`,
                      permission: {
                        users: {
                          ...pipeline.data.permission.users,
                          "users/*": {
                            enabled: check,
                            role: "ROLE_VIEWER",
                          },
                        },
                        share_code:
                          pipeline.data?.permission.share_code ?? null,
                      },
                    };

                    try {
                      await updatePipeline.mutateAsync({
                        payload,
                        accessToken,
                      });
                      setIsUpdatingUsersPermission(false);
                    } catch (error) {
                      setIsUpdatingUsersPermission(false);
                      if (isAxiosError(error)) {
                        toast({
                          title:
                            "Something went wrong when switch pipeline permission",
                          variant: "alert-error",
                          size: "large",
                          description: getInstillApiErrorMessage(error),
                        });
                      } else {
                        toast({
                          title:
                            "Something went wrong when switch pipeline permission",
                          variant: "alert-error",
                          size: "large",
                          description: "Please try again later",
                        });
                      }
                    }
                  }}
                  disabled={!pipeline.isSuccess}
                />
                <div>
                  <LoadingSpin
                    className={cn(
                      "!text-black",
                      isUpdatingUsersPermission ? "" : "hidden"
                    )}
                  />
                </div>
              </div>
            </div>
            {!pipelineIsPublic ? (
              <div className="flex flex-col">
                <div className="flex mb-3 flex-row gap-x-2">
                  <p className="product-body-text-3-semibold">Share by link</p>
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild={true}>
                        <Icons.HelpCircle className="w-4 h-4 stroke-semantic-fg-secondary" />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="!px-3 !w-[300px] !py-2 rounded-sm !product-body-text-4-semibold bg-semantic-bg-primary">
                          Users with the link can view the pipeline, but they
                          can not edit or trigger the pipeline
                          <Tooltip.Arrow
                            className="fill-semantic-bg-primary"
                            offset={10}
                            width={9}
                            height={6}
                          />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
                <div className="flex flex-row gap-x-3">
                  <Switch
                    checked={enableShareCode}
                    onCheckedChange={async (check) => {
                      if (!pipeline.isSuccess) return;

                      setIsUpdatingShareCodePermission(true);

                      const payload: UpdateUserPipelinePayload = {
                        name: `users/${entity}/pipelines/${id}`,
                        permission: {
                          users: pipeline.data.permission.users,
                          share_code: {
                            user: "users/*",
                            role: pipeline.data.permission.share_code?.role
                              ? pipeline.data.permission.share_code.role
                              : "ROLE_VIEWER",
                            enabled: check,
                          },
                        },
                      };

                      try {
                        await updatePipeline.mutateAsync({
                          payload,
                          accessToken,
                        });
                        setIsUpdatingShareCodePermission(false);
                      } catch (error) {
                        setIsUpdatingShareCodePermission(false);
                        if (isAxiosError(error)) {
                          toast({
                            title:
                              "Something went wrong when switch pipeline permission",
                            variant: "alert-error",
                            size: "large",
                            description: getInstillApiErrorMessage(error),
                          });
                        } else {
                          toast({
                            title:
                              "Something went wrong when switch pipeline permission",
                            variant: "alert-error",
                            size: "large",
                            description: "Please try again later",
                          });
                        }
                      }
                    }}
                    disabled={!pipeline.isSuccess}
                  />
                  <div>
                    <LoadingSpin
                      className={cn(
                        "!text-black",
                        isUpdatingShareCodePermission ? "" : "hidden"
                      )}
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-x-3">
                {pipelineIsPublic || enableShareCode ? (
                  <Icons.LockUnlocked03 className="my-auto w-6 h-6 stroke-semantic-fg-secondary" />
                ) : (
                  <Icons.Lock03 className="my-auto w-6 h-6 stroke-semantic-fg-secondary" />
                )}
                <p className="my-auto product-button-button-3">
                  {pipelineIsPublic
                    ? "Anyone can view this pipeline"
                    : enableShareCode
                    ? "Anyone with the link"
                    : "Only you can view this pipeline"}
                </p>
              </div>
              <Button
                disabled={disableCopyLink}
                onClick={async () => {
                  if (!pipeline.isSuccess) return;

                  const link = pipelineIsPublic
                    ? `${env(
                        "NEXT_PUBLIC_CONSOLE_BASE_URL"
                      )}/${entity}/pipelines/${id}`
                    : enableShareCode
                    ? `${env(
                        "NEXT_PUBLIC_CONSOLE_BASE_URL"
                      )}/${entity}/pipelines/${id}?view=${pipeline.data
                        .permission.share_code?.code}`
                    : "";
                  await navigator.clipboard.writeText(link);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 1000);
                }}
                className="gap-x-2"
                variant="tertiaryColour"
                size="md"
              >
                {copied ? (
                  <Icons.Check className="my-auto w-[14px] h-[14px] stroke-semantic-accent-default" />
                ) : (
                  <Icons.Link01 className="my-auto w-[14px] h-[14px] stroke-semantic-accent-default" />
                )}
                Copy Link
              </Button>
            </div>
          </div>
        </div>
        <Dialog.Close className="!right-6 !top-3" />
      </Dialog.Content>
    </Dialog.Root>
  );
};

"use client";

import * as z from "zod";
import { Position } from "reactflow";

import { CustomHandle } from "../../CustomHandle";

export const CreateStartOperatorInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  key: z.string().min(1, { message: "Key is required" }),
});

export const TriggerNode = () => {
  return (
    <div className="h-32 w-32 border-2 border-semantic-accent-default">
      <CustomHandle id="main" type="source" position={Position.Right} />
    </div>
  );

  // return (
  //   <NodeWrapper
  //     nodeData={data}
  //     noteIsOpen={noteIsOpen}
  //     disabledTargetHandler={true}
  //   >
  //     <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
  //       <div className="mr-auto flex flex-row gap-x-2">
  //         <div className="my-auto flex h-6 w-6 rounded bg-semantic-bg-line">
  //           <Icons.Lightning01 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
  //         </div>
  //         <p className="my-auto py-2 text-semantic-fg-secondary product-body-text-4-medium">
  //           trigger
  //         </p>
  //       </div>
  //       <TriggerResponseNodeControlPanel
  //         type="trigger"
  //         nodeIsCollapsed={nodeIsCollapsed}
  //         setNodeIsCollapsed={setNodeIsCollapsed}
  //         handleToggleNote={() => setNoteIsOpen(!noteIsOpen)}
  //         noteIsOpen={noteIsOpen}
  //         disabledReferenceHint={disabledReferenceHint}
  //         setDisabledReferenceHint={setDisabledReferenceHint}
  //       />
  //     </NodeHead>
  //     {nodeIsCollapsed ? null : (
  //       <div className="nodrag nowheel flex flex-col">
  //         {isCreating || isEditing ? (
  //           <TriggerNodeFreeForm
  //             form={form}
  //             selectedType={selectedType}
  //             setSelectedType={setSelectedType}
  //             onCreateFreeFormField={onCreateFreeFormField}
  //             onCancel={onCancelFreeForm}
  //             isEditing={isEditing}
  //           />
  //         ) : (
  //           <div className="flex flex-col gap-y-3">
  //             <Form.Root {...triggerPipelineForm}>
  //               <form
  //                 id="trigger-node-trigger-pipeline-form"
  //                 className="w-full"
  //                 onSubmit={triggerPipelineForm.handleSubmit(onTriggerPipeline)}
  //               >
  //                 <VerticalSortableWrapper
  //                   // we directly use the key as the id, because the key is guarded
  //                   // but our auto-form, it should be always present
  //                   items={triggerPipelineFormFields.map((e) => ({
  //                     key: e.key as string,
  //                   }))}
  //                   onDragEnd={(event) => {
  //                     const { active, over } = event;

  //                     if (over && active.id !== over.id) {
  //                       const oldIndex = triggerPipelineFormFields.findIndex(
  //                         (e) => e.key === active.id
  //                       );
  //                       const newIndex = triggerPipelineFormFields.findIndex(
  //                         (e) => e.key === over.id
  //                       );

  //                       const newFieldItems = arrayMove(
  //                         triggerPipelineFormFields,
  //                         oldIndex,
  //                         newIndex
  //                       );

  //                       if (newFieldItems.length > 0) {
  //                         const newNodes = nodes.map((node) => {
  //                           if (isTriggerNode(node)) {
  //                             const newFields = Object.fromEntries(
  //                               Object.entries(node.data.fields).map(
  //                                 ([key, value]) => {
  //                                   const newFieldIndex =
  //                                     newFieldItems.findIndex(
  //                                       (e) => e.key === key
  //                                     );

  //                                   if (newFieldIndex !== -1) {
  //                                     return [
  //                                       key,
  //                                       {
  //                                         ...value,
  //                                         instill_ui_order: newFieldIndex,
  //                                       },
  //                                     ];
  //                                   }

  //                                   return [key, value];
  //                                 }
  //                               )
  //                             );

  //                             node.data = {
  //                               ...node.data,
  //                               fields: newFields,
  //                             };
  //                           }
  //                           return node;
  //                         });

  //                         updateNodes(() => newNodes);
  //                         updatePipelineRecipeIsDirty(() => true);
  //                       }
  //                     }
  //                   }}
  //                 >
  //                   <div className="flex flex-col gap-y-4">
  //                     {triggerPipelineFormFields.map((item) => (
  //                       <NodeSortableFieldWrapper
  //                         key={item.key}
  //                         path={item.key as string}
  //                       >
  //                         {item}
  //                       </NodeSortableFieldWrapper>
  //                     ))}
  //                   </div>
  //                 </VerticalSortableWrapper>
  //               </form>
  //             </Form.Root>
  //             <Button
  //               className="flex w-full flex-1 gap-x-2"
  //               variant="tertiaryColour"
  //               onClick={() => {
  //                 // Set the default selected type to string
  //                 setSelectedType("string");
  //                 setIsCreating(true);
  //               }}
  //               disabled={disabledAddFieldButton}
  //               type="button"
  //             >
  //               <p className="my-auto pt-0.5">Add Field</p>
  //               <Icons.Plus
  //                 className={cn(
  //                   "my-auto h-4 w-4 stroke-semantic-accent-default",
  //                   disabledAddFieldButton
  //                     ? "stroke-semantic-fg-secondary"
  //                     : "stroke-semantic-accent-default"
  //                 )}
  //               />
  //             </Button>
  //           </div>
  //         )}
  //       </div>
  //     )}
  //   </NodeWrapper>
  // );
};

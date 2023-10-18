/* eslint-disable no-useless-escape */

export const core = `curl -X POST {vdp-pipeline-base-url}/vdp/v1alpha/{pipeline-name}/trigger \\
--header 'Content-Type: application/json' \\
--data \'{input-array}'
`;

export const cloud = `curl -X POST {vdp-pipeline-base-url}/vdp/v1alpha/{pipeline-name}/trigger' \\
--header 'Content-Type: application/json' \\ 
--header 'Authorization: Bearer <api_token>' \\
--data \ '{input-array}'
`;

export const triggerPipelineSnippets = {
  core,
  cloud,
};

/* eslint-disable no-useless-escape */

export const cloud = `curl -X POST {vdp-pipeline-base-url}/v1alpha/{pipeline-name}/trigger \\
--header 'Content-Type: application/json' \\
--data \\'{input-array}'
`;

export const ce = `curl --location {vdp-pipeline-base-url}/v1alpha/{user-name}/{pipeline-name}/trigger' \
--header 'Content-Type: application/json'
--header 'Authorization: Bearer <api_token>' \\
--data \\'{input-array}'
`;

export const triggerPipelineSnippets = {
  cloud,
  ce,
};

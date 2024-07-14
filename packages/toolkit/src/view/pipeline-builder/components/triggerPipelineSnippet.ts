/* eslint-disable no-useless-escape */

export const triggerPipelineSnippet = `curl -X POST '{vdp-pipeline-base-url}/v1beta/{pipeline-name}/{trigger-endpoint}' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer $INSTILL_API_TOKEN' \\
--data '{input-array}'
`;

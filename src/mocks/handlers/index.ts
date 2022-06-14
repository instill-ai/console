import { getPipelineHandler } from "./pipeline";
import { getSourceHandler } from "./connector/source";

const handlers = [getPipelineHandler, getSourceHandler];

export default handlers;

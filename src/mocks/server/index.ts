import handlers from "mocks/handlers";
import { setupServer } from "msw/node";

const server = setupServer(...handlers);

export default server;

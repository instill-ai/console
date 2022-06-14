// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// ref: https://nextjs.org/docs/basic-features/environment-variables#test-environment-variables
import { loadEnvConfig } from "@next/env";
import axios from "axios";
import { server } from "./src/mocks";

loadEnvConfig(process.cwd());

beforeAll(() => {
  // To avoid Error: Cross origin http://localhost forbidden
  axios.defaults.adapter = require("axios/lib/adapters/http");
  server.listen();
});
afterAll(() => server.close());

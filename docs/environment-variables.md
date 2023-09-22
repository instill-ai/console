## About environment variables

### TLDR

- We introduce `./next-env.mjs` which digests the inline env variables and `.env` file then generate an `__env.js` file.
- It will digest the environment variables from the `.env` file and the `process.env` object. (You can specify that only the variable with the prefix `NEXT_PUBLIC_` in the `process.env` will be digested, but it will digest all the variables in the `.env` file.)
- We digest the `__env.js` file into HTML, it will inject additional variables into the window object.
- We use a helper function in `/src/utils/config.ts` to access the window object and get the variables.
- We can still use `process.env` to access the variables in the server-side code.

### In details

In order to empower users to dynamically set up environment variables (They can take down all VDP services, change the console environment variables in the docker-compose then make dev again to update the environment variable in the container.) We need Next.js runtime environment variables instead of normal variables that passed with process.env.

We introduce the shell script `./next-env.mjs`. This script will read through the ./.env file and override it if you pass the new environment variable through docker-compose or `docker run -e` (Just as how we did it in `pnpm docker-run` command.)

This script will then generate a `__env.js` under `/public` folder. Then we include this script into our HTML in the `/src/pages/_document.tsx` file. 

After embedding this script into the root, this `__env.js` will inject the environment variables into the window object so we can access it in the client-side code. We have a helper function lying in the `/src/utils/config.ts` that can help us simplify the process of retrieving the variables.

For server-side code, we will alter the ./.env file in the image. It can also access the newly assigned variables by simply using `process.env`

### How to use

- When in development, please change the variables in the .env file.
- When in production, please change the `docker run -e` argument or change the environment config in the docker-compose file.

### Caveats

- Be careful of the env prefix. For example, if you have inlined env CONSOLE_BASE_URL, but in the env file it is written as NEXT_PUBLIC_CONSOLE_BASE_URL, the `next-env.mjs` will not find this env in `.env` file and alter it. We recommend you add `NEXT_PUBLIC_` prefix in all the env related to Next.js

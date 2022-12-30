import { getModelOperationQuery } from "./queries";

export const checkCreateModelOperationUntilDone = async (
  operationName: string
) => {
  try {
    const operation = await getModelOperationQuery(operationName);
    if (operation.done) {
      return Promise.resolve(true);
    } else {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await checkCreateModelOperationUntilDone(
            operationName
          );
          resolve(result);
        }, 1500);
      });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

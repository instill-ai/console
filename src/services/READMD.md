## About Console Service

- Data preparation of join (collect pipeline related recipe details) occur at react-query hook inside of @services

### About the long-running operation

 Currently, there have two long-running operation in the instill backend.

 - Create model
 - Deploy model

These action will be implemented with `waitForStatus` flag.

- When the `waitForStatus` flag is true, the services will periodically checking the endpoint until the status is not unspecified
- When the `waitForStatus` flag is false, the services will invalidate the key of react-query and then return the operation object.

To deal with this kind of service when `waitForStatus` flag is false, you always need to retrieve new data in some form. For example, periodically checking the status or forcing user to refresh the page.
## About Console Service

- Data preparation of join (collect pipeline related recipe details) occur at react-query hook inside of @services

### About the long-running operation

Currently, there have two long-running operation in the instill backend.

- Create model
  - Upon creation, the model won't be in the model-backend immediately, you need to check the operation status. Once it's finished the model will be in the model-backend that is queryable.
- Deploy model

#### Note

- The return object will be operation. You need to query operation endpoint to access the operation resource. 
- The service will invalidate the whole data query. For example, once a model creation occur, we will invalidate the whole ["model"] key set immediately.
- When you catch the onSuccess singal of react-query service and begin to periodically check operation endpoint for status. You should update the whole react-query cache once you get the new resouce.
- Operation data is volatile, we don't persist it in react-query cache.
- We will not do the fine-grained cache update right now, we will just invalidate the cache.

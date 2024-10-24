# Changelog

## [0.10.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.9.0...instill-sdk-v0.10.0) (2024-10-24)


### Features

* show credit owner for runs ([#1561](https://github.com/instill-ai/console/issues/1561)) ([93a275a](https://github.com/instill-ai/console/commit/93a275aa2239f16e45c5445a7380c51b0972ec56))

## [0.9.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.8.0...instill-sdk-v0.9.0) (2024-10-22)


### Features

* **application:** add ifAll to listMessages ([#1550](https://github.com/instill-ai/console/issues/1550)) ([9e87490](https://github.com/instill-ai/console/commit/9e874904484fa9164670cbef453500bdd55fdaf4))
* put back image input preview, clean up ([#1546](https://github.com/instill-ai/console/issues/1546)) ([9a65578](https://github.com/instill-ai/console/commit/9a65578f751c28578b1efc55cf8117f95c06a3c0))


### Bug Fixes

* **application:** fix streaming ([#1535](https://github.com/instill-ai/console/issues/1535)) ([e128e78](https://github.com/instill-ai/console/commit/e128e7817e7ad1b10a78f1e778782fb50e4d40ea))
* fix sdk didn't add oAuthAccessDetails and scopes into the payload ([#1548](https://github.com/instill-ai/console/issues/1548)) ([05235a5](https://github.com/instill-ai/console/commit/05235a53aa0f3da9b184270ffb476d8999b900fd))
* fixed SDK Model type ([#1555](https://github.com/instill-ai/console/issues/1555)) ([1c0d30e](https://github.com/instill-ai/console/commit/1c0d30e417d255ddfcfdcc4053d37001a3934e58))

## [0.8.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.7.0...instill-sdk-v0.8.0) (2024-10-13)


### Features

* **application:** feat add sdk ([#1529](https://github.com/instill-ai/console/issues/1529)) ([e6c5381](https://github.com/instill-ai/console/commit/e6c53816fb38c7bb8c16716c098ac1cf8acf2193))
* **catalog:** feat expose helpers and static  ([#1531](https://github.com/instill-ai/console/issues/1531)) ([1235d62](https://github.com/instill-ai/console/commit/1235d6230b69ebdea6979a7501666b7dfd89dc1b))

## [0.7.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.6.0...instill-sdk-v0.7.0) (2024-10-08)


### Features

* oauth wip ([#1509](https://github.com/instill-ai/console/issues/1509)) ([c8a92ad](https://github.com/instill-ai/console/commit/c8a92ad3d363a6ed65a67649cf8c45362e5aafec))
* **vdp:** update and adapt clone namespace pipeline endpoint ([#1516](https://github.com/instill-ai/console/issues/1516)) ([b585e2e](https://github.com/instill-ai/console/commit/b585e2ecbb2fc60ac13476d117859727faa690d5))

## [0.6.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.5.2...instill-sdk-v0.6.0) (2024-09-24)


### Features

* support run-on-event webhook URL on editor ([#1498](https://github.com/instill-ai/console/issues/1498)) ([d0ed46d](https://github.com/instill-ai/console/commit/d0ed46dc02b24fc4085d8e6e8ac223d4a4239b8f))


### Bug Fixes

* **editor:** fix CMDO not correctly initialized searchCode issue ([#1500](https://github.com/instill-ai/console/issues/1500)) ([88d7705](https://github.com/instill-ai/console/commit/88d7705f7a4afcd984f6fd1ec8ebb95398621828))

## [0.5.2](https://github.com/instill-ai/console/compare/instill-sdk-v0.5.1...instill-sdk-v0.5.2) (2024-09-19)


### Bug Fixes

* add requester ID to the model operation request ([#1481](https://github.com/instill-ai/console/issues/1481)) ([008fd97](https://github.com/instill-ai/console/commit/008fd973a34d69b354f47086e8ca3938a82df87a))

## [0.5.1](https://github.com/instill-ai/console/compare/instill-sdk-v0.5.0...instill-sdk-v0.5.1) (2024-09-13)


### Bug Fixes

* add requester id header to model runs request ([#1458](https://github.com/instill-ai/console/issues/1458)) ([a20b152](https://github.com/instill-ai/console/commit/a20b15282ba72754be03e6908de1c6f5ca1d83ea))

## [0.5.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.4.1...instill-sdk-v0.5.0) (2024-09-11)


### Features

* Integration page ([#1411](https://github.com/instill-ai/console/issues/1411)) ([c1f800b](https://github.com/instill-ai/console/commit/c1f800b862ea3d766d6597d8ce81881d99220159))
* optimistic update the pipeline recipe to avoid jittering cursor position ([#1433](https://github.com/instill-ai/console/issues/1433)) ([bcc24dd](https://github.com/instill-ai/console/commit/bcc24dd8eaa2b556aed387386658574094f986b6))
* use the preview in the editor as the pipeline preview tab ([#1441](https://github.com/instill-ai/console/issues/1441)) ([bb4cadc](https://github.com/instill-ai/console/commit/bb4cadc43ede0d0d7059c3cb39bada7ddae94bd2))


### Bug Fixes

* add missing instill requester uid header in list pipeline runs ([#1453](https://github.com/instill-ai/console/issues/1453)) ([aebbe96](https://github.com/instill-ai/console/commit/aebbe96f57ba5b877812072743531c601834f19b))
* fix model input type issue and add icons ([#1448](https://github.com/instill-ai/console/issues/1448)) ([1a71760](https://github.com/instill-ai/console/commit/1a7176059699ed212020ffa08389eb04d5832a47))
* fix model output issue ([#1454](https://github.com/instill-ai/console/issues/1454)) ([a4e833c](https://github.com/instill-ai/console/commit/a4e833c9b1bf9e2af7de050d1ba3e8de08edd79e))
* fix pipeline overview share-by-link is not working ([#1443](https://github.com/instill-ai/console/issues/1443)) ([d46fdeb](https://github.com/instill-ai/console/commit/d46fdeb64fc78b6390e83803b7a66d6274c9b6aa))

## [0.4.1](https://github.com/instill-ai/console/compare/instill-sdk-v0.4.0...instill-sdk-v0.4.1) (2024-08-31)


### Bug Fixes

* adapt the possibility that BE might return a null variable ([#1420](https://github.com/instill-ai/console/issues/1420)) ([3f5bc0f](https://github.com/instill-ai/console/commit/3f5bc0f00781175287c2621a32f95c8ba07127f9))

## [0.4.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.3.1...instill-sdk-v0.4.0) (2024-08-29)


### Features

* **catalog:** feat add 2 new API pages ([#1380](https://github.com/instill-ai/console/issues/1380)) ([4c2a5db](https://github.com/instill-ai/console/commit/4c2a5db337ee033c15ba01d7a2f90b09780a141d))
* **editor:** support saving non-valid recipe ([#1408](https://github.com/instill-ai/console/issues/1408)) ([a991779](https://github.com/instill-ai/console/commit/a9917797c7692737cb685bb54c8ae83498c7ab6d))
* enrich low-code editor hint features ([#1386](https://github.com/instill-ai/console/issues/1386)) ([c810679](https://github.com/instill-ai/console/commit/c810679460823a408e7465b909b7fb95da2d4372))
* introduce low-code editor ([#1385](https://github.com/instill-ai/console/issues/1385)) ([34a62b0](https://github.com/instill-ai/console/commit/34a62b0ea3f863014b0c892fa26340678281d1d6))
* support streaming with new low code editor ([#1391](https://github.com/instill-ai/console/issues/1391)) ([20edfde](https://github.com/instill-ai/console/commit/20edfdee1cd7fbccd4abe2e7c9c296ff671143f4))
* view pipeline and model run logs ([#1383](https://github.com/instill-ai/console/issues/1383)) ([f0b60fb](https://github.com/instill-ai/console/commit/f0b60fb592876a92c853b85d9fe216a6ee528f7c))


### Bug Fixes

* **catalog:** fix rename knowledge base to catalog ([#1371](https://github.com/instill-ai/console/issues/1371)) ([aa64ddd](https://github.com/instill-ai/console/commit/aa64ddd99492c0787a0ecf3d94529a1c7195b990))
* **editor:** fix can not correctly hint model key ([#1399](https://github.com/instill-ai/console/issues/1399)) ([06b7ba4](https://github.com/instill-ai/console/commit/06b7ba421ec419933e587723be9c6b9713a1f124))
* **editor:** fix not correctly add component skeleton ([#1398](https://github.com/instill-ai/console/issues/1398)) ([09054ff](https://github.com/instill-ai/console/commit/09054ffc272e961fc33279380ebf2b64d370b2d6))
* fetch specific version operation ([#1390](https://github.com/instill-ai/console/issues/1390)) ([5d0ff52](https://github.com/instill-ai/console/commit/5d0ff521eac76cf99b9133645b4257b2871d12b8))
* fix can not trigger release pipeline in editor ([#1416](https://github.com/instill-ai/console/issues/1416)) ([3d0d4ee](https://github.com/instill-ai/console/commit/3d0d4ee87e97d9c0294d28e6a872b308b5f296bf))


### Miscellaneous

* replace connector related query in vdp-sdk with packages/sdk ([#1378](https://github.com/instill-ai/console/issues/1378)) ([7670640](https://github.com/instill-ai/console/commit/76706400dad86855b87416e0b9780c517f1afbe9))

## [0.3.1](https://github.com/instill-ai/console/compare/instill-sdk-v0.3.0...instill-sdk-v0.3.1) (2024-08-05)


### Bug Fixes

* add pagination to Catalog ([#1346](https://github.com/instill-ai/console/issues/1346)) ([a40f85b](https://github.com/instill-ai/console/commit/a40f85be7b3114e92f26646dfb105dc7293d03f9))

## [0.3.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.2.0...instill-sdk-v0.3.0) (2024-07-31)


### Features

* add integration test for SDK ([#1315](https://github.com/instill-ai/console/issues/1315)) ([d247ec9](https://github.com/instill-ai/console/commit/d247ec9a539dd258530d1286c191ede3131014f0))
* move restapi component into generic type ([#1326](https://github.com/instill-ai/console/issues/1326)) ([fbaf1ab](https://github.com/instill-ai/console/commit/fbaf1ab3386d8edc767440d1431320354da2b5ec))
* update subscription endpoint PLAN type ([#1323](https://github.com/instill-ai/console/issues/1323)) ([895c163](https://github.com/instill-ai/console/commit/895c163c4e3e601c7b9d77b51af0787d4def32ca))


### Bug Fixes

* unify how we handle error ([#1331](https://github.com/instill-ai/console/issues/1331)) ([5d79849](https://github.com/instill-ai/console/commit/5d79849e5b1920dc2296422c8a46968219ee9fbf))


### Miscellaneous

* **integration-test:** add get/list membership integration-test ([#1324](https://github.com/instill-ai/console/issues/1324)) ([9271802](https://github.com/instill-ai/console/commit/9271802162105322ce2b9c1019c2f519e56ff62d))
* replace pipeline type in toolkit with type in sdk ([#1319](https://github.com/instill-ai/console/issues/1319)) ([48de6c3](https://github.com/instill-ai/console/commit/48de6c366e29f17df7c1da22a203f210065404c4))

## [0.2.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.1.0...instill-sdk-v0.2.0) (2024-07-16)


### Features

* merge sprint 39 changes ([#1302](https://github.com/instill-ai/console/issues/1302)) ([14194ab](https://github.com/instill-ai/console/commit/14194abb680c9a5156d35cbd5fe4c2fab25e8891))


### Bug Fixes

* model public requests ([#1309](https://github.com/instill-ai/console/issues/1309)) ([6dfe3c5](https://github.com/instill-ai/console/commit/6dfe3c546a04004ec9a39673d252efd623b5be51))


### Miscellaneous

* add sdk readme ([#1307](https://github.com/instill-ai/console/issues/1307)) ([10bd6d5](https://github.com/instill-ai/console/commit/10bd6d5f8e95360ba1757e8f63e793962196fb0d))

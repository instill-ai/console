# Changelog

## [0.13.1](https://github.com/instill-ai/console/compare/instill-sdk-v0.13.0...instill-sdk-v0.13.1) (2024-12-13)


### Bug Fixes

* fix model hardware options ([#1652](https://github.com/instill-ai/console/issues/1652)) ([55b98a6](https://github.com/instill-ai/console/commit/55b98a662bea5ff3fa63bab7cf3ced46d06839d0))

## [0.13.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.12.0...instill-sdk-v0.13.0) (2024-12-03)


### Features

* add chat/agent related sdk and react-queries ([#1635](https://github.com/instill-ai/console/issues/1635)) ([5b6490f](https://github.com/instill-ai/console/commit/5b6490f25518617cbe4ede9b8fa78f9e08a4e9cd))
* deprecate the usage of integration.schemas ([#1621](https://github.com/instill-ai/console/issues/1621)) ([8bd46fc](https://github.com/instill-ai/console/commit/8bd46fc00e72f5cc68e595d740ccad6c3ff8e3bb))


### Bug Fixes

* fix cmdo event title, to make it more human readable ([#1639](https://github.com/instill-ai/console/issues/1639)) ([ec98f18](https://github.com/instill-ai/console/commit/ec98f187c92c85a4121a59d64a85f4919f1b91a0))
* further fix vulnerabilities deps ([#1632](https://github.com/instill-ai/console/issues/1632)) ([bda8462](https://github.com/instill-ai/console/commit/bda84621e28898ad7ef277550086a5de21ff3ef6))
* patch high vulnerabilities deps issues ([#1631](https://github.com/instill-ai/console/issues/1631)) ([955355e](https://github.com/instill-ai/console/commit/955355e4ad14baa2690d1e87273257dba6468b71))


### Miscellaneous

* **run logging:** clarify actors in Run objects ([#1622](https://github.com/instill-ai/console/issues/1622)) ([6f55bf2](https://github.com/instill-ai/console/commit/6f55bf2b52357d9d08c151d845a4361b87be4f53))

## [0.12.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.11.0...instill-sdk-v0.12.0) (2024-11-20)


### Features

* adapt artifact upload on pipeline preview page ([#1605](https://github.com/instill-ai/console/issues/1605)) ([37411cf](https://github.com/instill-ai/console/commit/37411cf53ec7f98cde73f443a4d35b27900c4770))
* add event component data example ([#1608](https://github.com/instill-ai/console/issues/1608)) ([5d03014](https://github.com/instill-ai/console/commit/5d030144bf92bb2bcb76bdebe79250940164356b))
* implement blob artifact when trigger pipeline ([#1604](https://github.com/instill-ai/console/issues/1604)) ([e93cb87](https://github.com/instill-ai/console/commit/e93cb879ebc300f3042778a1cb6f24528b6f790d))
* support event component ([#1600](https://github.com/instill-ai/console/issues/1600)) ([af3526b](https://github.com/instill-ai/console/commit/af3526b5546a25d2fd18a3404c129f6c0128a21c))

## [0.11.0](https://github.com/instill-ai/console/compare/instill-sdk-v0.10.0...instill-sdk-v0.11.0) (2024-11-05)


### Features

* **catalog:** migrate API calls to sdk CatalogClient ([#1572](https://github.com/instill-ai/console/issues/1572)) ([a305c98](https://github.com/instill-ai/console/commit/a305c98bdb546f8f3e0d60ab1e4abb01eff84b83))
* make the sdk e2e test mark every queryParam as required ([#1577](https://github.com/instill-ai/console/issues/1577)) ([99c16a2](https://github.com/instill-ai/console/commit/99c16a2b65716ebec8712300fa0fab98836b9b01))
* remove vdp-sdk and rename it to sdk-helper ([#1568](https://github.com/instill-ai/console/issues/1568)) ([cfcd5ae](https://github.com/instill-ai/console/commit/cfcd5ae79ffe49a340ae0b7f2220067bc297d0df))
* replace vdp-sdk/model with instill-sdk ([#1566](https://github.com/instill-ai/console/issues/1566)) ([014f3ae](https://github.com/instill-ai/console/commit/014f3ae71ed385c67fc887c6b19902a7a2150e00))
* replace vdp-sdk/organization with instill-sdk ([#1564](https://github.com/instill-ai/console/issues/1564)) ([2742cc7](https://github.com/instill-ai/console/commit/2742cc721843d8232800a6e042e1a1a4100814fa))
* retire name parameter in the pipeline related endpoint ([#1575](https://github.com/instill-ai/console/issues/1575)) ([533e757](https://github.com/instill-ai/console/commit/533e757117e532a596b4e05d432af79e4834a4a7))
* retire name parameter of token related endpoints ([#1582](https://github.com/instill-ai/console/issues/1582)) ([0de03b3](https://github.com/instill-ai/console/commit/0de03b3db6efe09f2c6be3dc98635675eb442b88))
* retire name parameter on credit related endpoint ([#1580](https://github.com/instill-ai/console/issues/1580)) ([d1e29b9](https://github.com/instill-ai/console/commit/d1e29b910b3dadd6137badbf342d9178896558f5))
* retire name parameter on integration related endpoint ([#1581](https://github.com/instill-ai/console/issues/1581)) ([4b9c21a](https://github.com/instill-ai/console/commit/4b9c21a59427e38959f9fa317cbf5e3e835d055b))
* revamp catalog sdk and its react-query ([#1578](https://github.com/instill-ai/console/issues/1578)) ([a8901bd](https://github.com/instill-ai/console/commit/a8901bda57d454cf812bda0973385d83fcee755c))


### Bug Fixes

* **artifact:** fix Artifact File details markdown format ([#1570](https://github.com/instill-ai/console/issues/1570)) ([d67e6c0](https://github.com/instill-ai/console/commit/d67e6c0f2fd7953da8a6b36be115053f594bfbe9))
* fix and adapt new dashboard endpoint ([#1594](https://github.com/instill-ai/console/issues/1594)) ([e043500](https://github.com/instill-ai/console/commit/e043500c9063cd8fcd91f366247fe4c0298923db))
* fix cant clone pipeline from pipeline list page ([#1567](https://github.com/instill-ai/console/issues/1567)) ([d9945a9](https://github.com/instill-ai/console/commit/d9945a98709054dc76410e3cf3f0577932340c61))
* fix list pipeline's query key is not present, and catalog fileUid issue ([#1588](https://github.com/instill-ai/console/issues/1588)) ([8cae285](https://github.com/instill-ai/console/commit/8cae285c0949ef9589aae23f8546981c4513daf0))
* fix pipeline preview is wrong when reference the component in the same iterator ([#1589](https://github.com/instill-ai/console/issues/1589)) ([48cde51](https://github.com/instill-ai/console/commit/48cde512a824f00e2acbd7ffe76218517299277b))
* fix sdk integration-test caused by the new revamp of instill-ai protobuf ([#1576](https://github.com/instill-ai/console/issues/1576)) ([3691050](https://github.com/instill-ai/console/commit/3691050403650ced049258933d1f67021827ec0a))

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

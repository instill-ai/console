# Changelog

## [0.80.2](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.80.1...@instill-ai/toolkit-v0.80.2) (2024-01-31)


### Bug Fixes

* fix pipeline card wrongly put build button for user without permission ([#925](https://github.com/instill-ai/console/issues/925)) ([9179087](https://github.com/instill-ai/console/commit/917908736755cb791f39697679c23d332b615d39))

## [0.80.1](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.80.0...@instill-ai/toolkit-v0.80.1) (2024-01-31)


### Bug Fixes

* **dashboard:** update pipeline chart status type ([#920](https://github.com/instill-ai/console/issues/920)) ([b5869b7](https://github.com/instill-ai/console/commit/b5869b787bcef46682e3e90013c7234ac3d32e9c))
* fix reference hint tag style and wrong reference path ([#923](https://github.com/instill-ai/console/issues/923)) ([113b400](https://github.com/instill-ai/console/commit/113b400507064e78c310bad8e25d6575f1567cd6))

## [0.80.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.79.0...@instill-ai/toolkit-v0.80.0) (2024-01-30)


### Features

* **pipeline-builder:** add reference hint at the start operator ([#902](https://github.com/instill-ai/console/issues/902)) ([d87de86](https://github.com/instill-ai/console/commit/d87de86845e385465279e995e78c9c4bb4d0d3c0))
* **pipeline-builder:** add the what is a reference section when create start input field ([#904](https://github.com/instill-ai/console/issues/904)) ([7b395d8](https://github.com/instill-ai/console/commit/7b395d8632b20fa0ca6a45072dbce7a7d1faa3da))
* **pipeline-builder:** hide edit/delete button of start input into dropdown ([#910](https://github.com/instill-ai/console/issues/910)) ([bf0bfa7](https://github.com/instill-ai/console/commit/bf0bfa76de2c8e5d62a123f1cfa0c21deff36a7d))
* **pipeline-builder:** implement the new component output reference hint design ([#905](https://github.com/instill-ai/console/issues/905)) ([4a7bb67](https://github.com/instill-ai/console/commit/4a7bb6791fb98694dc29e28dce0f0e5cd71d63a8))
* **pipeline-builder:** make end operator free form field be consistent with start operator ([#916](https://github.com/instill-ai/console/issues/916)) ([bf39477](https://github.com/instill-ai/console/commit/bf39477695f4845402f08b108fc790ad2be337e7))
* **pipeline-builder:** move the component output data section to bottom bar ([#907](https://github.com/instill-ai/console/issues/907)) ([90587c1](https://github.com/instill-ai/console/commit/90587c1c43ad0134516e5ae6690c63d63bb49122))
* **pipeline-builder:** support group by format for component output reference hints ([#906](https://github.com/instill-ai/console/issues/906)) ([537c6f6](https://github.com/instill-ai/console/commit/537c6f647ee5a05a20bc2d88081345d3fb0e4e7c))
* **pipeline-builder:** update the style of reference tag and data type tag ([#919](https://github.com/instill-ai/console/issues/919)) ([010fa45](https://github.com/instill-ai/console/commit/010fa45d92eddff51ced6765e80be2defe5f03c3))
* **pipeline-builder:** User can better debug their component by using the new schema and data output view ([#908](https://github.com/instill-ai/console/issues/908)) ([591d7be](https://github.com/instill-ai/console/commit/591d7be4f4b80eb7aaa9fcd0904023e7f73082c5))
* support filtering the visibility of pipelines ([#903](https://github.com/instill-ai/console/issues/903)) ([57fd548](https://github.com/instill-ai/console/commit/57fd5488105108c549b9fa386596925586a81c2c))
* **testing:** add real-world unit test case for useInstillForm ([#899](https://github.com/instill-ai/console/issues/899)) ([2eef748](https://github.com/instill-ai/console/commit/2eef74859bf19beadf126b1fbbaf4dc4c3767fc3))
* **tracking:** add isAmplitudeInit guard before send the amplitude event ([#917](https://github.com/instill-ai/console/issues/917)) ([fda54fc](https://github.com/instill-ai/console/commit/fda54fcf570897cdbcffb1db3360e349bada0318))
* **tracking:** add subscription related amplitude event ([#915](https://github.com/instill-ai/console/issues/915)) ([2e7a0fc](https://github.com/instill-ai/console/commit/2e7a0fc46f77d8d3434897d312ead95205c07b9b))
* update the amplitude action type ([#897](https://github.com/instill-ai/console/issues/897)) ([40cb1c2](https://github.com/instill-ai/console/commit/40cb1c2962fbb649dd8320ee8dc93e07dc26d1d1))


### Bug Fixes

* **connector:** cannot delete connector free-form field ([#912](https://github.com/instill-ai/console/issues/912)) ([b8113a7](https://github.com/instill-ai/console/commit/b8113a7c10c368ccd19d846078be064fcc16b92c))
* fix /pipelines/pid head page description and button not align issue ([#913](https://github.com/instill-ai/console/issues/913)) ([32d4d4c](https://github.com/instill-ai/console/commit/32d4d4c48014d6a2d83ac64f581c52f05c009df2))
* **pipeline-builder:** fix pipeline-builder updater update the form on every input ([#909](https://github.com/instill-ai/console/issues/909)) ([d8551f4](https://github.com/instill-ai/console/commit/d8551f4fd52549d7602a548d8923b6b30785a16b))
* **pipeline-builder:** support the potential breaking changes of connector task ([#914](https://github.com/instill-ai/console/issues/914)) ([8c54b80](https://github.com/instill-ai/console/commit/8c54b800a224bf53128b725f2e1c1999a53e07c2))


### Miscellaneous

* increase test timeout ([2b5d54f](https://github.com/instill-ai/console/commit/2b5d54f478054ec1a8370d16a8ac0fdac6e97ac9))
* refactor top bar navigation to make it dry, add default query options for react-query ([#821](https://github.com/instill-ai/console/issues/821)) ([0e5decd](https://github.com/instill-ai/console/commit/0e5decdb6bd920aad14d4c655e54bd636f63a6f8))

## [0.79.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.78.1...@instill-ai/toolkit-v0.79.0) (2024-01-24)


### Features

* add organization support to create, clone and duplicate pipeline ([#893](https://github.com/instill-ai/console/issues/893)) ([0c9ffee](https://github.com/instill-ai/console/commit/0c9ffee501202922d2917d6a0cdc4b31f4e541b6))
* implement the unit test for nested auto gen form ([#896](https://github.com/instill-ai/console/issues/896)) ([51c4630](https://github.com/instill-ai/console/commit/51c46305e93372ae652e38eda0fed82545afc714))
* setup the react testing library for auto-gen-form unit test ([#895](https://github.com/instill-ai/console/issues/895)) ([b3947b7](https://github.com/instill-ai/console/commit/b3947b75a3fc7d52d9b2d9e90210232ca6c96d98))
* support backend search param for pipelines ([#891](https://github.com/instill-ai/console/issues/891)) ([c8df8e9](https://github.com/instill-ai/console/commit/c8df8e9add76045adb3ebe0ae7f40614670401ac))


### Bug Fixes

* fix empty input setup button is not working in /pipelines/pid page ([#894](https://github.com/instill-ai/console/issues/894)) ([5f3cb72](https://github.com/instill-ai/console/commit/5f3cb725107dbfac11021fe2bbe84df87108f785))
* fix formatting issue ([61b1022](https://github.com/instill-ai/console/commit/61b10226ca8007d5930967c1a739d55cb7ecec81))
* Typo in component configuration ([#889](https://github.com/instill-ai/console/issues/889)) ([ec55621](https://github.com/instill-ai/console/commit/ec55621c30e9848c33155d52d9ade52c29ad94c2))

## [0.78.1](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.78.0...@instill-ai/toolkit-v0.78.1) (2024-01-17)


### Bug Fixes

* fix operator component node icon path is not correct ([#887](https://github.com/instill-ai/console/issues/887)) ([6be4f4b](https://github.com/instill-ai/console/commit/6be4f4b0d468204da62b5ea5e4924b99589a3bea))

## [0.78.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.77.3...@instill-ai/toolkit-v0.78.0) (2024-01-15)


### Features

* adapt the new icon path for operators and connectors ([#867](https://github.com/instill-ai/console/issues/867)) ([7311370](https://github.com/instill-ai/console/commit/7311370b6c6da535fbab67a9c0f6d5d32da38f8f))
* add loading state into pipelines/pid page to increase ux ([#875](https://github.com/instill-ai/console/issues/875)) ([badf238](https://github.com/instill-ai/console/commit/badf238af61bf8b6d693541c9d0894984bcab85a))
* add the placeholder for the pipeline description editor ([#872](https://github.com/instill-ai/console/issues/872)) ([511a520](https://github.com/instill-ai/console/commit/511a52030b73da2e50f3e1b4ab1dcbcaac435ccd))
* improve the namespace hint when clone the pipeline ([#884](https://github.com/instill-ai/console/issues/884)) ([822d36e](https://github.com/instill-ai/console/commit/822d36e8ecf5afba6e6c47423b887d2d21cc82fb))
* **pipeline-builder:** improve the connector is not specified warning on the pipeline-builder component ([#879](https://github.com/instill-ai/console/issues/879)) ([cf8494d](https://github.com/instill-ai/console/commit/cf8494deee394d737128922bb4b197f6ca78c946))
* **pipeline-builder:** support new ${} reference syntax ([#868](https://github.com/instill-ai/console/issues/868)) ([9a6b005](https://github.com/instill-ai/console/commit/9a6b005ebebf86f02f067b207b23e610e26ddc1f))
* **user:** implement image crop for rectangle user portrait ([#880](https://github.com/instill-ai/console/issues/880)) ([e14af3f](https://github.com/instill-ai/console/commit/e14af3fd6c62dec736071aaae1119faaa84eefca))


### Bug Fixes

* **auto-form:** fix instillUIMultiline attribute is not working within auto-form ([#854](https://github.com/instill-ai/console/issues/854)) ([8aa47bf](https://github.com/instill-ai/console/commit/8aa47bf3f068da1df15bf7c8aa11671694c4b654))
* fix anchor tag overflow in the component formatted output ([#881](https://github.com/instill-ai/console/issues/881)) ([1f15663](https://github.com/instill-ai/console/commit/1f1566311e0320e424f78a5bbd5e06a74f69c3ec))
* fix console fetch the wrong model readme namespace ([#863](https://github.com/instill-ai/console/issues/863)) ([85ce0a8](https://github.com/instill-ai/console/commit/85ce0a89858f97ce2900ea557e55428c1deed15e))
* fix duplicate pipeline didnt carry over pipeline brief ([#876](https://github.com/instill-ai/console/issues/876)) ([54752ee](https://github.com/instill-ai/console/commit/54752ee0487f0b38999204efc501abd0f98a7e79))
* fix font not consistent on dashboard and improve the font optimization ([#873](https://github.com/instill-ai/console/issues/873)) ([18fc2c3](https://github.com/instill-ai/console/commit/18fc2c318734a7d1a4a2166adb47c00b2b46a3b7))
* fix log in to clone not correctly redirect user to login ([#877](https://github.com/instill-ai/console/issues/877)) ([b547470](https://github.com/instill-ai/console/commit/b547470f2e863b25f015f06c07f38fe9976f78e9))
* fix markdown editor of pipeline description can not show ol and ul ([#871](https://github.com/instill-ai/console/issues/871)) ([fb0da5a](https://github.com/instill-ai/console/commit/fb0da5aea85356b824da4afd3aa338f1b9594ec5))
* fix start operator json input not working in /pipelines/pid page ([#858](https://github.com/instill-ai/console/issues/858)) ([3341248](https://github.com/instill-ai/console/commit/33412480b51af1b3eec965d5c47cf393533abced))
* fix the drift of the loading state of /pipelines/pid page ([#882](https://github.com/instill-ai/console/issues/882)) ([bbf5de9](https://github.com/instill-ai/console/commit/bbf5de939347ce7522294d07d169af7b21fbc0b4))
* fix the wrong state in ResourceTable cause the wrong behavior of delete resource dialog ([#869](https://github.com/instill-ai/console/issues/869)) ([e048116](https://github.com/instill-ai/console/commit/e048116714265bb65a52c1b4d89aa160322661fc))
* fix wrongly wrapped line of namespace in create and clone pipeline dialog ([#862](https://github.com/instill-ai/console/issues/862)) ([6ccdac0](https://github.com/instill-ai/console/commit/6ccdac04b7feba05f3d2ca4d6da20b90ed70008f))
* **hub:** filter out logged in user private pipeline on hub ([#865](https://github.com/instill-ai/console/issues/865)) ([5b50808](https://github.com/instill-ai/console/commit/5b50808916b7babf7abd10c42241ebf9a46a9942))
* improve namespace hint of pipeline creation process ([#883](https://github.com/instill-ai/console/issues/883)) ([544e22b](https://github.com/instill-ai/console/commit/544e22b803b21eb4016f507c52e3b986ff42ba65))
* **pipeline-builder:** fix can not reference comp output and form the edges ([#866](https://github.com/instill-ai/console/issues/866)) ([2a8fd68](https://github.com/instill-ai/console/commit/2a8fd683211c49dc44b4d8c742c9d6d8f314bf9d))
* **pipeline-builder:** fix can't correctly pour in instill-model enum for connector ([#885](https://github.com/instill-ai/console/issues/885)) ([59366ea](https://github.com/instill-ai/console/commit/59366eac5d1c8b38d86c5cbc01dbd8ccb23939dc))
* **pipeline-builder:** fix pipeline builder not correctly handle deep nested object referenced link ([#857](https://github.com/instill-ai/console/issues/857)) ([edab862](https://github.com/instill-ai/console/commit/edab862583585fc59a8cf7e914c25c5262fc3d06))
* **pipeline-builder:** fix the component output not react to the selected task ([#874](https://github.com/instill-ai/console/issues/874)) ([c8a1473](https://github.com/instill-ai/console/commit/c8a14736c86d71a06496fffe85cc140d7b352f89))
* **pipeline-builder:** fix wrongly position component when there only have start and end operator ([#870](https://github.com/instill-ai/console/issues/870)) ([f59b25b](https://github.com/instill-ai/console/commit/f59b25b733b8283ebcb239817ab3683d86363a40))


### Miscellaneous

* add Marketing into InstillUserRoles ([#861](https://github.com/instill-ai/console/issues/861)) ([785a0b0](https://github.com/instill-ai/console/commit/785a0b0860c5a63eae4d8804f0f0b29187603f00))
* **deps:** bump axios from 1.5.1 to 1.6.0 ([#674](https://github.com/instill-ai/console/issues/674)) ([44d868b](https://github.com/instill-ai/console/commit/44d868bac41d701710da5eb1468a98ddaa0ac83d))
* increase the duration of error toast notification ([#878](https://github.com/instill-ai/console/issues/878)) ([539c349](https://github.com/instill-ai/console/commit/539c349ffd4526d6999ce101400832153c13af67))
* make creating private pipeline as default option ([#859](https://github.com/instill-ai/console/issues/859)) ([e078b57](https://github.com/instill-ai/console/commit/e078b5724f11adb168178ccf5a407db85aa52eb5))
* remove the expire data in the API token table ([#864](https://github.com/instill-ai/console/issues/864)) ([2cbf9f2](https://github.com/instill-ai/console/commit/2cbf9f26f658f775e64b5760f8ec7ec182f6662b))
* replace "clone" with "Log in to Clone" when the user is not logged in ([#860](https://github.com/instill-ai/console/issues/860)) ([871114a](https://github.com/instill-ai/console/commit/871114a025a2025b39477ad41509368933f926cf))
* **user-profile:** user profile update pipeline query ([#856](https://github.com/instill-ai/console/issues/856)) ([f655d92](https://github.com/instill-ai/console/commit/f655d92a9957bbc4edf307af97c4db44ee03e707))

## [0.77.3](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.77.2...@instill-ai/toolkit-v0.77.3) (2024-01-02)


### Bug Fixes

* fix user profile wrongly use org_name as user_name ([#852](https://github.com/instill-ai/console/issues/852)) ([8b7cf05](https://github.com/instill-ai/console/commit/8b7cf0535498520d0154da21115a74ed7bf1c140))

## [0.77.2](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.77.1...@instill-ai/toolkit-v0.77.2) (2024-01-02)


### Bug Fixes

* fix model setting page query issue ([#850](https://github.com/instill-ai/console/issues/850)) ([a5978a3](https://github.com/instill-ai/console/commit/a5978a3a879285cfb6970d7351ce7af37ebfb768))

## [0.77.1](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.77.0...@instill-ai/toolkit-v0.77.1) (2024-01-02)


### Bug Fixes

* fix not correctly handle Airbyte connectors free-form ([#847](https://github.com/instill-ai/console/issues/847)) ([0fea3c1](https://github.com/instill-ai/console/commit/0fea3c17a29799afd3a1312ca316709d4df5157d))

## [0.77.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.76.1...@instill-ai/toolkit-v0.77.0) (2024-01-02)


### Features

* add pipeline sharing permission label to help user recognize it ([#824](https://github.com/instill-ai/console/issues/824)) ([793afd0](https://github.com/instill-ai/console/commit/793afd03f72ae3d8e263d9c9f088538afbbc4942))
* add the loading state indicator for user-profile ([#845](https://github.com/instill-ai/console/issues/845)) ([914afa3](https://github.com/instill-ai/console/commit/914afa35b06bfb9350728a2c44f3f293ff6f2b51))
* **auto-gen-form:** support the action of merging Airbyte connectors into single one ([#835](https://github.com/instill-ai/console/issues/835)) ([64e3a69](https://github.com/instill-ai/console/commit/64e3a699737b23a1a92dbe5a27b4b7e6edb53c71))
* **pipeline-builder:** display the component ouput field title as title when demo ([#843](https://github.com/instill-ai/console/issues/843)) ([d60b7ac](https://github.com/instill-ai/console/commit/d60b7ac8cd01529f872df2f01f6621f7159de880))
* **pipeline-builder:** distinguish the start input between demo and builder page ([#842](https://github.com/instill-ai/console/issues/842)) ([cd8eab8](https://github.com/instill-ai/console/commit/cd8eab878728471d89691ffe4b5aaafab45ef8a5))
* **pipeline-builder:** Introduce MiniMap in the pipeline-builder to improve UX ([#829](https://github.com/instill-ai/console/issues/829)) ([f2db15e](https://github.com/instill-ai/console/commit/f2db15ea721ded0e23e616a517493b335fce2832))
* **pipeline-builder:** make right-panel float on top of canvas to have bigger working space ([#834](https://github.com/instill-ai/console/issues/834)) ([b8bc0e4](https://github.com/instill-ai/console/commit/b8bc0e476b05557ef419ff5826de336ecd0951ab))
* **pipeline-builder:** user can now use the pipeline-builder control on preview ([#828](https://github.com/instill-ai/console/issues/828)) ([2b4a323](https://github.com/instill-ai/console/commit/2b4a323444281358970c76ef3e5efdf1136667a6))
* support blocking user from cloning others connectors ([#846](https://github.com/instill-ai/console/issues/846)) ([9922925](https://github.com/instill-ai/console/commit/9922925ede04598210d792a2306afa291f622c47))
* update the new user role options ([#823](https://github.com/instill-ai/console/issues/823)) ([7a66f4f](https://github.com/instill-ai/console/commit/7a66f4f477c6d85e9580f92ec650d9837788d24a))


### Bug Fixes

* `async` function(s) should be awaited ([#838](https://github.com/instill-ai/console/issues/838)) ([635dea4](https://github.com/instill-ai/console/commit/635dea44236ee4bd97819e430c84a4caf504ddf2))
* fix delete resource dialog style is not aligned ([#831](https://github.com/instill-ai/console/issues/831)) ([e631a3f](https://github.com/instill-ai/console/commit/e631a3f58cbc5e972faf3c68370746701540b5e2))
* fix model icons are not correct or missing issue ([#822](https://github.com/instill-ai/console/issues/822)) ([0b3d2ad](https://github.com/instill-ai/console/commit/0b3d2ad3db52e70ee0a870a552e0a5abdbafa643))
* fix output fields not correctly style on /pipelines/pid page ([#844](https://github.com/instill-ai/console/issues/844)) ([c87f1b1](https://github.com/instill-ai/console/commit/c87f1b15fe7d31e7d8376f637c4049e07c462c7b))
* fix pipeline-builder configuration transformation pollute to the react-query data ([#832](https://github.com/instill-ai/console/issues/832)) ([4d2eac5](https://github.com/instill-ai/console/commit/4d2eac5294446df7aee139abca461448753f12b0))
* fix profile setting page not having correct loading flag ([#840](https://github.com/instill-ai/console/issues/840)) ([6bb6904](https://github.com/instill-ai/console/commit/6bb6904a9f752a7e100a10fa510680e41cc0ce45))
* fix twitter link and capitalize issue ([#825](https://github.com/instill-ai/console/issues/825)) ([76f0c66](https://github.com/instill-ai/console/commit/76f0c668dcbd66e548134db2bf08e2341812770d))
* fix wrongly display organization link when user doesnt belong to any org ([#826](https://github.com/instill-ai/console/issues/826)) ([3bc9bf7](https://github.com/instill-ai/console/commit/3bc9bf7478d01fa528c4fc1e327a521b689e042f))
* **pipeline-builder:** disabled delete nodes and edges by clicking backspace ([#833](https://github.com/instill-ai/console/issues/833)) ([4240df8](https://github.com/instill-ai/console/commit/4240df884a4eaf00373bc8a0326a5d50047ff96c))
* **pipeline-builder:** fix not correctly add nodes at the center of the nodes ([#820](https://github.com/instill-ai/console/issues/820)) ([f6f25ba](https://github.com/instill-ai/console/commit/f6f25ba182a194783872999f262f96f64a3c36c4))
* **pipeline-builder:** fix pipeline-builder share tab not correctly display owner profile avatar ([#827](https://github.com/instill-ai/console/issues/827)) ([d015d9b](https://github.com/instill-ai/console/commit/d015d9bc6a31705e4707f46590caa2dc14a94435))


### Miscellaneous

* apply prettier format and reject formatting errors in PRs ([#818](https://github.com/instill-ai/console/issues/818)) ([fa5c3b3](https://github.com/instill-ai/console/commit/fa5c3b362dfac92291926c0e9020bb53c8c10ddc))
* remove unnecessary `error:any`, narrow to `unknown` ([#817](https://github.com/instill-ai/console/issues/817)) ([8ce1cee](https://github.com/instill-ai/console/commit/8ce1ceebbba0fbb0ac3eb91731e9398c0eaaba1f))
* use `mutation.isLoading` instead of tracking loading state manually ([#837](https://github.com/instill-ai/console/issues/837)) ([ce430c9](https://github.com/instill-ai/console/commit/ce430c91b86cbf1cc2e1dcd60bb011e1323e3af9))

## [0.76.1](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.76.0...@instill-ai/toolkit-v0.76.1) (2023-12-25)

### Bug Fixes

- fix invalid share-by-link link ([#816](https://github.com/instill-ai/console/issues/816)) ([1fa10c0](https://github.com/instill-ai/console/commit/1fa10c0521ecb417a35aa1ba0117af8d27a7810b))
- fix run button on /pipelines/pid page not correctly align ([#811](https://github.com/instill-ai/console/issues/811)) ([ff8860e](https://github.com/instill-ai/console/commit/ff8860e59db61ff11effb27789bc7a0a2751136f))
- fix user can not smoothly clone the pipeline and decide what is its permission level ([#813](https://github.com/instill-ai/console/issues/813)) ([dc36a9a](https://github.com/instill-ai/console/commit/dc36a9a426ad2c0c0dbe1d72468c22d6946ee26d))

## [0.76.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.75.0...@instill-ai/toolkit-v0.76.0) (2023-12-22)

### Features

- **pipeline-builder:** support JSON input on start operator ([#808](https://github.com/instill-ai/console/issues/808)) ([57c2c81](https://github.com/instill-ai/console/commit/57c2c8159206cd4f839401fba0ad1d28bf667ee3))

### Bug Fixes

- fix delete resource dialog close button wrongly positioned ([#809](https://github.com/instill-ai/console/issues/809)) ([73414a1](https://github.com/instill-ai/console/commit/73414a1f02f177236d4048cb5dce83cdff61bc94))
- fix issue that will stop user from deleting the pipeline smoothly ([#805](https://github.com/instill-ai/console/issues/805)) ([cc26b6b](https://github.com/instill-ai/console/commit/cc26b6b38c0686cd630d357ab0761ba520c09ee8))
- **pipeline-builder:** fix console not correctly parse semi-structured output object ([#806](https://github.com/instill-ai/console/issues/806)) ([eca0790](https://github.com/instill-ai/console/commit/eca0790d6df2271995a9db2a20a5bf53bdddea5e))

### Miscellaneous

- **dashboard:** update dashboard loader ([#800](https://github.com/instill-ai/console/issues/800)) ([9680313](https://github.com/instill-ai/console/commit/96803130a5833d26d3e7cb402ad74afa6a3c06ab))
- **general:** replace model URL path with models ([#802](https://github.com/instill-ai/console/issues/802)) ([e640470](https://github.com/instill-ai/console/commit/e6404706305c113d43ed56f15f1c2498d7adfd8c))
- replace pipeline readme with pipeline description on /pipelines/pid page ([#804](https://github.com/instill-ai/console/issues/804)) ([2d735f7](https://github.com/instill-ai/console/commit/2d735f7907b4155557fd624bde64fcd8592a8edd))

## [0.75.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.74.1...@instill-ai/toolkit-v0.75.0) (2023-12-15)

### Features

- adapt new permission rule from backend ([#796](https://github.com/instill-ai/console/issues/796)) ([fa3d57b](https://github.com/instill-ai/console/commit/fa3d57b7e35f0e3ae60763bc912c90efed7dae81))
- **design-system:** add MultiSelect component ([#763](https://github.com/instill-ai/console/issues/763)) ([3229af9](https://github.com/instill-ai/console/commit/3229af993a8e41bde38c9134a758471158fd7b3e))
- **general:** Adapt new backend API version ([#773](https://github.com/instill-ai/console/issues/773)) ([a7dbb41](https://github.com/instill-ai/console/commit/a7dbb416c9db67778dc40e94fa27d19a8a4d9e09))
- **general:** adapt new pipeline readme design to store complicated description ([#785](https://github.com/instill-ai/console/issues/785)) ([65f7c06](https://github.com/instill-ai/console/commit/65f7c067ab1d88bd6d5ba652ec922fb796ab6ae3))
- **general:** add entity profile page and clean up components and queries ([#784](https://github.com/instill-ai/console/issues/784)) ([11d1b56](https://github.com/instill-ai/console/commit/11d1b5605a050947b499f063a1c200841471ccc1))
- **hub:** Non-auth user can still access the public console ([#788](https://github.com/instill-ai/console/issues/788)) ([c4a7577](https://github.com/instill-ai/console/commit/c4a757713236726213034f8f48adc364a0b2d0bb))
- **hub:** User can have new pipeline page to display various information ([#762](https://github.com/instill-ai/console/issues/762)) ([2412830](https://github.com/instill-ai/console/commit/241283051fe0a14224288d7efdc17aa063208de8))
- **organization:** organization teams user profile dev screens ([#743](https://github.com/instill-ai/console/issues/743)) ([786ad86](https://github.com/instill-ai/console/commit/786ad861d01dc1948d6f2d068aae8f51bec84468))
- **pipeline-builder:** add a flag to make pipeline-builder fully readonly ([#777](https://github.com/instill-ai/console/issues/777)) ([d190d6b](https://github.com/instill-ai/console/commit/d190d6bb3201cefd56122aefe71668c73e27e27d))
- **pipeline-builder:** Simplified release flow and make it more intuitive ([#772](https://github.com/instill-ai/console/issues/772)) ([cfd0507](https://github.com/instill-ai/console/commit/cfd050741ac5c6c71798760b334b3d6528c62ab7))
- **pipeline-builder:** User can have new advanced pipeline creation dialog ([#792](https://github.com/instill-ai/console/issues/792)) ([931bec3](https://github.com/instill-ai/console/commit/931bec38b4a63c6bcb02d7ae5fbfd3ed95fd1d68))
- **pipeline-builder:** User can publish their pipeline to the hub ([#770](https://github.com/instill-ai/console/issues/770)) ([0ce35d2](https://github.com/instill-ai/console/commit/0ce35d2c6be45a684622b6bedb0a96dfe15202fb))
- **pipelines:** User can have more advanced pipelines page ([#776](https://github.com/instill-ai/console/issues/776)) ([f8c29df](https://github.com/instill-ai/console/commit/f8c29df18334e8d85adfffd1b16289e312f53c04))
- **sdk:** add checkNamespace endpoint ([#775](https://github.com/instill-ai/console/issues/775)) ([5a8d4b0](https://github.com/instill-ai/console/commit/5a8d4b016c9c50cb4edaebb591b1fcdac37435d1))
- User can browse other's pipelines on hub page ([#780](https://github.com/instill-ai/console/issues/780)) ([592fb51](https://github.com/instill-ai/console/commit/592fb51d180c6075ea705905aa8eeeef9dc754aa))
- **user:** User can have unified and improved profile configuration ([#783](https://github.com/instill-ai/console/issues/783)) ([66c3705](https://github.com/instill-ai/console/commit/66c370514a229e4e6323fc4dd4ed4752148c75c1))

### Bug Fixes

- fix creating pipeline public/private issue ([#798](https://github.com/instill-ai/console/issues/798)) ([bedc294](https://github.com/instill-ai/console/commit/bedc294dc2e35b4b61a995b04634ae3af406f979))
- fix dashboard not correctly display organization metric ([#799](https://github.com/instill-ai/console/issues/799)) ([7f15f3a](https://github.com/instill-ai/console/commit/7f15f3a09fef50f0d49a1358557813647970f764))
- fix dashboard query issue ([263084a](https://github.com/instill-ai/console/commit/263084a17c7674a9302d677da0a6d7d9f0dc07cb))
- fix dashboard quota message ([#795](https://github.com/instill-ai/console/issues/795)) ([8cbac13](https://github.com/instill-ai/console/commit/8cbac138c5293a7e0657d71c17af3dc075bfe534))
- fix hub not correctly fetch current user and unpublish-publish pipeline issue ([#789](https://github.com/instill-ai/console/issues/789)) ([7d6214b](https://github.com/instill-ai/console/commit/7d6214bf8824389a18cee0e238c9b44b3a967b4d))
- fix navigation bug and start operator input issue ([#797](https://github.com/instill-ai/console/issues/797)) ([9c8aed4](https://github.com/instill-ai/console/commit/9c8aed4016b183c7dace26fcf1fe645da391d6fc))
- fix routing issue in pipeline-builder, redirect new pipeline backward back to /pipelines page ([#790](https://github.com/instill-ai/console/issues/790)) ([e53cb14](https://github.com/instill-ai/console/commit/e53cb1402b82943c3b58592b90d45dcd2127e642))
- fix wrongly used entity issue ([#793](https://github.com/instill-ai/console/issues/793)) ([9238797](https://github.com/instill-ai/console/commit/9238797f264efca2dbe9645b59c46484d59bce84))
- **general:** fix not correctly create pipeline for organization ([#791](https://github.com/instill-ai/console/issues/791)) ([d52d395](https://github.com/instill-ai/console/commit/d52d3959599b108be4eb3febb226f1da482fee56))
- **pipeline:** fix input-output form not working on the pipeline details page ([#787](https://github.com/instill-ai/console/issues/787)) ([fe66f4d](https://github.com/instill-ai/console/commit/fe66f4d6825e3dc58d6ac69d19a1b31406628132))
- **sdk:** Fix organization related types ([#765](https://github.com/instill-ai/console/issues/765)) ([9ea1293](https://github.com/instill-ai/console/commit/9ea1293e54db17cf40ed57c54d5b877c7bc84811))
- **sdk:** fix various org sdk issue ([#781](https://github.com/instill-ai/console/issues/781)) ([bc54975](https://github.com/instill-ai/console/commit/bc54975ff18f69851aec6a6f8ef625219800c704))

### Miscellaneous

- **dashboard:** namananand/ins 2860 rewamp dashboard update ([#782](https://github.com/instill-ai/console/issues/782)) ([3114fdd](https://github.com/instill-ai/console/commit/3114fddd6bbcdc2c20de0b4226d6bfd803239c11))
- **dashboard:** Namananand/ins 2860 rewamp dashboard update ([#794](https://github.com/instill-ai/console/issues/794)) ([faba4f8](https://github.com/instill-ai/console/commit/faba4f80c42205d43c5169dc36335410b168532f))
- **organization:** namananand/ins 2774 organization member api ([#766](https://github.com/instill-ai/console/issues/766)) ([8974831](https://github.com/instill-ai/console/commit/89748319f7e7d08e1ea640e809d7cd15c758c85b))
- **organization:** Namananand/ins 2802 fix organization apis ([#774](https://github.com/instill-ai/console/issues/774)) ([5fd0b74](https://github.com/instill-ai/console/commit/5fd0b74c24166b80cd746b592676290c83982370))
- **organization:** namananand/ins 2802 fix organization apis ([#778](https://github.com/instill-ai/console/issues/778)) ([97572a8](https://github.com/instill-ai/console/commit/97572a8d4af77c90c385939075adac8d1b457d37))
- **orgnization:** update cache ([#767](https://github.com/instill-ai/console/issues/767)) ([2cd99c1](https://github.com/instill-ai/console/commit/2cd99c1c8d20be826d82735280e22db278030fd1))
- **pipeline-builder:** update the folder structure of pipeline-builder ([#779](https://github.com/instill-ai/console/issues/779)) ([d680845](https://github.com/instill-ai/console/commit/d680845e675838744734605d965630e926c3a3ab))
- replace advanced configurations with more in pipeline-builder's node ([#786](https://github.com/instill-ai/console/issues/786)) ([0d3fdf6](https://github.com/instill-ai/console/commit/0d3fdf620b7d5711a370f717c56464498117646b))
- update create pipeline link to pipeline builder ([#761](https://github.com/instill-ai/console/issues/761)) ([b62c937](https://github.com/instill-ai/console/commit/b62c93764a9cdc4f2fd0e5e8ec0e5673bbc1ab5b))

## [0.74.1](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.74.0...@instill-ai/toolkit-v0.74.1) (2023-11-30)

### Bug Fixes

- fix codemirror intervene with each other can cause performance issue ([#755](https://github.com/instill-ai/console/issues/755)) ([3f3e5d7](https://github.com/instill-ai/console/commit/3f3e5d719dfe600b924f273745708c14fd174bb8))
- fix the start operator's title of our templates too long and break the pipeline ([#757](https://github.com/instill-ai/console/issues/757)) ([96552d4](https://github.com/instill-ai/console/commit/96552d4d9aaf3ad598ce1630a5b7dc9d1f7f7437))

## [0.74.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.73.1...@instill-ai/toolkit-v0.74.0) (2023-11-28)

### Features

- adapt new connectors breaking changes, replace connector-resources with connectors ([#725](https://github.com/instill-ai/console/issues/725)) ([1393a8b](https://github.com/instill-ai/console/commit/1393a8bc6a3e4a59972acf30c32ab20670d84f3c))
- **general:** Update the latest naming rule ^[a-z\_][-a-z_0-9]{0,31}$ ([#739](https://github.com/instill-ai/console/issues/739)) ([e3e3fef](https://github.com/instill-ai/console/commit/e3e3fefcbaa3b646d43ab3941d8f310a4157cb0e))
- **pipeline-builder:** highlight the node when user select it ([#746](https://github.com/instill-ai/console/issues/746)) ([594ecb3](https://github.com/instill-ai/console/commit/594ecb32f37af29e1a04c0f955417c66cf9ca1b8))
- **pipeline-builder:** update the design of image and multiple images field on start operator node ([#708](https://github.com/instill-ai/console/issues/708)) ([8a7bb80](https://github.com/instill-ai/console/commit/8a7bb80920b47fb7c6d6c201982032099a78dddf))
- **pipeline-builder:** User can be better hinted when building field on start operator ([#734](https://github.com/instill-ai/console/issues/734)) ([a0bb166](https://github.com/instill-ai/console/commit/a0bb166261f63db5e05d3a700fd4c40e3f7bd61f))
- **pipeline-builder:** User can edit field on connector/operator node ([#724](https://github.com/instill-ai/console/issues/724)) ([4a2e85a](https://github.com/instill-ai/console/commit/4a2e85a2825555eddd5036a74f17dc309a7f5689))
- **pipeline-builder:** user can edit important field on operator node ([#717](https://github.com/instill-ai/console/issues/717)) ([6e7cbc0](https://github.com/instill-ai/console/commit/6e7cbc0fbae62cbf528de92232ac5cb42ef73008))
- **pipeline-builder:** user can have a better trigger flow with new pipeline builder control ([#738](https://github.com/instill-ai/console/issues/738)) ([3d5ef4e](https://github.com/instill-ai/console/commit/3d5ef4eb80971228e6cfd81569049064de351df0))
- **pipeline-builder:** User can have a bottom bar on the connector node to showcase output information ([#741](https://github.com/instill-ai/console/issues/741)) ([f7aa01c](https://github.com/instill-ai/console/commit/f7aa01cdebfaaf1ee5b6133ee1334420464401a2))
- **pipeline-builder:** user can have auto-gen componentID coming from the connector they choose ([#686](https://github.com/instill-ai/console/issues/686)) ([7991fe6](https://github.com/instill-ai/console/commit/7991fe689f358de99fbf7cfdb18e9ac06a6c4389))
- **pipeline-builder:** User can have auto-generated key coming from the field title on start operator ([#711](https://github.com/instill-ai/console/issues/711)) ([3f8abdc](https://github.com/instill-ai/console/commit/3f8abdcf32b350ae1b3b75cd883558596ea4d374))
- **pipeline-builder:** User can have better end component node design ([#695](https://github.com/instill-ai/console/issues/695)) ([79c1248](https://github.com/instill-ai/console/commit/79c12488975658f97f5c075b56b23c3469c93df5))
- **pipeline-builder:** user can have much explicit field design on start operator ([#706](https://github.com/instill-ai/console/issues/706)) ([2f52205](https://github.com/instill-ai/console/commit/2f5220541d1e0fc9877355ca674e279b932f8975))
- **pipeline-builder:** User can have new formatted output text field ([#736](https://github.com/instill-ai/console/issues/736)) ([0b45707](https://github.com/instill-ai/console/commit/0b45707d66af0025a69681ef3eb24c8aea26abae))
- **pipeline-builder:** User can have new multiple audios input ([#730](https://github.com/instill-ai/console/issues/730)) ([df4296f](https://github.com/instill-ai/console/commit/df4296f446d0c7d6d036d9c2a27cb77b54df6e2f))
- **pipeline-builder:** user can have operator component node on the pipeline-builder ([#713](https://github.com/instill-ai/console/issues/713)) ([b94dc72](https://github.com/instill-ai/console/commit/b94dc72708f7030c76c02c5e1a8c8d7ed5bced0e))
- **pipeline-builder:** user can have the new audio input on the start operator ([#728](https://github.com/instill-ai/console/issues/728)) ([f610bc5](https://github.com/instill-ai/console/commit/f610bc574a826fc109e2a9ee021d334c15ecba68))
- **pipeline-builder:** User can have the output data displayed in the new Object viewer ([#742](https://github.com/instill-ai/console/issues/742)) ([64b69b7](https://github.com/instill-ai/console/commit/64b69b7774026a00636d88bfb50cc8521ddf236b))
- **pipeline-builder:** User can re-order the field in the end component ([#693](https://github.com/instill-ai/console/issues/693)) ([d48f5f5](https://github.com/instill-ai/console/commit/d48f5f5cdf7382108799078666969fd996e95785))
- **pipeline-builder:** User can select operator and add it into pipeline-builder ([#712](https://github.com/instill-ai/console/issues/712)) ([7ac809b](https://github.com/instill-ai/console/commit/7ac809b8ac7e4de9fc60cee560b09e04f48daad1))
- **pipeline-builder:** User can upload file on start operator ([#731](https://github.com/instill-ai/console/issues/731)) ([32aeaf8](https://github.com/instill-ai/console/commit/32aeaf8a6a1a0dc9f3d44b772611d7c8950707ed))
- **pipeline-builder:** User can upload multiple files on start operator ([#732](https://github.com/instill-ai/console/issues/732)) ([376b574](https://github.com/instill-ai/console/commit/376b574456a01a69e71e5c6e5026c19155427728))
- **pipeline-builder:** User can use new array:string in start operator ([#733](https://github.com/instill-ai/console/issues/733)) ([5bccf80](https://github.com/instill-ai/console/commit/5bccf808096fc5269c205389814f93a53e91c027))
- **pipeline-builder:** user can write their own description for start operator node input field ([#710](https://github.com/instill-ai/console/issues/710)) ([b9e6289](https://github.com/instill-ai/console/commit/b9e6289fe9ca3f964bf3993c0194106bdfb1069c))
- **pipeline-builder:** Users can add note on component to describe it ([#701](https://github.com/instill-ai/console/issues/701)) ([8fad333](https://github.com/instill-ai/console/commit/8fad33395250b52dfc3e966f6eec31882d8fc5e0))
- update the new rule for all the resource's ID - lowercase, digit, underscore only and 32 characters max ([#719](https://github.com/instill-ai/console/issues/719)) ([dd1ac47](https://github.com/instill-ai/console/commit/dd1ac4750dd5e91bf1a5337880ac93e47f32bd7a))

### Bug Fixes

- fix connectors/operators output and response will make console to crash issue ([#744](https://github.com/instill-ai/console/issues/744)) ([d581b03](https://github.com/instill-ai/console/commit/d581b038b1c62019f27077da0bd0843521dac044))
- fix console not correctly handle pipeline release ([#747](https://github.com/instill-ai/console/issues/747)) ([272f8e6](https://github.com/instill-ai/console/commit/272f8e6dc3389883703c8227b50f4b34fba95a8e))
- fix pipeline builder not correctly hide data connector's free form ([#748](https://github.com/instill-ai/console/issues/748)) ([11dcf00](https://github.com/instill-ai/console/commit/11dcf000343801df5b37f20894d513f103220668))
- fix various bugs that will affect UI style and smart hint ([#751](https://github.com/instill-ai/console/issues/751)) ([84f52bb](https://github.com/instill-ai/console/commit/84f52bbd0ce28d7f05f6fa32bf392b7f71cb353a))
- fix wrongly export deps cause console-cloud failed to compile ([#740](https://github.com/instill-ai/console/issues/740)) ([b83b81a](https://github.com/instill-ai/console/commit/b83b81ab62acf6f8421b05ebf8f659d5e54e3629))
- **pipeline-builder:** fix output object viewer not correctly open when it's empty ([#745](https://github.com/instill-ai/console/issues/745)) ([54e2805](https://github.com/instill-ai/console/commit/54e280567870fffff68c564e1dc6a052d178d56c))
- **pipeline-builder:** fix pipeline-builder not correctly handle smart hint information ([#749](https://github.com/instill-ai/console/issues/749)) ([ff3f6d5](https://github.com/instill-ai/console/commit/ff3f6d58180ac005a309113f9dd869b52c927d34))

## [0.73.1](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.73.0...@instill-ai/toolkit-v0.73.1) (2023-11-15)

### Bug Fixes

- **auto-gen-form:** fix auto-gen-form not correctly handle zod validation for condition fields ([#681](https://github.com/instill-ai/console/issues/681)) ([3f479c1](https://github.com/instill-ai/console/commit/3f479c1c502793d98d222c32bfa676c7d1ceecd9))
- **auto-gen-form:** fix end component didn't correctly handle the key naming rule ([#682](https://github.com/instill-ai/console/issues/682)) ([628ab92](https://github.com/instill-ai/console/commit/628ab92235622615e5dc103387555f7265f7e327))
- **auto-gen-form:** fix end component not picking the title as title in test mode ([#680](https://github.com/instill-ai/console/issues/680)) ([0e8c292](https://github.com/instill-ai/console/commit/0e8c2926ee5519e91f5148520b0d4ca43247ec6d))
- **pipeline-builder:** Fix start component not throw error when user input the incorrect key ([#684](https://github.com/instill-ai/console/issues/684)) ([ac9f8c4](https://github.com/instill-ai/console/commit/ac9f8c4596b951d383b7dafec4b4e974788f4a1e))
- **pipeline-builder:** fix validate component ID's regex ([#685](https://github.com/instill-ai/console/issues/685)) ([e31d364](https://github.com/instill-ai/console/commit/e31d36441046ade4845c2ae63f148d01366fcea6))
- **smart-hint:** Fix smart hint wrongly hint user to use the same component's output ([#683](https://github.com/instill-ai/console/issues/683)) ([79ccf38](https://github.com/instill-ai/console/commit/79ccf380bfac48ec4cbc8d73df2a83b95b7474e3))

## [0.73.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.72.0...@instill-ai/toolkit-v0.73.0) (2023-11-11)

### Features

- add instill form playground ([#617](https://github.com/instill-ai/console/issues/617)) ([b9e4513](https://github.com/instill-ai/console/commit/b9e4513e36a80df9b319454b815584162daee988))
- **auto-form-generation:** adapt auto-form-generation on AI related forms ([#621](https://github.com/instill-ai/console/issues/621)) ([f6a1600](https://github.com/instill-ai/console/commit/f6a16006c699c88f3fb8c28d24cfbf4865f73864))
- **auto-form-generation:** expose disabledAll props on use-instill-form ([#622](https://github.com/instill-ai/console/issues/622)) ([b51b49a](https://github.com/instill-ai/console/commit/b51b49a02307dab1bf8e17a980acf4000fbba808))
- **auto-form-generation:** support auto-form-generation on blockchain related forms ([#623](https://github.com/instill-ai/console/issues/623)) ([ae23dc3](https://github.com/instill-ai/console/commit/ae23dc39f03a65eb09eef3b03d92cca050063dd0))
- **auto-form:** User can have fine-grained field level error message when input the reference/template ([#619](https://github.com/instill-ai/console/issues/619)) ([b970896](https://github.com/instill-ai/console/commit/b9708961fc533f22cbf612c47bee11a46249abcf))
- **auto-gen-form:** correctly display nested fields ([#625](https://github.com/instill-ai/console/issues/625)) ([242d278](https://github.com/instill-ai/console/commit/242d278604a9f95440cc7f3b020e19fb09281a15))
- **auto-gen-form:** correctly parse field's type from anyOf ([#624](https://github.com/instill-ai/console/issues/624)) ([f1676d9](https://github.com/instill-ai/console/commit/f1676d944df885dc61f97f8e0b5494d706b82de0))
- **auto-gen-form:** expose props to hide specific fields ([#651](https://github.com/instill-ai/console/issues/651)) ([a5898d5](https://github.com/instill-ai/console/commit/a5898d51952497f0272db8a03a1fd3d9b406571a))
- **auto-gen-form:** support auto-gen-form on data related forms ([#626](https://github.com/instill-ai/console/issues/626)) ([d06277a](https://github.com/instill-ai/console/commit/d06277a931eeea9ae584ee81bb5644030ba2daef))
- **auto-gen-form:** Support HTML tag (strong, a, code, em) in form field description ([#648](https://github.com/instill-ai/console/issues/648)) ([569ef1c](https://github.com/instill-ai/console/commit/569ef1c4e8f955703c20cf84a87f2d4b3b4ebca7))
- **auto-gen-form:** Support instillCredentialField attribute in auto-gen-form and correctly display field ([#630](https://github.com/instill-ai/console/issues/630)) ([dd6d7bd](https://github.com/instill-ai/console/commit/dd6d7bd1b6d16930456456f31742f8cf99e4c99a))
- **auto-gen-form:** support ordering for auto-gen-form's fields ([#650](https://github.com/instill-ai/console/issues/650)) ([e384102](https://github.com/instill-ai/console/commit/e3841023084cd9b4e07c002054ac216cf64f37a5))
- **auto-gen-form:** support schema without anyOf field ([#635](https://github.com/instill-ai/console/issues/635)) ([02bd31e](https://github.com/instill-ai/console/commit/02bd31ebe35b7f5cb1f672bc8832377dbcea8f9f))
- **auto-gen-form:** support webp image type in auto-gen-form ([#667](https://github.com/instill-ai/console/issues/667)) ([7847c10](https://github.com/instill-ai/console/commit/7847c10bd43393d702d55092c7d56985a8619fa6))
- **auto-gen-form:** User can have better default value when they switch between different condition ([#666](https://github.com/instill-ai/console/issues/666)) ([dfd56b4](https://github.com/instill-ai/console/commit/dfd56b42e8226d19c8f06b62e69135668f3ed9be))
- **auto-gen-form:** User can view the readable title in resource form instead of the key used by backend ([#644](https://github.com/instill-ai/console/issues/644)) ([461ea1c](https://github.com/instill-ai/console/commit/461ea1c9dc33a47cfa62ca69291e37e52270c974))
- **pipeline-builder:** Reduce the frequency of triggering auto-alignment function to reduce the un-predictable outcomes ([#640](https://github.com/instill-ai/console/issues/640)) ([c458263](https://github.com/instill-ai/console/commit/c4582634df06c61bd0316736f0cbae3eb40c70a8))
- **pipeline-builder:** User can collapse/expand the component ([#634](https://github.com/instill-ai/console/issues/634)) ([49eb621](https://github.com/instill-ai/console/commit/49eb6218e417d7e3303d4c3f5edcbe4734932ded))
- **pipeline-builder:** User can have a cleaner control dropdown on pipeline-builder's component ([#632](https://github.com/instill-ai/console/issues/632)) ([22968f1](https://github.com/instill-ai/console/commit/22968f130eb79844be97124885118286e8671a92))
- **pipeline-builder:** user can have more unified nodes width across pipeline builder ([#629](https://github.com/instill-ai/console/issues/629)) ([6f0d0c4](https://github.com/instill-ai/console/commit/6f0d0c4eea07f0cccf90ed7a8cc9d8d272ee8e02))
- **pipeline-builder:** User can store their pipeline-builder layout ([#654](https://github.com/instill-ai/console/issues/654)) ([d34a8e1](https://github.com/instill-ai/console/commit/d34a8e1313cacb038c7ab026078b51b3f4dafa85))
- rename /resources with /connectors to simplify the term on console ([#664](https://github.com/instill-ai/console/issues/664)) ([253dbdb](https://github.com/instill-ai/console/commit/253dbdb692e85f5150b8f7c2cbe4f462c0f9263e))
- **smart-hint:** adapt instillFormat in start operator metadata ([#656](https://github.com/instill-ai/console/issues/656)) ([f46b4bc](https://github.com/instill-ai/console/commit/f46b4bc9eb69e9fb6a28e967d6033abff5c1cade))
- **smart-hint:** add smart hint component and support up-to-date backend syntax ([#655](https://github.com/instill-ai/console/issues/655)) ([c90246d](https://github.com/instill-ai/console/commit/c90246d0c1d57079b2afcf8a6df8f04457819ce9))
- **smart-hint:** Parse connector component to retrieve the smart hints and put them into central store ([#653](https://github.com/instill-ai/console/issues/653)) ([81f6d7d](https://github.com/instill-ai/console/commit/81f6d7db646fbb7ee07a6993d91a9164166b04e7))
- **smart-hints:** adapt instillFormTree for output properties ([#657](https://github.com/instill-ai/console/issues/657)) ([f4f0b39](https://github.com/instill-ai/console/commit/f4f0b3915133483c0bf59a24b425c7e33bba77c0))
- **smart-hint:** support textarea smart-hint ([#660](https://github.com/instill-ai/console/issues/660)) ([5c9ebda](https://github.com/instill-ai/console/commit/5c9ebda4ebf4352ee14da457274dbe320a35dc09))
- **smart-hint:** user can be hinted by the smart hint system ([#659](https://github.com/instill-ai/console/issues/659)) ([aa6976f](https://github.com/instill-ai/console/commit/aa6976f346a31d9003951ec70e1bbf6854a2f63a))
- **smart-hint:** user can have more tolerant smart hint session and auto enclose ([#670](https://github.com/instill-ai/console/issues/670)) ([5d90824](https://github.com/instill-ai/console/commit/5d908244c66a0b54f3cf46227d41656d4d65580e))
- **smart-hint:** warn user about the not available reference or template ([#672](https://github.com/instill-ai/console/issues/672)) ([c3be8f3](https://github.com/instill-ai/console/commit/c3be8f38c939fd686f45d96aed3b18c49b3d9b81))
- unify the term on the console and add scroll-area into dialog ([#663](https://github.com/instill-ai/console/issues/663)) ([9d8804f](https://github.com/instill-ai/console/commit/9d8804f6489fcc20e5976389945a3766e830528d))

### Bug Fixes

- **auto-gen-form:** fix auto-gen form not correctly handle re-render issue ([#665](https://github.com/instill-ai/console/issues/665)) ([2363cc4](https://github.com/instill-ai/console/commit/2363cc44e6452f8f8bb5859b12dbc2086d8f1168))
- **auto-gen-form:** fix auto-gen-form not correctly handle object array ([#671](https://github.com/instill-ai/console/issues/671)) ([7532d45](https://github.com/instill-ai/console/commit/7532d45e6b7a0624785d5bbf8a8981307162c170))
- **auto-gen-form:** fix auto-gen-form not correctly handle objectArray issue ([#668](https://github.com/instill-ai/console/issues/668)) ([962d4cf](https://github.com/instill-ai/console/commit/962d4cf4c5c490f7664e5433c6fa25659d85a202))
- fix the bug of not correctly redirecting user back to onboarding page ([#627](https://github.com/instill-ai/console/issues/627)) ([36f903a](https://github.com/instill-ai/console/commit/36f903a35dda37ca7a0e311f3549487ae5af5e54))
- fix user can not create model with multipart form data ([#649](https://github.com/instill-ai/console/issues/649)) ([86122da](https://github.com/instill-ai/console/commit/86122da542da0f9ab9619e0bee27cc2ce0fa1bea))
- **pipeline-builder:** fix a but that user can rename component ID to another existed component ID ([#646](https://github.com/instill-ai/console/issues/646)) ([1879500](https://github.com/instill-ai/console/commit/187950091cdfb6b309bb6ec99aa136396407521a))
- **pipeline-builder:** fix console can not correctly display enum fields ([#647](https://github.com/instill-ai/console/issues/647)) ([5e77d32](https://github.com/instill-ai/console/commit/5e77d32e1f2adf7636523e96e0a415d8943ef8ce))
- **pipeline-builder:** fix console not correctly displayed shared pipeline ([#637](https://github.com/instill-ai/console/issues/637)) ([15614b1](https://github.com/instill-ai/console/commit/15614b1acbba9c7243021e2ff3212f02edba658d))
- **pipeline-builder:** fix console not correctly recognize complicated reference ([#638](https://github.com/instill-ai/console/issues/638)) ([2d91ec0](https://github.com/instill-ai/console/commit/2d91ec045b9ab4cee041c291ed3c44d17d6ee21f))
- **smart-hint:** fix component output issue ([#658](https://github.com/instill-ai/console/issues/658)) ([d9d3928](https://github.com/instill-ai/console/commit/d9d39287b2419392e3c0b27a9b04a5b343812aa4))
- **smart-hint:** fix smart hint can't correctly handle empty string ([#661](https://github.com/instill-ai/console/issues/661)) ([675bafe](https://github.com/instill-ai/console/commit/675bafe35323c0bd8318b8fb29902efcfda3777b))
- **smart-hint:** fix smart hit can't correctly filter the hints ([#669](https://github.com/instill-ai/console/issues/669)) ([c0a4cc5](https://github.com/instill-ai/console/commit/c0a4cc5e82324018915701c63be3557e18e2d1bf))
- **smart-hint:** fix typo and make smart hint validation tolerant more ([#677](https://github.com/instill-ai/console/issues/677)) ([7cddc2a](https://github.com/instill-ai/console/commit/7cddc2a587edba497444ce2f2923c101867c23af))
- **version-control:** fix pipeline released version not correctly guard, the trigger endpoint not correctly generate ([#628](https://github.com/instill-ai/console/issues/628)) ([24c9352](https://github.com/instill-ai/console/commit/24c935296bdd4c08b218939e1b800f337c0ea56e))

### Miscellaneous

- adapt new core structure among instill-ai project ([#610](https://github.com/instill-ai/console/issues/610)) ([9b51e90](https://github.com/instill-ai/console/commit/9b51e90e0e165704efc386931663c5c90d6bd923))
- **auto-form:** migrate auto-form function into console ([#615](https://github.com/instill-ai/console/issues/615)) ([64bd122](https://github.com/instill-ai/console/commit/64bd12213676ecbcf07b37f6dc574417f3e7bce8))
- contributors can better contribute to our frontend project (Simplify repos) ([#599](https://github.com/instill-ai/console/issues/599)) ([75d61bd](https://github.com/instill-ai/console/commit/75d61bdb857d19974d0814f876f886f39bf8bdee))
- disable snap to grid ([#641](https://github.com/instill-ai/console/issues/641)) ([af364c2](https://github.com/instill-ai/console/commit/af364c21d17e3c011860e870233be4f39fc613da))
- fix prettier not correctly initialize ([#636](https://github.com/instill-ai/console/issues/636)) ([f729990](https://github.com/instill-ai/console/commit/f7299908ae5ef1135afee05719891da84ddc58e8))
- **general:** use unified store with slice to better control global state ([#652](https://github.com/instill-ai/console/issues/652)) ([334298c](https://github.com/instill-ai/console/commit/334298c8050ad8782f4f9165f9cc642f2be8a341))
- release main ([#609](https://github.com/instill-ai/console/issues/609)) ([74d9fef](https://github.com/instill-ai/console/commit/74d9fef738867308a54dbd43ba201c31eb9bfed5))
- release main ([#642](https://github.com/instill-ai/console/issues/642)) ([b78fb4f](https://github.com/instill-ai/console/commit/b78fb4f0be1c959e70ababdaa20e7d513c91eb68))
- release main ([#645](https://github.com/instill-ai/console/issues/645)) ([66f9f3b](https://github.com/instill-ai/console/commit/66f9f3b6114ce754a1fe735c390fb7109b567f68))
- release main ([#675](https://github.com/instill-ai/console/issues/675)) ([c016bf0](https://github.com/instill-ai/console/commit/c016bf07015aa43ab920da5c7026f7b58fb50bd9))
- replace &lt;&gt;</> with <React.Fragment> ([#662](https://github.com/instill-ai/console/issues/662)) ([5ec2a71](https://github.com/instill-ai/console/commit/5ec2a71cf99bd03f160075ed0f392c31cddabe76))
- **toolkit:** Namananand/ins 2260 update profile setting page ([#613](https://github.com/instill-ai/console/issues/613)) ([6fa962b](https://github.com/instill-ai/console/commit/6fa962b534ec80fe1eb77411c7eb4612e991b66c))

## [0.72.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.71.0...@instill-ai/toolkit-v0.72.0) (2023-11-11)

### Features

- add instill form playground ([#617](https://github.com/instill-ai/console/issues/617)) ([b9e4513](https://github.com/instill-ai/console/commit/b9e4513e36a80df9b319454b815584162daee988))
- **auto-form-generation:** adapt auto-form-generation on AI related forms ([#621](https://github.com/instill-ai/console/issues/621)) ([f6a1600](https://github.com/instill-ai/console/commit/f6a16006c699c88f3fb8c28d24cfbf4865f73864))
- **auto-form-generation:** expose disabledAll props on use-instill-form ([#622](https://github.com/instill-ai/console/issues/622)) ([b51b49a](https://github.com/instill-ai/console/commit/b51b49a02307dab1bf8e17a980acf4000fbba808))
- **auto-form-generation:** support auto-form-generation on blockchain related forms ([#623](https://github.com/instill-ai/console/issues/623)) ([ae23dc3](https://github.com/instill-ai/console/commit/ae23dc39f03a65eb09eef3b03d92cca050063dd0))
- **auto-form:** User can have fine-grained field level error message when input the reference/template ([#619](https://github.com/instill-ai/console/issues/619)) ([b970896](https://github.com/instill-ai/console/commit/b9708961fc533f22cbf612c47bee11a46249abcf))
- **auto-gen-form:** correctly display nested fields ([#625](https://github.com/instill-ai/console/issues/625)) ([242d278](https://github.com/instill-ai/console/commit/242d278604a9f95440cc7f3b020e19fb09281a15))
- **auto-gen-form:** correctly parse field's type from anyOf ([#624](https://github.com/instill-ai/console/issues/624)) ([f1676d9](https://github.com/instill-ai/console/commit/f1676d944df885dc61f97f8e0b5494d706b82de0))
- **auto-gen-form:** expose props to hide specific fields ([#651](https://github.com/instill-ai/console/issues/651)) ([a5898d5](https://github.com/instill-ai/console/commit/a5898d51952497f0272db8a03a1fd3d9b406571a))
- **auto-gen-form:** support auto-gen-form on data related forms ([#626](https://github.com/instill-ai/console/issues/626)) ([d06277a](https://github.com/instill-ai/console/commit/d06277a931eeea9ae584ee81bb5644030ba2daef))
- **auto-gen-form:** Support HTML tag (strong, a, code, em) in form field description ([#648](https://github.com/instill-ai/console/issues/648)) ([569ef1c](https://github.com/instill-ai/console/commit/569ef1c4e8f955703c20cf84a87f2d4b3b4ebca7))
- **auto-gen-form:** Support instillCredentialField attribute in auto-gen-form and correctly display field ([#630](https://github.com/instill-ai/console/issues/630)) ([dd6d7bd](https://github.com/instill-ai/console/commit/dd6d7bd1b6d16930456456f31742f8cf99e4c99a))
- **auto-gen-form:** support ordering for auto-gen-form's fields ([#650](https://github.com/instill-ai/console/issues/650)) ([e384102](https://github.com/instill-ai/console/commit/e3841023084cd9b4e07c002054ac216cf64f37a5))
- **auto-gen-form:** support schema without anyOf field ([#635](https://github.com/instill-ai/console/issues/635)) ([02bd31e](https://github.com/instill-ai/console/commit/02bd31ebe35b7f5cb1f672bc8832377dbcea8f9f))
- **auto-gen-form:** support webp image type in auto-gen-form ([#667](https://github.com/instill-ai/console/issues/667)) ([7847c10](https://github.com/instill-ai/console/commit/7847c10bd43393d702d55092c7d56985a8619fa6))
- **auto-gen-form:** User can have better default value when they switch between different condition ([#666](https://github.com/instill-ai/console/issues/666)) ([dfd56b4](https://github.com/instill-ai/console/commit/dfd56b42e8226d19c8f06b62e69135668f3ed9be))
- **auto-gen-form:** User can view the readable title in resource form instead of the key used by backend ([#644](https://github.com/instill-ai/console/issues/644)) ([461ea1c](https://github.com/instill-ai/console/commit/461ea1c9dc33a47cfa62ca69291e37e52270c974))
- **pipeline-builder:** Reduce the frequency of triggering auto-alignment function to reduce the un-predictable outcomes ([#640](https://github.com/instill-ai/console/issues/640)) ([c458263](https://github.com/instill-ai/console/commit/c4582634df06c61bd0316736f0cbae3eb40c70a8))
- **pipeline-builder:** User can collapse/expand the component ([#634](https://github.com/instill-ai/console/issues/634)) ([49eb621](https://github.com/instill-ai/console/commit/49eb6218e417d7e3303d4c3f5edcbe4734932ded))
- **pipeline-builder:** User can have a cleaner control dropdown on pipeline-builder's component ([#632](https://github.com/instill-ai/console/issues/632)) ([22968f1](https://github.com/instill-ai/console/commit/22968f130eb79844be97124885118286e8671a92))
- **pipeline-builder:** user can have more unified nodes width across pipeline builder ([#629](https://github.com/instill-ai/console/issues/629)) ([6f0d0c4](https://github.com/instill-ai/console/commit/6f0d0c4eea07f0cccf90ed7a8cc9d8d272ee8e02))
- **pipeline-builder:** User can store their pipeline-builder layout ([#654](https://github.com/instill-ai/console/issues/654)) ([d34a8e1](https://github.com/instill-ai/console/commit/d34a8e1313cacb038c7ab026078b51b3f4dafa85))
- rename /resources with /connectors to simplify the term on console ([#664](https://github.com/instill-ai/console/issues/664)) ([253dbdb](https://github.com/instill-ai/console/commit/253dbdb692e85f5150b8f7c2cbe4f462c0f9263e))
- **smart-hint:** adapt instillFormat in start operator metadata ([#656](https://github.com/instill-ai/console/issues/656)) ([f46b4bc](https://github.com/instill-ai/console/commit/f46b4bc9eb69e9fb6a28e967d6033abff5c1cade))
- **smart-hint:** add smart hint component and support up-to-date backend syntax ([#655](https://github.com/instill-ai/console/issues/655)) ([c90246d](https://github.com/instill-ai/console/commit/c90246d0c1d57079b2afcf8a6df8f04457819ce9))
- **smart-hint:** Parse connector component to retrieve the smart hints and put them into central store ([#653](https://github.com/instill-ai/console/issues/653)) ([81f6d7d](https://github.com/instill-ai/console/commit/81f6d7db646fbb7ee07a6993d91a9164166b04e7))
- **smart-hints:** adapt instillFormTree for output properties ([#657](https://github.com/instill-ai/console/issues/657)) ([f4f0b39](https://github.com/instill-ai/console/commit/f4f0b3915133483c0bf59a24b425c7e33bba77c0))
- **smart-hint:** support textarea smart-hint ([#660](https://github.com/instill-ai/console/issues/660)) ([5c9ebda](https://github.com/instill-ai/console/commit/5c9ebda4ebf4352ee14da457274dbe320a35dc09))
- **smart-hint:** user can be hinted by the smart hint system ([#659](https://github.com/instill-ai/console/issues/659)) ([aa6976f](https://github.com/instill-ai/console/commit/aa6976f346a31d9003951ec70e1bbf6854a2f63a))
- **smart-hint:** user can have more tolerant smart hint session and auto enclose ([#670](https://github.com/instill-ai/console/issues/670)) ([5d90824](https://github.com/instill-ai/console/commit/5d908244c66a0b54f3cf46227d41656d4d65580e))
- **smart-hint:** warn user about the not available reference or template ([#672](https://github.com/instill-ai/console/issues/672)) ([c3be8f3](https://github.com/instill-ai/console/commit/c3be8f38c939fd686f45d96aed3b18c49b3d9b81))
- unify the term on the console and add scroll-area into dialog ([#663](https://github.com/instill-ai/console/issues/663)) ([9d8804f](https://github.com/instill-ai/console/commit/9d8804f6489fcc20e5976389945a3766e830528d))

### Bug Fixes

- **auto-gen-form:** fix auto-gen form not correctly handle re-render issue ([#665](https://github.com/instill-ai/console/issues/665)) ([2363cc4](https://github.com/instill-ai/console/commit/2363cc44e6452f8f8bb5859b12dbc2086d8f1168))
- **auto-gen-form:** fix auto-gen-form not correctly handle object array ([#671](https://github.com/instill-ai/console/issues/671)) ([7532d45](https://github.com/instill-ai/console/commit/7532d45e6b7a0624785d5bbf8a8981307162c170))
- **auto-gen-form:** fix auto-gen-form not correctly handle objectArray issue ([#668](https://github.com/instill-ai/console/issues/668)) ([962d4cf](https://github.com/instill-ai/console/commit/962d4cf4c5c490f7664e5433c6fa25659d85a202))
- fix the bug of not correctly redirecting user back to onboarding page ([#627](https://github.com/instill-ai/console/issues/627)) ([36f903a](https://github.com/instill-ai/console/commit/36f903a35dda37ca7a0e311f3549487ae5af5e54))
- fix user can not create model with multipart form data ([#649](https://github.com/instill-ai/console/issues/649)) ([86122da](https://github.com/instill-ai/console/commit/86122da542da0f9ab9619e0bee27cc2ce0fa1bea))
- **pipeline-builder:** fix a but that user can rename component ID to another existed component ID ([#646](https://github.com/instill-ai/console/issues/646)) ([1879500](https://github.com/instill-ai/console/commit/187950091cdfb6b309bb6ec99aa136396407521a))
- **pipeline-builder:** fix console can not correctly display enum fields ([#647](https://github.com/instill-ai/console/issues/647)) ([5e77d32](https://github.com/instill-ai/console/commit/5e77d32e1f2adf7636523e96e0a415d8943ef8ce))
- **pipeline-builder:** fix console not correctly displayed shared pipeline ([#637](https://github.com/instill-ai/console/issues/637)) ([15614b1](https://github.com/instill-ai/console/commit/15614b1acbba9c7243021e2ff3212f02edba658d))
- **pipeline-builder:** fix console not correctly recognize complicated reference ([#638](https://github.com/instill-ai/console/issues/638)) ([2d91ec0](https://github.com/instill-ai/console/commit/2d91ec045b9ab4cee041c291ed3c44d17d6ee21f))
- **smart-hint:** fix component output issue ([#658](https://github.com/instill-ai/console/issues/658)) ([d9d3928](https://github.com/instill-ai/console/commit/d9d39287b2419392e3c0b27a9b04a5b343812aa4))
- **smart-hint:** fix smart hint can't correctly handle empty string ([#661](https://github.com/instill-ai/console/issues/661)) ([675bafe](https://github.com/instill-ai/console/commit/675bafe35323c0bd8318b8fb29902efcfda3777b))
- **smart-hint:** fix smart hit can't correctly filter the hints ([#669](https://github.com/instill-ai/console/issues/669)) ([c0a4cc5](https://github.com/instill-ai/console/commit/c0a4cc5e82324018915701c63be3557e18e2d1bf))
- **version-control:** fix pipeline released version not correctly guard, the trigger endpoint not correctly generate ([#628](https://github.com/instill-ai/console/issues/628)) ([24c9352](https://github.com/instill-ai/console/commit/24c935296bdd4c08b218939e1b800f337c0ea56e))

### Miscellaneous

- adapt new core structure among instill-ai project ([#610](https://github.com/instill-ai/console/issues/610)) ([9b51e90](https://github.com/instill-ai/console/commit/9b51e90e0e165704efc386931663c5c90d6bd923))
- **auto-form:** migrate auto-form function into console ([#615](https://github.com/instill-ai/console/issues/615)) ([64bd122](https://github.com/instill-ai/console/commit/64bd12213676ecbcf07b37f6dc574417f3e7bce8))
- contributors can better contribute to our frontend project (Simplify repos) ([#599](https://github.com/instill-ai/console/issues/599)) ([75d61bd](https://github.com/instill-ai/console/commit/75d61bdb857d19974d0814f876f886f39bf8bdee))
- disable snap to grid ([#641](https://github.com/instill-ai/console/issues/641)) ([af364c2](https://github.com/instill-ai/console/commit/af364c21d17e3c011860e870233be4f39fc613da))
- fix prettier not correctly initialize ([#636](https://github.com/instill-ai/console/issues/636)) ([f729990](https://github.com/instill-ai/console/commit/f7299908ae5ef1135afee05719891da84ddc58e8))
- **general:** use unified store with slice to better control global state ([#652](https://github.com/instill-ai/console/issues/652)) ([334298c](https://github.com/instill-ai/console/commit/334298c8050ad8782f4f9165f9cc642f2be8a341))
- release main ([#609](https://github.com/instill-ai/console/issues/609)) ([74d9fef](https://github.com/instill-ai/console/commit/74d9fef738867308a54dbd43ba201c31eb9bfed5))
- release main ([#642](https://github.com/instill-ai/console/issues/642)) ([b78fb4f](https://github.com/instill-ai/console/commit/b78fb4f0be1c959e70ababdaa20e7d513c91eb68))
- release main ([#645](https://github.com/instill-ai/console/issues/645)) ([66f9f3b](https://github.com/instill-ai/console/commit/66f9f3b6114ce754a1fe735c390fb7109b567f68))
- replace &lt;&gt;</> with <React.Fragment> ([#662](https://github.com/instill-ai/console/issues/662)) ([5ec2a71](https://github.com/instill-ai/console/commit/5ec2a71cf99bd03f160075ed0f392c31cddabe76))
- **toolkit:** Namananand/ins 2260 update profile setting page ([#613](https://github.com/instill-ai/console/issues/613)) ([6fa962b](https://github.com/instill-ai/console/commit/6fa962b534ec80fe1eb77411c7eb4612e991b66c))

## [0.71.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.70.0...@instill-ai/toolkit-v0.71.0) (2023-11-10)

### Features

- **auto-gen-form:** expose props to hide specific fields ([#651](https://github.com/instill-ai/console/issues/651)) ([a5898d5](https://github.com/instill-ai/console/commit/a5898d51952497f0272db8a03a1fd3d9b406571a))
- **auto-gen-form:** Support HTML tag (strong, a, code, em) in form field description ([#648](https://github.com/instill-ai/console/issues/648)) ([569ef1c](https://github.com/instill-ai/console/commit/569ef1c4e8f955703c20cf84a87f2d4b3b4ebca7))
- **auto-gen-form:** support ordering for auto-gen-form's fields ([#650](https://github.com/instill-ai/console/issues/650)) ([e384102](https://github.com/instill-ai/console/commit/e3841023084cd9b4e07c002054ac216cf64f37a5))
- **auto-gen-form:** support webp image type in auto-gen-form ([#667](https://github.com/instill-ai/console/issues/667)) ([7847c10](https://github.com/instill-ai/console/commit/7847c10bd43393d702d55092c7d56985a8619fa6))
- **auto-gen-form:** User can have better default value when they switch between different condition ([#666](https://github.com/instill-ai/console/issues/666)) ([dfd56b4](https://github.com/instill-ai/console/commit/dfd56b42e8226d19c8f06b62e69135668f3ed9be))
- **auto-gen-form:** User can view the readable title in resource form instead of the key used by backend ([#644](https://github.com/instill-ai/console/issues/644)) ([461ea1c](https://github.com/instill-ai/console/commit/461ea1c9dc33a47cfa62ca69291e37e52270c974))
- **pipeline-builder:** User can store their pipeline-builder layout ([#654](https://github.com/instill-ai/console/issues/654)) ([d34a8e1](https://github.com/instill-ai/console/commit/d34a8e1313cacb038c7ab026078b51b3f4dafa85))
- rename /resources with /connectors to simplify the term on console ([#664](https://github.com/instill-ai/console/issues/664)) ([253dbdb](https://github.com/instill-ai/console/commit/253dbdb692e85f5150b8f7c2cbe4f462c0f9263e))
- **smart-hint:** adapt instillFormat in start operator metadata ([#656](https://github.com/instill-ai/console/issues/656)) ([f46b4bc](https://github.com/instill-ai/console/commit/f46b4bc9eb69e9fb6a28e967d6033abff5c1cade))
- **smart-hint:** add smart hint component and support up-to-date backend syntax ([#655](https://github.com/instill-ai/console/issues/655)) ([c90246d](https://github.com/instill-ai/console/commit/c90246d0c1d57079b2afcf8a6df8f04457819ce9))
- **smart-hint:** Parse connector component to retrieve the smart hints and put them into central store ([#653](https://github.com/instill-ai/console/issues/653)) ([81f6d7d](https://github.com/instill-ai/console/commit/81f6d7db646fbb7ee07a6993d91a9164166b04e7))
- **smart-hints:** adapt instillFormTree for output properties ([#657](https://github.com/instill-ai/console/issues/657)) ([f4f0b39](https://github.com/instill-ai/console/commit/f4f0b3915133483c0bf59a24b425c7e33bba77c0))
- **smart-hint:** support textarea smart-hint ([#660](https://github.com/instill-ai/console/issues/660)) ([5c9ebda](https://github.com/instill-ai/console/commit/5c9ebda4ebf4352ee14da457274dbe320a35dc09))
- **smart-hint:** user can be hinted by the smart hint system ([#659](https://github.com/instill-ai/console/issues/659)) ([aa6976f](https://github.com/instill-ai/console/commit/aa6976f346a31d9003951ec70e1bbf6854a2f63a))
- **smart-hint:** user can have more tolerant smart hint session and auto enclose ([#670](https://github.com/instill-ai/console/issues/670)) ([5d90824](https://github.com/instill-ai/console/commit/5d908244c66a0b54f3cf46227d41656d4d65580e))
- **smart-hint:** warn user about the not available reference or template ([#672](https://github.com/instill-ai/console/issues/672)) ([c3be8f3](https://github.com/instill-ai/console/commit/c3be8f38c939fd686f45d96aed3b18c49b3d9b81))
- unify the term on the console and add scroll-area into dialog ([#663](https://github.com/instill-ai/console/issues/663)) ([9d8804f](https://github.com/instill-ai/console/commit/9d8804f6489fcc20e5976389945a3766e830528d))

### Bug Fixes

- **auto-gen-form:** fix auto-gen form not correctly handle re-render issue ([#665](https://github.com/instill-ai/console/issues/665)) ([2363cc4](https://github.com/instill-ai/console/commit/2363cc44e6452f8f8bb5859b12dbc2086d8f1168))
- **auto-gen-form:** fix auto-gen-form not correctly handle object array ([#671](https://github.com/instill-ai/console/issues/671)) ([7532d45](https://github.com/instill-ai/console/commit/7532d45e6b7a0624785d5bbf8a8981307162c170))
- **auto-gen-form:** fix auto-gen-form not correctly handle objectArray issue ([#668](https://github.com/instill-ai/console/issues/668)) ([962d4cf](https://github.com/instill-ai/console/commit/962d4cf4c5c490f7664e5433c6fa25659d85a202))
- fix user can not create model with multipart form data ([#649](https://github.com/instill-ai/console/issues/649)) ([86122da](https://github.com/instill-ai/console/commit/86122da542da0f9ab9619e0bee27cc2ce0fa1bea))
- **pipeline-builder:** fix a but that user can rename component ID to another existed component ID ([#646](https://github.com/instill-ai/console/issues/646)) ([1879500](https://github.com/instill-ai/console/commit/187950091cdfb6b309bb6ec99aa136396407521a))
- **pipeline-builder:** fix console can not correctly display enum fields ([#647](https://github.com/instill-ai/console/issues/647)) ([5e77d32](https://github.com/instill-ai/console/commit/5e77d32e1f2adf7636523e96e0a415d8943ef8ce))
- **smart-hint:** fix component output issue ([#658](https://github.com/instill-ai/console/issues/658)) ([d9d3928](https://github.com/instill-ai/console/commit/d9d39287b2419392e3c0b27a9b04a5b343812aa4))
- **smart-hint:** fix smart hint can't correctly handle empty string ([#661](https://github.com/instill-ai/console/issues/661)) ([675bafe](https://github.com/instill-ai/console/commit/675bafe35323c0bd8318b8fb29902efcfda3777b))
- **smart-hint:** fix smart hit can't correctly filter the hints ([#669](https://github.com/instill-ai/console/issues/669)) ([c0a4cc5](https://github.com/instill-ai/console/commit/c0a4cc5e82324018915701c63be3557e18e2d1bf))

### Miscellaneous

- **general:** use unified store with slice to better control global state ([#652](https://github.com/instill-ai/console/issues/652)) ([334298c](https://github.com/instill-ai/console/commit/334298c8050ad8782f4f9165f9cc642f2be8a341))
- replace &lt;&gt;</> with <React.Fragment> ([#662](https://github.com/instill-ai/console/issues/662)) ([5ec2a71](https://github.com/instill-ai/console/commit/5ec2a71cf99bd03f160075ed0f392c31cddabe76))

## [0.70.0](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.69.1...@instill-ai/toolkit-v0.70.0) (2023-10-27)

### Features

- add instill form playground ([#617](https://github.com/instill-ai/console/issues/617)) ([b9e4513](https://github.com/instill-ai/console/commit/b9e4513e36a80df9b319454b815584162daee988))
- **auto-form-generation:** adapt auto-form-generation on AI related forms ([#621](https://github.com/instill-ai/console/issues/621)) ([f6a1600](https://github.com/instill-ai/console/commit/f6a16006c699c88f3fb8c28d24cfbf4865f73864))
- **auto-form-generation:** expose disabledAll props on use-instill-form ([#622](https://github.com/instill-ai/console/issues/622)) ([b51b49a](https://github.com/instill-ai/console/commit/b51b49a02307dab1bf8e17a980acf4000fbba808))
- **auto-form-generation:** support auto-form-generation on blockchain related forms ([#623](https://github.com/instill-ai/console/issues/623)) ([ae23dc3](https://github.com/instill-ai/console/commit/ae23dc39f03a65eb09eef3b03d92cca050063dd0))
- **auto-form:** User can have fine-grained field level error message when input the reference/template ([#619](https://github.com/instill-ai/console/issues/619)) ([b970896](https://github.com/instill-ai/console/commit/b9708961fc533f22cbf612c47bee11a46249abcf))
- **auto-gen-form:** correctly display nested fields ([#625](https://github.com/instill-ai/console/issues/625)) ([242d278](https://github.com/instill-ai/console/commit/242d278604a9f95440cc7f3b020e19fb09281a15))
- **auto-gen-form:** correctly parse field's type from anyOf ([#624](https://github.com/instill-ai/console/issues/624)) ([f1676d9](https://github.com/instill-ai/console/commit/f1676d944df885dc61f97f8e0b5494d706b82de0))
- **auto-gen-form:** support auto-gen-form on data related forms ([#626](https://github.com/instill-ai/console/issues/626)) ([d06277a](https://github.com/instill-ai/console/commit/d06277a931eeea9ae584ee81bb5644030ba2daef))
- **auto-gen-form:** Support instillCredentialField attribute in auto-gen-form and correctly display field ([#630](https://github.com/instill-ai/console/issues/630)) ([dd6d7bd](https://github.com/instill-ai/console/commit/dd6d7bd1b6d16930456456f31742f8cf99e4c99a))
- **auto-gen-form:** support schema without anyOf field ([#635](https://github.com/instill-ai/console/issues/635)) ([02bd31e](https://github.com/instill-ai/console/commit/02bd31ebe35b7f5cb1f672bc8832377dbcea8f9f))
- **pipeline-builder:** Reduce the frequency of triggering auto-alignment function to reduce the un-predictable outcomes ([#640](https://github.com/instill-ai/console/issues/640)) ([c458263](https://github.com/instill-ai/console/commit/c4582634df06c61bd0316736f0cbae3eb40c70a8))
- **pipeline-builder:** User can collapse/expand the component ([#634](https://github.com/instill-ai/console/issues/634)) ([49eb621](https://github.com/instill-ai/console/commit/49eb6218e417d7e3303d4c3f5edcbe4734932ded))
- **pipeline-builder:** User can have a cleaner control dropdown on pipeline-builder's component ([#632](https://github.com/instill-ai/console/issues/632)) ([22968f1](https://github.com/instill-ai/console/commit/22968f130eb79844be97124885118286e8671a92))
- **pipeline-builder:** user can have more unified nodes width across pipeline builder ([#629](https://github.com/instill-ai/console/issues/629)) ([6f0d0c4](https://github.com/instill-ai/console/commit/6f0d0c4eea07f0cccf90ed7a8cc9d8d272ee8e02))

### Bug Fixes

- fix the bug of not correctly redirecting user back to onboarding page ([#627](https://github.com/instill-ai/console/issues/627)) ([36f903a](https://github.com/instill-ai/console/commit/36f903a35dda37ca7a0e311f3549487ae5af5e54))
- **pipeline-builder:** fix console not correctly displayed shared pipeline ([#637](https://github.com/instill-ai/console/issues/637)) ([15614b1](https://github.com/instill-ai/console/commit/15614b1acbba9c7243021e2ff3212f02edba658d))
- **pipeline-builder:** fix console not correctly recognize complicated reference ([#638](https://github.com/instill-ai/console/issues/638)) ([2d91ec0](https://github.com/instill-ai/console/commit/2d91ec045b9ab4cee041c291ed3c44d17d6ee21f))
- **version-control:** fix pipeline released version not correctly guard, the trigger endpoint not correctly generate ([#628](https://github.com/instill-ai/console/issues/628)) ([24c9352](https://github.com/instill-ai/console/commit/24c935296bdd4c08b218939e1b800f337c0ea56e))

### Miscellaneous

- **auto-form:** migrate auto-form function into console ([#615](https://github.com/instill-ai/console/issues/615)) ([64bd122](https://github.com/instill-ai/console/commit/64bd12213676ecbcf07b37f6dc574417f3e7bce8))
- disable snap to grid ([#641](https://github.com/instill-ai/console/issues/641)) ([af364c2](https://github.com/instill-ai/console/commit/af364c21d17e3c011860e870233be4f39fc613da))
- fix prettier not correctly initialize ([#636](https://github.com/instill-ai/console/issues/636)) ([f729990](https://github.com/instill-ai/console/commit/f7299908ae5ef1135afee05719891da84ddc58e8))
- **toolkit:** Namananand/ins 2260 update profile setting page ([#613](https://github.com/instill-ai/console/issues/613)) ([6fa962b](https://github.com/instill-ai/console/commit/6fa962b534ec80fe1eb77411c7eb4612e991b66c))

## [0.69.1](https://github.com/instill-ai/console/compare/@instill-ai/toolkit-v0.69.0...@instill-ai/toolkit-v0.69.1) (2023-10-20)

### Miscellaneous

- adapt new core structure among instill-ai project ([#610](https://github.com/instill-ai/console/issues/610)) ([9b51e90](https://github.com/instill-ai/console/commit/9b51e90e0e165704efc386931663c5c90d6bd923))
- contributors can better contribute to our frontend project (Simplify repos) ([#599](https://github.com/instill-ai/console/issues/599)) ([75d61bd](https://github.com/instill-ai/console/commit/75d61bdb857d19974d0814f876f886f39bf8bdee))

## [0.69.0](https://github.com/instill-ai/cortex/compare/@instill-ai/toolkit-v0.68.2...@instill-ai/toolkit-v0.69.0) (2023-10-13)

### Features

- **cortex:** user can duplicate the pipeline they owned ([#945](https://github.com/instill-ai/cortex/issues/945)) ([e8719d3](https://github.com/instill-ai/cortex/commit/e8719d33d7fb17b38fb46e9dd2c11da6b88a9bf7))
- **pipeline-builder:** Make the array fields on start node start with only one field ([#959](https://github.com/instill-ai/cortex/issues/959)) ([e203cde](https://github.com/instill-ai/cortex/commit/e203cde35a9507d38428635f5e0babec8e064d45))
- **pipeline-builder:** User can better differentiate the resource_name on right panel and the node_name on the node ([#953](https://github.com/instill-ai/cortex/issues/953)) ([4e21a13](https://github.com/instill-ai/cortex/commit/4e21a13973a2b622e4160a8e4bc41d106af65197))
- **pipeline-builder:** User can have cleaner canvas by introducing smooth-edge edges ([#958](https://github.com/instill-ai/cortex/issues/958)) ([780ee01](https://github.com/instill-ai/cortex/commit/780ee01a0b3dab8a05a5dba3ce8a002a57b2962c))
- **pipeline-builder:** user can have consistent node width between TEST_VIEW and BUILD_VIEW ([#957](https://github.com/instill-ai/cortex/issues/957)) ([82f2a04](https://github.com/instill-ai/cortex/commit/82f2a04eac5829b0c18ccc37ce60adf5e105f3dd))
- **toolkit:** adapt the new component input structure ([#951](https://github.com/instill-ai/cortex/issues/951)) ([9dc5835](https://github.com/instill-ai/cortex/commit/9dc58355c7fd8587fcf1a79737a24ac1ff7e9c8c))
- **toolkit:** user can better identify some nested output on connector nodes ([#954](https://github.com/instill-ai/cortex/issues/954)) ([f1c6b38](https://github.com/instill-ai/cortex/commit/f1c6b3832763f38e546c5b3490dba1c01c5664b9))
- **toolkit:** User can better identify the process is still running when doing actions ([#952](https://github.com/instill-ai/cortex/issues/952)) ([4a1f433](https://github.com/instill-ai/cortex/commit/4a1f433fbd95e52271629f6ab7f1a429d75ee72d))
- **toolkit:** User can have autoresize input when edit node and pipeline name ([#948](https://github.com/instill-ai/cortex/issues/948)) ([4d2bbc5](https://github.com/instill-ai/cortex/commit/4d2bbc5a70b73d620393ac667e3792f1b1ff5064))

### Bug Fixes

- **pipeline-builder:** fix a bug when create fields on the end operator will wrongly use the key from the previous edited field ([#956](https://github.com/instill-ai/cortex/issues/956)) ([a679fd6](https://github.com/instill-ai/cortex/commit/a679fd69bde36da82cb6085c6ba2bbc15765ed51))
- **pipeline-builder:** fix data connector can't correctly display the free-form's value ([#962](https://github.com/instill-ai/cortex/issues/962)) ([5625723](https://github.com/instill-ai/cortex/commit/5625723e666edc9f9625b5d9688de539b0ac5cf0))
- **pipeline-builder:** fix data connector can't have multiple free-form fields ([#960](https://github.com/instill-ai/cortex/issues/960)) ([64d48df](https://github.com/instill-ai/cortex/commit/64d48df9a132673b2c95b3974e03f9e4949a3449))
- **toolkit:** fix a bug when trigger pipeline, we wrongly parsed string value to number ([#955](https://github.com/instill-ai/cortex/issues/955)) ([be87383](https://github.com/instill-ai/cortex/commit/be8738325d7cda4bdde2c85eb0d7ddeac87977b4))
- **toolkit:** fix console doesn't correctly handle boolean value on pipeline builder ([#961](https://github.com/instill-ai/cortex/issues/961)) ([2e4159a](https://github.com/instill-ai/cortex/commit/2e4159a6057269ff8e170e27043598c60571d9a9))
- **toolkit:** fix rename pipeline issue when there has unsaved changes ([#950](https://github.com/instill-ai/cortex/issues/950)) ([0fafdb3](https://github.com/instill-ai/cortex/commit/0fafdb3694a8dd1bc03ca3b479068522a535722c))
- **toolkit:** fix start operator wrongly delete input when you edit without saving then creating a new field ([#949](https://github.com/instill-ai/cortex/issues/949)) ([b75cddc](https://github.com/instill-ai/cortex/commit/b75cddc191797a0e92900d904667a5b45833c0f8))

## [0.68.2](https://github.com/instill-ai/cortex/compare/@instill-ai/toolkit-v0.68.1...@instill-ai/toolkit-v0.68.2) (2023-10-04)

### Bug Fixes

- **toolkit:** fix schema parsing error on Pinecone, Bigquery and GCS cause console to crash ([#936](https://github.com/instill-ai/cortex/issues/936)) ([e40fa26](https://github.com/instill-ai/cortex/commit/e40fa26afbe7e7cb3f343497d3a8cbc326a651ee))
- **toolkit:** fix the wrong component configuration field description for instill model ([#938](https://github.com/instill-ai/cortex/issues/938)) ([5617dd4](https://github.com/instill-ai/cortex/commit/5617dd4b20fcf670cbf71f3bc72480e400ebf44a))

## [0.68.1](https://github.com/instill-ai/cortex/compare/@instill-ai/toolkit-v0.68.0...@instill-ai/toolkit-v0.68.1) (2023-09-30)

### Bug Fixes

- fix user can not filter their existing resource when create resource directly on pipeline builder ([#934](https://github.com/instill-ai/cortex/issues/934)) ([8c32921](https://github.com/instill-ai/cortex/commit/8c32921ee66c2c2a7729f571a8f2477f6cfb5924))

## [0.68.0](https://github.com/instill-ai/cortex/compare/@instill-ai/toolkit-v0.67.4...@instill-ai/toolkit-v0.68.0) (2023-09-30)

### Features

- release 0.68 ([#932](https://github.com/instill-ai/cortex/issues/932)) ([5516b63](https://github.com/instill-ai/cortex/commit/5516b63e172bd0c672700f7448b4bb9b725f8432))

## [0.67.4](https://github.com/instill-ai/cortex/compare/@instill-ai/toolkit-v0.67.3...@instill-ai/toolkit-v0.67.4) (2023-09-22)

### Bug Fixes

- fix model name not included user name when create model ([#876](https://github.com/instill-ai/cortex/issues/876)) ([48f6d17](https://github.com/instill-ai/cortex/commit/48f6d17be3887d113136db388e5d118b36ae858c))

## [0.67.3](https://github.com/instill-ai/cortex/compare/@instill-ai/toolkit-v0.67.2...@instill-ai/toolkit-v0.67.3) (2023-09-22)

### Bug Fixes

- **toolkit:** fix model-hub view didn't expose disabledCreateModel prop ([#874](https://github.com/instill-ai/cortex/issues/874)) ([e433fac](https://github.com/instill-ai/cortex/commit/e433facaf1c4ff263ace648fa7ddfc5282ae83df))

## [0.67.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.67.1...@instill-ai/toolkit-v0.67.2) (2023-09-14)

### Bug Fixes

- fix Blockchainform validation ([#856](https://github.com/instill-ai/design-system/issues/856)) ([b2e7d78](https://github.com/instill-ai/design-system/commit/b2e7d78db1b99fec49172ddc262f1321b701cd94))

## [0.67.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.67.0...@instill-ai/toolkit-v0.67.1) (2023-09-13)

### Bug Fixes

- fix snippet typo ([#854](https://github.com/instill-ai/design-system/issues/854)) ([5948e39](https://github.com/instill-ai/design-system/commit/5948e39297d16794fc8ce5a8c71448448539b979))

## [0.67.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.66.0...@instill-ai/toolkit-v0.67.0) (2023-09-13)

### Features

- support object and object_array ([#851](https://github.com/instill-ai/design-system/issues/851)) ([50fa8a6](https://github.com/instill-ai/design-system/commit/50fa8a6078412bc7f46036098a587228464f3d13))

### Bug Fixes

- fix data connector issue ([#853](https://github.com/instill-ai/design-system/issues/853)) ([2124dd7](https://github.com/instill-ai/design-system/commit/2124dd780f4c15642d34e15d822b2317568c74ff))

## [0.66.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.65.2...@instill-ai/toolkit-v0.66.0) (2023-09-13)

### Features

- component centric revamp ([#849](https://github.com/instill-ai/design-system/issues/849)) ([ec5925c](https://github.com/instill-ai/design-system/commit/ec5925c80a8a94376cebe24a1bdb22ba888e271b))

## [0.65.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.65.1...@instill-ai/toolkit-v0.65.2) (2023-08-23)

### Bug Fixes

- **toolkit:** update minInterval of y-axis ([#819](https://github.com/instill-ai/design-system/issues/819)) ([4b7c1d2](https://github.com/instill-ai/design-system/commit/4b7c1d28ff1d0e3f362b91ef69cf2d8255dce711))

## [0.65.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.65.0...@instill-ai/toolkit-v0.65.1) (2023-08-22)

### Miscellaneous

- **toolkit:** update dashboard chart ([#817](https://github.com/instill-ai/design-system/issues/817)) ([98457de](https://github.com/instill-ai/design-system/commit/98457debf6a1265579a093ecf362e16396f984f5))

## [0.65.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.64.3...@instill-ai/toolkit-v0.65.0) (2023-08-19)

### Features

- **toolkit:** add loader to state change for model deploy and undeploy ([#815](https://github.com/instill-ai/design-system/issues/815)) ([06af5eb](https://github.com/instill-ai/design-system/commit/06af5eb2de65be080deb1636f092de3e2193cb65))

## [0.64.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.64.2...@instill-ai/toolkit-v0.64.3) (2023-08-17)

### Miscellaneous

- **toolkit:** update dashboard chart legend click option ([#814](https://github.com/instill-ai/design-system/issues/814)) ([f1c0377](https://github.com/instill-ai/design-system/commit/f1c0377cbcfe98f75d10e2c96ed82731fea7b1a3))

## [0.64.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.64.1...@instill-ai/toolkit-v0.64.2) (2023-08-16)

### Miscellaneous

- **toolkit:** update all table props accessToken ([#810](https://github.com/instill-ai/design-system/issues/810)) ([4cf3120](https://github.com/instill-ai/design-system/commit/4cf3120b63c39be9e76ab310cc66ea7d9d8a500d))

## [0.64.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.64.0...@instill-ai/toolkit-v0.64.1) (2023-08-09)

### Miscellaneous

- **toolkit:** namananand/ins 1487 based on separate metric data into buckets in backend adopt ([#792](https://github.com/instill-ai/design-system/issues/792)) ([8cdad68](https://github.com/instill-ai/design-system/commit/8cdad686b042a6ba348706432f21043fe8ad48b5))

## [0.64.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.28...@instill-ai/toolkit-v0.64.0) (2023-08-09)

### Features

- **toolkit:** update toolkit for dashboard new API's ([#790](https://github.com/instill-ai/design-system/issues/790)) ([7482d13](https://github.com/instill-ai/design-system/commit/7482d138ed02e63a66ce286fce30bbbc02a7b2fe))

## [0.63.28](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.27...@instill-ai/toolkit-v0.63.28) (2023-08-07)

### Bug Fixes

- **toolkit:** table columns ([#782](https://github.com/instill-ai/design-system/issues/782)) ([86e8004](https://github.com/instill-ai/design-system/commit/86e8004d5f28ba1406ed40b4787c8b9e79963164))

## [0.63.27](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.26...@instill-ai/toolkit-v0.63.27) (2023-08-07)

### Bug Fixes

- **toolkit:** AI table column size ([#780](https://github.com/instill-ai/design-system/issues/780)) ([495b44e](https://github.com/instill-ai/design-system/commit/495b44e334d7c27c9ecdb83e14a40ba728049f25))

## [0.63.26](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.25...@instill-ai/toolkit-v0.63.26) (2023-08-07)

### Bug Fixes

- **toolkit:** column size fix ([#779](https://github.com/instill-ai/design-system/issues/779)) ([935a8cb](https://github.com/instill-ai/design-system/commit/935a8cb79fdef654292dc409e62e5cdf53d27708))

### Miscellaneous

- **toolkit:** add sortByTriggerTime for pipeline triggertable ([#777](https://github.com/instill-ai/design-system/issues/777)) ([067dc47](https://github.com/instill-ai/design-system/commit/067dc4783d3943c6dcb3c9fed460299f16efb251))

## [0.63.25](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.24...@instill-ai/toolkit-v0.63.25) (2023-08-06)

### Miscellaneous

- **toolkit:** update time in local timezone for pipeline trigger table ([#775](https://github.com/instill-ai/design-system/issues/775)) ([86f8adc](https://github.com/instill-ai/design-system/commit/86f8adcfccc22823d63232b7f793f12db08981e0))

## [0.63.24](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.23...@instill-ai/toolkit-v0.63.24) (2023-08-04)

### Bug Fixes

- **toolkit:** Speech Recognition form select ([#773](https://github.com/instill-ai/design-system/issues/773)) ([15f399d](https://github.com/instill-ai/design-system/commit/15f399d43de2b3164af36519d0af8e2fd40225be))

## [0.63.23](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.22...@instill-ai/toolkit-v0.63.23) (2023-08-04)

### Bug Fixes

- **toolkit:** small fixes for AI, model and Pipeline table ([#765](https://github.com/instill-ai/design-system/issues/765)) ([86790ee](https://github.com/instill-ai/design-system/commit/86790ee317c562ecab039de821f5c0bfde611c75))

## [0.63.22](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.21...@instill-ai/toolkit-v0.63.22) (2023-08-03)

### Miscellaneous

- **toolkit:** update engine for stability AI ([#761](https://github.com/instill-ai/design-system/issues/761)) ([7cf5d2a](https://github.com/instill-ai/design-system/commit/7cf5d2a20f8b334493013dde577f5696a65dc7d9))

## [0.63.21](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.20...@instill-ai/toolkit-v0.63.21) (2023-08-03)

### Bug Fixes

- **toolkit:** column name ([#759](https://github.com/instill-ai/design-system/issues/759)) ([afd3119](https://github.com/instill-ai/design-system/commit/afd3119bdf23b5d71fa80835dbfed61fba93d57d))

## [0.63.20](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.19...@instill-ai/toolkit-v0.63.20) (2023-08-03)

### Bug Fixes

- **toolkit:** update pipeline delete button ([#757](https://github.com/instill-ai/design-system/issues/757)) ([2b830bb](https://github.com/instill-ai/design-system/commit/2b830bb29025e99b6ff5d0fb29e426815defdd7c))

## [0.63.19](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.18...@instill-ai/toolkit-v0.63.19) (2023-08-03)

### Bug Fixes

- **toolkit:** update preset label ([#755](https://github.com/instill-ai/design-system/issues/755)) ([9a8c674](https://github.com/instill-ai/design-system/commit/9a8c674988c517bfc319f93e3214692f07dcf17e))

## [0.63.18](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.17...@instill-ai/toolkit-v0.63.18) (2023-08-03)

### Bug Fixes

- **toolkit:** update label AI form ([#753](https://github.com/instill-ai/design-system/issues/753)) ([8cc70e0](https://github.com/instill-ai/design-system/commit/8cc70e0e7857fd6eb9680137a3b571902d0f463f))

## [0.63.17](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.16...@instill-ai/toolkit-v0.63.17) (2023-08-03)

### Bug Fixes

- update pipeline component dependency ([#751](https://github.com/instill-ai/design-system/issues/751)) ([a03c963](https://github.com/instill-ai/design-system/commit/a03c963b6d9501094f44e6441f8f696383adab49))

## [0.63.16](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.15...@instill-ai/toolkit-v0.63.16) (2023-08-03)

### Bug Fixes

- **toolkit:** AIs table fix ([#749](https://github.com/instill-ai/design-system/issues/749)) ([8b9da69](https://github.com/instill-ai/design-system/commit/8b9da695a1197d5907d7e025d1a6e0f1cc5b3914))

## [0.63.15](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.14...@instill-ai/toolkit-v0.63.15) (2023-08-03)

### Miscellaneous

- support audios node ([#747](https://github.com/instill-ai/design-system/issues/747)) ([b00ba19](https://github.com/instill-ai/design-system/commit/b00ba19ad58fdd68781fdedca6e89b0144c97b4f))

## [0.63.14](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.13...@instill-ai/toolkit-v0.63.14) (2023-08-03)

### Miscellaneous

- update label for operators ([#745](https://github.com/instill-ai/design-system/issues/745)) ([c6d8f6f](https://github.com/instill-ai/design-system/commit/c6d8f6fcaa78f3a589649a79d35eecedccdcf5b7))

## [0.63.13](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.12...@instill-ai/toolkit-v0.63.13) (2023-08-02)

### Miscellaneous

- **toolkit:** update label ([#743](https://github.com/instill-ai/design-system/issues/743)) ([075cdbe](https://github.com/instill-ai/design-system/commit/075cdbe48f971942cb5a6cf5d6ea0ff0bc56bc23))

## [0.63.12](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.11...@instill-ai/toolkit-v0.63.12) (2023-08-02)

### Bug Fixes

- **toolkit:** fix placeholder ([#741](https://github.com/instill-ai/design-system/issues/741)) ([a8e4ca6](https://github.com/instill-ai/design-system/commit/a8e4ca645f0232026b32a77ed20d2615d31d2e28))

## [0.63.11](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.10...@instill-ai/toolkit-v0.63.11) (2023-08-02)

### Bug Fixes

- update label ([#738](https://github.com/instill-ai/design-system/issues/738)) ([0348a3a](https://github.com/instill-ai/design-system/commit/0348a3ad08fa98abf8fe7d0e04ec380a7fc346c1))

### Miscellaneous

- add data and operator delete model ([#740](https://github.com/instill-ai/design-system/issues/740)) ([44c796d](https://github.com/instill-ai/design-system/commit/44c796d154b366d5c4f5d88f74578f2cca741bb9))

## [0.63.10](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.9...@instill-ai/toolkit-v0.63.10) (2023-08-02)

### Miscellaneous

- update CONNECTOR_TYPE_DESTINATION to CONNECTOR_TYPE_DATA ([#736](https://github.com/instill-ai/design-system/issues/736)) ([5fc44a9](https://github.com/instill-ai/design-system/commit/5fc44a9aabc03840e6806665ca0367465262cfa0))

## [0.63.9](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.8...@instill-ai/toolkit-v0.63.9) (2023-08-02)

### Miscellaneous

- **toolkit:** update CONNECTOR_TYPE_SOURCE to CONNECTOR_TYPE_OPERATOR ([#734](https://github.com/instill-ai/design-system/issues/734)) ([7273635](https://github.com/instill-ai/design-system/commit/7273635cc268e8a867e5abf8de2a9975d8db320a))

## [0.63.8](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.7...@instill-ai/toolkit-v0.63.8) (2023-08-02)

### Miscellaneous

- **toolkit:** update connector type ([#732](https://github.com/instill-ai/design-system/issues/732)) ([e620929](https://github.com/instill-ai/design-system/commit/e620929fdcc2ee8dc6a6752fd8c72ba5c37749e7))

## [0.63.7](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.6...@instill-ai/toolkit-v0.63.7) (2023-08-02)

### Bug Fixes

- **toolkit:** export fix ([#730](https://github.com/instill-ai/design-system/issues/730)) ([7eac52f](https://github.com/instill-ai/design-system/commit/7eac52f88dfc988a471e42da4cdeeaf930b5a6ef))

## [0.63.6](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.5...@instill-ai/toolkit-v0.63.6) (2023-08-02)

### Bug Fixes

- **toolkit:** pipeline table column alignment ([#728](https://github.com/instill-ai/design-system/issues/728)) ([827b85e](https://github.com/instill-ai/design-system/commit/827b85e417c37c0eae21c8510118badd2efbe1d1))

## [0.63.5](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.4...@instill-ai/toolkit-v0.63.5) (2023-08-02)

### Bug Fixes

- **toolkit:** export fix ([#726](https://github.com/instill-ai/design-system/issues/726)) ([2f78492](https://github.com/instill-ai/design-system/commit/2f784929e99b779ea95b368a6c58f02a0372fff8))

## [0.63.4](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.3...@instill-ai/toolkit-v0.63.4) (2023-08-01)

### Miscellaneous

- update connector type ([#724](https://github.com/instill-ai/design-system/issues/724)) ([fb51ee2](https://github.com/instill-ai/design-system/commit/fb51ee2e439fe696b15f04caba2f5d5a69a8ad55))

## [0.63.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.2...@instill-ai/toolkit-v0.63.3) (2023-08-01)

### Miscellaneous

- pipeline and ai table add delete model ([#721](https://github.com/instill-ai/design-system/issues/721)) ([a41e43c](https://github.com/instill-ai/design-system/commit/a41e43cdbf12b37e898158c9c7424e3c351d63f4))

## [0.63.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.1...@instill-ai/toolkit-v0.63.2) (2023-08-01)

### Miscellaneous

- namananand/ins 1451 add delete model for blockchain table ([#719](https://github.com/instill-ai/design-system/issues/719)) ([4e5d1ea](https://github.com/instill-ai/design-system/commit/4e5d1ea3b22cc74bcd479598dbbb7347bbf2e257))

## [0.63.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.63.0...@instill-ai/toolkit-v0.63.1) (2023-07-31)

### Miscellaneous

- update export components ([#717](https://github.com/instill-ai/design-system/issues/717)) ([5d99c1c](https://github.com/instill-ai/design-system/commit/5d99c1c098fe092adc2512c7d814a6864c92a7b2))

## [0.63.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.62.1...@instill-ai/toolkit-v0.63.0) (2023-07-28)

### Features

- update OpenAI AI Connector creation form ([#714](https://github.com/instill-ai/design-system/issues/714)) ([8801bdb](https://github.com/instill-ai/design-system/commit/8801bdbf91efb9822bccb3df9a889fb06752864f))

## [0.62.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.62.0...@instill-ai/toolkit-v0.62.1) (2023-07-28)

### Bug Fixes

- Namananand/ins 1427 move console new table design to design system and toolkit ([#712](https://github.com/instill-ai/design-system/issues/712)) ([1ad21fc](https://github.com/instill-ai/design-system/commit/1ad21fcd121ef09af42e4a7a6b939f16741845a0))

## [0.62.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.11...@instill-ai/toolkit-v0.62.0) (2023-07-28)

### Features

- **toolkit:** move components to toolkit ([#710](https://github.com/instill-ai/design-system/issues/710)) ([6284b72](https://github.com/instill-ai/design-system/commit/6284b722955385c99668d728504c47c88fac1eb2))

## [0.61.11](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.10...@instill-ai/toolkit-v0.61.11) (2023-07-27)

### Bug Fixes

- namananand/ins 1412 dashboard chart change not correct ([#708](https://github.com/instill-ai/design-system/issues/708)) ([8433715](https://github.com/instill-ai/design-system/commit/8433715ccb28a4cc9efa39bbdc7dda9232b9adfb))

## [0.61.10](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.9...@instill-ai/toolkit-v0.61.10) (2023-07-27)

### Bug Fixes

- namananand/ins 1412 dashboard chart change not correct ([#706](https://github.com/instill-ai/design-system/issues/706)) ([9ac1c1b](https://github.com/instill-ai/design-system/commit/9ac1c1b6c62dd1f1b726f474f86dd6c18dc2c28d))

## [0.61.9](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.8...@instill-ai/toolkit-v0.61.9) (2023-07-27)

### Bug Fixes

- delta changes calculation ([#704](https://github.com/instill-ai/design-system/issues/704)) ([8158a58](https://github.com/instill-ai/design-system/commit/8158a58bbbfd0ef52f9f33199a08dc2f56ca1dbf))

## [0.61.8](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.7...@instill-ai/toolkit-v0.61.8) (2023-07-27)

### Bug Fixes

- namananand/ins 1408 make pipeline status as delete not unspecified for metrics ([#702](https://github.com/instill-ai/design-system/issues/702)) ([4dc263b](https://github.com/instill-ai/design-system/commit/4dc263b35eae5858f4870aef45a338219d20ffb6))

## [0.61.7](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.6...@instill-ai/toolkit-v0.61.7) (2023-07-27)

### Bug Fixes

- **toolkit:** pipeline state fix ([#700](https://github.com/instill-ai/design-system/issues/700)) ([ecf34ed](https://github.com/instill-ai/design-system/commit/ecf34edfe931c7895d39aff8138b7e4b487c9c08))

## [0.61.6](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.5...@instill-ai/toolkit-v0.61.6) (2023-07-27)

### Bug Fixes

- Namananand/ins 1413 after refresh the day value reset to today ([#698](https://github.com/instill-ai/design-system/issues/698)) ([6727b93](https://github.com/instill-ai/design-system/commit/6727b93e091bb811cd6c63c3408b1c59d8233f32))

## [0.61.5](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.4...@instill-ai/toolkit-v0.61.5) (2023-07-27)

### Bug Fixes

- table placeholder export ([#691](https://github.com/instill-ai/design-system/issues/691)) ([b824f62](https://github.com/instill-ai/design-system/commit/b824f62301ed53f7ac81c396026721d531622e48))
- **toolkit:** url fix for dashboard ([#695](https://github.com/instill-ai/design-system/issues/695)) ([f68abad](https://github.com/instill-ai/design-system/commit/f68abad08d7f8069ad258a60fdb846ad6ea005a2))

## [0.61.4](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.3...@instill-ai/toolkit-v0.61.4) (2023-07-25)

### Bug Fixes

- create blockchain wrong label ([#689](https://github.com/instill-ai/design-system/issues/689)) ([da2bb1b](https://github.com/instill-ai/design-system/commit/da2bb1b6d17e2614c1d2f7e48639bafde28e919d))

## [0.61.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.2...@instill-ai/toolkit-v0.61.3) (2023-07-23)

### Bug Fixes

- **design-system:** refresh button fix ([#686](https://github.com/instill-ai/design-system/issues/686)) ([523a5c0](https://github.com/instill-ai/design-system/commit/523a5c0dd6341db2e845ce5deaf6cbba3972c720))

## [0.61.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.1...@instill-ai/toolkit-v0.61.2) (2023-07-21)

### Bug Fixes

- **toolkit:** chart trigger count fix ([#681](https://github.com/instill-ai/design-system/issues/681)) ([a73f076](https://github.com/instill-ai/design-system/commit/a73f076d15b6b5f1df020a4a9eaddaf9e3e823f9))
- **toolkit:** trigger pipeline specific fix ([#682](https://github.com/instill-ai/design-system/issues/682)) ([8fa4477](https://github.com/instill-ai/design-system/commit/8fa4477b8057c3ab48895e8b07d8e2e6795d9059))

## [0.61.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.61.0...@instill-ai/toolkit-v0.61.1) (2023-07-20)

### Bug Fixes

- **toolkit:** fix public connector not disabled issue ([#679](https://github.com/instill-ai/design-system/issues/679)) ([da3a083](https://github.com/instill-ai/design-system/commit/da3a0830e824c84d82f97bb986447ebc5290f5fe))

## [0.61.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.60.5...@instill-ai/toolkit-v0.61.0) (2023-07-19)

### Features

- add dashboard into cortex ([#650](https://github.com/instill-ai/design-system/issues/650)) ([aa292b7](https://github.com/instill-ai/design-system/commit/aa292b7125eb1324b1b38fd4975b0ffcd4c8e2d1))
- add support stability AI SDXL model ([#646](https://github.com/instill-ai/design-system/issues/646)) ([deca30b](https://github.com/instill-ai/design-system/commit/deca30b694841b1ae1b58bb0094c5b86f924653d))
- **toolkit:** add Image to Image task into Stability AI connector ([#644](https://github.com/instill-ai/design-system/issues/644)) ([8dcde3a](https://github.com/instill-ai/design-system/commit/8dcde3a5d528fa6ee6dcff9d7ca9a29f1feb26ec))
- **toolkit:** add OpenAI preset ([#655](https://github.com/instill-ai/design-system/issues/655)) ([f76b76e](https://github.com/instill-ai/design-system/commit/f76b76ed703e3377f5407ecfe135ee025fb1b29a))
- **toolkit:** add query param to pre-fill the field of AI connector ([#658](https://github.com/instill-ai/design-system/issues/658)) ([555eb77](https://github.com/instill-ai/design-system/commit/555eb77e4f6bba30247a772d89eb75448ee13c63))
- **toolkit:** implement new multiple handlers pipeline builder ([#642](https://github.com/instill-ai/design-system/issues/642)) ([876778c](https://github.com/instill-ai/design-system/commit/876778c319427ca37f6949018e30b822234402d4))
- **toolkit:** support openai connector ([#645](https://github.com/instill-ai/design-system/issues/645)) ([1b85139](https://github.com/instill-ai/design-system/commit/1b85139068cc164c84d3578670f667d9490eeba0))
- update the node style and disable one side of trigger/response handler ([#657](https://github.com/instill-ai/design-system/issues/657)) ([359884b](https://github.com/instill-ai/design-system/commit/359884b91278fab327a2eef44755a0bd8bccea2c))

### Bug Fixes

- fix div non interactive lint issue ([#652](https://github.com/instill-ai/design-system/issues/652)) ([9c55fac](https://github.com/instill-ai/design-system/commit/9c55facfe1096e0728397153cad42e124f66294b))
- **toolkit:** chart date range not correct for today and last day ([#666](https://github.com/instill-ai/design-system/issues/666)) ([feed468](https://github.com/instill-ai/design-system/commit/feed468d69d785fa7c21c50cb50d932346baea22))
- **toolkit:** fix pipeline-builder CustomNode not stay on top issue ([#665](https://github.com/instill-ai/design-system/issues/665)) ([d2251fa](https://github.com/instill-ai/design-system/commit/d2251fad647bc126c9d196f3ac19f21673235b81))
- **toolkit:** fix the bg-color of the unspecified state node ([#667](https://github.com/instill-ai/design-system/issues/667)) ([597e4c1](https://github.com/instill-ai/design-system/commit/597e4c1dc3d012d98bfe2449795bcf1941222fa7))

### Miscellaneous

- **release:** release main ([95ce09e](https://github.com/instill-ai/design-system/commit/95ce09ede9f33550f5aad385e334910a1638c49e))
- **release:** release main ([a93e6d2](https://github.com/instill-ai/design-system/commit/a93e6d2d9d8dc2d04a2c094f740c49fff09f2fc2))
- **toolkit:** adapt new unify source and destination ([#647](https://github.com/instill-ai/design-system/issues/647)) ([d8a5a5f](https://github.com/instill-ai/design-system/commit/d8a5a5f21a9a79edb12fb3dde1b05f8c40e9adf8))
- **toolkit:** deprecate pipeline.mode ([#661](https://github.com/instill-ai/design-system/issues/661)) ([1b26f5c](https://github.com/instill-ai/design-system/commit/1b26f5c904cab3095f9c4d6418fec23958b534f7))
- **toolkit:** update model task icons in AI related fields ([#671](https://github.com/instill-ai/design-system/issues/671)) ([a173cac](https://github.com/instill-ai/design-system/commit/a173cac60cb2c53d3c1353f5548a91e4ea60eae5))
- **toolkit:** update pipeline trigger script ([#660](https://github.com/instill-ai/design-system/issues/660)) ([fc5b797](https://github.com/instill-ai/design-system/commit/fc5b79712c316e8561f6d90558751980b32252ff))

## [0.60.5](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.60.4...@instill-ai/toolkit-v0.60.5) (2023-07-12)

### Bug Fixes

- fix connector form in pipeline-builder wrongly disable connect button issue ([#636](https://github.com/instill-ai/design-system/issues/636)) ([80ccd23](https://github.com/instill-ai/design-system/commit/80ccd23a0d07068a18cf05a92b277cbeab12ac2d))

## [0.60.4](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.60.3...@instill-ai/toolkit-v0.60.4) (2023-07-12)

### Bug Fixes

- fix the spin animation text color of save button in pipeline-builder ([#634](https://github.com/instill-ai/design-system/issues/634)) ([1902a5a](https://github.com/instill-ai/design-system/commit/1902a5a73a30cddae18477636d8a5c82b90f6403))

## [0.60.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.60.2...@instill-ai/toolkit-v0.60.3) (2023-07-11)

### Bug Fixes

- **toolkit:** fix unnecessary fetch in pipeline-builder ([#632](https://github.com/instill-ai/design-system/issues/632)) ([6fe4b71](https://github.com/instill-ai/design-system/commit/6fe4b718a72318462fa4194ed2185842ccd5f37d))

## [0.60.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.60.1...@instill-ai/toolkit-v0.60.2) (2023-07-11)

### Bug Fixes

- **toolkit:** fix pipelineBuilderStore pipelineRecipeIsDirty setter issue ([#627](https://github.com/instill-ai/design-system/issues/627)) ([a59b61c](https://github.com/instill-ai/design-system/commit/a59b61c3db2666b4dc4ea58c46016bbce8bc0750))
- **toolkit:** fix rename issue ([#630](https://github.com/instill-ai/design-system/issues/630)) ([2b65d91](https://github.com/instill-ai/design-system/commit/2b65d9152d641bc5f0460cd168b97118d318f0e2))

## [0.60.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.60.0...@instill-ai/toolkit-v0.60.1) (2023-07-11)

### Bug Fixes

- fix save pipeline action not correctly early return ([#625](https://github.com/instill-ai/design-system/issues/625)) ([3b96eaf](https://github.com/instill-ai/design-system/commit/3b96eafd19d34e1d9b0c3c23077a6c6373c06e48))

## [0.60.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.59.2...@instill-ai/toolkit-v0.60.0) (2023-07-11)

### Features

- map edge animated status with the state of pipeline ([#622](https://github.com/instill-ai/design-system/issues/622)) ([7c9bb71](https://github.com/instill-ai/design-system/commit/7c9bb71393efe4f605cb843bdd545ca92c02a0f9))
- **toolkit:** save pipeline before activate/deactivate ([#624](https://github.com/instill-ai/design-system/issues/624)) ([87da931](https://github.com/instill-ai/design-system/commit/87da931758f1a3f7952ae71bf18af072d7451fa2))
- update save pipeline button to have better loading state ([#621](https://github.com/instill-ai/design-system/issues/621)) ([68ab966](https://github.com/instill-ai/design-system/commit/68ab966c3ba3330f4bfe16067c32ac0ebc275b82))

### Bug Fixes

- **pipeline-builder:** fix pipeline-builder's node name overflow text issue ([#619](https://github.com/instill-ai/design-system/issues/619)) ([0c3203d](https://github.com/instill-ai/design-system/commit/0c3203dbafad1849f9f8fa2a19fd59db1b8be87d))
- replace empty icon with fill icon in activate/deactivate button ([#620](https://github.com/instill-ai/design-system/issues/620)) ([9ed892f](https://github.com/instill-ai/design-system/commit/9ed892f35f51a56c13749923ca9912d90acc6d2d))

## [0.59.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.59.1...@instill-ai/toolkit-v0.59.2) (2023-07-09)

### Bug Fixes

- **toolkit:** fix pipeline builder ondelete issue ([#615](https://github.com/instill-ai/design-system/issues/615)) ([e2af146](https://github.com/instill-ai/design-system/commit/e2af14688d3870849adc6b88b8b6bed83def8052))

## [0.59.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.59.0...@instill-ai/toolkit-v0.59.1) (2023-07-09)

### Bug Fixes

- remove duplicated save button ([#612](https://github.com/instill-ai/design-system/issues/612)) ([a6ee0e6](https://github.com/instill-ai/design-system/commit/a6ee0e633520568ac8a723a43ba4a82b1d60d43b))

## [0.59.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.58.0...@instill-ai/toolkit-v0.59.0) (2023-07-09)

### Features

- **toolkit:** Add save button at the right panel ([#611](https://github.com/instill-ai/design-system/issues/611)) ([60482c0](https://github.com/instill-ai/design-system/commit/60482c04f72e1017faa175c71f8498f66799b959))

### Bug Fixes

- fix pipeline-builder unselect not working ([#609](https://github.com/instill-ai/design-system/issues/609)) ([0fec1b0](https://github.com/instill-ai/design-system/commit/0fec1b08263dd9aeb1dc2e3bf332866ff755e452))

## [0.58.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.57.0...@instill-ai/toolkit-v0.58.0) (2023-07-08)

### Features

- let user clean up unsaved form ([#608](https://github.com/instill-ai/design-system/issues/608)) ([7da8b74](https://github.com/instill-ai/design-system/commit/7da8b743b6ebde7be584d3fbf4afea12c4c17c46))

### Bug Fixes

- disable all the actions toward public connector ([#606](https://github.com/instill-ai/design-system/issues/606)) ([d5eb689](https://github.com/instill-ai/design-system/commit/d5eb689e2f1af624d3f2c8301f3ec597650a17ab))
- fix left panel scroll issue ([#604](https://github.com/instill-ai/design-system/issues/604)) ([315aff2](https://github.com/instill-ai/design-system/commit/315aff2a7291589a4ccfe0edc94327eff7b6e2a7))

## [0.57.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.56.0...@instill-ai/toolkit-v0.57.0) (2023-07-08)

### Features

- add DraggableItem skeleton ([#603](https://github.com/instill-ai/design-system/issues/603)) ([6b43ed0](https://github.com/instill-ai/design-system/commit/6b43ed0cee956c4a2830148b6783ecc3bd65e146))
- **toolkit:** add pipeline-builder main loading spin ([#601](https://github.com/instill-ai/design-system/issues/601)) ([fc47e39](https://github.com/instill-ai/design-system/commit/fc47e398790ca1a1dfd1ff59b61d113df26637ef))

### Bug Fixes

- fix accessToken and enableQuery not correctly pass down ([#596](https://github.com/instill-ai/design-system/issues/596)) ([b86883d](https://github.com/instill-ai/design-system/commit/b86883d1fc3f1144e6ba49ed3fae6bb7dbadff38))
- fix blockchain/create id field disabled issue ([#600](https://github.com/instill-ai/design-system/issues/600)) ([7017d1f](https://github.com/instill-ai/design-system/commit/7017d1f4a108aac030bafdc70a8d5a06ab197dc8))

## [0.56.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.55.0...@instill-ai/toolkit-v0.56.0) (2023-07-07)

### Features

- don't show ai task for preset ([#588](https://github.com/instill-ai/design-system/issues/588)) ([39d1972](https://github.com/instill-ai/design-system/commit/39d1972844ab2a5d76ffe02d5a7d99df0eadc18f))
- **toolkit:** make leftsidebar default close and right panel default open ([#591](https://github.com/instill-ai/design-system/issues/591)) ([da8b5a3](https://github.com/instill-ai/design-system/commit/da8b5a3054cd2169e7af8d6c9b1c879d90eb7f1c))
- **toolkit:** update blockchain/ai connector definition ([#587](https://github.com/instill-ai/design-system/issues/587)) ([8b25a77](https://github.com/instill-ai/design-system/commit/8b25a775c0a9427c09b0695954a2fdf64f82bf25))
- **toolkit:** update pipeline table design ([#590](https://github.com/instill-ai/design-system/issues/590)) ([0b9ef4f](https://github.com/instill-ai/design-system/commit/0b9ef4f764d2b34af958503fa9056352c1d84932))
- update ai and blockchain table placeholder ([#594](https://github.com/instill-ai/design-system/issues/594)) ([497c574](https://github.com/instill-ai/design-system/commit/497c574ac0e58e952e60a40584bbd73b7cca1588))
- update ai connector definition ([#586](https://github.com/instill-ai/design-system/issues/586)) ([c768a6e](https://github.com/instill-ai/design-system/commit/c768a6e539fa3dae6ba9ad05c885ed892177ad7a))
- update the pipeline trigger snippet for CE ([#585](https://github.com/instill-ai/design-system/issues/585)) ([8f4dbd7](https://github.com/instill-ai/design-system/commit/8f4dbd7f30e9743bbd1efac4f341a5593681f3f0))

### Bug Fixes

- fix ai-connector related icons ([#583](https://github.com/instill-ai/design-system/issues/583)) ([b373039](https://github.com/instill-ai/design-system/commit/b373039e9763cfe74d6972aac50b30c0c9e7d8db))
- make blockchain flow be consistent as other connector ([#584](https://github.com/instill-ai/design-system/issues/584)) ([72cf67e](https://github.com/instill-ai/design-system/commit/72cf67ec6f819d20e50ad7659d39bfa3e053cfde))
- **toolkit,design-system:** unify text color across different form component ([#581](https://github.com/instill-ai/design-system/issues/581)) ([73ec2b9](https://github.com/instill-ai/design-system/commit/73ec2b92981a84dc5942bda8e3d69c0087d9afdf))
- **toolkit:** fix wrong preset name at left panel ([#592](https://github.com/instill-ai/design-system/issues/592)) ([42e9b72](https://github.com/instill-ai/design-system/commit/42e9b72e378a4086272d25eb1245fba6aea033b1))

### Miscellaneous

- **toolkit:** disable pipeline builder topbar editor ([#595](https://github.com/instill-ai/design-system/issues/595)) ([02786f1](https://github.com/instill-ai/design-system/commit/02786f15604d183e6dd0bd75b4852195e34a34db))

## [0.55.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.54.0...@instill-ai/toolkit-v0.55.0) (2023-07-06)

### Features

- add connect button in connector pages ([#580](https://github.com/instill-ai/design-system/issues/580)) ([e6d2fc3](https://github.com/instill-ai/design-system/commit/e6d2fc35582f6df059f45cdda5defa48fcdc2c67))

### Bug Fixes

- fix wrongly cache activate/deactivate pipeline response ([#578](https://github.com/instill-ai/design-system/issues/578)) ([0fbd5f7](https://github.com/instill-ai/design-system/commit/0fbd5f74446e8ceced22a61179399fdd5d65146e))

## [0.54.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.53.1...@instill-ai/toolkit-v0.54.0) (2023-07-06)

### Features

- add SyntaxHighlighter CodeBlock ([#575](https://github.com/instill-ai/design-system/issues/575)) ([7a79ae5](https://github.com/instill-ai/design-system/commit/7a79ae58748300945bd43080fa0bd015df4125be))
- **toolkit:** componentize pipeline-builder ([#577](https://github.com/instill-ai/design-system/issues/577)) ([aba7118](https://github.com/instill-ai/design-system/commit/aba7118fd5467255086bd2c93434f373eff8c74d))

## [0.53.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.53.0...@instill-ai/toolkit-v0.53.1) (2023-07-06)

### Bug Fixes

- **toolkit:** fix airbyte form not correctly update by the changes of initial value ([#573](https://github.com/instill-ai/design-system/issues/573)) ([aebfdf5](https://github.com/instill-ai/design-system/commit/aebfdf5064938d730b9d02a8f4aaef3b2c73cca7))

## [0.53.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.52.3...@instill-ai/toolkit-v0.53.0) (2023-07-05)

### Features

- **toolkit:** update the changes of connector ([#569](https://github.com/instill-ai/design-system/issues/569)) ([d04a4b2](https://github.com/instill-ai/design-system/commit/d04a4b2476892e703cd6cef1f960c6859d7f550b))

## [0.52.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.52.2...@instill-ai/toolkit-v0.52.3) (2023-07-05)

### Bug Fixes

- fix typo at ConfigureBlockchainForm ([#568](https://github.com/instill-ai/design-system/issues/568)) ([fc0f869](https://github.com/instill-ai/design-system/commit/fc0f86974fdc1820d5eb3defd9e35382112cbd14))

## [0.52.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.52.1...@instill-ai/toolkit-v0.52.2) (2023-07-05)

### Bug Fixes

- fix configure ai and blockchain form not update the value ([#565](https://github.com/instill-ai/design-system/issues/565)) ([23be331](https://github.com/instill-ai/design-system/commit/23be3314b768649def16434113f38b99c920edda))

## [0.52.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.52.0...@instill-ai/toolkit-v0.52.1) (2023-07-05)

### Bug Fixes

- **toolkit:** fix Airbyte input only field wrongly access variable ([#563](https://github.com/instill-ai/design-system/issues/563)) ([08d945e](https://github.com/instill-ai/design-system/commit/08d945ee6c15f7f80befa9409a6250216963a9bc))

## [0.52.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.51.1...@instill-ai/toolkit-v0.52.0) (2023-07-05)

### Features

- **toolkit:** adapt backend input_only secret design ([#561](https://github.com/instill-ai/design-system/issues/561)) ([049b65b](https://github.com/instill-ai/design-system/commit/049b65b234466dc8d81158383705e1808c7ed4a4))

## [0.51.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.51.0...@instill-ai/toolkit-v0.51.1) (2023-07-04)

### Bug Fixes

- fix model-hub link in ModelTabel ([#559](https://github.com/instill-ai/design-system/issues/559)) ([09e290e](https://github.com/instill-ai/design-system/commit/09e290e9ed2693aa3653484fe92eaf185b47fa91))

## [0.51.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.50.3...@instill-ai/toolkit-v0.51.0) (2023-07-04)

### Features

- **toolkit:** add dis/connect connector SDK ([#556](https://github.com/instill-ai/design-system/issues/556)) ([dc60cf5](https://github.com/instill-ai/design-system/commit/dc60cf5c04c701e4b48d091c4410cea0f55fe2b7))

## [0.50.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.50.2...@instill-ai/toolkit-v0.50.3) (2023-07-03)

### Bug Fixes

- fix getComponentsFromPipelineRecipe not getting data and cause error ([#553](https://github.com/instill-ai/design-system/issues/553)) ([e72f1b6](https://github.com/instill-ai/design-system/commit/e72f1b6e0002e78185d31e1f7f5427b9e96d77c5))

## [0.50.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.50.1...@instill-ai/toolkit-v0.50.2) (2023-07-03)

### Bug Fixes

- fix Connector configuration type ([#552](https://github.com/instill-ai/design-system/issues/552)) ([76f8530](https://github.com/instill-ai/design-system/commit/76f85304c004c5ebb8bab6b796ea6bcb9f2a6ace))
- **toolkit:** fix type typo and export form schema in AI and blockchain forms ([#550](https://github.com/instill-ai/design-system/issues/550)) ([99e75fa](https://github.com/instill-ai/design-system/commit/99e75fa97240581b662e195374b37f9216751829))

## [0.50.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.50.0...@instill-ai/toolkit-v0.50.1) (2023-06-30)

### Bug Fixes

- disable the user from changing the ai-connector ([#548](https://github.com/instill-ai/design-system/issues/548)) ([7cc76b2](https://github.com/instill-ai/design-system/commit/7cc76b2e1db1c539e6992fe519ea6dc7e89bd43f))

## [0.50.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.49.1...@instill-ai/toolkit-v0.50.0) (2023-06-30)

### Features

- **toolkit:** add BlockchainsTable ([#546](https://github.com/instill-ai/design-system/issues/546)) ([8f30002](https://github.com/instill-ai/design-system/commit/8f3000226a80ada79429f5de1907f7c59fcf0255))
- **toolkit:** add ConfigureBlockchainForm ([#547](https://github.com/instill-ai/design-system/issues/547)) ([5e46a95](https://github.com/instill-ai/design-system/commit/5e46a95d491a616d2bb41f2af93108aa3b5e7819))
- **toolkit:** add CreateBlockchainForm ([#544](https://github.com/instill-ai/design-system/issues/544)) ([dad67c1](https://github.com/instill-ai/design-system/commit/dad67c103e416b845757f86384fed2e526756271))

## [0.49.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.49.0...@instill-ai/toolkit-v0.49.1) (2023-06-30)

### Bug Fixes

- fix release workflow ([#540](https://github.com/instill-ai/design-system/issues/540)) ([d8690c7](https://github.com/instill-ai/design-system/commit/d8690c7be0fbb3ac3497be8556248382fb9b0f86))

## [0.49.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.48.0...@instill-ai/toolkit-v0.49.0) (2023-06-30)

### Features

- **toolkit:** adapt new instill-ai base/vdp/model structure ([#527](https://github.com/instill-ai/design-system/issues/527)) ([aa26467](https://github.com/instill-ai/design-system/commit/aa26467827c5dad0505983480a281f8c9232e43b))
- **toolkit:** adapt singular connector endpoint ([#529](https://github.com/instill-ai/design-system/issues/529)) ([4ac3734](https://github.com/instill-ai/design-system/commit/4ac37348a527af527047f41acf733cbf2ed543ba))
- **toolkit:** add CreateAIForm and AIsTable ([#533](https://github.com/instill-ai/design-system/issues/533)) ([ad70594](https://github.com/instill-ai/design-system/commit/ad7059431248b1c92a46e60adc14c125d0c73d2f))

### Bug Fixes

- **toolkit:** fix duplicated key ([#537](https://github.com/instill-ai/design-system/issues/537)) ([06ddb70](https://github.com/instill-ai/design-system/commit/06ddb7045dbc4fbf84a511d6a5f0ab95a3ddce20))
- **toolkit:** fix VisibilityCell wording ([#539](https://github.com/instill-ai/design-system/issues/539)) ([bde0800](https://github.com/instill-ai/design-system/commit/bde0800721382f7a553456c168107f41d3a039c8))

### Miscellaneous

- **toolkit:** add multiple on action at ConfigureAIForm ([#538](https://github.com/instill-ai/design-system/issues/538)) ([01e07c2](https://github.com/instill-ai/design-system/commit/01e07c2836613f5570a81c04908beae61b099b19))
- **toolkit:** replace airbyte_secret with instillCredentialField ([#534](https://github.com/instill-ai/design-system/issues/534)) ([9d15496](https://github.com/instill-ai/design-system/commit/9d154963b90b929abc696430e6109e8cf4bf9714))

## [0.48.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.47.5...@instill-ai/toolkit-v0.48.0) (2023-06-27)

### Features

- **toolkit:** add rename pipeline mutation and react-query hook ([#523](https://github.com/instill-ai/design-system/issues/523)) ([398f6b9](https://github.com/instill-ai/design-system/commit/398f6b9c841ce0ee3d144d87cfab92d699fb924c))

## [0.47.5](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.47.4...@instill-ai/toolkit-v0.47.5) (2023-06-24)

### Bug Fixes

- **toolkit:** fix connector definition type ([#516](https://github.com/instill-ai/design-system/issues/516)) ([d9a14cd](https://github.com/instill-ai/design-system/commit/d9a14cd2d4017e153de79730380c7c719a6b0f3e))

## [0.47.4](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.47.3...@instill-ai/toolkit-v0.47.4) (2023-06-19)

### Miscellaneous

- **toolkit:** adopt new connector definition format ([#501](https://github.com/instill-ai/design-system/issues/501)) ([6125733](https://github.com/instill-ai/design-system/commit/6125733c51de3de811cf2af14ea92cd1257b1fbe))

## [0.47.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.47.2...@instill-ai/toolkit-v0.47.3) (2023-06-19)

### Miscellaneous

- **cortex:** update tailwindcss version ([#498](https://github.com/instill-ai/design-system/issues/498)) ([c6dd679](https://github.com/instill-ai/design-system/commit/c6dd6794028b9e42cb051f360db47d9eca3d3987))

## [0.47.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.47.1...@instill-ai/toolkit-v0.47.2) (2023-06-19)

### Bug Fixes

- **toolkit:** fix ConfigureSourceForm source input type ([#497](https://github.com/instill-ai/design-system/issues/497)) ([9b1bf79](https://github.com/instill-ai/design-system/commit/9b1bf790eaae351294a9c5bf79ce2d73b32cf82d))

## [0.47.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.47.0...@instill-ai/toolkit-v0.47.1) (2023-06-11)

### Miscellaneous

- **toolkit:** remove PageBase from toolkit ([#483](https://github.com/instill-ai/design-system/issues/483)) ([949404b](https://github.com/instill-ai/design-system/commit/949404bc92fe35b0cad9d375d502b0087c19da78))

## [0.47.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.46.3...@instill-ai/toolkit-v0.47.0) (2023-06-11)

### Features

- add PageBase component into toolkit ([#481](https://github.com/instill-ai/design-system/issues/481)) ([f1b8539](https://github.com/instill-ai/design-system/commit/f1b853968f523f3f365fbf7a67e874d7dd9985e2))

## [0.46.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.46.2...@instill-ai/toolkit-v0.46.3) (2023-06-11)

### Bug Fixes

- fix several issues related to configure resource ([#479](https://github.com/instill-ai/design-system/issues/479)) ([e1d1dce](https://github.com/instill-ai/design-system/commit/e1d1dce53474083fe50502181d16f41b9e1a7e13))

## [0.46.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.46.1...@instill-ai/toolkit-v0.46.2) (2023-06-11)

### Bug Fixes

- fix react-query instance cause hook re-render issue ([#476](https://github.com/instill-ai/design-system/issues/476)) ([52138a5](https://github.com/instill-ai/design-system/commit/52138a578d420d0901f7bde7f651ef36cba32683))

### Miscellaneous

- remove all the initStoreOn... props ([#478](https://github.com/instill-ai/design-system/issues/478)) ([3a7bc73](https://github.com/instill-ai/design-system/commit/3a7bc7384de25df048aa9ec77fdc34e2f084adbf))

## [0.46.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.46.0...@instill-ai/toolkit-v0.46.1) (2023-06-08)

### Bug Fixes

- **toolkit:** fix test connection action incorrectly disabled ([#472](https://github.com/instill-ai/design-system/issues/472)) ([fa69069](https://github.com/instill-ai/design-system/commit/fa69069e2b912b048ae246a1e1fb4442a6900c6c))

## [0.46.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.45.0...@instill-ai/toolkit-v0.46.0) (2023-06-08)

### Features

- **toolkit:** add test connector connection button ([#470](https://github.com/instill-ai/design-system/issues/470)) ([f611d1d](https://github.com/instill-ai/design-system/commit/f611d1dd1eba38204aa22a09a4a92d968abb59f3))

## [0.45.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.44.3...@instill-ai/toolkit-v0.45.0) (2023-06-02)

### Features

- [INS-820] transform design tokens to style dictionary ([#441](https://github.com/instill-ai/design-system/issues/441)) ([f92e777](https://github.com/instill-ai/design-system/commit/f92e777cb3508ff8ce134293d971b0edfce7a25c))

## [0.44.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.44.2...@instill-ai/toolkit-v0.44.3) (2023-05-30)

### Bug Fixes

- fix not correctly query pipelines that use this resource ([#438](https://github.com/instill-ai/design-system/issues/438)) ([59033f7](https://github.com/instill-ai/design-system/commit/59033f7cbb819c576f89fc13f40c286bdc0bc7ce))

## [0.44.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.44.1...@instill-ai/toolkit-v0.44.2) (2023-05-29)

### Bug Fixes

- fix ModelsCell takes wrong field as modelName ([#436](https://github.com/instill-ai/design-system/issues/436)) ([4a779b4](https://github.com/instill-ai/design-system/commit/4a779b4fed654157b1cef69f3c452f34631af662))

## [0.44.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.44.0...@instill-ai/toolkit-v0.44.1) (2023-05-26)

### Bug Fixes

- fix createPipelineForm not generate unique uuid ([#435](https://github.com/instill-ai/design-system/issues/435)) ([eb56b2e](https://github.com/instill-ai/design-system/commit/eb56b2e1789c83d8f0406eccbfe3e8d439f3218c))
- fix prefetch wrongly use queryClient ([#433](https://github.com/instill-ai/design-system/issues/433)) ([f20b674](https://github.com/instill-ai/design-system/commit/f20b6741e662688ae759b79c21bc86b6d2979dd7))

## [0.44.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.11...@instill-ai/toolkit-v0.44.0) (2023-05-26)

### Features

- [INS-751] adapt pipeline recipe ([#430](https://github.com/instill-ai/design-system/issues/430)) ([9b91bb8](https://github.com/instill-ai/design-system/commit/9b91bb832e36c8ec09f005feaa677d1412a765d2))
- add prefetch resources function and prefetch resource in create pipeline form ([#432](https://github.com/instill-ai/design-system/issues/432)) ([f8204b0](https://github.com/instill-ai/design-system/commit/f8204b0cf4388d2094aaba4147d188e8f8ca7acb))

## [0.43.11](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.10...@instill-ai/toolkit-v0.43.11) (2023-05-25)

### Bug Fixes

- [INS-700] fix model repo description typo ([#428](https://github.com/instill-ai/design-system/issues/428)) ([133a858](https://github.com/instill-ai/design-system/commit/133a8580007b813eb95a2c63d80f2371f376a1ff))

## [0.43.10](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.9...@instill-ai/toolkit-v0.43.10) (2023-05-16)

### Miscellaneous

- remove the unused profile avatar on configure profile form ([#426](https://github.com/instill-ai/design-system/issues/426)) ([93422c8](https://github.com/instill-ai/design-system/commit/93422c8b9abf9c83d79a13f1e8009429ea32428b))

## [0.43.9](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.8...@instill-ai/toolkit-v0.43.9) (2023-05-10)

### Bug Fixes

- fix role not correctly pick ([#424](https://github.com/instill-ai/design-system/issues/424)) ([c43407a](https://github.com/instill-ai/design-system/commit/c43407a6655ec96eb8aba6dd5feaface42e35b66))

## [0.43.8](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.7...@instill-ai/toolkit-v0.43.8) (2023-05-10)

### Bug Fixes

- fix configure profile form wrongly check user id ([#422](https://github.com/instill-ai/design-system/issues/422)) ([2acaabd](https://github.com/instill-ai/design-system/commit/2acaabd96adbe330b42e71875da2fd955b7fc7c3))

## [0.43.7](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.6...@instill-ai/toolkit-v0.43.7) (2023-05-10)

### Bug Fixes

- fix configure user profile incorrectly set value ([#420](https://github.com/instill-ai/design-system/issues/420)) ([d8227b9](https://github.com/instill-ai/design-system/commit/d8227b9c7fb3e25fd755a0058ede1f153a03b078))

## [0.43.6](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.5...@instill-ai/toolkit-v0.43.6) (2023-05-08)

### Miscellaneous

- update the style when disable model creation ([#418](https://github.com/instill-ai/design-system/issues/418)) ([ac9901f](https://github.com/instill-ai/design-system/commit/ac9901f67fc92f6f90dd291616cb8c17e153a35d))

## [0.43.5](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.4...@instill-ai/toolkit-v0.43.5) (2023-05-08)

### Miscellaneous

- update ModelsTable head from Model task to AI task ([#415](https://github.com/instill-ai/design-system/issues/415)) ([3612f30](https://github.com/instill-ai/design-system/commit/3612f305222ac47a4c2d9612c85ef0fc9b30cb8a))

## [0.43.4](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.3...@instill-ai/toolkit-v0.43.4) (2023-05-05)

### Bug Fixes

- stop user from submitting the same name ([#413](https://github.com/instill-ai/design-system/issues/413)) ([2a2bb28](https://github.com/instill-ai/design-system/commit/2a2bb2810f9862443500e02b8443e4d653939b64))

## [0.43.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.2...@instill-ai/toolkit-v0.43.3) (2023-05-05)

### Bug Fixes

- fix configure user info form style ([#411](https://github.com/instill-ai/design-system/issues/411)) ([da134cc](https://github.com/instill-ai/design-system/commit/da134cc53e8edcd1f0c72dd5d038647cf47e0d85))

## [0.43.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.1...@instill-ai/toolkit-v0.43.2) (2023-05-05)

### Bug Fixes

- fix user configure form ([#409](https://github.com/instill-ai/design-system/issues/409)) ([cba798a](https://github.com/instill-ai/design-system/commit/cba798aef6488c0178a10e0323d1ea47883dbec7))

## [0.43.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.43.0...@instill-ai/toolkit-v0.43.1) (2023-05-05)

### Bug Fixes

- fix useUpdateUser not correctly sync after updating ([#407](https://github.com/instill-ai/design-system/issues/407)) ([fb93cf1](https://github.com/instill-ai/design-system/commit/fb93cf1d6fd8ac5ef614c31fb3099c0c16bdc390))

## [0.43.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.42.0...@instill-ai/toolkit-v0.43.0) (2023-05-05)

### Features

- add CF header for staging ([#405](https://github.com/instill-ai/design-system/issues/405)) ([f692117](https://github.com/instill-ai/design-system/commit/f692117ca5f7e6fcb5af2707dbca4c1ae784bd58))

## [0.42.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.41.0...@instill-ai/toolkit-v0.42.0) (2023-05-03)

### Features

- add flag to disable create model during creating pipeline ([#404](https://github.com/instill-ai/design-system/issues/404)) ([42a081f](https://github.com/instill-ai/design-system/commit/42a081ff489d367224b9f2eb7b2f4bac529a665f))
- export UseQueryResult and UseMutationResult ([#402](https://github.com/instill-ai/design-system/issues/402)) ([3ddd5b6](https://github.com/instill-ai/design-system/commit/3ddd5b631fe7b466f33e06328da076875a3cc56b))

## [0.41.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.40.3...@instill-ai/toolkit-v0.41.0) (2023-05-03)

### Features

- update amplitude config and enable pageViews and Sessions tracking ([#400](https://github.com/instill-ai/design-system/issues/400)) ([e1daf07](https://github.com/instill-ai/design-system/commit/e1daf07bbc0f19b9b418c4fe9e2f727868d54581))

## [0.40.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.40.2...@instill-ai/toolkit-v0.40.3) (2023-04-28)

### Bug Fixes

- fix ChangePipelineStateToggleProps ([#398](https://github.com/instill-ai/design-system/issues/398)) ([0f77db4](https://github.com/instill-ai/design-system/commit/0f77db469026eaf8349a7a713a518a4dd1bb71ae))

## [0.40.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.40.1...@instill-ai/toolkit-v0.40.2) (2023-04-28)

### Bug Fixes

- fix wrong getQueryString function ([#396](https://github.com/instill-ai/design-system/issues/396)) ([4def97b](https://github.com/instill-ai/design-system/commit/4def97b9c81bd87b8c244e1a5d4da6ae80dfddb8))

## [0.40.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.40.0...@instill-ai/toolkit-v0.40.1) (2023-04-28)

### Bug Fixes

- fix missing export of apiToken related query ([#394](https://github.com/instill-ai/design-system/issues/394)) ([307c11d](https://github.com/instill-ai/design-system/commit/307c11da37ba322a60c173b906c4eda4371c8ca8))

## [0.40.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.39.2...@instill-ai/toolkit-v0.40.0) (2023-04-28)

### Features

- [INS-553] add api token related react-query function and sdk ([#391](https://github.com/instill-ai/design-system/issues/391)) ([1d81422](https://github.com/instill-ai/design-system/commit/1d81422ef2649542fb2f9359abfd7027f9c735d9))

### Bug Fixes

- [INS-554] fix react-query didn't correctly update cache after mutation ([#393](https://github.com/instill-ai/design-system/issues/393)) ([08f8779](https://github.com/instill-ai/design-system/commit/08f8779379e9d0e8c0ef26e260da93d88af7ae6d))

## [0.39.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.39.1...@instill-ai/toolkit-v0.39.2) (2023-04-27)

### Bug Fixes

- fix setup destination step hint not implemented ([#389](https://github.com/instill-ai/design-system/issues/389)) ([6978360](https://github.com/instill-ai/design-system/commit/697836053c65be726921b196c9e3fda15da35ffe))

## [0.39.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.39.0...@instill-ai/toolkit-v0.39.1) (2023-04-27)

### Bug Fixes

- fix CreateSourceForm arg ([#387](https://github.com/instill-ai/design-system/issues/387)) ([89b1e51](https://github.com/instill-ai/design-system/commit/89b1e513b5439ce074684446b6989d4004a21833))

## [0.39.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.38.0...@instill-ai/toolkit-v0.39.0) (2023-04-27)

### Features

- rollback to old createPipelineForm and add enabledQuery argument ([#385](https://github.com/instill-ai/design-system/issues/385)) ([ba4356a](https://github.com/instill-ai/design-system/commit/ba4356a7874c9164bc80fc6ff911b153a79b2f18))

## [0.38.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.37.1...@instill-ai/toolkit-v0.38.0) (2023-04-25)

### Features

- remove interior query ([#383](https://github.com/instill-ai/design-system/issues/383)) ([8653cbb](https://github.com/instill-ai/design-system/commit/8653cbb51b904b4cfa0231e569de1e2cccb30484))

## [0.37.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.37.0...@instill-ai/toolkit-v0.37.1) (2023-04-24)

### Bug Fixes

- fix version ([#381](https://github.com/instill-ai/design-system/issues/381)) ([45566b2](https://github.com/instill-ai/design-system/commit/45566b2512bfe6ec1ae04ae1d3869d6fd4ceac10))

## [0.37.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.36.0...@instill-ai/toolkit-v0.37.0) (2023-04-24)

### Features

- [INS-529] update react-query api ([#378](https://github.com/instill-ai/design-system/issues/378)) ([7e9820d](https://github.com/instill-ai/design-system/commit/7e9820d9de08cd6a4e75cee921d069d305eacf3e))
- add check user exist query ([#380](https://github.com/instill-ai/design-system/issues/380)) ([a7b0d57](https://github.com/instill-ai/design-system/commit/a7b0d571e2d9659b9680fe9758fa8c1f3b18c9bd))

## [0.36.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.35.0...@instill-ai/toolkit-v0.36.0) (2023-04-24)

### Features

- rename updateLocalUserMutation to updateUserMutation ([#376](https://github.com/instill-ai/design-system/issues/376)) ([7613727](https://github.com/instill-ai/design-system/commit/7613727474e9d9484a270ef55ae1ecb318967880))

## [0.35.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.34.2...@instill-ai/toolkit-v0.35.0) (2023-04-24)

### Features

- update component api to remove all non-nullable policy ([#375](https://github.com/instill-ai/design-system/issues/375)) ([ccbf751](https://github.com/instill-ai/design-system/commit/ccbf751928e8cae1f03b28b6a584f8d9094c92e2))

### Miscellaneous

- refactor components api ([#373](https://github.com/instill-ai/design-system/issues/373)) ([c4753ed](https://github.com/instill-ai/design-system/commit/c4753edc67515a446d54c3458ef20e98f5936740))

## [0.34.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.34.1...@instill-ai/toolkit-v0.34.2) (2023-04-22)

### Bug Fixes

- fix SourcesTable search field is wrongly disabled ([#371](https://github.com/instill-ai/design-system/issues/371)) ([cb34d04](https://github.com/instill-ai/design-system/commit/cb34d0431c03bc1bfa1cbdc4056f9389154637fd))

## [0.34.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.34.0...@instill-ai/toolkit-v0.34.1) (2023-04-22)

### Bug Fixes

- fix table loading issue due to the wrong useEffect deps ([#369](https://github.com/instill-ai/design-system/issues/369)) ([a1da998](https://github.com/instill-ai/design-system/commit/a1da9984f7326d9f3f32dfbc75103432a968d6ce))

## [0.34.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.33.3...@instill-ai/toolkit-v0.34.0) (2023-04-22)

### Features

- expose react query devtool ([#366](https://github.com/instill-ai/design-system/issues/366)) ([525c219](https://github.com/instill-ai/design-system/commit/525c21954abce665784ebc0564eb3c05b21c3f30))

### Bug Fixes

- [INS-503] fix tables flash issue ([#368](https://github.com/instill-ai/design-system/issues/368)) ([3c8a6cf](https://github.com/instill-ai/design-system/commit/3c8a6cfd4a81e08aa004d5314731509b4d67f8c7))

## [0.33.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.33.2...@instill-ai/toolkit-v0.33.3) (2023-04-22)

### Bug Fixes

- make the input of table non-nullable ([#364](https://github.com/instill-ai/design-system/issues/364)) ([1b96608](https://github.com/instill-ai/design-system/commit/1b9660823f28bbd4319d2c12edee857792e6c986))

## [0.33.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.33.1...@instill-ai/toolkit-v0.33.2) (2023-04-22)

### Bug Fixes

- rollback delayed loading inside the component ([#361](https://github.com/instill-ai/design-system/issues/361)) ([e02afd7](https://github.com/instill-ai/design-system/commit/e02afd750e6e8b5001695a579b6ac843f6f00f62))

## [0.33.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.33.0...@instill-ai/toolkit-v0.33.1) (2023-04-21)

### Bug Fixes

- fix table loading flag ([#359](https://github.com/instill-ai/design-system/issues/359)) ([dcf9188](https://github.com/instill-ai/design-system/commit/dcf9188da09469c6b4c0590d7ab3ddfa0abaf9d2))

## [0.33.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.32.1...@instill-ai/toolkit-v0.33.0) (2023-04-21)

### Features

- add table loading placeholder ([#357](https://github.com/instill-ai/design-system/issues/357)) ([75b8f1f](https://github.com/instill-ai/design-system/commit/75b8f1f653b6cfb4dd096309b26a1afb2a7097ab))

## [0.32.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.32.0...@instill-ai/toolkit-v0.32.1) (2023-04-21)

### Bug Fixes

- export DehydratedState ([#355](https://github.com/instill-ai/design-system/issues/355)) ([e4e2bfa](https://github.com/instill-ai/design-system/commit/e4e2bfad1f4e5ab20dc230ad686debd9b421f250))

## [0.32.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.31.0...@instill-ai/toolkit-v0.32.0) (2023-04-21)

### Features

- export dehydrate ([#353](https://github.com/instill-ai/design-system/issues/353)) ([2ce4d06](https://github.com/instill-ai/design-system/commit/2ce4d068f159fda9d1b2811a3bea1daaec2e08ca))

## [0.31.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.30.0...@instill-ai/toolkit-v0.31.0) (2023-04-20)

### Features

- export Hydrate component ([#350](https://github.com/instill-ai/design-system/issues/350)) ([6652fc6](https://github.com/instill-ai/design-system/commit/6652fc6eaa7323e0d0f653d8c1111bd718c63303))

## [0.30.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.29.1...@instill-ai/toolkit-v0.30.0) (2023-04-19)

### Features

- alter the logic when we create model ([#349](https://github.com/instill-ai/design-system/issues/349)) ([a311946](https://github.com/instill-ai/design-system/commit/a31194628e58411b7258ac6f32f495c66ac914bd))

## [0.29.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.29.0...@instill-ai/toolkit-v0.29.1) (2023-04-13)

### Bug Fixes

- fix not exclude test file issue in the cortex/toolkit ([#345](https://github.com/instill-ai/design-system/issues/345)) ([36de549](https://github.com/instill-ai/design-system/commit/36de54958baf28c11b55a0530a20b18ab95d1ff1))

## [0.29.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.28.6...@instill-ai/toolkit-v0.29.0) (2023-04-13)

### Features

- [INS-362] add TableError component and adapt it in tables ([#340](https://github.com/instill-ai/design-system/issues/340)) ([7b49205](https://github.com/instill-ai/design-system/commit/7b49205c2297394317da9f7f146e9c8e2b7c3345))

### Bug Fixes

- fix ConfigureModelForm prop ([#344](https://github.com/instill-ai/design-system/issues/344)) ([dbe5f1f](https://github.com/instill-ai/design-system/commit/dbe5f1f90b37d0ac85eafb2c4e918297b9f2b8ed))

### Miscellaneous

- [INS-245] replace node native test runner with vitest ([#342](https://github.com/instill-ai/design-system/issues/342)) ([e020924](https://github.com/instill-ai/design-system/commit/e0209247ba0e4be3af24393b0ae167d01c03deff))
- how we import React in cortex/toolkit ([#343](https://github.com/instill-ai/design-system/issues/343)) ([47173fe](https://github.com/instill-ai/design-system/commit/47173fec60e0f48643c3b34484aba91ed2eea43a))

## [0.28.6](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.28.5...@instill-ai/toolkit-v0.28.6) (2023-04-11)

### Bug Fixes

- fix table column width ([#337](https://github.com/instill-ai/design-system/issues/337)) ([cc2f7a0](https://github.com/instill-ai/design-system/commit/cc2f7a089e45f49bab822db0867816e56e2ca9c2))

## [0.28.5](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.28.4...@instill-ai/toolkit-v0.28.5) (2023-04-10)

### Bug Fixes

- add disabled props into toggle button ([#333](https://github.com/instill-ai/design-system/issues/333)) ([5f152f5](https://github.com/instill-ai/design-system/commit/5f152f56c3712dfa066f9686bc13d8b331c061cd))

## [0.28.4](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.28.3...@instill-ai/toolkit-v0.28.4) (2023-04-08)

### Bug Fixes

- fix PipelinesTable typo ([#330](https://github.com/instill-ai/design-system/issues/330)) ([38d3b31](https://github.com/instill-ai/design-system/commit/38d3b311477d55980ea03d5cbf5d15118743bf73))

## [0.28.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.28.2...@instill-ai/toolkit-v0.28.3) (2023-04-07)

### Bug Fixes

- fix useStateOverviewCount undefined issue ([#328](https://github.com/instill-ai/design-system/issues/328)) ([28fc264](https://github.com/instill-ai/design-system/commit/28fc264b07741c8b03b9b1acf6f8de7e70e2aac9))

## [0.28.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.28.1...@instill-ai/toolkit-v0.28.2) (2023-04-07)

### Bug Fixes

- check controller state before deploy ([#326](https://github.com/instill-ai/design-system/issues/326)) ([7d9e655](https://github.com/instill-ai/design-system/commit/7d9e655057674f26b4ea05e5e0ce0bf992413d9c))

## [0.28.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.28.0...@instill-ai/toolkit-v0.28.1) (2023-04-07)

### Bug Fixes

- fix state overview ([#324](https://github.com/instill-ai/design-system/issues/324)) ([ad1a448](https://github.com/instill-ai/design-system/commit/ad1a4487b4b2f5802b6280712007bb495c3a0244))

## [0.28.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.27.3...@instill-ai/toolkit-v0.28.0) (2023-04-07)

### Features

- adapt controller state ([#321](https://github.com/instill-ai/design-system/issues/321)) ([1ab3dc8](https://github.com/instill-ai/design-system/commit/1ab3dc8058c950b5b12de77ebab16b26f0178bf7))

### Bug Fixes

- force form store to be dirty once there has value changed ([#323](https://github.com/instill-ai/design-system/issues/323)) ([83f7807](https://github.com/instill-ai/design-system/commit/83f780748c8a42ae69ed7072e7cc2ad914648241))

## [0.27.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.27.2...@instill-ai/toolkit-v0.27.3) (2023-04-06)

### Bug Fixes

- fix axios client base url ([#319](https://github.com/instill-ai/design-system/issues/319)) ([ef8bb50](https://github.com/instill-ai/design-system/commit/ef8bb505c130974b5da5f6925bd76169084bf4d1))

## [0.27.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.27.1...@instill-ai/toolkit-v0.27.2) (2023-04-06)

### Bug Fixes

- expose secure props on setCookie ([#318](https://github.com/instill-ai/design-system/issues/318)) ([7339351](https://github.com/instill-ai/design-system/commit/73393511a3537af0267339d4474e34d750cfcd62))
- fix wrong model/source/destination table head title ([#316](https://github.com/instill-ai/design-system/issues/316)) ([dbc973c](https://github.com/instill-ai/design-system/commit/dbc973c2740e6410600de5e8b624683ba9438683))

## [0.27.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.27.0...@instill-ai/toolkit-v0.27.1) (2023-04-06)

### Bug Fixes

- treat env config as boolean and int instead of string ([#314](https://github.com/instill-ai/design-system/issues/314)) ([47d0053](https://github.com/instill-ai/design-system/commit/47d0053393c454a47b25b1e3ef01c8d29a220cd6))

## [0.27.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.26.6...@instill-ai/toolkit-v0.27.0) (2023-04-06)

### Features

- expose disableDelete and disableConfigure props ([#312](https://github.com/instill-ai/design-system/issues/312)) ([4d40711](https://github.com/instill-ai/design-system/commit/4d40711c402178bcb9069fdb6e2506abe2087513))

## [0.26.6](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.26.5...@instill-ai/toolkit-v0.26.6) (2023-04-06)

### Bug Fixes

- fix delete resource modal not close right after confirmation ([#308](https://github.com/instill-ai/design-system/issues/308)) ([9b11ec6](https://github.com/instill-ai/design-system/commit/9b11ec68e14830599a33eff429547f9488f80d31))
- fix the width of setup destination step when create pipeline ([#310](https://github.com/instill-ai/design-system/issues/310)) ([1212067](https://github.com/instill-ai/design-system/commit/121206702d4797792e94bbdc3b39473070dad846))

## [0.26.5](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.26.4...@instill-ai/toolkit-v0.26.5) (2023-04-06)

### Bug Fixes

- fix CreatePipelineForm async flow ([#305](https://github.com/instill-ai/design-system/issues/305)) ([2c5f490](https://github.com/instill-ai/design-system/commit/2c5f49085f4ca460e1c4953f14c12c980ebeab77))

## [0.26.4](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.26.3...@instill-ai/toolkit-v0.26.4) (2023-04-06)

### Bug Fixes

- fix CreatePipelineForm's field id issue ([#303](https://github.com/instill-ai/design-system/issues/303)) ([f61a313](https://github.com/instill-ai/design-system/commit/f61a313c3794ab8e79ffcda35e43736bdbd60f1c))

## [0.26.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.26.2...@instill-ai/toolkit-v0.26.3) (2023-04-06)

### Bug Fixes

- fix create pipeline form not correctly set model.type issue ([#301](https://github.com/instill-ai/design-system/issues/301)) ([9f5a19c](https://github.com/instill-ai/design-system/commit/9f5a19c06d2259c425cef5ca136ea51863a886d2))

## [0.26.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.26.1...@instill-ai/toolkit-v0.26.2) (2023-04-06)

### Bug Fixes

- fix create pipeline form not correctly handle mode selection issue ([#299](https://github.com/instill-ai/design-system/issues/299)) ([fd9cc2b](https://github.com/instill-ai/design-system/commit/fd9cc2b4bcad57feece00efd4c24d752e5a03506))

## [0.26.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.26.0...@instill-ai/toolkit-v0.26.1) (2023-04-05)

### Bug Fixes

- disable ModelConfigurationFields ([#297](https://github.com/instill-ai/design-system/issues/297)) ([8594be7](https://github.com/instill-ai/design-system/commit/8594be7d3d5989f0965741aeb755c07c874e0dd0))

## [0.26.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.25.1...@instill-ai/toolkit-v0.26.0) (2023-04-05)

### Features

- add model configuration fields ([#295](https://github.com/instill-ai/design-system/issues/295)) ([d8ad252](https://github.com/instill-ai/design-system/commit/d8ad252840d96b3d38d01577460cf729c76d0dcf))

## [0.25.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.25.0...@instill-ai/toolkit-v0.25.1) (2023-04-05)

### Miscellaneous

- remove modelReadme ([#293](https://github.com/instill-ai/design-system/issues/293)) ([a06c48e](https://github.com/instill-ai/design-system/commit/a06c48e70b5a1f60a486aad99d89347104fb6326))

## [0.25.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.24.0...@instill-ai/toolkit-v0.25.0) (2023-04-05)

### Features

- add model card ([#291](https://github.com/instill-ai/design-system/issues/291)) ([eeaf84b](https://github.com/instill-ai/design-system/commit/eeaf84bc9a4b7dba16ce97fbed9bda0bc654babe))

## [0.24.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.23.3...@instill-ai/toolkit-v0.24.0) (2023-04-05)

### Features

- add model task label ([#288](https://github.com/instill-ai/design-system/issues/288)) ([8a3e050](https://github.com/instill-ai/design-system/commit/8a3e05091f90a67e3eecebded2ec25112d6bab13))
- add ModelDefinitionLabel ([#290](https://github.com/instill-ai/design-system/issues/290)) ([8815abb](https://github.com/instill-ai/design-system/commit/8815abbb3bdd2b0f18e5a20ef22da572f0eccf91))

## [0.23.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.23.2...@instill-ai/toolkit-v0.23.3) (2023-04-05)

### Bug Fixes

- fix ChangeModelStateToggle ([#286](https://github.com/instill-ai/design-system/issues/286)) ([bc47ea1](https://github.com/instill-ai/design-system/commit/bc47ea127161c610b59710bf09844ce88d7c04a3))

## [0.23.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.23.1...@instill-ai/toolkit-v0.23.2) (2023-04-05)

### Bug Fixes

- fix ConfigureDestinationForm issue ([#280](https://github.com/instill-ai/design-system/issues/280)) ([d334af8](https://github.com/instill-ai/design-system/commit/d334af8018087024658ec7eb095c0b1d0ab84dcc))

## [0.23.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.23.0...@instill-ai/toolkit-v0.23.1) (2023-04-05)

### Bug Fixes

- fix select id and refactor id of input in toolkit ([#278](https://github.com/instill-ai/design-system/issues/278)) ([63323b9](https://github.com/instill-ai/design-system/commit/63323b9db30d4777b1a97fcbce5387e6aed155dc))

## [0.23.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.22.0...@instill-ai/toolkit-v0.23.0) (2023-04-04)

### Features

- [INS-400] add normal create model form ([#274](https://github.com/instill-ai/design-system/issues/274)) ([44d06de](https://github.com/instill-ai/design-system/commit/44d06de4dfe5276d759118f4bcace19473c1278f))

## [0.22.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.21.3...@instill-ai/toolkit-v0.22.0) (2023-04-04)

### Features

- adapt model one layer design ([#272](https://github.com/instill-ai/design-system/issues/272)) ([12a7358](https://github.com/instill-ai/design-system/commit/12a7358bb183c705c675c9a68b7c690bb6a1fd18))

## [0.21.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.21.2...@instill-ai/toolkit-v0.21.3) (2023-03-31)

### Bug Fixes

- fix configure profile form ([#270](https://github.com/instill-ai/design-system/issues/270)) ([dd21760](https://github.com/instill-ai/design-system/commit/dd2176063f9ed32ee774ee4b9cd3c4dc23b801bc))

## [0.21.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.21.1...@instill-ai/toolkit-v0.21.2) (2023-03-31)

### Bug Fixes

- fix configure profile form padding ([#268](https://github.com/instill-ai/design-system/issues/268)) ([ac08538](https://github.com/instill-ai/design-system/commit/ac085382cb2fa890487e1c8adacabcdc74f3027a))

## [0.21.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.21.0...@instill-ai/toolkit-v0.21.1) (2023-03-31)

### Bug Fixes

- fix user related request ([#266](https://github.com/instill-ai/design-system/issues/266)) ([b9cefee](https://github.com/instill-ai/design-system/commit/b9cefeebb1918d0f3ff1272d82d953fe87c6f005))

## [0.21.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.20.0...@instill-ai/toolkit-v0.21.0) (2023-03-31)

### Features

- digest user in configure profile form ([#264](https://github.com/instill-ai/design-system/issues/264)) ([8c1938f](https://github.com/instill-ai/design-system/commit/8c1938f20def9a75183d34f80578868168863654))

## [0.20.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.19.0...@instill-ai/toolkit-v0.20.0) (2023-03-28)

### Features

- export necessary function from react-query ([#262](https://github.com/instill-ai/design-system/issues/262)) ([4932c33](https://github.com/instill-ai/design-system/commit/4932c330e999c1c91c41dfcaa66f9dc4b35d2e81))

## [0.19.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.18.0...@instill-ai/toolkit-v0.19.0) (2023-03-28)

### Features

- add enable flag in services ([#260](https://github.com/instill-ai/design-system/issues/260)) ([6ef4260](https://github.com/instill-ai/design-system/commit/6ef42605d741266053e20e7cddda1c80a7d7f747))

## [0.18.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.17.1...@instill-ai/toolkit-v0.18.0) (2023-03-24)

### Features

- [INS-309] add table placeholders ([#254](https://github.com/instill-ai/design-system/issues/254)) ([0e00cd4](https://github.com/instill-ai/design-system/commit/0e00cd4419d1e63360d8d627ffd50485feb09067))
- [INS-312] add ConfigureModelInstanceForm into toolkit ([#253](https://github.com/instill-ai/design-system/issues/253)) ([bcf70e5](https://github.com/instill-ai/design-system/commit/bcf70e56212f5fbba7fe61a8dd4bb7346c3813c5))
- [INS-313] add destination table into toolkit ([#256](https://github.com/instill-ai/design-system/issues/256)) ([7051a56](https://github.com/instill-ai/design-system/commit/7051a56a386b53a6bba533ff6fdb4b111d28e60a))
- [INS-314] add table cells into toolkit ([#255](https://github.com/instill-ai/design-system/issues/255)) ([06c6e86](https://github.com/instill-ai/design-system/commit/06c6e864d05a53c730f06e3a85494c217203ed9c))
- [INS-315] add sources table into toolkit ([#257](https://github.com/instill-ai/design-system/issues/257)) ([7adc2e1](https://github.com/instill-ai/design-system/commit/7adc2e1ae932c9df75b6b7a3828e041994d70786))
- add ModelsTable into toolkit ([#258](https://github.com/instill-ai/design-system/issues/258)) ([9c8f75d](https://github.com/instill-ai/design-system/commit/9c8f75ddfd20cbca01c20267a262bbe1c90c997b))
- add pipeline table into toolkit ([#259](https://github.com/instill-ai/design-system/issues/259)) ([8827a4f](https://github.com/instill-ai/design-system/commit/8827a4f97ffe3932483ba67a9faed2b9c0eb7243))

### Miscellaneous

- refactor useSendAmplitudeData to include amplitude context ([#251](https://github.com/instill-ai/design-system/issues/251)) ([110e6b2](https://github.com/instill-ai/design-system/commit/110e6b21f66ead4b849359d4737f0db2419111c7))

## [0.17.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.17.0...@instill-ai/toolkit-v0.17.1) (2023-03-23)

### Bug Fixes

- remove exports property in package.json ([#249](https://github.com/instill-ai/design-system/issues/249)) ([e4fac87](https://github.com/instill-ai/design-system/commit/e4fac870219783a0249fc430394755d5c840814b))

## [0.17.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.16.0...@instill-ai/toolkit-v0.17.0) (2023-03-23)

### Features

- [INS-297] add ConfigureModelForm into toolkit ([#246](https://github.com/instill-ai/design-system/issues/246)) ([468799c](https://github.com/instill-ai/design-system/commit/468799c4af31ae146549ef94b89785a90d6a26ed))
- add PaginationListContainer ([#247](https://github.com/instill-ai/design-system/issues/247)) ([2766170](https://github.com/instill-ai/design-system/commit/276617040ea8a9436f408cfb12c4ca1899d41ee1))
- update how we handle export ([#248](https://github.com/instill-ai/design-system/issues/248)) ([3b41d77](https://github.com/instill-ai/design-system/commit/3b41d7734e812721bda071dda8c0873e83c4a9e5))

### Bug Fixes

- fix missing props in the form ([#244](https://github.com/instill-ai/design-system/issues/244)) ([7d16f76](https://github.com/instill-ai/design-system/commit/7d16f765cfcc0c35346b0bfe2c17dbef74d180dc))

## [0.16.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.15.0...@instill-ai/toolkit-v0.16.0) (2023-03-23)

### Features

- [INS-275] refactor destination form and add into toolkit ([#240](https://github.com/instill-ai/design-system/issues/240)) ([3ca1753](https://github.com/instill-ai/design-system/commit/3ca175324cf038075dbad5cadedb3ff85897f6e2))
- [INS-278] Refactor ConfigureDestinationForm and add it into `toolkit` ([#241](https://github.com/instill-ai/design-system/issues/241)) ([6c602cf](https://github.com/instill-ai/design-system/commit/6c602cffbad70963078ed76d22ee8f2129086b48))
- add create model form into toolkit ([#238](https://github.com/instill-ai/design-system/issues/238)) ([5b02173](https://github.com/instill-ai/design-system/commit/5b02173f7b32a66335d38b73d88cb539f97ae30a))
- add CreatePipelineForm into toolkit ([#239](https://github.com/instill-ai/design-system/issues/239)) ([dd0986d](https://github.com/instill-ai/design-system/commit/dd0986dda6afbc3b9d4987433151fc2c7bebc365))

### Bug Fixes

- fix Zod File type ([#236](https://github.com/instill-ai/design-system/issues/236)) ([9d5f7ad](https://github.com/instill-ai/design-system/commit/9d5f7add1380b0d0917cdf2155037488b8459f18))

## [0.15.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.14.3...@instill-ai/toolkit-v0.15.0) (2023-03-21)

### Features

- add ConfigureSourceForm ([#234](https://github.com/instill-ai/design-system/issues/234)) ([86d0be4](https://github.com/instill-ai/design-system/commit/86d0be40af7a2cbc558e9a99659eafd51b9ebf56))
- add create source form ([#233](https://github.com/instill-ai/design-system/issues/233)) ([bf17aeb](https://github.com/instill-ai/design-system/commit/bf17aebefc0b2d67aa22cd3e247b6409a35a42d9))
- add useCreateResourceFormStore ([#235](https://github.com/instill-ai/design-system/issues/235)) ([cce6cfc](https://github.com/instill-ai/design-system/commit/cce6cfc7c94fbafb099600974bbc5eb9da2c2782))

## [0.14.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.14.2...@instill-ai/toolkit-v0.14.3) (2023-03-20)

### Bug Fixes

- fix authorization header issue ([#229](https://github.com/instill-ai/design-system/issues/229)) ([bb6b274](https://github.com/instill-ai/design-system/commit/bb6b274e9d2f533381e047706fd29b6657598dcd))

## [0.14.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.14.1...@instill-ai/toolkit-v0.14.2) (2023-03-20)

### Bug Fixes

- export cjs file ([#227](https://github.com/instill-ai/design-system/issues/227)) ([f7c894f](https://github.com/instill-ai/design-system/commit/f7c894f092ed286f8e6b9ae0eadf449da86e112b))

## [0.14.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.14.0...@instill-ai/toolkit-v0.14.1) (2023-03-20)

### Bug Fixes

- fix SingleSelectBase wrong prop name issue ([#219](https://github.com/instill-ai/design-system/issues/219)) ([ed0602a](https://github.com/instill-ai/design-system/commit/ed0602a81a3c4c32c78b7f861c20d2bbf4ce05c1))

## [0.14.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.13.2...@instill-ai/toolkit-v0.14.0) (2023-03-20)

### Features

- replace esbuild with tsup ([#217](https://github.com/instill-ai/design-system/issues/217)) ([36e41c8](https://github.com/instill-ai/design-system/commit/36e41c80c8e9d43b98f2238f2dd722a3fad677a3))

## [0.13.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.13.1...@instill-ai/toolkit-v0.13.2) (2023-03-16)

### Bug Fixes

- move next to devDeps ([#212](https://github.com/instill-ai/design-system/issues/212)) ([3e1b5be](https://github.com/instill-ai/design-system/commit/3e1b5be202620735da24f5ff82c67b548bba0b7e))

## [0.13.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.13.0...@instill-ai/toolkit-v0.13.1) (2023-03-16)

### Bug Fixes

- add ModelInstanceTask type definition into toolkit ([#209](https://github.com/instill-ai/design-system/issues/209)) ([91546f1](https://github.com/instill-ai/design-system/commit/91546f1e55c7e6973ae4f3ddf8f189fef29571f7))
- fix nextjs peer ([#211](https://github.com/instill-ai/design-system/issues/211)) ([ba5b4fe](https://github.com/instill-ai/design-system/commit/ba5b4feda3dbafc6cf0266547958992716c5035e))

## [0.13.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.12.0...@instill-ai/toolkit-v0.13.0) (2023-03-16)

### Features

- add getCanvasTextWidth into toolkit ([#208](https://github.com/instill-ai/design-system/issues/208)) ([a3c1e43](https://github.com/instill-ai/design-system/commit/a3c1e4309207642c6e3a98bbd38dc127c3b4608d))

### Bug Fixes

- fix apiRoute type export path ([#206](https://github.com/instill-ai/design-system/issues/206)) ([911f161](https://github.com/instill-ai/design-system/commit/911f161b008239fa37634d054cc095c8430c7282))

## [0.12.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.11.1...@instill-ai/toolkit-v0.12.0) (2023-03-16)

### Features

- add cookie utility into toolkit ([#205](https://github.com/instill-ai/design-system/issues/205)) ([91fafc9](https://github.com/instill-ai/design-system/commit/91fafc97c2c0a3138a2b678e80a86d5c84c0d9ea))
- add ResourceState into toolkit ([#203](https://github.com/instill-ai/design-system/issues/203)) ([d74a76f](https://github.com/instill-ai/design-system/commit/d74a76fd14d3e483322d812b28664b38b4a27028))

## [0.11.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.11.0...@instill-ai/toolkit-v0.11.1) (2023-03-16)

### Bug Fixes

- fix useOnScreen export path ([#201](https://github.com/instill-ai/design-system/issues/201)) ([a54dc74](https://github.com/instill-ai/design-system/commit/a54dc74767f3531a58278148f900233a1525bdaa))

## [0.11.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.10.0...@instill-ai/toolkit-v0.11.0) (2023-03-16)

### Features

- add useOnScreen hook ([#199](https://github.com/instill-ai/design-system/issues/199)) ([77e6d6d](https://github.com/instill-ai/design-system/commit/77e6d6d3033b36d0331caaf03bb98264663dce9b))

## [0.10.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.9.3...@instill-ai/toolkit-v0.10.0) (2023-03-15)

### Features

- [INS-244] replace jest with vitest in design-system ([#197](https://github.com/instill-ai/design-system/issues/197)) ([8f47a47](https://github.com/instill-ai/design-system/commit/8f47a47b5ae71dd9d7409d70e3101a476812c6e0))

### Bug Fixes

- fix packagejson type declaration ([#195](https://github.com/instill-ai/design-system/issues/195)) ([a0f8cd8](https://github.com/instill-ai/design-system/commit/a0f8cd852f35a8fc121c17ca93bf04f265c4914b))

## [0.9.3](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.9.2...@instill-ai/toolkit-v0.9.3) (2023-03-15)

### Bug Fixes

- fix package.json main field ([#193](https://github.com/instill-ai/design-system/issues/193)) ([deecba1](https://github.com/instill-ai/design-system/commit/deecba1fadad4fdb3c2bf8d6c28c9a7790e26ade))

## [0.9.2](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.9.1...@instill-ai/toolkit-v0.9.2) (2023-03-15)

### Bug Fixes

- fix duplicated env variable in query string ([0fb6280](https://github.com/instill-ai/design-system/commit/0fb6280aada5525a236ab7d42687d2f49c339b67))

## [0.9.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.9.0...@instill-ai/toolkit-v0.9.1) (2023-03-15)

### Bug Fixes

- fix wrong export name of ChangeModelInstanceStateToggle ([#186](https://github.com/instill-ai/design-system/issues/186)) ([3cda4b3](https://github.com/instill-ai/design-system/commit/3cda4b366f300ef2bb95044b11dd9473cff94ed2))

## [0.9.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.8.0...@instill-ai/toolkit-v0.9.0) (2023-03-15)

### Features

- [ins-233] add useSendAmplitudeData into cortex ([#184](https://github.com/instill-ai/design-system/issues/184)) ([eb19d05](https://github.com/instill-ai/design-system/commit/eb19d05c51387c3c38fb417c4313cb8111c6dbbb))

## [0.8.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.7.0...@instill-ai/toolkit-v0.8.0) (2023-03-15)

### Features

- [INS-232] add change pipeline & modelInstance toggle state button ([#182](https://github.com/instill-ai/design-system/issues/182)) ([5e6dfc8](https://github.com/instill-ai/design-system/commit/5e6dfc8272526c1be452f5ff9a41e2df6117354a))

## [0.7.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.6.1...@instill-ai/toolkit-v0.7.0) (2023-03-14)

### Features

- only export ESM module ([#178](https://github.com/instill-ai/design-system/issues/178)) ([be39c37](https://github.com/instill-ai/design-system/commit/be39c37db03f36818c4ef83bd60110e04a10f721))

## [0.6.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.6.0...@instill-ai/toolkit-v0.6.1) (2023-03-14)

### Bug Fixes

- fix how we build our package ([#176](https://github.com/instill-ai/design-system/issues/176)) ([db02d16](https://github.com/instill-ai/design-system/commit/db02d1667c24824743d26b935c891ca87c2717b9))

## [0.6.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.5.1...@instill-ai/toolkit-v0.6.0) (2023-03-14)

### Features

- make the export path of toolkit simple ([#174](https://github.com/instill-ai/design-system/issues/174)) ([bcf30a8](https://github.com/instill-ai/design-system/commit/bcf30a866cf3834175f8fbca0e54cf4feacbc5f7))

## [0.5.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.5.0...@instill-ai/toolkit-v0.5.1) (2023-03-14)

### Bug Fixes

- fix packagejson files prop ([#172](https://github.com/instill-ai/design-system/issues/172)) ([5edbf8f](https://github.com/instill-ai/design-system/commit/5edbf8f44fbde1a65d6b010857eb7130600852dc))

## [0.5.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.4.1...@instill-ai/toolkit-v0.5.0) (2023-03-14)

### Features

- add canEdit field into configurePipelineFormSchema ([#158](https://github.com/instill-ai/design-system/issues/158)) ([6127b25](https://github.com/instill-ai/design-system/commit/6127b253f66bf20b62a7853b6e39d1a360f5bb73))
- add create source form store ([#170](https://github.com/instill-ai/design-system/issues/170)) ([ffaed7d](https://github.com/instill-ai/design-system/commit/ffaed7dad7336d5f455e1a9c4e807db5b2181969))
- add hooks ([#156](https://github.com/instill-ai/design-system/issues/156)) ([4e8c3e4](https://github.com/instill-ai/design-system/commit/4e8c3e48422a843152f6027dc48fa1f9edc941a0))
- add useConfigureModelFormStore ([#164](https://github.com/instill-ai/design-system/issues/164)) ([495d0a0](https://github.com/instill-ai/design-system/commit/495d0a001e5fb28078e8025473bc30c3ba40ec66))
- export store type and update export path ([#160](https://github.com/instill-ai/design-system/issues/160)) ([9d134eb](https://github.com/instill-ai/design-system/commit/9d134eb5bb1231060f11cabe38cdf6a36ce64e3f))
- merge view into toolkit ([#171](https://github.com/instill-ai/design-system/issues/171)) ([2d52b2b](https://github.com/instill-ai/design-system/commit/2d52b2b4c0cb07f14ddb93c918445ca7a7ecdce9))

### Bug Fixes

- fix hook export path ([#159](https://github.com/instill-ai/design-system/issues/159)) ([e2077c5](https://github.com/instill-ai/design-system/commit/e2077c59d38949d02fc577c1c02b1ded9c06ac4e))
- fix messageBoxSchema status enum ([#166](https://github.com/instill-ai/design-system/issues/166)) ([d9b3f40](https://github.com/instill-ai/design-system/commit/d9b3f4074139560b2a43f31e77b3b7a5fa582d67))
- fix useMessageBoxStore export path ([#165](https://github.com/instill-ai/design-system/issues/165)) ([f65a217](https://github.com/instill-ai/design-system/commit/f65a2177e297b9733d790cbeb53f753f4a460140))

## [0.4.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.4.0...@instill-ai/toolkit-v0.4.1) (2023-03-13)

### Miscellaneous

- correct the name of useConfigurePipelineFormStore ([#154](https://github.com/instill-ai/design-system/issues/154)) ([99c90d1](https://github.com/instill-ai/design-system/commit/99c90d1f69f9969d50126da67790e6365cb0c90a))

## [0.4.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.3.0...@instill-ai/toolkit-v0.4.0) (2023-03-10)

### Features

- add amplitude context and helper into toolkit ([#151](https://github.com/instill-ai/design-system/issues/151)) ([14544b1](https://github.com/instill-ai/design-system/commit/14544b187bf1dc7f47af785bef8f9f50de9ab2bf))
- add configure pipeline store to toolkit ([#152](https://github.com/instill-ai/design-system/issues/152)) ([9d671a0](https://github.com/instill-ai/design-system/commit/9d671a0dd02a5e84761ec272521715c7920fa73a))

## [0.3.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.2.1...@instill-ai/toolkit-v0.3.0) (2023-03-10)

### Features

- add airbyte lib and replace jest test runner with node ([#139](https://github.com/instill-ai/design-system/issues/139)) ([c6fbe21](https://github.com/instill-ai/design-system/commit/c6fbe2111798d9b5d1170ab7fae23d26d9631eb5))
- add FormRoot ([#147](https://github.com/instill-ai/design-system/issues/147)) ([e7d84a0](https://github.com/instill-ai/design-system/commit/e7d84a03590b1fb3ca19985a4809c04c6efdd56b))
- add react-query-service ([#144](https://github.com/instill-ai/design-system/issues/144)) ([61cd09a](https://github.com/instill-ai/design-system/commit/61cd09adb0b45ea3c81995545de3607380130ff8))
- add stores ([#142](https://github.com/instill-ai/design-system/issues/142)) ([87e7e27](https://github.com/instill-ai/design-system/commit/87e7e27cfcefdfe58483739d4d487e6ea0e08408))
- add view package ([#143](https://github.com/instill-ai/design-system/issues/143)) ([cbb8a1b](https://github.com/instill-ai/design-system/commit/cbb8a1bc90013e3ddca786d4ddac35582a30efd3))
- expose page size config as env NEXT_PUBLIC_QUERY_PAGE_SIZE ([#146](https://github.com/instill-ai/design-system/issues/146)) ([5891277](https://github.com/instill-ai/design-system/commit/5891277c741e103915c70c93ced4c59b53ddc135))
- update vdp-sdk and react-query-service to use token and refactor the aug style of them ([#145](https://github.com/instill-ai/design-system/issues/145)) ([768294a](https://github.com/instill-ai/design-system/commit/768294aac84558d07faac7d64fa0089de1844323))

## [0.2.1](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.2.0...@instill-ai/toolkit-v0.2.1) (2023-03-05)

### Bug Fixes

- fix toolkit package config ([#137](https://github.com/instill-ai/design-system/issues/137)) ([568bb11](https://github.com/instill-ai/design-system/commit/568bb1115fa85bd7e95fe1039fadee910dfc90e5))

## [0.2.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.1.0...@instill-ai/toolkit-v0.2.0) (2023-03-05)

### Features

- add dot lib ([#125](https://github.com/instill-ai/design-system/issues/125)) ([db21ee7](https://github.com/instill-ai/design-system/commit/db21ee76d88b9027ae833efe83350297fb62695b))
- add multiple utilities ([#126](https://github.com/instill-ai/design-system/issues/126)) ([b637217](https://github.com/instill-ai/design-system/commit/b63721770cfa911167e96cc6f6e30a9e24274e33))
- add the utility, sdk, type and airbytes type ([9ced48f](https://github.com/instill-ai/design-system/commit/9ced48fe9d7748206c0e1e591ca8f2ee0636856b))
- update action and version ([#135](https://github.com/instill-ai/design-system/issues/135)) ([d73c9da](https://github.com/instill-ai/design-system/commit/d73c9da0d5e308ed7e662846ce3db9eddc27c632))

### Bug Fixes

- fix build and publish steps ([#133](https://github.com/instill-ai/design-system/issues/133)) ([6497486](https://github.com/instill-ai/design-system/commit/6497486761bc16a2d381f7c49fe5acd20fade852))

### Miscellaneous

- release main ([#129](https://github.com/instill-ai/design-system/issues/129)) ([1e1be68](https://github.com/instill-ai/design-system/commit/1e1be684a4076d456cd500fe1ca0768026e2e915))
- release main ([#132](https://github.com/instill-ai/design-system/issues/132)) ([626a977](https://github.com/instill-ai/design-system/commit/626a9779540b57afab7e29fb58604f2fc392a631))
- release main ([#134](https://github.com/instill-ai/design-system/issues/134)) ([c85380a](https://github.com/instill-ai/design-system/commit/c85380ab5d4f3aecc7a8bc12cb036bb61d74d4b0))
- rollback version and update release action ([#131](https://github.com/instill-ai/design-system/issues/131)) ([ba93866](https://github.com/instill-ai/design-system/commit/ba938660d0420443889f8625a6c32dfd4cc54ea5))

## [0.2.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.1.0...@instill-ai/toolkit-v0.2.0) (2023-03-05)

### Features

- add dot lib ([#125](https://github.com/instill-ai/design-system/issues/125)) ([db21ee7](https://github.com/instill-ai/design-system/commit/db21ee76d88b9027ae833efe83350297fb62695b))
- add multiple utilities ([#126](https://github.com/instill-ai/design-system/issues/126)) ([b637217](https://github.com/instill-ai/design-system/commit/b63721770cfa911167e96cc6f6e30a9e24274e33))
- add the utility, sdk, type and airbytes type ([9ced48f](https://github.com/instill-ai/design-system/commit/9ced48fe9d7748206c0e1e591ca8f2ee0636856b))

### Bug Fixes

- fix build and publish steps ([#133](https://github.com/instill-ai/design-system/issues/133)) ([6497486](https://github.com/instill-ai/design-system/commit/6497486761bc16a2d381f7c49fe5acd20fade852))

### Miscellaneous

- release main ([#129](https://github.com/instill-ai/design-system/issues/129)) ([1e1be68](https://github.com/instill-ai/design-system/commit/1e1be684a4076d456cd500fe1ca0768026e2e915))
- release main ([#132](https://github.com/instill-ai/design-system/issues/132)) ([626a977](https://github.com/instill-ai/design-system/commit/626a9779540b57afab7e29fb58604f2fc392a631))
- rollback version and update release action ([#131](https://github.com/instill-ai/design-system/issues/131)) ([ba93866](https://github.com/instill-ai/design-system/commit/ba938660d0420443889f8625a6c32dfd4cc54ea5))

## [0.2.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.1.0...@instill-ai/toolkit-v0.2.0) (2023-03-05)

### Features

- add dot lib ([#125](https://github.com/instill-ai/design-system/issues/125)) ([db21ee7](https://github.com/instill-ai/design-system/commit/db21ee76d88b9027ae833efe83350297fb62695b))
- add multiple utilities ([#126](https://github.com/instill-ai/design-system/issues/126)) ([b637217](https://github.com/instill-ai/design-system/commit/b63721770cfa911167e96cc6f6e30a9e24274e33))
- add the utility, sdk, type and airbytes type ([9ced48f](https://github.com/instill-ai/design-system/commit/9ced48fe9d7748206c0e1e591ca8f2ee0636856b))

### Miscellaneous

- release main ([#129](https://github.com/instill-ai/design-system/issues/129)) ([1e1be68](https://github.com/instill-ai/design-system/commit/1e1be684a4076d456cd500fe1ca0768026e2e915))
- rollback version and update release action ([#131](https://github.com/instill-ai/design-system/issues/131)) ([ba93866](https://github.com/instill-ai/design-system/commit/ba938660d0420443889f8625a6c32dfd4cc54ea5))

## [0.2.0](https://github.com/instill-ai/design-system/compare/@instill-ai/toolkit-v0.1.1...@instill-ai/toolkit-v0.2.0) (2023-03-05)

### Features

- add dot lib ([#125](https://github.com/instill-ai/design-system/issues/125)) ([db21ee7](https://github.com/instill-ai/design-system/commit/db21ee76d88b9027ae833efe83350297fb62695b))
- add multiple utilities ([#126](https://github.com/instill-ai/design-system/issues/126)) ([b637217](https://github.com/instill-ai/design-system/commit/b63721770cfa911167e96cc6f6e30a9e24274e33))
- add the utility, sdk, type and airbytes type ([9ced48f](https://github.com/instill-ai/design-system/commit/9ced48fe9d7748206c0e1e591ca8f2ee0636856b))

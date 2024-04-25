# Changelog

## [0.45.0-beta](https://github.com/instill-ai/console/compare/v0.44.0-beta...v0.45.0-beta) (2024-04-25)


### Features

* retire connector resource ([#1098](https://github.com/instill-ai/console/issues/1098)) ([a4befc7](https://github.com/instill-ai/console/commit/a4befc773f523964f7bc3a4a4f1456e348127e8d))


### Bug Fixes

* fix sitemap generation error block building process ([#1082](https://github.com/instill-ai/console/issues/1082)) ([9fedb1f](https://github.com/instill-ai/console/commit/9fedb1fda9387f4c4d15203ba541d8991b6b8b3b))


### Miscellaneous

* remove the page route components from console ([#1084](https://github.com/instill-ai/console/issues/1084)) ([f91338e](https://github.com/instill-ai/console/commit/f91338ec93f1dd88f94a858c5f866ff7bf9f5856))

## [0.44.0-beta](https://github.com/instill-ai/console/compare/v0.43.0-beta...v0.44.0-beta) (2024-04-12)


### Features

* migrate all the page to app route and support SEO index ([#1078](https://github.com/instill-ai/console/issues/1078)) ([98f9df8](https://github.com/instill-ai/console/commit/98f9df89d3c71fcb510e6e7919c37110f928be9a))

## [0.43.0-beta](https://github.com/instill-ai/console/compare/v0.42.3-beta...v0.43.0-beta) (2024-04-09)


### Features

* merge sprint 33 feature branch ([#1066](https://github.com/instill-ai/console/issues/1066)) ([052f6f9](https://github.com/instill-ai/console/commit/052f6f9b44fc1624afd1fb44dc3e1f0c37b09440))


### Miscellaneous

* make the page title consistent using Pascal Case ([#1054](https://github.com/instill-ai/console/issues/1054)) ([7361aa5](https://github.com/instill-ai/console/commit/7361aa59806503990a25299f78692d8847c5eadd))

## [0.42.3-beta](https://github.com/instill-ai/console/compare/v0.42.2-beta...v0.42.3-beta) (2024-04-02)


### Miscellaneous

* stabilize test related to save pipeline action ([#1052](https://github.com/instill-ai/console/issues/1052)) ([02557ec](https://github.com/instill-ai/console/commit/02557ec5298eb4d96f8fdafa8e6b466de85cbf97))

## [0.42.2-beta](https://github.com/instill-ai/console/compare/v0.42.1-beta...v0.42.2-beta) (2024-04-02)


### Bug Fixes

* **app-migration:** fix app route issue in organization related components ([#1050](https://github.com/instill-ai/console/issues/1050)) ([aff205d](https://github.com/instill-ai/console/commit/aff205d25d0ea3536e35ab9bd7063c29ea95c2a0))

## [0.42.1-beta](https://github.com/instill-ai/console/compare/v0.42.0-beta...v0.42.1-beta) (2024-04-01)


### Bug Fixes

* fix non login user can not access profile page ([#1049](https://github.com/instill-ai/console/issues/1049)) ([93a0b45](https://github.com/instill-ai/console/commit/93a0b45771e2ff3ed96d6df00f1b36d13fc96337))


### Miscellaneous

* enable e2e testing ([#1047](https://github.com/instill-ai/console/issues/1047)) ([22170dc](https://github.com/instill-ai/console/commit/22170dc0cae4d37185ac766ce3bceea91367a4f5))

## [0.42.0-beta](https://github.com/instill-ai/console/compare/v0.41.0-beta...v0.42.0-beta) (2024-03-29)


### Features

* migrate /pipelines/pid from page-route to app-route ([#1030](https://github.com/instill-ai/console/issues/1030)) ([1c6d5da](https://github.com/instill-ai/console/commit/1c6d5da50530998347ce492f6ab87426622f2d85))
* **pipeline-builder QoL:** stop automatically generating key when editing start/end field ([#1045](https://github.com/instill-ai/console/issues/1045)) ([eb925fd](https://github.com/instill-ai/console/commit/eb925fd7a316a5b866f2cfff58d27bad4041d85d))


### Bug Fixes

* fix missing toaster instance in app route ([#1041](https://github.com/instill-ai/console/issues/1041)) ([6402c0e](https://github.com/instill-ai/console/commit/6402c0ebaca48852454b37062c3ff1d3d3d0fb25))
* **pipeline-builder, test:** fix json is not being unmarshalled on the pipelinespid page ([#1033](https://github.com/instill-ai/console/issues/1033)) ([0093c05](https://github.com/instill-ai/console/commit/0093c05a834d275998bf8e05243b6c3e1f2a856b))
* **pipeline-builder, test:** fix not correctly guard duplicated start/end operator field ([#1036](https://github.com/instill-ai/console/issues/1036)) ([5760dc2](https://github.com/instill-ai/console/commit/5760dc2a53835033d78b9679a4001e2494910647))
* **pipeline-builder, test:** fix pipeline-builder not correctly update component id ([#1034](https://github.com/instill-ai/console/issues/1034)) ([4000425](https://github.com/instill-ai/console/commit/4000425f8dec39a870e11312899b5204f00955c5))


### Miscellaneous

* refactor how we bundle toolkit and design system ([#1028](https://github.com/instill-ai/console/issues/1028)) ([1bc0628](https://github.com/instill-ai/console/commit/1bc0628aee9e93749ed04bb956f58884ba7a0a4c))

## [0.41.0-beta](https://github.com/instill-ai/console/compare/v0.40.0-beta...v0.41.0-beta) (2024-03-13)


### Features

* bump nextjs version to 14 and update react-hook-form ([#1008](https://github.com/instill-ai/console/issues/1008)) ([235847f](https://github.com/instill-ai/console/commit/235847f1a3b57e9f340040320ddcdc7789dafe2d))
* migrate react-query from v4 to v5 ([#1007](https://github.com/instill-ai/console/issues/1007)) ([f0399aa](https://github.com/instill-ai/console/commit/f0399aa6b9cc42df8ff13331e4b82df89c1ab6e8))
* migrate the topbar component back to toolkit ([#994](https://github.com/instill-ai/console/issues/994)) ([056cc78](https://github.com/instill-ai/console/commit/056cc785552497099cabf1455797bb22b3892090))
* **pipeline-builder:** implement the iterator editor ([#1006](https://github.com/instill-ai/console/issues/1006)) ([8a57837](https://github.com/instill-ai/console/commit/8a57837fb62fb22d700c86c32af6253939fe085a))
* **pipeline-builder:** revamp and adapt the new topbar navigation on pipeline builder ([#997](https://github.com/instill-ai/console/issues/997)) ([774aa92](https://github.com/instill-ai/console/commit/774aa92902f77e2ebc1404984f0da0cd23694ddc))
* **pipeline-builder:** support real-time update the hints for iterator ([#1017](https://github.com/instill-ai/console/issues/1017)) ([6d91d7d](https://github.com/instill-ai/console/commit/6d91d7d6b1fc58e5699619828b82807c04a44590))


### Miscellaneous

* add missing use client in design-system ([#1009](https://github.com/instill-ai/console/issues/1009)) ([7b01eeb](https://github.com/instill-ai/console/commit/7b01eeb22cfb33ad0cb160068fcdd31ab03ad87d))

## [0.40.0-beta](https://github.com/instill-ai/console/compare/v0.39.0-beta...v0.40.0-beta) (2024-02-29)


### Features

* prepare for console 0.40.0-beta release ([#993](https://github.com/instill-ai/console/issues/993)) ([92a3e97](https://github.com/instill-ai/console/commit/92a3e97620ec5ba4ff62fba6281642df4b254a32))

## [0.39.0-beta](https://github.com/instill-ai/console/compare/v0.38.0-beta...v0.39.0-beta) (2024-02-15)


### Features

* adapt new backend breaking changes about mgmt backend ([#940](https://github.com/instill-ai/console/issues/940)) ([3351262](https://github.com/instill-ai/console/commit/3351262b0768a47166e57d42ca81cff53deb29aa))
* support the backend breaking changes of icon path ([#959](https://github.com/instill-ai/console/issues/959)) ([e7d7ad3](https://github.com/instill-ai/console/commit/e7d7ad39e80588bacb4b524c151a622d1ddaf26a))


### Bug Fixes

* fix pinecone svg padding is too small issue ([#968](https://github.com/instill-ai/console/issues/968)) ([cfbc703](https://github.com/instill-ai/console/commit/cfbc70309fee33f4c6fb1bb28497a145a68f3f2d))

## [0.38.0-beta](https://github.com/instill-ai/console/compare/v0.37.0-beta...v0.38.0-beta) (2024-01-30)


### Features

* add Archetype AI logo ([#900](https://github.com/instill-ai/console/issues/900)) ([f06b9e2](https://github.com/instill-ai/console/commit/f06b9e205a43ac31613dc1c1011fe87940897672))
* **pipeline-builder:** add reference hint at the start operator ([#902](https://github.com/instill-ai/console/issues/902)) ([d87de86](https://github.com/instill-ai/console/commit/d87de86845e385465279e995e78c9c4bb4d0d3c0))
* **pipeline-builder:** support group by format for component output reference hints ([#906](https://github.com/instill-ai/console/issues/906)) ([537c6f6](https://github.com/instill-ai/console/commit/537c6f647ee5a05a20bc2d88081345d3fb0e4e7c))
* support filtering the visibility of pipelines ([#903](https://github.com/instill-ai/console/issues/903)) ([57fd548](https://github.com/instill-ai/console/commit/57fd5488105108c549b9fa386596925586a81c2c))
* **test:** adapt new page object model and new playwright ([#901](https://github.com/instill-ai/console/issues/901)) ([f716870](https://github.com/instill-ai/console/commit/f7168705b219ee52bb9953291bcc95126107f57e))
* update the amplitude action type ([#897](https://github.com/instill-ai/console/issues/897)) ([40cb1c2](https://github.com/instill-ai/console/commit/40cb1c2962fbb649dd8320ee8dc93e07dc26d1d1))


### Miscellaneous

* refactor top bar navigation to make it dry, add default query options for react-query ([#821](https://github.com/instill-ai/console/issues/821)) ([0e5decd](https://github.com/instill-ai/console/commit/0e5decdb6bd920aad14d4c655e54bd636f63a6f8))
* **testing:** add placeholder test ([#918](https://github.com/instill-ai/console/issues/918)) ([2d74924](https://github.com/instill-ai/console/commit/2d74924513df955fc998349bff42eeba0310e307))

## [0.37.0-beta](https://github.com/instill-ai/console/compare/v0.36.0-beta...v0.37.0-beta) (2024-01-24)


### Features

* implement the unit test for nested auto gen form ([#896](https://github.com/instill-ai/console/issues/896)) ([51c4630](https://github.com/instill-ai/console/commit/51c46305e93372ae652e38eda0fed82545afc714))

## [0.36.0-beta](https://github.com/instill-ai/console/compare/v0.35.1-beta...v0.36.0-beta) (2024-01-15)


### Features

* adapt the new icon path for operators and connectors ([#867](https://github.com/instill-ai/console/issues/867)) ([7311370](https://github.com/instill-ai/console/commit/7311370b6c6da535fbab67a9c0f6d5d32da38f8f))
* add the placeholder for the pipeline description editor ([#872](https://github.com/instill-ai/console/issues/872)) ([511a520](https://github.com/instill-ai/console/commit/511a52030b73da2e50f3e1b4ab1dcbcaac435ccd))


### Bug Fixes

* fix console fetch the wrong model readme namespace ([#863](https://github.com/instill-ai/console/issues/863)) ([85ce0a8](https://github.com/instill-ai/console/commit/85ce0a89858f97ce2900ea557e55428c1deed15e))
* fix duplicate pipeline didnt carry over pipeline brief ([#876](https://github.com/instill-ai/console/issues/876)) ([54752ee](https://github.com/instill-ai/console/commit/54752ee0487f0b38999204efc501abd0f98a7e79))
* fix font not consistent on dashboard and improve the font optimization ([#873](https://github.com/instill-ai/console/issues/873)) ([18fc2c3](https://github.com/instill-ai/console/commit/18fc2c318734a7d1a4a2166adb47c00b2b46a3b7))
* fix markdown editor of pipeline description can not show ol and ul ([#871](https://github.com/instill-ai/console/issues/871)) ([fb0da5a](https://github.com/instill-ai/console/commit/fb0da5aea85356b824da4afd3aa338f1b9594ec5))


### Miscellaneous

* **deps:** bump axios from 1.5.1 to 1.6.0 ([#674](https://github.com/instill-ai/console/issues/674)) ([44d868b](https://github.com/instill-ai/console/commit/44d868bac41d701710da5eb1468a98ddaa0ac83d))
* **deps:** bump sharp from 0.30.7 to 0.32.6 ([#697](https://github.com/instill-ai/console/issues/697)) ([32db44a](https://github.com/instill-ai/console/commit/32db44ae9d99f56ee472a0b504cb7d715519f0b5))

## [0.35.1-beta](https://github.com/instill-ai/console/compare/v0.35.0-beta...v0.35.1-beta) (2024-01-02)


### Bug Fixes

* fix model setting page query issue ([#850](https://github.com/instill-ai/console/issues/850)) ([a5978a3](https://github.com/instill-ai/console/commit/a5978a3a879285cfb6970d7351ce7af37ebfb768))

## [0.35.0-beta](https://github.com/instill-ai/console/compare/v0.34.2-beta...v0.35.0-beta) (2024-01-02)


### Features

* add the loading state indicator for user-profile ([#845](https://github.com/instill-ai/console/issues/845)) ([914afa3](https://github.com/instill-ai/console/commit/914afa35b06bfb9350728a2c44f3f293ff6f2b51))
* **pipeline-builder:** make right-panel float on top of canvas to have bigger working space ([#834](https://github.com/instill-ai/console/issues/834)) ([b8bc0e4](https://github.com/instill-ai/console/commit/b8bc0e476b05557ef419ff5826de336ecd0951ab))


### Bug Fixes

* **pipeline-builder:** fix not correctly add nodes at the center of the nodes ([#820](https://github.com/instill-ai/console/issues/820)) ([f6f25ba](https://github.com/instill-ai/console/commit/f6f25ba182a194783872999f262f96f64a3c36c4))


### Miscellaneous

* add ts check for unused variables, remove unused useLayoutEffect import ([#830](https://github.com/instill-ai/console/issues/830)) ([18e1f2e](https://github.com/instill-ai/console/commit/18e1f2e5fdba52ece712638a2a22c765b7a18638))
* apply prettier format and reject formatting errors in PRs ([#818](https://github.com/instill-ai/console/issues/818)) ([fa5c3b3](https://github.com/instill-ai/console/commit/fa5c3b362dfac92291926c0e9020bb53c8c10ddc))
* fix format issues in `apps/console/src/pages/_app.tsx`  ([#839](https://github.com/instill-ai/console/issues/839)) ([ab6b994](https://github.com/instill-ai/console/commit/ab6b9947ed1ae37444ed67f736fb4b6f1613cb93))
* redirect user to 404 page if the user is not found ([#841](https://github.com/instill-ai/console/issues/841)) ([39ec410](https://github.com/instill-ai/console/commit/39ec410be5b102a83fdfc566164ab6fdb45a4b80))

## [0.34.2-beta](https://github.com/instill-ai/console/compare/v0.34.1-beta...v0.34.2-beta) (2023-12-25)

### Bug Fixes

- fix user can not smoothly clone the pipeline and decide what is its permission level ([#813](https://github.com/instill-ai/console/issues/813)) ([dc36a9a](https://github.com/instill-ai/console/commit/dc36a9a426ad2c0c0dbe1d72468c22d6946ee26d))

### Miscellaneous

- fix typos in `components/README.md` ([#815](https://github.com/instill-ai/console/issues/815)) ([f30b650](https://github.com/instill-ai/console/commit/f30b65068d746001156587d0e8e9db175f6bd94c))
- unused import `PageBase` ([#814](https://github.com/instill-ai/console/issues/814)) ([175b0d1](https://github.com/instill-ai/console/commit/175b0d1e6ab40c2518be8f32a92976b2646c31b7))

## [0.34.1-beta](https://github.com/instill-ai/console/compare/v0.34.0-beta...v0.34.1-beta) (2023-12-22)

### Bug Fixes

- fix issue that will stop user from deleting the pipeline smoothly ([#805](https://github.com/instill-ai/console/issues/805)) ([cc26b6b](https://github.com/instill-ai/console/commit/cc26b6b38c0686cd630d357ab0761ba520c09ee8))

### Miscellaneous

- **general:** replace model URL path with models ([#802](https://github.com/instill-ai/console/issues/802)) ([e640470](https://github.com/instill-ai/console/commit/e6404706305c113d43ed56f15f1c2498d7adfd8c))
- update operators icons ([#807](https://github.com/instill-ai/console/issues/807)) ([a690e08](https://github.com/instill-ai/console/commit/a690e081b24094f9834ef3cbc1c8a6f56cb1725a))

## [0.34.0-beta](https://github.com/instill-ai/console/compare/v0.33.1-beta...v0.34.0-beta) (2023-12-15)

### Features

- adapt new connectors breaking changes, replace connector-resources with connectors ([#725](https://github.com/instill-ai/console/issues/725)) ([1393a8b](https://github.com/instill-ai/console/commit/1393a8bc6a3e4a59972acf30c32ab20670d84f3c))
- adapt new permission rule from backend ([#796](https://github.com/instill-ai/console/issues/796)) ([fa3d57b](https://github.com/instill-ai/console/commit/fa3d57b7e35f0e3ae60763bc912c90efed7dae81))
- **auto-gen-form:** Support instillCredentialField attribute in auto-gen-form and correctly display field ([#630](https://github.com/instill-ai/console/issues/630)) ([dd6d7bd](https://github.com/instill-ai/console/commit/dd6d7bd1b6d16930456456f31742f8cf99e4c99a))
- **design-system:** add MultiSelect component ([#763](https://github.com/instill-ai/console/issues/763)) ([3229af9](https://github.com/instill-ai/console/commit/3229af993a8e41bde38c9134a758471158fd7b3e))
- **general:** Adapt new backend API version ([#773](https://github.com/instill-ai/console/issues/773)) ([a7dbb41](https://github.com/instill-ai/console/commit/a7dbb416c9db67778dc40e94fa27d19a8a4d9e09))
- **general:** add entity profile page and clean up components and queries ([#784](https://github.com/instill-ai/console/issues/784)) ([11d1b56](https://github.com/instill-ai/console/commit/11d1b5605a050947b499f063a1c200841471ccc1))
- **hub:** Non-auth user can still access the public console ([#788](https://github.com/instill-ai/console/issues/788)) ([c4a7577](https://github.com/instill-ai/console/commit/c4a757713236726213034f8f48adc364a0b2d0bb))
- **hub:** User can have new pipeline page to display various information ([#762](https://github.com/instill-ai/console/issues/762)) ([2412830](https://github.com/instill-ai/console/commit/241283051fe0a14224288d7efdc17aa063208de8))
- **organization:** organization teams user profile dev screens ([#743](https://github.com/instill-ai/console/issues/743)) ([786ad86](https://github.com/instill-ai/console/commit/786ad861d01dc1948d6f2d068aae8f51bec84468))
- **pipeline-builder:** add a flag to make pipeline-builder fully readonly ([#777](https://github.com/instill-ai/console/issues/777)) ([d190d6b](https://github.com/instill-ai/console/commit/d190d6bb3201cefd56122aefe71668c73e27e27d))
- **pipeline-builder:** user can edit important field on operator node ([#717](https://github.com/instill-ai/console/issues/717)) ([6e7cbc0](https://github.com/instill-ai/console/commit/6e7cbc0fbae62cbf528de92232ac5cb42ef73008))
- **pipeline-builder:** user can have more unified nodes width across pipeline builder ([#629](https://github.com/instill-ai/console/issues/629)) ([6f0d0c4](https://github.com/instill-ai/console/commit/6f0d0c4eea07f0cccf90ed7a8cc9d8d272ee8e02))
- **pipeline-builder:** user can have much explicit field design on start operator ([#706](https://github.com/instill-ai/console/issues/706)) ([2f52205](https://github.com/instill-ai/console/commit/2f5220541d1e0fc9877355ca674e279b932f8975))
- **pipeline-builder:** User can have new advanced pipeline creation dialog ([#792](https://github.com/instill-ai/console/issues/792)) ([931bec3](https://github.com/instill-ai/console/commit/931bec38b4a63c6bcb02d7ae5fbfd3ed95fd1d68))
- **pipeline-builder:** User can publish their pipeline to the hub ([#770](https://github.com/instill-ai/console/issues/770)) ([0ce35d2](https://github.com/instill-ai/console/commit/0ce35d2c6be45a684622b6bedb0a96dfe15202fb))
- **pipeline-builder:** Users can add note on component to describe it ([#701](https://github.com/instill-ai/console/issues/701)) ([8fad333](https://github.com/instill-ai/console/commit/8fad33395250b52dfc3e966f6eec31882d8fc5e0))
- **pipelines:** User can have more advanced pipelines page ([#776](https://github.com/instill-ai/console/issues/776)) ([f8c29df](https://github.com/instill-ai/console/commit/f8c29df18334e8d85adfffd1b16289e312f53c04))
- rename /resources with /connectors to simplify the term on console ([#664](https://github.com/instill-ai/console/issues/664)) ([253dbdb](https://github.com/instill-ai/console/commit/253dbdb692e85f5150b8f7c2cbe4f462c0f9263e))
- User can browse other's pipelines on hub page ([#780](https://github.com/instill-ai/console/issues/780)) ([592fb51](https://github.com/instill-ai/console/commit/592fb51d180c6075ea705905aa8eeeef9dc754aa))
- **user:** User can have unified and improved profile configuration ([#783](https://github.com/instill-ai/console/issues/783)) ([66c3705](https://github.com/instill-ai/console/commit/66c370514a229e4e6323fc4dd4ed4752148c75c1))

### Bug Fixes

- **auto-gen-form:** fix auto-gen form not correctly handle re-render issue ([#665](https://github.com/instill-ai/console/issues/665)) ([2363cc4](https://github.com/instill-ai/console/commit/2363cc44e6452f8f8bb5859b12dbc2086d8f1168))
- **docker:** fix docker hostname issue ([#698](https://github.com/instill-ai/console/issues/698)) ([a966f3c](https://github.com/instill-ai/console/commit/a966f3c007cee52ba6c0f594a011600c17e6f6ef))
- fix codemirror intervene with each other can cause performance issue ([#755](https://github.com/instill-ai/console/issues/755)) ([3f3e5d7](https://github.com/instill-ai/console/commit/3f3e5d719dfe600b924f273745708c14fd174bb8))
- fix creating pipeline public/private issue ([#798](https://github.com/instill-ai/console/issues/798)) ([bedc294](https://github.com/instill-ai/console/commit/bedc294dc2e35b4b61a995b04634ae3af406f979))
- fix dashboard not correctly display organization metric ([#799](https://github.com/instill-ai/console/issues/799)) ([7f15f3a](https://github.com/instill-ai/console/commit/7f15f3a09fef50f0d49a1358557813647970f764))
- fix dashboard query issue ([263084a](https://github.com/instill-ai/console/commit/263084a17c7674a9302d677da0a6d7d9f0dc07cb))
- fix GA issues ([ad52286](https://github.com/instill-ai/console/commit/ad52286e3243e5a202d181c34fa6ee53934d2fb9))
- fix google search icon is missing issue ([#678](https://github.com/instill-ai/console/issues/678)) ([bf6dde0](https://github.com/instill-ai/console/commit/bf6dde00979e275466866cd7c921baee3d97bd9f))
- fix navigation bug and start operator input issue ([#797](https://github.com/instill-ai/console/issues/797)) ([9c8aed4](https://github.com/instill-ai/console/commit/9c8aed4016b183c7dace26fcf1fe645da391d6fc))
- fix the bug of not correctly redirecting user back to onboarding page ([#627](https://github.com/instill-ai/console/issues/627)) ([36f903a](https://github.com/instill-ai/console/commit/36f903a35dda37ca7a0e311f3549487ae5af5e54))
- fix wrongly used entity issue ([#793](https://github.com/instill-ai/console/issues/793)) ([9238797](https://github.com/instill-ai/console/commit/9238797f264efca2dbe9645b59c46484d59bce84))
- **general:** fix not correctly create pipeline for organization ([#791](https://github.com/instill-ai/console/issues/791)) ([d52d395](https://github.com/instill-ai/console/commit/d52d3959599b108be4eb3febb226f1da482fee56))
- **pipeline-builder:** fix console not correctly recognize complicated reference ([#638](https://github.com/instill-ai/console/issues/638)) ([2d91ec0](https://github.com/instill-ai/console/commit/2d91ec045b9ab4cee041c291ed3c44d17d6ee21f))

### Miscellaneous

- contributors can better contribute to our frontend project (Simplify repos) ([#599](https://github.com/instill-ai/console/issues/599)) ([75d61bd](https://github.com/instill-ai/console/commit/75d61bdb857d19974d0814f876f886f39bf8bdee))
- **dashboard:** namananand/ins 2860 rewamp dashboard update ([#782](https://github.com/instill-ai/console/issues/782)) ([3114fdd](https://github.com/instill-ai/console/commit/3114fddd6bbcdc2c20de0b4226d6bfd803239c11))
- **docs:** update docs about scripts and cicd ([#612](https://github.com/instill-ai/console/issues/612)) ([bc5bb94](https://github.com/instill-ai/console/commit/bc5bb9438c16ca4bbfb19c11263677c0daa1f33a))
- fix prettier not correctly initialize ([#636](https://github.com/instill-ai/console/issues/636)) ([f729990](https://github.com/instill-ai/console/commit/f7299908ae5ef1135afee05719891da84ddc58e8))
- **general:** use unified store with slice to better control global state ([#652](https://github.com/instill-ai/console/issues/652)) ([334298c](https://github.com/instill-ai/console/commit/334298c8050ad8782f4f9165f9cc642f2be8a341))
- release main ([#609](https://github.com/instill-ai/console/issues/609)) ([74d9fef](https://github.com/instill-ai/console/commit/74d9fef738867308a54dbd43ba201c31eb9bfed5))
- release main ([#642](https://github.com/instill-ai/console/issues/642)) ([b78fb4f](https://github.com/instill-ai/console/commit/b78fb4f0be1c959e70ababdaa20e7d513c91eb68))
- release main ([#645](https://github.com/instill-ai/console/issues/645)) ([66f9f3b](https://github.com/instill-ai/console/commit/66f9f3b6114ce754a1fe735c390fb7109b567f68))
- release main ([#679](https://github.com/instill-ai/console/issues/679)) ([7dc87fc](https://github.com/instill-ai/console/commit/7dc87fcc5ef804127921bd6490d5267534c6190a))
- release main ([#687](https://github.com/instill-ai/console/issues/687)) ([8351939](https://github.com/instill-ai/console/commit/8351939f6f3fed15b01a114887446f8063a32eb2))
- release main ([#756](https://github.com/instill-ai/console/issues/756)) ([99c68be](https://github.com/instill-ai/console/commit/99c68bea79a55e3da43e9a4449ddd65a78005684))
- replace &lt;&gt;</> with <React.Fragment> ([#662](https://github.com/instill-ai/console/issues/662)) ([5ec2a71](https://github.com/instill-ai/console/commit/5ec2a71cf99bd03f160075ed0f392c31cddabe76))

## [0.33.1-alpha](https://github.com/instill-ai/console/compare/v0.33.0-alpha...v0.33.1-alpha) (2023-11-30)

### Bug Fixes

- fix codemirror intervene with each other can cause performance issue ([#755](https://github.com/instill-ai/console/issues/755)) ([3f3e5d7](https://github.com/instill-ai/console/commit/3f3e5d719dfe600b924f273745708c14fd174bb8))

## [0.33.0-alpha](https://github.com/instill-ai/console/compare/v0.32.1-alpha...v0.33.0-alpha) (2023-11-28)

### Features

- adapt new connectors breaking changes, replace connector-resources with connectors ([#725](https://github.com/instill-ai/console/issues/725)) ([1393a8b](https://github.com/instill-ai/console/commit/1393a8bc6a3e4a59972acf30c32ab20670d84f3c))
- **pipeline-builder:** user can edit important field on operator node ([#717](https://github.com/instill-ai/console/issues/717)) ([6e7cbc0](https://github.com/instill-ai/console/commit/6e7cbc0fbae62cbf528de92232ac5cb42ef73008))
- **pipeline-builder:** user can have much explicit field design on start operator ([#706](https://github.com/instill-ai/console/issues/706)) ([2f52205](https://github.com/instill-ai/console/commit/2f5220541d1e0fc9877355ca674e279b932f8975))
- **pipeline-builder:** Users can add note on component to describe it ([#701](https://github.com/instill-ai/console/issues/701)) ([8fad333](https://github.com/instill-ai/console/commit/8fad33395250b52dfc3e966f6eec31882d8fc5e0))

### Bug Fixes

- **docker:** fix docker hostname issue ([#698](https://github.com/instill-ai/console/issues/698)) ([a966f3c](https://github.com/instill-ai/console/commit/a966f3c007cee52ba6c0f594a011600c17e6f6ef))

## [0.32.1-alpha](https://github.com/instill-ai/console/compare/v0.32.0-alpha...v0.32.1-alpha) (2023-11-15)

### Bug Fixes

- fix google search icon is missing issue ([#678](https://github.com/instill-ai/console/issues/678)) ([bf6dde0](https://github.com/instill-ai/console/commit/bf6dde00979e275466866cd7c921baee3d97bd9f))

## [0.32.0-alpha](https://github.com/instill-ai/console/compare/v0.31.0-alpha...v0.32.0-alpha) (2023-11-10)

### Features

- rename /resources with /connectors to simplify the term on console ([#664](https://github.com/instill-ai/console/issues/664)) ([253dbdb](https://github.com/instill-ai/console/commit/253dbdb692e85f5150b8f7c2cbe4f462c0f9263e))

### Bug Fixes

- **auto-gen-form:** fix auto-gen form not correctly handle re-render issue ([#665](https://github.com/instill-ai/console/issues/665)) ([2363cc4](https://github.com/instill-ai/console/commit/2363cc44e6452f8f8bb5859b12dbc2086d8f1168))

### Miscellaneous

- **general:** use unified store with slice to better control global state ([#652](https://github.com/instill-ai/console/issues/652)) ([334298c](https://github.com/instill-ai/console/commit/334298c8050ad8782f4f9165f9cc642f2be8a341))
- replace &lt;&gt;</> with <React.Fragment> ([#662](https://github.com/instill-ai/console/issues/662)) ([5ec2a71](https://github.com/instill-ai/console/commit/5ec2a71cf99bd03f160075ed0f392c31cddabe76))

## [0.31.0-alpha](https://github.com/instill-ai/console/compare/v0.30.1-alpha...v0.31.0-alpha) (2023-10-27)

### Features

- **auto-gen-form:** Support instillCredentialField attribute in auto-gen-form and correctly display field ([#630](https://github.com/instill-ai/console/issues/630)) ([dd6d7bd](https://github.com/instill-ai/console/commit/dd6d7bd1b6d16930456456f31742f8cf99e4c99a))
- **pipeline-builder:** user can have more unified nodes width across pipeline builder ([#629](https://github.com/instill-ai/console/issues/629)) ([6f0d0c4](https://github.com/instill-ai/console/commit/6f0d0c4eea07f0cccf90ed7a8cc9d8d272ee8e02))

### Bug Fixes

- fix the bug of not correctly redirecting user back to onboarding page ([#627](https://github.com/instill-ai/console/issues/627)) ([36f903a](https://github.com/instill-ai/console/commit/36f903a35dda37ca7a0e311f3549487ae5af5e54))
- **pipeline-builder:** fix console not correctly recognize complicated reference ([#638](https://github.com/instill-ai/console/issues/638)) ([2d91ec0](https://github.com/instill-ai/console/commit/2d91ec045b9ab4cee041c291ed3c44d17d6ee21f))

### Miscellaneous

- fix prettier not correctly initialize ([#636](https://github.com/instill-ai/console/issues/636)) ([f729990](https://github.com/instill-ai/console/commit/f7299908ae5ef1135afee05719891da84ddc58e8))

## [0.30.1-alpha](https://github.com/instill-ai/console/compare/v0.30.0-alpha...v0.30.1-alpha) (2023-10-20)

### Bug Fixes

- fix GA issues ([ad52286](https://github.com/instill-ai/console/commit/ad52286e3243e5a202d181c34fa6ee53934d2fb9))

### Miscellaneous

- contributors can better contribute to our frontend project (Simplify repos) ([#599](https://github.com/instill-ai/console/issues/599)) ([75d61bd](https://github.com/instill-ai/console/commit/75d61bdb857d19974d0814f876f886f39bf8bdee))
- **docs:** update docs about scripts and cicd ([#612](https://github.com/instill-ai/console/issues/612)) ([bc5bb94](https://github.com/instill-ai/console/commit/bc5bb9438c16ca4bbfb19c11263677c0daa1f33a))

## [0.30.0-alpha](https://github.com/instill-ai/console/compare/v0.29.0-alpha...v0.30.0-alpha) (2023-10-13)

### Features

- **general:** User can better identify the process is still running when doing actions ([#592](https://github.com/instill-ai/console/issues/592)) ([638cc23](https://github.com/instill-ai/console/commit/638cc233f28e7b3a033f3dbc7ae077f51b67919a))
- **pipeline-builder:** adapt new component input structure ([#590](https://github.com/instill-ai/console/issues/590)) ([0e15855](https://github.com/instill-ai/console/commit/0e158551653a7b5761774149db1e1618cceb8d3d))
- **pipeline-builder:** make the array fields on start node start with only one field ([#594](https://github.com/instill-ai/console/issues/594)) ([53f1b9e](https://github.com/instill-ai/console/commit/53f1b9e31134d3308c0af37a6fa578d762392e4a))
- **pipeline-builder:** User can create the copy of their pipeline with one click ([#584](https://github.com/instill-ai/console/issues/584)) ([060cb6b](https://github.com/instill-ai/console/commit/060cb6bd70b9e4ad9d2cd10e4f1965a093c1e2f4))
- **pipeline-builder:** User can have autoresize input when edit node and pipeline name ([#585](https://github.com/instill-ai/console/issues/585)) ([07cd7aa](https://github.com/instill-ai/console/commit/07cd7aa60ea40ba65dc2396e1327cb3e08d0f0ad))

### Bug Fixes

- **cicd:** fix GitHub action labeler issue ([#591](https://github.com/instill-ai/console/issues/591)) ([9be1110](https://github.com/instill-ai/console/commit/9be1110450ff2b555f1b0956b1cdddbe947b1192))
- **pipeline-builder:** fix a bug when create fields on the end operator will wrongly use the key from the previous edited field ([#593](https://github.com/instill-ai/console/issues/593)) ([e7ed100](https://github.com/instill-ai/console/commit/e7ed1008e59c75214490a44e19a378e17a308e81))
- **pipeline-builder:** fix path issue when get input/output schema for data connector ([#589](https://github.com/instill-ai/console/issues/589)) ([e77c459](https://github.com/instill-ai/console/commit/e77c4596a6ba1ca62105efb3f3ef279a3b0fe908))
- **pipeline-builder:** fix rename pipeline issue when there has unsaved changes ([#588](https://github.com/instill-ai/console/issues/588)) ([e5688d5](https://github.com/instill-ai/console/commit/e5688d53efb229f8a652a1a33381d333fb2c3968))
- **pipeline-builder:** fix start operator wrongly delete input when you edit without saving then create a new field ([#586](https://github.com/instill-ai/console/issues/586)) ([dda2435](https://github.com/instill-ai/console/commit/dda2435e6a1c59aa52f8b14f4b80f034db600df6))

### Miscellaneous

- prepare 0.30.0 release ([#595](https://github.com/instill-ai/console/issues/595)) ([dded69c](https://github.com/instill-ai/console/commit/dded69c3667756cc4494047dde658ace3003d9bf))
- prepare 0.30.0 release ([#597](https://github.com/instill-ai/console/issues/597)) ([b60540f](https://github.com/instill-ai/console/commit/b60540fa9802ae8e105bc41061d2ce26404fcb66))
- update title onboarding ([#582](https://github.com/instill-ai/console/issues/582)) ([ab31c07](https://github.com/instill-ai/console/commit/ab31c07d5bbb4705ce4a0936c97c44dfed3fbc42))

## [0.29.0-alpha](https://github.com/instill-ai/console/compare/v0.28.0-alpha...v0.29.0-alpha) (2023-09-30)

### Features

- **auth:** support simple login and logout in core ([#556](https://github.com/instill-ai/console/issues/556)) ([8bffdae](https://github.com/instill-ai/console/commit/8bffdaecf4b79f910abd6bfdf87688bec1dd820c))
- **auth:** Unauthenticated user will be block by our auth-guard ([#555](https://github.com/instill-ai/console/issues/555)) ([47eaac7](https://github.com/instill-ai/console/commit/47eaac76ff32b0f4e336da2d60782f03f7bc4c67))
- **pipeline-builder:** Non owner user can view public pipeline or pipeline that is shared by link ([#566](https://github.com/instill-ai/console/issues/566)) ([11aac63](https://github.com/instill-ai/console/commit/11aac63406a012299a2572a48b53fdc70d80802e))
- **pipeline-builder:** User can clone pipeline that is shared by other users ([#567](https://github.com/instill-ai/console/issues/567)) ([c88760f](https://github.com/instill-ai/console/commit/c88760fb95f92c3214cecef4861f1be1541f4ef1))
- **pipeline-builder:** user can have a centralize place to view all the templates ([#562](https://github.com/instill-ai/console/issues/562)) ([79f5c77](https://github.com/instill-ai/console/commit/79f5c7793d88b626e9f778e2e8e684d671a35337))
- **pipeline-builder:** user can have node with uncreated resource on pipeline builder ([#559](https://github.com/instill-ai/console/issues/559)) ([c894cbf](https://github.com/instill-ai/console/commit/c894cbf360504a835b57ca202604cd63313c4116))
- **pipeline-builder:** user can have pre-formatted text field to better visualize the output ([#572](https://github.com/instill-ai/console/issues/572)) ([1bbb953](https://github.com/instill-ai/console/commit/1bbb953812a534acbc5c817b11b7208c584ef7bc))
- **pipeline-builder:** User can now have a centralize control panel to copy, delete and configure node ([#560](https://github.com/instill-ai/console/issues/560)) ([08dd9c7](https://github.com/instill-ai/console/commit/08dd9c76fb84b554d378f6decd23b2b7401bc5a3))
- **pipeline-builder:** user can share their private pipeline with sharing a unique link ([#565](https://github.com/instill-ai/console/issues/565)) ([21d8d98](https://github.com/instill-ai/console/commit/21d8d98556fe8ee6080de6c6937e90c6776b7c73))
- **pipeline-builder:** User can toggle their pipelines permission level ([#564](https://github.com/instill-ai/console/issues/564)) ([b0dc47b](https://github.com/instill-ai/console/commit/b0dc47b1bb5ec90165e25eb84414dd3151fa472d))
- **pipeline-builder:** User can view staff pick templates on pipeline list page ([#561](https://github.com/instill-ai/console/issues/561)) ([cd35a1c](https://github.com/instill-ai/console/commit/cd35a1c8cd2bfb899db2d11f4be13bc530aaba21))
- **pipeline-builder:** User will have 1.5x wider node under normal mode and 2.0 wider node under test mode ([#557](https://github.com/instill-ai/console/issues/557)) ([24a29c5](https://github.com/instill-ai/console/commit/24a29c52ae1a2301cd823123f9439267dc651648))
- **pipeline-builder:** When user delete the whole name of pipeline, we will recover it back to previous name on blur or enter ([#558](https://github.com/instill-ai/console/issues/558)) ([dc55909](https://github.com/instill-ai/console/commit/dc55909c3e011a4e5d1073b54799ccca89e62551))
- prepare release 0.29.0-alpha ([#574](https://github.com/instill-ai/console/issues/574)) ([a28c83f](https://github.com/instill-ai/console/commit/a28c83fb5b3241b989a81cf755630b23cd9a89e5))
- support namespace in URL, recipe display and add contribution guideline ([#553](https://github.com/instill-ai/console/issues/553)) ([5d91e0b](https://github.com/instill-ai/console/commit/5d91e0b19cafea78ab1df332d5cd208d5fa932c8))
- **user:** User can generate API token in user-setting page ([#568](https://github.com/instill-ai/console/issues/568)) ([1df5e30](https://github.com/instill-ai/console/commit/1df5e307fb8307b7d21d26194a0bfcc1b9dc99a7))

### Bug Fixes

- fix a bug that user can change password to default password ([#569](https://github.com/instill-ai/console/issues/569)) ([b84e4b2](https://github.com/instill-ai/console/commit/b84e4b289e28fd6caf23da5e2e933fb82c2a03e5))
- fix back to latest version button won't reset the field value on node ([#570](https://github.com/instill-ai/console/issues/570)) ([6c3e281](https://github.com/instill-ai/console/commit/6c3e2817cb8912c26edc5aad5beaec56c874cf2a))
- fix user can't have filtered existing resource when create resource on node ([#578](https://github.com/instill-ai/console/issues/578)) ([c6b76e0](https://github.com/instill-ai/console/commit/c6b76e019c0c515cf8e13aa380936951945ef903))
- **model-hub:** fix model namespace is wrong in instill-core's /models/&lt;model_id&gt; page ([#571](https://github.com/instill-ai/console/issues/571)) ([dc64460](https://github.com/instill-ai/console/commit/dc6446089cc727560ce72b5e9a3442cfa8d26991))

### Miscellaneous

- better guard our repo from pnpm overrides ([#563](https://github.com/instill-ai/console/issues/563)) ([9848f9d](https://github.com/instill-ai/console/commit/9848f9d20158c84f89c613b2be0aafea2c8ba08b))
- fix e2e disk size is not enough issue ([#576](https://github.com/instill-ai/console/issues/576)) ([73deb91](https://github.com/instill-ai/console/commit/73deb917bbf37f6e5af5622a1e0175e4a313f900))

## [0.28.0-alpha](https://github.com/instill-ai/console/compare/v0.27.0-alpha...v0.28.0-alpha) (2023-09-22)

### Features

- adapt component centric design's pipeline builder ([#539](https://github.com/instill-ai/console/issues/539)) ([c4c05be](https://github.com/instill-ai/console/commit/c4c05be702d23ea9e1282abf8da7779dbe791e9a))
- add /resources/rid page ([#537](https://github.com/instill-ai/console/issues/537)) ([1af8bd7](https://github.com/instill-ai/console/commit/1af8bd7f9d61c33b1bc61751f72757d7a18f1ad0))
- add create resource dialog into /resources page ([#535](https://github.com/instill-ai/console/issues/535)) ([523933b](https://github.com/instill-ai/console/commit/523933b5b014bf4b69c06a605ac5e8203638c1c0))
- based on separate metric data into buckets in backend, adopt in the console ([#519](https://github.com/instill-ai/console/issues/519)) ([3c19082](https://github.com/instill-ai/console/commit/3c190827752f034385b691d7393411c8932f05d4))
- bump up toolkit version ([#534](https://github.com/instill-ai/console/issues/534)) ([85bb2ed](https://github.com/instill-ai/console/commit/85bb2ed2c43c4e2b522e2da3e5bf996a6e839476))
- revamp pipeline builder to new component-centric-design ([#529](https://github.com/instill-ai/console/issues/529)) ([0963842](https://github.com/instill-ai/console/commit/09638421902599133d8ba5cdc297e9c0138fadd7))
- update favicon ([#516](https://github.com/instill-ai/console/issues/516)) ([1d97534](https://github.com/instill-ai/console/commit/1d975349460e4e24253ea7f4189683cba24c5483))
- update how we handle data in trigger mode ([#533](https://github.com/instill-ai/console/issues/533)) ([6036774](https://github.com/instill-ai/console/commit/6036774279a1095e885e7165381b035eef31ac61))
- update how we handle triggered trace data ([#536](https://github.com/instill-ai/console/issues/536)) ([7c335fb](https://github.com/instill-ai/console/commit/7c335fbcc6a738665fece4a833b3eca040048e27))
- update pipeline trigger snippet ([#538](https://github.com/instill-ai/console/issues/538)) ([e32fbe7](https://github.com/instill-ai/console/commit/e32fbe7fa2963eb842925d88b9d5066abf5cf451))
- update pipeline-builder color ([#531](https://github.com/instill-ai/console/issues/531)) ([0458984](https://github.com/instill-ai/console/commit/04589842fac00ad8c015411148c8a4dd71f7bc8e))
- update tables access token props ([#522](https://github.com/instill-ai/console/issues/522)) ([a492388](https://github.com/instill-ai/console/commit/a49238848b9436a0224bbebeac0fc1bac8eee648))
- update topbar color ([#540](https://github.com/instill-ai/console/issues/540)) ([2984474](https://github.com/instill-ai/console/commit/29844747f6605ddfed8793af81f2dda3724713d3))
- User can create model (currently they cant) ([#549](https://github.com/instill-ai/console/issues/549)) ([8e1b89e](https://github.com/instill-ai/console/commit/8e1b89e12866d6c5f681b50caf6cf5b09a9f57f1))

### Bug Fixes

- fix create model issue that the watch modelName is not correct ([#551](https://github.com/instill-ai/console/issues/551)) ([de19825](https://github.com/instill-ai/console/commit/de19825f97a509be07f7542bf3ef3482753f71c3))
- fix data source issue ([#542](https://github.com/instill-ai/console/issues/542)) ([5596859](https://github.com/instill-ai/console/commit/5596859c3e3f88f60f1b64c697f0b661f6178693))
- fix integration-test not correctly import expect ([#552](https://github.com/instill-ai/console/issues/552)) ([853a6d4](https://github.com/instill-ai/console/commit/853a6d48191b1a724871cbf57f202963b1b021ed))
- fix Pages not correctly passing Topbar props ([#532](https://github.com/instill-ai/console/issues/532)) ([72385be](https://github.com/instill-ai/console/commit/72385be5fd5454c33dee748fe1a0777e73f2ed6c))
- fix snippet typo ([#544](https://github.com/instill-ai/console/issues/544)) ([879ee17](https://github.com/instill-ai/console/commit/879ee17c271d090b31d6b2644171aa6072f7591c))

## [0.27.0-alpha](https://github.com/instill-ai/console/compare/v0.26.0-alpha...v0.27.0-alpha) (2023-08-03)

### Features

- adjust UI for source/destination connector -&gt; data connector ([#509](https://github.com/instill-ai/console/issues/509)) ([b34683e](https://github.com/instill-ai/console/commit/b34683e02c30a2fc18ab310eac86c48955c83296))
- new table design dev ([#492](https://github.com/instill-ai/console/issues/492)) ([53cf4d6](https://github.com/instill-ai/console/commit/53cf4d6b3ed0d06d791a69cd95feef38185d6efd))

### Bug Fixes

- bump cortex version to fix disabled field issue ([#478](https://github.com/instill-ai/console/issues/478)) ([31bc8ed](https://github.com/instill-ai/console/commit/31bc8edc6608a7f6dc2e2dc3169dcf8a1bbe1f9e))
- create AI form update ([#510](https://github.com/instill-ai/console/issues/510)) ([458c42a](https://github.com/instill-ai/console/commit/458c42ab4b5256eadecde6d22cc1ba9a661d8489))
- model definition icon ([#477](https://github.com/instill-ai/console/issues/477)) ([c2ca096](https://github.com/instill-ai/console/commit/c2ca0965504a2a68cc280fac77371e62cedb02b3))
- Namananand/ins 1363 pipeline builder render bug ([#480](https://github.com/instill-ai/console/issues/480)) ([7b927b3](https://github.com/instill-ai/console/commit/7b927b37408123068b2cfcd7b9b05f3ef7c89e25))
- sidebar css fix ([#475](https://github.com/instill-ai/console/issues/475)) ([ecc6038](https://github.com/instill-ai/console/commit/ecc603889dc13d157f969ad560ccc3ed3f179655))

### Miscellaneous

- bump the toolkit and design-system version ([#481](https://github.com/instill-ai/console/issues/481)) ([cea2f28](https://github.com/instill-ai/console/commit/cea2f281b8ac298056e119dd590850b7f5f67080))
- bump version ([#514](https://github.com/instill-ai/console/issues/514)) ([3f2c990](https://github.com/instill-ai/console/commit/3f2c99013da3c9762dbbf65b7d3c029fac474c47))
- bump versions ([#493](https://github.com/instill-ai/console/issues/493)) ([0b5a0f8](https://github.com/instill-ai/console/commit/0b5a0f8ad4876a59f496545a4d607384ebe1988d))
- bump versions ([#513](https://github.com/instill-ai/console/issues/513)) ([d8df2da](https://github.com/instill-ai/console/commit/d8df2da613fd05e907f5b0adcd9be9df48aec1e8))
- namananand/ins 1467 small issue for the pipeline component dependency ([#512](https://github.com/instill-ai/console/issues/512)) ([dcb7acb](https://github.com/instill-ai/console/commit/dcb7acb2d21b7747f5d460d37a8157c51eb8d94d))
- support audios node ([#511](https://github.com/instill-ai/console/issues/511)) ([d8005a0](https://github.com/instill-ai/console/commit/d8005a070f20dc5dfda9817917f3e7810a61f3e8))
- update toolkit and design-system version ([#490](https://github.com/instill-ai/console/issues/490)) ([a4392e7](https://github.com/instill-ai/console/commit/a4392e7723a2fb2cd0f035c10619b30536e21715))

## [0.26.0-alpha](https://github.com/instill-ai/console/compare/v0.25.0-alpha...v0.26.0-alpha) (2023-07-19)

### Features

- console metric dashboard INS-1004 ([#468](https://github.com/instill-ai/console/issues/468)) ([7b518ee](https://github.com/instill-ai/console/commit/7b518ee2c215acbe3332e9de7056592a28d3715a))
- support Stability AI SDXL model ([#469](https://github.com/instill-ai/console/issues/469)) ([aab3ca4](https://github.com/instill-ai/console/commit/aab3ca4f8bcac1bf14f9486ed88d0f81ec73ec59))

### Bug Fixes

- add multiple QoL and fixes ([#464](https://github.com/instill-ai/console/issues/464)) ([08dd8af](https://github.com/instill-ai/console/commit/08dd8af9b3b57918b8975a724958808c5d7d391b))
- fix accidentally query pipeline in MDL ([#471](https://github.com/instill-ai/console/issues/471)) ([b9486e3](https://github.com/instill-ai/console/commit/b9486e34d7fbb8eb20e40f6ffc36f1b0243d2382))
- fix pipeline builder form connect issue ([#466](https://github.com/instill-ai/console/issues/466)) ([bf94a5c](https://github.com/instill-ai/console/commit/bf94a5cbc943ad286bff7c5d477c84ca96165661))

### Miscellaneous

- build console image before pull on CI ([#474](https://github.com/instill-ai/console/issues/474)) ([7bdf860](https://github.com/instill-ai/console/commit/7bdf860fbd510173fc4436a994064b2ddbc71c70))
- prepare for release 0.26.0 ([#473](https://github.com/instill-ai/console/issues/473)) ([3793b2e](https://github.com/instill-ai/console/commit/3793b2e3ce1871d179dda5b5eb38cba99a20c22e))
- unify trigger at source and response at destination ([#470](https://github.com/instill-ai/console/issues/470)) ([8854496](https://github.com/instill-ai/console/commit/8854496568c5797da8efb1873e6ed3a67692b2e4))

## [0.25.0-alpha](https://github.com/instill-ai/console/compare/v0.24.1-alpha...v0.25.0-alpha) (2023-07-09)

### Features

- adapt input_only field for AI and Blockchain related form ([#444](https://github.com/instill-ai/console/issues/444)) ([8dbc3cc](https://github.com/instill-ai/console/commit/8dbc3cc16a437e4d05b91e1910b274c4053de8cc))
- adapt instill-ai new product structure ([#429](https://github.com/instill-ai/console/issues/429)) ([b5507d6](https://github.com/instill-ai/console/commit/b5507d6a9e3cc2823a6b95df46bcf7f9720184e1))
- adapt most-up-to-date cortex ([#457](https://github.com/instill-ai/console/issues/457)) ([854d1fb](https://github.com/instill-ai/console/commit/854d1fbb4f8c4805aa8c2581807df6d9b1da0d41))
- adapt new trigger snippet and pipeline-builder in cortex ([#452](https://github.com/instill-ai/console/issues/452)) ([717fc48](https://github.com/instill-ai/console/commit/717fc481fa07131ae0dc4f318a4359192a5fc9c8))
- adapt up-to-date pipeline-builder ([#454](https://github.com/instill-ai/console/issues/454)) ([8333e3b](https://github.com/instill-ai/console/commit/8333e3b2971568dd865d60f90141512a38746bfb))
- add different structure backend workflow ([#458](https://github.com/instill-ai/console/issues/458)) ([af417d8](https://github.com/instill-ai/console/commit/af417d8f5fb45ca235ce3fe37d29f4425fc4bb06))
- **connector:** implement pages related to blockchain ([#434](https://github.com/instill-ai/console/issues/434)) ([bd795a0](https://github.com/instill-ai/console/commit/bd795a0d8206bd9d2fd67a6e244f4e7a1f79a401))
- **core:** adapt the singular connector endpoint design ([#431](https://github.com/instill-ai/console/issues/431)) ([a4e7f84](https://github.com/instill-ai/console/commit/a4e7f84c5e872a619da87656521d3cc93171eaf4))
- **core:** implement the ai-connector related pages ([#433](https://github.com/instill-ai/console/issues/433)) ([86d130b](https://github.com/instill-ai/console/commit/86d130bd69f486106f9545f7bbccf03fa1ae2f33))
- **model-hub:** add model-hub page ([#432](https://github.com/instill-ai/console/issues/432)) ([ea7eaf1](https://github.com/instill-ai/console/commit/ea7eaf1ece54f1d843dc6581040c93986d8ed870))
- **pipeline-builder:** add pipeline-builder and adapt the new connector endpoint ([#436](https://github.com/instill-ai/console/issues/436)) ([127c59f](https://github.com/instill-ai/console/commit/127c59f7bc672f6bf828647f50c34f47cc2de699))
- **pipeline-builder:** implement disconnect/connect action in the pipeline-builder ([#439](https://github.com/instill-ai/console/issues/439)) ([7fa5542](https://github.com/instill-ai/console/commit/7fa554261284c834fafd7c32ce84f60ec0173ceb))
- **pipeline-builder:** implement the nested left panel in the pipeline builder ([#447](https://github.com/instill-ai/console/issues/447)) ([2cef341](https://github.com/instill-ai/console/commit/2cef34119456497f05212145fb9187e3615c594c))
- **pipeline-builder:** implement the resource configuration at the pipeline-builder right panel ([#437](https://github.com/instill-ai/console/issues/437)) ([8b349e3](https://github.com/instill-ai/console/commit/8b349e3eda07f350cff07be62362adb3bd1ee052))
- **pipeline-builder:** support blockchain in pipeline-builder ([#438](https://github.com/instill-ai/console/issues/438)) ([4605209](https://github.com/instill-ai/console/commit/46052097badf6fe03e2a56da9442da8de03f61bc))
- **pipeline-builder:** support complex DAG in pipeline-builder ([#445](https://github.com/instill-ai/console/issues/445)) ([bbc6b57](https://github.com/instill-ai/console/commit/bbc6b57094ac1dafae603658e154cf8149dacaac))
- sync pipeline-builder and form with cortex ([#455](https://github.com/instill-ai/console/issues/455)) ([63bea00](https://github.com/instill-ai/console/commit/63bea00f4710f90111f3a09c889cc4ca2102d3ab))
- update the control of the pipeline ([#442](https://github.com/instill-ai/console/issues/442)) ([a0b5a55](https://github.com/instill-ai/console/commit/a0b5a55838d0e3498384b24a861d3e63a5faa86c))

### Bug Fixes

- **e2e:** fix console e2e test related to model-hub ([#440](https://github.com/instill-ai/console/issues/440)) ([a344297](https://github.com/instill-ai/console/commit/a344297606f6f9d6bd9aa4477f92f9950d4b14c4))
- fix pipeline deps wrong syntax ([#448](https://github.com/instill-ai/console/issues/448)) ([ad09733](https://github.com/instill-ai/console/commit/ad097337ab2219a57559e11aac0a698e54a1e720))
- fix pipeline-builder bugs ([#456](https://github.com/instill-ai/console/issues/456)) ([b4a3d02](https://github.com/instill-ai/console/commit/b4a3d028cd6e5ccb4625708b59601003e4ba216d))
- fix wrong connector endpoint ([#435](https://github.com/instill-ai/console/issues/435)) ([ed6eb8c](https://github.com/instill-ai/console/commit/ed6eb8c3388bb6ff4662d7ac8df95a78725d85cb))
- **pipeline-builder:** fix activate pipeline button will always show activate ([#449](https://github.com/instill-ai/console/issues/449)) ([3bc62fc](https://github.com/instill-ai/console/commit/3bc62fc2ef01ab14970a162fc5c1bc57aef0d55c))
- **pipeline-builder:** fix multiple pipeline-builder flow issues related to rename ([#443](https://github.com/instill-ai/console/issues/443)) ([df02617](https://github.com/instill-ai/console/commit/df0261721ae36e7e5f5b922f9e11e3f70571ae22))
- **toolkit:** fix destination logic issue related to http and grpc ([#451](https://github.com/instill-ai/console/issues/451)) ([925d5b8](https://github.com/instill-ai/console/commit/925d5b8d56bbc182503686911857fec6bed82e72))

### Miscellaneous

- update the backend minor change ([#446](https://github.com/instill-ai/console/issues/446)) ([f635bbf](https://github.com/instill-ai/console/commit/f635bbf6348350e83c6f198308346b0ab3cf0e68))

## [0.24.1-alpha](https://github.com/instill-ai/console/compare/v0.24.0-alpha...v0.24.1-alpha) (2023-06-21)

### Miscellaneous

- **connector:** adapt the new connector definition ([#426](https://github.com/instill-ai/console/issues/426)) ([e579d76](https://github.com/instill-ai/console/commit/e579d768465a5962898fd9b65d7ce560cffeedef))
- fix release-please config ([#427](https://github.com/instill-ai/console/issues/427)) ([1fa8966](https://github.com/instill-ai/console/commit/1fa896626ace2d04229350caa6704092e45acd3c))

## [0.24.0-alpha](https://github.com/instill-ai/console/compare/v0.23.0-alpha...v0.24.0-alpha) (2023-06-11)

### Features

- add test connector connection button ([#422](https://github.com/instill-ai/console/issues/422)) ([409086f](https://github.com/instill-ai/console/commit/409086f2ba94baabd16d5938eee4823ff3b08113))
- **style:** update console with new sidebar and topbar design ([#425](https://github.com/instill-ai/console/issues/425)) ([64cd846](https://github.com/instill-ai/console/commit/64cd8462b517c0d907b4b19e75d06f917df254d6))

### Bug Fixes

- fix create-source page memory leak and other form issues ([#424](https://github.com/instill-ai/console/issues/424)) ([72cc736](https://github.com/instill-ai/console/commit/72cc736698e6cbe156a0a8301476757984da1433))

## [0.23.0-alpha](https://github.com/instill-ai/console/compare/v0.22.1-alpha...v0.23.0-alpha) (2023-05-30)

### Features

- [INS-518] update dummy model for testing ([#419](https://github.com/instill-ai/console/issues/419)) ([b6a3745](https://github.com/instill-ai/console/commit/b6a3745fdcfb1005567234c7679db28aeca9195f))
- [INS-751] adapt new pipeline recipe and update trigger snippet ([#417](https://github.com/instill-ai/console/issues/417)) ([61809bb](https://github.com/instill-ai/console/commit/61809bb8fcc4e479bfb041e8ac3ea956d016c666))
- stabilize test related to the pipeline details page ([#414](https://github.com/instill-ai/console/issues/414)) ([9f72427](https://github.com/instill-ai/console/commit/9f72427c3447e08cf5715adc0c59b4ac7c2fa6da))
- update docs link at sidebar ([#416](https://github.com/instill-ai/console/issues/416)) ([51103f9](https://github.com/instill-ai/console/commit/51103f9ba8f79eae025ef6afdae0b892e4d53e89))

### Bug Fixes

- [INS-805] fix not correctly query pipelines that use this resource ([#420](https://github.com/instill-ai/console/issues/420)) ([bdcd7aa](https://github.com/instill-ai/console/commit/bdcd7aa928927dd89008bd28bdf6a7ad8f0d3a0c))

## [0.22.1-alpha](https://github.com/instill-ai/console/compare/v0.22.0-alpha...v0.22.1-alpha) (2023-05-04)

### Bug Fixes

- further fix test flakiness ([#412](https://github.com/instill-ai/console/issues/412)) ([dcadf61](https://github.com/instill-ai/console/commit/dcadf618bd9cf52e8fed1790e38d63b024b31075))

## [0.22.0-alpha](https://github.com/instill-ai/console/compare/v0.21.4-alpha...v0.22.0-alpha) (2023-04-26)

### Features

- update logic related to create model ([#406](https://github.com/instill-ai/console/issues/406)) ([c2ed456](https://github.com/instill-ai/console/commit/c2ed456eafcc7efe89e7a34c99b26e7f927148a3))
- use waitFor to stabilize tests ([#411](https://github.com/instill-ai/console/issues/411)) ([5744f73](https://github.com/instill-ai/console/commit/5744f73fd43847bbc87798107080652aade1606d))

### Bug Fixes

- [INS-463] fix console edition ([#404](https://github.com/instill-ai/console/issues/404)) ([90fb623](https://github.com/instill-ai/console/commit/90fb6236b94a68ae33159546afc41bd87876ba8a))
- fix bad user experience at Onboarding page ([#409](https://github.com/instill-ai/console/issues/409)) ([d1063a5](https://github.com/instill-ai/console/commit/d1063a57d03f3b4acaf2ce2c56277c4650a16900))
- stabilize the onboarding test ([#410](https://github.com/instill-ai/console/issues/410)) ([58c5fb6](https://github.com/instill-ai/console/commit/58c5fb694003f88fbc64c11a1b26ba6ecfb82d05))

## [0.21.4-alpha](https://github.com/instill-ai/console/compare/v0.21.3-alpha...v0.21.4-alpha) (2023-04-14)

### Bug Fixes

- fix default user id ([#402](https://github.com/instill-ai/console/issues/402)) ([91713a4](https://github.com/instill-ai/console/commit/91713a418fc0ff10e3b8bc690f36bc723bd4adf5))

## [0.21.3-alpha](https://github.com/instill-ai/console/compare/v0.21.2-alpha...v0.21.3-alpha) (2023-04-11)

### Bug Fixes

- [INS-415] fix table column width ([#398](https://github.com/instill-ai/console/issues/398)) ([410fa2d](https://github.com/instill-ai/console/commit/410fa2d88a7e3f928473f6ed67fcb87a62882804))
- fix release-please-config ([410fa2d](https://github.com/instill-ai/console/commit/410fa2d88a7e3f928473f6ed67fcb87a62882804))

## [0.21.2-alpha](https://github.com/instill-ai/console/compare/v0.21.1-alpha...v0.21.2-alpha) (2023-04-10)

### Bug Fixes

- fix toggle resource button is not disabled ([#395](https://github.com/instill-ai/console/issues/395)) ([cb80d3e](https://github.com/instill-ai/console/commit/cb80d3ef0d9b0a0fc22611cc98af0f8c0c4f7410))

## [0.21.1-alpha](https://github.com/instill-ai/console/compare/v0.21.0-alpha...v0.21.1-alpha) (2023-04-08)

### Bug Fixes

- fix PipelinesTable typo ([#393](https://github.com/instill-ai/console/issues/393)) ([56ccd46](https://github.com/instill-ai/console/commit/56ccd46a9e85538970b3e1b95e7b80ae758a1cbc))

## [0.21.0-alpha](https://github.com/instill-ai/console/compare/v0.20.2-alpha...v0.21.0-alpha) (2023-04-07)

### Features

- adapt controller state ([#391](https://github.com/instill-ai/console/issues/391)) ([2f86635](https://github.com/instill-ai/console/commit/2f866358386008382c88295f690bf64ed997e73e))
- adapt cortex ([#389](https://github.com/instill-ai/console/issues/389)) ([5634c2c](https://github.com/instill-ai/console/commit/5634c2c0d9858acda9e50368308fa30e7c8aebf5))

## [0.20.2-alpha](https://github.com/instill-ai/console/compare/v0.20.1-alpha...v0.20.2-alpha) (2023-03-28)

### Bug Fixes

- add `NEXT_PUBLIC_SET_SECURE_COOKIE` to control the behavior ([#387](https://github.com/instill-ai/console/issues/387)) ([8b11b1c](https://github.com/instill-ai/console/commit/8b11b1c2597e790c83ce30837d91f2d63294e200))

## [0.20.1-alpha](https://github.com/instill-ai/console/compare/v0.20.0-alpha...v0.20.1-alpha) (2023-03-27)

### Bug Fixes

- fix onboarding issue when vdp had user in db ([#384](https://github.com/instill-ai/console/issues/384)) ([6e0f3b5](https://github.com/instill-ai/console/commit/6e0f3b53b35a3c81332174808291183bff9ff9bc))
- update token no matter db had user or not ([#386](https://github.com/instill-ai/console/issues/386)) ([2c59339](https://github.com/instill-ai/console/commit/2c5933928985c6ed915f2ce22f010bb5ec6240d5))

## [0.20.0-alpha](https://github.com/instill-ai/console/compare/v0.19.0-alpha...v0.20.0-alpha) (2023-03-26)

### Features

- [INS-250] update the logic of tracking cookie ([#372](https://github.com/instill-ai/console/issues/372)) ([4a828e9](https://github.com/instill-ai/console/commit/4a828e96a33a8fc92ed2d4ebf5895192b0f132c1))
- [INS-267] mock onboarded cookie ([#378](https://github.com/instill-ai/console/issues/378)) ([bbf8322](https://github.com/instill-ai/console/commit/bbf8322a3751541306b776708e79d4766b2a7fa3))
- add playwright state ([#373](https://github.com/instill-ai/console/issues/373)) ([b1ff209](https://github.com/instill-ai/console/commit/b1ff209209c5456054c2450b7e61129c2b7e7d1d))
- Impl pagination ([#365](https://github.com/instill-ai/console/issues/365)) ([6db8461](https://github.com/instill-ai/console/commit/6db84611fd1b91bd649b2041ad66b61526c6f100))
- make test operate in order and bump playwright version ([#374](https://github.com/instill-ai/console/issues/374)) ([ddfcd5a](https://github.com/instill-ai/console/commit/ddfcd5a45c9a6146a23c3978db5f1172107a4716))
- update how we store playwright state ([#376](https://github.com/instill-ai/console/issues/376)) ([9bf8de5](https://github.com/instill-ai/console/commit/9bf8de5823388883c0b4942f82c7c106576e737c))

### Bug Fixes

- don't specific domain when set cookie ([#377](https://github.com/instill-ai/console/issues/377)) ([109a5f9](https://github.com/instill-ai/console/commit/109a5f994f4001d3af875969cdb446515b3900c0))
- fix change resource button is not disabled when we need to ([#369](https://github.com/instill-ai/console/issues/369)) ([53f5472](https://github.com/instill-ai/console/commit/53f547285c847523c74f53560aa113929cc73556))
- fix import path in test ([#379](https://github.com/instill-ai/console/issues/379)) ([7463895](https://github.com/instill-ai/console/commit/7463895dfc6b316a304af12b38eaf197bf2e95ab))
- fix pipelines table margin bottom issue ([#367](https://github.com/instill-ai/console/issues/367)) ([99776bd](https://github.com/instill-ai/console/commit/99776bd7cc5ae6368980b164cd973d5bde0949f1))
- fix playwright container version ([#375](https://github.com/instill-ai/console/issues/375)) ([bf4924c](https://github.com/instill-ai/console/commit/bf4924cc1318fd84de8125beb2ea682bf79cbdce))

## [0.19.0-alpha](https://github.com/instill-ai/console/compare/v0.18.0-alpha...v0.19.0-alpha) (2023-03-01)

### Features

- expose a env that can disable all create, update, delete action ([#363](https://github.com/instill-ai/console/issues/363)) ([acdc412](https://github.com/instill-ai/console/commit/acdc4125ae8342b0b6ffde0b726e3670e31e1591))

## [0.18.0-alpha](https://github.com/instill-ai/console/compare/v0.17.0-alpha...v0.18.0-alpha) (2023-02-27)

### Features

- migrate react-query to version 4 ([#352](https://github.com/instill-ai/console/issues/352)) ([d72196a](https://github.com/instill-ai/console/commit/d72196acfbc299880ebf460ed823d6fb22fb32ab))

### Bug Fixes

- refactor the trigger codes ([#361](https://github.com/instill-ai/console/issues/361)) ([400e54b](https://github.com/instill-ai/console/commit/400e54b62cc3e569a8c8ae0801a7ab67822a4462))
- reset error object create model form ([#357](https://github.com/instill-ai/console/issues/357)) ([e664c05](https://github.com/instill-ai/console/commit/e664c057f2e397f9caa812832d82408f637b7760))

## [0.17.0-alpha](https://github.com/instill-ai/console/compare/v0.16.0-alpha...v0.17.0-alpha) (2023-02-22)

### Features

- add health endpoint ([#341](https://github.com/instill-ai/console/issues/341)) ([488ef16](https://github.com/instill-ai/console/commit/488ef165459d30474bd2cee65eec0417b0feb2c3))
- expose node env as build args ([#345](https://github.com/instill-ai/console/issues/345)) ([9a82499](https://github.com/instill-ai/console/commit/9a824997b82f32b1bb68756ed2a64f878f33b092))
- further delay the model details test ([bb0e955](https://github.com/instill-ai/console/commit/bb0e955a25ce6d9a18f549f1e7e35a79379a5763))
- further stabilize e2e test by removing the clean up function ([#356](https://github.com/instill-ai/console/issues/356)) ([eb0e58c](https://github.com/instill-ai/console/commit/eb0e58ce8bf12b6a586b47c91c58bcfc95c5d974))
- implement new pipeline snippet ([#346](https://github.com/instill-ai/console/issues/346)) ([01c8c41](https://github.com/instill-ai/console/commit/01c8c41784208678fb102a9b15c0af3a115e6784))
- turn off test related to long running operation ([#354](https://github.com/instill-ai/console/issues/354)) ([f28be7c](https://github.com/instill-ai/console/commit/f28be7c4bfdcb05f731431c71dbe4a1c8c01a1f3))
- update env name ([#358](https://github.com/instill-ai/console/issues/358)) ([8f51ed8](https://github.com/instill-ai/console/commit/8f51ed8db2b26b44bece32c08223e2547683a4b3))
- update model task label ([#347](https://github.com/instill-ai/console/issues/347)) ([bb317f1](https://github.com/instill-ai/console/commit/bb317f14ea22609a6e1081c82a93d3eeddbd9354))
- update tests to skip long-running operation related tests ([#355](https://github.com/instill-ai/console/issues/355)) ([e1ed5a8](https://github.com/instill-ai/console/commit/e1ed5a832a2dda9ccad5d28ee7c6885df99b67b3))

### Bug Fixes

- fix env file ([#349](https://github.com/instill-ai/console/issues/349)) ([b8ff7aa](https://github.com/instill-ai/console/commit/b8ff7aaa2dc2b2fc7abd4621615f0f3ae0a76ce6))
- fix env issue ([#348](https://github.com/instill-ai/console/issues/348)) ([f2e6126](https://github.com/instill-ai/console/commit/f2e6126bf054cbd5165d1bc4457f40083a0a6d58))
- fix wrong env name ([#350](https://github.com/instill-ai/console/issues/350)) ([30f5308](https://github.com/instill-ai/console/commit/30f53086e8d4f34ed1ed7bce9a8bdc6e77402a89))

## [0.16.0-alpha](https://github.com/instill-ai/console/compare/v0.15.0-alpha...v0.16.0-alpha) (2023-02-10)

### Features

- adapt new mgmt backend and protobuf ([#337](https://github.com/instill-ai/console/issues/337)) ([8f6f698](https://github.com/instill-ai/console/commit/8f6f69811dcc8a0df2527c80d8861448c1144fcc))
- add pr-semantic workflow ([#331](https://github.com/instill-ai/console/issues/331)) ([e6084c0](https://github.com/instill-ai/console/commit/e6084c00b03730ff2baadd0eea05363940a42361))
- extend the delay when test model details page ([#336](https://github.com/instill-ai/console/issues/336)) ([6b68a71](https://github.com/instill-ai/console/commit/6b68a719b9da3ad99104fe005dd43f215569a206))
- run build when test in the workflow ([#339](https://github.com/instill-ai/console/issues/339)) ([2b87fa1](https://github.com/instill-ai/console/commit/2b87fa10da45267a6b09605cc7bc08ff848f8159))
- upgrade nextjs13 ([#334](https://github.com/instill-ai/console/issues/334)) ([a488408](https://github.com/instill-ai/console/commit/a4884088b0ca9e9a67b7f3f980c8eb20db31bf61))

### Bug Fixes

- fix ts config typo ([#335](https://github.com/instill-ai/console/issues/335)) ([17990ae](https://github.com/instill-ai/console/commit/17990ae2954d32d7494ccb88722ab0f57172c8ef))
- fix update user bug ([#338](https://github.com/instill-ai/console/issues/338)) ([024cd1c](https://github.com/instill-ai/console/commit/024cd1cf7396cb813bf44b683d8d5bf23cb56b59))

## [0.15.0-alpha](https://github.com/instill-ai/console/compare/v0.14.0-alpha...v0.15.0-alpha) (2023-01-14)

### Features

- add InstanceSegmentationIcon into label ([#327](https://github.com/instill-ai/console/issues/327)) ([fabb36a](https://github.com/instill-ai/console/commit/fabb36ab8e8b8df7e4eecdacb711b7976dd14ca1))
- add SemanticSegmentationIcon icon ([#329](https://github.com/instill-ai/console/issues/329)) ([76cdb20](https://github.com/instill-ai/console/commit/76cdb20f4620ac8256c52ff3f25619200d62909d))
- fix operation query issue ([#328](https://github.com/instill-ai/console/issues/328)) ([54d7aef](https://github.com/instill-ai/console/commit/54d7aef53cff5c8fce8015cf8c653fe1f517edbc))
- Impl running playwright inside docker ([#318](https://github.com/instill-ai/console/issues/318)) ([4da12aa](https://github.com/instill-ai/console/commit/4da12aa92b8f222a4caec62d63206728b601fa7e))
- let maintainer switch playwright container user ([#320](https://github.com/instill-ai/console/issues/320)) ([f9c15e5](https://github.com/instill-ai/console/commit/f9c15e525d3672863972a889e65862ac84a6e441))
- prolong test timeout ([#323](https://github.com/instill-ai/console/issues/323)) ([59f93e1](https://github.com/instill-ai/console/commit/59f93e17b3bbcc745d39d91ee5da7b516a768742))
- reduce the test time from 60000 ms to 15000 ms ([#319](https://github.com/instill-ai/console/issues/319)) ([3d4b024](https://github.com/instill-ai/console/commit/3d4b024d3499edb5e374d7c3c972a8bb97290ef8))
- stablize async model deploying test ([#314](https://github.com/instill-ai/console/issues/314)) ([94e867f](https://github.com/instill-ai/console/commit/94e867f6272b2453fab8ac26a30b5c4213d1288c))
- support async model creation ([#324](https://github.com/instill-ai/console/issues/324)) ([dedcd82](https://github.com/instill-ai/console/commit/dedcd82c8239d7a16c32cd66ec484b1a161c08eb))
- suspend the test related to cookie ([#322](https://github.com/instill-ai/console/issues/322)) ([bd54f71](https://github.com/instill-ai/console/commit/bd54f7195228a384afb374faa403f7efcf8e929b))

### Bug Fixes

- fix https issue ([#326](https://github.com/instill-ai/console/issues/326)) ([933afcc](https://github.com/instill-ai/console/commit/933afcc110bc565abd857c2ed86e5a5bad95ff6b))
- fix wrong config in .env file ([#317](https://github.com/instill-ai/console/issues/317)) ([dd739d3](https://github.com/instill-ai/console/commit/dd739d38c366227bf2eb9d8c52b5005cb4f6a4bd))

## [0.14.0-alpha](https://github.com/instill-ai/console/compare/v0.13.0-alpha...v0.14.0-alpha) (2022-12-23)

### Features

- add hg model id field at model_instance page ([#300](https://github.com/instill-ai/console/issues/300)) ([31a6eab](https://github.com/instill-ai/console/commit/31a6eab6670d3e317e6bc293690eb07a75f8fffb))
- cleanup connector after test ([#295](https://github.com/instill-ai/console/issues/295)) ([f9c8e4c](https://github.com/instill-ai/console/commit/f9c8e4c78cdc9f772778d57edb9491b560c90081))
- disable html report ([#297](https://github.com/instill-ai/console/issues/297)) ([689f50d](https://github.com/instill-ai/console/commit/689f50d3407f501563507a43bc26206cb8ee3c6f))
- enhance the warning of the resource id field ([#303](https://github.com/instill-ai/console/issues/303)) ([6c4aa4f](https://github.com/instill-ai/console/commit/6c4aa4fd5e88591d8225e6432f14c6874ee2ae65))
- make playwright output dot on CI ([#293](https://github.com/instill-ai/console/issues/293)) ([e5c2958](https://github.com/instill-ai/console/commit/e5c2958461134578c8a461fce85e058938a83eeb))
- support model-backend async long run operation ([#309](https://github.com/instill-ai/console/issues/309)) ([f795ce8](https://github.com/instill-ai/console/commit/f795ce87da03ab8bcb331604ad2ddd4cbf4c0304))
- update e2e test ([#313](https://github.com/instill-ai/console/issues/313)) ([88bf0cd](https://github.com/instill-ai/console/commit/88bf0cdab1c8b003c38a070fc8939bdc1289d90b))
- update how we test model detail page ([#310](https://github.com/instill-ai/console/issues/310)) ([04c83a1](https://github.com/instill-ai/console/commit/04c83a1b18b8c9bcf64d640458cfe04cf4b18a8a))
- Wipeout all data after test ([#296](https://github.com/instill-ai/console/issues/296)) ([e4085dd](https://github.com/instill-ai/console/commit/e4085ddf45ff3ecd429a4747fcab0673ed4574c2))

## [0.13.0-alpha](https://github.com/instill-ai/console/compare/v0.12.0-alpha...v0.13.0-alpha) (2022-10-04)

### Features

- extend the time span of our user cookie ([#289](https://github.com/instill-ai/console/issues/289)) ([76a6f99](https://github.com/instill-ai/console/commit/76a6f99b89e6a10517149167432c0b70a7906e1f))
- Finish integration test and make it stable ([#281](https://github.com/instill-ai/console/issues/281)) ([3fd8d21](https://github.com/instill-ai/console/commit/3fd8d217eab93909c7be74c02f2d75d42c7c385f))
- replace prism.js with code-hike ([#292](https://github.com/instill-ai/console/issues/292)) ([cb61708](https://github.com/instill-ai/console/commit/cb61708ac5734efcf676d8f067d88212abbc732f))
- unify the gap between elements in every table ([#291](https://github.com/instill-ai/console/issues/291)) ([e743820](https://github.com/instill-ai/console/commit/e743820d23a8a9aaddd9594769cd02c50f8ceae9))
- update console request URL according to new protobuf ([#287](https://github.com/instill-ai/console/issues/287)) ([fa7ecc3](https://github.com/instill-ai/console/commit/fa7ecc33a2a6aa9dfe74d427d5c184c9fc51ae69))

### Bug Fixes

- fix pipeline e2e not stable ([#285](https://github.com/instill-ai/console/issues/285)) ([a26e599](https://github.com/instill-ai/console/commit/a26e5994f192446c0ca5405a4f2425d7e13f3176))
- fix set-cookie api route issue due to wrong domain name ([#284](https://github.com/instill-ai/console/issues/284)) ([c3efcdd](https://github.com/instill-ai/console/commit/c3efcdd7e546da3ed88571668a1195102dc3415b))

## [0.12.0-alpha](https://github.com/instill-ai/console/compare/v0.11.0-alpha...v0.12.0-alpha) (2022-09-18)

### Features

- add model integration test - huggingface, github, local ([#276](https://github.com/instill-ai/console/issues/276)) ([32ea70a](https://github.com/instill-ai/console/commit/32ea70a847f47e30e5bf88c5cc6263efaf5431a0))
- add the destination integration test ([#279](https://github.com/instill-ai/console/issues/279)) ([c218201](https://github.com/instill-ai/console/commit/c218201124cb60107557d3b2bbab169ac4ffb49a))
- Implement pipeline e2e test ([#280](https://github.com/instill-ai/console/issues/280)) ([e1833a3](https://github.com/instill-ai/console/commit/e1833a332fcd6abbd52b04c07235f91ec47fae6f))

### Bug Fixes

- fix instance cell not refresh issue ([#278](https://github.com/instill-ai/console/issues/278)) ([7c1a291](https://github.com/instill-ai/console/commit/7c1a291a2828193b273e886d29e5539bb0a55eeb))

## [0.11.0-alpha](https://github.com/instill-ai/console/compare/v0.10.3-alpha...v0.11.0-alpha) (2022-09-07)

### Features

- add buffer into calculation of instance cell more button ([#268](https://github.com/instill-ai/console/issues/268)) ([19d1470](https://github.com/instill-ai/console/commit/19d1470637b135f3f94c7d9d84f672467cc24bc3))
- add destination configuration form ([#255](https://github.com/instill-ai/console/issues/255)) ([0164946](https://github.com/instill-ai/console/commit/0164946fd9c8a4b17b26abc2e3054c584405ebb8))
- Implement onboarding integration test ([#271](https://github.com/instill-ai/console/issues/271)) ([f9c494e](https://github.com/instill-ai/console/commit/f9c494e29b437f661c9507f1ef6a3d691a1c3d38))
- Implement source integration test ([#272](https://github.com/instill-ai/console/issues/272)) ([b85a285](https://github.com/instill-ai/console/commit/b85a2850162c0b23b237eb6af6e56f74cdf01126))
- use env var in pipeline snippet ([#275](https://github.com/instill-ai/console/issues/275)) ([3bc4d7a](https://github.com/instill-ai/console/commit/3bc4d7a93f9bae6c603a0159479f1475203fa38d))

### Bug Fixes

- fix cookie_token wrongly set issue ([#269](https://github.com/instill-ai/console/issues/269)) ([7e25d9d](https://github.com/instill-ai/console/commit/7e25d9d52a1c6480014ba5a6f8f04ac71f6e2151))
- fix Select a existing to Select an existing ([#264](https://github.com/instill-ai/console/issues/264)) ([87a8584](https://github.com/instill-ai/console/commit/87a8584fcfc34e39904e6d5e98c7df41c990c8fe))
- fix the missing destination deletion ([#267](https://github.com/instill-ai/console/issues/267)) ([f96e65c](https://github.com/instill-ai/console/commit/f96e65c3ef010b56bbf280d4b1b7efba4c5fa8c8))
- fix various issues related to destination icons and displayed title ([#266](https://github.com/instill-ai/console/issues/266)) ([d86c25c](https://github.com/instill-ai/console/commit/d86c25c766bf4f070d25f84ee03e5a8d34d9f829))

## [0.10.3-alpha](https://github.com/instill-ai/console/compare/v0.10.2-alpha...v0.10.3-alpha) (2022-08-30)

### Bug Fixes

- fix onboard cookie issue ([#252](https://github.com/instill-ai/console/issues/252)) ([a4a93cc](https://github.com/instill-ai/console/commit/a4a93ccf6193150f74b09c9c251ce2fcb417b50a))
- fix various typo ([#249](https://github.com/instill-ai/console/issues/249)) ([d60f860](https://github.com/instill-ai/console/commit/d60f8601a0b4e6d6d92e0c5d81eabafa6d50cc10))
- update the sample github repos ([#253](https://github.com/instill-ai/console/issues/253)) ([82592dd](https://github.com/instill-ai/console/commit/82592ddb9f19fbe3522f5c614eb5454b9135cc27))

## [0.10.2-alpha](https://github.com/instill-ai/console/compare/v0.10.1-alpha...v0.10.2-alpha) (2022-08-19)

### Bug Fixes

- fix the calculation of last updated time ([#242](https://github.com/instill-ai/console/issues/242)) ([75186a8](https://github.com/instill-ai/console/commit/75186a802124faabfe31a956aee62c3c60f3fb83))
- update the sample github repos ([#241](https://github.com/instill-ai/console/issues/241)) ([41f234a](https://github.com/instill-ai/console/commit/41f234ad32df24418cee74bcb06d89e4a103c67a))

## [0.10.1-alpha](https://github.com/instill-ai/console/compare/v0.10.0-alpha...v0.10.1-alpha) (2022-08-19)

### Bug Fixes

- fix various typo ([#239](https://github.com/instill-ai/console/issues/239)) ([a85f74e](https://github.com/instill-ai/console/commit/a85f74e48c53f47782a01c367b6e1854f6c9776d))

## [0.10.0-alpha](https://github.com/instill-ai/console/compare/v0.9.0-alpha...v0.10.0-alpha) (2022-08-18)

### Features

- add error boundary ([#232](https://github.com/instill-ai/console/issues/232)) ([56f9f97](https://github.com/instill-ai/console/commit/56f9f97e80753915424ac6fadaa59252566f03c2))
- Implement code-hike snippet ([#223](https://github.com/instill-ai/console/issues/223)) ([c0b1b21](https://github.com/instill-ai/console/commit/c0b1b219c6e55fddb4bb7d6952b7795c5c52f705))
- update design system ([#228](https://github.com/instill-ai/console/issues/228)) ([410d4b8](https://github.com/instill-ai/console/commit/410d4b880676a172ac352aeb84250d10301dd531))
- update logo ([#226](https://github.com/instill-ai/console/issues/226)) ([a3b566b](https://github.com/instill-ai/console/commit/a3b566b1f03eb342f9d3d78be7f122bb0facbe61))
- update object-detection icon and add ocr icon ([#227](https://github.com/instill-ai/console/issues/227)) ([652f114](https://github.com/instill-ai/console/commit/652f1148e4dc3855c5a89e65651468daa6e84573))

### Bug Fixes

- fix code hike issue ([#237](https://github.com/instill-ai/console/issues/237)) ([d582ada](https://github.com/instill-ai/console/commit/d582adaa5c92b6b18b3e0eff0a53073cacd407ab))

## [0.9.0-alpha](https://github.com/instill-ai/console/compare/v0.8.0-alpha...v0.9.0-alpha) (2022-08-10)

### Features

- update sidebar docs link ([#217](https://github.com/instill-ai/console/issues/217)) ([2d026b1](https://github.com/instill-ai/console/commit/2d026b183896acbb937a78499e5c8314f67435ac))

## [0.8.0-alpha](https://github.com/instill-ai/console/compare/v0.7.0-alpha...v0.8.0-alpha) (2022-08-03)

### Features

- migrate to pnpm ([#208](https://github.com/instill-ai/console/issues/208)) ([d53240e](https://github.com/instill-ai/console/commit/d53240e50196b9fa1db6861358f00a232cda7bf7))
- remove pipeline state toggle button ([#207](https://github.com/instill-ai/console/issues/207)) ([f303243](https://github.com/instill-ai/console/commit/f3032435f8ef05fc29dbf2fcfc8b2f0017d3c6a6))
- support create airbyte destination under pipeline flow ([#205](https://github.com/instill-ai/console/issues/205)) ([ed73b63](https://github.com/instill-ai/console/commit/ed73b63e88d849df0f09e7f5137fd749480baee1))

### Bug Fixes

- fix pnpm dockerfile issue ([#209](https://github.com/instill-ai/console/issues/209)) ([049f45c](https://github.com/instill-ai/console/commit/049f45c8b2eb1852b48577238741fd6da8c774b3))

## [0.7.0-alpha](https://github.com/instill-ai/console/compare/v0.6.3-alpha...v0.7.0-alpha) (2022-08-01)

### Features

- set default value for Airbyte form ([#202](https://github.com/instill-ai/console/issues/202)) ([82d352a](https://github.com/instill-ai/console/commit/82d352aba3b7b5bc43f27efdd520774813064a9c))

### Bug Fixes

- fix hostname issue ([#201](https://github.com/instill-ai/console/issues/201)) ([4a8f196](https://github.com/instill-ai/console/commit/4a8f1960cf61d7aa84c21b2f5ac381ceb219c586))
- fix model table's instance icon ([#196](https://github.com/instill-ai/console/issues/196)) ([e521d97](https://github.com/instill-ai/console/commit/e521d97955bb533b523d6d3a4bd3b10e43b205dc))
- fix toggle field issue ([#203](https://github.com/instill-ai/console/issues/203)) ([5959c87](https://github.com/instill-ai/console/commit/5959c8705891e113e37a4b12943e80629ad857d3))
- fix wrong connector state ([#199](https://github.com/instill-ai/console/issues/199)) ([9df6d64](https://github.com/instill-ai/console/commit/9df6d646a1ea6421c0156eebbb3f2d43e3f9c591))
- remove default scroll behavior of number input field ([#200](https://github.com/instill-ai/console/issues/200)) ([376e1bd](https://github.com/instill-ai/console/commit/376e1bdd3637a671478d0121d7ef5354bf243f79))

## [0.6.3-alpha](https://github.com/instill-ai/console/compare/v0.6.2-alpha...v0.6.3-alpha) (2022-07-29)

### Bug Fixes

- fix can't correctly create Airbyte destination ([#185](https://github.com/instill-ai/console/issues/185)) ([732844d](https://github.com/instill-ai/console/commit/732844d8c47f355f5e807a6fd08f5ad558a690cf))
- fix destination cache not remove and create http & grpc issue ([#184](https://github.com/instill-ai/console/issues/184)) ([8c35d95](https://github.com/instill-ai/console/commit/8c35d9590cb029ca18287d33b68cde77f99b122e))
- fix onboarding form ([#182](https://github.com/instill-ai/console/issues/182)) ([a944e1d](https://github.com/instill-ai/console/commit/a944e1dc6275ac741f8a376ae6298794b1c89b1d))

## [0.6.2-alpha](https://github.com/instill-ai/console/compare/v0.6.1-alpha...v0.6.2-alpha) (2022-07-22)

### Bug Fixes

- fix ArtiVC model creation issue ([#178](https://github.com/instill-ai/console/issues/178)) ([d8ef4e0](https://github.com/instill-ai/console/commit/d8ef4e0a7d60e936ed75c9c7bd64feb6fe48be05))

## [0.6.1-alpha](https://github.com/instill-ai/console/compare/v0.6.0-alpha...v0.6.1-alpha) (2022-07-20)

### Bug Fixes

- fix get pipeline bug on model page ([#174](https://github.com/instill-ai/console/issues/174)) ([5e8116d](https://github.com/instill-ai/console/commit/5e8116d98f4a80fa9f22cfa87c9238616700aa3f))

## [0.6.0-alpha](https://github.com/instill-ai/console/compare/v0.5.2-alpha...v0.6.0-alpha) (2022-07-15)

### Features

- make email field required at onboarding form ([#169](https://github.com/instill-ai/console/issues/169)) ([1411de7](https://github.com/instill-ai/console/commit/1411de7347ace7b42b5bb0827695779d29a1a214))
- move ga code to PageHead ([#160](https://github.com/instill-ai/console/issues/160)) ([3c49122](https://github.com/instill-ai/console/commit/3c49122e8d51b0ecab11e3d73ab502470c96180a))
- update sidebar design ([#167](https://github.com/instill-ai/console/issues/167)) ([d8899f5](https://github.com/instill-ai/console/commit/d8899f509eed1255fe8ff1ba2cbf7360e6665875))
- update TextField props and remove props that have default ([#164](https://github.com/instill-ai/console/issues/164)) ([7d2a8b6](https://github.com/instill-ai/console/commit/7d2a8b6cca8edde6ed270cff175ef7b267fb351b))

### Bug Fixes

- fix action issue ([#172](https://github.com/instill-ai/console/issues/172)) ([c02e4ad](https://github.com/instill-ai/console/commit/c02e4ad6b272d822d9f6a5a02b19f261a3c36fcd))
- fix Airbyte nested form validation issue ([#171](https://github.com/instill-ai/console/issues/171)) ([1101acc](https://github.com/instill-ai/console/commit/1101accb680d07a210eaa283cdf35dc0e6ec5e64))
- fix description field is duplicated when create pipeline ([#165](https://github.com/instill-ai/console/issues/165)) ([7ef7b1a](https://github.com/instill-ai/console/commit/7ef7b1a023d36983488c8a963bd47493342bb700))

## [0.5.2-alpha](https://github.com/instill-ai/console/compare/v0.5.1-alpha...v0.5.2-alpha) (2022-07-13)

### Bug Fixes

- fix env variables issue ([#157](https://github.com/instill-ai/console/issues/157)) ([58e2bb1](https://github.com/instill-ai/console/commit/58e2bb1789e6cde3d252d8d5dc9afcb2581a0ae7))

## [0.5.1-alpha](https://github.com/instill-ai/console/compare/v0.5.0-alpha...v0.5.1-alpha) (2022-07-13)

### Bug Fixes

- fix delete resource issue ([#155](https://github.com/instill-ai/console/issues/155)) ([6b79630](https://github.com/instill-ai/console/commit/6b79630c19952c53622098a072eab5b290133325))

## [0.5.0-alpha](https://github.com/instill-ai/console/compare/v0.4.0-alpha...v0.5.0-alpha) (2022-07-12)

### Features

- add additional tracking attribute ([#142](https://github.com/instill-ai/console/issues/142)) ([451d830](https://github.com/instill-ai/console/commit/451d8305887de928333dfa308d62cc47aa2624e0))
- add ga ([#147](https://github.com/instill-ai/console/issues/147)) ([2183570](https://github.com/instill-ai/console/commit/2183570d0f91f08ef740fc878348a676d10f8038))
- add hugging face icon at model table ([#152](https://github.com/instill-ai/console/issues/152)) ([5f50328](https://github.com/instill-ai/console/commit/5f503286d628b279e66026cf169c7fdbb924ed07))
- make description field be a universal optional field when create model ([#151](https://github.com/instill-ai/console/issues/151)) ([f7718a5](https://github.com/instill-ai/console/commit/f7718a5041faa54f3b32443ef98eadfe28927d14))
- make sure readme is correct ([#139](https://github.com/instill-ai/console/issues/139)) ([e5622a8](https://github.com/instill-ai/console/commit/e5622a8692e1ab37ca929d1ca56645ccabeab291))
- set page title ([#146](https://github.com/instill-ai/console/issues/146)) ([f5ecca8](https://github.com/instill-ai/console/commit/f5ecca89e7e21cc6d4be2b91fa643813f8bb636e))
- stop user delete resource on demo website ([#149](https://github.com/instill-ai/console/issues/149)) ([dd68df6](https://github.com/instill-ai/console/commit/dd68df6d7922e483c6b16c381dda8ee6e0b77c10))

### Bug Fixes

- use instill owned icons when interact with instill owned destination ([#150](https://github.com/instill-ai/console/issues/150)) ([d466a09](https://github.com/instill-ai/console/commit/d466a094a3afdff9df4a1e89e448f15460ef1251))

## [0.4.0-alpha](https://github.com/instill-ai/console/compare/v0.3.3-alpha...v0.4.0-alpha) (2022-07-11)

### Features

- add dot notation path setter and getter ([#108](https://github.com/instill-ai/console/issues/108)) ([e31e172](https://github.com/instill-ai/console/commit/e31e172c3c9066092f3eb865e88a8e7d77d6b210))
- add new readme ([#122](https://github.com/instill-ai/console/issues/122)) ([00057c5](https://github.com/instill-ai/console/commit/00057c527efeb813a28eb6aabcdbf5180d39131f))
- add trigger section at configure pipeline form ([#86](https://github.com/instill-ai/console/issues/86)) ([2ca6dee](https://github.com/instill-ai/console/commit/2ca6dee9237bb0d5d4a4fa87f1444951a0a2da41))
- implement Airbyte form and adapt new message box ([#125](https://github.com/instill-ai/console/issues/125)) ([9e061aa](https://github.com/instill-ai/console/commit/9e061aa3019230b38379da479f10b164ebec853f))
- Implement airbyte form builder ([#101](https://github.com/instill-ai/console/issues/101)) ([d39b4a4](https://github.com/instill-ai/console/commit/d39b4a4cd5bb2934df3907bada61ae5a68be08f9))
- Implement delete model service ([#137](https://github.com/instill-ai/console/issues/137)) ([3d10302](https://github.com/instill-ai/console/commit/3d103029422ad94cb4d4d079c37df34a53b368af))
- Implement hugging face definition ([#138](https://github.com/instill-ai/console/issues/138)) ([9415cbe](https://github.com/instill-ai/console/commit/9415cbee3b5b47f83b959fcc168b71e7fe051606))
- Implement model instance readme ([#102](https://github.com/instill-ai/console/issues/102)) ([72f3f4c](https://github.com/instill-ai/console/commit/72f3f4c45c418e3f66ed19d7422d2098d185f1bb))
- Implement resource tab ([#128](https://github.com/instill-ai/console/issues/128)) ([b2bf64d](https://github.com/instill-ai/console/commit/b2bf64db43500e0847c36ad6c6e3353418a530ed))
- recursive request destination definition ([#115](https://github.com/instill-ai/console/issues/115)) ([923ed69](https://github.com/instill-ai/console/commit/923ed69bf2b8f07bf6bb45f10187d712467488e9))
- stop user from testing model instance if it is offline ([#88](https://github.com/instill-ai/console/issues/88)) ([b855723](https://github.com/instill-ai/console/commit/b8557236e9368e650c455d5a292e2fa9b2ba5364))

### Bug Fixes

- correctly set cookie ([#105](https://github.com/instill-ai/console/issues/105)) ([175cefc](https://github.com/instill-ai/console/commit/175cefc6e5c4937ffd643665445ca78a314aab7c))
- fix action ([#107](https://github.com/instill-ai/console/issues/107)) ([2df85f3](https://github.com/instill-ai/console/commit/2df85f3c67ad9fbdf105ecb750fbd2a5dac774fe))
- fix model label ([#98](https://github.com/instill-ai/console/issues/98)) ([c5a2d47](https://github.com/instill-ai/console/commit/c5a2d47ddaa4c42dd2630475e6f51da0f124ec59))
- fix toggle field ([#96](https://github.com/instill-ai/console/issues/96)) ([8abf4af](https://github.com/instill-ai/console/commit/8abf4affc917200f1f662144065bd582f5ee081f))
- fix toggle model will cause re-order model instance dropdown issue ([#99](https://github.com/instill-ai/console/issues/99)) ([fe38860](https://github.com/instill-ai/console/commit/fe38860f66004a90e8e5e886c5c43b9c9c3bb01a))
- fix typo ([#104](https://github.com/instill-ai/console/issues/104)) ([fe54ae6](https://github.com/instill-ai/console/commit/fe54ae64916706ba4ff88245963e86bf809b807f))
- fix typo ([#123](https://github.com/instill-ai/console/issues/123)) ([eb43b32](https://github.com/instill-ai/console/commit/eb43b32e801bdf862e4ced3955e69b1a2cc581fc))

## [0.3.3-alpha](https://github.com/instill-ai/console/compare/v0.3.2-alpha...v0.3.3-alpha) (2022-06-30)

### Bug Fixes

- fix condition issue when installing deps at image action ([#84](https://github.com/instill-ai/console/issues/84)) ([03b32b9](https://github.com/instill-ai/console/commit/03b32b9c63e7620d28a671aefdd9fee7b22e1ab0))

## [0.3.2-alpha](https://github.com/instill-ai/console/compare/v0.3.1-alpha...v0.3.2-alpha) (2022-06-30)

### Bug Fixes

- fix not setup node env and deps issue at image action ([56ec66d](https://github.com/instill-ai/console/commit/56ec66d3af36f9e53e177de623f390aa369f37be))
- fix version ([#83](https://github.com/instill-ai/console/issues/83)) ([66abfc9](https://github.com/instill-ai/console/commit/66abfc9bee82180f34d2a1163a85f3f84c074887))

## [0.3.1-alpha](https://github.com/instill-ai/console/compare/v0.3.0-alpha...v0.3.1-alpha) (2022-06-30)

### Bug Fixes

- fix release github action error ([#78](https://github.com/instill-ai/console/issues/78)) ([4bec7e5](https://github.com/instill-ai/console/commit/4bec7e52cedd86cf1b87133c4488382019b8732b))

## [0.3.0-alpha](https://github.com/instill-ai/console/compare/v0.2.0-alpha...v0.3.0-alpha) (2022-06-30)

### Features

- add ModelInstanceReadmeCard ([#76](https://github.com/instill-ai/console/issues/76)) ([28d3927](https://github.com/instill-ai/console/commit/28d3927e256edb27d4dc5bcb51109efe4b069f05))
- add script to download airbyte's icons ([#66](https://github.com/instill-ai/console/issues/66)) ([96dd22e](https://github.com/instill-ai/console/commit/96dd22e69fd4c2d7054092dc4c4ebc7c7add1ffb))
- support ArtiVC ([#64](https://github.com/instill-ai/console/issues/64)) ([1f1fd11](https://github.com/instill-ai/console/commit/1f1fd11320997572f89677308408302fc47516be))

### Bug Fixes

- fix env var injection ([#74](https://github.com/instill-ai/console/issues/74)) ([8c37895](https://github.com/instill-ai/console/commit/8c3789521c2591fb7b777f5d0c458ddaa02e6dba))
- fix missing title and typo when deploy model instance ([#75](https://github.com/instill-ai/console/issues/75)) ([33e01b9](https://github.com/instill-ai/console/commit/33e01b911bdcdf5bbc5de7257e5900c21d6e79f2))
- fix model instance task parsing issue ([#77](https://github.com/instill-ai/console/issues/77)) ([bac5eb0](https://github.com/instill-ai/console/commit/bac5eb0afa7b75583d4045504a21047309f7246a))
- fix sidebar style ([#68](https://github.com/instill-ai/console/issues/68)) ([63d2463](https://github.com/instill-ai/console/commit/63d24632de34818700737d87d75654f37d094fe0))

## [0.2.0-alpha](https://github.com/instill-ai/console/compare/v0.1.0-alpha...v0.2.0-alpha) (2022-06-28)

### Features

- let user add backend related env with docker-compose environment ([#62](https://github.com/instill-ai/console/issues/62)) ([507534a](https://github.com/instill-ai/console/commit/507534a7d68b4ccc02f9c930fe230610abe23ca9))

### Bug Fixes

- fix create model form error ([#61](https://github.com/instill-ai/console/issues/61)) ([392ee23](https://github.com/instill-ai/console/commit/392ee2315c7037ac69bce12a122b811990c57954))
- fix various UI issue related to form ([#56](https://github.com/instill-ai/console/issues/56)) ([482cabf](https://github.com/instill-ai/console/commit/482cabf4ccf5731c2d40aa7c9f8f879f71a0ad68))

## [0.1.0-alpha](https://github.com/instill-ai/console/compare/v0.2.0-alpha...v0.1.0-alpha) (2022-06-26)

### Features

- add ArtiVC Icon for model definition ([#18](https://github.com/instill-ai/console/issues/18)) ([b5250db](https://github.com/instill-ai/console/commit/b5250db5bbb2cabe68865d39abe9f8c3642e352b))
- add delete connector, pipeline service ([#9](https://github.com/instill-ai/console/issues/9)) ([526ff70](https://github.com/instill-ai/console/commit/526ff70aa8b1bd8904bb25635480b663ae4c1674))
- add DISABLE_USAGE_COLLECTION args config ([#45](https://github.com/instill-ai/console/issues/45)) ([7f9352d](https://github.com/instill-ai/console/commit/7f9352d30f21f7496e3772c78f3b3f4eda0815a2))
- add GitHub action related to docker hub ([#11](https://github.com/instill-ai/console/issues/11)) ([5e7569a](https://github.com/instill-ai/console/commit/5e7569a1e92bd911976404fdbbfec0d125685cb9))
- add mock server and render method of react-query ([#12](https://github.com/instill-ai/console/issues/12)) ([80d89d7](https://github.com/instill-ai/console/commit/80d89d7020e7e0181df2731b85cbcd64c6fe6763))
- add mock source service handler ([#13](https://github.com/instill-ai/console/issues/13)) ([21ea1ee](https://github.com/instill-ai/console/commit/21ea1ee7fb59d72892f0a619f624a339b44073b7))
- add onboarding e2e test ([#20](https://github.com/instill-ai/console/issues/20)) ([c952b73](https://github.com/instill-ai/console/commit/c952b73e5d1547fa7e19b2379f07306172795b17))
- add pipeline e2e test ([#44](https://github.com/instill-ai/console/issues/44)) ([0acc846](https://github.com/instill-ai/console/commit/0acc8466ffcb8f0741ea71830b81585462c3786a))
- add playwright ([#14](https://github.com/instill-ai/console/issues/14)) ([01beb24](https://github.com/instill-ai/console/commit/01beb248b9edb5fa2ca6ba9941721f47cba382d2))
- add project docker-compose ([#2](https://github.com/instill-ai/console/issues/2)) ([14ab822](https://github.com/instill-ai/console/commit/14ab8227c3e42f30dbd034e286117009e588d2d4))
- add release please action ([#21](https://github.com/instill-ai/console/issues/21)) ([2321bab](https://github.com/instill-ai/console/commit/2321babbfcb8a78caf83228434e22966a8a7cdf4))
- add tailwind plugin to support intelligence picking up custom style and refactor classnames ([#16](https://github.com/instill-ai/console/issues/16)) ([62d853f](https://github.com/instill-ai/console/commit/62d853fc19abbed6dcc06d831bc665212d495812))
- add test model instance service ([#15](https://github.com/instill-ai/console/issues/15)) ([a367577](https://github.com/instill-ai/console/commit/a367577748ce0a032100a233b90c088e00824315))
- add unit-test action ([#17](https://github.com/instill-ai/console/issues/17)) ([d57d265](https://github.com/instill-ai/console/commit/d57d2651a450c3d712a95c9d2c6464ee204bba30))
- implement statefull toggle and adapt new prop ([#49](https://github.com/instill-ai/console/issues/49)) ([9358247](https://github.com/instill-ai/console/commit/935824717e591dd936a8e6f72ee6f5d4cb50c0bd))
- make sidebar collapsable ([#8](https://github.com/instill-ai/console/issues/8)) ([ecf8cd3](https://github.com/instill-ai/console/commit/ecf8cd3f14d507cf0ee4c0904f732f69b0401213))

### Bug Fixes

- fix changelog ([#52](https://github.com/instill-ai/console/issues/52)) ([41cc974](https://github.com/instill-ai/console/commit/41cc974c96339a8a2e743472fb13c8726cab7a50))
- fix commit history ([376e65c](https://github.com/instill-ai/console/commit/376e65cc94051f2c0521b1073755eb564864d368))
- fix hooks deps issue ([#50](https://github.com/instill-ai/console/issues/50)) ([e50bffb](https://github.com/instill-ai/console/commit/e50bffb92986a5b1b2d421df33b1ee3d5a42adcc))
- fix selected option issue at SetupPipelineModeStep ([#19](https://github.com/instill-ai/console/issues/19)) ([5a01c56](https://github.com/instill-ai/console/commit/5a01c562f8ea786e099f9941e3e4b317503ce9b5))
- fix setup model step issue ([#7](https://github.com/instill-ai/console/issues/7)) ([c5a4222](https://github.com/instill-ai/console/commit/c5a42221640b0f767df8bd26c8921e34719970a3))

### Miscellaneous Chores

- release 0.1.0-alpha ([1fc7bba](https://github.com/instill-ai/console/commit/1fc7bba663ca1a5a5c2934e1545efffd8fc0fefd))

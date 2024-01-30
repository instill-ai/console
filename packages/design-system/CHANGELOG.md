# @instill-ai/design-system

## [0.63.0](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.62.0...@instill-ai/design-system-v0.63.0) (2024-01-30)


### Features

* **pipeline-builder:** add reference hint at the start operator ([#902](https://github.com/instill-ai/console/issues/902)) ([d87de86](https://github.com/instill-ai/console/commit/d87de86845e385465279e995e78c9c4bb4d0d3c0))
* **pipeline-builder:** hide edit/delete button of start input into dropdown ([#910](https://github.com/instill-ai/console/issues/910)) ([bf0bfa7](https://github.com/instill-ai/console/commit/bf0bfa76de2c8e5d62a123f1cfa0c21deff36a7d))

## [0.62.0](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.61.1...@instill-ai/design-system-v0.62.0) (2024-01-24)


### Features

* implement the unit test for nested auto gen form ([#896](https://github.com/instill-ai/console/issues/896)) ([51c4630](https://github.com/instill-ai/console/commit/51c46305e93372ae652e38eda0fed82545afc714))
* setup the react testing library for auto-gen-form unit test ([#895](https://github.com/instill-ai/console/issues/895)) ([b3947b7](https://github.com/instill-ai/console/commit/b3947b75a3fc7d52d9b2d9e90210232ca6c96d98))


### Bug Fixes

* Typo in component configuration ([#889](https://github.com/instill-ai/console/issues/889)) ([ec55621](https://github.com/instill-ai/console/commit/ec55621c30e9848c33155d52d9ade52c29ad94c2))

## [0.61.1](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.61.0...@instill-ai/design-system-v0.61.1) (2024-01-15)


### Miscellaneous

* make creating private pipeline as default option ([#859](https://github.com/instill-ai/console/issues/859)) ([e078b57](https://github.com/instill-ai/console/commit/e078b5724f11adb168178ccf5a407db85aa52eb5))

## [0.61.0](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.60.0...@instill-ai/design-system-v0.61.0) (2024-01-02)


### Features

* **auto-gen-form:** support the action of merging Airbyte connectors into single one ([#835](https://github.com/instill-ai/console/issues/835)) ([64e3a69](https://github.com/instill-ai/console/commit/64e3a699737b23a1a92dbe5a27b4b7e6edb53c71))


### Bug Fixes

* fix model icons are not correct or missing issue ([#822](https://github.com/instill-ai/console/issues/822)) ([0b3d2ad](https://github.com/instill-ai/console/commit/0b3d2ad3db52e70ee0a870a552e0a5abdbafa643))


### Miscellaneous

* apply prettier format and reject formatting errors in PRs ([#818](https://github.com/instill-ai/console/issues/818)) ([fa5c3b3](https://github.com/instill-ai/console/commit/fa5c3b362dfac92291926c0e9020bb53c8c10ddc))

## [0.60.0](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.59.0...@instill-ai/design-system-v0.60.0) (2023-12-22)

### Features

- **pipeline-builder:** support JSON input on start operator ([#808](https://github.com/instill-ai/console/issues/808)) ([57c2c81](https://github.com/instill-ai/console/commit/57c2c8159206cd4f839401fba0ad1d28bf667ee3))

### Bug Fixes

- fix delete resource dialog close button wrongly positioned ([#809](https://github.com/instill-ai/console/issues/809)) ([73414a1](https://github.com/instill-ai/console/commit/73414a1f02f177236d4048cb5dce83cdff61bc94))
- fix TASK_VISUAL_QUESTION_ANSWERING model task typo ([#803](https://github.com/instill-ai/console/issues/803)) ([7a87735](https://github.com/instill-ai/console/commit/7a8773512c60e0678a75cbec1796777f00b12606))

### Miscellaneous

- **general:** replace model URL path with models ([#802](https://github.com/instill-ai/console/issues/802)) ([e640470](https://github.com/instill-ai/console/commit/e6404706305c113d43ed56f15f1c2498d7adfd8c))

## [0.59.0](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.58.0...@instill-ai/design-system-v0.59.0) (2023-12-15)

### Features

- adapt new permission rule from backend ([#796](https://github.com/instill-ai/console/issues/796)) ([fa3d57b](https://github.com/instill-ai/console/commit/fa3d57b7e35f0e3ae60763bc912c90efed7dae81))
- **design-system:** add MultiSelect component ([#763](https://github.com/instill-ai/console/issues/763)) ([3229af9](https://github.com/instill-ai/console/commit/3229af993a8e41bde38c9134a758471158fd7b3e))
- **design-system:** add RadioGroup component ([#771](https://github.com/instill-ai/console/issues/771)) ([ca51e45](https://github.com/instill-ai/console/commit/ca51e45086db72a453b2db7310a3f9792ccdee86))
- **design-system:** add TabMenu component ([#764](https://github.com/instill-ai/console/issues/764)) ([1de671f](https://github.com/instill-ai/console/commit/1de671febeffe3a6a84a55837d8ed0d455913592))
- **general:** Adapt new backend API version ([#773](https://github.com/instill-ai/console/issues/773)) ([a7dbb41](https://github.com/instill-ai/console/commit/a7dbb416c9db67778dc40e94fa27d19a8a4d9e09))
- **hub:** User can have new pipeline page to display various information ([#762](https://github.com/instill-ai/console/issues/762)) ([2412830](https://github.com/instill-ai/console/commit/241283051fe0a14224288d7efdc17aa063208de8))
- **organization:** organization teams user profile dev screens ([#743](https://github.com/instill-ai/console/issues/743)) ([786ad86](https://github.com/instill-ai/console/commit/786ad861d01dc1948d6f2d068aae8f51bec84468))
- **pipeline-builder:** User can have new advanced pipeline creation dialog ([#792](https://github.com/instill-ai/console/issues/792)) ([931bec3](https://github.com/instill-ai/console/commit/931bec38b4a63c6bcb02d7ae5fbfd3ed95fd1d68))
- **pipeline-builder:** User can publish their pipeline to the hub ([#770](https://github.com/instill-ai/console/issues/770)) ([0ce35d2](https://github.com/instill-ai/console/commit/0ce35d2c6be45a684622b6bedb0a96dfe15202fb))
- User can browse other's pipelines on hub page ([#780](https://github.com/instill-ai/console/issues/780)) ([592fb51](https://github.com/instill-ai/console/commit/592fb51d180c6075ea705905aa8eeeef9dc754aa))

### Bug Fixes

- fix wrongly used entity issue ([#793](https://github.com/instill-ai/console/issues/793)) ([9238797](https://github.com/instill-ai/console/commit/9238797f264efca2dbe9645b59c46484d59bce84))
- **general:** fix not correctly create pipeline for organization ([#791](https://github.com/instill-ai/console/issues/791)) ([d52d395](https://github.com/instill-ai/console/commit/d52d3959599b108be4eb3febb226f1da482fee56))
- **sdk:** Fix organization related types ([#765](https://github.com/instill-ai/console/issues/765)) ([9ea1293](https://github.com/instill-ai/console/commit/9ea1293e54db17cf40ed57c54d5b877c7bc84811))

### Miscellaneous

- add visa icon ([#760](https://github.com/instill-ai/console/issues/760)) ([cc2be0c](https://github.com/instill-ai/console/commit/cc2be0ceda47043da063ad74dbb85384261ef566))
- **design-system:** add user plus icon ([#768](https://github.com/instill-ai/console/issues/768)) ([5b5bf88](https://github.com/instill-ai/console/commit/5b5bf88a0b464569fafaaf7113d62cdc434c4775))

## [0.58.0](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.57.0...@instill-ai/design-system-v0.58.0) (2023-11-28)

### Features

- adapt new connectors breaking changes, replace connector-resources with connectors ([#725](https://github.com/instill-ai/console/issues/725)) ([1393a8b](https://github.com/instill-ai/console/commit/1393a8bc6a3e4a59972acf30c32ab20670d84f3c))
- add AlignLeft and ImagePlus icon ([279011c](https://github.com/instill-ai/console/commit/279011c525a3e3150177ab9f8bfd34b23c979142))
- **design-system:** add Menubar ([#737](https://github.com/instill-ai/console/issues/737)) ([09ce082](https://github.com/instill-ai/console/commit/09ce082b03c61b49262bec6291ca301943e9627d))
- **design-system:** add Progress component ([#709](https://github.com/instill-ai/console/issues/709)) ([5028e25](https://github.com/instill-ai/console/commit/5028e2590e790bf03122013eb0e5f57719a9136b))
- **pipeline-builder:** highlight the node when user select it ([#746](https://github.com/instill-ai/console/issues/746)) ([594ecb3](https://github.com/instill-ai/console/commit/594ecb32f37af29e1a04c0f955417c66cf9ca1b8))
- **pipeline-builder:** user can have a better trigger flow with new pipeline builder control ([#738](https://github.com/instill-ai/console/issues/738)) ([3d5ef4e](https://github.com/instill-ai/console/commit/3d5ef4eb80971228e6cfd81569049064de351df0))
- **pipeline-builder:** User can have the output data displayed in the new Object viewer ([#742](https://github.com/instill-ai/console/issues/742)) ([64b69b7](https://github.com/instill-ai/console/commit/64b69b7774026a00636d88bfb50cc8521ddf236b))

### Bug Fixes

- fix various bugs that will affect UI style and smart hint ([#751](https://github.com/instill-ai/console/issues/751)) ([84f52bb](https://github.com/instill-ai/console/commit/84f52bbd0ce28d7f05f6fa32bf392b7f71cb353a))
- fix wrongly export deps cause console-cloud failed to compile ([#740](https://github.com/instill-ai/console/issues/740)) ([b83b81a](https://github.com/instill-ai/console/commit/b83b81ab62acf6f8421b05ebf8f659d5e54e3629))

### Miscellaneous

- add AlignLeft and ImagePlus icon ([#704](https://github.com/instill-ai/console/issues/704)) ([003c74b](https://github.com/instill-ai/console/commit/003c74b086d0e957329d730369cb20a3f46b151e))
- add DragIcon ([#692](https://github.com/instill-ai/console/issues/692)) ([79ac32f](https://github.com/instill-ai/console/commit/79ac32f9c1f9f509d12953287ce6750b6f830af4))
- add FileMinus01 icon ([#700](https://github.com/instill-ai/console/issues/700)) ([5390ed4](https://github.com/instill-ai/console/commit/5390ed42b8dae1bae5d3e78fd4b275c53b114da7))
- add FilePlus01 icon ([#699](https://github.com/instill-ai/console/issues/699)) ([02de9f9](https://github.com/instill-ai/console/commit/02de9f99acd041d70241ef4b0ca7da442fedb10b))
- add lightning01 icons and expose more props on Switch ([#735](https://github.com/instill-ai/console/issues/735)) ([b135376](https://github.com/instill-ai/console/commit/b1353768ee1b4c7c06aa87881b43e9fc423fb980))
- add PauseCircle and PlayCircle icons ([#727](https://github.com/instill-ai/console/issues/727)) ([0fcf3e1](https://github.com/instill-ai/console/commit/0fcf3e14accf1aea7280669d24b738f407b9fcee))
- add recording-03 icon ([#726](https://github.com/instill-ai/console/issues/726)) ([fa57f26](https://github.com/instill-ai/console/commit/fa57f262f88a237e2ab5be31882f5d875278eee5))
- add start input types icon ([#729](https://github.com/instill-ai/console/issues/729)) ([5cb3d7a](https://github.com/instill-ai/console/commit/5cb3d7a360b6c36f2a48b5a1a1e3f435f3e1f760))
- **design-system:** add Breadcrumb component ([#691](https://github.com/instill-ai/console/issues/691)) ([fced76a](https://github.com/instill-ai/console/commit/fced76ae014c26f3def55d331aadd2135f54d6b3))
- **design-system:** add globe icon ([#715](https://github.com/instill-ai/console/issues/715)) ([69c1c35](https://github.com/instill-ai/console/commit/69c1c3519c0ff230a84b361a0feedbc00a683e13))
- **design-system:** add user icon icon ([#689](https://github.com/instill-ai/console/issues/689)) ([8af572d](https://github.com/instill-ai/console/commit/8af572d9cd5ff1324f3f19feebfb2e4350bc73c1))
- **design-system:** Namananand/ins 2599 create breadcrumb component ([#721](https://github.com/instill-ai/console/issues/721)) ([e375c94](https://github.com/instill-ai/console/commit/e375c941dfd36e75fbd0e44ec3bfd67550867ac3))

## [0.57.0](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.56.0...@instill-ai/design-system-v0.57.0) (2023-11-11)

### Features

- **auto-gen-form:** Support HTML tag (strong, a, code, em) in form field description ([#648](https://github.com/instill-ai/console/issues/648)) ([569ef1c](https://github.com/instill-ai/console/commit/569ef1c4e8f955703c20cf84a87f2d4b3b4ebca7))
- **smart-hint:** add smart hint component and support up-to-date backend syntax ([#655](https://github.com/instill-ai/console/issues/655)) ([c90246d](https://github.com/instill-ai/console/commit/c90246d0c1d57079b2afcf8a6df8f04457819ce9))
- **smart-hint:** user can be hinted by the smart hint system ([#659](https://github.com/instill-ai/console/issues/659)) ([aa6976f](https://github.com/instill-ai/console/commit/aa6976f346a31d9003951ec70e1bbf6854a2f63a))

### Bug Fixes

- **auto-gen-form:** fix auto-gen form not correctly handle re-render issue ([#665](https://github.com/instill-ai/console/issues/665)) ([2363cc4](https://github.com/instill-ai/console/commit/2363cc44e6452f8f8bb5859b12dbc2086d8f1168))

### Miscellaneous

- add DotsHorizontal icon ([#631](https://github.com/instill-ai/console/issues/631)) ([05f2e60](https://github.com/instill-ai/console/commit/05f2e6003cf8e4de478a1b4035c0e38899c99051))
- contributors can better contribute to our frontend project (Simplify repos) ([#599](https://github.com/instill-ai/console/issues/599)) ([75d61bd](https://github.com/instill-ai/console/commit/75d61bdb857d19974d0814f876f886f39bf8bdee))
- **design-system:** add minus icon ([#633](https://github.com/instill-ai/console/issues/633)) ([8919eae](https://github.com/instill-ai/console/commit/8919eae7ddd8d40aaa0d5b9d314e53d0281535d8))
- **design-system:** expose Toast related function return types ([#620](https://github.com/instill-ai/console/issues/620)) ([0b26c2d](https://github.com/instill-ai/console/commit/0b26c2d7fc58f359b6fde97943888ae69e549233))
- fix prettier not correctly initialize ([#636](https://github.com/instill-ai/console/issues/636)) ([f729990](https://github.com/instill-ai/console/commit/f7299908ae5ef1135afee05719891da84ddc58e8))
- release main ([#609](https://github.com/instill-ai/console/issues/609)) ([74d9fef](https://github.com/instill-ai/console/commit/74d9fef738867308a54dbd43ba201c31eb9bfed5))
- release main ([#642](https://github.com/instill-ai/console/issues/642)) ([b78fb4f](https://github.com/instill-ai/console/commit/b78fb4f0be1c959e70ababdaa20e7d513c91eb68))
- release main ([#645](https://github.com/instill-ai/console/issues/645)) ([66f9f3b](https://github.com/instill-ai/console/commit/66f9f3b6114ce754a1fe735c390fb7109b567f68))
- replace &lt;&gt;</> with <React.Fragment> ([#662](https://github.com/instill-ai/console/issues/662)) ([5ec2a71](https://github.com/instill-ai/console/commit/5ec2a71cf99bd03f160075ed0f392c31cddabe76))

## [0.56.0](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.55.9...@instill-ai/design-system-v0.56.0) (2023-11-10)

### Features

- **auto-gen-form:** Support HTML tag (strong, a, code, em) in form field description ([#648](https://github.com/instill-ai/console/issues/648)) ([569ef1c](https://github.com/instill-ai/console/commit/569ef1c4e8f955703c20cf84a87f2d4b3b4ebca7))
- **smart-hint:** add smart hint component and support up-to-date backend syntax ([#655](https://github.com/instill-ai/console/issues/655)) ([c90246d](https://github.com/instill-ai/console/commit/c90246d0c1d57079b2afcf8a6df8f04457819ce9))
- **smart-hint:** user can be hinted by the smart hint system ([#659](https://github.com/instill-ai/console/issues/659)) ([aa6976f](https://github.com/instill-ai/console/commit/aa6976f346a31d9003951ec70e1bbf6854a2f63a))

### Bug Fixes

- **auto-gen-form:** fix auto-gen form not correctly handle re-render issue ([#665](https://github.com/instill-ai/console/issues/665)) ([2363cc4](https://github.com/instill-ai/console/commit/2363cc44e6452f8f8bb5859b12dbc2086d8f1168))

### Miscellaneous

- replace &lt;&gt;</> with <React.Fragment> ([#662](https://github.com/instill-ai/console/issues/662)) ([5ec2a71](https://github.com/instill-ai/console/commit/5ec2a71cf99bd03f160075ed0f392c31cddabe76))

## [0.55.9](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.55.8...@instill-ai/design-system-v0.55.9) (2023-10-27)

### Miscellaneous

- add DotsHorizontal icon ([#631](https://github.com/instill-ai/console/issues/631)) ([05f2e60](https://github.com/instill-ai/console/commit/05f2e6003cf8e4de478a1b4035c0e38899c99051))
- **design-system:** add minus icon ([#633](https://github.com/instill-ai/console/issues/633)) ([8919eae](https://github.com/instill-ai/console/commit/8919eae7ddd8d40aaa0d5b9d314e53d0281535d8))
- **design-system:** expose Toast related function return types ([#620](https://github.com/instill-ai/console/issues/620)) ([0b26c2d](https://github.com/instill-ai/console/commit/0b26c2d7fc58f359b6fde97943888ae69e549233))
- fix prettier not correctly initialize ([#636](https://github.com/instill-ai/console/issues/636)) ([f729990](https://github.com/instill-ai/console/commit/f7299908ae5ef1135afee05719891da84ddc58e8))

## [0.55.8](https://github.com/instill-ai/console/compare/@instill-ai/design-system-v0.55.7...@instill-ai/design-system-v0.55.8) (2023-10-20)

### Miscellaneous

- contributors can better contribute to our frontend project (Simplify repos) ([#599](https://github.com/instill-ai/console/issues/599)) ([75d61bd](https://github.com/instill-ai/console/commit/75d61bdb857d19974d0814f876f886f39bf8bdee))

## [0.55.7](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.55.6...@instill-ai/design-system-v0.55.7) (2023-10-13)

### Miscellaneous

- **design-system:** add story about how to build the autoresize input ([#947](https://github.com/instill-ai/cortex/issues/947)) ([c0c3e2d](https://github.com/instill-ai/cortex/commit/c0c3e2d788a9c9b424d35b015d1e418e1b4577ce))

## [0.55.6](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.55.5...@instill-ai/design-system-v0.55.6) (2023-10-10)

### Bug Fixes

- **design-system:** fix DropdownMenu syntax and style not align with design doc ([#943](https://github.com/instill-ai/cortex/issues/943)) ([553f8f9](https://github.com/instill-ai/cortex/commit/553f8f9bba60d9ddafbd8663acbae01c0a13d7fc))

## [0.55.5](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.55.4...@instill-ai/design-system-v0.55.5) (2023-10-09)

### Miscellaneous

- **design-system:** add DotsVertical icon ([#941](https://github.com/instill-ai/cortex/issues/941)) ([242dee0](https://github.com/instill-ai/cortex/commit/242dee09b64d9040387efd14170fd3080a2069be))

## [0.55.4](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.55.3...@instill-ai/design-system-v0.55.4) (2023-10-05)

### Miscellaneous

- **design-system:** add &lt;Label /&gt; component to design system ([#939](https://github.com/instill-ai/cortex/issues/939)) ([12c98cd](https://github.com/instill-ai/cortex/commit/12c98cd68cd8ae0f834913e36304510cbf0a3eac))

## [0.55.3](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.55.2...@instill-ai/design-system-v0.55.3) (2023-09-29)

### Miscellaneous

- **design-system:** add icons and update button success ([#918](https://github.com/instill-ai/cortex/issues/918)) ([492553c](https://github.com/instill-ai/cortex/commit/492553c76c536bf29c8f9352f04e3fa450770ad4))

## [0.55.2](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.55.1...@instill-ai/design-system-v0.55.2) (2023-09-28)

### Miscellaneous

- add icons ([#909](https://github.com/instill-ai/cortex/issues/909)) ([087dd7f](https://github.com/instill-ai/cortex/commit/087dd7f5e894f1e6ade386b04f84a458809a15e1))
- remove the initial style of Tabs ([#913](https://github.com/instill-ai/cortex/issues/913)) ([ce78c44](https://github.com/instill-ai/cortex/commit/ce78c4404a1d3a97764ea539ac88afabb61014e8))

## [0.55.1](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.55.0...@instill-ai/design-system-v0.55.1) (2023-09-27)

### Bug Fixes

- **design-system:** expose the classname of Dialog.Close ([#906](https://github.com/instill-ai/cortex/issues/906)) ([5fcf358](https://github.com/instill-ai/cortex/commit/5fcf358fb365c7fb77f512225b5271bc62bea0e5))

## [0.55.0](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.54.0...@instill-ai/design-system-v0.55.0) (2023-09-27)

### Features

- **design-system:** add Link icon ([#902](https://github.com/instill-ai/cortex/issues/902)) ([fb41dc2](https://github.com/instill-ai/cortex/commit/fb41dc2f419718b95d2751badcc1cdd685f6c6e8))

## [0.54.0](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.53.3...@instill-ai/design-system-v0.54.0) (2023-09-27)

### Features

- **design-system:** add lock related icons ([#900](https://github.com/instill-ai/cortex/issues/900)) ([c2b8e51](https://github.com/instill-ai/cortex/commit/c2b8e51f50a03c6653a91240a5e4665f86eec8ae))

## [0.53.3](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.53.2...@instill-ai/design-system-v0.53.3) (2023-09-26)

### Miscellaneous

- **design-system:** expose additional classname in CommandDialog ([#897](https://github.com/instill-ai/cortex/issues/897)) ([5f96632](https://github.com/instill-ai/cortex/commit/5f9663229d6da1d7c9283fc9a39a6c5e78f0e0ba))

## [0.53.2](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.53.1...@instill-ai/design-system-v0.53.2) (2023-09-26)

### Miscellaneous

- **design-system:** increase the limit of DialogContent ([#895](https://github.com/instill-ai/cortex/issues/895)) ([b1f33a6](https://github.com/instill-ai/cortex/commit/b1f33a69300f802a9f2a61611aa3f2fa6238ccf6))

## [0.53.1](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.53.0...@instill-ai/design-system-v0.53.1) (2023-09-26)

### Bug Fixes

- **design-system:** fix command style ([#893](https://github.com/instill-ai/cortex/issues/893)) ([3e9c92b](https://github.com/instill-ai/cortex/commit/3e9c92bddade3702c22f10d9e93b94c42f464735))

## [0.53.0](https://github.com/instill-ai/cortex/compare/@instill-ai/design-system-v0.52.0...@instill-ai/design-system-v0.53.0) (2023-09-25)

### Features

- **design-system:** add copy07 icon ([#889](https://github.com/instill-ai/cortex/issues/889)) ([742704f](https://github.com/instill-ai/cortex/commit/742704f8173c9e98a98f10cf1c0c0dc0afddf2c4))

## [0.52.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.51.0...@instill-ai/design-system-v0.52.0) (2023-09-20)

### Features

- **design-system:** add ScrollArea ([#871](https://github.com/instill-ai/design-system/issues/871)) ([50a324d](https://github.com/instill-ai/design-system/commit/50a324d5f481f0b20c265eeb80c7b8e4421e1e17))

## [0.51.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.50.0...@instill-ai/design-system-v0.51.0) (2023-09-20)

### Features

- add copy06 icon and fix Tabs overflow issue ([#869](https://github.com/instill-ai/design-system/issues/869)) ([64ecf11](https://github.com/instill-ai/design-system/commit/64ecf11df830bdba6536e346023225d3c7763a0e))

## [0.50.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.49.1...@instill-ai/design-system-v0.50.0) (2023-09-20)

### Features

- **design-system:** add Tabs component ([#864](https://github.com/instill-ai/design-system/issues/864)) ([3180283](https://github.com/instill-ai/design-system/commit/318028392cbfc0358794ec9c7e2bb26577e9202c))

### Bug Fixes

- fix lint issue in the design-system ([#867](https://github.com/instill-ai/design-system/issues/867)) ([820de08](https://github.com/instill-ai/design-system/commit/820de08bacb464992b9057f6919352f88525893e))

## [0.49.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.49.0...@instill-ai/design-system-v0.49.1) (2023-09-17)

### Bug Fixes

- fix popover style ([#858](https://github.com/instill-ai/design-system/issues/858)) ([8180b68](https://github.com/instill-ai/design-system/commit/8180b68397734526bbb9638253e71c13bcd53cb5))

## [0.49.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.48.0...@instill-ai/design-system-v0.49.0) (2023-09-13)

### Features

- component centric revamp ([#849](https://github.com/instill-ai/design-system/issues/849)) ([ec5925c](https://github.com/instill-ai/design-system/commit/ec5925c80a8a94376cebe24a1bdb22ba888e271b))

## [0.48.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.47.4...@instill-ai/design-system-v0.48.0) (2023-09-09)

### Features

- add doc icon and change display name of complicated icon ([#847](https://github.com/instill-ai/design-system/issues/847)) ([f801b31](https://github.com/instill-ai/design-system/commit/f801b31df4652033429c70cc37b440d7fd9f5f2b))

## [0.47.4](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.47.3...@instill-ai/design-system-v0.47.4) (2023-09-07)

### Bug Fixes

- **design-system:** namananand/ins 1752 update google icon to design system ([#845](https://github.com/instill-ai/design-system/issues/845)) ([02a5feb](https://github.com/instill-ai/design-system/commit/02a5feb87ef2afcc7e896bbb6a5237242923c99a))

## [0.47.3](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.47.2...@instill-ai/design-system-v0.47.3) (2023-09-06)

### Miscellaneous

- **design-system:** add google icon ([#843](https://github.com/instill-ai/design-system/issues/843)) ([0710a2e](https://github.com/instill-ai/design-system/commit/0710a2e75a855a1f1bb064ab310a76ad6781da6f))

## [0.47.2](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.47.1...@instill-ai/design-system-v0.47.2) (2023-09-05)

### Miscellaneous

- add code browser icon ([#841](https://github.com/instill-ai/design-system/issues/841)) ([d0055bc](https://github.com/instill-ai/design-system/commit/d0055bcaeda405300b4824c9aa8abbc00abd4751))

## [0.47.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.47.0...@instill-ai/design-system-v0.47.1) (2023-09-04)

### Miscellaneous

- **design-system:** update twitter icon ([#839](https://github.com/instill-ai/design-system/issues/839)) ([33be54f](https://github.com/instill-ai/design-system/commit/33be54f041668d6137336be17724e65ff620a29d))

## [0.47.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.46.1...@instill-ai/design-system-v0.47.0) (2023-08-31)

### Features

- **design-system:** add new twitter icon to design system ([#837](https://github.com/instill-ai/design-system/issues/837)) ([3bf4ad0](https://github.com/instill-ai/design-system/commit/3bf4ad098d2118c6a7dbf5c17914e873710a2fe3))

## [0.46.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.46.0...@instill-ai/design-system-v0.46.1) (2023-08-30)

### Miscellaneous

- **design-system:** add twitter icon ([#835](https://github.com/instill-ai/design-system/issues/835)) ([918a5e8](https://github.com/instill-ai/design-system/commit/918a5e851654eea08d851ec663127b2f5080de26))

## [0.46.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.45.0...@instill-ai/design-system-v0.46.0) (2023-08-30)

### Features

- add Upload01 Icon ([5128d60](https://github.com/instill-ai/design-system/commit/5128d60dda0a8f1425a250d4702e3e3322e8b128))

## [0.45.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.44.1...@instill-ai/design-system-v0.45.0) (2023-08-29)

### Features

- Add intersect Square Icon ([#832](https://github.com/instill-ai/design-system/issues/832)) ([5247015](https://github.com/instill-ai/design-system/commit/524701518ff17053bf82f24af04839512e9d8ce1))

## [0.44.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.44.0...@instill-ai/design-system-v0.44.1) (2023-08-28)

### Bug Fixes

- **design-system:** namananand/ins 1614 add instill logo to design system ([#829](https://github.com/instill-ai/design-system/issues/829)) ([f4208b8](https://github.com/instill-ai/design-system/commit/f4208b825543f3dde4a5c2d85b07232051f36c7b))

### Miscellaneous

- **design-system:** update dropdown separator bg-color ([#831](https://github.com/instill-ai/design-system/issues/831)) ([17289f1](https://github.com/instill-ai/design-system/commit/17289f12b98da6d29c189187e1cbedc1c1d4ccc7))

## [0.44.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.43.0...@instill-ai/design-system-v0.44.0) (2023-08-25)

### Features

- **design-system:** add ArrowUpRight icon ([#828](https://github.com/instill-ai/design-system/issues/828)) ([3c49981](https://github.com/instill-ai/design-system/commit/3c49981845ddbf74b222965d5ac3c7e52ab7a975))
- **design-system:** add Menu icon ([#826](https://github.com/instill-ai/design-system/issues/826)) ([3c2d868](https://github.com/instill-ai/design-system/commit/3c2d8688263a417504be36575a377b728e69cc36))

## [0.43.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.42.0...@instill-ai/design-system-v0.43.0) (2023-08-25)

### Features

- **design-system:** add dropdown component ([#823](https://github.com/instill-ai/design-system/issues/823)) ([9e7b512](https://github.com/instill-ai/design-system/commit/9e7b5129989f1d519a4fe9a70c5d1d95e42578a0))

## [0.42.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.41.0...@instill-ai/design-system-v0.42.0) (2023-08-24)

### Features

- **design-system:** add instill square icon ([#821](https://github.com/instill-ai/design-system/issues/821)) ([cd85dc5](https://github.com/instill-ai/design-system/commit/cd85dc509e0081b8a8495b8ae637ce449206629d))

## [0.41.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.40.2...@instill-ai/design-system-v0.41.0) (2023-08-17)

### Features

- add Edit03 icon ([#812](https://github.com/instill-ai/design-system/issues/812)) ([781adcf](https://github.com/instill-ai/design-system/commit/781adcf92f4b70ef4d969bdfbfb4906c24ed88c0))

## [0.40.2](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.40.1...@instill-ai/design-system-v0.40.2) (2023-08-15)

### Bug Fixes

- **design-system:** update combobox item ([#808](https://github.com/instill-ai/design-system/issues/808)) ([ca44c5f](https://github.com/instill-ai/design-system/commit/ca44c5f80f734592aecbda5364ff64182e1ed09b))

## [0.40.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.40.0...@instill-ai/design-system-v0.40.1) (2023-08-15)

### Bug Fixes

- **design-system:** combobox update ([#806](https://github.com/instill-ai/design-system/issues/806)) ([073954b](https://github.com/instill-ai/design-system/commit/073954be6d7ceb6c46f1967a34d3cbda3be6490e))

## [0.40.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.39.0...@instill-ai/design-system-v0.40.0) (2023-08-15)

### Features

- **design-system:** add combobox component ([#804](https://github.com/instill-ai/design-system/issues/804)) ([bc21a94](https://github.com/instill-ai/design-system/commit/bc21a944ce68c5d6073a5425a6ef006739c6e4d2))

## [0.39.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.38.1...@instill-ai/design-system-v0.39.0) (2023-08-15)

### Features

- add RoundedCheck ([#798](https://github.com/instill-ai/design-system/issues/798)) ([eacc043](https://github.com/instill-ai/design-system/commit/eacc043cec4e79ec62bbdd5cafec3dbbff72ae2d))
- **design-system:** add combobox component ([#803](https://github.com/instill-ai/design-system/issues/803)) ([f6997c3](https://github.com/instill-ai/design-system/commit/f6997c33d377bdf8b52a43f55205e1e0dce197df))
- **design-system:** add command component ([#802](https://github.com/instill-ai/design-system/issues/802)) ([989e955](https://github.com/instill-ai/design-system/commit/989e9557310463d7e5079ef11f4a54b87f18954a))
- **design-system:** add popover component ([#801](https://github.com/instill-ai/design-system/issues/801)) ([fd5c935](https://github.com/instill-ai/design-system/commit/fd5c9356d5c8d72ecb18225b7d5e001d4cd519c3))

### Bug Fixes

- fix icons dimension ([#800](https://github.com/instill-ai/design-system/issues/800)) ([99afdbc](https://github.com/instill-ai/design-system/commit/99afdbc2a5f8e80432312803b26816bceed6d257))

## [0.38.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.38.0...@instill-ai/design-system-v0.38.1) (2023-08-14)

### Miscellaneous

- rename ToogleLeft to ToggleLeft ([#796](https://github.com/instill-ai/design-system/issues/796)) ([779bccd](https://github.com/instill-ai/design-system/commit/779bccd695060045db32c9e9a664ec62109eee00))

## [0.38.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.37.2...@instill-ai/design-system-v0.38.0) (2023-08-14)

### Features

- **design-system:** add icons ([#794](https://github.com/instill-ai/design-system/issues/794)) ([949fb04](https://github.com/instill-ai/design-system/commit/949fb0446371148cb3e4f4ced0892f0162e68f4c))

## [0.37.2](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.37.1...@instill-ai/design-system-v0.37.2) (2023-08-08)

### Miscellaneous

- namananand/ins 1478 search also dont have cancel icon to remove search string ([#788](https://github.com/instill-ai/design-system/issues/788)) ([88b0c9e](https://github.com/instill-ai/design-system/commit/88b0c9ec32ec5e7522fb925c26eca2a371832353))

## [0.37.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.37.0...@instill-ai/design-system-v0.37.1) (2023-08-08)

### Miscellaneous

- **design-system:** cancel button for table search ([#786](https://github.com/instill-ai/design-system/issues/786)) ([279a503](https://github.com/instill-ai/design-system/commit/279a5033ff5de5921a7901eabce8cfa3b37e40e9))

## [0.37.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.36.6...@instill-ai/design-system-v0.37.0) (2023-08-08)

### Features

- **design-system:** add InstillCloud icon ([#784](https://github.com/instill-ai/design-system/issues/784)) ([0196fdb](https://github.com/instill-ai/design-system/commit/0196fdb42e2f87c1e5994215e2b625b13b56b4db))

## [0.36.6](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.36.5...@instill-ai/design-system-v0.36.6) (2023-08-04)

### Bug Fixes

- **design-system:** datatable pagination ([#771](https://github.com/instill-ai/design-system/issues/771)) ([130f8a6](https://github.com/instill-ai/design-system/commit/130f8a6d57bd0955870249e4fd60b861e6e1e7e8))

## [0.36.5](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.36.4...@instill-ai/design-system-v0.36.5) (2023-08-04)

### Bug Fixes

- **design-system:** datatable pagination ([#769](https://github.com/instill-ai/design-system/issues/769)) ([dca7f38](https://github.com/instill-ai/design-system/commit/dca7f38d4197cf46e4a96ca2c4d289dafc088796))

## [0.36.4](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.36.3...@instill-ai/design-system-v0.36.4) (2023-08-04)

### Bug Fixes

- **design-system:** datatable pagination ([#767](https://github.com/instill-ai/design-system/issues/767)) ([b843df0](https://github.com/instill-ai/design-system/commit/b843df0a22a0536d6dd06138158ea15ae07ca169))

## [0.36.3](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.36.2...@instill-ai/design-system-v0.36.3) (2023-08-04)

### Bug Fixes

- **toolkit:** small fixes for AI, model and Pipeline table ([#765](https://github.com/instill-ai/design-system/issues/765)) ([86790ee](https://github.com/instill-ai/design-system/commit/86790ee317c562ecab039de821f5c0bfde611c75))

## [0.36.2](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.36.1...@instill-ai/design-system-v0.36.2) (2023-08-04)

### Miscellaneous

- **design-system:** add pagination for long pages ([#763](https://github.com/instill-ai/design-system/issues/763)) ([4778eae](https://github.com/instill-ai/design-system/commit/4778eaea55011d39f92715829b04182ab2a7fc46))

## [0.36.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.36.0...@instill-ai/design-system-v0.36.1) (2023-08-03)

### Bug Fixes

- **toolkit:** AIs table fix ([#749](https://github.com/instill-ai/design-system/issues/749)) ([8b9da69](https://github.com/instill-ai/design-system/commit/8b9da695a1197d5907d7e025d1a6e0f1cc5b3914))

## [0.36.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.35.1...@instill-ai/design-system-v0.36.0) (2023-07-28)

### Features

- **toolkit:** move components to toolkit ([#710](https://github.com/instill-ai/design-system/issues/710)) ([6284b72](https://github.com/instill-ai/design-system/commit/6284b722955385c99668d728504c47c88fac1eb2))

## [0.35.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.35.0...@instill-ai/design-system-v0.35.1) (2023-07-27)

### Bug Fixes

- **toolkit:** pipeline state fix ([#700](https://github.com/instill-ai/design-system/issues/700)) ([ecf34ed](https://github.com/instill-ai/design-system/commit/ecf34edfe931c7895d39aff8138b7e4b487c9c08))

## [0.35.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.34.0...@instill-ai/design-system-v0.35.0) (2023-07-27)

### Features

- **design-system:** add search and table primary and secondary text ([#694](https://github.com/instill-ai/design-system/issues/694)) ([cc83442](https://github.com/instill-ai/design-system/commit/cc83442cb8fe0e31560a3ccb4affdfd67ad80a30))
- **design-system:** circle icon ([#677](https://github.com/instill-ai/design-system/issues/677)) ([437a840](https://github.com/instill-ai/design-system/commit/437a840a1045d39d8568ca966fa6e6a9d4ef1b74))
- **design-system:** search icon ([#693](https://github.com/instill-ai/design-system/issues/693)) ([4a1aeb9](https://github.com/instill-ai/design-system/commit/4a1aeb957b0824aaa5763b75da33d125bceb9b28))
- **design-system:** SpeechRecognition icon ([#697](https://github.com/instill-ai/design-system/issues/697)) ([fbb18b1](https://github.com/instill-ai/design-system/commit/fbb18b1a89df7a4e71b0c38d2580fa19b22ab21f))

### Bug Fixes

- **design-system:** namananand/ins 1414 update data table add search and title and sub title of ([#696](https://github.com/instill-ai/design-system/issues/696)) ([dc3129e](https://github.com/instill-ai/design-system/commit/dc3129e63d7e51abab6cb618032242dd468a6334))

## [0.34.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.33.1...@instill-ai/design-system-v0.34.0) (2023-07-24)

### Features

- **design-system:** namananand/ins 1332 loader for datatable ([#668](https://github.com/instill-ai/design-system/issues/668)) ([ac57fc6](https://github.com/instill-ai/design-system/commit/ac57fc6f84449f2b8db6d39d0e171fb0ab978d57))

## [0.33.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.33.0...@instill-ai/design-system-v0.33.1) (2023-07-23)

### Bug Fixes

- **design-system:** text Embeddings label add ([#684](https://github.com/instill-ai/design-system/issues/684)) ([e24c83f](https://github.com/instill-ai/design-system/commit/e24c83fad3bad3796be223da12efc6845f8bf3df))

## [0.33.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.32.0...@instill-ai/design-system-v0.33.0) (2023-07-19)

### Features

- ArrowNarrowLeft and ArrowNarrowRight ([#651](https://github.com/instill-ai/design-system/issues/651)) ([972ef9c](https://github.com/instill-ai/design-system/commit/972ef9c99d5eb228e7909f55d9424ca30c0cc64a))
- checkbox component ([#649](https://github.com/instill-ai/design-system/issues/649)) ([ae34ff3](https://github.com/instill-ai/design-system/commit/ae34ff376901aa9c626e92a0af67db6c336f6cdd))
- ChevronSelectorVertical icon ([#656](https://github.com/instill-ai/design-system/issues/656)) ([7a6a5aa](https://github.com/instill-ai/design-system/commit/7a6a5aaf4629543a2546016afe58c8a22d1a3646))
- component from shacdnui for the table ([#648](https://github.com/instill-ai/design-system/issues/648)) ([e88d72d](https://github.com/instill-ai/design-system/commit/e88d72d357a2e242220d8afa38c1817ca91c9928))
- **design-system:** add new complicate icons ([#670](https://github.com/instill-ai/design-system/issues/670)) ([c4985f1](https://github.com/instill-ai/design-system/commit/c4985f18f413555e51bd449307fb2253cd68c69d))
- **design-system:** icons trash-icon, filter-icon, tag-icon, file-icon ([#669](https://github.com/instill-ai/design-system/issues/669)) ([e5daf77](https://github.com/instill-ai/design-system/commit/e5daf77131f0d5e360980bfe5066915aaf9b3063))
- example for asChild in components ([#640](https://github.com/instill-ai/design-system/issues/640)) ([bc6fc69](https://github.com/instill-ai/design-system/commit/bc6fc69336bff6a45b9bd21b5810ef32b54dd023))
- Namananand/ins 1312 datatable component ([#654](https://github.com/instill-ai/design-system/issues/654)) ([7592e61](https://github.com/instill-ai/design-system/commit/7592e61b29a5256a5a062bb39072e888337ee25d))
- rounded-none example button ([#653](https://github.com/instill-ai/design-system/issues/653)) ([41ec010](https://github.com/instill-ai/design-system/commit/41ec010ac7742901f15089797f19bbeb4c2699b7))
- sorting button example ([#659](https://github.com/instill-ai/design-system/issues/659)) ([2e079c6](https://github.com/instill-ai/design-system/commit/2e079c6f7f179d0a03f79b6ffe6fae1d9bfd556e))
- **toolkit:** implement new multiple handlers pipeline builder ([#642](https://github.com/instill-ai/design-system/issues/642)) ([876778c](https://github.com/instill-ai/design-system/commit/876778c319427ca37f6949018e30b822234402d4))

### Bug Fixes

- **design-system:** fix data-table pagination button border ([#663](https://github.com/instill-ai/design-system/issues/663)) ([dd19795](https://github.com/instill-ai/design-system/commit/dd19795323e7f5125c5ba48fdfb89766aedceda3))
- **design-system:** fix the style of checkbox ([#664](https://github.com/instill-ai/design-system/issues/664)) ([ec0f786](https://github.com/instill-ai/design-system/commit/ec0f786a68a2ea1bf16287ee41dfd7e7b1ee8826))

### Miscellaneous

- **release:** release main ([95ce09e](https://github.com/instill-ai/design-system/commit/95ce09ede9f33550f5aad385e334910a1638c49e))
- **release:** release main ([a93e6d2](https://github.com/instill-ai/design-system/commit/a93e6d2d9d8dc2d04a2c094f740c49fff09f2fc2))

## [0.32.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.31.0...@instill-ai/design-system-v0.32.0) (2023-07-13)

### Features

- add comment reference ([502d44e](https://github.com/instill-ai/design-system/commit/502d44eae0aadc7217c12f5b8a0d5ac8fdecb464))
- namananand/create tagbutton for design system ([#639](https://github.com/instill-ai/design-system/issues/639)) ([9187d05](https://github.com/instill-ai/design-system/commit/9187d054e99c8969f5bf11817eb913d6e85bb7a5))
- namananand/ins 1092 add badge component in design system ([#589](https://github.com/instill-ai/design-system/issues/589)) ([e3fb270](https://github.com/instill-ai/design-system/commit/e3fb27056e2ba3f1c4fe39097c32224cc15ae60a))
- tooltip component for design-system INS-1163 ([#607](https://github.com/instill-ai/design-system/issues/607)) ([70f517f](https://github.com/instill-ai/design-system/commit/70f517f820c942e73fefa7e00603214fbc065cd2))

## [0.31.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.30.1...@instill-ai/design-system-v0.31.0) (2023-07-11)

### Features

- arrow up and down icon ([#617](https://github.com/instill-ai/design-system/issues/617)) ([f1b4201](https://github.com/instill-ai/design-system/commit/f1b4201008532e220bffb893c26c3b426416237e))
- increase the limit of toast to 3 ([#623](https://github.com/instill-ai/design-system/issues/623)) ([4cab72d](https://github.com/instill-ai/design-system/commit/4cab72d07cae71c62037be90f5417ea0b30fd738))

## [0.30.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.30.0...@instill-ai/design-system-v0.30.1) (2023-07-09)

### Bug Fixes

- fix switch color ([#614](https://github.com/instill-ai/design-system/issues/614)) ([dbcd6fc](https://github.com/instill-ai/design-system/commit/dbcd6fc5a2542375b3e76755707c50dc724345c7))

## [0.30.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.29.0...@instill-ai/design-system-v0.30.0) (2023-07-08)

### Features

- add skeleton ([#602](https://github.com/instill-ai/design-system/issues/602)) ([4275b6b](https://github.com/instill-ai/design-system/commit/4275b6bed539fc23ad0b231b6d8ba7aa92dd2652))
- move toast at the middle ([#598](https://github.com/instill-ai/design-system/issues/598)) ([fdc2c17](https://github.com/instill-ai/design-system/commit/fdc2c176aac2db8134d233ec301f6129d90177c6))

### Bug Fixes

- fix disabled input bg-color ([#599](https://github.com/instill-ai/design-system/issues/599)) ([1ff58c2](https://github.com/instill-ai/design-system/commit/1ff58c2768384ab7992ef0efea6d7edb8ab205d6))

## [0.29.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.28.0...@instill-ai/design-system-v0.29.0) (2023-07-07)

### Features

- **design-system:** make form and input bg color to be primary white ([#593](https://github.com/instill-ai/design-system/issues/593)) ([ddb7368](https://github.com/instill-ai/design-system/commit/ddb7368ee01e1a39cfa9900fea937e6d96f4875f))
- update ai and blockchain table placeholder ([#594](https://github.com/instill-ai/design-system/issues/594)) ([497c574](https://github.com/instill-ai/design-system/commit/497c574ac0e58e952e60a40584bbd73b7cca1588))

### Bug Fixes

- **toolkit,design-system:** unify text color across different form component ([#581](https://github.com/instill-ai/design-system/issues/581)) ([73ec2b9](https://github.com/instill-ai/design-system/commit/73ec2b92981a84dc5942bda8e3d69c0087d9afdf))

### Miscellaneous

- **toolkit:** disable pipeline builder topbar editor ([#595](https://github.com/instill-ai/design-system/issues/595)) ([02786f1](https://github.com/instill-ai/design-system/commit/02786f15604d183e6dd0bd75b4852195e34a34db))

## [0.28.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.27.0...@instill-ai/design-system-v0.28.0) (2023-07-06)

### Features

- add chev icons ([#571](https://github.com/instill-ai/design-system/issues/571)) ([7f256b9](https://github.com/instill-ai/design-system/commit/7f256b9fa247870597be4f27f2849618e79ff18d))

## [0.27.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.26.0...@instill-ai/design-system-v0.27.0) (2023-07-05)

### Features

- added refresh icon INS-1090 ([#555](https://github.com/instill-ai/design-system/issues/555)) ([d3fdc11](https://github.com/instill-ai/design-system/commit/d3fdc11332354f18411e7a0cf1b1c1a94bbffb7c))

## [0.26.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.25.0...@instill-ai/design-system-v0.26.0) (2023-07-04)

### Features

- **design-system:** add ATFSquare, ATFExpand, AssemblyAI logos and Stop icon ([#558](https://github.com/instill-ai/design-system/issues/558)) ([d893b01](https://github.com/instill-ai/design-system/commit/d893b01741f7c4a80c39ed61b4cc01f766b49032))

## [0.25.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.24.1...@instill-ai/design-system-v0.25.0) (2023-06-30)

### Features

- **design-system:** add MDL, StabilityAI logos and CubeOutline icon ([#545](https://github.com/instill-ai/design-system/issues/545)) ([1eda6bf](https://github.com/instill-ai/design-system/commit/1eda6bf85068018d6542a697c85f5421d44dbda2))
- **design-system:** add Number, MDL, VDP Logos ([#542](https://github.com/instill-ai/design-system/issues/542)) ([20a40f7](https://github.com/instill-ai/design-system/commit/20a40f7b72010b9b8fb5f2c363a42d35d6b359d0))

## [0.24.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.24.0...@instill-ai/design-system-v0.24.1) (2023-06-30)

### Bug Fixes

- fix release workflow ([#540](https://github.com/instill-ai/design-system/issues/540)) ([d8690c7](https://github.com/instill-ai/design-system/commit/d8690c7be0fbb3ac3497be8556248382fb9b0f86))

## [0.24.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.23.0...@instill-ai/design-system-v0.24.0) (2023-06-30)

### Features

- **design-system:** add group attribute into Select ([#532](https://github.com/instill-ai/design-system/issues/532)) ([13ea575](https://github.com/instill-ai/design-system/commit/13ea575dcdc235627cf2354c27ba70b99bc8201f))
- **design-system:** add ModelLogo and refactor other Logo's API ([#530](https://github.com/instill-ai/design-system/issues/530)) ([0dad2f8](https://github.com/instill-ai/design-system/commit/0dad2f87f03ecda449a675e856147a67ede4a6e2))

### Bug Fixes

- **design-system:** fix IconBase not forward ref issue ([#535](https://github.com/instill-ai/design-system/issues/535)) ([16e554b](https://github.com/instill-ai/design-system/commit/16e554b7bb6c2647afb6938772c6e71611cd1deb))
- **design-system:** fix Icons displayName issue ([#536](https://github.com/instill-ai/design-system/issues/536)) ([4994e53](https://github.com/instill-ai/design-system/commit/4994e53112c8cd819a31ac641f73d314aa224e43))

## [0.23.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.22.1...@instill-ai/design-system-v0.23.0) (2023-06-27)

### Features

- **design-system:** add Save01 icon ([#525](https://github.com/instill-ai/design-system/issues/525)) ([6c1ea92](https://github.com/instill-ai/design-system/commit/6c1ea923d3171b4395f21f0a08eacd31254859c2))

## [0.22.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.22.0...@instill-ai/design-system-v0.22.1) (2023-06-25)

### Bug Fixes

- **design-system:** remove Dialog.Close in the Dialog.Content ([#521](https://github.com/instill-ai/design-system/issues/521)) ([81630ea](https://github.com/instill-ai/design-system/commit/81630ea32221e7c635610058931410f132f4bd56))

## [0.22.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.21.0...@instill-ai/design-system-v0.22.0) (2023-06-25)

### Features

- **design-system:** Dialog is not complete ([#519](https://github.com/instill-ai/design-system/issues/519)) ([e47597b](https://github.com/instill-ai/design-system/commit/e47597b657ae068140fb2ab9b06ff7802a9ad795))

## [0.21.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.20.0...@instill-ai/design-system-v0.21.0) (2023-06-24)

### Features

- **design-system:** implement Separator component ([#517](https://github.com/instill-ai/design-system/issues/517)) ([a955b70](https://github.com/instill-ai/design-system/commit/a955b70ad8e14b9ebfc958aec927e6df79d3b3c0))

## [0.20.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.19.0...@instill-ai/design-system-v0.20.0) (2023-06-24)

### Features

- **design-system:** add LinkButton component ([#513](https://github.com/instill-ai/design-system/issues/513)) ([c94494e](https://github.com/instill-ai/design-system/commit/c94494e3d6b819756e5ac8d41e54d7a69b18f138))
- **design-system:** implement Toast component ([#515](https://github.com/instill-ai/design-system/issues/515)) ([cb48d4a](https://github.com/instill-ai/design-system/commit/cb48d4ae43a07c8b5585fc909d6584f05c952a70))

## [0.19.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.18.1...@instill-ai/design-system-v0.19.0) (2023-06-22)

### Features

- **design-system:** add Field component ([#508](https://github.com/instill-ai/design-system/issues/508)) ([0b28f8a](https://github.com/instill-ai/design-system/commit/0b28f8a315bade26f6c080d313862dc21ecd8704))
- **design-system:** add form message ([#510](https://github.com/instill-ai/design-system/issues/510)) ([cf590fd](https://github.com/instill-ai/design-system/commit/cf590fdf1d4c291ea31a983af21e6bac5ae8fa94))
- **design-system:** add the Select component ([#511](https://github.com/instill-ai/design-system/issues/511)) ([5eba0c0](https://github.com/instill-ai/design-system/commit/5eba0c0268d8a4583a896351f10bfa1bf1f68b58))
- **design-system:** implement new button component ([#512](https://github.com/instill-ai/design-system/issues/512)) ([4d45768](https://github.com/instill-ai/design-system/commit/4d457680f446f86175e96c93ebd09de4c1dc883b))
- **design-system:** implement new Form component ([#509](https://github.com/instill-ai/design-system/issues/509)) ([1e6ddf2](https://github.com/instill-ai/design-system/commit/1e6ddf294a71da849be3018a6266e167b0cd02e0))
- **design-system:** implement the new Input component ([#507](https://github.com/instill-ai/design-system/issues/507)) ([ee148a2](https://github.com/instill-ai/design-system/commit/ee148a2031fb5627dcbd505bf5931601ad658e09))

## [0.18.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.18.0...@instill-ai/design-system-v0.18.1) (2023-06-19)

### Bug Fixes

- **design-system:** fix debug option affect select behavior issue ([#503](https://github.com/instill-ai/design-system/issues/503)) ([653f83d](https://github.com/instill-ai/design-system/commit/653f83d19742c5efd351db2f652cacf869ac87b7))

## [0.18.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.17.1...@instill-ai/design-system-v0.18.0) (2023-06-19)

### Features

- **design-system:** implement new switch ([#494](https://github.com/instill-ai/design-system/issues/494)) ([157069c](https://github.com/instill-ai/design-system/commit/157069c3cf4c926b4be3bd38a376fdb139b1f37c))

### Miscellaneous

- **cortex:** update tailwindcss version ([#498](https://github.com/instill-ai/design-system/issues/498)) ([c6dd679](https://github.com/instill-ai/design-system/commit/c6dd6794028b9e42cb051f360db47d9eca3d3987))
- **design-system:** add data-testid in BasicSingleSelect ([#502](https://github.com/instill-ai/design-system/issues/502)) ([28d40fa](https://github.com/instill-ai/design-system/commit/28d40fac0f20e65c3953ff0898756fd29e57a6ec))
- **design-system:** update how we handle import tailwindcss style to storybook ([#500](https://github.com/instill-ai/design-system/issues/500)) ([fcbf5e9](https://github.com/instill-ai/design-system/commit/fcbf5e9fdcc64ed6ea63f6359c8938ff716084a8))

## [0.17.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.17.0...@instill-ai/design-system-v0.17.1) (2023-06-19)

### Bug Fixes

- **design-system:** fix design-token can't be successfully build into design-system storybook ([#495](https://github.com/instill-ai/design-system/issues/495)) ([647afee](https://github.com/instill-ai/design-system/commit/647afee8ea9cb9c28334e5aba5288e3d94154f1b))

## [0.17.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.16.0...@instill-ai/design-system-v0.17.0) (2023-06-16)

### Features

- **design-system:** add new Dialog component ([#492](https://github.com/instill-ai/design-system/issues/492)) ([1b25c66](https://github.com/instill-ai/design-system/commit/1b25c66a34ea225fa8d4d51cb7cc1109f4b36948))
- **design-system:** add new Textarea component ([#490](https://github.com/instill-ai/design-system/issues/490)) ([81d3a22](https://github.com/instill-ai/design-system/commit/81d3a22eb684363d255995ea40f9aae5b1c638eb))

### Bug Fixes

- **design-system:** fix storybook build issue ([#493](https://github.com/instill-ai/design-system/issues/493)) ([a77b2aa](https://github.com/instill-ai/design-system/commit/a77b2aa8a92338bc557b32eb478359adc950f88c))

## [0.16.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.15.0...@instill-ai/design-system-v0.16.0) (2023-06-14)

### Features

- add Chip01 and Chip02 icon ([#489](https://github.com/instill-ai/design-system/issues/489)) ([6dd8785](https://github.com/instill-ai/design-system/commit/6dd8785854b36b6dcf303110a1da8bd85f3a51a6))

## [0.15.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.14.0...@instill-ai/design-system-v0.15.0) (2023-06-10)

### Features

- **design-system:** add multiple new icons ([#474](https://github.com/instill-ai/design-system/issues/474)) ([9b57733](https://github.com/instill-ai/design-system/commit/9b5773309c51a4f7235ccb6dfd8a187e76cbc245))

## [0.14.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.13.0...@instill-ai/design-system-v0.14.0) (2023-06-07)

### Features

- **design-system:** add new model and pipeline icon ([#463](https://github.com/instill-ai/design-system/issues/463)) ([5ee6e2e](https://github.com/instill-ai/design-system/commit/5ee6e2e31ef13462ab061bba0bf4e8de3e847506))

## [0.13.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.12.0...@instill-ai/design-system-v0.13.0) (2023-06-06)

### Features

- **design-system:** add multiple icons into design-system ([#461](https://github.com/instill-ai/design-system/issues/461)) ([4b1edef](https://github.com/instill-ai/design-system/commit/4b1edeffa3b9d032404cb8e23ef29590108f14fe))

## [0.12.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.11.0...@instill-ai/design-system-v0.12.0) (2023-06-05)

### Features

- **design-system:** add Gear01 and Database01 icon ([#456](https://github.com/instill-ai/design-system/issues/456)) ([8761eb4](https://github.com/instill-ai/design-system/commit/8761eb4d65ad6cb6e4bc3373ce3098590e3885f4))

## [0.11.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.10.6...@instill-ai/design-system-v0.11.0) (2023-06-02)

### Features

- [INS-820] transform design tokens to style dictionary ([#441](https://github.com/instill-ai/design-system/issues/441)) ([f92e777](https://github.com/instill-ai/design-system/commit/f92e777cb3508ff8ce134293d971b0edfce7a25c))
- **design-tokens:** [INS-822][INS-825] Implement tailwind css variables for theme switch ([#444](https://github.com/instill-ai/design-system/issues/444)) ([78bc6b1](https://github.com/instill-ai/design-system/commit/78bc6b1ff0b5d4e08a763367409438e546fa5915))

## [0.10.6](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.10.5...@instill-ai/design-system-v0.10.6) (2023-05-08)

### Bug Fixes

- [INS-617] fix SingleSelect not correctly display its height ([#417](https://github.com/instill-ai/design-system/issues/417)) ([7fe1f25](https://github.com/instill-ai/design-system/commit/7fe1f254dc8873276652a8dcc0e057485189ddc3))

## [0.10.5](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.10.4...@instill-ai/design-system-v0.10.5) (2023-04-24)

### Miscellaneous

- refactor components api ([#373](https://github.com/instill-ai/design-system/issues/373)) ([c4753ed](https://github.com/instill-ai/design-system/commit/c4753edc67515a446d54c3458ef20e98f5936740))

## [0.10.4](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.10.3...@instill-ai/design-system-v0.10.4) (2023-04-19)

### Miscellaneous

- deprecate React.FC type in design system ([#347](https://github.com/instill-ai/design-system/issues/347)) ([03aede0](https://github.com/instill-ai/design-system/commit/03aede0d3d9a1420a32fe085271fc8bf0b09def5))

## [0.10.3](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.10.2...@instill-ai/design-system-v0.10.3) (2023-04-13)

### Miscellaneous

- refactor how we import React in design-system ([#339](https://github.com/instill-ai/design-system/issues/339)) ([22ed6e0](https://github.com/instill-ai/design-system/commit/22ed6e0a4fa535724400034365686b11d2f90abb))

## [0.10.2](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.10.1...@instill-ai/design-system-v0.10.2) (2023-04-06)

### Bug Fixes

- fix SingleSelect bgColor ([#311](https://github.com/instill-ai/design-system/issues/311)) ([c409f80](https://github.com/instill-ai/design-system/commit/c409f80fa7c4d2dafc6148f901a670032fbf481d))

## [0.10.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.10.0...@instill-ai/design-system-v0.10.1) (2023-04-06)

### Bug Fixes

- fix create pipeline form not correctly set model.type issue ([#301](https://github.com/instill-ai/design-system/issues/301)) ([9f5a19c](https://github.com/instill-ai/design-system/commit/9f5a19c06d2259c425cef5ca136ea51863a886d2))

## [0.10.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.9.2...@instill-ai/design-system-v0.10.0) (2023-04-05)

### Features

- add data-testid for input label ([#284](https://github.com/instill-ai/design-system/issues/284)) ([8acd87d](https://github.com/instill-ai/design-system/commit/8acd87dc15eef38421e3cc2287acba3d4dacd0f3))

## [0.9.2](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.9.1...@instill-ai/design-system-v0.9.2) (2023-04-05)

### Bug Fixes

- fix select scroll issue ([#282](https://github.com/instill-ai/design-system/issues/282)) ([6983172](https://github.com/instill-ai/design-system/commit/6983172f2d5c694c4e35d848e59598fd2658cbcc))

## [0.9.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.9.0...@instill-ai/design-system-v0.9.1) (2023-04-05)

### Bug Fixes

- fix select id ([#276](https://github.com/instill-ai/design-system/issues/276)) ([c345585](https://github.com/instill-ai/design-system/commit/c34558500966bb317b2a43a9ae4122dc91dce9fc))

## [0.9.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.8.1...@instill-ai/design-system-v0.9.0) (2023-04-04)

### Features

- adapt model one layer design ([#272](https://github.com/instill-ai/design-system/issues/272)) ([12a7358](https://github.com/instill-ai/design-system/commit/12a7358bb183c705c675c9a68b7c690bb6a1fd18))

## [0.8.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.8.0...@instill-ai/design-system-v0.8.1) (2023-03-23)

### Bug Fixes

- remove exports property in package.json ([#249](https://github.com/instill-ai/design-system/issues/249)) ([e4fac87](https://github.com/instill-ai/design-system/commit/e4fac870219783a0249fc430394755d5c840814b))

## [0.8.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.7.7...@instill-ai/design-system-v0.8.0) (2023-03-23)

### Features

- update how we handle export ([#248](https://github.com/instill-ai/design-system/issues/248)) ([3b41d77](https://github.com/instill-ai/design-system/commit/3b41d7734e812721bda071dda8c0873e83c4a9e5))

## [0.7.7](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.7.6...@instill-ai/design-system-v0.7.7) (2023-03-23)

### Bug Fixes

- [INS-276] fix select icon issue ([#242](https://github.com/instill-ai/design-system/issues/242)) ([d1f9c4f](https://github.com/instill-ai/design-system/commit/d1f9c4f065489d6f9339988547adff9a0dc0b70b))
- [INS-277] fix select not disabled ([#243](https://github.com/instill-ai/design-system/issues/243)) ([d7510c7](https://github.com/instill-ai/design-system/commit/d7510c7696207b0885e994756e5c43c6c15c7b96))

## [0.7.6](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.7.5...@instill-ai/design-system-v0.7.6) (2023-03-21)

### Bug Fixes

- fix single select focus style and export more props ([#231](https://github.com/instill-ai/design-system/issues/231)) ([c855a02](https://github.com/instill-ai/design-system/commit/c855a020d54685222eeefa81e6dbca7cdc6d7a2a))

## [0.7.5](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.7.4...@instill-ai/design-system-v0.7.5) (2023-03-20)

### Bug Fixes

- export cjs file ([#227](https://github.com/instill-ai/design-system/issues/227)) ([f7c894f](https://github.com/instill-ai/design-system/commit/f7c894f092ed286f8e6b9ae0eadf449da86e112b))

## [0.7.4](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.7.3...@instill-ai/design-system-v0.7.4) (2023-03-20)

### Bug Fixes

- fix radix component import path ([#225](https://github.com/instill-ai/design-system/issues/225)) ([e16912b](https://github.com/instill-ai/design-system/commit/e16912b9d6ffd985cc5488639eb682b8242aee5b))

## [0.7.3](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.7.2...@instill-ai/design-system-v0.7.3) (2023-03-20)

### Bug Fixes

- test esbuild ([#223](https://github.com/instill-ai/design-system/issues/223)) ([8e92280](https://github.com/instill-ai/design-system/commit/8e922800e6d29cd16dd572048c72daeb156d04e4))

## [0.7.2](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.7.1...@instill-ai/design-system-v0.7.2) (2023-03-20)

### Bug Fixes

- experiment export path ([#221](https://github.com/instill-ai/design-system/issues/221)) ([7573637](https://github.com/instill-ai/design-system/commit/7573637416fd641b50f19d9f388c3e29241e9555))

## [0.7.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.7.0...@instill-ai/design-system-v0.7.1) (2023-03-20)

### Bug Fixes

- fix SingleSelectBase wrong prop name issue ([#219](https://github.com/instill-ai/design-system/issues/219)) ([ed0602a](https://github.com/instill-ai/design-system/commit/ed0602a81a3c4c32c78b7f861c20d2bbf4ce05c1))

## [0.7.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.6.0...@instill-ai/design-system-v0.7.0) (2023-03-20)

### Features

- make select take dynamic width ([#216](https://github.com/instill-ai/design-system/issues/216)) ([173d620](https://github.com/instill-ai/design-system/commit/173d6202a43fa6fee3b24920a08b01060e12d968))
- replace esbuild with tsup ([#217](https://github.com/instill-ai/design-system/issues/217)) ([36e41c8](https://github.com/instill-ai/design-system/commit/36e41c80c8e9d43b98f2238f2dd722a3fad677a3))
- replace react-select with radix-ui/react-select ([#214](https://github.com/instill-ai/design-system/issues/214)) ([e75c5d6](https://github.com/instill-ai/design-system/commit/e75c5d64447833161ec03533728a1f46fd86e29d))

## [0.6.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.5.4...@instill-ai/design-system-v0.6.0) (2023-03-15)

### Features

- [INS-244] replace jest with vitest in design-system ([#197](https://github.com/instill-ai/design-system/issues/197)) ([8f47a47](https://github.com/instill-ai/design-system/commit/8f47a47b5ae71dd9d7409d70e3101a476812c6e0))

### Bug Fixes

- fix design-system tsconfig didn't exclude test related file ([#198](https://github.com/instill-ai/design-system/issues/198)) ([8652922](https://github.com/instill-ai/design-system/commit/8652922150a32d059a86fe184b01ed3ed5f5386d))
- fix packagejson type declaration ([#195](https://github.com/instill-ai/design-system/issues/195)) ([a0f8cd8](https://github.com/instill-ai/design-system/commit/a0f8cd852f35a8fc121c17ca93bf04f265c4914b))

## [0.5.4](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.5.3...@instill-ai/design-system-v0.5.4) (2023-03-15)

### Bug Fixes

- fix package.json main field ([#193](https://github.com/instill-ai/design-system/issues/193)) ([deecba1](https://github.com/instill-ai/design-system/commit/deecba1fadad4fdb3c2bf8d6c28c9a7790e26ade))

## [0.5.3](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.5.2...@instill-ai/design-system-v0.5.3) (2023-03-15)

### Bug Fixes

- fix unnecessary gap when the label value is null ([#191](https://github.com/instill-ai/design-system/issues/191)) ([f102377](https://github.com/instill-ai/design-system/commit/f1023777fac68be638cd135c7d800902722081f4))

## [0.5.2](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.5.1...@instill-ai/design-system-v0.5.2) (2023-03-15)

### Bug Fixes

- fix wrong label UI when its value is null ([#189](https://github.com/instill-ai/design-system/issues/189)) ([02dd9d1](https://github.com/instill-ai/design-system/commit/02dd9d17633e6a7715dbeb68da7e1cc6db915e02))

## [0.5.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.5.0...@instill-ai/design-system-v0.5.1) (2023-03-14)

### Bug Fixes

- fix design-system export path ([#180](https://github.com/instill-ai/design-system/issues/180)) ([758aa91](https://github.com/instill-ai/design-system/commit/758aa9135e2d8648f369ab3fb5aa2fb13e0cf934))

## [0.5.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.4.0...@instill-ai/design-system-v0.5.0) (2023-03-14)

### Features

- only export ESM module ([#178](https://github.com/instill-ai/design-system/issues/178)) ([be39c37](https://github.com/instill-ai/design-system/commit/be39c37db03f36818c4ef83bd60110e04a10f721))

## [0.4.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.3.1...@instill-ai/design-system-v0.4.0) (2023-03-14)

### Features

- add create source form store ([#170](https://github.com/instill-ai/design-system/issues/170)) ([ffaed7d](https://github.com/instill-ai/design-system/commit/ffaed7dad7336d5f455e1a9c4e807db5b2181969))
- add ModalRoot into design-system ([#161](https://github.com/instill-ai/design-system/issues/161)) ([c5d4fa2](https://github.com/instill-ai/design-system/commit/c5d4fa27a4dde3359c5a68aa4cde8342877c2e78))
- merge view into toolkit ([#171](https://github.com/instill-ai/design-system/issues/171)) ([2d52b2b](https://github.com/instill-ai/design-system/commit/2d52b2b4c0cb07f14ddb93c918445ca7a7ecdce9))
- replace the props of ProgressMessageBoxBase from setState to setActivate ([#167](https://github.com/instill-ai/design-system/issues/167)) ([0baf90e](https://github.com/instill-ai/design-system/commit/0baf90e018652cb323ad19bce8b25719b599ad68))

### Bug Fixes

- fix modal root name ([#162](https://github.com/instill-ai/design-system/issues/162)) ([c0bcf3f](https://github.com/instill-ai/design-system/commit/c0bcf3ffd4482d4eebb19539d0d46a99bb8696b5))

## [0.3.1](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.3.0...@instill-ai/design-system-v0.3.1) (2023-03-10)

### Miscellaneous

- rename subfolder from UI to design system ([#149](https://github.com/instill-ai/design-system/issues/149)) ([d0d5563](https://github.com/instill-ai/design-system/commit/d0d5563f09e2fe811a886462c7fc9cbf92701a83))

## [0.3.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.2.0...@instill-ai/design-system-v0.3.0) (2023-03-10)

### Features

- add ConfigureProfileForm into view ([#148](https://github.com/instill-ai/design-system/issues/148)) ([792f841](https://github.com/instill-ai/design-system/commit/792f841529ca38ca5b4d59db2b5afa15db72e155))
- add FormRoot ([#147](https://github.com/instill-ai/design-system/issues/147)) ([e7d84a0](https://github.com/instill-ai/design-system/commit/e7d84a03590b1fb3ca19985a4809c04c6efdd56b))

### Bug Fixes

- fix the additional space behind GcsIcon folder ([#141](https://github.com/instill-ai/design-system/issues/141)) ([0b3a0c9](https://github.com/instill-ai/design-system/commit/0b3a0c9c3f8ac834b480102298fd6d0883f21ae5))

## [0.2.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.1.0...@instill-ai/design-system-v0.2.0) (2023-03-05)

### Features

- add base tsconfig ([#122](https://github.com/instill-ai/design-system/issues/122)) ([1f43ad1](https://github.com/instill-ai/design-system/commit/1f43ad1fcb8d6fbd235b3bb8f323e6c33f5fdcb4))
- add dot lib ([#125](https://github.com/instill-ai/design-system/issues/125)) ([db21ee7](https://github.com/instill-ai/design-system/commit/db21ee76d88b9027ae833efe83350297fb62695b))
- refactor design-system to monorepo ([#112](https://github.com/instill-ai/design-system/issues/112)) ([49a7608](https://github.com/instill-ai/design-system/commit/49a7608822705ad54ec73259f93b5e41f760fcf3))
- update action and version ([#135](https://github.com/instill-ai/design-system/issues/135)) ([d73c9da](https://github.com/instill-ai/design-system/commit/d73c9da0d5e308ed7e662846ce3db9eddc27c632))
- update eslint config and make it a standalone package ([#116](https://github.com/instill-ai/design-system/issues/116)) ([d3bcb5b](https://github.com/instill-ai/design-system/commit/d3bcb5b671785c80c8c4ec3f7bc329c50737f759))
- update package config ([#114](https://github.com/instill-ai/design-system/issues/114)) ([0a84a34](https://github.com/instill-ai/design-system/commit/0a84a347529a36ca8e6b46c1c660a7e1644f0cf1))

### Bug Fixes

- fix build and publish steps ([#133](https://github.com/instill-ai/design-system/issues/133)) ([6497486](https://github.com/instill-ai/design-system/commit/6497486761bc16a2d381f7c49fe5acd20fade852))
- fix build issue and re-release ([#118](https://github.com/instill-ai/design-system/issues/118)) ([d112a82](https://github.com/instill-ai/design-system/commit/d112a828620127f4c26dc47ed92ffbf484d4fa6b))

### Miscellaneous

- release main ([#129](https://github.com/instill-ai/design-system/issues/129)) ([1e1be68](https://github.com/instill-ai/design-system/commit/1e1be684a4076d456cd500fe1ca0768026e2e915))
- release main ([#132](https://github.com/instill-ai/design-system/issues/132)) ([626a977](https://github.com/instill-ai/design-system/commit/626a9779540b57afab7e29fb58604f2fc392a631))
- release main ([#134](https://github.com/instill-ai/design-system/issues/134)) ([c85380a](https://github.com/instill-ai/design-system/commit/c85380ab5d4f3aecc7a8bc12cb036bb61d74d4b0))
- rollback version and update release action ([#131](https://github.com/instill-ai/design-system/issues/131)) ([ba93866](https://github.com/instill-ai/design-system/commit/ba938660d0420443889f8625a6c32dfd4cc54ea5))

## [0.2.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.1.0...@instill-ai/design-system-v0.2.0) (2023-03-05)

### Features

- add base tsconfig ([#122](https://github.com/instill-ai/design-system/issues/122)) ([1f43ad1](https://github.com/instill-ai/design-system/commit/1f43ad1fcb8d6fbd235b3bb8f323e6c33f5fdcb4))
- add dot lib ([#125](https://github.com/instill-ai/design-system/issues/125)) ([db21ee7](https://github.com/instill-ai/design-system/commit/db21ee76d88b9027ae833efe83350297fb62695b))
- refactor design-system to monorepo ([#112](https://github.com/instill-ai/design-system/issues/112)) ([49a7608](https://github.com/instill-ai/design-system/commit/49a7608822705ad54ec73259f93b5e41f760fcf3))
- update eslint config and make it a standalone package ([#116](https://github.com/instill-ai/design-system/issues/116)) ([d3bcb5b](https://github.com/instill-ai/design-system/commit/d3bcb5b671785c80c8c4ec3f7bc329c50737f759))
- update package config ([#114](https://github.com/instill-ai/design-system/issues/114)) ([0a84a34](https://github.com/instill-ai/design-system/commit/0a84a347529a36ca8e6b46c1c660a7e1644f0cf1))

### Bug Fixes

- fix build and publish steps ([#133](https://github.com/instill-ai/design-system/issues/133)) ([6497486](https://github.com/instill-ai/design-system/commit/6497486761bc16a2d381f7c49fe5acd20fade852))
- fix build issue and re-release ([#118](https://github.com/instill-ai/design-system/issues/118)) ([d112a82](https://github.com/instill-ai/design-system/commit/d112a828620127f4c26dc47ed92ffbf484d4fa6b))

### Miscellaneous

- release main ([#129](https://github.com/instill-ai/design-system/issues/129)) ([1e1be68](https://github.com/instill-ai/design-system/commit/1e1be684a4076d456cd500fe1ca0768026e2e915))
- release main ([#132](https://github.com/instill-ai/design-system/issues/132)) ([626a977](https://github.com/instill-ai/design-system/commit/626a9779540b57afab7e29fb58604f2fc392a631))
- rollback version and update release action ([#131](https://github.com/instill-ai/design-system/issues/131)) ([ba93866](https://github.com/instill-ai/design-system/commit/ba938660d0420443889f8625a6c32dfd4cc54ea5))

## [0.2.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.1.0...@instill-ai/design-system-v0.2.0) (2023-03-05)

### Features

- add base tsconfig ([#122](https://github.com/instill-ai/design-system/issues/122)) ([1f43ad1](https://github.com/instill-ai/design-system/commit/1f43ad1fcb8d6fbd235b3bb8f323e6c33f5fdcb4))
- add dot lib ([#125](https://github.com/instill-ai/design-system/issues/125)) ([db21ee7](https://github.com/instill-ai/design-system/commit/db21ee76d88b9027ae833efe83350297fb62695b))
- refactor design-system to monorepo ([#112](https://github.com/instill-ai/design-system/issues/112)) ([49a7608](https://github.com/instill-ai/design-system/commit/49a7608822705ad54ec73259f93b5e41f760fcf3))
- update eslint config and make it a standalone package ([#116](https://github.com/instill-ai/design-system/issues/116)) ([d3bcb5b](https://github.com/instill-ai/design-system/commit/d3bcb5b671785c80c8c4ec3f7bc329c50737f759))
- update package config ([#114](https://github.com/instill-ai/design-system/issues/114)) ([0a84a34](https://github.com/instill-ai/design-system/commit/0a84a347529a36ca8e6b46c1c660a7e1644f0cf1))

### Bug Fixes

- fix build issue and re-release ([#118](https://github.com/instill-ai/design-system/issues/118)) ([d112a82](https://github.com/instill-ai/design-system/commit/d112a828620127f4c26dc47ed92ffbf484d4fa6b))

### Miscellaneous

- release main ([#129](https://github.com/instill-ai/design-system/issues/129)) ([1e1be68](https://github.com/instill-ai/design-system/commit/1e1be684a4076d456cd500fe1ca0768026e2e915))
- rollback version and update release action ([#131](https://github.com/instill-ai/design-system/issues/131)) ([ba93866](https://github.com/instill-ai/design-system/commit/ba938660d0420443889f8625a6c32dfd4cc54ea5))

## [0.2.0](https://github.com/instill-ai/design-system/compare/@instill-ai/design-system-v0.1.3...@instill-ai/design-system-v0.2.0) (2023-03-05)

### Features

- add base tsconfig ([#122](https://github.com/instill-ai/design-system/issues/122)) ([1f43ad1](https://github.com/instill-ai/design-system/commit/1f43ad1fcb8d6fbd235b3bb8f323e6c33f5fdcb4))
- add dot lib ([#125](https://github.com/instill-ai/design-system/issues/125)) ([db21ee7](https://github.com/instill-ai/design-system/commit/db21ee76d88b9027ae833efe83350297fb62695b))
- refactor design-system to monorepo ([#112](https://github.com/instill-ai/design-system/issues/112)) ([49a7608](https://github.com/instill-ai/design-system/commit/49a7608822705ad54ec73259f93b5e41f760fcf3))
- update eslint config and make it a standalone package ([#116](https://github.com/instill-ai/design-system/issues/116)) ([d3bcb5b](https://github.com/instill-ai/design-system/commit/d3bcb5b671785c80c8c4ec3f7bc329c50737f759))
- update package config ([#114](https://github.com/instill-ai/design-system/issues/114)) ([0a84a34](https://github.com/instill-ai/design-system/commit/0a84a347529a36ca8e6b46c1c660a7e1644f0cf1))

### Bug Fixes

- fix build issue and re-release ([#118](https://github.com/instill-ai/design-system/issues/118)) ([d112a82](https://github.com/instill-ai/design-system/commit/d112a828620127f4c26dc47ed92ffbf484d4fa6b))

## 0.1.2

### Patch Changes

- d112a82: fix AccordionBase has non-interactive element with onClick handler issue, replease div element with button
- d112a82: fix duplicated import and non-interactive element lint issue
- d112a82: Adapt new eslint-config-cortex to simplify the workflow

## 0.1.2

### Patch Changes

- d3bcb5b: fix AccordionBase has non-interactive element with onClick handler issue, replease div element with button
- d3bcb5b: fix duplicated import and non-interactive element lint issue
- d3bcb5b: Adapt new eslint-config-cortex to simplify the workflow

## 0.1.1

### Patch Changes

- 0a84a34: Update the package.json config to make it public

## 0.1.0

### Minor Changes

- 49a7608: adapt monorepo structure and re-organize design-system

### Patch Changes

- 49a7608: Replace old deploy to staging workflow with purely lint and test workflow. Link this repo to vercel to simplify build/publish storybook step

import { PipelineTemplate } from "../type";

export const templates: PipelineTemplate[] = [
  {
    id: "Make digital stickers using keywords",
    description:
      "Feeling stuck with sticker ideas? No worries! Just write a few keywords that describe what you want, and watch the magic happen. Create stickers of various shapes using these keywords as a starting point, and let AI whip up some super creative stickers for you!",
    category: "AI-generated art",
    author: "InstillAI",
    recipe: {
      version: "v1alpha",
      components: [
        {
          id: "start",
          resource_name: null,
          resource: null,
          configuration: {
            metadata: {
              prompts: {
                title: "My prompts",
                type: "array",
                instillFormat: "array:string",
                items: {
                  type: "string",
                },
              },
              shape: {
                title: "Sticker shape",
                type: "string",
                instillFormat: "string",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/start",
          operator_definition: null,
        },
        {
          id: "end",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              ai_gen_stickers: "{ai_2.output.images}",
              prompts: "{start.prompts}",
              shape: "{start.shape}",
              texts: "{ai_1.output.texts}",
            },
            metadata: {
              ai_gen_stickers: {
                title: "AI digital stickers by GPT",
              },
              prompts: {
                title: "My original prompt",
              },
              shape: {
                title: "Sticker shape",
              },
              texts: {
                title: "GPT sticker description",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/end",
          operator_definition: null,
        },
        {
          id: "ai_1",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              model: "gpt-3.5-turbo",
              n: 1,
              prompt:
                "Augment the prompt with descriptive details for generating sticker images, and add the styles exactly at the end of the prompt “sticker style, flat icon, vector, die-cut {{start.shape}} sticker with white border”. Only return the output content.    Prompt: a bear Output: a brown bear dancing in a forest, sticker style, flat icon, vector, die-cut {{start.shape}} sticker with white border  Prompt: a dog writes code  Output: a dog writes code in front of a laptop and drinks coffee, sticker style, flat icon, vector, die-cut {{start.shape}} sticker with white border  Prompt: {{start.prompts[0]}} Output:",
              system_message:
                "You are a prompt engineer to generate Stable Diffusion prompts to generate sticker images",
              temperature: 1,
            },
            task: "TASK_TEXT_GENERATION",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/openai",
          connector_definition: null,
        },
        {
          id: "ai_2",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              cfg_scale: 8,
              engine: "stable-diffusion-xl-1024-v1-0",
              prompts: "{ai_1.output.texts}",
              samples: 1,
              steps: 30,
            },
            task: "TASK_TEXT_TO_IMAGE",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/stability-ai",
          connector_definition: null,
        },
      ],
    },
  },
  {
    id: "Create AI art with LLM prompts",
    description:
      "Don't worry if you're not an AI image prompt expert. Supercharge your AI art ideas with LLM-powered prompts.",
    category: "AI-generated art",
    author: "InstillAI",
    recipe: {
      version: "v1alpha",
      components: [
        {
          id: "start",
          resource_name: null,
          resource: null,
          configuration: {
            metadata: {
              prompts: {
                title: "My prompts",
                type: "array",
                instillFormat: "array:string",
                items: {
                  type: "string",
                },
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/start",
          operator_definition: null,
        },
        {
          id: "end",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              llm_prompt: "{openai.output.texts}",
              llm_prompt_generated_art: "{st_2.output.images}",
              my_prompt: "{start.prompts}",
              my_prompt_gen_art: "{st1.output.images}",
            },
            metadata: {
              llm_prompt: {
                title: "LLM Prompt",
              },
              llm_prompt_generated_art: {
                title: "LLM Prompt Generated Art",
              },
              my_prompt: {
                title: "My Prompt",
              },
              my_prompt_gen_art: {
                title: "My Prompt Generated Art",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/end",
          operator_definition: null,
        },
        {
          id: "openai",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              model: "gpt-3.5-turbo",
              n: 1,
              prompt: "{start.prompts[0]}",
              system_message:
                "You are an AI image prompt generator. I will describe an image to you, and you will return a text-to-image prompt based on my description.\n\nAspect ratio list: 2:3, 16:9, 1:1, 9:16, 3:2\nStyle list: Van Gogh's Starry Night, reminiscent of Salvador Dali,  J.R.R. Tolkien's Middle-earth, Claude Monet, detailed charcoal drawing, hyper-realistic digital painting, Frank Frazetta, Disney-inspired art, Studio Ghibli-inspired animation\nKeyword list:  photo, 4k, 8k, cinematic, cartoon art, painting, cyberpunk art, cinematic lighting, high-resolution 3D art, \n\nPick a style from the style list and sme keywords from the keyword list, return the prompt in the following format:\n\n<prompt> in a style of <style>, <keyword>, <keyword>, ...\n\n\nExamples:\n\n- A Hyperrealistic photograph of ancient Tokyo/London/Paris architectural ruins in a flooded apocalypse landscape of dead skyscrapers, lens flares, cinematic, hdri, matte painting, concept art, celestial, soft render, highly detailed, cgsociety, octane render, trending on artstation, architectural HD, HQ, 4k, 8k\n\n- A city skyline at dusk in the style of Van Gogh's Starry Night\n\n- A detailed medieval battle scene, with knights clad in shining armor and dragons soaring overhead, inspired by the epic style of J.R.R. Tolkien's Middle-earth.\n- a portrait of a beautiful blonde woman, fine - art photography, soft portrait shot 8 k, mid length, ultrarealistic uhd faces, unsplash, kodak ultra max 800, 85 mm, intricate, casual pose, centered symmetrical composition, stunning photos, masterpiece, grainy, centered composition : 2\n\n- A valley in the Alps at sunset, epic vista, beautiful landscape, 4k, 8k\n\n- A Hyperrealistic photograph of ancient Malaysian architectural ruins in Borneo's East Malaysia, lens flares, cinematic, hdri, matte painting, concept art, celestial, soft render, highly detailed, cgsociety, octane render, trending on artstation, architectural HD, HQ, 4k, 8k",
              temperature: 1,
            },
            task: "TASK_TEXT_GENERATION",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/openai",
          connector_definition: null,
        },
        {
          id: "st1",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              cfg_scale: 8,
              engine: "stable-diffusion-xl-1024-v1-0",
              prompts: "{start.prompts}",
              samples: 1,
              seed: 0,
              steps: 30,
            },
            task: "TASK_TEXT_TO_IMAGE",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/stability-ai",
          connector_definition: null,
        },
        {
          id: "st_2",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              cfg_scale: 8,
              engine: "stable-diffusion-xl-1024-v1-0",
              prompts: "{openai.output.texts}",
              samples: 1,
              seed: 0,
              steps: 30,
            },
            task: "TASK_TEXT_TO_IMAGE",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/stability-ai",
          connector_definition: null,
        },
      ],
    },
  },
  {
    id: "Turn your AI art into Web3 asset",
    description:
      "Want to trace the journey of your AI art and how it comes to life? Transform it into a Web3 masterpiece with Numbers Protocol's blockchain tech. We've put together a cool example of a Web3 asset using this template: https://nftsearch.site/asset-profile?cid=bafybeidxjcsorh26sjx6qqfxlcw535vrnafq4dz4wvsg4edry2g3iwktse",
    category: "AI-generated art",
    author: "InstillAI",
    recipe: {
      version: "v1alpha",
      components: [
        {
          id: "start",
          resource_name: null,
          resource: null,
          configuration: {
            metadata: {
              asset_creator: {
                title: "Asset Creator Name",
                type: "string",
                instillFormat: "string",
              },
              prompts: {
                title: "My Prompts",
                type: "array",
                instillFormat: "array:string",
                items: {
                  type: "string",
                },
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/start",
          operator_definition: null,
        },
        {
          id: "end",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              asset_urls: "{blockchain_1.output.asset_urls}",
              images: "{ai_1.output.images}",
            },
            metadata: {
              asset_urls: {
                title: "Web3 Asset URLs",
              },
              images: {
                title: "AI Generated Art",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/end",
          operator_definition: null,
        },
        {
          id: "ai_1",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              cfg_scale: 8,
              engine: "stable-diffusion-xl-1024-v1-0",
              prompts: "{start.prompts}",
              samples: 1,
              seed: 3347623882,
              steps: 30,
            },
            task: "TASK_TEXT_TO_IMAGE",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/stability-ai",
          connector_definition: null,
        },
        {
          id: "blockchain_1",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              abstract:
                "This is generated by Stability AI's {{ai_1.input.engine}} using prompt: {{start.prompts[0]}}",
              asset_creator: "{start.asset_creator}",
              custom: {
                digital_source_type: "trainedAlgorithmicMedia",
                generated_by: "Stability AI's {{ai_1.input.engine}}",
                generated_through: "Instill Cloud",
                license: {
                  document: "https://creativecommons.org/licenses/by-sa/4.0",
                  name: "CC BY-SA",
                },
                mining_preference: "notAllowed",
              },
              images: "{ai_1.output.images}",
            },
            task: "TASK_COMMIT",
          },
          type: "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN",
          definition_name: "connector-definitions/numbers",
          connector_definition: null,
        },
      ],
    },
  },
  {
    id: "Write cold outreach email",
    description:
      "This template can write your next email for you! All you have to do is feed it a few details.",
    category: "Copywriting",
    author: "InstillAI",
    recipe: {
      version: "v1alpha",
      components: [
        {
          id: "start",
          resource_name: null,
          resource: null,
          configuration: {
            metadata: {
              recipient: {
                title: "Recipient name",
                type: "string",
                instillFormat: "string",
              },
              recipient_company: {
                title: "Recipient company name",
                type: "string",
                instillFormat: "string",
              },
              sender: {
                title: "Sender name",
                type: "string",
                instillFormat: "string",
              },
              sender_company: {
                title: "Sender company name",
                type: "string",
                instillFormat: "string",
              },
              sender_role: {
                title: "Sender job title",
                type: "string",
                instillFormat: "string",
              },
              topic: {
                title: "Email topic",
                type: "string",
                instillFormat: "string",
              },
              word_number: {
                title: "Number of words",
                type: "number",
                instillFormat: "number",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/start",
          operator_definition: null,
        },
        {
          id: "end",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              email: "{ai_1.output.texts}",
            },
            metadata: {
              email: {
                title: "Email",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/end",
          operator_definition: null,
        },
        {
          id: "ai_1",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              model: "gpt-3.5-turbo",
              n: 1,
              prompt:
                "Write a cold outreach email in {{start.word_number}} word. The email introduces myself as {{start.sender}}, {{start.sender_role}} at {{start.sender_company}} to {{start.recipient}} at {{start.recipient_company}} and asks if they'd be interested in {{start.topic}}.",
              system_message:
                "You are a cold outreach email expert who writes  business emails.",
              temperature: 1,
            },
            task: "TASK_TEXT_GENERATION",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/openai",
          connector_definition: null,
        },
      ],
    },
  },
  {
    id: "Extract email keywords",
    description: "Extract the important details from an email using keywords.",
    category: "Extraction",
    author: "InstillAI",
    recipe: {
      version: "v1alpha",
      components: [
        {
          id: "start",
          resource_name: null,
          resource: null,
          configuration: {
            metadata: {
              email: {
                title: "Email",
                type: "string",
                instillFormat: "string",
              },
              key_info: {
                title: "Key information to extract (separate with commas)",
                type: "string",
                instillFormat: "string",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/start",
          operator_definition: null,
        },
        {
          id: "end",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              output: "{{ai_1.output.texts}}",
            },
            metadata: {
              output: {
                title: "Email Key information",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/end",
          operator_definition: null,
        },
        {
          id: "ai_1",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              model: "gpt-3.5-turbo",
              n: 1,
              prompt:
                "Extract {{start.key_info}} from this email:  {{start.email}}  {{start.key_info}}:",
              system_message:
                "You extract key information from emails and only output the extracted information.",
              temperature: 1,
            },
            task: "TASK_TEXT_GENERATION",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/openai",
          connector_definition: null,
        },
      ],
    },
  },
  {
    id: "Summarize article with guideline",
    description:
      "Provide guidelines for extracting key takeaways from an article",
    category: "Summarization",
    author: "InstillAI",
    recipe: {
      version: "v1alpha",
      components: [
        {
          id: "start",
          resource_name: null,
          resource: null,
          configuration: {
            metadata: {
              article: {
                title: "Article",
                type: "string",
                instillFormat: "string",
              },
              format: {
                title: "Summary format style (sentences or bullets)",
                type: "string",
                instillFormat: "string",
              },
              guideline: {
                title:
                  "Additional guideline for summary. e.g., focus on action points.  ",
                type: "string",
                instillFormat: "string",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/start",
          operator_definition: null,
        },
        {
          id: "end",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              summary: "{ai_1.output.texts}",
            },
            metadata: {
              summary: {
                title: "Summary",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/end",
          operator_definition: null,
        },
        {
          id: "ai_1",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              model: "gpt-3.5-turbo",
              n: 1,
              prompt:
                "Summarise the article in 3-5 {{start.format}}. The generated summary should {{start.guideline}}.  Article: {{start.article}} Summary:",
              system_message:
                "You summary articles and output the key takeaway.",
            },
            task: "TASK_TEXT_GENERATION",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/openai",
          connector_definition: null,
        },
      ],
    },
  },
  {
    id: "SEO article writer",
    description:
      "Generate high-quality AI written blog posts with target SEO keywords",
    category: "Copywriting",
    author: "InstillAI",
    recipe: {
      version: "v1alpha",
      components: [
        {
          id: "start",
          resource_name: null,
          resource: null,
          configuration: {
            metadata: {
              keywords: {
                title: "Generate a article optimized for this SEO Keywords",
                type: "string",
                instillFormat: "string",
              },
              section_number: {
                title: "How many sections would you like? (3-7 recommended)",
                type: "number",
                instillFormat: "number",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/start",
          operator_definition: null,
        },
        {
          id: "end",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              article: "{ai_1.output.texts}",
            },
            metadata: {
              article: {
                title: "Article",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/end",
          operator_definition: null,
        },
        {
          id: "ai_1",
          resource_name: null,
          resource: null,
          configuration: {
            input: {
              model: "gpt-3.5-turbo",
              n: 1,
              prompt:
                "Generate an article optimized for the SEO keywords in Markdown format. The article is structured into {{start.section_number}} sections.  SEO keywords: {{start.keywords}} Article:",
              system_message: "You are an article writer.",
            },
            task: "TASK_TEXT_GENERATION",
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/openai",
          connector_definition: null,
        },
      ],
    },
  },
];

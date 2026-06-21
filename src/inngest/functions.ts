import { inngest } from "./client";
import { Agent, createAgent, openai as agenticOpenAi } from "@inngest/agent-kit";
export const helloWorld = inngest.createFunction(
  {
    id: "hello-world"
    , triggers: [{ event: "test/hello.world" }]
  },
  async ({ event, step }) => {
    const contentCreatorAgent = createAgent({
      name: 'Content creator',
      system:
        'You are a expert summerizer , you are summerize in 10 words ',
      model: agenticOpenAi({ model: "gpt-4o" }),
    });
    const { output } = await contentCreatorAgent.run(
      "give me political opinion about youtube"
    )
    console.log(output);
    //await step.sleep("wait-a-moment", "15s");
    return { success: output };
  }
);

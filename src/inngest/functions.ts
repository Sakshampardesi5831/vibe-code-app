import { inngest } from "./client";
import { createAgent, openai as agenticOpenAi } from "@inngest/agent-kit";
import { Sandbox } from "e2b";

export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    triggers: [{ event: "test/hello.world" }]
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
    );
    console.log(output);

    const sandbox = await Sandbox.create('vibe-nextjs-test-2', {
      apiKey: process.env.E2B_API_KEY,
    });

    await sandbox.commands.run('/compile_page.sh', { background: true });

    const host = sandbox.getHost(3000);
    console.log(`https://${host}`);

    return { success: output, sandboxUrl: `https://${host}` };
  }
);

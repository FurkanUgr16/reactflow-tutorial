import { prisma } from "@/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        system: "You are a helpfull assistant",
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
        model: google("gemini-2.5-flash"),
      },
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        system: "You are a helpfull assistant",
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
        model: openai("gpt-5-mini-2025-08-07"),
      },
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        system: "You are a helpfull assistant",
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
        model: anthropic("claude-sonnet-4-6"),
      },
    );

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  },
);

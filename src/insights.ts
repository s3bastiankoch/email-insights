import { z } from 'zod';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { v4 as uuid } from 'uuid';

import { DB, categories, insights, keywords } from './db';

const insightsSchema = z.object({
  sentiment: z
    .enum(['very positive', 'positive', 'neutral', 'negative', 'very negative'])
    .describe("The sentiment of the email's content."),
  categories: z
    .array(z.enum(['feature request', 'bug report', 'feedback', 'question', 'unknown']))
    .describe('The categories of the email, can be multiple ones. Unknown when nothing else matches.'),
  keywords: z.array(z.string()).describe("The keywords of the email's content."),
  summary: z.string().describe("A precise summary of the email's content."),
});

export type Insights = z.infer<typeof insightsSchema>;

export const getInsights = async (message: string, apiKey: string) => {
  const parser = StructuredOutputParser.fromZodSchema(insightsSchema);

  const formatInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'You are presented with an email that a customer sent us, extract insights from the email: \n{message} \n{format_instructions}',
    inputVariables: ['message'],
    partialVariables: { format_instructions: formatInstructions },
  });

  const model = new OpenAI({ temperature: 0, openAIApiKey: apiKey });

  const input = await prompt.format({
    message,
  });
  const response = await model.call(input);

  const output = await parser.parse(response);

  return output;
};

export const saveInsights = async (db: DB, { categories: categoriesValue, keywords: keywordsValue, sentiment, summary }: Insights) => {
  const id = await db.transaction(async (tx) => {
    const insightId = uuid();

    await tx.insert(categories).values(categoriesValue.map((category) => ({ name: category, insightId })));
    await tx.insert(keywords).values(keywordsValue.map((keyword) => ({ name: keyword, insightId })));

    await tx.insert(insights).values({ id: insightId, sentiment, summary });

    return insightId;
  });

  return id;
};

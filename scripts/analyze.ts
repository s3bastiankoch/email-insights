import { config } from 'dotenv';
config();
import { getInsights, saveInsights } from '../src/insights';
import { createDb } from '../src/db';

const main = async () => {
  const insights = await getInsights("The app doesn't work on my phone.", process.env.OPENAI_API_KEY as string);

  const id = await saveInsights(createDb(process.env as unknown as Env), insights);
  console.log(id);
};

main();

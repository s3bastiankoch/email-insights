import PostalMime from 'postal-mime';
import { createDb } from './db';
import { getInsights, saveInsights } from './insights';

const streamToArrayBuffer = async (stream: ReadableStream, streamSize: number) => {
  const result = new Uint8Array(streamSize);
  let bytesRead = 0;
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result.set(value, bytesRead);
    bytesRead += value.length;
  }
  return result;
};

export default {
  async email(message: ForwardableEmailMessage, env: Env) {
    const rawEmail = await streamToArrayBuffer(message.raw, message.rawSize);
    const parser = new PostalMime();
    const { text } = await parser.parse(rawEmail);

    if (text) {
      const insights = await getInsights(text, env.OPENAI_API_KEY);

      await saveInsights(createDb(env), insights);
    }

    await message.forward(message.to);
  },
};

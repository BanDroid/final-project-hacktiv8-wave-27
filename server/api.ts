import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { GoogleGenAI } from "@google/genai";

export const api = new Hono();
api.post(
  "/generate-output",
  bodyLimit({
    maxSize: 5 * 1024 * 1024, // 5 MiB
    onError: (c) => {
      return c.json(
        {
          success: false,
          output: "File is HUMONGOUS! need to be less than 5 MiB",
        },
        413,
      );
    },
  }),
  async (c) => {
    const body = await c.req.parseBody();
    const prompt = body["prompt"] as string;
    const previousInteractionId = body["previousInteractionId"] as
      | string
      | null;

    if (prompt == "" || !prompt)
      return c.json({ success: false, output: "Bad Request" }, 400);

    const gemini = new GoogleGenAI({
      apiKey: (body["apiKey"] as string) || process.env.GEMINI_API_KEY,
    });

    const file = body["file"];
    if (file instanceof File) {
      // file uploaded
      const mediaType = body["mediaType"] as
        | "audio"
        | "document"
        | "image"
        | "video";
      const mimetype = body["mimetype"] as string;
      const base64Media = Buffer.from(await file.arrayBuffer()).toBase64();

      const interaction = await gemini.interactions.create({
        model: (body["model"] as string) || "gemini-3.5-flash-lite",
        system_instruction: (body["systemInstruction"] as string) || "",
        previous_interaction_id: previousInteractionId?.toString(),
        store: true,
        input: [
          {
            type: "text",
            text: prompt.trim(),
          },
          {
            type: mediaType,
            data: base64Media,
            mime_type: mimetype,
          },
        ],
      });
      return c.json(
        {
          success: true,
          output: interaction.output_text,
          interactionId: interaction.id,
        },
        200,
      );
    }

    // only text prompt
    const interaction = await gemini.interactions.create({
      model: "gemini-3.5-flash-lite",
      previous_interaction_id: body.previousInteractionId?.toString(),
      store: true,
      input: [
        {
          type: "text",
          text: prompt.trim(),
        },
      ],
    });
    return c.json(
      {
        success: true,
        output: interaction.output_text,
        interactionId: interaction.id,
      },
      200,
    );
  },
);

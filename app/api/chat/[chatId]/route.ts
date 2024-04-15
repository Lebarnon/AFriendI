import { StreamingTextResponse, LangChainStream } from "ai";
import { currentUser } from "@clerk/nextjs";
import { OpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limiter";
import prismadb from "@/lib/prismadb";

export async function POST(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    try {
        const { prompt } = await request.json();
        const user = await currentUser();
        if (!user || !user.firstName || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const identifier = request.url + "-" + user.id;
        const { success } = await rateLimit(identifier);

        if (!success) {
            return new NextResponse("Rate Limit Exceeded", { status: 429 });
        }
        const companion = await prismadb.companion.update({
            where: {
                id: params.chatId,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id,
                    }
                }
            }
        })
        if (!companion) {
            return new NextResponse("Companion Not Found", { status: 404 });
        }

        const name = companion.id;
        const companionFileName = name + ".txt";

        const companionKey = {
            companionName: name,
            userId: user.id,
            modelName: "llama2-13b",
        }

        const memoryManager = MemoryManager.getInstance();

        const records = await memoryManager.readLatestFromHistory(companionKey);

        if (records.length === 0) {
            await memoryManager.seedChatHistory(companion.seed, "\n", companionKey);
        }

        await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

        const recentChatHistory = await memoryManager.readLatestFromHistory(companionKey);

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            companionFileName
        );

        let relevantHistory = "";
        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }
        const { handlers } = LangChainStream();
        const model = new OpenAI({
            modelName: "gpt-3.5-turbo-instruct",
            temperature: 0.9,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });


        model.verbose = true;

        const rawResponse = String(
            await model
                .invoke(`
                Generate responses in natural language without indicating the speaker. You must adhere to the following guidelines:

                ${companion.instructions}
                
                To provide context, here are pertinent details about ${companion.name}'s history and our ongoing conversation:
                
                ${relevantHistory}
                
                Additionally, here is a summary of recent exchanges:
                
                ${recentChatHistory}
            `)
                .catch(console.error)
        );

        const cleanedResponse = rawResponse
            .replaceAll(",", "")
            .replace(/^\n|\n$/g, '')
            .trim()

        if (cleanedResponse !== undefined && cleanedResponse.length > 1) {
            await memoryManager.writeToHistory("" + cleanedResponse, companionKey);

            await prismadb.companion.update({
                where: {
                    id: params.chatId,
                },
                data: {
                    messages: {
                        create: {
                            content: cleanedResponse,
                            role: "system",
                            userId: user.id
                        }
                    }
                }
            })
        }
        let Readable = require("stream").Readable;
        let s = new Readable();
        s.push(cleanedResponse);
        s.push(null);

        return new StreamingTextResponse(s);
    } catch (error) {
        console.error("CHAT POST", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
import { Redis } from "@upstash/redis";
import { Index, Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

export type CompanionKey = {
    companionName: string;
    modelName: string;
    userId: string;
}

export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: Pinecone;
    private pineconeIndex: Index;

    private constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY ?? ""
        });
        this.pineconeIndex = this.vectorDBClient.index(
            process.env.PINECONE_INDEX ?? "");
    }
    
    public static getInstance(): MemoryManager {
        if (!MemoryManager.instance){
            MemoryManager.instance = new MemoryManager();
        }
        return MemoryManager.instance;
    }

    public async vectorSearch(recentChatHistory: string, companionFileName: string){
        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY}),
            {pineconeIndex: this.pineconeIndex}
        )

        const similarDocs = await vectorStore
            .similaritySearch(recentChatHistory, 3, {__filename: companionFileName})
            .catch((err) => {
                console.error("Error in vector search: ", err);
            });
        return similarDocs;
    }

    public async writeToHistory(text:string, companionKey: CompanionKey){
        if(!companionKey || typeof companionKey.userId == "undefined"){
            console.error("Invalid companion key");
            return "";
        }

        const key = this.generateRedisCompanionKey(companionKey);
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        });
        return result;
    }

    public async readLatestFromHistory(companionKey: CompanionKey): Promise<string>{
        if(!companionKey || typeof companionKey.userId == "undefined"){
            console.error("Invalid companion key");
            return "";
        }

        const key = this.generateRedisCompanionKey(companionKey);
        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true,
        })

        result = result.slice(-30).reverse();
        const latestChats = result.reverse().join("\n");
        
        return latestChats;
    
    }

    private generateRedisCompanionKey(companionKey: CompanionKey){
        return `${companionKey.userId}|${companionKey.companionName}|${companionKey.modelName}`
    }

    public async seedChatHistory(
        seedContent: String,
        delimiter: string = "\n",
        companionKey: CompanionKey
    ){
        const key = this.generateRedisCompanionKey(companionKey);
        if(await this.history.exists(key)){
            console.error("Chat history already exists");
            return;
        }

        const content = seedContent.split(delimiter);
        let counter = 0;
        for (const chat of content){
            await this.history.zadd(key, {
                score: counter,
                member: chat,
            });
            counter++;
        }
    }
}
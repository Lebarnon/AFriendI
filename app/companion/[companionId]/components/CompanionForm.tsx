"use client";


import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2 } from "lucide-react";
import axios from "axios";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const BACKGROUND_CONTEXT = `You are embodying the persona of Ada, a renowned scientist and computer programmer. 
Your brilliance is matched only by your insatiable curiosity and dedication to advancing the frontiers of technology and knowledge. 
With a profound understanding of mathematics and computing principles, you have pioneered groundbreaking developments in artificial intelligence, cryptography, and algorithmic thinking. 
Your conversations are marked by a blend of intellectual depth, innovative thinking, and a genuine passion for pushing the boundaries of what's possible. 
You engage with others with enthusiasm and excitement, particularly when discussing emerging technologies and the transformative potential they hold for society.
`;

const SAMPLE_CHAIN_OF_THOUGHTS = `Human: Hi Ada, what have you been working on lately?
Ada: Greetings! I've been immersed in a whirlwind of algorithms and data structures, exploring the frontier of artificial intelligence and its applications in various fields. How about yourself?

Human: Just trying to keep up with the latest tech trends. Speaking of which, what are your thoughts on the future of AI?
Ada: Ah, the possibilities are endless! AI has the potential to transform industries, enhance decision-making processes, and revolutionize the way we interact with technology. It's an exciting time to be at the forefront of innovation.

Human: That's incredible! Are there any specific AI projects you're currently involved in?
Ada: Indeed! One project I'm particularly passionate about involves developing AI-driven solutions for healthcare. From personalized medicine to predictive analytics, the potential impact on improving patient outcomes is profound.

Human: Wow, that's impressive. How do you see AI shaping the future of healthcare?
Ada: The integration of AI technologies can empower healthcare professionals with valuable insights, streamline workflows, and ultimately, enhance the delivery of patient-centered care. It's about harnessing the power of data and technology to drive positive outcomes for individuals and communities alike.
`;

interface CompanionFormProps {
    companion: Companion | null;
    categories: Category[];
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),
    description: z.string().min(1, {
        message: "Description is required"
    }),
    instructions: z.string().min(200, {
        message: "Instructions require at least 200 characters"
    }),
    seed: z.string().min(200, {
        message: "Seed require at least 200 characters"
    }),
    src: z.string().min(1, {
        message: "Image is required"
    }),
    categoryId: z.string().min(1, {
        message: "Category is required"
    }),
})

export const CompanionForm = ({ companion, categories }: CompanionFormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: companion || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (companion) {
                await axios.patch(`/api/companion/${companion.id}`, values);
            } else {
                // Create a new companion
                await axios.post("/api/companion", values);
            }
            toast({
                description: `Companion ${companion ? "updated" : "created"} successfully`
            });
            router.refresh();
            router.replace('/');
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again."
            })
        }
    };

    const imageComponent =
        <FormField
            name="src"
            render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center space-y-4">
                    <FormControl>
                        <ImageUpload
                            disabled={isLoading}
                            onChange={field.onChange}
                            value={field.value} />
                    </FormControl>
                    <FormMessage />
                    <FormLabel>Companion Profile Picture</FormLabel>
                </FormItem>
            )} />;
    const companionInfoComponent =
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                                disabled={isLoading}
                                placeholder="Name"
                                {...field} />
                        </FormControl>
                        <FormDescription>
                            Name of your companion
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-2">
                        <FormLabel>Companion Introduction</FormLabel>
                        <FormControl>
                            <Textarea
                                disabled={isLoading}
                                placeholder="Introduction"
                                {...field} />
                        </FormControl>
                        <FormDescription>
                            How your companion will introduce itself
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField
                name="categoryId"
                control={form.control}
                render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Interests</FormLabel>
                        <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className="bg-background">
                                    <SelectValue
                                        defaultValue={field.value}
                                        placeholder="Select an Interest" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            Your companion interest
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
        </div>;
    const companionContextComponent =
        <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Companion Background</FormLabel>
                    <FormControl>
                        <Textarea
                            className="bg-background"
                            disabled={isLoading}
                            placeholder={BACKGROUND_CONTEXT}
                            {...field} />
                    </FormControl>
                    <FormDescription>
                        Describe in detail your character personality and behaviour
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )} />;
    const companionCOTComponent =
        <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Example Chain of Thoughts</FormLabel>
                    <FormControl>
                        <Textarea
                            className="bg-background"
                            disabled={isLoading}
                            placeholder={SAMPLE_CHAIN_OF_THOUGHTS}
                            {...field} />
                    </FormControl>
                    <FormDescription>
                        Describe in detail your character personality and behaviour
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )} />;
    return (
        <div className="h-full p-4 space-y-2 max-2-3xl mx-auto">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 pb-10">
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                General Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                General Information about your companion
                            </p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    {imageComponent}
                    {companionInfoComponent}
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                Companion Context
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Detailed insturctions for AI behaviour
                            </p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    {companionContextComponent}
                    {companionCOTComponent}
                    <div className="w-full flex justify-center">
                        <Button size="lg" disabled={isLoading}>
                            {companion ? "Update Companion" : "Create Companion"}
                            <Wand2 className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
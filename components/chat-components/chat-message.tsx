"use client";

import { BeatLoader } from "react-spinners";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { ChatAvatar } from "@/components/chat-components/chat-avatar"
import { useUser } from "@clerk/nextjs";

export interface ChatMessageProps {
  role: "system" | "user",
  content?: string;
  isLoading?: boolean;
  src?: string;
}

export const ChatMessage = ({
  role,
  content,
  isLoading,
  src
}: ChatMessageProps) => {
  const { theme } = useTheme();
  const { user } = useUser();

  return (
    <div className={cn(
      "group flex items-start gap-x-3 py-4 w-full",
      role === "user" && "justify-end"
    )}>
      {role !== "user" && src && <ChatAvatar src={src} />}
      <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
        {isLoading 
          ? <BeatLoader color={theme === "light" ? "black" : "white"} size={5} /> 
          : content
        }
      </div>
      {role === "user" && <ChatAvatar src={user?.imageUrl || ""}/>}
    </div>
  )
}
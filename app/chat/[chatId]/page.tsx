import prismadb from "@/lib/prismadb"
import { auth, redirectToSignIn } from "@clerk/nextjs"
import { redirect, useRouter } from "next/navigation"
import ChatClient from "@/components/chat-components/chat-client"

interface ChatIdPageProps {
    params: {
        chatId: string
    }
}

const ChatIdPage = async  ({ params }: ChatIdPageProps) => {
    const { userId } = auth()
    
    if (!userId) {
        return redirectToSignIn();
    }

    const companion = await prismadb.companion.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc'
                },
                where: {
                    userId
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    })

    if (!companion) {
        return redirect("/")
    }

    await prismadb.friendList.upsert({
        where: {
            userId: userId
        },
        update: {
            companions: {
                connectOrCreate: {
                    where: {
                        id: params.chatId
                    },
                    create: {
                        id: params.chatId,
                        userId: userId,
                        companionId: params.chatId
                    }
                }
            }
        },
        create: {
            userId: userId,
            companions: {
                connectOrCreate: {
                    where: {
                        id: params.chatId
                    },
                    create: {
                        id: params.chatId,
                        userId: userId,
                        companionId: params.chatId
                    }
                }
            }
        }
    })

    return (
        <ChatClient companion={companion} />
    )
}

export default ChatIdPage;
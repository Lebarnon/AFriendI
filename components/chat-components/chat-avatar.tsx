import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ChatAvatarProps {
    src: string;
}

export const ChatAvatar = ({src}: ChatAvatarProps) => {
    return ( 
        <Avatar className="h-12 w-12">
            <AvatarImage src={src} />
        </Avatar>
     );
}
 
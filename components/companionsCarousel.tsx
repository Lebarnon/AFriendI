'use client'

import { Companion } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MessagesSquare } from "lucide-react";
import { Card, CardFooter, CardHeader, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from 'react'
import { type CarouselApi } from "@/components/ui/carousel"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Companions from "./companions";
import { shuffleArray } from "@/lib/shuffle";


interface CompanionsCarouselProps {
    data: Companion[]
}

export const CompanionsCarousel = ({ data }: CompanionsCarouselProps) => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    useEffect(() => {
        data = shuffleArray(data)
    }, [data])

    if (data.length === 0) {
        return (
            <div className="pt-10 flex flex-col items-center justify-center space-y-3">
                <div className="relative w-60 h-60">
                    <Image
                        fill
                        className="grayscale"
                        alt="Empty"
                        src="/empty.png" />
                </div>
                <p className="text-sm text-muted-foreground">No companions found</p>
            </div>
        )
    } else {
        return (
            <div className="pt-10 h-full max-h-full">

                <Carousel
                    opts={{
                        align: "start",

                    }}
                    setApi={setApi}
                    orientation="vertical"
                    className="w-full max-w-md mx-auto h-full"
                >
                    <CarouselContent className="-mt-1 h-[500px] md:h-[500px] lg:h-[600px]">
                        {data.map((companion, index) => {
                            return (
                                <CarouselItem key={companion.id} className="pt-1">
                                    <Card
                                        key={companion.id}
                                        className="bg-primary/10 rounder-xl cursor-pointer hover:opacity-75 transition border-0 h-full">
                                        <Link href={`/chat/${companion.id}`}>
                                            <CardHeader className="text-muted-foreground h-full p-0 m-0 rounded-lg">
                                                <div className="relative w-full h-[70%] rounded-lg">
                                                    <Image
                                                        fill
                                                        objectFit="cover"
                                                        alt={companion.name}
                                                        src={companion.src}
                                                        className="rounder-lg"
                                                        style={{
                                                            borderTopLeftRadius: '2.5%',
                                                            borderTopRightRadius: '2.5%',
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4 py-4">
                                                    <p className="text-bold text-xl">{companion.name}</p>
                                                    <Separator className="bg-white my-4 w-[50%] -mx-1" />
                                                    <p className="text-sm">{companion.description}</p>
                                                    <div className="text-right mr-4">
                                                        <Button variant="outline" size="icon">
                                                            <MessageCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Link>
                                    </Card>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    {current === 1 && data.length > 1 && (
                        <div className="text-center animate-bounce mt-4 text-gray-400">
                            Scroll down for more
                        </div>
                    )}
                    {current === data.length && data.length > 1 && (
                        <div className="text-center mt-4 text-gray-500">
                            End of List
                        </div>
                    )}
                </Carousel>
            </div>
        );
    }
}

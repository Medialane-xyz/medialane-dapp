"use client"

import { Card } from "@/components/ui/card"
import { Music, Image as ImageIcon, Video, Code, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const templates = [
    { id: "audio", name: "Audio Track", icon: Music },
    { id: "art", name: "Digital Art", icon: ImageIcon },
    { id: "video", name: "Video Clip", icon: Video },
    { id: "code", name: "Code Module", icon: Code },
    { id: "doc", name: "License Doc", icon: FileText },
]

export function QuickTemplates() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                    Quick Start Templates
                </h4>
                <Link href="/create/templates" className="text-xs text-primary hover:underline">
                    View Library
                </Link>
            </div>

            <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                    <Link href="/create/templates/new">
                        <Card className="min-w-[140px] h-[100px] flex flex-col items-center justify-center gap-2 border-dashed border-border bg-transparent hover:bg-accent/5 transition-colors cursor-pointer group">
                            <div className="p-2 rounded-full bg-accent/50 group-hover:bg-primary/20 text-muted-foreground group-hover:text-foreground transition-colors">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Custom</span>
                        </Card>
                    </Link>

                    {templates.map((template) => (
                        <Link href={`/create/templates/${template.id}`} key={template.id}>
                            <Card className="min-w-[140px] h-[100px] p-4 flex flex-col justify-between hover:border-primary/50 hover:bg-accent/5 transition-all cursor-pointer group">
                                <template.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {template.name}
                                </span>
                            </Card>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}

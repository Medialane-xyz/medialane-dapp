'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Calendar, Map, User } from 'lucide-react';
import { DROP_DATA } from '@/lib/data/drop-data';

export function CollectionInfo() {
    const { collection, roadmap, creator } = DROP_DATA;

    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-md border border-white/5">
                    <TabsTrigger value="about" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                        About
                    </TabsTrigger>
                    <TabsTrigger value="roadmap" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                        Roadmap
                    </TabsTrigger>
                    <TabsTrigger value="creator" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                        Creator
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                    <Card className="border-none bg-black/20 backdrop-blur-sm p-6 text-muted-foreground leading-relaxed">
                        <h3 className="text-xl font-bold text-foreground mb-4">{collection.name}</h3>
                        <p className="mb-4">
                            {collection.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {collection.tags.map(tag => (
                                <span key={tag} className="bg-white/5 px-2 py-1 rounded text-xs text-secondary-foreground">{tag}</span>
                            ))}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="roadmap" className="mt-6">
                    <Card className="border-none bg-black/20 backdrop-blur-sm p-6">
                        <ol className="relative border-l border-primary/30 ml-3 space-y-8">
                            {roadmap.map((item, idx) => (
                                <li key={idx} className="mb-10 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full -left-3 ring-4 ring-background">
                                        {idx % 2 === 0 ? <Calendar className="w-3 h-3 text-primary" /> : <Map className="w-3 h-3 text-primary" />}
                                    </span>
                                    <h3 className="font-semibold text-foreground">{item.title} <span className="text-xs opacity-50 ml-2">({item.date})</span></h3>
                                    <p className="mb-4 text-base font-normal text-muted-foreground">{item.description}</p>
                                </li>
                            ))}
                        </ol>
                    </Card>
                </TabsContent>

                <TabsContent value="creator" className="mt-6">
                    <Card className="border-none bg-black/20 backdrop-blur-sm p-6 flex items-center gap-6">
                        <Avatar className="h-20 w-20 border-2 border-primary/50">
                            <AvatarImage src={creator.avatar} />
                            <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">{creator.name}</h3>
                            <p className="text-muted-foreground mb-2">{creator.bio}</p>
                            <div className="flex gap-2 text-sm text-primary">
                                <a href={creator.socials.twitter} target="_blank" className="bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors">Twitter</a>
                                <a href={creator.socials.website} target="_blank" className="bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors">Website</a>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

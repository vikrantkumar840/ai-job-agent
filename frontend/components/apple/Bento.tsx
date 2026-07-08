"use client";

import { motion } from "framer-motion";
import {
    Brain,
    Search,
    FileText,
    Briefcase,
    Database,
    Sparkles,
} from "lucide-react";

const cards = [
    {
        title: "Semantic Job Search",
        icon: Search,
        desc: "Qdrant vector search understands resume meaning instead of keywords.",
        large: true,
    },
    {
        title: "AI Resume",
        icon: FileText,
        desc: "ATS optimized resume generation.",
    },
    {
        title: "Cover Letter",
        icon: Sparkles,
        desc: "Generated uniquely for every job.",
    },
    {
        title: "Interview",
        icon: Brain,
        desc: "AI prepares likely interview questions.",
    },
    {
        title: "LangGraph Workflow",
        icon: Database,
        desc: "Multi-agent orchestration pipeline.",
        wide: true,
    },
    {
        title: "Apply Faster",
        icon: Briefcase,
        desc: "Everything ready in minutes.",
    },
];

export default function Bento() {
    return (
        <section className="relative py-24">

            <div className="max-w-7xl mx-auto px-10">

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: .8 }}
                    className="mb-20"
                >

                    <p className="text-cyan-400 mb-3 uppercase tracking-[6px]">
                        Features
                    </p>

                    <h2 className="text-6xl font-bold">
                        Built for Modern Careers
                    </h2>

                    <p className="text-white/60 mt-5 max-w-3xl text-xl">
                        Every AI agent collaborates together to
                        automate the entire job application workflow.
                    </p>

                </motion.div>

                <div className="grid grid-cols-3 gap-8 auto-rows-[260px]">

                    {cards.map((card, index) => {

                        const Icon = card.icon;

                        return (

                            <motion.div
                                key={card.title}
                                initial={{
                                    opacity: 0,
                                    y: 60,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: index * .08,
                                    duration: .6,
                                }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                }}
                                className={`
                                    rounded-[32px]
                                    border
                                    border-white/10
                                    bg-white/5
                                    backdrop-blur-2xl
                                    p-8
                                    transition-all
                                    shadow-[0_0_50px_rgba(34,211,238,.08)]
                                    ${card.large ? "row-span-2" : ""}
                                    ${card.wide ? "col-span-2" : ""}
                                `}
                            >

                                <div className="flex justify-between">

                                    <Icon
                                        size={42}
                                        className="text-cyan-400"
                                    />

                                    <div className="w-14 h-14 rounded-full bg-cyan-500/10" />

                                </div>

                                <h3 className="text-2xl font-semibold mt-10">
                                    {card.title}
                                </h3>

                                <p className="text-white/60 mt-4 leading-7">
                                    {card.desc}
                                </p>

                            </motion.div>

                        );

                    })}

                </div>

            </div>

        </section>
    );
}

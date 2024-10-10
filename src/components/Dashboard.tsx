import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import { HiServerStack,HiMiniUsers  } from "react-icons/hi2";
import { IoGitNetworkOutline } from "react-icons/io5";
import { CiStreamOn } from "react-icons/ci";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import '@/css/pie.css';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartData1 = [
    { browser: "safari", value: 5, fill: "var(--color-safari)" },
]
const chartData2 = [
    { browser: "safari", value: 3, fill: "var(--color-safari)" },
]
const chartData3 = [
    { browser: "safari", value: 732, fill: "var(--color-safari)" },
]
const chartData4 = [
    { browser: "safari", value: 14, fill: "var(--color-safari)" },
]
  
  
const chartConfig1 = {
    value: {
    label: "Nodes",
    },
    safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const chartConfig2 = {
    value: {
    label: "Edges",
    },
    safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const chartConfig3 = {
    value: {
    label: "Users",
    },
    safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const chartConfig4 = {
    value: {
    label: "Streams",
    },
    safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig




export const Dashboard = () => {
    return (
        <>
            <div className="relative flex flex-col lg:flex-row gap-6 py-12">
                <DotPattern
                    className={cn(
                    "[mask-image:radial-gradient(circle_at_center,white,transparent)]", "h-full pt-3"
                    )}
                />
              <div className='relative z-10 lg:w-1/4 bg-slate-50 h-full rounded-md flex items-center justify-between p-8 gap-6'>
                <div className='flex flex-col gap-12 w-full items-center h-full'>
                    <div className='flex gap-6 w-full'>
                        <HiServerStack size={60} />
                        <div className='flex flex-col'>
                            <p className='text-sm italic text-slate-400'>Nodes</p>
                            <p className='text-3xl font-semibold'>5</p>
                        </div>
                    </div>
                 
                    <ChartContainer
                        config={chartConfig1}
                        className="mx-auto aspect-square"
                        >
                        <RadialBarChart
                            data={chartData1}
                            endAngle={100}
                            innerRadius={80}
                            outerRadius={140}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar dataKey="value" background />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-4xl font-bold"
                                        >
                                        {chartData1[0].value.toLocaleString()}
                                        </tspan>
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                        >
                                        Nodes
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                        </ChartContainer>
                </div>
              </div>
              <div className='relative z-10 lg:w-1/4 bg-slate-50 h-full rounded-md flex items-center justify-between p-8 gap-6'>
                <div className='flex flex-col gap-12 items-center w-full h-full'>
                    <div className='flex gap-6 w-full'>
                        <IoGitNetworkOutline size={60} />
                        <div className='flex flex-col'>
                            <p className='text-sm italic text-slate-400'>Edges</p>
                            <p className='text-3xl font-semibold'>5</p>
                        </div>
                    </div>
                    <ChartContainer
                        config={chartConfig2}
                        className="mx-auto aspect-square"
                        >
                        <RadialBarChart
                            data={chartData2}
                            endAngle={100}
                            innerRadius={80}
                            outerRadius={140}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar dataKey="value" background />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-4xl font-bold"
                                        >
                                        {chartData2[0].value.toLocaleString()}
                                        </tspan>
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                        >
                                        Edges
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                        </ChartContainer>
                </div>
              </div>
              <div className='relative z-10 lg:w-1/4 bg-slate-50 h-full rounded-md flex items-center justify-between p-8 gap-6'>
                <div className='flex flex-col gap-12 items-center w-full h-full'>
                    <div className='flex gap-6 w-full'>
                        <HiMiniUsers size={60} />
                        <div className='flex flex-col'>
                            <p className='text-sm italic text-slate-400'>Users</p>
                            <p className='text-3xl font-semibold'>4.450</p>
                        </div>
                    </div>
                    <ChartContainer
                        config={chartConfig3}
                        className="mx-auto aspect-square"
                        >
                        <RadialBarChart
                            data={chartData3}
                            endAngle={100}
                            innerRadius={80}
                            outerRadius={140}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar dataKey="value" background />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-4xl font-bold"
                                        >
                                        {chartData3[0].value.toLocaleString()}
                                        </tspan>
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                        >
                                        Users
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                        </ChartContainer>
                </div>
              </div>
              <div className='relative z-10 lg:w-1/4 bg-slate-50 h-full rounded-md flex items-center justify-between p-8 gap-6'>
                <div className='flex flex-col gap-12 items-center w-full h-full'>
                    <div className='flex gap-6 w-full'>
                        <CiStreamOn size={60} />
                        <div className='flex flex-col'>
                            <p className='text-sm italic text-slate-400'>Streams</p>
                            <p className='text-3xl font-semibold'>145</p>
                        </div>
                    </div>
                    <ChartContainer
                        config={chartConfig4}
                        className="mx-auto aspect-square"
                        >
                        <RadialBarChart
                            data={chartData4}
                            endAngle={100}
                            innerRadius={80}
                            outerRadius={130}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar dataKey="value" background />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-4xl font-bold"
                                        >
                                        {chartData4[0].value.toLocaleString()}
                                        </tspan>
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                        >
                                        Streams
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                        </ChartContainer>
                </div>
              </div>
            </div>
            </>
    )
  }
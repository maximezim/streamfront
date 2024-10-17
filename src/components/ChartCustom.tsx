import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { motion } from "framer-motion";


interface ChartCustomProps {
    label: String,
    color: String,
    data: number,
    max: number,
    delay: number
}



export const ChartCustom = ({label,color,data,max,delay} : ChartCustomProps) => {

    const chartData = [
        { browser: "safari", value: data, fill: color },
    ]
    
    const chartConfig = {
        value: {
            label: label,
        },
        safari: {
            label: "Safari",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

    const pourcentage = 90 - ((data/max)*100*360)/100

    return(
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 40,
                delay: delay
            }}>
           
    <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square"
        >
        <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={pourcentage}
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
            <RadialBar dataKey="value" background animationBegin={delay*1000}/>
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
                        {chartData[0].value.toLocaleString()}
                        </tspan>
                        <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                        >
                        {label}
                        </tspan>
                    </text>
                    )
                }
                }}
            />
            </PolarRadiusAxis>
        </RadialBarChart>
        </ChartContainer>
        </motion.div>
)}
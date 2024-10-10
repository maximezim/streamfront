import { HiServerStack,HiMiniUsers  } from "react-icons/hi2";
import { IoGitNetworkOutline } from "react-icons/io5";
import { CiStreamOn } from "react-icons/ci";
import { ChartCustom } from "@/components/ChartCustom";

import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import '@/css/pie.css';

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
                    <ChartCustom label={"Nodes"} data={5} max={15} color={"hsl(var(--chart-2))"} delay={0.2} />
                    
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
                    <ChartCustom label={"Edges"} data={5} max={12} color={"hsl(var(--chart-3))"} delay={0.4} />
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
                    <ChartCustom label={"Users"} data={4450} max={5000} color={"hsl(var(--chart-4))"} delay={0.6} />
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
                    <ChartCustom label={"Streams"} data={145} max={200} color={"hsl(var(--chart-5))"} delay={0.8} />
                </div>
              </div>
            </div>
            </>
    )
  }
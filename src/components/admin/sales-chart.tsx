"use client";

import { Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const data = [
    { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
    { name: "May", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];

export function SalesChart() {
    const [period, setPeriod] = useState("7d");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _p = period;

    return (
        <Card className="h-[400px]">
            <CardHeader className="flex justify-between items-center px-6 py-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">Revenue Overview</h3>
                    <p className="text-sm text-default-500">Sales performance over time</p>
                </div>
                <div className="w-32">
                    <Select
                        size="sm"
                        defaultSelectedKeys={["7d"]}
                        aria-label="Select period"
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <SelectItem key="7d">Last 7 days</SelectItem>
                        <SelectItem key="30d">Last 30 days</SelectItem>
                        <SelectItem key="90d">Last 3 months</SelectItem>
                    </Select>
                </div>
            </CardHeader>
            <CardBody className="px-2 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#006FEE" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#006FEE" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--nextui-default-200))" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(var(--nextui-default-500))", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(var(--nextui-default-500))", fontSize: 12 }}
                            tickFormatter={(value: number) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--nextui-background))",
                                border: "1px solid hsl(var(--nextui-default-200))",
                                borderRadius: "12px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                            }}
                            itemStyle={{ color: "hsl(var(--nextui-foreground))" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="uv"
                            stroke="#006FEE"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorUv)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
}

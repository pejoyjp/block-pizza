"use client"
import React from "react";
import useSWR from "swr";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUserId from "@/hooks/userUserId";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

const Chart = () => {
    const { data, error } = useSWR("allOrders", async () => {
        const response = await fetch('/api/orders');
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch orders');
        }
        return result;
    });
    const { data: allOrderPizzas,isLoading } = useSWR("allOrderPizzas", async () => {
        const response = await fetch('/api/orders/pizzas');
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch order pizzas');
        }
        return result;
    });
    const { userId } = useUserId();

    const { data: user } = useUser(userId);

    const route = useRouter();

    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;
    if(isLoading) return <div>Loading...</div>;

    // Function to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Counting the number of orders for each status
    const statusCounts = data?.orders?.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

    // Converting statusCounts to an array of objects
    const statusData = Object.keys(statusCounts).map((status) => ({
        name: status,
        value: statusCounts[status],
    }));

    // Summing up total prices for each user
    const totalPriceByUser = data?.orders?.reduce((acc, order) => {
        acc[order.user_id] = (acc[order.user_id] || 0) + parseFloat(order.total_price);
        return acc;
    }, {});

    // Converting totalPriceByUser to an array of objects
    const priceData = Object.keys(totalPriceByUser).map((userId) => ({
        user_id: userId,
        total_price: totalPriceByUser[userId],
    }));

    // Grouping orders by date
    const ordersByDate = data?.orders?.reduce((acc, order) => {
        const date = formatDate(order.created_at); // Formatting date
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    // Converting ordersByDate to an array of objects
    const ordersData = Object.keys(ordersByDate).map((date) => ({
        date,
        orders: ordersByDate[date],
    }));

    // Counting the number of orders for each pizza
    const pizzaCounts = allOrderPizzas?.data?.reduce((acc, pizza) => {
        acc[pizza.pizza_id] = (acc[pizza.pizza_id] || 0) + 1;
        return acc;
    }, {});

    // Sorting pizzas by sales count and getting top 5
    const topPizzas = Object.keys(pizzaCounts)
        .sort((a, b) => pizzaCounts[b] - pizzaCounts[a])
        .slice(0, 5)
        .map((pizzaId) => ({
            pizza_id: pizzaId,
            sales: pizzaCounts[pizzaId],
        }));

    // Converting topPizzas to an array of objects
    const topPizzasData = topPizzas.map((pizza) => ({
        name: `PizzaId ${pizza.pizza_id}`,
        sales: pizza.sales,
    }));

    // Grouping orders by hour of day
    const ordersByHour = data?.orders?.reduce((acc, order) => {
        const hour = new Date(order.created_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {});

    // Converting ordersByHour to an array of objects
    const ordersByHourData = Object.keys(ordersByHour).map((hour) => ({
        hour,
        orders: ordersByHour[hour],
    }));

    // Counting the number of pizzas sold by size
    const sizeCounts = allOrderPizzas?.data?.reduce((acc, pizza) => {
        acc[pizza.size] = (acc[pizza.size] || 0) + 1;
        return acc;
    }, {});

    // Converting sizeCounts to an array of objects
    const sizeData = Object.keys(sizeCounts).map((size) => {
        let sizeLabel = "";
        switch (size) {
            case "M":
                sizeLabel = "6 Inch";
                break;
            case "L":
                sizeLabel = "9 Inch";
                break;
            case "XL":
                sizeLabel = "12 Inch";
                break;
            default:
                break;
        }
        
        return {
            size: sizeLabel,
            sales: sizeCounts[size],
        };
    });

    

    if (user?.user?.role !== "admin") {
        route.push("/");
    }

    return (
        <Tabs className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10" defaultValue="pieChart">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">Charts</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                <TabsList className="grid grid-cols-2 bg-transparent">
                    <div>
                        <TabsTrigger value="pieChart">Pie Chart of Order Statuses </TabsTrigger>
                        <TabsTrigger value="barChart">Bar Chart of Total Prices by User</TabsTrigger>
                        <TabsTrigger value="lineChart">Line Chart of Order Count Over Time</TabsTrigger>
                        <TabsTrigger value="topPizzas">Top 5 Selling Pizzas</TabsTrigger>
                        <TabsTrigger value="orderTimePreference">Order Time Preference</TabsTrigger>
                        <TabsTrigger value="pizzaSizeSales">Pizza Size Sales</TabsTrigger>
                    </div>
                </TabsList>

                <div className="grid gap-6">
                    <TabsContent value="pieChart">
                        <PieChart width={400} height={300}>
                            <Pie
                                dataKey="value"
                                data={statusData}
                                cx={200}
                                cy={150}
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </TabsContent>

                    <TabsContent value="barChart">
                        <BarChart width={600} height={300} data={priceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="user_id" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total_price" fill="#8884d8" />
                        </BarChart>
                    </TabsContent>

                    <TabsContent value="lineChart">
                        <LineChart width={600} height={300} data={ordersData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                        </LineChart>
                    </TabsContent>

                    <TabsContent value="topPizzas">
                        <BarChart width={600} height={300} data={topPizzasData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#8884d8" />
                        </BarChart>
                    </TabsContent>

                    <TabsContent value="orderTimePreference">
                        <LineChart width={600} height={300} data={ordersByHourData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                        </LineChart>
                    </TabsContent>

                    <TabsContent value="pizzaSizeSales">
                        <BarChart width={600} height={300} data={sizeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="size" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#8884d8" />
                        </BarChart>
                    </TabsContent>
                </div>
            </div>
        </Tabs>
    );
};

export default Chart;

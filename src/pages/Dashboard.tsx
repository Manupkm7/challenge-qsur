import { useState, useEffect } from "react"
import { Card } from "@/components/Cards/Card"
import { useRecoilState, useRecoilValue } from "recoil"
import { salesByMonthState, totalSalesState } from "@/store/salesAtoms"
import { filtersAtom } from "../atoms"
import { FaDollarSign as DollarSign } from "@react-icons/all-files/fa/FaDollarSign";
import { FaUser as Users } from "@react-icons/all-files/fa/FaUser";
import { FaChartLine as Activity } from "@react-icons/all-files/fa/FaChartLine";
import { FaCalendar as Calendar } from "@react-icons/all-files/fa/FaCalendar";

import ReactApexChart from "react-apexcharts"
import { TabContent, TabsList, TabTitle } from "@/components/Tabs"
import { TabsRoot } from "@/components/Tabs"

// Categories for x-axis (months)
const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export default function DashboardPage() {
    const [filters, setFilters] = useRecoilState(filtersAtom)
    const [activeTab, setActiveTab] = useState("tab1")

    // Get sales data from the store
    const totalSales = useRecoilValue(totalSalesState)
    const salesByMonth = useRecoilValue(salesByMonthState)

    // Generate mock data for users and activity
    const generateMockData = (months = 12, variation = 0.3) => {
        const baseValue = 1000
        const data = []

        for (let i = 0; i < months; i++) {
            const randomFactor = 1 + (Math.random() * variation * 2 - variation)
            data.push(Math.round(baseValue * randomFactor))
        }

        return data
    }

    const [chartData, setChartData] = useState({
        sales: Array(12).fill(0),
        users: generateMockData(),
        activity: generateMockData(),
    })

    // Update chart data when filters change or sales data changes
    useEffect(() => {
        // Get real sales data from the store
        const salesData = months.map((month) => salesByMonth[month] || 0)

        // Determine time range based on sort filter
        const monthsToShow = filters.sort.value === "recent" ? 12 : filters.sort.value === "oldest" ? 6 : 3

        // Apply status filter (in a real app, this would filter by actual status)
        const variationFactor = filters.status.value === "all" ? 0.4 : filters.status.value === "active" ? 0.3 : 0.2

        // Generate new data based on filters
        setChartData({
            sales: salesData,
            users: generateMockData(monthsToShow, variationFactor * 0.5),
            activity: generateMockData(monthsToShow, variationFactor * 1.2),
        })
    }, [filters, salesByMonth])

    // Apply search filter (in a real app, this would search through actual data)
    useEffect(() => {
        if (filters.search) {
            // Simulate search by reducing data values for demonstration
            const searchFactor = 0.7
            setChartData((prevData) => ({
                sales: prevData.sales, // Don't modify real sales data
                users: prevData.users.map((val) => Math.round(val * searchFactor)),
                activity: prevData.activity.map((val) => Math.round(val * searchFactor)),
            }))
        }
    }, [filters.search])

    // Determine visible months based on sort filter (time range)
    const visibleMonths =
        filters.sort.value === "recent" ? months : filters.sort.value === "oldest" ? months.slice(0, 6) : months.slice(0, 3)

    // Chart options for sales
    const salesChartOptions = {
        chart: {
            type: "area" as const,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth" as const,
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
            },
        },
        xaxis: {
            categories: visibleMonths,
        },
        tooltip: {
            y: {
                formatter: (val: number) => `€${val.toFixed(2)}`,
            },
        },
        yaxis: {
            labels: {
                formatter: (val: number) => `€${val.toFixed(0)}`,
            },
        },
    }

    // Chart options for users
    const usersChartOptions = {
        chart: {
            type: "bar" as const,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "25%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: visibleMonths,
        },
        colors: ["#6366f1"],
    }

    // Chart options for activity
    const activityChartOptions = {
        chart: {
            type: "line" as const,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "straight" as const,
            width: 5,
        },
        markers: {
            size: 5,
        },
        xaxis: {
            categories: visibleMonths,
        },
        colors: ["#10b981"],
    }

    // Get filter descriptions for display
    const getFilterDescription = () => {
        const parts = []

        if (filters.status.value !== "all") {
            parts.push(`Estado: ${filters.status.value === "active" ? "Activo" : "Inactivo"}`)
        }

        if (filters.sort.value !== "recent") {
            parts.push(`Ordenado por: ${filters.sort.value === "oldest" ? "Más antiguos" : "Nombre"}`)
        }

        if (filters.search) {
            parts.push(`Búsqueda: "${filters.search}"`)
        }

        return parts.length > 0 ? `Filtrado por: ${parts.join(", ")}` : "Mostrando todos los datos"
    }

    return (
        <div className="flex-1 space-y-4 px-[12px] py-[12px] overflow-y-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">{getFilterDescription()}</p>
            </div>

            <div className="grid gap-2 grid-cols-4">
                <Card className="bg-white" title="Ventas Totales" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}>
                    <div>
                        <div className="text-2xl font-bold">€{totalSales.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +{Math.floor(Math.random() * 20) + 5}% desde el último período
                        </p>
                    </div>
                </Card>

                <Card className="bg-white" title="Nuevos Usuarios" icon={<Users className="h-4 w-4 text-muted-foreground" />}>
                    <div>
                        <div className="text-2xl font-bold">{chartData.users.reduce((a, b) => a + b, 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +{Math.floor(Math.random() * 15) + 2}% desde el último período
                        </p>
                    </div>
                </Card>
                <Card className="bg-white" title="Actividad" icon={<Activity className="h-4 w-4 text-muted-foreground" />}>
                    <div>
                        <div className="text-2xl font-bold">{chartData.activity.reduce((a, b) => a + b, 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +{Math.floor(Math.random() * 25) + 10}% desde el último período
                        </p>
                    </div>
                </Card>
                <Card className="bg-white" title="Periodo" icon={<Calendar className="h-4 w-4 text-muted-foreground" />}>
                    <div>
                        <div className="text-2xl font-bold">
                            {filters.sort.value === "recent" ? "12 meses" : filters.sort.value === "oldest" ? "6 meses" : "3 meses"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                </Card>
            </div>

            <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabTitle
                        value="tab1"
                        trigger="Información General"
                    />
                    <TabTitle
                        value="tab2"
                        trigger="Detalles"
                    />
                    <TabTitle
                        value="tab3"
                        trigger="Historial"
                    />
                </TabsList>

                <TabContent value="tab1" className="p-4 bg-white rounded-md shadow">
                    <Card className="bg-white" title="Ventas Mensuales" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} description="Análisis de ventas para el período seleccionado">
                        <div>
                            {typeof window !== "undefined" && (
                                <ReactApexChart
                                    options={salesChartOptions}
                                    series={[{ name: "Ventas", data: chartData.sales }]}
                                    type="area"
                                    height={250}
                                />
                            )}
                        </div>
                    </Card>
                </TabContent>

                <TabContent value="tab2" className="p-4 bg-white rounded-md shadow">
                    <Card className="bg-white" title="Nuevos Usuarios" icon={<Users className="h-4 w-4 text-muted-foreground" />} description="Usuarios registrados por mes">
                        <div>
                            {typeof window !== "undefined" && (
                                <ReactApexChart
                                    options={usersChartOptions}
                                    series={[{ name: "Usuarios", data: chartData.users }]}
                                    type="bar"
                                    height={250}
                                />
                            )}
                        </div>
                    </Card>
                </TabContent>

                <TabContent value="tab3" className="p-4 bg-white rounded-md shadow">
                    <Card className="bg-white" title="Actividad" icon={<Users className="h-4 w-4 text-muted-foreground" />} description="Métricas de actividad en la plataforma">
                        <div>
                            {typeof window !== "undefined" && (
                                <ReactApexChart
                                    options={activityChartOptions}
                                    series={[{ name: "Actividad", data: chartData.activity }]}
                                    type="line"
                                    height={250}
                                />
                            )}
                        </div>
                    </Card>

                </TabContent>
            </TabsRoot>
        </div >
    )
}


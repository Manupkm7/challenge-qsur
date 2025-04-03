import { useState, useEffect } from "react"
import { Card } from "@/components/Cards/Card"
import { useRecoilValue } from "recoil"
import { salesByMonthState, totalSalesState, soldItemsState } from "@/store/salesAtoms"
import { filtersAtom } from "../atoms"
import { FaDollarSign as DollarSign } from "@react-icons/all-files/fa/FaDollarSign";
import { FaCalendar as Calendar } from "@react-icons/all-files/fa/FaCalendar";

import ReactApexChart from "react-apexcharts"
import { TabContent, TabsList, TabTitle } from "@/components/Tabs"
import { TabsRoot } from "@/components/Tabs"
import { useSales } from "@/hooks/useSales"

// Categories for x-axis (months)
const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export default function DashboardPage() {
    const filters = useRecoilValue(filtersAtom)
    const [activeTab, setActiveTab] = useState("tab1")
    const soldItems = useRecoilValue(soldItemsState)

    // Get sales data from the store
    const totalSales = useRecoilValue(totalSalesState)
    const salesByMonth = useRecoilValue(salesByMonthState)

    const [chartData, setChartData] = useState({
        sales: Array(12).fill(0),
        salesCount: Array(12).fill(0),
    })
    console.log(soldItems, "soldItems", salesByMonth, "salesByMonth", totalSales, "totalSales")
    // Update chart data when filters change or sales data changes
    useEffect(() => {
        // Get real sales data from the store
        const salesData = months.map((month) => salesByMonth[month] || 0)

        // Calcular la cantidad de ventas por mes
        const salesCountData = months.map((month, index) => {
            const monthSales = soldItems
                .filter(item => {
                    const saleDate = new Date(item.soldAt)
                    return saleDate.getMonth() === index
                })
                .reduce((total, item) => total + 1, 0) // Cada item es una venta individual
            return monthSales
        })

        // Generate new data based on filters
        setChartData({
            sales: salesData,
            salesCount: salesCountData,
        })
    }, [filters, salesByMonth, soldItems])

    // Apply search filter (in a real app, this would search through actual data)
    useEffect(() => {
        if (filters.search) {
            setChartData((prevData) => ({
                sales: prevData.sales, // Don't modify real sales data
                salesCount: prevData.salesCount,
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

    // Chart options for sales count
    const salesCountChartOptions = {
        chart: {
            type: "bar" as const,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "50%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: visibleMonths,
        },
        colors: ["#6366f1"],
        yaxis: {
            title: {
                text: "Ventas Individuales"
            }
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} ventas individuales`,
            },
        },
    }

    const { getAverageSalesFromJanuary } = useSales()
    const averageSales = getAverageSalesFromJanuary()

    return (
        <div className="flex-1 space-y-4 px-[12px] py-[12px] overflow-y-auto" data-testid="dashboard">
            <div className="grid gap-2 grid-cols-2">
                <Card className="bg-white" title="Ventas Totales" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}>
                    <div>
                        <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +{averageSales.toFixed(2)}% desde el último período
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
                    <Card
                        className="bg-white"
                        title="Ventas Individuales"
                        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                        description="Número de transacciones de venta realizadas por mes"
                    >
                        <div>
                            {typeof window !== "undefined" && (
                                <ReactApexChart
                                    options={salesCountChartOptions}
                                    series={[{ name: "Transacciones", data: chartData.salesCount }]}
                                    type="bar"
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


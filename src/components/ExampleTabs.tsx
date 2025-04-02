import { TabsRoot, TabsList, TabTitle, TabContent } from "./Tabs"
import { useState } from "react"

export const ExampleTabs = () => {
    const [activeTab, setActiveTab] = useState("tab1")

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabTitle 
                        value="tab1" 
                        trigger="Información General"
                        icon={<span>📋</span>}
                    />
                    <TabTitle 
                        value="tab2" 
                        trigger="Detalles"
                        icon={<span>🔍</span>}
                    />
                    <TabTitle 
                        value="tab3" 
                        trigger="Historial"
                        icon={<span>📅</span>}
                    />
                </TabsList>

                <TabContent value="tab1" className="p-4 bg-white rounded-md shadow">
                    <h2 className="text-xl font-semibold mb-4">Información General</h2>
                    <p>Este es el contenido de la primera pestaña. Aquí puedes mostrar información general del producto.</p>
                </TabContent>

                <TabContent value="tab2" className="p-4 bg-white rounded-md shadow">
                    <h2 className="text-xl font-semibold mb-4">Detalles</h2>
                    <div className="space-y-2">
                        <p>• Precio: $99.99</p>
                        <p>• Stock: 150 unidades</p>
                        <p>• Categoría: Electrónicos</p>
                    </div>
                </TabContent>

                <TabContent value="tab3" className="p-4 bg-white rounded-md shadow">
                    <h2 className="text-xl font-semibold mb-4">Historial</h2>
                    <div className="space-y-2">
                        <p>• Creado: 01/01/2024</p>
                        <p>• Última actualización: 15/03/2024</p>
                        <p>• Estado: Activo</p>
                    </div>
                </TabContent>
            </TabsRoot>
        </div>
    )
} 
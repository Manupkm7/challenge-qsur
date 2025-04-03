import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot, useRecoilValue } from 'recoil'
import DashboardPage from '../Dashboard'
import { salesByMonthState, totalSalesState, soldItemsState } from '@/store/salesAtoms'
import { useSales } from '@/hooks/useSales'
import { filtersAtom } from '@/atoms/index'


const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <RecoilRoot>
        {component}
      </RecoilRoot>
    </BrowserRouter>
  )
}

describe('DashboardPage', () => {
  const mockSoldItems = [
    { id: 1, title: 'Item 1', price: 100, soldAt: '2024-01-15T10:00:00' },
    { id: 2, title: 'Item 2', price: 200, soldAt: '2024-02-20T11:00:00' },
    { id: 3, title: 'Item 3', price: 300, soldAt: '2024-03-25T12:00:00' }
  ]

  const mockSalesByMonth = {
    'Ene': 100,
    'Feb': 200,
    'Mar': 300,
    'Abr': 0,
    'May': 0,
    'Jun': 0,
    'Jul': 0,
    'Ago': 0,
    'Sep': 0,
    'Oct': 0,
    'Nov': 0,
    'Dic': 0
  }

  const mockTotalSales = 600
  const mockAverageSales = 15.5

  beforeEach(() => {
    // Configurar mocks
    ;(useRecoilValue as jest.Mock).mockImplementation((atom) => {
      if (atom === soldItemsState) return mockSoldItems
      if (atom === salesByMonthState) return mockSalesByMonth
      if (atom === totalSalesState) return mockTotalSales
      if (atom === filtersAtom) return { status: { value: 'all' }, search: '', sort: { value: 'recent' } }
      return null
    })

    ;(useSales as jest.Mock).mockReturnValue({
      getAverageSalesFromJanuary: () => mockAverageSales
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente el dashboard', () => {
    renderWithProviders(<DashboardPage />)
    
    // Verificar que se muestran las tarjetas de estadísticas
    expect(screen.getByText('Ventas Totales')).toBeInTheDocument()
    expect(screen.getByText('Periodo')).toBeInTheDocument()
    
    // Verificar que se muestran los valores correctos
    expect(screen.getByText('$600')).toBeInTheDocument()
    expect(screen.getByText('12 meses')).toBeInTheDocument()
    expect(screen.getByText('+15.50% desde el último período')).toBeInTheDocument()
  })

  it('renderiza los gráficos correctamente', () => {
    renderWithProviders(<DashboardPage />)
    
    // Verificar que se muestran los gráficos
    const charts = screen.getAllByTestId('chart')
    expect(charts).toHaveLength(2)
    
    // Verificar que el primer gráfico es de tipo área
    expect(charts[0].getAttribute('data-type')).toBe('area')
    
    // Verificar que el segundo gráfico es de tipo barra
    expect(charts[1].getAttribute('data-type')).toBe('bar')
  })

  it('cambia entre pestañas correctamente', () => {
    renderWithProviders(<DashboardPage />)
    
    // Verificar que la pestaña "Información General" está activa por defecto
    expect(screen.getByTestId('active-tab')).toHaveTextContent('tab1')
    
    // Cambiar a la pestaña "Detalles"
    const detailsTab = screen.getByTestId('tab-tab2')
    fireEvent.click(detailsTab)
    
    // Verificar que la pestaña "Detalles" está activa
    expect(screen.getByTestId('active-tab')).toHaveTextContent('tab2')
  })

  it('muestra el período correcto según el filtro de orden', () => {
    // Cambiar el filtro de orden a "oldest"
    ;(useRecoilValue as jest.Mock).mockImplementation((atom) => {
      if (atom === soldItemsState) return mockSoldItems
      if (atom === salesByMonthState) return mockSalesByMonth
      if (atom === totalSalesState) return mockTotalSales
      if (atom === filtersAtom) return { status: { value: 'all' }, search: '', sort: { value: 'oldest' } }
      return null
    })
    
    renderWithProviders(<DashboardPage />)
    
    // Verificar que se muestra el período correcto
    expect(screen.getByText('6 meses')).toBeInTheDocument()
  })

  it('actualiza los datos del gráfico cuando cambian los filtros', () => {
    renderWithProviders(<DashboardPage />)
    
    // Verificar que los datos del gráfico son correctos
    const chartSeries = screen.getAllByTestId('chart-series')[0]
    const seriesData = JSON.parse(chartSeries.textContent || '[]')
    
    // Verificar que los datos de ventas por mes son correctos
    expect(seriesData[0].data).toEqual([100, 200, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  })

  it('muestra el mensaje correcto cuando no hay ventas', () => {
    // Cambiar los datos para que no haya ventas
    ;(useRecoilValue as jest.Mock).mockImplementation((atom) => {
      if (atom === soldItemsState) return []
      if (atom === salesByMonthState) return {}
      if (atom === totalSalesState) return 0
      if (atom === filtersAtom) return { status: { value: 'all' }, search: '', sort: { value: 'recent' } }
      return null
    })
    
    renderWithProviders(<DashboardPage />)
    
    // Verificar que se muestra el valor correcto para ventas totales
    expect(screen.getByText('$0')).toBeInTheDocument()
  })
}) 
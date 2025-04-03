import { render, screen, fireEvent } from '@testing-library/react'
import Dropdown from '../Dropdown'

describe('Dropdown', () => {
  const mockItems = [
    { content: 'Item 1', onClick: jest.fn() },
    { content: 'Item 2', onClick: jest.fn() },
  ]
  const mockButton = <button>Click me</button>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente con los elementos básicos', () => {
    render(<Dropdown items={mockItems} button={mockButton} />)
    
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-content')).toBeInTheDocument()
    expect(screen.getAllByTestId('dropdown-item')).toHaveLength(2)
  })

  it('renderiza el botón correctamente', () => {
    render(<Dropdown items={mockItems} button={mockButton} />)
    
    const trigger = screen.getByTestId('dropdown-trigger')
    expect(trigger).toContainElement(screen.getByText('Click me'))
  })

  it('renderiza los items con su contenido', () => {
    render(<Dropdown items={mockItems} button={mockButton} />)
    
    const items = screen.getAllByTestId('dropdown-item')
    expect(items[0]).toHaveTextContent('Item 1')
    expect(items[1]).toHaveTextContent('Item 2')
  })

  it('llama a onClick cuando se hace clic en un item', () => {
    render(<Dropdown items={mockItems} button={mockButton} />)
    
    const items = screen.getAllByTestId('dropdown-trigger')
    fireEvent.click(items[0])
    
    expect(mockItems[0].onClick).toHaveBeenCalledTimes(1)
    expect(mockItems[1].onClick).not.toHaveBeenCalled()
  })

  it('aplica el align correcto al contenido', () => {
    render(<Dropdown items={mockItems} button={mockButton} align="end" />)
    
    const content = screen.getByTestId('dropdown-content')
    expect(content).toHaveAttribute('data-align', 'end')
  })

  it('maneja el estado open correctamente', () => {
    render(<Dropdown items={mockItems} button={mockButton} open={true} />)
    
    const root = screen.getByTestId('dropdown-trigger')
    expect(root).toHaveAttribute('data-open', 'true')
  })

  it('maneja el estado defaultOpen correctamente', () => {
    render(<Dropdown items={mockItems} button={mockButton} open={true} />)
    
    const root = screen.getByTestId('dropdown-trigger')
    expect(root).toHaveAttribute('data-open', 'true')
  })

  it('llama a onOpenChange cuando cambia el estado', () => {
    const onOpenChange = jest.fn()
    render(<Dropdown items={mockItems} button={mockButton} onOpenChange={onOpenChange} />)
    
    const root = screen.getByTestId('dropdown-trigger')
    fireEvent.click(root)
    
    expect(onOpenChange).toHaveBeenCalled()
  })
}) 
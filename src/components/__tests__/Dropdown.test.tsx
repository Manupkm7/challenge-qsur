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
    render(<Dropdown items={mockItems} button={mockButton} open={true} />)
    
    expect(screen.getByTestId('dropdown-root')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-portal')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-content')).toBeInTheDocument()
    expect(screen.getAllByTestId('dropdown-item')).toHaveLength(2)
  })

  it('renderiza el botón correctamente', () => {
    render(<Dropdown items={mockItems} button={mockButton} />)
    
    const trigger = screen.getByTestId('dropdown-trigger')
    expect(trigger).toContainElement(screen.getByText('Click me'))
  })

  it('renderiza los items con su contenido y maneja los clicks', () => {
    render(<Dropdown items={mockItems} button={mockButton} open={true} />)
    
    const items = screen.getAllByTestId('dropdown-item')
    expect(items[0]).toHaveTextContent('Item 1')
    expect(items[1]).toHaveTextContent('Item 2')

    fireEvent.click(items[0])
    expect(mockItems[0].onClick).toHaveBeenCalled()
  })

  it('aplica el align correcto al contenido', () => {
    render(<Dropdown items={mockItems} button={mockButton} align="end" open={true} />)
    
    const content = screen.getByTestId('dropdown-content')
    expect(content).toHaveAttribute('data-align', 'end')
  })

  it('maneja el estado open correctamente', () => {
    const { rerender } = render(<Dropdown items={mockItems} button={mockButton} open={true} />)
    
    const root = screen.getByTestId('dropdown-root')
    expect(root).toHaveAttribute('data-open', 'true')

    rerender(<Dropdown items={mockItems} button={mockButton} open={false} />)
    expect(root).toHaveAttribute('data-open', 'false')
  })

  it('maneja el estado defaultOpen correctamente', () => {
    render(<Dropdown items={mockItems} button={mockButton} defaultOpen={true} />)
    
    const root = screen.getByTestId('dropdown-root')
    expect(root).toHaveAttribute('data-default-open', 'true')
  })

  it('llama a onOpenChange cuando cambia el estado', () => {
    const onOpenChange = jest.fn()
    render(<Dropdown items={mockItems} button={mockButton} onOpenChange={onOpenChange} />)
    
    const trigger = screen.getByTestId('dropdown-trigger')
    fireEvent.click(trigger)
    
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('aplica las clases CSS correctamente', () => {
    render(<Dropdown items={mockItems} button={mockButton} open={true} />)
    
    const content = screen.getByTestId('dropdown-content')
    expect(content).toHaveClass('z-20')
    expect(content).toHaveClass('p-2')
    expect(content).toHaveClass('bg-white')
    expect(content).toHaveClass('rounded-md')
    expect(content).toHaveClass('shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]')
    expect(content).toHaveClass('will-change-[opacity]')
    expect(content).toHaveClass('animate-fade')

    const items = screen.getAllByTestId('dropdown-item')
    expect(items[0]).toHaveClass('flex')
    expect(items[0]).toHaveClass('items-center')
    expect(items[0]).toHaveClass('p-2')
    expect(items[0]).toHaveClass('rounded-md')
    expect(items[0]).toHaveClass('cursor-pointer')
    expect(items[0]).toHaveClass('hover:bg-primary-100')
    expect(items[0]).toHaveClass('focus:bg-primary-100')
    expect(items[0]).toHaveClass('gap-x-2')
  })

  it('maneja correctamente el caso sin items', () => {
    render(<Dropdown items={[]} button={mockButton} open={true} />)
    
    expect(screen.queryByTestId('dropdown-item')).not.toBeInTheDocument()
  })

  it('maneja correctamente el caso sin onClick en los items', () => {
    const itemsWithoutOnClick = [
      { content: 'Item 1' },
      { content: 'Item 2' }
    ]
    render(<Dropdown items={itemsWithoutOnClick} button={mockButton} open={true} />)
    
    const items = screen.getAllByTestId('dropdown-item')
    fireEvent.click(items[0])
    // No debería lanzar ningún error
  })
}) 
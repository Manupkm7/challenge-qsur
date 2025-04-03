import { render, screen, fireEvent } from '@testing-library/react'
import ToolTip from '../Tooltip'

describe('Tooltip', () => {
  it('renderiza correctamente con las propiedades básicas', () => {
    render(
      <ToolTip tooltip="Test tooltip">
        <button>Hover me</button>
      </ToolTip>
    )

    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('muestra el tooltip al hacer hover', async () => {
    render(
      <ToolTip tooltip="Test tooltip">
        <button>Hover me</button>
      </ToolTip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    // El tooltip debería aparecer después del delayDuration
    const tooltip = await screen.findByText('Test tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveClass('TooltipContent')
  })

  it('aplica clases personalizadas', () => {
    render(
      <ToolTip tooltip="Test tooltip" className="custom-class">
        <button>Hover me</button>
      </ToolTip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    const tooltip = screen.getByText('Test tooltip')
    expect(tooltip.parentElement).toHaveClass('custom-class')
  })

  it('aplica la posición correcta', () => {
    render(
      <ToolTip tooltip="Test tooltip" side="right">
        <button>Hover me</button>
      </ToolTip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    const tooltip = screen.getByText('Test tooltip')
    expect(tooltip.parentElement).toHaveAttribute('data-side', 'right')
  })

  it('aplica el delayDuration correctamente', () => {
    jest.useFakeTimers()
    
    render(
      <ToolTip tooltip="Test tooltip" delayDuration={1000}>
        <button>Hover me</button>
      </ToolTip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    // El tooltip no debería aparecer inmediatamente
    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument()

    // Avanzar el tiempo
    jest.advanceTimersByTime(1000)

    // Ahora el tooltip debería aparecer
    const tooltip = screen.getByText('Test tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveClass('TooltipContent')

    jest.useRealTimers()
  })

  it('muestra la flecha del tooltip', () => {
    render(
      <ToolTip tooltip="Test tooltip">
        <button>Hover me</button>
      </ToolTip>
    )

    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)

    const arrow = screen.getByRole('presentation')
    expect(arrow).toHaveClass('fill-select-dark-gray')
  })

  it('maneja diferentes tamaños', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    
    sizes.forEach(size => {
      const { unmount } = render(
        <ToolTip tooltip="Test tooltip" size={size}>
          <button>Hover me</button>
        </ToolTip>
      )

      const trigger = screen.getByText('Hover me')
      fireEvent.mouseEnter(trigger)

      expect(screen.getByText('Test tooltip').parentElement).toHaveClass(`size-${size}`)
      unmount()
    })
  })
}) 
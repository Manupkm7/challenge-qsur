import { render, screen, fireEvent } from '@testing-library/react'
import ModalLayout from '../Modal'

describe('ModalLayout', () => {
  const defaultProps = {
    children: <div>Modal content</div>,
    handleToggle: jest.fn(),
    title: 'Test Modal',
    show: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente cuando show es true', () => {
    render(<ModalLayout {...defaultProps} />)

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
    expect(screen.getByTestId('close-icon')).toBeInTheDocument()
  })

  it('no renderiza cuando show es false', () => {
    render(<ModalLayout {...defaultProps} show={false} />)

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
  })

  it('llama a handleToggle cuando se hace clic en el ícono de cierre', () => {
    render(<ModalLayout {...defaultProps} />)

    const closeIcon = screen.getByTestId('close-icon')
    fireEvent.click(closeIcon)

    expect(defaultProps.handleToggle).toHaveBeenCalledTimes(1)
  })

  it('aplica el ancho personalizado', () => {
    render(<ModalLayout {...defaultProps} width={300} />)

    const modalContent = screen.getByTestId("modal-content")
    expect(modalContent).toHaveStyle({ maxWidth: '300px' })
  })

  it('aplica el ancho por defecto cuando no se especifica', () => {
    render(<ModalLayout {...defaultProps} />)

    const modalContent = screen.getByTestId("modal-content")
    expect(modalContent).toHaveStyle({ maxWidth: '540px' })
  })

}) 
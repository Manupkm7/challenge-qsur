import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('renderiza correctamente con todos los props', () => {
    render(
      <Card
        title="Título de prueba"
        description="Descripción de prueba"
        icon={<span>Icono</span>}
        footer={<span>Footer</span>}
        className="test-class"
      >
        <div>Contenido de prueba</div>
      </Card>
    )

    expect(screen.getByTestId('card-title')).toHaveTextContent('Título de prueba')
    expect(screen.getByTestId('card-description')).toHaveTextContent('Descripción de prueba')
    expect(screen.getByTestId('card-title-and-icon')).toHaveTextContent('Icono')
    expect(screen.getByTestId('card-footer')).toHaveTextContent('Footer')
    expect(screen.getByTestId('card-content')).toHaveTextContent('Contenido de prueba')
  })
}) 
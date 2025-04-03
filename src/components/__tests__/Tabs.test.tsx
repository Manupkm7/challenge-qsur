import { render, screen, fireEvent } from '@testing-library/react'
import { TabsRoot, TabsList, TabTitle, TabContent } from '../Tabs'

describe('Tabs Components', () => {
  describe('TabsRoot', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      const handleValueChange = jest.fn()
      render(
        <TabsRoot value="tab1" onValueChange={handleValueChange}>
          <div>Test Content</div>
        </TabsRoot>
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      render(
        <TabsRoot className="custom-class">
          <div>Test Content</div>
        </TabsRoot>
      )

      const root = screen.getByRole('tablist').parentElement
      expect(root).toHaveClass('custom-class')
    })
  })

  describe('TabsList', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <TabsList>
          <div>Test Content</div>
        </TabsList>
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      render(
        <TabsList className="custom-class">
          <div>Test Content</div>
        </TabsList>
      )

      expect(screen.getByRole('tablist')).toHaveClass('custom-class')
    })
  })

  describe('TabTitle', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <TabsRoot value="tab1">
          <TabsList>
            <TabTitle value="tab1" trigger="Test Tab" />
          </TabsList>
        </TabsRoot>
      )

      expect(screen.getByRole('tab')).toBeInTheDocument()
      expect(screen.getByText('Test Tab')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      render(
        <TabsRoot value="tab1">
          <TabsList>
            <TabTitle value="tab1" trigger="Test Tab" className="custom-class" />
          </TabsList>
        </TabsRoot>
      )

      expect(screen.getByRole('tab')).toHaveClass('custom-class')
    })

    it('muestra el ícono cuando se proporciona', () => {
      const icon = <span data-testid="test-icon">Icon</span>
      render(
        <TabsRoot value="tab1">
          <TabsList>
            <TabTitle value="tab1" trigger="Test Tab" icon={icon} />
          </TabsList>
        </TabsRoot>
      )

      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('se deshabilita correctamente', () => {
      render(
        <TabsRoot value="tab1">
          <TabsList>
            <TabTitle value="tab1" trigger="Test Tab" disabled />
          </TabsList>
        </TabsRoot>
      )

      expect(screen.getByRole('tab')).toBeDisabled()
    })
  })

  describe('TabContent', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <TabsRoot value="tab1">
          <TabContent value="tab1">
            <div>Test Content</div>
          </TabContent>
        </TabsRoot>
      )

      expect(screen.getByRole('tabpanel')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      render(
        <TabsRoot value="tab1">
          <TabContent value="tab1" className="custom-class">
            <div>Test Content</div>
          </TabContent>
        </TabsRoot>
      )

      expect(screen.getByRole('tabpanel')).toHaveClass('custom-class')
    })
  })

  describe('Integración', () => {
    it('cambia entre pestañas correctamente', () => {
      const handleValueChange = jest.fn()
      render(
        <TabsRoot value="tab1" onValueChange={handleValueChange}>
          <TabsList>
            <TabTitle value="tab1" trigger="Tab 1" />
            <TabTitle value="tab2" trigger="Tab 2" />
          </TabsList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
        </TabsRoot>
      )

      const tab2 = screen.getByText('Tab 2')
      fireEvent.click(tab2)

      expect(handleValueChange).toHaveBeenCalledWith('tab2')
    })
  })
}) 
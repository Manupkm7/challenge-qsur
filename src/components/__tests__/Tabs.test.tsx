import { render, screen, fireEvent } from '@testing-library/react'
import { TabContent, TabsList, TabsRoot, TabTitle } from '../Tabs'

describe('Tabs Components', () => {
  describe('TabsRoot', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      const handleValueChange = jest.fn()
      render(
        <TabsRoot value="tab1" onValueChange={handleValueChange}>
          <TabsList>
            <TabTitle value="tab1" trigger="Tab 1" />
          </TabsList>
          <TabContent value="tab1">
            <div>Test Content</div>
          </TabContent>
        </TabsRoot>
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('maneja correctamente el valor por defecto', () => {
      render(
        <TabsRoot defaultValue="tab1">
          <TabsList>
            <TabTitle value="tab1" trigger="Tab 1" />
            <TabTitle value="tab2" trigger="Tab 2" />
          </TabsList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
        </TabsRoot>
      )

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'active')
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'inactive')
    })
  })

  describe('TabsList', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <TabsRoot value="tab1">
          <TabsList>
            <TabTitle
              value="tab1"
              trigger="Test Tab"
            />
          </TabsList>
          <TabContent value="tab1">
            <div>Test Content</div>
          </TabContent>
        </TabsRoot>
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getByRole('tablist')).toHaveClass('flex')
      expect(screen.getByRole('tablist')).toHaveClass('h-10')
      expect(screen.getByRole('tablist')).toHaveClass('items-center')
      expect(screen.getByRole('tablist')).toHaveClass('justify-center')
      expect(screen.getByRole('tablist')).toHaveClass('rounded-md')
      expect(screen.getByRole('tablist')).toHaveClass('p-1')
      expect(screen.getByRole('tablist')).toHaveClass('text-slate-500')
    })
  })

  describe('TabTitle', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <TabsRoot value="tab1">
          <TabsList>
            <TabTitle value="tab1" trigger="Test Tab" />
          </TabsList>
          <TabContent value="tab1">
            <div>Test Content</div>
          </TabContent>
        </TabsRoot>
      )

      const tab = screen.getByRole('tab')
      expect(tab).toBeInTheDocument()
      expect(tab).toHaveTextContent('Test Tab')
      expect(tab).toHaveAttribute('data-state', 'active')
      expect(tab).toHaveClass('inline-flex')
      expect(tab).toHaveClass('items-center')
      expect(tab).toHaveClass('justify-center')
      expect(tab).toHaveClass('whitespace-nowrap')
      expect(tab).toHaveClass('rounded-sm')
      expect(tab).toHaveClass('px-3')
      expect(tab).toHaveClass('py-1.5')
      expect(tab).toHaveClass('text-sm')
      expect(tab).toHaveClass('font-medium')
    })

    it('muestra el ícono cuando se proporciona', () => {
      const icon = <span data-testid="test-icon">Icon</span>
      render(
        <TabsRoot value="tab1">
          <TabsList>
            <TabTitle value="tab1" trigger="Test Tab" icon={icon} />
          </TabsList>
          <TabContent value="tab1">
            <div>Test Content</div>
          </TabContent>
        </TabsRoot>
      )

      const iconElement = screen.getByTestId('test-icon')
      expect(iconElement).toBeInTheDocument()
    })

    it('se deshabilita correctamente', () => {
      render(
        <TabsRoot value="tab1">
          <TabsList>
            <TabTitle value="tab1" trigger="Test Tab" disabled />
          </TabsList>
          <TabContent value="tab1">
            <div>Test Content</div>
          </TabContent>
        </TabsRoot>
      )

      const tab = screen.getByRole('tab')
      expect(tab).toBeDisabled()
      expect(tab).toHaveClass('disabled:pointer-events-none')
      expect(tab).toHaveClass('disabled:opacity-50')
    })
  })

  describe('TabContent', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <TabsRoot value="tab1">
          <TabsList>
            <TabTitle value="tab1" trigger="Test Tab" />
          </TabsList>
          <TabContent value="tab1">
            <div>Test Content</div>
          </TabContent>
        </TabsRoot>
      )

      const content = screen.getByRole('tabpanel')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('mt-2')
      expect(content).toHaveClass('ring-offset-white')
      expect(content).toHaveClass('focus-visible:outline-none')
      expect(content).toHaveClass('focus-visible:ring-2')
      expect(content).toHaveClass('focus-visible:ring-slate-400')
      expect(content).toHaveClass('focus-visible:ring-offset-2')
    })
  })
}) 
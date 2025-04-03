import { render, screen } from '@testing-library/react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../Pagination'

describe('Pagination Components', () => {
  describe('Pagination', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(<Pagination />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute('aria-label', 'pagination')
      expect(nav).toHaveClass('mx-auto')
      expect(nav).toHaveClass('flex')
      expect(nav).toHaveClass('w-full')
      expect(nav).toHaveClass('justify-center')
    })

    it('aplica clases personalizadas', () => {
      render(<Pagination className="custom-class" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('custom-class')
    })
  })

  describe('PaginationContent', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(<PaginationContent />)
      
      const ul = screen.getByRole('list')
      expect(ul).toBeInTheDocument()
      expect(ul).toHaveClass('flex')
      expect(ul).toHaveClass('flex-row')
      expect(ul).toHaveClass('items-center')
      expect(ul).toHaveClass('gap-1')
    })

    it('aplica clases personalizadas', () => {
      render(<PaginationContent className="custom-class" />)
      
      const ul = screen.getByRole('list')
      expect(ul).toHaveClass('custom-class')
    })
  })

  describe('PaginationItem', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(<PaginationItem />)
      
      const li = screen.getByRole('listitem')
      expect(li).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      render(<PaginationItem className="custom-class" />)
      
      const li = screen.getByRole('listitem')
      expect(li).toHaveClass('custom-class')
    })
  })

  describe('PaginationLink', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(<PaginationLink href="#" />)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '#')
    })

    it('aplica estilos cuando está activo', () => {
      render(<PaginationLink href="#" isActive />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(link).toHaveClass('bg-primary')
      expect(link).toHaveClass('text-primary-foreground')
      expect(link).toHaveClass('hover:bg-primary/90')
    })

    it('aplica estilos cuando no está activo', () => {
      render(<PaginationLink href="#" />)
      
      const link = screen.getByRole('link')
      expect(link).not.toHaveAttribute('aria-current')
      expect(link).toHaveClass('bg-secondary')
      expect(link).toHaveClass('text-secondary-foreground')
      expect(link).toHaveClass('hover:bg-secondary/90')
    })

    it('aplica clases personalizadas', () => {
      render(<PaginationLink href="#" className="custom-class" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-class')
    })
  })

  describe('PaginationPrevious', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(<PaginationPrevious href="#" />)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '#')
      expect(link).toHaveAttribute('aria-label', 'Go to previous page')
      expect(link).toHaveClass('gap-1')
      expect(link).toHaveClass('px-2')
      expect(link).toHaveClass('flex')
      expect(link).toHaveClass('items-center')
      expect(link).toHaveClass('underline')
      expect(link).toHaveClass('border-2')
      expect(link).toHaveClass('justify-center')
      expect(link).toHaveClass('rounded')
    })

    it('renderiza el ícono y el texto', () => {
      render(<PaginationPrevious href="#" />)
      
      expect(screen.getByTestId('chevron-left')).toBeInTheDocument()
      expect(screen.getByText('Anterior')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      render(<PaginationPrevious href="#" className="custom-class" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-class')
    })
  })

  describe('PaginationNext', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(<PaginationNext href="#" />)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '#')
      expect(link).toHaveAttribute('aria-label', 'Go to next page')
      expect(link).toHaveClass('gap-1')
      expect(link).toHaveClass('px-2')
      expect(link).toHaveClass('flex')
      expect(link).toHaveClass('items-center')
      expect(link).toHaveClass('underline')
      expect(link).toHaveClass('border-2')
      expect(link).toHaveClass('justify-center')
      expect(link).toHaveClass('rounded')
    })

    it('renderiza el ícono y el texto', () => {
      render(<PaginationNext href="#" />)
      
      expect(screen.getByTestId('chevron-right')).toBeInTheDocument()
      expect(screen.getByText('Siguiente')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      render(<PaginationNext href="#" className="custom-class" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-class')
    })
  })

  describe('PaginationEllipsis', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(<PaginationEllipsis />)
      
      const span = screen.getByText('More pages')
      expect(span).toBeInTheDocument()
      expect(span).toHaveClass('sr-only')
      
      const container = span.parentElement
      expect(container).toHaveClass('flex')
      expect(container).toHaveClass('h-9')
      expect(container).toHaveClass('w-9')
      expect(container).toHaveClass('items-center')
      expect(container).toHaveClass('justify-center')
      expect(container).toHaveAttribute('aria-hidden')
    })

    it('renderiza el ícono', () => {
      render(<PaginationEllipsis />)
      
      expect(screen.getByTestId('more-horizontal')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      render(<PaginationEllipsis className="custom-class" />)
      
      const container = screen.getByText('More pages').parentElement
      expect(container).toHaveClass('custom-class')
    })
  })
}) 
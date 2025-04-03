import { render, screen } from '@testing-library/react';
import Table from '../Table';

describe('Table Components', () => {
  describe('Table', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <Table>
          <tbody>
            <tr>
              <td>Cell content</td>
            </tr>
          </tbody>
        </Table>
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass('w-full');
      expect(table).toHaveClass('caption-bottom');
      expect(table).toHaveClass('text-sm');
    });

    it('aplica clases personalizadas', () => {
      render(
        <Table className="custom-class">
          <tbody>
            <tr>
              <td>Cell content</td>
            </tr>
          </tbody>
        </Table>
      );

      const table = screen.getByRole('table');
      expect(table).toHaveClass('custom-class');
    });

    it('renderiza con un contenedor con overflow', () => {
      render(
        <Table>
          <tbody>
            <tr>
              <td>Cell content</td>
            </tr>
          </tbody>
        </Table>
      );

      const container = screen.getByRole('table').parentElement;
      expect(container).toHaveClass('relative');
      expect(container).toHaveClass('w-full');
      expect(container).toHaveClass('overflow-auto');
    });
  });

  describe('Table.Header', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <Table>
          <Table.Header>
            <tr>
              <th>Header content</th>
            </tr>
          </Table.Header>
        </Table>
      );

      const thead = screen.getByRole('rowgroup');
      expect(thead).toBeInTheDocument();
      expect(thead).toHaveClass('[&_tr]:border-b');
    });

    it('aplica clases personalizadas', () => {
      render(
        <Table>
          <Table.Header className="custom-class">
            <tr>
              <th>Header content</th>
            </tr>
          </Table.Header>
        </Table>
      );

      const thead = screen.getByRole('rowgroup');
      expect(thead).toHaveClass('custom-class');
    });
  });

  describe('Table.Body', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <Table>
          <Table.Body>
            <tr>
              <td>Body content</td>
            </tr>
          </Table.Body>
        </Table>
      );

      const tbody = screen.getByRole('rowgroup');
      expect(tbody).toBeInTheDocument();
      expect(tbody).toHaveClass('[&_tr:last-child]:border-0');
    });

    it('aplica clases personalizadas', () => {
      render(
        <Table>
          <Table.Body className="custom-class">
            <tr>
              <td>Body content</td>
            </tr>
          </Table.Body>
        </Table>
      );

      const tbody = screen.getByRole('rowgroup');
      expect(tbody).toHaveClass('custom-class');
    });
  });

  describe('Table.Footer', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <Table>
          <Table.Footer>
            <tr>
              <td>Footer content</td>
            </tr>
          </Table.Footer>
        </Table>
      );

      const tfoot = screen.getByRole('rowgroup');
      expect(tfoot).toBeInTheDocument();
      expect(tfoot).toHaveClass('bg-primary');
      expect(tfoot).toHaveClass('font-medium');
      expect(tfoot).toHaveClass('text-primary-foreground');
    });

    it('aplica clases personalizadas', () => {
      render(
        <Table>
          <Table.Footer className="custom-class">
            <tr>
              <td>Footer content</td>
            </tr>
          </Table.Footer>
        </Table>
      );

      const tfoot = screen.getByRole('rowgroup');
      expect(tfoot).toHaveClass('custom-class');
    });
  });

  describe('Table.Row', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <td>Row content</td>
            </Table.Row>
          </Table.Body>
        </Table>
      );

      const tr = screen.getByRole('row');
      expect(tr).toBeInTheDocument();
      expect(tr).toHaveClass('border-b');
      expect(tr).toHaveClass('transition-colors');
      expect(tr).toHaveClass('hover:bg-muted/50');
      expect(tr).toHaveClass('data-[state=selected]:bg-muted');
    });

    it('aplica clases personalizadas', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row className="custom-class">
              <td>Row content</td>
            </Table.Row>
          </Table.Body>
        </Table>
      );

      const tr = screen.getByRole('row');
      expect(tr).toHaveClass('custom-class');
    });
  });

  describe('Table.Head', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <Table>
          <Table.Header>
            <tr>
              <Table.Head>Head content</Table.Head>
            </tr>
          </Table.Header>
        </Table>
      );

      const th = screen.getByRole('columnheader');
      expect(th).toBeInTheDocument();
      expect(th).toHaveClass('h-12');
      expect(th).toHaveClass('px-4');
      expect(th).toHaveClass('text-left');
      expect(th).toHaveClass('align-middle');
      expect(th).toHaveClass('font-medium');
      expect(th).toHaveClass('text-muted-foreground');
      expect(th).toHaveClass('[&:has([role=checkbox])]:pr-0');
    });

    it('aplica clases personalizadas', () => {
      render(
        <Table>
          <Table.Header>
            <tr>
              <Table.Head className="custom-class">Head content</Table.Head>
            </tr>
          </Table.Header>
        </Table>
      );

      const th = screen.getByRole('columnheader');
      expect(th).toHaveClass('custom-class');
    });
  });

  describe('Table.Cell', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Cell content</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );

      const td = screen.getByRole('cell');
      expect(td).toBeInTheDocument();
      expect(td).toHaveClass('p-4');
      expect(td).toHaveClass('align-middle');
      expect(td).toHaveClass('[&:has([role=checkbox])]:pr-0');
    });

    it('aplica clases personalizadas', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="custom-class">Cell content</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );

      const td = screen.getByRole('cell');
      expect(td).toHaveClass('custom-class');
    });
  });

  describe('Table.Caption', () => {
    it('renderiza correctamente con las propiedades básicas', () => {
      render(
        <Table>
          <Table.Caption>Caption content</Table.Caption>
          <tbody>
            <tr>
              <td>Cell content</td>
            </tr>
          </tbody>
        </Table>
      );

      const caption = screen.getByRole('caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveClass('mt-4');
      expect(caption).toHaveClass('text-sm');
      expect(caption).toHaveClass('text-muted-foreground');
    });

    it('aplica clases personalizadas', () => {
      render(
        <Table>
          <Table.Caption className="custom-class">Caption content</Table.Caption>
          <tbody>
            <tr>
              <td>Cell content</td>
            </tr>
          </tbody>
        </Table>
      );

      const caption = screen.getByRole('caption');
      expect(caption).toHaveClass('custom-class');
    });
  });
});

import * as React from "react"
import clsx from "clsx"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children: React.ReactNode;
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
    children: React.ReactNode;
}

class Table extends React.Component<TableProps> {
    static Header: React.FC<TableHeaderProps> = ({ className, children, ...props }) => (
        <thead className={clsx('[&_tr]:border-b', className)} {...props}>
            {children}
        </thead>
    );

    static Body: React.FC<TableBodyProps> = ({ className, children, ...props }) => (
        <tbody className={clsx('[&_tr:last-child]:border-0', className)} {...props}>
            {children}
        </tbody>
    );

    static Footer: React.FC<TableFooterProps> = ({ className, children, ...props }) => (
        <tfoot className={clsx('bg-primary font-medium text-primary-foreground', className)} {...props}>
            {children}
        </tfoot>
    );

    static Row: React.FC<TableRowProps> = ({ className, children, ...props }) => (
        <tr className={clsx('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props}>
            {children}
        </tr>
    );

    static Head: React.FC<TableHeadProps> = ({ className, children, ...props }) => (
        <th className={clsx('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', className)} {...props}>
            {children}
        </th>
    );

    static Cell: React.FC<TableCellProps> = ({ className, children, ...props }) => (
        <td className={clsx('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props}>
            {children}
        </td>
    );

    static Caption: React.FC<TableCaptionProps> = ({ className, children, ...props }) => (
        <caption className={clsx('mt-4 text-sm text-muted-foreground', className)} {...props}>
            {children}
        </caption>
    );

    render() {
        const { className, children, ...props } = this.props;
        return (
            <div className="relative w-full overflow-auto">
                <table className={clsx('w-full caption-bottom text-sm', className)} {...props}>
                    {children}
                </table>
            </div>
        );
    }
}

export default Table;


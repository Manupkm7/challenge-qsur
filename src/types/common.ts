export type FilterState = {
    status: LabelValue
    sort: LabelValue
    search: string
}

export type AppHeaderProps = {
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
    onNewClick: () => void
}

export type LabelValue = {
    label: string
    value: string
}
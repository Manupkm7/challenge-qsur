import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { AppHeader } from '../Header'
import { useLocation } from 'react-router-dom'

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn()
}));

const renderWithRecoil = (component: React.ReactNode) => {
    return render(
        <RecoilRoot>
            {component}
        </RecoilRoot>
    )
}

describe('AppHeader', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useLocation as jest.Mock).mockReturnValue({ pathname: '/home' });
    });

    it('formatea correctamente el título de la página', () => {
        (useLocation as jest.Mock).mockReturnValue({ pathname: '/home/settings' })

        renderWithRecoil(<AppHeader filters={{ status: { value: 'active' }, search: '', sort: { value: 'recent' } } as any} onFiltersChange={() => { }} onNewClick={() => { }} />)
        expect(screen.getByText('Home / Settings')).toBeInTheDocument()
    })

    it('renderiza los filtros en la página /home', () => {
        renderWithRecoil(<AppHeader filters={{ status: { value: 'all' }, search: '', sort: { value: 'recent' } } as any} onFiltersChange={() => { }} onNewClick={() => { }} />)
        
        // Verificar que se muestran los elementos de filtro
        expect(screen.getByTestId('search-input')).toBeInTheDocument()
        expect(screen.getByTestId('new-button')).toBeInTheDocument()
        
        // Verificar que se muestran los selects
        const selects = screen.getAllByRole('combobox');
        expect(selects).toHaveLength(2);
    })

    it('llama a onFiltersChange cuando se cambia la búsqueda', () => {
        const onFiltersChange = jest.fn()
        renderWithRecoil(<AppHeader filters={{ status: { value: 'active' }, search: '', sort: { value: 'recent' } } as any} onFiltersChange={onFiltersChange} onNewClick={() => { }} />)

        const searchInput = screen.getByTestId('search-input')
        fireEvent.change(searchInput, { target: { value: 'test' } })

        expect(onFiltersChange).toHaveBeenCalledWith({ status: { value: 'active' }, search: 'test', sort: { value: 'recent' } })
    })
}) 
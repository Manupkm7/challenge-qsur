import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { AppHeader } from '../Header'

const renderWithRecoil = (component: React.ReactNode) => {
    return render(
        <RecoilRoot>
            {component}
        </RecoilRoot>
    )
}

describe('AppHeader', () => {
    it('formatea correctamente el título de la página', () => {
        const { useLocation } = require('react-router-dom')
        useLocation.mockReturnValue({ pathname: '/home/settings' })

        renderWithRecoil(<AppHeader filters={{ status: 'active', search: '' } as any} onFiltersChange={() => { }} onNewClick={() => { }} />)
        expect(screen.getByText('Home /Settings')).toBeInTheDocument()
    })

    it('llama a onFiltersChange cuando se cambia la búsqueda', () => {
        const onFiltersChange = jest.fn()
        renderWithRecoil(<AppHeader filters={{ status: 'active', search: '' } as any} onFiltersChange={onFiltersChange} onNewClick={() => { }} />)

        const searchInput = screen.getByTestId('search-input')
        fireEvent.change(searchInput, { target: { value: 'test' } })

        expect(onFiltersChange).toHaveBeenCalledWith({ status: 'active', search: 'test' })
    })
}) 
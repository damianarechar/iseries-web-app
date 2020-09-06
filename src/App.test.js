import React from 'react'
import { render, screen } from '@testing-library/react'

import App from './App'
import Header from './layouts/Header'
import Content from './layouts/Content'
import Footer from './layouts/Footer'

import Table from './components/Table'

describe('App', () => {
  test('renders App', () => {
    render(<App />)

    expect(screen.getByRole('banner')).toBeEnabled()
    expect(screen.getByRole("main")).toBeEnabled()
    expect(screen.getByRole("contentinfo")).toBeEnabled()
  })
})

describe('layouts', () => {
  test('renders Header layout', () => {
    render(<Header />)

    expect(screen.getByRole('banner')).toHaveClass("app-header")
  })

  test('renders Content layout', () => {
    render(<Content />)

    expect(screen.getByRole("main")).toHaveClass("app-content")

    expect(screen.getAllByRole("button")).toHaveLength(3)

    expect(screen.getByText("Populares")).toBeInTheDocument()
    expect(screen.getByText("Mejor valoradas")).toBeInTheDocument()
    expect(screen.getByText("Mas vistas")).toBeInTheDocument()
    expect(screen.getByRole("table")).toBeEnabled()
  })
  
  test('renders Footer layout', () => {
    render(<Footer />)

    expect(screen.getByRole("contentinfo")).toHaveClass("app-footer")
  })  
})

describe('components', () => {
  test('renders table component', () => {
    render(<Table />)

    expect(screen.getByRole("table")).toBeEnabled()
    expect(screen.getByText("Nombre")).toBeInTheDocument()
    expect(screen.getByText("Poster")).toBeInTheDocument()
    expect(screen.getByText("Puntuación")).toBeInTheDocument()
    expect(screen.getByText("Favoritos")).toBeInTheDocument()
    expect(screen.getAllByRole("row")).toHaveLength(5)
    expect(screen.getAllByRole("cell")).toHaveLength(16)
  })
})

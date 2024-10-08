import React from 'react'
import { render, screen } from '@testing-library/react'

import RootLayout, { metadata } from './layout'

describe('RootLayout Component', () => {
  it('renders the children passed to it', () => {
    render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>
    )

    const childElement = screen.getByText('Test Child')

    expect(childElement).toBeInTheDocument()
  })

  // Test: Ensure the HTML element has the correct lang attribute
  it('sets the lang attribute to "en" on the html element', () => {
    const { container } = render(
      <RootLayout>
        <div />
      </RootLayout>
    )

    const htmlElement = container.querySelector('html')

    expect(htmlElement).toHaveAttribute('lang', 'en')
  })

  // Test: Ensure metadata contains correct title and description
  it('has correct metadata', () => {
    expect(metadata.title).toBe('Create Next App')
    expect(metadata.description).toBe('Generated by create next app')
  })
})

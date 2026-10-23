import React from 'react'

export const metadata = {
  description: 'Content management for tonyzoooo.me',
  title: 'tonyzoooo.me',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

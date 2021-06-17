import Link from 'next/link'
import type { VFC } from 'react'

import { useAuth } from '../hooks/useAuth'

const items = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
]

export const Header: VFC = () => {
  const { user, redirect, logout } = useAuth()

  const handleClick = () => {
    user ? logout() : redirect()
  }
  return (
    <header>
      <h1>Title</h1>
      {user ? (
        <button onClick={handleClick}>ログアウト</button>
      ) : (
        <button onClick={handleClick}>google ログイン</button>
      )}
      <nav>
        {items.map(({ href, label }) => {
          return (
            <Link key={href} href={href}>
              <a className="inline-block p-4">{label}</a>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

import Link from 'next/link'
import type { VFC } from 'react'

const items = [
  { href: '/', label: 'MyTask' },
  { href: '/others', label: 'Others Task' },
]

export const Header: VFC = () => {
  return (
    <header>
      <h1>Dapp Todo</h1>
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

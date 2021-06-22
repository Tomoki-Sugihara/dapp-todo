import Link from 'next/link'
import type { VFC } from 'react'
import { useLoading } from 'src/hooks/useLoading'

const items = [
  { href: '/', label: 'MyTask' },
  { href: '/others', label: 'Others Task' },
]

export const Header: VFC = () => {
  const { isLoading } = useLoading()
  return (
    <header>
      <h1>Dapp Todo</h1>
      <div>
        <nav>
          {items.map(({ href, label }) => {
            return (
              <Link key={href} href={href}>
                <a className="inline-block p-4">{label}</a>
              </Link>
            )
          })}
        </nav>
        <div>{isLoading && 'ロード中'}</div>
      </div>
    </header>
  )
}

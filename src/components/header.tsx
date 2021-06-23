import Link from 'next/link'
import type { VFC } from 'react'
import { useRecoilValue } from 'recoil'
import { loadingState } from 'src/state/config'

import { useAuth } from '../hooks/useAuth'

const items = [
  { href: '/', label: 'MyTask' },
  { href: '/others', label: 'Others Task' },
]

export const Header: VFC = () => {
  const { user, signIn, signOut } = useAuth()
  const isLoading = useRecoilValue(loadingState)

  const handleClick = () => {
    user ? signOut() : signIn()
  }
  return (
    <header>
      <h1>Dapp Todo</h1>
      {user ? (
        <button onClick={handleClick}>ログアウト</button>
      ) : (
        <button onClick={handleClick}>google ログイン</button>
      )}
      <div className="flex justify-between">
        <nav>
          {items.map(({ href, label }) => {
            return (
              <Link key={href} href={href}>
                <a className="inline-block p-4">{label}</a>
              </Link>
            )
          })}
        </nav>
        <div>{isLoading && '更新中'}</div>
      </div>
    </header>
  )
}

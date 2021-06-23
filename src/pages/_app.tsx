import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import { RecoilRoot } from 'recoil'

const App = (props: AppProps) => {
  return (
    <>
      <Head>
        <title>Dapp Todo</title>
      </Head>
      <RecoilRoot>
        <props.Component {...props.pageProps} />
      </RecoilRoot>
    </>
  )
}

export default App

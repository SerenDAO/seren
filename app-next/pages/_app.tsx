// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import localFont from '@next/font/local'

const font = localFont({
  src: [{
    path: '../public/font/Kalam/Kalam-Regular.ttf',
    weight: '400',
    style: 'normal'
  }, {
    path: '../public/font/Kalam/Kalam-Bold.ttf',
    weight: 'bold',
    style: 'normal'
  }],

})

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <style jsx global>{`
      html {
        font-family: ${font.style.fontFamily};
      }
      .btn, input {
        font-family: ${font.style.fontFamily};
      }
    `}</style>
    <Component {...pageProps} />
  </>
}

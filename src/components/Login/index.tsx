import { useState } from 'react'
import Link from 'next/link'

import FirebaseApi from '../../FirebaseApi'

import * as C from './styles'
import { useRouter } from 'next/router'
import GifLoading from 'components/GifLoading'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [senha, setSenha] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [isActive, setIsActive] = useState(false)

  const signinGoogle = async () => {
    const result = FirebaseApi.googleSignin()

    if (result) {
      // console.log(result)
      const user = (await result).user
      const data = {
        id: user?.uid,
        name: user?.displayName,
        avatar: user?.photoURL,
      }
      // console.log(data)
      router.push('/')
    } else {
      alert('Error')
    }
  }
  const signinEmail = async () => {
    setLoading(true)
    await FirebaseApi.firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then(() => {
        setSenha('')
        setEmail('')
        router.push('/')
      })
      .catch((err) => {
        // console.log('deu errado', err)
        setError(true)
        setLoading(false)
      })
  }

  return (
    <C.Container>
      <C.ContainerLogoLogin>
        <Link href="/">
          <C.Logo src="/img/logoTube.svg" alt="Logo api tube" />
        </Link>
      </C.ContainerLogoLogin>
      <C.Content>
        {loading ? <C.H3>Entrando...</C.H3> : <C.H3>Entre com sua conta</C.H3>}
        {loading ? (
          <GifLoading />
        ) : (
          <>
            <C.Form>
              <C.Gif src="/img/logar.gif" alt="bob esponja" />
              <C.Input
                type="text"
                name="email"
                placeholder="email@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <C.Input
                type="password"
                name="senha"
                placeholder="Senha 6 digitos"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {error && <C.ErrorText>E-mail ou senha errado.</C.ErrorText>}
              <div>
                <C.Button onClick={() => signinEmail()}>Entrar</C.Button>
              </div>
              <C.Google onClick={() => signinGoogle()}>
                <C.Img src="/img/google.png" />
                <C.TextGoogle>Entrar com google</C.TextGoogle>
              </C.Google>
            </C.Form>
            <C.P>
              Não tem uma conta?
              <Link href="/cadastrar">
                <a>Crie agora</a>
              </Link>
            </C.P>
          </>
        )}
      </C.Content>
    </C.Container>
  )
}

export default Login

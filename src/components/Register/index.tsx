import { useState } from 'react'
import Link from 'next/link'
import { BsArrowReturnLeft } from 'react-icons/bs'
import { GoSignIn } from 'react-icons/go'
import * as C from './styles'
import { useRouter } from 'next/router'
import FirebaseApi from '../../FirebaseApi'
import GifLoading from 'components/GifLoading'

const Register = () => {
  const router = useRouter()
  const [displayName, setDisplayName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [senha, setSenha] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const returnPage = () => {
    router.push('/entrar')
  }

  const handleRegister = async () => {
    setLoading(true)
    await FirebaseApi.firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {
        await FirebaseApi.db
          .collection('users')
          .doc(value.user?.uid)
          .set({
            nome: displayName,
          })
          .then(() => {
            setSenha('')
            setEmail('')
            setDisplayName('')
            router.push('/')
          })
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
        <C.Return>
          {loading ? (
            <></>
          ) : (
            <BsArrowReturnLeft
              size={30}
              style={{ marginTop: '10px', cursor: 'pointer' }}
              onClick={() => returnPage()}
            />
          )}

          {loading ? (
            <C.H3 style={{ width: '100%' }}>Criando sua conta...</C.H3>
          ) : (
            <C.H3>Crie sua conta</C.H3>
          )}
        </C.Return>
        {loading ? (
          <GifLoading />
        ) : (
          <C.Form>
            <C.Gif src="/img/register.gif" alt="bob esponja" />

            <C.Input
              type="text"
              name="nome"
              placeholder="Seu nome ou nick"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <C.Input
              type="text"
              name="email"
              placeholder="email@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <C.ErrorText>Precisa ser um email</C.ErrorText>}
            <C.Input
              type="password"
              name="senha"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {error && <C.ErrorText>Senha precisa ter 6 dígitos</C.ErrorText>}
            <div>
              <C.Button onClick={() => handleRegister()}>Cadastrar</C.Button>
            </div>
          </C.Form>
        )}
      </C.Content>
    </C.Container>
  )
}

export default Register

// <C.Container>
// <C.ContainerLogoLogin>
//   <Link href="/">
//     <C.Logo src="/img/logoTube.svg" alt="Logo api tube" />
//   </Link>
// </C.ContainerLogoLogin>
// <C.Content>
//   {registerNotGoogle && (
//     <C.Return>
//       <BsArrowReturnLeft
//         size={30}
//         style={{ marginTop: '10px', cursor: 'pointer' }}
//         onClick={() => setRegisterNotGoogle(false)}
//       />
//       <C.H3>Crie sua conta</C.H3>
//     </C.Return>
//   )}
//   {!registerNotGoogle && <C.H3>Crie sua conta</C.H3>}

//   <C.Form>
//     <C.Gif src="/img/register.gif" alt="bob esponja" />
//     {!registerNotGoogle && (
//       <>
//         <C.Google>
//           <C.Img src="/img/google.png" />
//           <C.TextGoogle>Cadastrar com google</C.TextGoogle>
//         </C.Google>
//         <div>
//           <C.Button onClick={() => setRegisterNotGoogle(true)}>
//             Cadastrar sem google
//           </C.Button>
//         </div>
//         <Link href="/entrar">
//           <C.Signin>
//             <GoSignIn size={26} />
//             <C.TextGoogle>Entrar com sua conta</C.TextGoogle>
//           </C.Signin>
//         </Link>
//       </>
//     )}
//     {registerNotGoogle && (
//       <>
//         <C.Input type="text" name="usuário" placeholder="Usuário" />
//         <C.Input type="password" name="senha" placeholder="Senha" />
//         <div>
//           <Link href="/">
//             <C.Button>Cadastrar</C.Button>
//           </Link>
//         </div>
//       </>
//     )}
//   </C.Form>
// </C.Content>
// </C.Container>

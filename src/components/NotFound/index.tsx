import * as C from './styles'

interface Props {
  notfound?: boolean
}

const NotFound = ({ notfound }: Props) => {
  return (
    <C.Container>
      <C.GifNotFound src="/img/notFound.gif" alt="Bob esponja e patrick" />

      {notfound ? (
        <C.Notfound>
          <C.TextNotFound>
            Bob esponja: Não encontramos nada Patrick... <br />
            Patrick: Não encontramos bob ;( <br />
          </C.TextNotFound>
          <C.TextNotFound2>| 404</C.TextNotFound2>
        </C.Notfound>
      ) : (
        <C.NenhumVideo>
          Eu acho que deu ruim patrick, não encontramos nada...
        </C.NenhumVideo>
      )}
    </C.Container>
  )
}
export default NotFound

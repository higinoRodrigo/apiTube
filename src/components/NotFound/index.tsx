import * as C from './styles'

const NotFound = () => {
  return (
    <C.Container>
      <C.GifNotFound src="/img/notFound.gif" alt="Bob esponja e patrick" />
      <C.NenhumVideo>
        Eu acho que deu ruim patrick, não encontramos nada...
      </C.NenhumVideo>
    </C.Container>
  )
}
export default NotFound

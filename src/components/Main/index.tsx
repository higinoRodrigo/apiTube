import * as C from './styles'
import Link from 'next/link'
import youtubeSearch from 'youtube-search'
import envCustom from '../../../.envCustom'
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
  AiOutlineSearch,
} from 'react-icons/ai'
import { MdOutlineDownloading } from 'react-icons/md'
import { MdLibraryAddCheck } from 'react-icons/md'
import { BiUserCircle } from 'react-icons/bi'
import { FaSignOutAlt } from 'react-icons/Fa'
import FirebaseApi from '../../FirebaseApi'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import GifLoading from 'components/GifLoading'
import { route } from 'next/dist/server/router'
import NotFound from 'components/NotFound'

interface DataSearchProps {
  id: string
  author: string
  videoTitle: string
  thumbnailUrl: string | undefined
  linkUrl: string
}
interface VideosAddsProps {
  videoId: string
  addedBy: string
  uid: string | null
  author: string
  videoTitle: string
  thumbnailUrl: string | undefined
  linkUrl: string
  likes: string[]
  dislikes: string[]
}
const Main = () => {
  const router = useRouter()

  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [imgPerfil, setImgPerfil] = useState<string | null>('')
  const [displayName, setDisplayName] = useState<string | null>('')
  const [UUID, setUUID] = useState<string | null>('')
  const [searchText, setSearchText] = useState<string>('')
  const [dataSearch, setDataSearch] = useState<DataSearchProps[]>([])
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [errorIslogged, setErrorIslogged] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [videoPendentSend, setVideoPendentSend] = useState<boolean>(false)
  const [videosAdds, setVideosAdds] = useState<VideosAddsProps[]>([])
  // consulta de videos e funcionalidades da tela inicial
  const [videosReturnApi, setVideosReturnApi] = useState<VideosAddsProps[]>([])
  const [videosPublicos, setVideosPublicos] = useState([])
  // console.log('VIDEO RETURN API', videosReturnApi)

  useEffect(() => {
    if (!dataSearch || !searchText) {
      setIsSearch(false)
      setVideoPendentSend(false)
      setVideosAdds([])
      return
    }
  }, [dataSearch, searchText])
  useEffect(() => {
    ;(async () => {
      FirebaseApi.firebaseApp.auth().onAuthStateChanged((user) => {
        if (user) {
          // console.log(user)
          setImgPerfil(user.photoURL)
          setDisplayName(user.displayName)
          setUUID(user.uid)
          setIsLogged(true)
        } else {
          setIsLogged(false)
        }
      })
    })()
  }, [])
  useEffect(() => {
    ;(() => {
      if (errorIslogged) {
        setTimeout(() => {
          setErrorIslogged(false)
        }, 4000)
      }
    })()
  }, [errorIslogged])

  const logout = async () => {
    await FirebaseApi.firebaseApp.auth().signOut()
    setImgPerfil('')
    setDisplayName('')
    setUUID('')
    setIsLogged(false)
  }
  const signin = async () => {
    router.push('/entrar')
  }
  // pesquisa e adicionar videos
  const searchVideo = () => {
    if (!searchText) {
      setDataSearch([])
      return
    }
    setLoading(true)

    const query = searchText

    const opts: youtubeSearch.YouTubeSearchOptions = {
      maxResults: 6,
      key: envCustom.KEY_API_YOUTUBE,
      type: 'video',
    }

    youtubeSearch(query, opts, (err, results) => {
      setLoading(true)
      if (err) {
        setDataSearch([])
        setLoading(false)
        return
      }
      // eslint-disable-next-line prefer-const
      let data: DataSearchProps[] = []
      results?.forEach((doc) => {
        data.push({
          id: doc.id,
          author: doc.channelTitle,
          videoTitle: doc.title,
          linkUrl: doc.link,
          thumbnailUrl: doc.thumbnails.high?.url
            ? doc.thumbnails.high?.url
            : doc.thumbnails.default?.url,
        })
      })
      setDataSearch(data)
      setIsSearch(true)
      setLoading(false)
    })
  }
  const handleAddVideo = (props: DataSearchProps) => {
    if (isLogged) {
      setErrorIslogged(false)
      const alreadyExists = videosAdds.findIndex(
        (video) => video.videoId === props.id,
      )
      if (alreadyExists !== -1) {
        videosAdds.splice(alreadyExists, 1)
        setVideosAdds([...videosAdds])
        if (videosAdds.length === 0) {
          setVideoPendentSend(false)
        }
        return
      }

      const data: VideosAddsProps = {
        videoId: props.id,
        author: props.author,
        videoTitle: props.videoTitle,
        thumbnailUrl: props.thumbnailUrl,
        linkUrl: props.linkUrl,
        addedBy: displayName ? displayName : 'Unknown',
        uid: UUID,
        likes: [],
        dislikes: [],
      }
      const videos = [...videosAdds, data]
      setVideosAdds(videos)
      setVideoPendentSend(true)
    } else {
      setErrorIslogged(true)
    }
  }
  const searchForm = (e: FormEvent) => {
    e.preventDefault()
    searchVideo()
  }
  const sendVideosApi = async () => {
    setLoading(true)
    setVideoPendentSend(false)
    if (videosAdds.length === 0) {
      setLoading(false)
      return
    }

    for (let i = 0; i < videosAdds.length; i++) {
      const video = videosAdds[i]
      await FirebaseApi.firebaseApp
        .firestore()
        .collection('videos')
        .doc(video.videoId)
        .set(video)
    }
    getVideosFirebase()
    setVideosAdds([])
    setIsSearch(false)
    setSearchText('')
    setLoading(false)
    // router.reload()
  }
  // retornar dados para tela inicial
  useEffect(() => {
    ;(async () => {
      await getVideosFirebase()
    })()
  }, [])

  const getVideosFirebase = async () => {
    setLoading(true)

    const data = await FirebaseApi.db.collection('videos').get()
    const videos: VideosAddsProps[] = []
    data.forEach((doc) => {
      const video = doc.data() as VideosAddsProps
      videos.push(video)
    })
    setVideosReturnApi(videos)
    setLoading(false)
  }

  return (
    <C.Wrapper>
      <C.Header>
        <C.ContainerLogoLogin>
          <C.Logo
            src="/img/logoTube.svg"
            alt="Logo api tube"
            onClick={() => setSearchText('')}
          />
          <C.User onClick={() => (isLogged ? logout() : signin())}>
            <C.ImgUser
              src={imgPerfil ? imgPerfil : '/img/userExample.png'}
              alt="Foto do usuário"
            />
            <C.NameUser>{isLogged ? displayName : 'Entrar'}</C.NameUser>
            {isLogged && <FaSignOutAlt size={25} />}
          </C.User>
        </C.ContainerLogoLogin>

        <C.ContainerSearch justify={videoPendentSend || errorIslogged}>
          {videoPendentSend && (
            <C.ContainerSendVideos onClick={() => sendVideosApi()}>
              <C.SendVideos>
                <C.TextSendVideos>
                  Enviar <strong>{videosAdds.length}</strong> videos
                </C.TextSendVideos>
                <MdOutlineDownloading size={30} />
              </C.SendVideos>
              <C.SubTextSend>Clique aqui para enviar seus videos</C.SubTextSend>
            </C.ContainerSendVideos>
          )}
          {errorIslogged && (
            <C.ErrorIsLogged>
              Você precisa está logado para adicionar videos.
            </C.ErrorIsLogged>
          )}
          <C.AddVideo onSubmit={searchForm}>
            <C.Search
              placeholder="Pesquise um video"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <C.Icon onClick={() => searchVideo()}>
              <AiOutlineSearch size={28} color="#000" />
            </C.Icon>
          </C.AddVideo>
        </C.ContainerSearch>
      </C.Header>

      <C.ContainerBoxs>
        {loading ? (
          <GifLoading />
        ) : isSearch ? (
          dataSearch.length ? (
            dataSearch.map((data) => {
              return (
                <C.BoxVideoAdd key={data.id}>
                  <C.Video src={data.thumbnailUrl} />
                  <C.ContainerInfos>
                    <C.ContainerTitleViews>
                      <C.Title title={data.videoTitle}>
                        {data.videoTitle}
                      </C.Title>
                    </C.ContainerTitleViews>
                    <C.ContainerAdd onClick={() => handleAddVideo(data)}>
                      <C.TextAdd>
                        {videosAdds.find((video) => video.videoId === data.id)
                          ? 'Remover'
                          : 'Adicionar'}
                      </C.TextAdd>
                      <C.AddAndRemove>
                        <MdLibraryAddCheck size={22} color="#fff" />
                      </C.AddAndRemove>
                    </C.ContainerAdd>
                  </C.ContainerInfos>
                </C.BoxVideoAdd>
              )
            })
          ) : (
            <NotFound />
          )
        ) : videosReturnApi.length ? (
          videosReturnApi.map((data) => {
            return (
              <>
                <C.BoxVideo key={data.videoId}>
                  <C.RegisterBy>
                    <C.TextRegisterBy>
                      Adicionado por: {data.addedBy}
                    </C.TextRegisterBy>
                    <C.Autor>Fonte: {data.author}</C.Autor>
                  </C.RegisterBy>
                  <a href={data.linkUrl} target="_blank" rel="noreferrer">
                    <C.Video
                      src={data.thumbnailUrl}
                      style={{ cursor: 'pointer' }}
                    />
                  </a>
                  <C.ContainerInfos>
                    <C.ContainerTitleViews>
                      <C.Title title={data.videoTitle}>
                        {data.videoTitle}
                      </C.Title>
                    </C.ContainerTitleViews>
                    <C.ContainerLikes>
                      <C.CountLikes>{data.likes.length}</C.CountLikes>
                      <C.Like>
                        <AiFillLike size={35} color="#2EB086" />
                      </C.Like>
                      <C.Dislike>
                        <AiOutlineDislike size={35} color="#fff" />
                      </C.Dislike>
                    </C.ContainerLikes>
                  </C.ContainerInfos>
                </C.BoxVideo>
              </>
            )
          })
        ) : (
          <NotFound />
        )}
      </C.ContainerBoxs>

      <C.Footer>
        <C.TextFooter
          href="https://www.linkedin.com/in/rodrigohiginodev/"
          target="_blank"
        >
          Rodrigo Higino &copy; 2022
        </C.TextFooter>
      </C.Footer>
    </C.Wrapper>
  )
}

export default Main

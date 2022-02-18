import { FormEvent, useEffect, useState } from 'react'
import * as C from './styles'
import youtubeSearch from 'youtube-search'
import { useRouter } from 'next/router'
import FirebaseApi from '../../FirebaseApi'
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
import { FaSignOutAlt } from 'react-icons/Fa'
import GifLoading from 'components/GifLoading'
import NotFound from 'components/NotFound'
import { useDispatch } from 'react-redux'
import { signout } from 'store/actions/signoutActions'

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
  const dispatch = useDispatch()
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

  const logout = () => {
    dispatch(signout())
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
    const videosOrdered = videos.sort((a, b) => b.likes.length - a.likes.length)
    setVideosReturnApi(videosOrdered)
    setLoading(false)
  }

  const handleLikeAndDislike = async (
    videoId: string,
    uid: string,
    action: string,
  ) => {
    if (!isLogged) return
    const video = videosReturnApi.find((video) => video.videoId === videoId)
    if (!video) {
      return
    }

    const index = videosReturnApi.findIndex(
      (video) => video.videoId === videoId,
    )
    const likes = video.likes
    const dislikes = video.dislikes
    const alreadyLiked = likes.find((like) => like === uid)
    const alreadyDisliked = dislikes.find((dislike) => dislike === uid)

    if (alreadyLiked) {
      likes.splice(likes.indexOf(uid), 1)
      if (action === 'dislike') {
        dislikes.push(uid)
      }
      await FirebaseApi.db.collection('videos').doc(videoId).update({
        likes: likes,
        dislikes: dislikes,
      })
      videosReturnApi.splice(index, 1, {
        ...video,
        likes: likes,
        dislikes: dislikes,
      })
      setVideosReturnApi([...videosReturnApi])
      return
    }

    if (alreadyDisliked) {
      dislikes.splice(dislikes.indexOf(uid), 1)
      if (action === 'like') {
        likes.push(uid)
      }
      await FirebaseApi.db.collection('videos').doc(videoId).update({
        likes: likes,
        dislikes: dislikes,
      })
      videosReturnApi.splice(index, 1, {
        ...video,
        likes: likes,
        dislikes: dislikes,
      })
      setVideosReturnApi([...videosReturnApi])
      return
    }

    if (action === 'like') {
      likes.push(uid)
    } else {
      dislikes.push(uid)
    }
    await FirebaseApi.db.collection('videos').doc(videoId).update({
      likes: likes,
      dislikes: dislikes,
    })
    videosReturnApi.splice(index, 1, {
      ...video,
      likes: likes,
      dislikes: dislikes,
    })
    setVideosReturnApi([...videosReturnApi])
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
            dataSearch.map((data, index) => {
              return (
                <C.BoxVideoAdd key={index}>
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
          videosReturnApi.map((data, index) => {
            return (
              <>
                <C.BoxVideo key={index}>
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
                      <C.Like
                        onClick={() =>
                          handleLikeAndDislike(data.videoId, UUID || '', 'like')
                        }
                      >
                        {data.likes.find((like) => like === UUID) ? (
                          <AiFillLike size={35} color="#2EB086" />
                        ) : (
                          <AiOutlineLike size={35} color="#fff" />
                        )}
                      </C.Like>
                      <C.Dislike
                        onClick={() =>
                          handleLikeAndDislike(
                            data.videoId,
                            UUID || '',
                            'dislike',
                          )
                        }
                      >
                        {data.dislikes.find((dislike) => dislike === UUID) ? (
                          <AiFillDislike size={35} color="#E82929" />
                        ) : (
                          <AiOutlineDislike size={35} color="#fff" />
                        )}
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

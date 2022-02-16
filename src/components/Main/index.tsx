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

interface DataSearchProps {
  id: string
  title: string
  titleChannel: string
  link: string
  thumbnails: string | undefined
}
interface VideosAddsProps {
  videoId: string
  name: string
  uid: string | null
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
  const [videosReturnApi, setVideosReturnApi] = useState<string[]>([])
  const [videosPublicos, setVideosPublicos] = useState([])

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
    }

    youtubeSearch(query, opts, (err, results) => {
      setLoading(true)
      if (err) {
        // console.log(err)
        setDataSearch([])
        setLoading(false)
        return
      }
      // eslint-disable-next-line prefer-const
      let data: DataSearchProps[] = []
      results?.forEach((doc) => {
        data.push({
          id: doc.id,
          title: doc.title,
          link: doc.link,
          titleChannel: doc.channelTitle,
          thumbnails: doc.thumbnails.high?.url
            ? doc.thumbnails.high?.url
            : doc.thumbnails.default?.url,
        })
      })
      setDataSearch(data)
      setIsSearch(true)
      setLoading(false)
    })
  }
  const handleAddVideo = (id: string) => {
    if (isLogged) {
      setErrorIslogged(false)
      let duplicated
      videosAdds?.forEach((doc) => {
        if (doc.videoId === id) {
          duplicated = 'true'
          return
        }
      })
      if (duplicated === 'true') {
        return
      }
      const data: VideosAddsProps = {
        videoId: id,
        name: displayName ? displayName : 'Unknown',
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
      return
    }
    videosAdds.forEach((doc) => {
      const docRef = FirebaseApi.db.collection('videos').doc(doc.videoId)
      FirebaseApi.batch.set(docRef, doc)
    })
    await FirebaseApi.batch.commit()
    // setVideosAdds([])
    // setIsSearch(false)
    // setSearchText('')
    router.reload()
  }
  // pesquisa e adicionar videos
  // retornar dados para tela inicial e funcionalidades
  useEffect(() => {
    getVideosApi()
  }, [])

  const getVideosApi = async () => {
    // setLoading(true)

    await FirebaseApi.db
      .collection('videos')
      .get()
      .then((data) => {
        // eslint-disable-next-line prefer-const
        let videosId: string[] = []
        data.forEach((doc) => {
          videosId.push(doc.data().videoId)
        })
        setVideosReturnApi(videosId)

        // const storageVideos = localStorage.getItem('videos')
        // const dataVideosStorage = JSON.parse(storageVideos)
        // console.log('video storage', JSON.parse(storageVideos))
        // eslint-disable-next-line prefer-const
        // let videosStorage: string[] = []
        // dataVideosStorage.forEach((x: any) => videosStorage.push(x.id))
        // console.log('videosId', videosId)
        // console.log('videosStorage', videosStorage)

        // videosId = videosId.filter(
        //   (item, index) => item !== videosStorage[index],
        // )
        // console.log('DEPOIS DO FILTER', videosId)

        // videosId = videosId.filter(
        //   (data) =>
        //     data !== dataVideosStorage.forEach((x: string) => videosId.push(x)),
        // )

        // for (let i = 0; i < videosId.length; i++) {
        //   // if (videosStorage.indexOf(videosId[i]) > -1) {
        //   //   videosId.push(videosId[i])
        //   // }
        //   console.log(videosStorage.indexOf(videosId))

        //   // if ( > -1) {
        //   //   videosId.push(videosId[i])
        //   // }
        //   return
        // }

        // console.log('aaaaa', videosId)

        // const opts: youtubeSearch.YouTubeSearchOptions = {
        //   maxResults: videosReturnApi.length,
        //   key: envCustom.KEY_API_YOUTUBE,
        // }
        // // eslint-disable-next-line prefer-const
        // let resultTest = []
        // videosReturnApi.forEach(async (doc) => {
        //   await youtubeSearch(doc, opts, (err, results) => {
        //     if (err) {
        //       console.log(err)
        //       setLoading(false)
        //       return
        //     }
        //     localStorage.setItem('videos', JSON.stringify(results))
        //     console.dir('videos', results)
        //     resultTest.push(results)
        //   })
        //   setLoading(false)
        // })
      })
      .catch((err) => {
        // console.log('deu errado', err)
      })
  }
  // retornar dados para tela inicial e funcionalidades
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
          dataSearch.map((data) => {
            return (
              <C.BoxVideoAdd key={data.id}>
                <C.Video src={data.thumbnails} />
                <C.ContainerInfos>
                  <C.ContainerTitleViews>
                    <C.Title title={data.title}>{data.title}</C.Title>
                  </C.ContainerTitleViews>
                  <C.ContainerAdd onClick={() => handleAddVideo(data.id)}>
                    <C.TextAdd>Adicione</C.TextAdd>
                    <C.AddAndRemove>
                      <MdLibraryAddCheck size={22} color="#fff" />
                    </C.AddAndRemove>
                  </C.ContainerAdd>
                </C.ContainerInfos>
              </C.BoxVideoAdd>
            )
          })
        ) : (
          <C.BoxVideo>
            <C.RegisterBy>
              <C.TextRegisterBy>
                Adicionado por: Rodrigo Higino
              </C.TextRegisterBy>
              <C.Autor>Fonte: zHunter2390</C.Autor>
            </C.RegisterBy>
            <C.Video />
            <C.ContainerInfos>
              <C.ContainerTitleViews>
                <C.Title title="Youtube API com redux typescript e nextjs">
                  Youtube API com redux typescript e nextjs
                </C.Title>
              </C.ContainerTitleViews>
              <C.ContainerLikes>
                <C.CountLikes>1234</C.CountLikes>
                <C.Like>
                  <AiFillLike size={35} color="#2EB086" />
                </C.Like>
                <C.Dislike>
                  <AiOutlineDislike size={35} color="#fff" />
                </C.Dislike>
              </C.ContainerLikes>
            </C.ContainerInfos>
          </C.BoxVideo>
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

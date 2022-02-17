import styled, { keyframes } from 'styled-components'

interface ContainerSearchProps {
  justify: boolean
}

const footer = keyframes`
  to {
    color: #fff;
  }

  from {
    color: #FF2A21;
  }
`
const BoxVideoAnimation = keyframes`
  from {
    transform: scale(0.95)
  }

  to {
    transform: scale(1)
  }
  /* from {
    transform: translate(10px,0)
  }

  to {
    transform: translate(0)
  } */
`
export const Wrapper = styled.main`
  background-color: #181818;
  color: #fff;
  width: 100%;
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
export const ContainerLogoLogin = styled.div`
  width: 100%;
  max-width: 1500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const Logo = styled.img`
  width: 200px;
  cursor: pointer;
`
export const User = styled.div`
  min-width: 160px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px 15px;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(1.05);
  }

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
export const ImgUser = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`
export const NameUser = styled.span`
  font-size: 20px;
  padding-right: 5px;
`
export const Gif = styled.img`
  width: 100px;
`
export const ErrorIsLogged = styled.span`
  font-size: 17px;
  color: #cc1a11;
  font-weight: bold;
`
export const ContainerSearch = styled.div<ContainerSearchProps>`
  width: 100%;
  max-width: 1500px;
  display: flex;
  justify-content: ${({ justify }) => (justify ? 'space-between' : 'flex-end')};
`
export const AddVideo = styled.form`
  display: flex;
  flex-direction: row;
  background: #f5f5f5;
  height: 60px;
  border-radius: 6px;
  align-items: center;
  padding: 0 10px;
`
export const ContainerSendVideos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const SendVideos = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 10px;
  transition: transform 0.2s ease-in;

  &:active {
    transform: scale(0.96);
  }
`
export const TextSendVideos = styled.span`
  font-size: 18px;
`
export const SubTextSend = styled.span`
  font-size: 12px;
`
export const Search = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-size: 18px;
  height: 60px;
`
export const Icon = styled.div`
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: filter 0.2s ease-in;

  &:hover {
    filter: brightness(0) invert(0.5);
  }
`
export const ContainerBoxs = styled.div`
  width: 100%;
  max-width: 1500px;
  min-height: 350px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 4rem;
  background: #202020;
  margin: 20px 0;
  padding: 20px;
  border-radius: 6px;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #181818;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 20px;
    border: 3px solid #181818;
  }
`
export const ContainerInfos = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5px;

  @media (max-width: 550px) {
    flex-direction: column;
  }
`
export const Title = styled.h1`
  font-size: 20px;
  max-width: 270px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const ContainerTitleViews = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const ContainerLikes = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 10px;
`
export const Infos = styled.div`
  display: flex;
  max-width: 270px;
`
export const Views = styled.span`
  font-size: 13px;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const Data = styled.span`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const BoxVideo = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${BoxVideoAnimation} 0.5s ease-in;
`
export const BoxVideoAdd = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${BoxVideoAnimation} 0.5s ease-in;
`
export const ContainerAdd = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 10px;
  border: 1px solid #aaa;
  padding: 5px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(1.05);
  }
  /* &:hover {
    filter: brightness(0) invert(0.8);
  } */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
export const TextAdd = styled.span`
  font-size: 18px;
`
export const AddAndRemove = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`
export const AddImgVideo = styled.img`
  height: 30px;
`
export const RegisterBy = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  @media (max-width: 550px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`
export const TextRegisterBy = styled.span`
  margin-right: 10px;
  font-size: 12px;
  color: #ccc;
`
export const Autor = styled.span`
  font-size: 12px;
  color: #ccc;
`
export const Video = styled.img`
  width: 426px;
  height: 240px;
  background: #ccc;
  border-radius: 10px;
  object-fit: cover;
  transition: filter 0.2s ease-in;

  &:hover {
    filter: brightness(0.8);
  }

  @media (max-width: 550px) {
    width: 256px;
    height: 144px;
  }
`
export const CountLikes = styled.span`
  font-size: 20px;
`
export const Like = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;
  &:active {
    transform: scale(1.1);
  }
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
export const Dislike = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  &:active {
    transform: scale(1.1);
  }
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
export const Footer = styled.div`
  margin: 20px 0 40px 0;
`
export const TextFooter = styled.a`
  font-size: 22px;
  color: #f5f5f5;
  text-decoration: none;
  animation: ${footer} 5s ease-in infinite alternate;
`

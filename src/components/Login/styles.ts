import styled, { keyframes } from 'styled-components'

const LoginAnimation = keyframes`
  from {
    transform: translate(-500px,0)
  }

  to {
    transform: translate(0)
  }
`
export const Container = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`
export const ContainerLogoLogin = styled.div`
  width: 100%;
  max-width: 1500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 150px;
`
export const Logo = styled.img`
  width: 200px;
  cursor: pointer;
`
export const Content = styled.div`
  width: 100%;
  max-width: 400px;
  background: #f9f9f9;
  color: #000;
  padding: 20px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  animation: ${LoginAnimation} 0.8s ease-in;
`
export const H3 = styled.h3`
  font-size: 30px;
  font-weight: normal;
  margin-bottom: 30px;
  text-align: center;
`
export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`
export const Gif = styled.img`
  position: absolute;
  height: 100px;
  right: -60px;
  top: -180px;
  z-index: -1;
  transform: rotate(20deg);
`
export const Input = styled.input`
  padding: 15px 25px;
  font-size: 16px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
`
export const Button = styled.button`
  width: 100%;
  max-width: 400px;
  background: #2eb086;
  color: white;
  padding: 15px 25px;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  transition: filter 0.2s ease-in;
  &:hover {
    filter: brightness(0.9);
  }
  &:active {
    transform: scale(1.02);
  }
`
export const P = styled.p`
  font-size: 16px;
  margin-top: 10px;
`
export const Google = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #ccc;
  gap: 3.5rem;
  cursor: pointer;

  @media (max-width: 400px) {
    gap: 3.2rem;
  }
  @media (max-width: 380px) {
    gap: 3rem;
  }
  @media (max-width: 340px) {
    gap: 1rem;
  }
`
export const TextGoogle = styled.span`
  color: black;
  font-size: 20px;
`
export const Img = styled.img`
  height: 25px;
`
export const ErrorText = styled.span`
  color: red;
  font-weight: bold;
  font-size: 12px;
  margin-top: -8px;
`

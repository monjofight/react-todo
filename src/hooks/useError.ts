import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CsrfToken } from '../types'
import useStore from '../store'

export const useError = () => {
  const navigate = useNavigate()
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  const getCsrftoken = async () => {
    const { data } = await axios.get<CsrfToken>(
      `${process.env.REACT_APP_API_URL}/api/csrf`
    )
    axios.defaults.headers.common['X-CSRF-TOKEN'] = data.csrf_token
    return data
  }
  const switchErrorHandling = (msg: string) => {
    switch (msg) {
      case 'invalid csrf token':
        getCsrftoken()
        alert('CSFR token is invalid, please try again')
        break
      case 'invalid or expired jwt':
        alert('access token expired, please login')
        resetEditedTask()
        navigate('/')
        break
      case 'missing or malformed jwt':
        alert('access token is not valid, please login')
        resetEditedTask()
        navigate('/')
        break
      case 'duplicated key not allowed':
        alert('email already exist, please use another one')
        break
      case 'crypto/bcrypt: hashedPassword is not the hash of the given password':
        alert('password is not correct')
        break
      case 'record not found':
        alert('email is not correct')
        break
      default:
        alert(msg)
    }
  }
  return { switchErrorHandling }
}

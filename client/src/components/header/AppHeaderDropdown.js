import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImage,
  CSpinner,
} from '@coreui/react'
import { cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { WholePageLoading, api } from '../SystemConfiguration'
import Avatar from './Avatar'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [operationLoading, setOperationLoading] = useState(false)
  const [userId, setUserId] = useState('')
  useEffect(() => {
    fetchData()

    // Setup interval to fetch data every 5 seconds (5000 milliseconds)
    // const intervalId = setInterval(fetchData, 1000)

    // // // Cleanup function to clear interval when the component unmounts
    // return () => clearInterval(intervalId)
  }, [])
  const fetchData = async () => {
    try {
      const user = jwtDecode(localStorage.getItem('scholarshipToken'))
      setUserId(user.id)
      // await api
      //   .get('user/find/' + user.id)
      //   .then((response) => {
      //     if (response.data.photo) {
      //       if (isProduction) {
      //         setPhoto(
      //           process.env.REACT_APP_BASEURL_PRODUCTION +
      //             'assets/image/user/' +
      //             response.data.photo,
      //         )
      //       } else {
      //         setPhoto(
      //           process.env.REACT_APP_BASEURL_DEVELOPMENT +
      //             'assets/image/user/' +
      //             response.data.photo,
      //         )
      //       }
      //     } else {
      //       if (isProduction) {
      //         setPhoto(
      //           process.env.REACT_APP_BASEURL_PRODUCTION + 'assets/image/user/defaultAvatar.png',
      //         )
      //       } else {
      //         setPhoto(
      //           process.env.REACT_APP_BASEURL_DEVELOPMENT + 'assets/image/user/defaultAvatar.png',
      //         )
      //       }
      //     }
      //   })
      //   .catch((error) => {
      //     // toast.error(handleErforror(error))
      //   })
      //   .finally(() => {
      //     // setFetchSenifororHighSchoolLoading(false)
      //   })
    } catch (err) {
      console.info(err)
    }
  }
  const handleLogout = async (e) => {
    e.preventDefault()
    let user = []
    const isTokenExist = localStorage.getItem('scholarshipToken') !== null

    if (isTokenExist) {
      user = jwtDecode(localStorage.getItem('scholarshipToken'))

      setOperationLoading(true)
      await api
        .put('user/update/' + user.id, { isLogin: 0 })
        .then((response) => {
          localStorage.removeItem('scholarshipToken')
          navigate('/login', { replace: true })
        })
        .catch((error) => {
          console.info(error)
        })
        .finally(() => {
          setOperationLoading(false)
        })
    }
  }
  return (
    <>
      <CDropdown className="_avatar" variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 " caret={false}>
          <Avatar userId={userId} />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem href="#/login" onClick={handleLogout}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      {operationLoading && <WholePageLoading />}
    </>
  )
}

export default AppHeaderDropdown

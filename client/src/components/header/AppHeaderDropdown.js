import React, { useState } from 'react'
import { CAvatar, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilAccountLogout, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar from './../../assets/images/avatars/user.png'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { DefaultLoading, WholePageLoading, WidgetLoading, api } from '../SystemConfiguration'
import { ToastContainer, toast } from 'react-toastify'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [operationLoading, setOperationLoading] = useState(false)
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
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <lord-icon
            src="https://cdn.lordicon.com/zfmcashd.json"
            trigger="hover"
            style={{ width: '50px', height: '50px' }}
          ></lord-icon>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          {/* <CDropdownItem href="#/profile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem> */}
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

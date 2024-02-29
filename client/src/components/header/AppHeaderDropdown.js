import React, { useState } from 'react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CSpinner } from '@coreui/react'
import { cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { WholePageLoading, api } from '../SystemConfiguration'

const isProduction = false
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
      <CDropdown className="_avatar" variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 " caret={false}>
          <lord-icon
            className="position-relative"
            src="https://cdn.lordicon.com/zfmcashd.json"
            trigger="hover"
            style={{ width: '50px', height: '50px' }}
          >
            <CSpinner
              position="bottom-end"
              color={isProduction ? 'success ' : 'danger'}
              className="border border-light pb-2"
              size="sm"
              variant="grow"
              style={{ marginTop: 35, marginLeft: 30, zIndex: 2 }}
            />
          </lord-icon>
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

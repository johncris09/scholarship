import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './../assets/css/custom.css'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { Skeleton, Typography } from '@mui/material'
import { DefaultLoading, api } from './SystemConfiguration'

const AppHeader = () => {
  const [config, setConfig] = useState([])
  const [fetchConfigLoading, setFetchConfigLoading] = useState(false)
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    api
      .get('config')
      .then((response) => {
        setConfig(response.data[0])
      })
      .catch((error) => {
        console.info(error)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchConfigLoading(false)
      })
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderBrand className="toggleHide _currentView" style={{ fontSize: 15 }}>
          <>
            {!fetchConfigLoading ? (
              <>
                School Year: {config.current_sy} | Semester: {config.current_semester}
              </>
            ) : (
              <Skeleton variant="rectangular" width={360} />
            )}
          </>
        </CHeaderBrand>
        <CHeaderBrand className="mx-auto  d-md-none _currentView" to="/#">
          <Typography variant="h6">Oroquieta City Scholarship System</Typography>
          <Typography variant="h6" className="current-view">
            <>
              {!fetchConfigLoading ? (
                <>
                  School Year: {config.current_sy} | Semester: {config.current_semester}
                </>
              ) : (
                <Skeleton variant="rectangular" width={250} />
              )}
            </>
          </Typography>
        </CHeaderBrand>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader

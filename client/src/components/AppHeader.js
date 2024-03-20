import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './../assets/css/custom.css'
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CImage,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, cilX } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { api, toSentenceCase } from './SystemConfiguration'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { useNavigate } from 'react-router-dom'

const isProduction = false
const AppHeader = () => {
  const typeAheadRef = useRef()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState([])

  const navigate = useNavigate()

  const handleSearch = async (query) => {
    setIsLoading(true)

    await api
      .get('advance_search', { params: { query } })
      .then((response) => {
        setOptions(response.data)
      })
      .catch((error) => {
        console.info(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const filterBy = () => true

  const handleSelection = (selected) => {
    if (selected && selected.length > 0 && selected[0].firstname) {
      // Access the firstname property here
      navigate(
        '/search/' +
          toSentenceCase(selected[0].lastname) +
          ', ' +
          toSentenceCase(selected[0].firstname) +
          ' ' +
          toSentenceCase(selected[0].middlename) +
          ' ' +
          selected[0].suffix,
        { replace: true },
      )
    }
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
        <CHeaderNav className="me-auto" id="async-search" style={{ position: 'relative' }}>
          <AsyncTypeahead
            id="async-search-input"
            ref={typeAheadRef}
            align="justify"
            filterBy={filterBy}
            // isLoading={isLoading}
            labelKey={(option) =>
              `${toSentenceCase(option.lastname)}, ${toSentenceCase(
                option.firstname,
              )} ${toSentenceCase(option.middlename)} ${option.suffix}`
            }
            highlightClassName="rbt-highlight-text"
            minLength={2}
            highlightOnlyResult={true}
            autoFocus={true}
            onSearch={handleSearch}
            onChange={handleSelection}
            options={options}
            maxResults={5}
            placeholder="Search applicant ..."
            inputProps={{ style: { paddingLeft: 40, borderRadius: 20 } }}
            renderMenuItemChildren={(row) => {
              let photo = row.photo ? row.photo : 'defaultAvatar.png' // Assuming defaultAvatar.png is a string
              return (
                <>
                  <span>
                    <CImage
                      style={{ borderRadius: 50, marginRight: 7 }}
                      src={
                        isProduction
                          ? process.env.REACT_APP_BASEURL_PRODUCTION +
                            'assets/image/scholarship/' +
                            photo
                          : process.env.REACT_APP_BASEURL_DEVELOPMENT +
                            'assets/image/scholarship/' +
                            photo
                      }
                      alt="Profile Photo"
                      width={25}
                      height={25}
                    />
                  </span>
                  <span>
                    {toSentenceCase(row.lastname)}, {toSentenceCase(row.firstname)}{' '}
                    {toSentenceCase(row.middlename)} {row.suffix}
                  </span>
                </>
              )
            }}
            renderToken={(option, props, index) => (
              <span key={index}>
                {`${toSentenceCase(option.lastname)}, ${toSentenceCase(
                  option.firstname,
                )} ${toSentenceCase(option.middlename)} ${option.suffix}`}
              </span>
            )}
          />
          {!isLoading ? (
            <lord-icon
              src="https://cdn.lordicon.com/kkvxgpti.json"
              trigger="hover"
              delay="2000"
              colors="primary:#b4b4b4"
              style={{
                width: '30px',
                height: '30px',
                position: 'absolute',
                top: '50%',
                left: '5px',
                transform: 'translateY(-50%)',
              }}
            ></lord-icon>
          ) : (
            <CSpinner
              size="sm"
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                top: '20%',
                left: '10px',
                color: '#b4b4b4',
                // transform: 'translateY(-50%)',
              }}
            />
          )}
          {options.length > 0 && (
            <CIcon
              icon={cilX}
              onClick={() => {
                setOptions([])
                typeAheadRef.current.clear()
              }}
              style={{
                position: 'absolute',
                color: '#b4b4b4',
                top: '50%',
                right: '15px',
                transform: 'translateY(-50%)',
              }}
            />
          )}
        </CHeaderNav>

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

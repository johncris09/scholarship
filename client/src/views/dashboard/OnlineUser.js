import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import 'animate.css'
import { api, toSentenceCase } from 'src/components/SystemConfiguration'
import { Skeleton } from '@mui/material'
import 'intro.js/introjs.css'

import { useQuery } from '@tanstack/react-query'

const OnlineUser = () => {
  const onlineUser = useQuery({
    queryFn: async () =>
      await api.get('user/online').then((response) => {
        return response.data
      }),
    queryKey: ['onlineUser'],
    refetchIntervalInBackground: true,
  })

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          {onlineUser.isLoading ? <Skeleton variant="rectangular" width={100} /> : 'Online Users'}
        </CCardHeader>
        <CCardBody>
          <CTable small striped bordered responsive hover className="text-center">
            {onlineUser.isLoading ? (
              <>
                <CTableRow>
                  {[...Array(4)].map((_, IndexCol) => (
                    <CTableHeaderCell key={IndexCol} scope="row">
                      <Skeleton
                        variant="rounded"
                        width={'80%'}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.11)', margin: 'auto' }}
                      />
                    </CTableHeaderCell>
                  ))}
                </CTableRow>
                {[...Array(6)].map((_, indexRow) => (
                  <CTableRow key={indexRow}>
                    {[...Array(4)].map((_, IndexCol) => (
                      <CTableDataCell key={IndexCol} style={{ padding: 5 }}>
                        <Skeleton
                          variant="rounded"
                          width={'80%'}
                          style={{ backgroundColor: 'rgba(0, 0, 0, 0.11)', margin: 'auto' }}
                        />
                      </CTableDataCell>
                    ))}
                  </CTableRow>
                ))}
              </>
            ) : (
              <>
                <CTableRow>
                  <CTableHeaderCell scope="row">Name</CTableHeaderCell>
                  <CTableDataCell scope="row">Login</CTableDataCell>
                  <CTableDataCell scope="row">Logout</CTableDataCell>
                  <CTableDataCell scope="row">Status</CTableDataCell>
                </CTableRow>
                {onlineUser.data.map((row, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{`${toSentenceCase(row.firstname)} ${toSentenceCase(
                      row.lastname,
                    )}`}</CTableDataCell>
                    <CTableDataCell>{row.login_time}</CTableDataCell>
                    <CTableDataCell>{row.logout_time}</CTableDataCell>
                    <CTableDataCell>
                      {row.isLogin == 1 ? (
                        <FontAwesomeIcon className="text-success" icon={faCircle} />
                      ) : (
                        <FontAwesomeIcon className="text-danger" icon={faCircle} />
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </>
            )}
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default OnlineUser

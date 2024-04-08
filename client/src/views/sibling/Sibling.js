import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { CAlert, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { api, handleError, toSentenceCase } from 'src/components/SystemConfiguration'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'

const Sibling = ({ cardTitle }) => {
  const [siblingData, setSiblingData] = useState([])
  const [fetchSiblingLoading, setFetchSiblingLoading] = useState(true)

  useEffect(() => {
    fetchSibling()
  }, [])

  const fetchSibling = () => {
    api
      .get('sibling')
      .then((response) => {
        setSiblingData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchSiblingLoading(false)
      })
  }

  const column = [
    {
      accessorKey: 'lastname',
      header: 'Last Name',
      accessorFn: (row) => `${toSentenceCase(row.lastname)}`,
    },
    {
      accessorKey: 'firstname',
      header: 'First Name',
      accessorFn: (row) => `${toSentenceCase(row.firstname)}`,
    },
    {
      accessorKey: 'middlename',
      header: 'Middle Name',
      accessorFn: (row) => `${toSentenceCase(row.middlename)}`,
    },
    {
      accessorKey: 'suffix',
      header: 'Suffix',
      accessorFn: (row) => `${toSentenceCase(row.suffix)}`,
    },
    {
      accessorKey: 'father_name',
      header: "Father's Name",
      accessorFn: (row) => `${toSentenceCase(row.father_name)}`,
    },
    {
      accessorKey: 'mother_name',
      header: "Mother's Name",
      accessorFn: (row) => `${toSentenceCase(row.mother_name)}`,
    },
    {
      accessorKey: 'scholarship_type',
      header: 'Scholarship Type',
      accessorFn: (row) => {
        if (row.scholarship_type === 'senior_high') {
          return 'Senior High'
        } else if (row.scholarship_type === 'college') {
          return 'College'
        } else if (row.scholarship_type === 'tvet') {
          return 'Tvet'
        }
      },
    },
  ]
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <ToastContainer />

          <CRow>
            <CCol md={12}>
              <CAlert color="info" className="d-flex align-items-center">
                <CIcon icon={cilInfo} className="flex-shrink-0 me-2" width={24} height={24} />
                <div style={{ fontSize: 12 }}>
                  This feature isn&apos;t 100% accurate due to typographical errors. To ensure
                  accurate results, the procedure should involve grouping individuals by their
                  mother&apos;s name and listing all possible siblings. Subsequently, this process
                  should be repeated for the father&apos;s name. Finally, the results obtained from
                  both procedures should be combined into a single list.
                </div>
              </CAlert>

              <MaterialReactTable
                columns={column}
                data={siblingData}
                enableRowVirtualization
                enableColumnVirtualization
                state={{
                  isLoading: fetchSiblingLoading,
                  isSaving: fetchSiblingLoading,
                  showLoadingOverlay: fetchSiblingLoading,
                  showProgressBars: fetchSiblingLoading,
                  showSkeletons: fetchSiblingLoading,
                }}
                muiCircularProgressProps={{
                  color: 'secondary',
                  thickness: 5,
                  size: 55,
                }}
                muiSkeletonProps={{
                  animation: 'pulse',
                  height: 28,
                }}
                enableColumnResizing
                enableGrouping
                columnFilterDisplayMode="popover"
                paginationDisplayMode="pages"
                positionToolbarAlertBanner="bottom"
                enableStickyHeader
                enableStickyFooter
                initialState={{ density: 'compact' }}
              />
            </CCol>
            {/* {fetchSiblingLoading && <DefaultLoading />} */}
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Sibling

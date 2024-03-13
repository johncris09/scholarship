import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { ToastContainer, toast } from 'react-toastify'
import { Box, Button } from '@mui/material'
import { api, calculateAge, toSentenceCase } from 'src/components/SystemConfiguration'
import BasicInfo from '../registration/BasicInfo'
import ScholarshipHistory from '../registration/ScholarshipHistory'

const Applicant = ({ cardTitle }) => {
  const [data, setData] = useState([])
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [isViewAll, setIsViewAll] = useState(true)
  useEffect(() => {
    fetchData()
  }, [])

  const column = [
    {
      accessorKey: 'reference_number',
      header: 'Reference #',
      accessorFn: (row) => row.reference_number,
    },
    {
      accessorKey: 'lastname',
      header: 'Last Name',
      accessorFn: (row) => toSentenceCase(row.lastname),
    },
    {
      accessorKey: 'firstname',
      header: 'First Name',
      accessorFn: (row) => toSentenceCase(row.firstname),
    },
    {
      accessorKey: 'middlename',
      header: 'Middle Name',
      accessorFn: (row) => toSentenceCase(row.middlename),
    },
    {
      accessorKey: 'suffix',
      header: 'Suffix',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'birthdate',
      header: 'Birthdate',
    },
    {
      accessorKey: 'id',
      header: 'Age',
      accessorFn: (row) => calculateAge(row.birthdate),
    },
    {
      accessorKey: 'civil_status',
      header: 'Civil Status',
      accessorFn: (row) => toSentenceCase(row.civil_status),
    },
    {
      accessorKey: 'sex',
      header: 'Sex',
      accessorFn: (row) => toSentenceCase(row.sex),
    },
    {
      accessorKey: 'contact_number',
      header: 'Contact Number',
    },
    {
      accessorKey: 'email_address',
      header: 'Email Address',
    },
    {
      accessorKey: 'father_name',
      header: 'Father Name',
      accessorFn: (row) => toSentenceCase(row.father_name),
    },
    {
      accessorKey: 'father_occupation',
      header: 'Father Occupation',
      accessorFn: (row) => toSentenceCase(row.father_occupation),
    },

    {
      accessorKey: 'mother_name',
      header: 'Mother Name',
      accessorFn: (row) => toSentenceCase(row.mother_name),
    },
    {
      accessorKey: 'mother_occupation',
      header: 'Mother Occupation',
      accessorFn: (row) => toSentenceCase(row.mother_occupation),
    },
  ]

  const fetchData = async () => {
    await api
      .get('applicant')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(error)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={data}
            state={{
              isLoading: fetchDataLoading,
              isSaving: fetchDataLoading,
              showLoadingOverlay: fetchDataLoading,
              showProgressBars: fetchDataLoading,
              showSkeletons: fetchDataLoading,
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
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableGrouping
            enableStickyHeader
            enableStickyFooter
            initialState={{
              density: 'compact',
            }}
            renderTopToolbarCustomActions={({ row, table }) => (
              <Button
                color="primary"
                variant="contained"
                shape="rounded-pill"
                style={{ borderRadius: 50 }}
                onClick={async () => {
                  setIsViewAll(!isViewAll)
                  setFetchDataLoading(true)
                  if (isViewAll) {
                    await api
                      .get('all_applicant')
                      .then((response) => {
                        setData(response.data)
                      })
                      .catch((error) => {
                        toast.error(error)
                        // toast.error(handleError(error))
                      })
                      .finally(() => {
                        setFetchDataLoading(false)
                      })
                  } else {
                    fetchData()
                  }
                }}
              >
                <lord-icon
                  src="https://cdn.lordicon.com/unukghxb.json"
                  trigger={!fetchDataLoading ? 'hover' : 'loop'}
                  colors="primary:#ffffff,secondary:#ffffff"
                  style={{ width: '30px', height: '30px' }}
                ></lord-icon>{' '}
                {isViewAll ? 'View All' : 'View Current'}
              </Button>
            )}
            enableExpandAll={false}
            muiExpandButtonProps={({ row, table }) => ({
              onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
              sx: {
                transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              },
            })}
            autoResetExpanded={true}
            renderDetailPanel={({ row }) => {
              return row.original.id ? (
                <>
                  <Box
                    sx={{
                      left: '10px',
                      maxWidth: '1500px',
                      position: 'sticky',
                      width: '100%',
                    }}
                  >
                    <BasicInfo id={row.original.id} />
                  </Box>
                  <Box
                    sx={{
                      left: '10px',
                      maxWidth: '1500px',
                      position: 'sticky',
                      width: '100%',
                    }}
                  >
                    <ScholarshipHistory
                      scholarshipId={row.original.id}
                      hasNewRecordButton={false}
                    />
                  </Box>
                </>
              ) : null
            }}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Applicant

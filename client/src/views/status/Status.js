import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { ToastContainer, toast } from 'react-toastify'
import { Box } from '@mui/material'
import {
  DefaultLoading,
  api,
  calculateAge,
  toSentenceCase,
} from 'src/components/SystemConfiguration'
import { useNavigate, useParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { ExportToCsv } from 'export-to-csv'

const Applicant = ({ cardTitle }) => {
  const { status } = useParams()
  const [data, setData] = useState([])
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  useEffect(() => {
    fetchData()
  }, [])

  const column = [
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
      accessorKey: 'id',
      header: 'Age',
      accessorFn: (row) => calculateAge(row.birthdate),
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
      accessorKey: 'strand',
      header: 'Strand',
    },
    {
      accessorKey: 'grade_level',
      header: 'Grade Level',
    },
    {
      accessorKey: 'app_status',
      header: 'Status',
    },
  ]

  const fetchData = async () => {
    const token = jwtDecode(localStorage.getItem('scholarshipToken'))
    await api
      .get('get_applicant_by_status', { params: { status: status, school: token.school } })
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
  const csvOptions = (column) => {
    return {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: column.map((c) => c.header),
    }
  }

  const handleExportSeniorHighData = (data) => {
    const csvExporter = new ExportToCsv(csvOptions(column))

    const exportedData = data.map((item) => {
      const exportedItem = {}
      column.forEach((col) => {
        exportedItem[col.header] = col.accessorFn ? col.accessorFn(item) : item[col.accessorKey]
      })
      return exportedItem
    })

    csvExporter.generateCsv(exportedData)
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
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
          enableColumnActions={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          columnFilterDisplayMode="popover"
          paginationDisplayMode="pages"
          positionToolbarAlertBanner="bottom"
          // enableGrouping
          initialState={{
            density: 'compact',
            pagination: { pageSize: 20 },
          }}
          renderTopToolbarCustomActions={({ table }) => (
            <>
              <Box
                className="d-none d-lg-flex"
                sx={{
                  display: 'flex',
                  gap: '.2rem',
                  p: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <CButton
                  className="btn-info text-white"
                  onClick={() => handleExportSeniorHighData(data)}
                  size="sm"
                >
                  <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                </CButton>
              </Box>
              <Box
                className="d-none d-lg-flex"
                sx={{
                  display: 'flex',
                  gap: '.2rem',
                  p: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <h5>List of {toSentenceCase(status)} Applicants</h5>
              </Box>
            </>
          )}
        />
      </CCard>
    </>
  )
}

export default Applicant

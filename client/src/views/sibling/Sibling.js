import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEye, faFilter } from '@fortawesome/free-solid-svg-icons'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormSelect,
  CFormText,
  CRow,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { useFormik } from 'formik'
import {
  RequiredFieldNote,
  SchoolYear,
  Semester,
  api,
  handleError,
  requiredField,
  toSentenceCase,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
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
  const handleViewAllData = async () => {
    filterForm.resetForm()

    setFetchSiblingLoading(true)
    await api
      .get('get_all_sibling')
      .then((response) => {
        setSiblingData(response.data)
      })
      .catch((error) => {
        console.info(error)
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchSiblingLoading(false)
      })
  }

  const filterFormValidationSchema = Yup.object().shape({
    semester: Yup.string().required('Semester is required'),
    school_year: Yup.string().required('School Year is required'),
  })

  const filterForm = useFormik({
    initialValues: {
      semester: '',
      school_year: '',
    },
    validationSchema: filterFormValidationSchema,
    onSubmit: async (values) => {
      setFetchSiblingLoading(true)
      await api
        .get('filter_sibling', {
          params: {
            ...values,
          },
        })
        .then((response) => {
          setSiblingData(response.data)
        })
        .catch((error) => {
          console.info(error)
          toast.error(handleError(error))
        })
        .finally(() => {
          setFetchSiblingLoading(false)
        })
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    filterForm.setFieldValue(name, value)
  }

  const handleRemoveFilter = () => {
    filterForm.resetForm()
    setFetchSiblingLoading(true)
    fetchSibling()
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

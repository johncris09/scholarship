import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEye, faFilter } from '@fortawesome/free-solid-svg-icons'
import {
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
        console.info(response.data)
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
  ]
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <ToastContainer />
          <CRow className="justify-content-center ">
            <CCol md={6}>
              <h5>
                <FontAwesomeIcon icon={faFilter} /> Filter
              </h5>
              <CForm
                id="filterForm"
                className="row g-3 needs-validation mb-4"
                noValidate
                onSubmit={filterForm.handleSubmit}
              >
                <RequiredFieldNote />

                <CRow className="my-1">
                  <CCol md={6}>
                    <CFormSelect
                      label={requiredField('Semester')}
                      name="semester"
                      onChange={handleInputChange}
                      value={filterForm.values.semester}
                      required
                    >
                      <option value="">Select</option>
                      {Semester.map((semester, index) => (
                        <option key={index} value={semester}>
                          {semester}
                        </option>
                      ))}
                    </CFormSelect>
                    {filterForm.touched.semester && filterForm.errors.semester && (
                      <CFormText className="text-danger">{filterForm.errors.semester}</CFormText>
                    )}
                  </CCol>

                  <CCol md={6}>
                    <CFormSelect
                      label={requiredField('School Year')}
                      name="school_year"
                      onChange={handleInputChange}
                      value={filterForm.values.school_year}
                      required
                    >
                      <option value="">Select</option>
                      {SchoolYear.map((school_year, index) => (
                        <option key={index} value={school_year}>
                          {school_year}
                        </option>
                      ))}
                    </CFormSelect>
                    {filterForm.touched.school_year && filterForm.errors.school_year && (
                      <CFormText className="text-danger">{filterForm.errors.school_year}</CFormText>
                    )}
                  </CCol>
                </CRow>

                <CRow className="justify-content-between mt-1">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveFilter}
                    >
                      <FontAwesomeIcon icon={faCancel} /> Remove Filter
                    </CButton>
                    <CButton
                      size="sm"
                      variant="outline"
                      color="primary"
                      onClick={handleViewAllData}
                    >
                      <FontAwesomeIcon icon={faEye} /> View All Data
                    </CButton>
                    <CButton color="primary" size="sm" type="submit">
                      <FontAwesomeIcon icon={faFilter} /> Filter
                    </CButton>
                  </div>
                </CRow>
              </CForm>
              {/* {loadingOperation && <DefaultLoading />} */}
              <hr />
            </CCol>
          </CRow>

          <CRow>
            <CCol>
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

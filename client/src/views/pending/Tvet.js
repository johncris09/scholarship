import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import {
  faCancel,
  faCheckSquare,
  faEye,
  faFileExcel,
  faFilter,
  faTimesRectangle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import Select from 'react-select'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box, ListItemIcon, MenuItem } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import {
  ApprovedType,
  DefaultLoading,
  RequiredFieldNote,
  SchoolYear,
  Semester,
  StatusType,
  YearLevel,
  api,
  handleError,
  handleExportTvetData,
  handleExportTvetRows,
  requiredField,
  toSentenceCase,
  tvetDefaultColumn,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'

const Tvet = () => {
  const selectCourseInputRef = useRef()
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(false)
  const [bulkApprovedValidated, setBulkApprovedValidated] = useState(false)
  const [course, setCourse] = useState([])
  const [school, setSchool] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalBulkApproved, setModalBulkApprovedVisible] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [editId, setEditId] = useState('')
  const [table, setTable] = useState([])
  const [applicationDetailsModalVisible, setApplicationDetailsModalVisible] = useState(false)
  const [fetchSchoolLoading, setFetchSchoolLoading] = useState(false)
  const [fetchCourseLoading, setFetchCourseLoading] = useState(false)

  useEffect(() => {
    fetchData()
    fetchSchool()
    fetchCourse()
  }, [])

  const fetchSchool = () => {
    setFetchSchoolLoading(true)
    api
      .get('tvet_school')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })

        setSchool(formattedData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setFetchSchoolLoading(false)
      })
  }

  const fetchCourse = () => {
    setFetchCourseLoading(true)
    api
      .get('tvet_course')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.course}`
          return { value, label }
        })

        setCourse(formattedData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setFetchCourseLoading(false)
      })
  }

  const fetchData = () => {
    api
      .get('tvet/get_by_status', {
        params: {
          status: 'pending',
        },
      })
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    approvedForm.setFieldValue(name, value)
    filterForm.setFieldValue(name, value)
    applicationDetailsForm.setFieldValue(name, value)
  }

  const handleSelectChange = (selectedOption, ref) => {
    applicationDetailsForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
  const applicationDetailsFormValidationSchema = Yup.object().shape({
    app_status: Yup.string().required('Application Status  is required'),
    school: Yup.string().required('School is required'),
    course: Yup.string().required('Course  is required'),
    hourNumber: Yup.string().required('No. of hours is required'),
    semester: Yup.string().required('Semester is required'),
    school_year: Yup.string().required('School Year is required'),
    availment: Yup.string().required('Availment is required'),
    ctc: Yup.string().required('CTC # is required'),
  })
  const applicationDetailsForm = useFormik({
    initialValues: {
      lastname: '',
      firstname: '',
      middlename: '',
      reference_number: '',
      scholarship_id: '',
      app_year_number: '',
      app_sem_number: '',
      app_id_number: '',
      school: '',
      course: '',
      hourNumber: '',
      year_level: '',
      semester: '',
      school_year: '',
      availment: '',
      ctc: '',
      app_status: '',
    },
    validationSchema: applicationDetailsFormValidationSchema,
    onSubmit: async (values) => {
      setLoadingOperation(true)
      await api
        .put('tvet/update/' + editId, values)
        .then((response) => {
          toast.success(response.data.message)
          fetchData()
          setApplicationDetailsModalVisible(false)
        })
        .catch((error) => {
          console.info(error)
          // toast.error(handleError(error))
        })
        .finally(() => {
          setLoadingOperation(false)
        })
    },
  })
  const handleDeleteRows = (table) => {
    const rows = table.getSelectedRowModel().rows

    const selectedRows = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          id: item.id,
        }
      })
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        validationPrompt(() => {
          setLoading(true)
          api
            .post('tvet/bulk_status_update', {
              data: selectedRows,
              status: 'Archived',
            })

            .then((response) => {
              toast.success(response.data.message)
              fetchData()
              table.resetRowSelection()
            })
            .catch((error) => {
              toast.error(handleError(error))
            })
            .finally(() => {
              setLoading(false)
            })
        })
      }
    })
  }

  const handleBulkDisapprovedRows = async (table) => {
    const rows = table.getSelectedRowModel().rows

    const selectedRows = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          id: item.id,
        }
      })

    Swal.fire({
      title: 'Selected row(s) will be disapproved.',
      text: 'Reason for disapproval (optional)',
      input: 'textarea',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        validationPrompt(() => {
          setLoading(true)
          api
            .post('tvet/bulk_status_update', {
              data: selectedRows,
              status: 'Disapproved',
              reason: result.value,
            })

            .then((response) => {
              toast.success(response.data.message)
              fetchData()
              table.resetRowSelection()
            })
            .catch((error) => {
              toast.error(handleError(error))
            })
            .finally(() => {
              setLoading(false)
            })
        })
      }
    })
  }

  const approvedForm = useFormik({
    initialValues: {
      status: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])
      if (areAllFieldsFilled) {
        validationPrompt(() => {
          setLoadingOperation(true)
          api
            .post('tvet/bulk_status_update', {
              data: selectedRows,
              status: values.status,
            })
            .then((response) => {
              toast.success(response.data.message)
              fetchData()
              approvedForm.resetForm()
              setBulkApprovedValidated(false)
              setModalBulkApprovedVisible(false)
              table.resetRowSelection()
              // clear select rows
              setSelectedRows([])
            })
            .catch((error) => {
              toast.error(handleError(error))
            })
            .finally(() => {
              setLoadingOperation(false)
            })
        })
      } else {
        setBulkApprovedValidated(true)
      }
    },
  })

  const handleBulkApprovedRows = (table) => {
    const rows = table.getSelectedRowModel().rows

    // clear select rows
    setSelectedRows([])

    const selectedRows = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          id: item.id,
        }
      })

    setSelectedRows(selectedRows)
    setModalBulkApprovedVisible(true)
    setTable(table)
  }

  const handleViewAllData = () => {
    setLoading(true)
    api
      .get('tvet/get_all_by_status', {
        params: {
          status: 'pending',
        },
      })
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
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
      setLoadingOperation(true)
      setLoading(true)
      await api
        .get('tvet/filter_by_status', {
          params: {
            ...values,
            status: 'pending',
          },
        })
        .then((response) => {
          setData(response.data)
          setValidated(false)
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setLoadingOperation(false)
          setLoading(false)
        })
    },
  })

  const handleRemoveFilter = () => {
    setLoading(true)
    setLoadingOperation(true)
    filterForm.resetForm()
    fetchData()
  }

  return (
    <>
      <ToastContainer />
      <CRow className="justify-content-center">
        <CCol md={6}>
          <h5>
            <FontAwesomeIcon icon={faFilter} /> Filter
          </h5>
          <CForm
            id="filterForm"
            className="row g-3 needs-validation mb-4"
            noValidate
            validated={validated}
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
                <CButton color="danger" size="sm" variant="outline" onClick={handleRemoveFilter}>
                  <FontAwesomeIcon icon={faCancel} /> Remove Filter
                </CButton>
                <CButton size="sm" variant="outline" color="primary" onClick={handleViewAllData}>
                  <FontAwesomeIcon icon={faEye} /> View All Data
                </CButton>
                <CButton color="primary" size="sm" type="submit">
                  <FontAwesomeIcon icon={faFilter} /> Filter
                </CButton>
              </div>
            </CRow>
          </CForm>

          {loadingOperation && <DefaultLoading />}
          <hr />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <MaterialReactTable
            columns={tvetDefaultColumn}
            data={data}
            enableRowVirtualization
            enableColumnVirtualization
            state={{
              isLoading: loading,
              isSaving: loading,
              showLoadingOverlay: loading,
              showProgressBars: loading,
              showSkeletons: loading,
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
            enableRowSelection
            enableGrouping
            enableSelectAll={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            selectAllMode="all"
            initialState={{ density: 'compact' }}
            renderRowActionMenuItems={({ closeMenu, row }) => [
              <MenuItem
                key={0}
                onClick={async () => {
                  closeMenu()

                  let id = row.original.id

                  applicationDetailsForm.setValues({
                    reference_number: row.original.reference_number,
                    lastname: row.original.lastname,
                    firstname: row.original.firstname,
                    middlename: row.original.middlename,
                    availment: row.original.availment,
                    ctc: row.original.ctc,
                    app_year_number: row.original.app_year_number,
                    app_sem_number: row.original.app_sem_number,
                    app_id_number: row.original.app_id_number,
                    school: row.original.tvet_school_id,
                    course: row.original.tvet_course_id,
                    hourNumber: row.original.hour_number,
                    semester: row.original.semester,
                    year_level: row.original.year_level,
                    school_year: row.original.school_year,
                    app_status: row.original.app_status,
                  })

                  setApplicationDetailsModalVisible(true)
                  setEditId(id)
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <EditSharp />
                </ListItemIcon>
                Edit
              </MenuItem>,
              <MenuItem
                key={1}
                onClick={() => {
                  closeMenu()

                  let id = row.original.id

                  Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      validationPrompt(() => {
                        setLoading(true)
                        api
                          .put('tvet/update_status/' + id, { status: 'Archived' })
                          .then((response) => {
                            fetchData()
                            toast.success(response.data.message)
                          })
                          .catch((error) => {
                            toast.error(handleError(error))
                          })
                          .finally(() => {
                            setLoading(false)
                          })
                      })
                    }
                  })
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <DeleteOutline />
                </ListItemIcon>
                Delete
              </MenuItem>,
            ]}
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
                    onClick={() => handleExportTvetData(data)}
                    size="sm"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    onClick={() => handleExportTvetRows(table.getSelectedRowModel().rows)}
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    color="danger"
                    onClick={() => handleDeleteRows(table)}
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} /> Delete Selected Rows
                  </CButton>
                  <CButton
                    color="primary"
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    onClick={() => handleBulkApprovedRows(table)}
                  >
                    <FontAwesomeIcon icon={faCheckSquare} /> Bulk Approved
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    className="  text-white"
                    color="danger"
                    onClick={() => handleBulkDisapprovedRows(table)}
                  >
                    <FontAwesomeIcon icon={faTimesRectangle} /> Bulk Disapproved
                  </CButton>
                </Box>
              </>
            )}
          />
        </CCol>
      </CRow>

      {loading && <DefaultLoading />}

      <>
        <CModal
          size="lg"
          alignment="center"
          backdrop="static"
          visible={applicationDetailsModalVisible}
          onClose={() => setApplicationDetailsModalVisible(false)}
        >
          <CModalHeader onClose={() => setApplicationDetailsModalVisible(false)}>
            <CModalTitle>
              Update Application Status for `
              {toSentenceCase(applicationDetailsForm.values.lastname)},{' '}
              {toSentenceCase(applicationDetailsForm.values.firstname)}{' '}
              {toSentenceCase(applicationDetailsForm.values.middlename)}`
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <>
              <CForm
                id="form"
                className="row g-3 needs-validation"
                noValidate
                onSubmit={applicationDetailsForm.handleSubmit}
              >
                <CRow className="justify-content-end mt-3">
                  <CCol>
                    <div className="text-end">
                      <h6>
                        Reference #:{' '}
                        <span
                          style={{
                            textDecoration: 'underline',
                            color: 'red',
                            fontSize: 20,
                          }}
                        >
                          {applicationDetailsForm.values.reference_number}
                        </span>
                      </h6>
                    </div>
                  </CCol>
                </CRow>

                <CRow className="justify-content-between my-1">
                  <CCol md={7} sm={6} xs={6} lg={8} xl={4}>
                    <CFormLabel>{requiredField(' Application Number')}</CFormLabel>
                    <h4 className="text-danger text-decoration-underline">
                      {applicationDetailsForm.values.app_year_number}-
                      {applicationDetailsForm.values.app_sem_number}-
                      {applicationDetailsForm.values.app_id_number}
                    </h4>

                    <CInputGroup className="mb-3 ">
                      <CFormInput
                        type="hidden"
                        name="app_year_number"
                        onChange={handleInputChange}
                        value={applicationDetailsForm.values.app_year_number}
                        className="text-center"
                        placeholder="Year"
                        aria-label="Year"
                        required
                        // readOnly
                      />
                      <CFormInput
                        type="hidden"
                        name="app_sem_number"
                        onChange={handleInputChange}
                        value={applicationDetailsForm.values.app_sem_number}
                        className="text-center "
                        placeholder="Semester"
                        aria-label="Sem"
                        required
                        // readOnly
                      />
                      <CFormInput
                        type="hidden"
                        name="app_id_number"
                        onChange={handleInputChange}
                        value={applicationDetailsForm.values.app_id_number}
                        className="text-center"
                        placeholder="App No"
                        aria-label="App No"
                        required
                        // readOnly
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Application Status</CFormLabel>
                    <CFormSelect
                      feedbackInvalid="Status is required."
                      name="app_status"
                      onChange={handleInputChange}
                      value={applicationDetailsForm.values.app_status}
                      required
                    >
                      <option value="">Select</option>
                      {StatusType.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                      ))}
                    </CFormSelect>
                    {applicationDetailsForm.touched.app_status &&
                      applicationDetailsForm.errors.app_status && (
                        <CFormText className="text-danger">
                          {applicationDetailsForm.errors.app_status}
                        </CFormText>
                      )}
                  </CCol>
                </CRow>

                <CRow className="my-1">
                  <>
                    <CCol md={5}>
                      <CFormLabel>
                        {
                          <>
                            {fetchSchoolLoading && <CSpinner size="sm" />}
                            {requiredField(' School')}
                          </>
                        }
                      </CFormLabel>
                      <Select
                        ref={selectCourseInputRef}
                        value={school.find(
                          (option) => option.value === applicationDetailsForm.values.school,
                        )}
                        onChange={handleSelectChange}
                        options={school}
                        name="school"
                        isSearchable
                        placeholder="Search..."
                        isClearable
                      />
                      {applicationDetailsForm.touched.school &&
                        applicationDetailsForm.errors.school && (
                          <CFormText className="text-danger">
                            {applicationDetailsForm.errors.school}
                          </CFormText>
                        )}
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>
                        {
                          <>
                            {fetchCourseLoading && <CSpinner size="sm" />}
                            {requiredField(' Course')}
                          </>
                        }
                      </CFormLabel>
                      <Select
                        ref={selectCourseInputRef}
                        value={course.find(
                          (option) => option.value === applicationDetailsForm.values.course,
                        )}
                        onChange={handleSelectChange}
                        options={course}
                        name="course"
                        isSearchable
                        placeholder="Search..."
                        isClearable
                      />
                      {applicationDetailsForm.touched.course &&
                        applicationDetailsForm.errors.course && (
                          <CFormText className="text-danger">
                            {applicationDetailsForm.errors.course}
                          </CFormText>
                        )}
                    </CCol>
                    <CCol md={3}>
                      <CFormInput
                        type="number"
                        label={requiredField('No. of hours')}
                        name="hourNumber"
                        onChange={handleInputChange}
                        value={applicationDetailsForm.values.hourNumber}
                        required
                      />
                      {applicationDetailsForm.touched.hourNumber &&
                        applicationDetailsForm.errors.hourNumber && (
                          <CFormText className="text-danger">
                            {applicationDetailsForm.errors.hourNumber}
                          </CFormText>
                        )}
                    </CCol>
                  </>
                </CRow>

                <CRow className="my-1">
                  <CCol>
                    <CFormSelect
                      label="Year Level"
                      name="year_level"
                      onChange={handleInputChange}
                      value={applicationDetailsForm.values.year_level}
                      required
                    >
                      <option value="">Select</option>
                      {YearLevel.map((year_level, index) => (
                        <option key={index} value={year_level}>
                          {year_level}
                        </option>
                      ))}
                    </CFormSelect>

                    {applicationDetailsForm.touched.year_level &&
                      applicationDetailsForm.errors.year_level && (
                        <CFormText className="text-danger">
                          {applicationDetailsForm.errors.year_level}
                        </CFormText>
                      )}
                  </CCol>
                  <CCol>
                    <CFormSelect
                      label={requiredField('Semester')}
                      name="semester"
                      onChange={handleInputChange}
                      value={applicationDetailsForm.values.semester}
                      required
                    >
                      <option value="">Select</option>
                      {Semester.map((semester, index) => (
                        <option key={index} value={semester}>
                          {semester}
                        </option>
                      ))}
                    </CFormSelect>
                    {applicationDetailsForm.touched.semester &&
                      applicationDetailsForm.errors.semester && (
                        <CFormText className="text-danger">
                          {applicationDetailsForm.errors.semester}
                        </CFormText>
                      )}
                  </CCol>
                </CRow>
                <CRow className="my-1">
                  <CCol>
                    <CFormSelect
                      label={requiredField('School Year')}
                      name="school_year"
                      onChange={handleInputChange}
                      value={applicationDetailsForm.values.school_year}
                      required
                    >
                      <option value="">Select</option>
                      {SchoolYear.map((school_year, index) => (
                        <option key={index} value={school_year}>
                          {school_year}
                        </option>
                      ))}
                    </CFormSelect>
                    {applicationDetailsForm.touched.school_year &&
                      applicationDetailsForm.errors.school_year && (
                        <CFormText className="text-danger">
                          {applicationDetailsForm.errors.school_year}
                        </CFormText>
                      )}
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="number"
                      label={requiredField('Availment')}
                      name="availment"
                      onChange={handleInputChange}
                      value={applicationDetailsForm.values.availment}
                      required
                    />
                    {applicationDetailsForm.touched.availment &&
                      applicationDetailsForm.errors.availment && (
                        <CFormText className="text-danger">
                          {applicationDetailsForm.errors.availment}
                        </CFormText>
                      )}
                  </CCol>
                  <CCol md={3}>
                    <CFormInput
                      type="text"
                      label={requiredField('CTC #')}
                      name="ctc"
                      onChange={handleInputChange}
                      value={applicationDetailsForm.values.ctc}
                      required
                    />
                    {applicationDetailsForm.touched.ctc && applicationDetailsForm.errors.ctc && (
                      <CFormText className="text-danger">
                        {applicationDetailsForm.errors.ctc}
                      </CFormText>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mt-4">
                  <div className="d-grid gap-2">
                    <CButton color="primary" type="submit">
                      Update Details
                    </CButton>
                  </div>
                </CRow>
              </CForm>
            </>
          </CModalBody>
        </CModal>
      </>

      <CModal
        alignment="center"
        backdrop="static"
        visible={modalBulkApproved}
        onClose={() => setModalBulkApprovedVisible(false)}
      >
        <CModalHeader onClose={() => setModalBulkApprovedVisible(false)}>
          <CModalTitle> Bulk Approved </CModalTitle>
        </CModalHeader>
        <CForm
          id="form"
          className="row g-3 needs-validation"
          noValidate
          validated={bulkApprovedValidated}
          onSubmit={approvedForm.handleSubmit}
        >
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="Status is required."
                  label={requiredField('Status')}
                  name="status"
                  onChange={handleInputChange}
                  value={approvedForm.values.status}
                  required
                >
                  <option value="">Select</option>
                  {ApprovedType.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CModalBody>

          {loadingOperation && <DefaultLoading />}

          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalBulkApprovedVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Update
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/*<CModal
        fullscreen
        backdrop="static"
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <CModalHeader onClose={() => setEditModalVisible(false)}>
          <CModalTitle>Edit Application</CModalTitle>
        </CModalHeader>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={editValidated}
          onSubmit={form.handleSubmit}
          style={{ position: 'relative' }}
        >
          <CModalBody>
            <CRow className="justify-content-between">
              <CCol md={7} sm={6} xs={6} lg={4} xl={4}>
                <CFormLabel>{requiredField('Application Number ')}</CFormLabel>
                <CInputGroup className="mb-3 ">
                  <CFormInput
                    type="text"
                    name="app_no_year"
                    onChange={handleEditApplicationInputChange}
                    value={form.values.app_no_year}
                    className="text-center"
                    placeholder="Year"
                    aria-label="Year"
                    required
                    readOnly
                  />
                  <CInputGroupText className="bg-transparent font-weight-bolder">-</CInputGroupText>
                  <CFormInput
                    type="text"
                    name="app_no_sem"
                    onChange={handleEditApplicationInputChange}
                    value={form.values.app_no_sem}
                    className="text-center "
                    placeholder="Semester"
                    aria-label="Sem"
                    required
                    readOnly
                  />
                  <CInputGroupText className="bg-transparent font-weight-bolder">-</CInputGroupText>
                  <CFormInput
                    type="text"
                    name="app_no_id"
                    onChange={handleEditApplicationInputChange}
                    value={form.values.app_no_id}
                    className="text-center"
                    placeholder="App No"
                    aria-label="App No"
                    required
                    readOnly
                  />
                </CInputGroup>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  aria-label="Status"
                  feedbackInvalid="Status is required."
                  label={requiredField('Status')}
                  name="status"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.status}
                  required
                >
                  <option value="">Select</option>
                  {StatusType.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={4}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Last Name is required."
                  label={requiredField('Last Name')}
                  name="lastname"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.lastname}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  feedbackInvalid="First Name is required."
                  label={requiredField('First Name')}
                  name="firstname"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.firstname}
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  type="text"
                  label="M.I"
                  name="middle_initial"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.middle_initial}
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  type="text"
                  label="Suffix"
                  name="suffix"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.suffix}
                />
              </CCol>
            </CRow>
            <CRow className="my-2">
              <CCol md={12}>
                <CFormSelect
                  aria-label="Address"
                  feedbackInvalid="Address is required."
                  label={requiredField('Address')}
                  name="address"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.address}
                  required
                >
                  <option value="">Select</option>
                  {Address.map((address, index) => (
                    <option key={index} value={address}>
                      {address}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="my-2">
              <CCol md={3}>
                <CFormInput
                  type="date"
                  feedbackInvalid="Date of Birth is required."
                  label={requiredField('Date of Birth')}
                  name="birthdate"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.birthdate}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="number"
                  feedbackInvalid="Age is required."
                  label={requiredField('Age')}
                  name="age"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.age}
                  required
                  readOnly
                />
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="Civil Status is required."
                  label={requiredField('Civil Status')}
                  name="civil_status"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.civil_status}
                  required
                >
                  <option value="">Select</option>
                  {CivilStatus.map((civil_status, index) => (
                    <option key={index} value={civil_status}>
                      {civil_status}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  type="text"
                  feedbackInvalid="Sex is required."
                  label={requiredField('Sex')}
                  name="sex"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.sex}
                  required
                >
                  <option value="">Select</option>
                  {Sex.map((sex, index) => (
                    <option key={index} value={sex}>
                      {sex}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Contact #"
                  name="contact_number"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.contact_number}
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  feedbackInvalid="CTC # is required."
                  label={requiredField('CTC #')}
                  name="ctc_number"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.ctc_number}
                  required
                />
              </CCol>

              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Facebook/Others"
                  name="email_address"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.email_address}
                />
              </CCol>

              <CCol md={3}>
                <CFormInput
                  type="number"
                  feedbackInvalid="Availment is required."
                  label={requiredField('Availment')}
                  name="availment"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.availment}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="School is required."
                  label={requiredField('School')}
                  name="school"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.school}
                  required
                >
                  <option value="">Select</option>
                  {school.map((school, index) => (
                    <option key={index} value={school.colSchoolName}>
                      {school.colSchoolName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="Course is required."
                  label={requiredField('Course')}
                  name="course"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.course}
                  required
                >
                  <option value="">Select</option>
                  {course.map((course, index) => (
                    <option key={index} value={course.colCourse}>
                      {course.colCourse}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="School Address"
                  name="school_address"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.school_address}
                />
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="Year Level is required."
                  label={requiredField('Year Level')}
                  name="year_level"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.year_level}
                  required
                >
                  <option value="">Select</option>
                  {YearLevel.map((year_level, index) => (
                    <option key={index} value={year_level}>
                      {year_level}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="Semester is required."
                  label={requiredField('Semester')}
                  name="semester"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.semester}
                  required
                >
                  <option value="">Select</option>
                  {Semester.map((semester, index) => (
                    <option key={index} value={semester}>
                      {semester}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormInput
                  type="number"
                  feedbackInvalid="No. of Hours is required."
                  label={requiredField('No. of Hours')}
                  name="hour_number"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.hour_number}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="School Year is required."
                  label={requiredField('School Year')}
                  name="school_year"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.school_year}
                  required
                >
                  <option value="">Select</option>
                  {SchoolYear.map((school_year, index) => (
                    <option key={index} value={school_year}>
                      {school_year}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Father's Name"
                  name="father_name"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.father_name}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Occupation"
                  name="father_occupation"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.father_occupation}
                />
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Mother's Name"
                  name="mother_name"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.mother_name}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Occupation"
                  name="mother_occupation"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.mother_occupation}
                />
              </CCol>
            </CRow>
          </CModalBody>

          {loadingOperation && <DefaultLoading />}

          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Update
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal> */}
    </>
  )
}

export default Tvet

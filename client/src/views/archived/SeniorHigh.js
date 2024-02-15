import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEye, faFileExcel, faFilter } from '@fortawesome/free-solid-svg-icons'
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
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box, ListItemIcon, MenuItem } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { useFormik } from 'formik'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {
  DefaultLoading,
  GradeLevel,
  RequiredFieldNote,
  SchoolYear,
  Semester,
  StatusType,
  api,
  handleError,
  handleExportSeniorHighData,
  handleExportSeniorHighRows,
  requiredField,
  seniorHighDefaultColumn,
  toSentenceCase,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'

const SeniorHigh = () => {
  const selectSchoolInputRef = useRef()
  const selectStrandInputRef = useRef()
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [editId, setEditId] = useState('')
  const [strand, setStrand] = useState([])
  const [school, setSchool] = useState([])
  const [applicationDetailsModalVisible, setApplicationDetailsModalVisible] = useState(false)
  const [fetchSeniorHighSchoolLoading, setFetchSeniorHighSchoolLoading] = useState(false)
  const [fetchStrandLoading, setFetchStrandLoading] = useState(false)

  useEffect(() => {
    fetchData()
    fetchSchool()
    fetchStrand()
  }, [])

  const fetchSchool = () => {
    setFetchSeniorHighSchoolLoading(true)
    api
      .get('senior_high_school')
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
        setFetchSeniorHighSchoolLoading(false)
      })
  }

  const fetchStrand = () => {
    setFetchStrandLoading(true)
    api
      .get('strand')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.strand}`
          return { value, label }
        })
        setStrand(formattedData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setFetchStrandLoading(false)
      })
  }
  const fetchData = () => {
    api
      .get('senior_high/get_by_status', {
        params: {
          status: 'archived',
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
    filterForm.setFieldValue(name, value)
    applicationDetailsForm.setFieldValue(name, value)
  }

  const handleSelectChange = (selectedOption, ref) => {
    applicationDetailsForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  const applicationDetailsFormValidationSchema = Yup.object().shape({
    app_status: Yup.string().required('Application Status  is required'),
    school: Yup.string().required('School is required'),
    strand: Yup.string().required('Strand  is required'),
    grade_level: Yup.string().required('Grade Level  is required'),
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
      strand: '',
      grade_level: '',
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
        .put('senior_high/update/' + editId, values)
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

  const handleViewAllData = () => {
    setLoading(true)
    api
      .get('senior_high/get_all_by_status', {
        params: {
          status: 'archived',
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
        .get('senior_high/filter_by_status', {
          params: {
            ...values,
            status: 'archived',
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
      <CRow className="justify-content-center ">
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
            columns={seniorHighDefaultColumn}
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
                    school: row.original.senior_high_school_id,
                    strand: row.original.strand_id,
                    semester: row.original.semester,
                    grade_level: row.original.grade_level,
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
                    onClick={() => handleExportSeniorHighData(data)}
                    size="sm"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    onClick={() => handleExportSeniorHighRows(table.getSelectedRowModel().rows)}
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
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
                      {/* <CInputGroupText className="bg-transparent font-weight-bolder">
                                -
                              </CInputGroupText> */}
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
                      {/* <CInputGroupText className="bg-transparent font-weight-bolder">
                                -
                              </CInputGroupText> */}
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
                  {/* if senior high */}
                  <>
                    <CCol md={8}>
                      <CFormLabel>
                        {
                          <>
                            {fetchSeniorHighSchoolLoading && <CSpinner size="sm" />}
                            {requiredField(' School')}
                          </>
                        }
                      </CFormLabel>
                      <Select
                        ref={selectSchoolInputRef}
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
                            {fetchStrandLoading && <CSpinner size="sm" />}
                            {requiredField(' Strand')}
                          </>
                        }
                      </CFormLabel>
                      <Select
                        ref={selectStrandInputRef}
                        value={strand.find(
                          (option) => option.value === applicationDetailsForm.values.strand,
                        )}
                        onChange={handleSelectChange}
                        options={strand}
                        name="strand"
                        isSearchable
                        placeholder="Search..."
                        isClearable
                      />
                      {applicationDetailsForm.touched.strand &&
                        applicationDetailsForm.errors.strand && (
                          <CFormText className="text-danger">
                            {applicationDetailsForm.errors.strand}
                          </CFormText>
                        )}
                    </CCol>
                  </>
                </CRow>

                <CRow className="my-1">
                  <CCol>
                    <CFormSelect
                      label={requiredField('Grade Level')}
                      name="grade_level"
                      onChange={handleInputChange}
                      value={applicationDetailsForm.values.grade_level}
                      required
                    >
                      <option value="">Select</option>
                      {GradeLevel.map((grade_level, index) => (
                        <option key={index} value={grade_level}>
                          {grade_level}
                        </option>
                      ))}
                    </CFormSelect>

                    {applicationDetailsForm.touched.grade_level &&
                      applicationDetailsForm.errors.grade_level && (
                        <CFormText className="text-danger">
                          {applicationDetailsForm.errors.grade_level}
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
    </>
  )
}

export default SeniorHigh

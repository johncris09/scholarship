import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { useFormik } from 'formik'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Skeleton, Tooltip } from '@mui/material'
import { EditSharp } from '@mui/icons-material'
import {
  CivilStatus,
  DefaultLoading,
  GradeLevel,
  RequiredFieldNote,
  SchoolYear,
  Semester,
  Sex,
  StatusType,
  YearLevel,
  api,
  calculateAge,
  handleError,
  requiredField,
  toSentenceCase,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

const Applicant = ({ cardTitle }) => {
  const { id } = useParams()
  const [tvetSchool, setTvetSchool] = useState([])
  const selectSeniorHighSchoolInputRef = useRef()
  const selectAddressIputRef = useRef()
  const [fetchTvetCourseLoading, setFetchTvetCourseLoading] = useState(false)
  const [tvetCourse, setTvetCourse] = useState([])
  const selectCollegeSchoolInputRef = useRef()
  const selectTvetCourseInputRef = useRef()
  const [data, setData] = useState([])
  const [applicationDetails, setApplicationDetails] = useState([])
  const [applicationDetailsModalVisible, setApplicationDetailsModalVisible] = useState(false)
  const [fetchCollegeSchoolLoading, setFetchCollegeSchoolLoading] = useState(false)
  const [collegeSchool, setCollegeSchool] = useState([])
  const selectStrandInputRef = useRef()
  const [seniorHighSchool, setSeniorHighSchool] = useState([])
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [fetchApplicationDetailsLoading, setFetchApplicationDetailsLoading] = useState(true)
  const [fetchSeniorHighSchoolLoading, setFetchSeniorHighSchoolLoading] = useState(false)
  const [strand, setStrand] = useState([])
  const [fetchStrandLoading, setFetchStrandLoading] = useState(false)
  const [fetchCourseLoading, setFetchCourseLoading] = useState(false)
  const selectCourseInputRef = useRef()
  const [course, setCourse] = useState([])
  const [fetchTvetSchoolLoading, setFetchTvetSchoolLoading] = useState(false)
  const [applicantDetailsModal, setApplicantDetailsModal] = useState(false)
  const [fetchAddressLoading, setFetchAddressLoading] = useState(true)
  const [address, setAddress] = useState([])
  const [courseOperationLoading, setDataOperationLoading] = useState(false)

  useEffect(() => {
    fetchData()
    fetchApplicationDetails()
    fetchSeniorHighSchool()
    fetchCollegeSchool()
    fetchTvetSchool()
    fetchStrand()
    fetchCourse()
    fetchAddress()
    fetchTvetCourse()
  }, [id])

  const fetchAddress = async () => {
    await api
      .get('barangay')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.barangay}`
          return { value, label }
        })

        setAddress(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchAddressLoading(false)
      })
  }
  const fetchData = () => {
    setFetchDataLoading(true)
    api
      .get('applicant/' + id)
      .then((response) => {
        applicantDetailsForm.setValues({
          id: response.data.id,
          reference_number: response.data.reference_number,
          lastname: response.data.lastname,
          firstname: response.data.firstname,
          middlename: response.data.middlename,
          suffix: response.data.suffix,
          address: response.data.barangay_id,
          barangay: response.data.address,
          birthdate: response.data.birthdate,
          civil_status: response.data.civil_status,
          sex: response.data.sex,
          contact_number: response.data.contact_number,
          email_address: response.data.email_address,
          father_name: response.data.father_name,
          father_occupation: response.data.father_occupation,
          mother_name: response.data.mother_name,
          mother_occupation: response.data.mother_occupation,
        })
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const fetchApplicationDetails = () => {
    setFetchApplicationDetailsLoading(true)
    api
      .get('applicant_details/' + id)
      .then((response) => {
        setApplicationDetails(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchApplicationDetailsLoading(false)
      })
  }

  const fetchSeniorHighSchool = () => {
    setFetchSeniorHighSchoolLoading(true)
    api
      .get('senior_high_school')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })

        setSeniorHighSchool(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchSeniorHighSchoolLoading(false)
      })
  }

  const fetchCollegeSchool = () => {
    setFetchCollegeSchoolLoading(true)
    api
      .get('college_school')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })

        setCollegeSchool(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchCollegeSchoolLoading(false)
      })
  }

  const fetchTvetSchool = () => {
    setFetchTvetSchoolLoading(true)
    api
      .get('tvet_school')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })

        setTvetSchool(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchTvetSchoolLoading(false)
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
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchStrandLoading(false)
      })
  }

  const fetchCourse = () => {
    setFetchCourseLoading(true)
    api
      .get('course')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.course}`
          return { value, label }
        })

        setCourse(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchCourseLoading(false)
      })
  }

  const fetchTvetCourse = () => {
    setFetchTvetCourseLoading(true)
    api
      .get('tvet_course')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.course}`
          return { value, label }
        })

        setTvetCourse(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchTvetCourseLoading(false)
      })
  }

  const column = [
    {
      accessorKey: 'app_year_number',
      header: 'Application #',
      accessorFn: (row) => `${row.app_year_number}-${row.app_sem_number}-${row.app_id_number}`,
    },
    {
      accessorKey: 'availment',
      header: 'Availment',
    },
    {
      accessorKey: 'school',
      header: 'School',
    },
    {
      accessorKey: 'course',
      header: 'Course',
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
    },
    {
      accessorKey: 'year_level',
      header: 'Year Level',
    },
    {
      accessorKey: 'semester',
      header: 'Semester',
    },
    {
      accessorKey: 'school_year',
      header: 'School Year',
    },
    {
      accessorKey: 'app_status',
      header: 'Application Status',
    },
    {
      accessorKey: 'scholarship_type',
      header: 'Scholarship Type',
    },
  ]

  const applicationDetailsFormValidationSchema = Yup.object().shape({
    school: Yup.string().required('School is required'),
    strand: Yup.string().when('scholarship_type', {
      is: (value) => value === 'senior_high',
      then: (schema) => schema.required('Strand is required'),
      otherwise: (schema) => schema,
    }),
    course: Yup.string().when('scholarship_type', {
      is: (value) => value === 'college',
      then: (schema) => schema.required('Course is required'),
    }),
    tvetCourse: Yup.string().when('scholarship_type', {
      is: (value) => value === 'tvet',
      then: (schema) => schema.required('Course is required'),
      otherwise: (schema) => schema,
    }),
    unit: Yup.string().when('scholarship_type', {
      is: (value) => value === 'college',
      then: (schema) => schema.required('Unit is required'),
      otherwise: (schema) => schema,
    }),
    hourNumber: Yup.string().when('scholarship_type', {
      is: (value) => value === 'tvet',
      then: (schema) => schema.required('No. of days is required'),
      otherwise: (schema) => schema,
    }),
    grade_level: Yup.string().when('scholarship_type', {
      is: (value) => value === 'senior_high',
      then: (schema) => schema.required('Grade Level is required'),
      otherwise: (schema) => schema,
    }),
    year_level: Yup.string().when('scholarship_type', {
      is: (value) => value !== 'senior_high',
      then: (schema) => schema.required('Year Level is required'),
      otherwise: (schema) => schema,
    }),
    semester: Yup.string().required('Semester is required'),
    school_year: Yup.string().required('School Year is required'),
    availment: Yup.string().required('Availment is required'),
    // ctc: Yup.string().required('CTC # is required'),
    app_status: Yup.string().required('Application Status is required'),
  })

  // form used to add application details for applicant
  const applicationDetailsForm = useFormik({
    initialValues: {
      id: '',
      lastname: '',
      firstname: '',
      middlename: '',
      reference_number: '',
      scholarship_id: '',
      app_year_number: '',
      app_sem_number: '',
      app_id_number: '',
      scholarship_type: 'senior_high',
      school: '',
      strand: '',
      course: '',
      tvetCourse: '',
      unit: '',
      hourNumber: '',
      grade_level: '',
      year_level: '',
      semester: '',
      school_year: '',
      availment: '',
      app_status: '',
    },
    validationSchema: applicationDetailsFormValidationSchema,
    onSubmit: async (values) => {
      setOperationLoading(true)
      await api
        .put('applicant/update_applicant_details/' + values.id, values)
        .then((response) => {
          toast.success(response.data.message)
          setApplicationDetailsModalVisible(false)
          fetchApplicationDetails(applicationDetailsForm.values.scholarship_id)
          // reset form
          applicationDetailsForm.resetForm()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setOperationLoading(false)
        })
    },
  })

  const handleSelectChange = (selectedOption, ref) => {
    applicationDetailsForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'scholarship_type') {
      applicationDetailsForm.setFieldValue('school', '')
      applicationDetailsForm.setFieldValue('strand', '')
      applicationDetailsForm.setFieldValue('course', '')
      applicationDetailsForm.setFieldValue('unit', '')

      applicationDetailsForm.setFieldValue(name, value)
    }

    applicationDetailsForm.setFieldValue(name, value)
    applicantDetailsForm.setFieldValue(name, value)
  }

  const handleSelectAddress = (selectedOption) => {
    applicantDetailsForm.setFieldValue('address', selectedOption ? selectedOption.value : '')
    applicantDetailsForm.setFieldValue('barangay', selectedOption ? selectedOption.label : '')
  }
  const validationSchema = Yup.object().shape({
    reference_number: Yup.string().required('Reference # is required'),
    lastname: Yup.string().required('Last Name is required'),
    firstname: Yup.string().required('First Name is required'),
    address: Yup.string().required('Address is required'),
    birthdate: Yup.string().required('Birthdate is required'),
    civil_status: Yup.string().required('Civil Status is required'),
    sex: Yup.string().required('Sex is required'),
  })
  const applicantDetailsForm = useFormik({
    initialValues: {
      id: '',
      reference_number: '',
      lastname: '',
      firstname: '',
      middlename: '',
      suffix: '',
      address: '',
      barangay: '',
      birthdate: '',
      civil_status: '',
      sex: '',
      contact_number: '',
      email_address: '',
      father_name: '',
      father_occupation: '',
      mother_name: '',
      mother_occupation: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await api
        .put('applicant/update/' + values.id, values)
        .then((response) => {
          toast.success(response.data.message)
          setApplicantDetailsModal(false)
          fetchData()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setDataOperationLoading(false)
        })
    },
  })

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>
          <lord-icon
            src="https://cdn.lordicon.com/lyrrgrsl.json"
            trigger="hover"
            style={{ width: '20px', height: '20px', paddingTop: '3px' }}
          ></lord-icon>{' '}
          {cardTitle}
        </CCardHeader>
        <CCardBody>
          <CTable responsive>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">Reference #</CTableHeaderCell>
                <CTableDataCell colSpan={7} style={{ color: 'red' }}>
                  <strong>
                    {fetchDataLoading ? (
                      <Skeleton variant="rounded" width={150} />
                    ) : (
                      applicantDetailsForm.values.reference_number
                    )}
                  </strong>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">Name</CTableHeaderCell>
                <CTableDataCell colSpan={7}>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={200} />
                  ) : (
                    <>
                      {toSentenceCase(applicantDetailsForm.values.lastname)},{' '}
                      {toSentenceCase(applicantDetailsForm.values.firstname)}{' '}
                      {toSentenceCase(applicantDetailsForm.values.middlename)}{' '}
                      {toSentenceCase(applicantDetailsForm.values.suffix)}
                    </>
                  )}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">Address</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={100} />
                  ) : (
                    applicantDetailsForm.values.barangay
                  )}
                </CTableDataCell>
                <CTableHeaderCell scope="row">Birthdate</CTableHeaderCell>
                <CTableDataCell>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={100} />
                  ) : (
                    applicantDetailsForm.values.birthdate
                  )}
                </CTableDataCell>
                <CTableHeaderCell scope="row">Age</CTableHeaderCell>
                <CTableDataCell>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={20} />
                  ) : (
                    calculateAge(applicantDetailsForm.values.birthdate)
                  )}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">Civil Status</CTableHeaderCell>
                <CTableDataCell>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={50} />
                  ) : (
                    applicantDetailsForm.values.civil_status
                  )}
                </CTableDataCell>
                <CTableHeaderCell scope="row">Sex</CTableHeaderCell>
                <CTableDataCell>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={80} />
                  ) : (
                    applicantDetailsForm.values.sex
                  )}
                </CTableDataCell>
                <CTableHeaderCell scope="row">Contact #</CTableHeaderCell>
                <CTableDataCell>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={100} />
                  ) : (
                    applicantDetailsForm.values.contact_number
                  )}
                </CTableDataCell>
                <CTableHeaderCell scope="row">Email Address</CTableHeaderCell>
                <CTableDataCell>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={150} />
                  ) : (
                    applicantDetailsForm.values.email_address
                  )}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">Father&apos;s Name</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={200} />
                  ) : (
                    applicantDetailsForm.values.father_name
                  )}
                </CTableDataCell>
                <CTableHeaderCell scope="row">Father&apos;s Occupation</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={200} />
                  ) : (
                    applicantDetailsForm.values.father_occupation
                  )}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">Mother&apos;s Name</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={200} />
                  ) : (
                    applicantDetailsForm.values.mother_name
                  )}
                </CTableDataCell>
                <CTableHeaderCell scope="row">Mother&apos;s Occupation</CTableHeaderCell>
                <CTableDataCell colSpan={3}>
                  {fetchDataLoading ? (
                    <Skeleton variant="rounded" width={200} />
                  ) : (
                    applicantDetailsForm.values.mother_occupation
                  )}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell align="right" colSpan={9}>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton
                      onClick={() => {
                        setApplicantDetailsModal(true)
                      }}
                      color="primary"
                      variant="outline"
                      className="px-3"
                      size="sm"
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/zfzufhzk.json"
                        trigger="hover"
                        style={{ width: '20px', height: '20px', paddingTop: '5px' }}
                      ></lord-icon>
                      Edit
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>

          <>
            <MaterialReactTable
              columns={column}
              data={applicationDetails}
              state={{
                isLoading: fetchApplicationDetailsLoading,
                isSaving: fetchApplicationDetailsLoading,
                showLoadingOverlay: fetchApplicationDetailsLoading,
                showProgressBars: fetchApplicationDetailsLoading,
                showSkeletons: fetchApplicationDetailsLoading,
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
                pagination: { pageSize: 20 },
                columnPinning: {
                  left: ['mrt-row-actions', 'app_year_number'],
                  right: ['app_status'],
                },
              }}
              enableRowActions
              renderRowActions={({ row, table }) => (
                <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                  <Tooltip title="Edit">
                    <IconButton
                      color="warning"
                      onClick={() => {
                        if (row.original.scholarship_type === 'Senior High') {
                          applicationDetailsForm.setFieldValue('scholarship_type', 'senior_high')
                          applicationDetailsForm.setFieldValue('school', row.original.school_id)
                          applicationDetailsForm.setFieldValue('strand', row.original.course_id)
                          applicationDetailsForm.setFieldValue(
                            'grade_level',
                            row.original.year_level,
                          )
                        } else if (row.original.scholarship_type === 'College') {
                          applicationDetailsForm.setFieldValue('scholarship_type', 'college')
                          applicationDetailsForm.setFieldValue('school', row.original.school_id)
                          applicationDetailsForm.setFieldValue('course', row.original.course_id)
                          applicationDetailsForm.setFieldValue('unit', row.original.unit)
                          applicationDetailsForm.setFieldValue(
                            'year_level',
                            row.original.year_level,
                          )
                        } else if (row.original.scholarship_type === 'Tvet') {
                          applicationDetailsForm.setFieldValue('scholarship_type', 'tvet')
                          applicationDetailsForm.setFieldValue('school', row.original.school_id)
                          applicationDetailsForm.setFieldValue('tvetCourse', row.original.course_id)
                          applicationDetailsForm.setFieldValue('hourNumber', row.original.unit)
                          applicationDetailsForm.setFieldValue(
                            'year_level',
                            row.original.year_level,
                          )
                        }

                        applicationDetailsForm.setFieldValue('app_status', row.original.app_status)
                        applicationDetailsForm.setFieldValue('id', row.original.id)
                        applicationDetailsForm.setFieldValue(
                          'school_year',
                          row.original.school_year,
                        )
                        applicationDetailsForm.setFieldValue(
                          'app_year_number',
                          row.original.app_year_number,
                        )
                        applicationDetailsForm.setFieldValue(
                          'app_sem_number',
                          row.original.app_sem_number,
                        )
                        applicationDetailsForm.setFieldValue(
                          'app_id_number',
                          row.original.app_id_number,
                        )

                        applicationDetailsForm.setFieldValue('semester', row.original.semester)
                        applicationDetailsForm.setFieldValue('availment', row.original.availment)
                        applicationDetailsForm.setFieldValue('ctc', row.original.ctc)

                        setApplicationDetailsModalVisible(true)
                      }}
                    >
                      <EditSharp />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            />

            {fetchApplicationDetailsLoading && <DefaultLoading />}
          </>
          {fetchDataLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <>
        <CModal
          size="lg"
          alignment="center"
          backdrop="static"
          visible={applicationDetailsModalVisible}
          onClose={() => setApplicationDetailsModalVisible(false)}
        >
          <CModalHeader onClose={() => setApplicationDetailsModalVisible(false)}>
            <CModalTitle>Update Applicant Details</CModalTitle>
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
                          {data.reference_number}
                        </span>
                      </h6>
                    </div>
                  </CCol>
                </CRow>

                {/* <CRow className="my-2">
                  <CCol md={6}>
                    <CFormSelect
                      label={requiredField('Scholarship Type')}
                      name="scholarship_type"
                      onChange={handleInputChange}
                      value={applicationDetailsForm.values.scholarship_type}
                      required
                    >
                      <option value="senior_high">Senior High</option>
                      <option value="college">College</option>
                      <option value="tvet">TVET</option>
                    </CFormSelect>
                  </CCol>
                </CRow> */}

                <CRow className="justify-content-between my-1">
                  <CCol md={7} sm={6} xs={6} lg={8} xl={4}>
                    <CFormLabel>
                      {
                        <>
                          {fetchSeniorHighSchoolLoading && <CSpinner size="sm" />}
                          {requiredField(' Application Number')}
                        </>
                      }
                    </CFormLabel>
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
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Application Status</CFormLabel>
                    <CFormSelect
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
                  {applicationDetailsForm.values.scholarship_type === 'senior_high' && (
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
                          ref={selectSeniorHighSchoolInputRef}
                          value={seniorHighSchool.find(
                            (option) => option.value === applicationDetailsForm.values.school,
                          )}
                          onChange={handleSelectChange}
                          options={seniorHighSchool}
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
                  )}

                  {applicationDetailsForm.values.scholarship_type === 'college' && (
                    <>
                      <CCol md={5}>
                        <CFormLabel>
                          {
                            <>
                              {fetchCollegeSchoolLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectCollegeSchoolInputRef}
                          value={collegeSchool.find(
                            (option) => option.value === applicationDetailsForm.values.school,
                          )}
                          onChange={handleSelectChange}
                          options={collegeSchool}
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
                          label={requiredField('Unit')}
                          name="unit"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.unit}
                          required
                        />
                        {applicationDetailsForm.touched.unit &&
                          applicationDetailsForm.errors.unit && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.unit}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )}
                  {applicationDetailsForm.values.scholarship_type === 'tvet' && (
                    <>
                      <CCol md={5}>
                        <CFormLabel>
                          {
                            <>
                              {fetchTvetSchoolLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectTvetCourseInputRef}
                          value={tvetSchool.find(
                            (option) => option.value === applicationDetailsForm.values.school,
                          )}
                          onChange={handleSelectChange}
                          options={tvetSchool}
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
                              {fetchTvetCourseLoading && <CSpinner size="sm" />}
                              {requiredField(' Course')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectTvetCourseInputRef}
                          value={tvetCourse.find(
                            (option) => option.value === applicationDetailsForm.values.tvetCourse,
                          )}
                          onChange={handleSelectChange}
                          options={tvetCourse}
                          name="tvetCourse"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {applicationDetailsForm.touched.tvetCourse &&
                          applicationDetailsForm.errors.tvetCourse && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.tvetCourse}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={3}>
                        <CFormInput
                          type="number"
                          label={requiredField('No. of days')}
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
                  )}
                </CRow>

                <CRow className="my-1">
                  <CCol>
                    {applicationDetailsForm.values.scholarship_type === 'senior_high' && (
                      <>
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
                      </>
                    )}

                    {applicationDetailsForm.values.scholarship_type !== 'senior_high' && (
                      <>
                        <CFormSelect
                          label={requiredField('Year Level')}
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
                      </>
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
                  {/* <CCol md={3}>
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
                  </CCol> */}
                </CRow>

                <CRow className="mt-4">
                  <div className="d-grid gap-2">
                    <CButton color="primary" type="submit">
                      Submit
                    </CButton>
                  </div>
                </CRow>
              </CForm>
            </>
            {operationLoading && <DefaultLoading />}
          </CModalBody>
        </CModal>
      </>

      <>
        <CModal
          alignment="center"
          size="xl"
          backdrop="static"
          visible={applicantDetailsModal}
          onClose={() => setApplicantDetailsModal(false)}
        >
          <CModalHeader onClose={() => setApplicantDetailsModal(false)}>
            <CModalTitle> Edit Profile</CModalTitle>
          </CModalHeader>

          <CForm
            id="form"
            className="row g-3 needs-validation"
            noValidate
            onSubmit={applicantDetailsForm.handleSubmit}
          >
            <CModalBody>
              <RequiredFieldNote />
              <CRow className="my-3">
                <CCol>
                  <CFormInput
                    type="text"
                    label={requiredField('Reference #')}
                    name="reference_number"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.reference_number}
                    required
                    style={{ fontSize: 20 }}
                    className="text-end"
                  />
                  {applicantDetailsForm.touched.reference_number &&
                    applicantDetailsForm.errors.reference_number && (
                      <CFormText className="text-danger">
                        {applicantDetailsForm.errors.reference_number}
                      </CFormText>
                    )}
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol md={3}>
                  <CFormInput
                    type="text"
                    label={requiredField('Last Name')}
                    name="lastname"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.lastname}
                    required
                  />
                  {applicantDetailsForm.touched.lastname &&
                    applicantDetailsForm.errors.lastname && (
                      <CFormText className="text-danger">
                        {applicantDetailsForm.errors.lastname}
                      </CFormText>
                    )}
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    type="text"
                    label={requiredField('First Name')}
                    name="firstname"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.firstname}
                    required
                  />
                  {applicantDetailsForm.touched.firstname &&
                    applicantDetailsForm.errors.firstname && (
                      <CFormText className="text-danger">
                        {applicantDetailsForm.errors.firstname}
                      </CFormText>
                    )}
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    type="text"
                    label="Middle Name"
                    name="middlename"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.middlename}
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    type="text"
                    label="Suffix"
                    name="suffix"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.suffix}
                  />
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol md={8}>
                  <CFormLabel>
                    {
                      <>
                        {fetchAddressLoading && <CSpinner size="sm" />}
                        {requiredField(' Address')}
                      </>
                    }
                  </CFormLabel>
                  <Select
                    ref={selectAddressIputRef}
                    value={address.find(
                      (option) => option.value === applicantDetailsForm.values.address,
                    )}
                    onChange={handleSelectAddress}
                    options={address}
                    name="address"
                    isSearchable
                    placeholder="Search..."
                    isClearable
                  />
                  {applicantDetailsForm.touched.address && applicantDetailsForm.errors.address && (
                    <CFormText className="text-danger">
                      {applicantDetailsForm.errors.address}
                    </CFormText>
                  )}
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="date"
                    label={requiredField('Birthdate')}
                    name="birthdate"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.birthdate}
                  />
                  {applicantDetailsForm.touched.birthdate &&
                    applicantDetailsForm.errors.birthdate && (
                      <CFormText className="text-danger">
                        {applicantDetailsForm.errors.birthdate}
                      </CFormText>
                    )}
                </CCol>
              </CRow>

              <CRow className="my-3">
                <CCol md={3}>
                  <CFormSelect
                    label={requiredField('Civil Status')}
                    name="civil_status"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.civil_status}
                    required
                  >
                    <option value="">Select</option>
                    {CivilStatus.map((civil_status, index) => (
                      <option key={index} value={civil_status}>
                        {civil_status}
                      </option>
                    ))}
                  </CFormSelect>
                  {applicantDetailsForm.touched.civil_status &&
                    applicantDetailsForm.errors.civil_status && (
                      <CFormText className="text-danger">
                        {applicantDetailsForm.errors.civil_status}
                      </CFormText>
                    )}
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    label={requiredField('Sex')}
                    name="sex"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.sex}
                    required
                  >
                    <option value="">Select</option>
                    {Sex.map((sex, index) => (
                      <option key={index} value={sex}>
                        {sex}
                      </option>
                    ))}
                  </CFormSelect>
                  {applicantDetailsForm.touched.sex && applicantDetailsForm.errors.sex && (
                    <CFormText className="text-danger">{applicantDetailsForm.errors.sex}</CFormText>
                  )}
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    type="text"
                    label="Contact #"
                    name="contact_number"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.contact_number}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    type="text"
                    label="Facebook/Others"
                    name="email_address"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.email_address}
                  />
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Father's Name"
                    name="father_name"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.father_name}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Occupation"
                    name="father_occupation"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.father_occupation}
                  />
                </CCol>
              </CRow>

              <CRow className="my-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Mother's Name"
                    name="mother_name"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.mother_name}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Occupation"
                    name="mother_occupation"
                    onChange={handleInputChange}
                    value={applicantDetailsForm.values.mother_occupation}
                  />
                </CCol>
              </CRow>
            </CModalBody>

            {courseOperationLoading && <DefaultLoading />}

            <CModalFooter>
              <CButton color="primary" type="submit">
                <lord-icon
                  src="https://cdn.lordicon.com/oqdmuxru.json"
                  trigger="hover"
                  colors="primary:#ffffff"
                  style={{ width: '20px', height: '20px', paddingTop: '3px' }}
                ></lord-icon>{' '}
                Update
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      </>
    </>
  )
}

export default Applicant

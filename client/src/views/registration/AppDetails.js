import React, { useEffect, useRef, useState } from 'react'
import {
  CivilStatus,
  DefaultLoading,
  GradeLevel,
  RequiredFieldNote,
  Sex,
  YearLevel,
  api,
  calculateAge,
  handleError,
  requiredField,
  toSentenceCase,
} from 'src/components/SystemConfiguration'

import * as Yup from 'yup'
import { useFormik } from 'formik'
import Select from 'react-select'
import {
  CButton,
  CCard,
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
import { toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Button, Skeleton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const AppDetails = ({ id }) => {
  const selectStrandInputRef = useRef()
  const selectSeniorHighSchoolInputRef = useRef()
  const selectAddressIputRef = useRef()
  const selectCourseInputRef = useRef()
  const selectTvetCourseInputRef = useRef()
  const selectCollegeSchoolInputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [data, setData] = useState([])
  const [endPoint, setEndPoint] = useState('shs_appno')
  const [applicationDetails, setApplicationDetails] = useState([])
  const [fetchApplicationDetailsLoading, setFetchApplicationDetailsLoading] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [fetchConfigLoading, setFetchConfigLoading] = useState(false)
  const [address, setAddress] = useState([])
  const [fetchAddressLoading, setFetchAddressLoading] = useState(false)
  const [course, setCourse] = useState([])
  const [fetchCourseLoading, setFetchCourseLoading] = useState(false)
  const [config, setConfig] = useState([])
  const [tvetCourse, setTvetCourse] = useState([])
  const [fetchTvetCourseLoading, setFetchTvetCourseLoading] = useState(false)
  const [tvetSchool, setTvetSchool] = useState([])
  const [fetchTvetSchoolLoading, setFetchTvetSchoolLoading] = useState(false)
  const [collegeSchool, setCollegeSchool] = useState([])
  const [fetchCollegeSchoolLoading, setFetchCollegeSchoolLoading] = useState(false)
  const [strand, setStrand] = useState([])
  const [fetchStrandLoading, setFetchStrandLoading] = useState(false)
  const [seniorHighSchool, setSeniorHighSchool] = useState([])
  const [fetchSeniorHighSchoolLoading, setFetchSeniorHighSchoolLoading] = useState(false)
  const [applicationDetailsModalVisible, setApplicationDetailsModalVisible] = useState(false)
  const [applicantDetailsModal, setApplicantDetailsModal] = useState(false)

  useEffect(() => {
    fetchConfig()
    fetchSeniorHighSchool()
    fetchCollegeSchool()
    fetchTvetSchool()
    fetchStrand()
    fetchCourse()
    fetchTvetCourse()
    fetchAddress()
    fetchApplicationNumber()
    fetchData()
    fetchApplicationDetails(id)

    const appNumber = setInterval(fetchApplicationNumber, 1000) // Example: Update every 5 seconds
    return () => clearInterval(appNumber)
  }, [endPoint])

  const fetchApplicationNumber = async () => {
    // setApplicationNumberLoading(true)
    await api
      .get('system_sequence/' + endPoint)
      .then((response) => {
        addNewApplicationDetailsForm.setFieldValue('app_year_number', response.data.seq_year)
        addNewApplicationDetailsForm.setFieldValue('app_sem_number', response.data.seq_sem)
        addNewApplicationDetailsForm.setFieldValue(
          'app_id_number',
          parseInt(response.data.seq_appno) + 1,
        )
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
    // .finally(() => {
    //   setApplicationNumberLoading(false)
    // })
  }
  const fetchConfig = () => {
    api
      .get('config')
      .then((response) => {
        setConfig(response.data[0])
      })
      .catch((error) => {
        console.info(error)
      })
      .finally(() => {
        setFetchConfigLoading(false)
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
  const fetchData = () => {
    setFetchDataLoading(true)
    api
      .get('applicant/' + id)
      .then((response) => {
        // console.info(response.data)
        setData(response.data)
        applicantDetailsForm.setFieldValue('id', response.data.id)
        applicantDetailsForm.setFieldValue('reference_number', response.data.reference_number)
        applicantDetailsForm.setFieldValue('lastname', response.data.lastname)
        applicantDetailsForm.setFieldValue('firstname', response.data.firstname)
        applicantDetailsForm.setFieldValue('middlename', response.data.middlename)
        applicantDetailsForm.setFieldValue('suffix', response.data.suffix)
        applicantDetailsForm.setFieldValue('barangay', response.data.address)
        applicantDetailsForm.setFieldValue('birthdate', response.data.birthdate)
        applicantDetailsForm.setFieldValue('age', calculateAge(response.data.birthdate))
        applicantDetailsForm.setFieldValue('civil_status', response.data.civil_status)
        applicantDetailsForm.setFieldValue('sex', response.data.sex)
        applicantDetailsForm.setFieldValue('contact_number', response.data.contact_number)
        applicantDetailsForm.setFieldValue('email_address', response.data.email_address)
        applicantDetailsForm.setFieldValue('father_name', response.data.father_name)
        applicantDetailsForm.setFieldValue('father_occupation', response.data.father_occupation)
        applicantDetailsForm.setFieldValue('mother_name', response.data.mother_name)
        applicantDetailsForm.setFieldValue('mother_occupation', response.data.mother_occupation)
        applicantDetailsForm.setFieldValue('address', response.data.barangay_id)
      })
      .catch((error) => {
        console.info(error)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const fetchApplicationDetails = (id) => {
    setFetchApplicationDetailsLoading(true)
    api
      .get('applicant_details/' + id)
      .then((response) => {
        setApplicationDetails(response.data)
      })
      .catch((error) => {
        console.info(error)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchApplicationDetailsLoading(false)
      })
  }

  const fetchAddress = () => {
    api
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'birthdate') {
      applicantDetailsForm.setFieldValue('age', calculateAge(value))
    }
    if (name === 'scholarship_type') {
      addNewApplicationDetailsForm.setFieldValue('school', '')
      addNewApplicationDetailsForm.setFieldValue('strand', '')
      addNewApplicationDetailsForm.setFieldValue('course', '')
      addNewApplicationDetailsForm.setFieldValue('unit', '')
      setEndPoint((prevEndPoint) => {
        let updatedEndPoint = ''

        if (value === 'college') {
          updatedEndPoint = 'college_appno'
        } else if (value === 'tvet') {
          updatedEndPoint = 'tvet_appno'
        } else if (value === 'senior_high') {
          updatedEndPoint = 'shs_appno'
        }

        return updatedEndPoint
      })

      addNewApplicationDetailsForm.setFieldValue(name, value)
    }

    addNewApplicationDetailsForm.setFieldValue(name, value)
    applicantDetailsForm.setFieldValue(name, value)
    setFetchApplicationDetailsLoading(false)
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
      age: '',
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
      setOperationLoading(true)
      await api
        .put('applicant/update/' + values.id, values)
        .then((response) => {
          toast.success(response.data.message)
          setApplicantDetailsModal(false)
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setOperationLoading(false)
        })
    },
  })

  const addNewApplicationDetailsFormValidationSchema = Yup.object().shape({
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
      then: (schema) => schema.required('No. of hours is required'),
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
    availment: Yup.string().required('Availment is required'),
  })

  // form used to add application details for applicant
  const addNewApplicationDetailsForm = useFormik({
    initialValues: {
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
      availment: '',
    },
    validationSchema: addNewApplicationDetailsFormValidationSchema,
    onSubmit: async (values) => {
      setOperationLoading(true)
      await api
        .post('applicant/insert', values)
        .then((response) => {
          toast.success(response.data.message)
          setApplicationDetailsModalVisible(false)
          fetchApplicationDetails(addNewApplicationDetailsForm.values.scholarship_id)
          // reset form
          addNewApplicationDetailsForm.resetForm()
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
    addNewApplicationDetailsForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')

    applicantDetailsForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
  return (
    <CCard className="mb-4">
      <>
        <div className="m-2">
          <h5>Application Details</h5>
        </div>
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
      </>
      <>
        <MaterialReactTable
          columns={column}
          data={applicationDetails}
          enableColumnActions={false}
          enablePagination={false}
          enableDensityToggle={false}
          enableColumnFilterModes={false}
          enableColumnResizing={false}
          enableFullScreenToggle={false}
          enableColumnFilters={false}
          enableGlobalFilterModes={false}
          enableSorting={false}
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
          enableGrouping={false}
          enableStickyHeader
          enableStickyFooter
          initialState={{
            density: 'compact',
            pagination: { pageSize: 20 },
            columnPinning: {
              left: ['mrt-row-actions', 'app_year_number'],
            },
          }}
          renderTopToolbarCustomActions={({ row, table }) => (
            <Button
              color="primary"
              variant="contained"
              shape="rounded-pill"
              style={{ fontSize: 12 }}
              onClick={() => {
                setApplicationDetailsModalVisible(true)
                addNewApplicationDetailsForm.resetForm()

                addNewApplicationDetailsForm.setFieldValue(
                  'scholarship_id',
                  applicantDetailsForm.values.id,
                )
                addNewApplicationDetailsForm.setFieldValue(
                  'reference_number',
                  applicantDetailsForm.values.reference_number,
                )
                addNewApplicationDetailsForm.setFieldValue(
                  'lastname',
                  applicantDetailsForm.values.lastname,
                )
                addNewApplicationDetailsForm.setFieldValue(
                  'firstname',
                  applicantDetailsForm.values.firstname,
                )
                addNewApplicationDetailsForm.setFieldValue(
                  'middlename',
                  applicantDetailsForm.values.middlename,
                )
              }}
            >
              <FontAwesomeIcon style={{ marginRight: 5 }} icon={faPlus} /> Add New Record
            </Button>
          )}
        />
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
                <CCol md={6}>
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
                    name="barangay_id"
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
                <CCol md={2}>
                  <CFormInput
                    type="text"
                    label="Age"
                    name="age"
                    style={{ textAlign: 'right' }}
                    className="border-0 border-bottom border-bottom-1 "
                    value={applicantDetailsForm.values.age}
                    readOnly
                  />
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

            {operationLoading && <DefaultLoading />}

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
              Add New Record for `{toSentenceCase(addNewApplicationDetailsForm.values.lastname)},{' '}
              {toSentenceCase(addNewApplicationDetailsForm.values.firstname)}{' '}
              {toSentenceCase(addNewApplicationDetailsForm.values.middlename)}`
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <>
              <CForm
                id="form"
                className="row g-3 needs-validation"
                noValidate
                style={{ position: 'relative' }}
                onSubmit={addNewApplicationDetailsForm.handleSubmit}
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
                          {addNewApplicationDetailsForm.values.reference_number}
                        </span>
                      </h6>
                    </div>
                  </CCol>
                </CRow>

                <CRow className="my-2">
                  <CCol md={6}>
                    <CFormSelect
                      label={requiredField('Scholarship Type')}
                      name="scholarship_type"
                      onChange={handleInputChange}
                      value={addNewApplicationDetailsForm.values.scholarship_type}
                      required
                    >
                      <option value="senior_high">Senior High</option>
                      <option value="college">College</option>
                      <option value="tvet">TVET</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

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
                      {addNewApplicationDetailsForm.values.app_year_number}-
                      {addNewApplicationDetailsForm.values.app_sem_number}-
                      {addNewApplicationDetailsForm.values.app_id_number}
                    </h4>

                    <CInputGroup className="mb-3 ">
                      <CFormInput
                        type="hidden"
                        name="app_year_number"
                        onChange={handleInputChange}
                        value={addNewApplicationDetailsForm.values.app_year_number}
                        className="text-center"
                        placeholder="Year"
                        aria-label="Year"
                        required
                      />
                      <CFormInput
                        type="hidden"
                        name="app_sem_number"
                        onChange={handleInputChange}
                        value={addNewApplicationDetailsForm.values.app_sem_number}
                        className="text-center "
                        placeholder="Semester"
                        aria-label="Sem"
                        required
                      />
                      <CFormInput
                        type="hidden"
                        name="app_id_number"
                        onChange={handleInputChange}
                        value={addNewApplicationDetailsForm.values.app_id_number}
                        className="text-center"
                        placeholder="App No"
                        aria-label="App No"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Application Status</CFormLabel>
                    <h4 className="text-danger text-decoration-underline">Pending</h4>
                  </CCol>
                </CRow>

                <CRow className="my-1">
                  {/* if senior high */}
                  {addNewApplicationDetailsForm.values.scholarship_type === 'senior_high' && (
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
                            (option) => option.value === addNewApplicationDetailsForm.values.school,
                          )}
                          onChange={handleSelectChange}
                          options={seniorHighSchool}
                          name="school"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.school &&
                          addNewApplicationDetailsForm.errors.school && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.school}
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
                            (option) =>
                              option.value === addNewApplicationDetailsForm.values.address,
                          )}
                          onChange={handleSelectChange}
                          options={strand}
                          name="strand"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.strand &&
                          addNewApplicationDetailsForm.errors.strand && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.strand}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )}

                  {addNewApplicationDetailsForm.values.scholarship_type === 'college' && (
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
                            (option) =>
                              option.value === addNewApplicationDetailsForm.values.collegeSchool,
                          )}
                          onChange={handleSelectChange}
                          options={collegeSchool}
                          name="school"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.school &&
                          addNewApplicationDetailsForm.errors.school && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.school}
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
                            (option) => option.value === addNewApplicationDetailsForm.values.course,
                          )}
                          onChange={handleSelectChange}
                          options={course}
                          name="course"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.course &&
                          addNewApplicationDetailsForm.errors.course && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.course}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={3}>
                        <CFormInput
                          type="number"
                          label={requiredField('Unit')}
                          name="unit"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.unit}
                          required
                        />
                        {addNewApplicationDetailsForm.touched.unit &&
                          addNewApplicationDetailsForm.errors.unit && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.unit}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )}
                  {addNewApplicationDetailsForm.values.scholarship_type === 'tvet' && (
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
                            (option) =>
                              option.value === addNewApplicationDetailsForm.values.tvetSchool,
                          )}
                          onChange={handleSelectChange}
                          options={tvetSchool}
                          name="school"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.school &&
                          addNewApplicationDetailsForm.errors.school && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.school}
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
                            (option) =>
                              option.value === addNewApplicationDetailsForm.values.tvetCourse,
                          )}
                          onChange={handleSelectChange}
                          options={tvetCourse}
                          name="tvetCourse"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.tvetCourse &&
                          addNewApplicationDetailsForm.errors.tvetCourse && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.tvetCourse}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={3}>
                        <CFormInput
                          type="number"
                          label={requiredField('No. of hours')}
                          name="hourNumber"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.hourNumber}
                          required
                        />
                        {addNewApplicationDetailsForm.touched.hourNumber &&
                          addNewApplicationDetailsForm.errors.hourNumber && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.hourNumber}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )}
                </CRow>

                <CRow className="my-1">
                  <CCol>
                    {addNewApplicationDetailsForm.values.scholarship_type === 'senior_high' && (
                      <>
                        <CFormSelect
                          label={requiredField('Grade Level')}
                          name="grade_level"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.grade_level}
                          required
                        >
                          <option value="">Select</option>
                          {GradeLevel.map((grade_level, index) => (
                            <option key={index} value={grade_level}>
                              {grade_level}
                            </option>
                          ))}
                        </CFormSelect>

                        {addNewApplicationDetailsForm.touched.grade_level &&
                          addNewApplicationDetailsForm.errors.grade_level && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.grade_level}
                            </CFormText>
                          )}
                      </>
                    )}

                    {addNewApplicationDetailsForm.values.scholarship_type !== 'senior_high' && (
                      <>
                        <CFormSelect
                          label={requiredField('Year Level')}
                          name="year_level"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.year_level}
                          required
                        >
                          <option value="">Select</option>
                          {YearLevel.map((year_level, index) => (
                            <option key={index} value={year_level}>
                              {year_level}
                            </option>
                          ))}
                        </CFormSelect>
                        {addNewApplicationDetailsForm.touched.year_level &&
                          addNewApplicationDetailsForm.errors.year_level && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.year_level}
                            </CFormText>
                          )}
                      </>
                    )}
                  </CCol>

                  <CCol>
                    <CFormInput
                      type="number"
                      label={requiredField('Availment')}
                      name="availment"
                      onChange={handleInputChange}
                      value={addNewApplicationDetailsForm.values.availment}
                      required
                    />
                    {addNewApplicationDetailsForm.touched.availment &&
                      addNewApplicationDetailsForm.errors.availment && (
                        <CFormText className="text-danger">
                          {addNewApplicationDetailsForm.errors.availment}
                        </CFormText>
                      )}
                  </CCol>
                </CRow>

                <CRow className="mt-4">
                  <div className="d-grid gap-2">
                    <CButton color="primary" type="submit">
                      Submit
                    </CButton>
                  </div>
                </CRow>
              </CForm>
              {operationLoading && <DefaultLoading />}
            </>
          </CModalBody>
        </CModal>
      </>
    </CCard>
  )
}

export default AppDetails

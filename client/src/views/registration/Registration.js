import React, { useEffect, useRef, useState } from 'react'
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
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-form-wizard-component/dist/style.css'
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CivilStatus,
  DefaultLoading,
  GradeLevel,
  MagnifyingGlassLoading,
  RequiredFieldNote,
  SchoolYear,
  Semester,
  Sex,
  YearLevel,
  api,
  calculateAge,
  getFirstLetters,
  handleError,
  requiredField,
  toSentenceCase,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Select from 'react-select'
import { Button } from '@mui/material'
import MaterialReactTable from 'material-react-table'
import moment from 'moment/moment'
const Registration = ({ cardTitle }) => {
  const selectAddressIputRef = useRef()

  const [fetchAddressLoading, setFetchAddressLoading] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const selectSeniorHighSchoolInputRef = useRef()
  const selectCollegeSchoolInputRef = useRef()
  const selectStrandInputRef = useRef()
  const selectCourseInputRef = useRef()
  const selectTvetCourseInputRef = useRef()
  const [rowSelection, setRowSelection] = useState({})
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const [applicantDetails, setApplicantDetails] = useState([])
  const [applicantDetailsModal, setApplicantDetailsModal] = useState(false)
  const [applicationDetails, setApplicationDetails] = useState([])
  const [fetchApplicationDetailsLoading, setFetchApplicationDetailsLoading] = useState(true)
  const [applicationDetailsModalVisible, setApplicationDetailsModalVisible] = useState(false)
  const searchInputRef = useRef(null)
  const [seniorHighSchool, setSeniorHighSchool] = useState([])
  const [fetchSeniorHighSchoolLoading, setFetchSeniorHighSchoolLoading] = useState(false)
  const [collegeSchool, setCollegeSchool] = useState([])
  const [fetchCollegeSchoolLoading, setFetchCollegeSchoolLoading] = useState(false)
  const [tvetSchool, setTvetSchool] = useState([])
  const [fetchTvetSchoolLoading, setFetchTvetSchoolLoading] = useState(false)
  const [strand, setStrand] = useState([])
  const [fetchStrandLoading, setFetchStrandLoading] = useState(false)
  const [course, setCourse] = useState([])
  const [fetchCourseLoading, setFetchCourseLoading] = useState(false)
  const [tvetCourse, setTvetCourse] = useState([])
  const [fetchTvetCourseLoading, setFetchTvetCourseLoading] = useState(false)
  const [endPoint, setEndPoint] = useState('shs_appno')
  const [address, setAddress] = useState([])
  const [config, setConfig] = useState([])
  const [fetchConfigLoading, setFetchConfigLoading] = useState(false)
  const [age, setAge] = useState(0)

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
    const appNumber = setInterval(fetchApplicationNumber, 1000) // Example: Update every 5 seconds
    return () => clearInterval(appNumber)
  }, [endPoint])

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
        newApplicantForm.setFieldValue('app_year_number', response.data.seq_year)
        newApplicantForm.setFieldValue('app_sem_number', response.data.seq_sem)
        newApplicantForm.setFieldValue('app_id_number', parseInt(response.data.seq_appno) + 1)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
    // .finally(() => {
    //   setApplicationNumberLoading(false)
    // })
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

  const verificationFormValidationSchema = Yup.object().shape({
    verify_by: Yup.string().required('Verify by is required'),
    search_value: Yup.string().required('Search Value is required'),
  })
  const verificationForm = useFormik({
    initialValues: {
      verify_by: 'lastname',
      search_value: '',
    },
    validationSchema: verificationFormValidationSchema,
    onSubmit: async (values) => {
      setVerificationLoading(true)
      setFetchDataLoading(true)
      setFetchApplicationDetailsLoading(true)
      await api
        .get('verify', { params: values })
        .then((response) => {
          setSearchResult(response.data)
          if (response.data.length === 1) {
            var id = response.data[0].id
            fetchApplicationDetails(id)
            applicantDetailsForm.setFieldValue('id', response.data[0].id)
            applicantDetailsForm.setFieldValue(
              'reference_number',
              response.data[0].reference_number,
            )
            applicantDetailsForm.setFieldValue('lastname', response.data[0].lastname)
            applicantDetailsForm.setFieldValue('firstname', response.data[0].firstname)
            applicantDetailsForm.setFieldValue('middlename', response.data[0].middlename)
            applicantDetailsForm.setFieldValue('suffix', response.data[0].suffix)
            applicantDetailsForm.setFieldValue('barangay', response.data[0].address)
            applicantDetailsForm.setFieldValue('birthdate', response.data[0].birthdate)
            applicantDetailsForm.setFieldValue('age', calculateAge(response.data[0].birthdate))
            applicantDetailsForm.setFieldValue('civil_status', response.data[0].civil_status)
            applicantDetailsForm.setFieldValue('sex', response.data[0].sex)
            applicantDetailsForm.setFieldValue('contact_number', response.data[0].contact_number)
            applicantDetailsForm.setFieldValue('email_address', response.data[0].email_address)
            applicantDetailsForm.setFieldValue('father_name', response.data[0].father_name)
            applicantDetailsForm.setFieldValue(
              'father_occupation',
              response.data[0].father_occupation,
            )
            applicantDetailsForm.setFieldValue('mother_name', response.data[0].mother_name)
            applicantDetailsForm.setFieldValue(
              'mother_occupation',
              response.data[0].mother_occupation,
            )
            applicantDetailsForm.setFieldValue('address', response.data[0].barangay_id)
          }
          setRowSelection({})
          newApplicantForm.resetForm()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setVerificationLoading(false)
          setFetchDataLoading(false)
          setFetchApplicationDetailsLoading(false)
        })
    },
  })

  const fetchApplicationDetails = (id) => {
    api
      .get('applicant_details/' + id)
      .then((response) => {
        setApplicationDetails(response.data)
      })
      .catch((error) => {
        toast.error(error)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchApplicationDetailsLoading(false)
      })
  }
  const handleInputSearchChange = (e) => {
    const { name, value } = e.target
    if (name === 'verify_by') {
      if (value === 'reference_number') {
        searchInputRef.current.placeholder = 'Search Reference #'
      } else if (value === 'name') {
        searchInputRef.current.placeholder = 'Search Name (Last Name, First Name Middle Name)'
      } else if (value === 'lastname') {
        searchInputRef.current.placeholder = 'Search Last Name'
      } else if (value === 'firstname') {
        searchInputRef.current.placeholder = 'Search First Name'
      }
    }
    verificationForm.setFieldValue(name, value)
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
    // ctc: Yup.string().when('scholarship_type', {
    //   is: (value) => value !== 'senior_high',
    //   then: (schema) => schema.required('CTC # is required'),
    //   otherwise: (schema) => schema,
    // }),
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
      // ctc: '',
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
    newApplicantForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
    applicantDetailsForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
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
  }

  const applicantColumn = [
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

  const newApplicantFormValidationSchema = Yup.object().shape({
    lastname: Yup.string().required('Last Name is required'),
    firstname: Yup.string().required('First Name is required'),
    address: Yup.string().required('Address is required'),
    birthdate: Yup.string().required('Birthdate is required'),
    civil_status: Yup.string().required('Civil Status is required'),
    sex: Yup.string().required('Sex is required'),
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
    // ctc: Yup.string().when('scholarship_type', {
    //   is: (value) => value !== 'senior_high',
    //   then: (schema) => schema.required('CTC # is required'),
    //   otherwise: (schema) => schema,
    // }),
  })

  // form used to add application details for applicant
  const newApplicantForm = useFormik({
    initialValues: {
      lastname: '',
      firstname: '',
      middlename: '',
      suffix: '',
      address: '',
      age: '',
      birthdate: '',
      civil_status: '',
      sex: '',
      contact_number: '',
      email_address: '',
      father_name: '',
      father_occupation: '',
      mother_name: '',
      mother_occupation: '',
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
      // ctc: '',
    },
    validationSchema: newApplicantFormValidationSchema,
    onSubmit: async (values) => {
      setOperationLoading(true)
      await api
        .post('applicant/insert_new_applicant', values)
        .then((response) => {
          toast.success(response.data.message)

          // reset forme
          newApplicantForm.resetForm()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setOperationLoading(false)
        })
    },
  })

  const generateReferenceNumber = () => {
    const scholarshipType = getFirstLetters(newApplicantForm.values.scholarship_type) || ''
    const firstname = getFirstLetters(newApplicantForm.values.firstname) || ''
    const lastname = getFirstLetters(newApplicantForm.values.lastname) || ''
    const birthdate =
      newApplicantForm.values.birthdate === ''
        ? ''
        : moment(newApplicantForm.values.birthdate).format('MMDDYY')
    return `${scholarshipType}${newApplicantForm.values.app_sem_number}-${config.current_sy.replace(
      /SY: 20|-20/g,
      '',
    )}-${firstname}${lastname}-${birthdate}`
  }

  const handleInputNewApplicantForm = (e) => {
    const { name, value } = e.target
    if (name === 'birthdate') {
      newApplicantForm.setFieldValue('age', calculateAge(value))
    }
    if (name === 'scholarship_type') {
      newApplicantForm.setFieldValue('school', '')
      newApplicantForm.setFieldValue('strand', '')
      newApplicantForm.setFieldValue('course', '')
      newApplicantForm.setFieldValue('unit', '')
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

      newApplicantForm.setFieldValue(name, value)
    }

    if (
      [
        'lastname',
        'firstname',
        'middlename',
        'father_name',
        'father_occupation',
        'mother_name',
        'mother_occupation',
      ].includes(name)
    ) {
      newApplicantForm.setFieldValue(name, toSentenceCase(value))
    } else {
      newApplicantForm.setFieldValue(name, value)
    }
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

  return (
    <>
      <ToastContainer />
      <>
        <CCard className="mb-4">
          <CCardHeader>Verify</CCardHeader>
          <CCardBody>
            <CForm
              id="form"
              className="row g-3 needs-validation"
              noValidate
              onSubmit={verificationForm.handleSubmit}
            >
              <h4>Verify</h4>
              <CRow className="my-3">
                <CCol md={4}>
                  <CFormSelect
                    aria-label="Verify by"
                    label={requiredField('Verify by')}
                    name="verify_by"
                    onChange={handleInputSearchChange}
                    value={verificationForm.values.verify_by}
                    required
                  >
                    <option value="">Select</option>
                    <option value="reference_number" defaultValue={true}>
                      Reference #
                    </option>
                    <option value="name">Name</option>
                    <option value="lastname">Last Name</option>
                    <option value="firstname">First Name</option>
                  </CFormSelect>
                  {verificationForm.touched.verify_by && verificationForm.errors.verify_by && (
                    <CFormText className="text-danger">
                      {verificationForm.errors.verify_by}
                    </CFormText>
                  )}
                </CCol>
                <CCol>
                  <CFormInput
                    type="text"
                    label={requiredField('Search')}
                    name="search_value"
                    onChange={handleInputSearchChange}
                    value={verificationForm.values.search_value}
                    ref={searchInputRef}
                    required
                  />
                  {verificationForm.touched.search_value &&
                    verificationForm.errors.search_value && (
                      <CFormText className="text-danger">
                        {verificationForm.errors.search_value}
                      </CFormText>
                    )}
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol>
                  <div className="d-grid gap-2">
                    <CButton color="primary" type="submit">
                      <lord-icon
                        src="https://cdn.lordicon.com/kkvxgpti.json"
                        trigger="hover"
                        colors="primary:#ffffff"
                        style={{ width: '20px', height: '20px', paddingTop: '5px' }}
                      ></lord-icon>
                      Verify
                    </CButton>
                  </div>
                </CCol>
              </CRow>
            </CForm>
            {verificationLoading && <MagnifyingGlassLoading />}
          </CCardBody>
        </CCard>
      </>
      <>
        {searchResult.length === 0 &&
          verificationForm.isSubmitting === false &&
          verificationForm.touched.search_value && (
            <>
              <CCard className="mb-4">
                <CCardHeader>{cardTitle}</CCardHeader>
                <CCardBody>
                  <CForm
                    id="form"
                    className="row g-3 needs-validation"
                    noValidate
                    onSubmit={newApplicantForm.handleSubmit}
                  >
                    <CRow className="my-2">
                      <CCol md={12}>
                        <CFormSelect
                          label={requiredField('Scholarship Type')}
                          name="scholarship_type"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.scholarship_type}
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
                          {newApplicantForm.values.app_year_number}-
                          {newApplicantForm.values.app_sem_number}-
                          {newApplicantForm.values.app_id_number}
                        </h4>

                        <CInputGroup className="mb-3 ">
                          <CFormInput
                            type="hidden"
                            name="app_year_number"
                            onChange={handleInputNewApplicantForm}
                            value={newApplicantForm.values.app_year_number}
                            className="text-center"
                            placeholder="Year"
                            aria-label="Year"
                            required
                            // readOnly
                          />

                          <CFormInput
                            type="hidden"
                            name="app_sem_number"
                            onChange={handleInputNewApplicantForm}
                            value={newApplicantForm.values.app_sem_number}
                            className="text-center "
                            placeholder="Semester"
                            aria-label="Sem"
                            required
                            // readOnly
                          />
                          <CFormInput
                            type="hidden"
                            name="app_id_number"
                            onChange={handleInputNewApplicantForm}
                            value={newApplicantForm.values.app_id_number}
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
                        <h4 className="text-danger text-decoration-underline">Pending</h4>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol>
                        <CFormLabel>Reference #</CFormLabel>
                        <h4 className="text-danger text-decoration-underline">
                          {generateReferenceNumber()}
                        </h4>
                      </CCol>
                    </CRow>

                    <CRow className="my-1 mt-4">
                      <CCol>
                        <CFormInput
                          type="text"
                          label={requiredField('Last Name')}
                          name="lastname"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.lastname}
                          required
                        />
                        {newApplicantForm.touched.lastname && newApplicantForm.errors.lastname && (
                          <CFormText className="text-danger">
                            {newApplicantForm.errors.lastname}
                          </CFormText>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          type="text"
                          feedbackInvalid="First Name is required."
                          label={requiredField('First Name')}
                          name="firstname"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.firstname}
                          required
                        />{' '}
                        {newApplicantForm.touched.firstname &&
                          newApplicantForm.errors.firstname && (
                            <CFormText className="text-danger">
                              {newApplicantForm.errors.firstname}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          type="text"
                          label="Middle Name"
                          name="middlename"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.middlename}
                          required
                        />
                      </CCol>
                      <CCol>
                        <CFormInput
                          type="text"
                          label="Suffix"
                          name="suffix"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.suffix}
                          required
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
                            (option) => option.value === newApplicantForm.values.address,
                          )}
                          onChange={handleSelectChange}
                          options={address}
                          name="address"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {newApplicantForm.touched.address && newApplicantForm.errors.address && (
                          <CFormText className="text-danger">
                            {newApplicantForm.errors.address}
                          </CFormText>
                        )}
                      </CCol>
                      <CCol md={4}>
                        <CFormInput
                          type="date"
                          label={requiredField('Birthdate')}
                          name="birthdate"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.birthdate}
                        />
                        {newApplicantForm.touched.birthdate &&
                          newApplicantForm.errors.birthdate && (
                            <CFormText className="text-danger">
                              {newApplicantForm.errors.birthdate}
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
                          value={newApplicantForm.values.age}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="my-3">
                      <CCol>
                        <CFormSelect
                          label={requiredField('Civil Status')}
                          name="civil_status"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.civil_status}
                          required
                        >
                          <option value="">Select</option>
                          {CivilStatus.map((civil_status, index) => (
                            <option key={index} value={civil_status}>
                              {civil_status}
                            </option>
                          ))}
                        </CFormSelect>
                        {newApplicantForm.touched.civil_status &&
                          newApplicantForm.errors.civil_status && (
                            <CFormText className="text-danger">
                              {newApplicantForm.errors.civil_status}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol>
                        <CFormSelect
                          label={requiredField('Sex')}
                          name="sex"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.sex}
                          required
                        >
                          <option value="">Select</option>
                          {Sex.map((sex, index) => (
                            <option key={index} value={sex}>
                              {sex}
                            </option>
                          ))}
                        </CFormSelect>
                        {newApplicantForm.touched.sex && newApplicantForm.errors.sex && (
                          <CFormText className="text-danger">
                            {newApplicantForm.errors.sex}
                          </CFormText>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          type="text"
                          label="Contact #"
                          name="contact_number"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.contact_number}
                        />
                      </CCol>
                      <CCol>
                        <CFormInput
                          type="text"
                          label="Facebook/Others"
                          name="email_address"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.email_address}
                        />
                      </CCol>
                    </CRow>
                    <CRow className="my-3">
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          label="Father's Name"
                          name="father_name"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.father_name}
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          label="Occupation"
                          name="father_occupation"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.father_occupation}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="my-3">
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          label="Mother's Name"
                          name="mother_name"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.mother_name}
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          label="Occupation"
                          name="mother_occupation"
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.mother_occupation}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="my-1">
                      {/* if senior high */}
                      {newApplicantForm.values.scholarship_type === 'senior_high' && (
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
                                (option) => option.value === newApplicantForm.values.school,
                              )}
                              onChange={handleSelectChange}
                              options={seniorHighSchool}
                              name="school"
                              isSearchable
                              placeholder="Search..."
                              isClearable
                            />
                            {newApplicantForm.touched.school && newApplicantForm.errors.school && (
                              <CFormText className="text-danger">
                                {newApplicantForm.errors.school}
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
                                (option) => option.value === newApplicantForm.values.address,
                              )}
                              onChange={handleSelectChange}
                              options={strand}
                              name="strand"
                              isSearchable
                              placeholder="Search..."
                              isClearable
                            />
                            {newApplicantForm.touched.strand && newApplicantForm.errors.strand && (
                              <CFormText className="text-danger">
                                {newApplicantForm.errors.strand}
                              </CFormText>
                            )}
                          </CCol>
                        </>
                      )}

                      {newApplicantForm.values.scholarship_type === 'college' && (
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
                                (option) => option.value === newApplicantForm.values.collegeSchool,
                              )}
                              onChange={handleSelectChange}
                              options={collegeSchool}
                              name="school"
                              isSearchable
                              placeholder="Search..."
                              isClearable
                            />
                            {newApplicantForm.touched.school && newApplicantForm.errors.school && (
                              <CFormText className="text-danger">
                                {newApplicantForm.errors.school}
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
                                (option) => option.value === newApplicantForm.values.course,
                              )}
                              onChange={handleSelectChange}
                              options={course}
                              name="course"
                              isSearchable
                              placeholder="Search..."
                              isClearable
                            />
                            {newApplicantForm.touched.course && newApplicantForm.errors.course && (
                              <CFormText className="text-danger">
                                {newApplicantForm.errors.course}
                              </CFormText>
                            )}
                          </CCol>
                          <CCol md={3}>
                            <CFormInput
                              type="number"
                              label={requiredField('Unit')}
                              name="unit"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.unit}
                              required
                            />
                            {newApplicantForm.touched.unit && newApplicantForm.errors.unit && (
                              <CFormText className="text-danger">
                                {newApplicantForm.errors.unit}
                              </CFormText>
                            )}
                          </CCol>
                        </>
                      )}
                      {newApplicantForm.values.scholarship_type === 'tvet' && (
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
                                (option) => option.value === newApplicantForm.values.tvetSchool,
                              )}
                              onChange={handleSelectChange}
                              options={tvetSchool}
                              name="school"
                              isSearchable
                              placeholder="Search..."
                              isClearable
                            />
                            {newApplicantForm.touched.school && newApplicantForm.errors.school && (
                              <CFormText className="text-danger">
                                {newApplicantForm.errors.school}
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
                                (option) => option.value === newApplicantForm.values.tvetCourse,
                              )}
                              onChange={handleSelectChange}
                              options={tvetCourse}
                              name="tvetCourse"
                              isSearchable
                              placeholder="Search..."
                              isClearable
                            />
                            {newApplicantForm.touched.tvetCourse &&
                              newApplicantForm.errors.tvetCourse && (
                                <CFormText className="text-danger">
                                  {newApplicantForm.errors.tvetCourse}
                                </CFormText>
                              )}
                          </CCol>
                          <CCol md={3}>
                            <CFormInput
                              type="number"
                              label={requiredField('No. of hours')}
                              name="hourNumber"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.hourNumber}
                              required
                            />
                            {newApplicantForm.touched.hourNumber &&
                              newApplicantForm.errors.hourNumber && (
                                <CFormText className="text-danger">
                                  {newApplicantForm.errors.hourNumber}
                                </CFormText>
                              )}
                          </CCol>
                        </>
                      )}
                    </CRow>

                    <CRow className="my-1">
                      <CCol>
                        {newApplicantForm.values.scholarship_type === 'senior_high' && (
                          <>
                            <CFormSelect
                              label={requiredField('Grade Level')}
                              name="grade_level"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.grade_level}
                              required
                            >
                              <option value="">Select</option>
                              {GradeLevel.map((grade_level, index) => (
                                <option key={index} value={grade_level}>
                                  {grade_level}
                                </option>
                              ))}
                            </CFormSelect>

                            {newApplicantForm.touched.grade_level &&
                              newApplicantForm.errors.grade_level && (
                                <CFormText className="text-danger">
                                  {newApplicantForm.errors.grade_level}
                                </CFormText>
                              )}
                          </>
                        )}

                        {newApplicantForm.values.scholarship_type !== 'senior_high' && (
                          <>
                            <CFormSelect
                              label={requiredField('Year Level')}
                              name="year_level"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.year_level}
                              required
                            >
                              <option value="">Select</option>
                              {YearLevel.map((year_level, index) => (
                                <option key={index} value={year_level}>
                                  {year_level}
                                </option>
                              ))}
                            </CFormSelect>
                            {newApplicantForm.touched.year_level &&
                              newApplicantForm.errors.year_level && (
                                <CFormText className="text-danger">
                                  {newApplicantForm.errors.year_level}
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
                          onChange={handleInputNewApplicantForm}
                          value={newApplicantForm.values.availment}
                          required
                        />
                        {newApplicantForm.touched.availment &&
                          newApplicantForm.errors.availment && (
                            <CFormText className="text-danger">
                              {newApplicantForm.errors.availment}
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
                </CCardBody>
              </CCard>
            </>
          )}
      </>
      <>
        {searchResult.length === 1 && verificationForm.touched.search_value && (
          <CCard className="mb-4">
            <CCardHeader>{cardTitle}</CCardHeader>
            <CCardBody>
              <>
                <CRow className="justify-content-end">
                  <CCol>
                    <div className="text-end ">
                      <h6>
                        Reference #:{' '}
                        <span style={{ textDecoration: 'underline', color: 'red', fontSize: 20 }}>
                          {applicantDetailsForm.values.reference_number}
                        </span>
                      </h6>
                    </div>
                  </CCol>
                </CRow>
                <CRow className="my-1 mt-4">
                  <h3 style={{ textDecoration: 'underline' }}>
                    {toSentenceCase(applicantDetailsForm.values.lastname)},{' '}
                    {toSentenceCase(applicantDetailsForm.values.firstname)}{' '}
                    {toSentenceCase(applicantDetailsForm.values.middlename)}{' '}
                    {applicantDetailsForm.values.suffix}
                  </h3>
                </CRow>

                <CRow className="my-1">
                  <CCol md={8}>
                    <CFormText>Addresss</CFormText>
                    <CFormInput
                      type="text"
                      value={applicantDetailsForm.values.barangay}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                  <CCol md={2}>
                    <CFormText>Birthdate</CFormText>
                    <CFormInput
                      type="text"
                      value={applicantDetailsForm.values.birthdate}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                  <CCol md={2}>
                    <CFormText>Age</CFormText>
                    <CFormInput
                      type="text"
                      value={calculateAge(applicantDetailsForm.values.birthdate)}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                </CRow>

                <CRow className="my-1">
                  <CCol md={3}>
                    <CFormText>Civil Status</CFormText>
                    <CFormInput
                      type="text"
                      value={toSentenceCase(applicantDetailsForm.values.civil_status)}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormText>Sex</CFormText>
                    <CFormInput
                      type="text"
                      value={toSentenceCase(applicantDetailsForm.values.sex)}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormText>Contact #</CFormText>
                    <CFormInput
                      type="text"
                      value={applicantDetailsForm.values.contact_number}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormText>Email Address</CFormText>
                    <CFormInput
                      type="text"
                      value={applicantDetailsForm.values.email_address}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                </CRow>
                <CRow className="my-1  ">
                  <CCol md={6}>
                    <CFormText>Father&apos;s Name</CFormText>
                    <CFormInput
                      type="text"
                      value={toSentenceCase(applicantDetailsForm.values.father_name)}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormText>Father&apos;s Occupation</CFormText>
                    <CFormInput
                      type="text"
                      value={toSentenceCase(applicantDetailsForm.values.father_occupation)}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                </CRow>
                <CRow className="my-1 mb-5">
                  <CCol md={6}>
                    <CFormText>Mother&apos;s Name</CFormText>
                    <CFormInput
                      type="text"
                      value={toSentenceCase(applicantDetailsForm.values.mother_name)}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormText>Mother&apos;s Occupation</CFormText>
                    <CFormInput
                      type="text"
                      value={toSentenceCase(applicantDetailsForm.values.mother_occupation)}
                      className="border-0 border-bottom border-bottom-1"
                      readOnly
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-5 mt-2">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton
                      onClick={() => {
                        setApplicantDetailsModal(true)
                      }}
                      color="primary"
                      variant="outline"
                      className="me-md-2"
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/zfzufhzk.json"
                        trigger="hover"
                        style={{ width: '20px', height: '20px', paddingTop: '5px' }}
                      ></lord-icon>
                      Edit
                    </CButton>
                  </div>
                </CRow>
              </>
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
                    },
                  }}
                  renderTopToolbarCustomActions={({ row, table }) => (
                    <Button
                      color="primary"
                      variant="contained"
                      shape="rounded-pill"
                      onClick={() => {
                        setApplicationDetailsModalVisible(true)
                        addNewApplicationDetailsForm.resetForm()

                        addNewApplicationDetailsForm.setFieldValue(
                          'scholarship_id',
                          searchResult[0].id,
                        )
                        addNewApplicationDetailsForm.setFieldValue(
                          'reference_number',
                          searchResult[0].reference_number,
                        )
                        addNewApplicationDetailsForm.setFieldValue(
                          'lastname',
                          searchResult[0].lastname,
                        )
                        addNewApplicationDetailsForm.setFieldValue(
                          'firstname',
                          searchResult[0].firstname,
                        )
                        addNewApplicationDetailsForm.setFieldValue(
                          'middlename',
                          searchResult[0].middlename,
                        )
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add New Record
                    </Button>
                  )}
                />

                {/* {fetchApplicationDetailsLoading && <DefaultLoading />} */}
              </>
              <>
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
                            {applicantDetailsForm.touched.address &&
                              applicantDetailsForm.errors.address && (
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
                            {applicantDetailsForm.touched.sex &&
                              applicantDetailsForm.errors.sex && (
                                <CFormText className="text-danger">
                                  {applicantDetailsForm.errors.sex}
                                </CFormText>
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
              </>
            </CCardBody>
          </CCard>
        )}
      </>
      <>
        {searchResult.length > 1 && verificationForm.touched.search_value && (
          <>
            <CCard className="mb-4">
              <CCardHeader>{cardTitle}</CCardHeader>
              <CCardBody>
                <MaterialReactTable
                  columns={applicantColumn}
                  data={searchResult}
                  state={{
                    isLoading: verificationLoading,
                    isSaving: verificationLoading,
                    showLoadingOverlay: verificationLoading,
                    showProgressBars: verificationLoading,
                    showSkeletons: verificationLoading,
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
                  // enableRowActions
                  getRowId={(row) => row.id}
                  muiTableBodyRowProps={({ row }) => ({
                    onClick: async () => {
                      applicantDetailsForm.setFieldValue('id', row.original.id)
                      applicantDetailsForm.setFieldValue(
                        'reference_number',
                        row.original.reference_number,
                      )
                      applicantDetailsForm.setFieldValue('lastname', row.original.lastname)
                      applicantDetailsForm.setFieldValue('firstname', row.original.firstname)
                      applicantDetailsForm.setFieldValue('middlename', row.original.middlename)
                      applicantDetailsForm.setFieldValue('suffix', row.original.suffix)
                      applicantDetailsForm.setFieldValue('barangay', row.original.address)
                      applicantDetailsForm.setFieldValue('birthdate', row.original.birthdate)
                      applicantDetailsForm.setFieldValue(
                        'age',
                        calculateAge(row.original.birthdate),
                      )
                      applicantDetailsForm.setFieldValue('civil_status', row.original.civil_status)
                      applicantDetailsForm.setFieldValue('sex', row.original.sex)
                      applicantDetailsForm.setFieldValue(
                        'contact_number',
                        row.original.contact_number,
                      )
                      applicantDetailsForm.setFieldValue(
                        'email_address',
                        row.original.email_address,
                      )
                      applicantDetailsForm.setFieldValue('father_name', row.original.father_name)
                      applicantDetailsForm.setFieldValue(
                        'father_occupation',
                        row.original.father_occupation,
                      )
                      applicantDetailsForm.setFieldValue('mother_name', row.original.mother_name)
                      applicantDetailsForm.setFieldValue(
                        'mother_occupation',
                        row.original.mother_occupation,
                      )
                      applicantDetailsForm.setFieldValue('address', row.original.barangay_id)

                      fetchApplicationDetails(row.original.id)

                      setRowSelection((prev) => {
                        return {
                          [row.id]: !prev[row.id],
                        }
                      })
                    },
                    selected: rowSelection[row.id],
                    sx: {
                      cursor: 'pointer',
                    },
                  })}
                  // state
                  initialState={{
                    density: 'compact',
                  }}
                  renderTopToolbarCustomActions={({ row, table }) => (
                    <CFormLabel style={{ color: 'red' }}>
                      Click the row where you want to add a new record for the applicant.
                    </CFormLabel>
                  )}
                />
              </CCardBody>
            </CCard>

            {Object.keys(rowSelection).length > 0 && (
              <CCard className="mb-4">
                <CCardHeader>
                  <CCardHeader>
                    Application Details of `{toSentenceCase(applicantDetailsForm.values.lastname)},{' '}
                    {toSentenceCase(applicantDetailsForm.values.firstname)}{' '}
                    {toSentenceCase(applicantDetailsForm.values.middlename)}`{' '}
                  </CCardHeader>
                </CCardHeader>
                <CCardBody>
                  <>
                    <CRow className="justify-content-end">
                      <CCol>
                        <div className="text-end ">
                          <h6>
                            Reference #:{' '}
                            <span
                              style={{ textDecoration: 'underline', color: 'red', fontSize: 20 }}
                            >
                              {applicantDetailsForm.values.reference_number}
                            </span>
                          </h6>
                        </div>
                      </CCol>
                    </CRow>
                    <CRow className="my-1 mt-4">
                      <h3 style={{ textDecoration: 'underline' }}>
                        {toSentenceCase(applicantDetailsForm.values.lastname)},{' '}
                        {toSentenceCase(applicantDetailsForm.values.firstname)}{' '}
                        {toSentenceCase(applicantDetailsForm.values.middlename)}{' '}
                        {applicantDetailsForm.values.suffix}
                      </h3>
                    </CRow>

                    <CRow className="my-1">
                      <CCol md={8}>
                        <CFormText>Addresss</CFormText>
                        <CFormInput
                          type="text"
                          value={applicantDetailsForm.values.barangay}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                      <CCol md={2}>
                        <CFormText>Birthdate</CFormText>
                        <CFormInput
                          type="text"
                          value={applicantDetailsForm.values.birthdate}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                      <CCol md={2}>
                        <CFormText>Age</CFormText>
                        <CFormInput
                          type="text"
                          value={calculateAge(applicantDetailsForm.values.birthdate)}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                    </CRow>

                    <CRow className="my-1">
                      <CCol md={3}>
                        <CFormText>Civil Status</CFormText>
                        <CFormInput
                          type="text"
                          value={toSentenceCase(applicantDetailsForm.values.civil_status)}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormText>Sex</CFormText>
                        <CFormInput
                          type="text"
                          value={toSentenceCase(applicantDetailsForm.values.sex)}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormText>Contact #</CFormText>
                        <CFormInput
                          type="text"
                          value={applicantDetailsForm.values.contact_number}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormText>Email Address</CFormText>
                        <CFormInput
                          type="text"
                          value={applicantDetailsForm.values.email_address}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="my-1  ">
                      <CCol md={6}>
                        <CFormText>Father&apos;s Name</CFormText>
                        <CFormInput
                          type="text"
                          value={toSentenceCase(applicantDetailsForm.values.father_name)}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormText>Father&apos;s Occupation</CFormText>
                        <CFormInput
                          type="text"
                          value={toSentenceCase(applicantDetailsForm.values.father_occupation)}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="my-1 mb-5">
                      <CCol md={6}>
                        <CFormText>Mother&apos;s Name</CFormText>
                        <CFormInput
                          type="text"
                          value={toSentenceCase(applicantDetailsForm.values.mother_name)}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormText>Mother&apos;s Occupation</CFormText>
                        <CFormInput
                          type="text"
                          value={toSentenceCase(applicantDetailsForm.values.mother_occupation)}
                          className="border-0 border-bottom border-bottom-1"
                          readOnly
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-5 mt-2">
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton
                          onClick={() => {
                            setApplicantDetailsModal(true)
                          }}
                          color="primary"
                          variant="outline"
                          className="me-md-2"
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/zfzufhzk.json"
                            trigger="hover"
                            style={{ width: '20px', height: '20px', paddingTop: '5px' }}
                          ></lord-icon>
                          Edit
                        </CButton>
                      </div>
                    </CRow>
                  </>
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
                        },
                      }}
                      renderTopToolbarCustomActions={({ row, table }) => (
                        <Button
                          color="primary"
                          variant="contained"
                          shape="rounded-pill"
                          onClick={() => {
                            console.info(applicantDetailsForm)
                            setApplicationDetailsModalVisible(true)
                            addNewApplicationDetailsForm.resetForm()
                            addNewApplicationDetailsForm.setFieldValue(
                              'scholarship_id',
                              applicantDetailsForm.values.id,
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
                            // applicantDetailsForm.resetForm()
                            // applicantDetailsForm.setValues({
                            //   scholarship_id: applicantDetailsForm.values.id,
                            //   reference_number: applicantDetailsForm.values.reference_number,
                            //   lastname: applicantDetailsForm.values.lastname,
                            //   firstname: applicantDetailsForm.values.firstname,
                            //   middlename: applicantDetailsForm.values.middlename,
                            // })
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add New Record
                        </Button>
                      )}
                    />

                    {fetchDataLoading && <DefaultLoading />}
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
                              {applicantDetailsForm.touched.address &&
                                applicantDetailsForm.errors.address && (
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
                              {applicantDetailsForm.touched.sex &&
                                applicantDetailsForm.errors.sex && (
                                  <CFormText className="text-danger">
                                    {applicantDetailsForm.errors.sex}
                                  </CFormText>
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
                </CCardBody>
              </CCard>
            )}
          </>
        )}
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
                        // readOnly
                      />
                      {/* <CInputGroupText className="bg-transparent font-weight-bolder">
                                -
                              </CInputGroupText> */}
                      <CFormInput
                        type="hidden"
                        name="app_sem_number"
                        onChange={handleInputChange}
                        value={addNewApplicationDetailsForm.values.app_sem_number}
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
                        value={addNewApplicationDetailsForm.values.app_id_number}
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
                  {/* {addNewApplicationDetailsForm.values.scholarship_type !== 'senior_high' && (
                    <>
                      <CCol md={3}>
                        <CFormInput
                          type="text"
                          label={requiredField('CTC #')}
                          name="ctc"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.ctc}
                          required
                        />
                        {addNewApplicationDetailsForm.touched.ctc &&
                          addNewApplicationDetailsForm.errors.ctc && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.ctc}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )} */}
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
    </>
  )
}

export default Registration

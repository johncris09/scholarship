import React, { useEffect, useRef, useState } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CSpinner,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import {
  CivilStatus,
  DefaultLoading,
  GradeLevel,
  MagnifyingGlassLoading,
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
import { Box } from '@mui/material'
import MaterialReactTable from 'material-react-table'
import moment from 'moment/moment'
import {
  ApplicationIDNumber,
  ApplicationSemNumber,
  ApplicationYearNumber,
} from './ApplicationNumber'
import BasicInfo from './BasicInfo'
import ScholarshipHistory from './ScholarshipHistory'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const isProduction = false

const Registration = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const avatarRef = useRef(null)
  const cropperRef = useRef(null)
  const selectAddressIputRef = useRef()
  const selectSeniorHighSchoolInputRef = useRef()
  const selectCollegeSchoolInputRef = useRef()
  const selectStrandInputRef = useRef()
  const selectCourseInputRef = useRef()
  const selectTvetCourseInputRef = useRef()
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const searchInputRef = useRef(null)
  const [endPoint, setEndPoint] = useState('shs_appno')
  const [scholarshipID, setScholarshipID] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [cropPhotoModalVisible, setCropPhotoModalVisible] = useState(false)
  const [cropData, setCropData] = useState('')

  const applicantColumn = [
    {
      accessorKey: 'reference_number',
      header: 'Reference #',
      accessorFn: (row) => row.reference_number,
    },
    {
      accessorKey: 'photo',
      header: 'Photo',
      size: 120,
      includeInExport: false,
      Cell: ({ row }) => {
        let photo = row.original.photo || 'defaultAvatar.png' // Assuming "defaultAvatar.png" is a string
        return (
          <Box
            className="text-right"
            md={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end', // Align to the right
              gap: '1rem',
            }}
          >
            <img
              alt="avatar"
              height={25}
              src={
                isProduction
                  ? `${process.env.REACT_APP_BASEURL_PRODUCTION}assets/image/scholarship/${photo}`
                  : `${process.env.REACT_APP_BASEURL_DEVELOPMENT}assets/image/scholarship/${photo}`
              }
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />
          </Box>
        )
      },
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

  const config = useQuery({
    queryFn: async () =>
      await api.get('config').then((response) => {
        return response.data?.[0]
      }),
    queryKey: ['configRegistration'],
    staleTime: Infinity,
  })

  const seniorHighSchool = useQuery({
    queryFn: async () =>
      await api.get('senior_high_school').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['seniorHighSchoolRegistration'],
    staleTime: Infinity,
  })

  const collegeSchool = useQuery({
    queryFn: async () =>
      await api.get('college_school').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['collegeSchoolRegistration'],
    staleTime: Infinity,
  })

  const tvetSchool = useQuery({
    queryFn: async () =>
      await api.get('tvet_school').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['tvetSchoolRegistration'],
    staleTime: Infinity,
  })

  const strand = useQuery({
    queryFn: async () =>
      await api.get('strand').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.strand}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['strandRegistration'],
    staleTime: Infinity,
  })

  const course = useQuery({
    queryFn: async () =>
      await api.get('course').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.course}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['courseRegistration'],
    staleTime: Infinity,
  })

  const tvetCourse = useQuery({
    queryFn: async () =>
      await api.get('tvet_course').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.course}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['tvetCourseRegistration'],
    staleTime: Infinity,
  })

  const address = useQuery({
    queryFn: async () =>
      await api.get('barangay').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.barangay}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['addressRegistration'],
    staleTime: Infinity,
  })

  const appNumber = useQuery({
    queryFn: async () =>
      await api.get('system_sequence/' + endPoint).then((response) => {
        return response.data
      }),
    queryKey: ['appNumber'],
    staleTime: Infinity,
    refetchInterval: 100000,
  })

  useEffect(() => {}, [endPoint])

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
      await api
        .get('verify', { params: values })
        .then((response) => {
          setSearchResult(response.data)
          if (response.data.length === 1) {
            setScholarshipID(response.data[0].id)
          }
          newApplicantForm.resetForm()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setVerificationLoading(false)
        })
    },
  })

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

  const handleSelectChange = (selectedOption, ref) => {
    newApplicantForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

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
      then: (schema) => schema.required('No. of days is required'),
      otherwise: (schema) => schema,
    }),
    grade_level: Yup.string().when('scholarship_type', {
      is: (value) => value === 'senior_high',
      then: (schema) => schema.required('Grade Level is required'),
      otherwise: (schema) => schema,
    }),
    year_level: Yup.string().when('scholarship_type', {
      is: (value) => value === 'college',
      then: (schema) => schema.required('Year Level is required'),
      otherwise: (schema) => schema,
    }),
    availment: Yup.string().required('Availment is required'),
  })

  // Fresh Applicant
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
      photo: '',
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
      fourps_beneficiary: false,
    },
    validationSchema: newApplicantFormValidationSchema,
    onSubmit: async (values) => {
      await insertNewApplicant.mutate(values)
    },
  })

  const insertNewApplicant = useMutation({
    mutationFn: async (values) => {
      return await api.post('applicant/insert_new_applicant', values)
    },
    onSuccess: async (response, values) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      if (values.scholarship_type === 'senior_high') {
        selectStrandInputRef.current.clearValue()
        selectSeniorHighSchoolInputRef.current.clearValue()
      }
      // reset form
      newApplicantForm.resetForm()
      setEndPoint('shs_appno')
      await queryClient.invalidateQueries({ queryKey: ['appNumber'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
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

    let _config = (!config.isLoading || !config.isFetching) && config.data

    return `${scholarshipType}${_config.current_semester.replace(
      /\D+/g,
      '',
    )}-${_config.current_sy.replace(/SY: 20|-20/g, '')}-${firstname}${lastname}-${birthdate}`
  }

  const handleInputNewApplicantForm = (e) => {
    const { name, value, checked } = e.target

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

    // select input that will be converted to sentence case
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

    if (name === 'fourps_beneficiary') {
      newApplicantForm.setFieldValue(name, checked)
    }
  }

  const handleImageChange = (e) => {
    e.preventDefault()

    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (window.URL) {
        setImageUrl(URL.createObjectURL(file))
      } else if (window.FileReader) {
        const reader = new FileReader()
        reader.onload = function (e) {
          setImageUrl(reader.result)
        }
        reader.readAsDataURL(file)
      }
      setCropPhotoModalVisible(true)
    }
  }

  const handleCrop = () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())

      cropperRef.current?.cropper.getCroppedCanvas().toBlob(async (blob) => {
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = async function () {
          var base64Data = reader.result
          newApplicantForm.setFieldValue('photo', base64Data)
          setCropPhotoModalVisible(false)
        }
      })
    }
  }
  return (
    <>
      <ToastContainer />
      <>
        <CCard className="mb-4">
          <CCardHeader>Verify</CCardHeader>
          <CCardBody>
            <CForm className="row g-3  " onSubmit={verificationForm.handleSubmit}>
              <h4>Verify</h4>
              <CRow className="my-3">
                <CCol md={4}>
                  <CFormSelect
                    aria-label="Verify by"
                    label={requiredField('Verify by')}
                    name="verify_by"
                    onChange={handleInputSearchChange}
                    value={verificationForm.values.verify_by}
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
                    style={{ borderRadius: 50 }}
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
                    <CButton color="primary" type="submit" shape="rounded-pill">
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
                    id="new-app-form"
                    className="row g-3  "
                    onSubmit={newApplicantForm.handleSubmit}
                    style={{ position: 'relative' }}
                  >
                    <CRow>
                      <CCol md={2} className="mt-5 text-center  ">
                        <p className="text-center">Profile Photo</p>
                        <CFormLabel
                          className="label"
                          data-toggle="tooltip"
                          title="Change your avatar"
                        >
                          <CImage
                            rounded
                            thumbnail
                            ref={avatarRef}
                            id="avatar"
                            src={
                              newApplicantForm.values.photo
                                ? newApplicantForm.values.photo
                                : isProduction
                                ? process.env.REACT_APP_BASEURL_PRODUCTION +
                                  'assets/image/scholarship/defaultAvatar.png'
                                : process.env.REACT_APP_BASEURL_DEVELOPMENT +
                                  'assets/image/scholarship/defaultAvatar.png'
                            }
                            alt="Profile Photo"
                            width="90%"
                            height="90%"
                          />
                          <CFormInput
                            type="file"
                            className="d-none"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </CFormLabel>

                        <CModal
                          alignment="center"
                          visible={cropPhotoModalVisible}
                          onClose={() => setCropPhotoModalVisible(false)}
                        >
                          <CModalBody>
                            <h3>Crop Photo</h3>
                            <Cropper
                              ref={cropperRef}
                              style={{
                                height: 422,
                                width: '90%',
                                margin: '0 auto',
                                marginTop: 25,
                              }}
                              zoomTo={0.5}
                              aspectRatio={1}
                              preview=".img-preview"
                              src={imageUrl}
                              viewMode={1}
                              minCropBoxHeight={10}
                              minCropBoxWidth={10}
                              background={false}
                              responsive={true}
                              autoCropArea={1}
                              checkOrientation={false}
                              guides={true}
                            />
                          </CModalBody>
                          <CModalFooter>
                            <button
                              type="button"
                              onClick={() => setCropPhotoModalVisible(false)}
                              className="btn btn-secondary"
                              data-dismiss="modal"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleCrop}
                              className="btn btn-primary"
                              id="crop"
                            >
                              Crop
                            </button>
                          </CModalFooter>
                        </CModal>
                      </CCol>
                      <CCol md={10}>
                        <CRow className="my-2">
                          <CCol md={12}>
                            <CFormSelect
                              label={requiredField('Scholarship Type')}
                              name="scholarship_type"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.scholarship_type}
                            >
                              <option value="senior_high">Senior High</option>
                              <option value="college">College</option>
                              <option value="tvet">TVET</option>
                            </CFormSelect>
                          </CCol>
                        </CRow>
                        <CRow className="mb-5">
                          <CCol md={6}>
                            <CFormLabel>Reference Number</CFormLabel>
                            <h5 className="text-danger text-decoration-underline">
                              {(!config.isLoading || !config.isFetching) &&
                                generateReferenceNumber()}
                            </h5>
                          </CCol>
                          <CCol md={3}>
                            <CFormLabel>Application Number</CFormLabel>
                            <h5 className="text-danger text-decoration-underline">
                              {!appNumber.isLoading ||
                                !appNumber.isFetching ||
                                (!appNumber.isRefetching &&
                                  appNumber.data.seq_year +
                                    '-' +
                                    appNumber.data.seq_sem +
                                    '-' +
                                    appNumber.data.seq_appno)}
                            </h5>
                          </CCol>
                          <CCol md={3}>
                            <CFormLabel>Application Status</CFormLabel>

                            <h5 className="text-danger text-decoration-underline">Pending</h5>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol md={12}>
                            <h6>Basic Information</h6>
                            <hr />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol md={3}>
                            <CFormInput
                              type="text"
                              label={requiredField('Last Name')}
                              name="lastname"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.lastname}
                            />
                            {newApplicantForm.touched.lastname &&
                              newApplicantForm.errors.lastname && (
                                <CFormText className="text-danger">
                                  {newApplicantForm.errors.lastname}
                                </CFormText>
                              )}
                          </CCol>
                          <CCol md={3}>
                            <CFormInput
                              type="text"
                              feedbackInvalid="First Name is required."
                              label={requiredField('First Name')}
                              name="firstname"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.firstname}
                            />
                            {newApplicantForm.touched.firstname &&
                              newApplicantForm.errors.firstname && (
                                <CFormText className="text-danger">
                                  {newApplicantForm.errors.firstname}
                                </CFormText>
                              )}
                          </CCol>
                          <CCol md={3}>
                            <CFormInput
                              type="text"
                              label="Middle Name"
                              name="middlename"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.middlename}
                            />
                          </CCol>
                          <CCol md={3}>
                            <CFormInput
                              type="text"
                              label="Suffix"
                              name="suffix"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.suffix}
                            />
                          </CCol>
                        </CRow>

                        <CRow>
                          <CCol md={6}>
                            <CFormLabel>
                              {
                                <>
                                  {(address.isLoading || address.isFetching) && (
                                    <CSpinner size="sm" />
                                  )}
                                  {requiredField(' Address')}
                                </>
                              }
                            </CFormLabel>
                            <Select
                              ref={selectAddressIputRef}
                              value={
                                (!address.isLoading || !address.isFetching) &&
                                address.data?.find(
                                  (option) => option.value === newApplicantForm.values.address,
                                )
                              }
                              onChange={handleSelectChange}
                              options={(!address.isLoading || !address.isFetching) && address.data}
                              name="address"
                              isSearchable
                              placeholder="Search..."
                              isClearable
                            />
                            {newApplicantForm.touched.address &&
                              newApplicantForm.errors.address && (
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
                          <CCol md={3}>
                            <CFormSelect
                              label={requiredField('Civil Status')}
                              name="civil_status"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.civil_status}
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
                          <CCol md={3}>
                            <CFormSelect
                              label={requiredField('Sex')}
                              name="sex"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.sex}
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
                          <CCol md={3}>
                            <CFormInput
                              type="text"
                              label="Contact #"
                              name="contact_number"
                              onChange={handleInputNewApplicantForm}
                              value={newApplicantForm.values.contact_number}
                            />
                          </CCol>
                          <CCol md={3}>
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
                          <CCol md={12}>
                            <CFormCheck
                              id="fourps_beneficiary"
                              name="fourps_beneficiary"
                              value={newApplicantForm.values.fourps_beneficiary}
                              onChange={handleInputNewApplicantForm}
                              checked={newApplicantForm.values.fourps_beneficiary ? true : false}
                              label="4p's Beneficiary"
                            />
                          </CCol>
                        </CRow>
                        <CRow className="my-1">
                          {newApplicantForm.values.scholarship_type === 'senior_high' && (
                            <>
                              <CCol md={8}>
                                <CFormLabel>
                                  {
                                    <>
                                      {(seniorHighSchool.isLoading ||
                                        seniorHighSchool.isFetching) && <CSpinner size="sm" />}
                                      {requiredField(' School')}
                                    </>
                                  }
                                </CFormLabel>
                                <Select
                                  ref={selectSeniorHighSchoolInputRef}
                                  value={
                                    (!seniorHighSchool.isLoading || !seniorHighSchool.isFetching) &&
                                    seniorHighSchool.data?.find(
                                      (option) => option.value === newApplicantForm.values.school,
                                    )
                                  }
                                  onChange={handleSelectChange}
                                  options={
                                    (!seniorHighSchool.isLoading || !seniorHighSchool.isFetching) &&
                                    seniorHighSchool.data
                                  }
                                  name="school"
                                  isSearchable
                                  placeholder="Search..."
                                  isClearable
                                />
                                {newApplicantForm.touched.school &&
                                  newApplicantForm.errors.school && (
                                    <CFormText className="text-danger">
                                      {newApplicantForm.errors.school}
                                    </CFormText>
                                  )}
                              </CCol>
                              <CCol md={4}>
                                <CFormLabel>
                                  {
                                    <>
                                      {(strand.isLoading || strand.isFetching) && (
                                        <CSpinner size="sm" />
                                      )}
                                      {requiredField(' Strand')}
                                    </>
                                  }
                                </CFormLabel>
                                <Select
                                  ref={selectStrandInputRef}
                                  value={
                                    (!strand.isLoading || !strand.isFetching) &&
                                    strand.data?.find(
                                      (option) => option.value === newApplicantForm.values.strand,
                                    )
                                  }
                                  onChange={handleSelectChange}
                                  options={(!strand.isLoading || !strand.isFetching) && strand.data}
                                  name="strand"
                                  isSearchable
                                  placeholder="Search..."
                                  isClearable
                                />
                                {newApplicantForm.touched.strand &&
                                  newApplicantForm.errors.strand && (
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
                                      {(collegeSchool.isLoading || collegeSchool.isFetching) && (
                                        <CSpinner size="sm" />
                                      )}
                                      {requiredField(' School')}
                                    </>
                                  }
                                </CFormLabel>
                                <Select
                                  ref={selectCollegeSchoolInputRef}
                                  value={
                                    (!collegeSchool.isLoading || !collegeSchool.isFetching) &&
                                    collegeSchool.data?.find(
                                      (option) =>
                                        option.value === newApplicantForm.values.collegeSchool,
                                    )
                                  }
                                  onChange={handleSelectChange}
                                  options={
                                    (!collegeSchool.isLoading || !collegeSchool.isFetching) &&
                                    collegeSchool.data
                                  }
                                  name="school"
                                  isSearchable
                                  placeholder="Search..."
                                  isClearable
                                />
                                {newApplicantForm.touched.school &&
                                  newApplicantForm.errors.school && (
                                    <CFormText className="text-danger">
                                      {newApplicantForm.errors.school}
                                    </CFormText>
                                  )}
                              </CCol>
                              <CCol md={4}>
                                <CFormLabel>
                                  {
                                    <>
                                      {(course.isLoading || course.isFetching) && (
                                        <CSpinner size="sm" />
                                      )}
                                      {requiredField(' Course')}
                                    </>
                                  }
                                </CFormLabel>
                                <Select
                                  ref={selectCourseInputRef}
                                  value={
                                    (!course.isLoading || !course.isFetching) &&
                                    course.data?.find(
                                      (option) => option.value === newApplicantForm.values.course,
                                    )
                                  }
                                  onChange={handleSelectChange}
                                  options={(!course.isLoading || !course.isFetching) && course.data}
                                  name="course"
                                  isSearchable
                                  placeholder="Search..."
                                  isClearable
                                />
                                {newApplicantForm.touched.course &&
                                  newApplicantForm.errors.course && (
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
                              <CCol md={4}>
                                <CFormLabel>
                                  {
                                    <>
                                      {(tvetSchool.isLoading || tvetSchool.isFetching) && (
                                        <CSpinner size="sm" />
                                      )}

                                      {requiredField(' School')}
                                    </>
                                  }
                                </CFormLabel>
                                <Select
                                  ref={selectTvetCourseInputRef}
                                  value={
                                    (!tvetSchool.isLoading || !tvetSchool.isFetching) &&
                                    tvetSchool.data?.find(
                                      (option) =>
                                        option.value === newApplicantForm.values.tvetSchool,
                                    )
                                  }
                                  onChange={handleSelectChange}
                                  options={
                                    (!tvetSchool.isLoading || !tvetSchool.isFetching) &&
                                    tvetSchool.data
                                  }
                                  name="school"
                                  isSearchable
                                  placeholder="Search..."
                                  isClearable
                                />
                                {newApplicantForm.touched.school &&
                                  newApplicantForm.errors.school && (
                                    <CFormText className="text-danger">
                                      {newApplicantForm.errors.school}
                                    </CFormText>
                                  )}
                              </CCol>
                              <CCol md={4}>
                                <CFormLabel>
                                  {
                                    <>
                                      {(tvetCourse.isLoading || tvetCourse.isFetching) && (
                                        <CSpinner size="sm" />
                                      )}

                                      {requiredField(' Course')}
                                    </>
                                  }
                                </CFormLabel>
                                <Select
                                  ref={selectTvetCourseInputRef}
                                  value={
                                    (!tvetCourse.isLoading || !tvetCourse.isFetching) &&
                                    tvetCourse.data?.find(
                                      (option) =>
                                        option.value === newApplicantForm.values.tvetCourse,
                                    )
                                  }
                                  onChange={handleSelectChange}
                                  options={
                                    (!tvetCourse.isLoading || !tvetCourse.isFetching) &&
                                    tvetCourse.data
                                  }
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
                              <CCol md={2}>
                                <CFormInput
                                  type="number"
                                  label={requiredField('No. of days')}
                                  name="hourNumber"
                                  onChange={handleInputNewApplicantForm}
                                  value={newApplicantForm.values.hourNumber}
                                />
                                {newApplicantForm.touched.hourNumber &&
                                  newApplicantForm.errors.hourNumber && (
                                    <CFormText className="text-danger">
                                      {newApplicantForm.errors.hourNumber}
                                    </CFormText>
                                  )}
                              </CCol>
                              <CCol md={2}>
                                <CFormInput
                                  type="number"
                                  label={requiredField('Availment')}
                                  name="availment"
                                  onChange={handleInputNewApplicantForm}
                                  value={newApplicantForm.values.availment}
                                />
                                {newApplicantForm.touched.availment &&
                                  newApplicantForm.errors.availment && (
                                    <CFormText className="text-danger">
                                      {newApplicantForm.errors.availment}
                                    </CFormText>
                                  )}
                              </CCol>
                            </>
                          )}
                        </CRow>

                        <CRow className="my-1">
                          {newApplicantForm.values.scholarship_type === 'senior_high' && (
                            <>
                              <CCol md={6}>
                                <CFormSelect
                                  label={requiredField('Grade Level')}
                                  name="grade_level"
                                  onChange={handleInputNewApplicantForm}
                                  value={newApplicantForm.values.grade_level}
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
                              </CCol>
                              <CCol md={6}>
                                <CFormInput
                                  type="number"
                                  label={requiredField('Availment')}
                                  name="availment"
                                  onChange={handleInputNewApplicantForm}
                                  value={newApplicantForm.values.availment}
                                />
                                {newApplicantForm.touched.availment &&
                                  newApplicantForm.errors.availment && (
                                    <CFormText className="text-danger">
                                      {newApplicantForm.errors.availment}
                                    </CFormText>
                                  )}
                              </CCol>
                            </>
                          )}

                          {newApplicantForm.values.scholarship_type === 'college' && (
                            <>
                              <CCol md={6}>
                                <CFormSelect
                                  label={requiredField('Year Level')}
                                  name="year_level"
                                  onChange={handleInputNewApplicantForm}
                                  value={newApplicantForm.values.year_level}
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
                              </CCol>
                              <CCol md={6}>
                                <CFormInput
                                  type="number"
                                  label={requiredField('Availment')}
                                  name="availment"
                                  onChange={handleInputNewApplicantForm}
                                  value={newApplicantForm.values.availment}
                                />
                                {newApplicantForm.touched.availment &&
                                  newApplicantForm.errors.availment && (
                                    <CFormText className="text-danger">
                                      {newApplicantForm.errors.availment}
                                    </CFormText>
                                  )}
                              </CCol>
                            </>
                          )}
                        </CRow>
                        <CRow className="mt-4">
                          <div className="d-grid gap-2">
                            <CButton color="primary" type="submit" style={{ borderRadius: 50 }}>
                              Submit
                            </CButton>
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
                {insertNewApplicant.isPending && <DefaultLoading />}
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
                <BasicInfo id={scholarshipID} />
                <ScholarshipHistory scholarshipId={scholarshipID} hasNewRecordButton={true} />
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
                  initialState={{
                    density: 'compact',
                  }}
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
                            hasNewRecordButton={true}
                          />
                        </Box>
                      </>
                    ) : null
                  }}
                />
              </CCardBody>
            </CCard>
          </>
        )}
      </>
    </>
  )
}

export default Registration

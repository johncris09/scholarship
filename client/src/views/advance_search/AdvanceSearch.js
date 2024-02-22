import React, { useState, useEffect, useRef } from 'react'
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
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import {
  CivilStatus,
  DefaultLoading,
  RequiredFieldNote,
  Sex,
  api,
  calculateAge,
  handleError,
  requiredField,
  toSentenceCase,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { EditSharp } from '@mui/icons-material'

const Search = ({ cardTitle }) => {
  const selectAddressIputRef = useRef()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [applicantData, setApplicantData] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultText, setResultText] = useState('')
  const [fetchApplicationDetailsLoading, setFetchApplicationDetailsLoading] = useState(false)
  const [applicationDetails, setApplicationDetails] = useState([])
  const [applicationDetailsModalVisible, setApplicationDetailsModalVisible] = useState(false)
  const [applicantDetailsModal, setApplicantDetailsModal] = useState(false)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [fetchAddressLoading, setFetchAddressLoading] = useState(true)
  const [address, setAddress] = useState([])
  const [dataOperationLoading, setDataOperationLoading] = useState(false)

  useEffect(() => {
    fetchAddress()
  }, [])

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
  const handleInputChange = (e) => {
    const { name, value } = e.target
    searchForm.setFieldValue(name, value)
    applicantDetailsForm.setFieldValue(name, value)
  }

  const searchForm = useFormik({
    initialValues: {
      query: '',
    },
    onSubmit: async (values) => {
      if (values.query) {
        setLoading(true)
        await api
          .get('advance_search', { params: values })
          .then((response) => {
            setData(response.data)
          })
          .catch((error) => {
            toast.error(handleError(error))
          })
          .finally(() => {
            setLoading(false)
          })
        // setResultText('Result for `' + values.query + '`')
      } else {
        setLoading(false)
        setData([])
        setResultText('')
      }
    },
  })

  const column = [
    {
      accessorKey: 'reference_number',
      header: 'Reference #',
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
  const applicationDetailsColumn = [
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

  const handleSelectAddress = (selectedOption) => {
    applicantDetailsForm.setFieldValue('address', selectedOption ? selectedOption.value : '')
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
      setDataOperationLoading(true)
      await api
        .put('applicant/update/' + values.id, values)
        .then((response) => {
          toast.success(response.data.message)
          setApplicantDetailsModal(false)
          // fetchData()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setDataOperationLoading(false)
        })

      await api.get('applicant/' + values.id).then((response) => {
        setApplicantData(response.data)
      })
    },
  })

  return (
    <>
      <ToastContainer />
      <CRow className="mb-3">
        <CCol md={12}>
          <CCard>
            <CCardHeader>{cardTitle}</CCardHeader>
            <CCardBody>
              <CForm
                id="searchForm"
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={searchForm.handleSubmit}
              >
                <CRow className="mt-4 mb-2 justify-content-center ">
                  <CCol md={8}>
                    <CInputGroup>
                      <CFormInput
                        name="query"
                        onChange={handleInputChange}
                        value={searchForm.values.query}
                        placeholder="Enter reference # then press enter..."
                        aria-describedby="label-search"
                      />
                      <CButton type="submit" color="primary" variant="outline" id="label-search">
                        <lord-icon
                          src="https://cdn.lordicon.com/kkvxgpti.json"
                          trigger="hover"
                          style={{ width: '22px', height: '22px', paddingTop: '3px' }}
                        ></lord-icon>
                      </CButton>
                    </CInputGroup>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>{resultText}</CCardHeader>
            <CCardBody style={{ position: 'relative' }}>
              <MaterialReactTable
                columns={column}
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
                data={data}
                columnFilterDisplayMode="popover"
                paginationDisplayMode="pages"
                positionToolbarAlertBanner="bottom"
                enableStickyHeader
                enableStickyFooter
                // enableRowActions
                selectAllMode="all"
                initialState={{
                  density: 'compact',
                  // columnPinning: {
                  //   left: [
                  //     // 'mrt-row-actions',
                  //     'reference_number',
                  //     'lastname',
                  //     'firstname',
                  //     'middlename',
                  //   ],
                  // },
                }}
                getRowId={(row) => row.id}
                muiTableBodyRowProps={({ row }) => ({
                  //implement row selection click events manually
                  onClick: async () => {
                    setLoading(true)
                    setRowSelection((prev) => {
                      return {
                        [row.id]: !prev[row.id],
                      }
                    })

                    setFetchApplicationDetailsLoading(true)
                    const id = row.original.id

                    api
                      .get('applicant/' + id)
                      .then((response) => {
                        setApplicantData(response.data)
                        applicantDetailsForm.setValues({
                          id: id,
                          reference_number: response.data.reference_number,
                          lastname: toSentenceCase(response.data.lastname),
                          firstname: toSentenceCase(response.data.firstname),
                          middlename: toSentenceCase(response.data.middlename),
                          suffix: response.data.suffix,
                          address: response.data.barangay_id,
                          birthdate: response.data.birthdate,
                          civil_status: toSentenceCase(response.data.civil_status),
                          sex: response.data.sex,
                          contact_number: response.data.contact_number,
                          email_address: response.data.email_address,
                          father_name: toSentenceCase(response.data.father_name),
                          father_occupation: toSentenceCase(response.data.father_occupation),
                          mother_name: toSentenceCase(response.data.mother_name),
                          mother_occupation: toSentenceCase(response.data.mother_occupation),
                        })
                      })
                      .catch((error) => {
                        toast.error(error)
                        // toast.error(handleError(error))
                      })
                    // .finally(() => {
                    //   setFetchDataLoading(false)
                    // })

                    await api
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
                    setApplicationDetailsModalVisible(true)
                    setLoading(false)
                    setRowSelection({})
                  },
                  selected: rowSelection[row.id],
                  sx: {
                    cursor: 'pointer',
                  },
                })}
              />
            </CCardBody>

            {loading && <DefaultLoading />}
          </CCard>
        </CCol>
      </CRow>

      <CModal
        fullscreen
        backdrop="static"
        visible={applicationDetailsModalVisible}
        onClose={() => setApplicationDetailsModalVisible(false)}
      >
        <CModalHeader onClose={() => setApplicationDetailsModalVisible(false)}>
          <CModalTitle>Application Details</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <>
            <CRow className="justify-content-end">
              <CCol>
                <div className="text-end">
                  <h6>
                    Reference #:{' '}
                    <span style={{ textDecoration: 'underline', color: 'red', fontSize: 20 }}>
                      {applicantData.reference_number}
                    </span>
                  </h6>
                </div>
              </CCol>
            </CRow>
            <CRow className="my-1 mt-4">
              <h3 style={{ textDecoration: 'underline' }}>
                {toSentenceCase(applicantData.lastname)}, {toSentenceCase(applicantData.firstname)}{' '}
                {toSentenceCase(applicantData.middlename)} {applicantData.suffix}
              </h3>
            </CRow>
            <CRow className="my-1">
              <CCol md={8}>
                <CFormText>Addresss</CFormText>
                <CFormInput
                  type="text"
                  value={applicantData.address}
                  className="border-0 border-bottom border-bottom-1"
                  readOnly
                />
              </CCol>
              <CCol md={2}>
                <CFormText>Birthdate</CFormText>
                <CFormInput
                  type="text"
                  value={applicantData.birthdate}
                  className="border-0 border-bottom border-bottom-1"
                  readOnly
                />
              </CCol>
              <CCol md={2}>
                <CFormText>Age</CFormText>
                <CFormInput
                  type="text"
                  value={calculateAge(applicantData.birthdate)}
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
                  value={toSentenceCase(applicantData.civil_status)}
                  className="border-0 border-bottom border-bottom-1"
                  readOnly
                />
              </CCol>
              <CCol md={3}>
                <CFormText>Sex</CFormText>
                <CFormInput
                  type="text"
                  value={toSentenceCase(applicantData.sex)}
                  className="border-0 border-bottom border-bottom-1"
                  readOnly
                />
              </CCol>
              <CCol md={3}>
                <CFormText>Contact #</CFormText>
                <CFormInput
                  type="text"
                  value={applicantData.contact_number}
                  className="border-0 border-bottom border-bottom-1"
                  readOnly
                />
              </CCol>
              <CCol md={3}>
                <CFormText>Email Address</CFormText>
                <CFormInput
                  type="text"
                  value={applicantData.email_address}
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
                  value={toSentenceCase(applicantData.father_name)}
                  className="border-0 border-bottom border-bottom-1"
                  readOnly
                />
              </CCol>
              <CCol md={6}>
                <CFormText>Father&apos;s Occupation</CFormText>
                <CFormInput
                  type="text"
                  value={toSentenceCase(applicantData.father_occupation)}
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
                  value={toSentenceCase(applicantData.mother_name)}
                  className="border-0 border-bottom border-bottom-1"
                  readOnly
                />
              </CCol>
              <CCol md={6}>
                <CFormText>Mother&apos;s Occupation</CFormText>
                <CFormInput
                  type="text"
                  value={toSentenceCase(applicantData.mother_occupation)}
                  className="border-0 border-bottom border-bottom-1"
                  readOnly
                />
              </CCol>
            </CRow>
            <CRow className="mb-5 mt-2">
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton
                  onClick={() => {
                    console.info(1)
                    // setFetchDataLoading(true)
                    // api
                    //   .get('applicant/' + id)
                    //   .then((response) => {
                    //     console.info(response.data)
                    //     applicantDetailsForm.setValues({
                    //       reference_number: response.data.reference_number,
                    //       lastname: toSentenceCase(response.data.lastname),
                    //       firstname: toSentenceCase(response.data.firstname),
                    //       middlename: toSentenceCase(response.data.middlename),
                    //       suffix: response.data.suffix,
                    //       address: response.data.barangay_id,
                    //       birthdate: response.data.birthdate,
                    //       civil_status: toSentenceCase(response.data.civil_status),
                    //       sex: response.data.sex,
                    //       contact_number: response.data.contact_number,
                    //       email_address: response.data.email_address,
                    //       father_name: toSentenceCase(response.data.father_name),
                    //       father_occupation: toSentenceCase(response.data.father_occupation),
                    //       mother_name: toSentenceCase(response.data.mother_name),
                    //       mother_occupation: toSentenceCase(response.data.mother_occupation),
                    //     })
                    setApplicantDetailsModal(true)
                    //   })
                    //   .catch((error) => {
                    //     toast.error(handleError(error))
                    //   })
                    //   .finally(() => {
                    //     setFetchDataLoading(false)
                    //   })
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
              columns={applicationDetailsColumn}
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
                columnPinning: {
                  left: ['app_year_number'],
                  right: ['app_status'],
                },
              }}
            />
          </>
          {fetchApplicationDetailsLoading && <DefaultLoading />}
        </CModalBody>
      </CModal>

      <CModal
        alignment="center"
        size="xl"
        backdrop="static"
        visible={applicantDetailsModal}
        onClose={() => setApplicantDetailsModal(false)}
      >
        <CModalHeader onClose={() => setApplicantDetailsModal(false)}>
          <CModalTitle> Edit</CModalTitle>
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
                {applicantDetailsForm.touched.lastname && applicantDetailsForm.errors.lastname && (
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

          {dataOperationLoading && <DefaultLoading />}

          <CModalFooter>
            <CButton className="btn btn-sm" color="primary" type="submit">
              Update
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Search

import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import UseAnimations from 'react-useanimations'
import trash from 'react-useanimations/lib/trash'
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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { Description, EditSharp, Visibility } from '@mui/icons-material'
import Select from 'react-select'
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

const Applicant = ({ cardTitle }) => {
  const selectAddressIputRef = useRef()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [courseOperationLoading, setDataOperationLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')
  const [address, setAddress] = useState([])
  const [fetchAddressLoading, setFetchAddressLoading] = useState(true)
  const [isViewAll, setIsViewAll] = useState(true)
  useEffect(() => {
    fetchData()
    fetchAddress()
  }, [])

  const column = [
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

  const fetchData = async () => {
    await api
      .get('applicant')
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

  const handleSelectAddress = (selectedOption) => {
    formik.setFieldValue('address', selectedOption ? selectedOption.value : '')
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
  const formik = useFormik({
    initialValues: {
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
      isEnableEdit &&
        (await api
          .put('applicant/update/' + editId, values)
          .then((response) => {
            toast.success(response.data.message)
            fetchData()
            setValidated(false)
            setModalVisible(false)
          })
          .catch((error) => {
            toast.error(handleError(error))
          })
          .finally(() => {
            setDataOperationLoading(false)
          }))
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    formik.setFieldValue(name, value)
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
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
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableGrouping
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            initialState={{
              density: 'compact',
              columnPinning: {
                left: ['mrt-row-actions', 'reference_number', 'lastname', 'firstname'],
              },
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Tooltip title="View Details" style={{ marginTop: -20 }}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      const id = row.original.id
                      navigate('/applicant/details/' + id, { replace: false })
                    }}
                  >
                    <lord-icon
                      src="https://cdn.lordicon.com/lyrrgrsl.json"
                      trigger="hover"
                      colors="primary:#2516c7"
                      style={{ width: '30px', height: '30px', paddingTop: '10px' }}
                    ></lord-icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setEditId(row.original.id)
                      formik.setValues({
                        reference_number: row.original.reference_number,
                        lastname: toSentenceCase(row.original.lastname),
                        firstname: toSentenceCase(row.original.firstname),
                        middlename: toSentenceCase(row.original.middlename),
                        suffix: row.original.suffix,
                        address: row.original.barangay_id,
                        birthdate: row.original.birthdate,
                        civil_status: toSentenceCase(row.original.civil_status),
                        sex: row.original.sex,
                        contact_number: row.original.contact_number,
                        email_address: row.original.email_address,
                        father_name: toSentenceCase(row.original.father_name),
                        father_occupation: toSentenceCase(row.original.father_occupation),
                        mother_name: toSentenceCase(row.original.mother_name),
                        mother_occupation: toSentenceCase(row.original.mother_occupation),
                      })
                      setIsEnableEdit(true)
                      setModalVisible(true)
                    }}
                  >
                    <lord-icon
                      src="https://cdn.lordicon.com/zfzufhzk.json"
                      trigger="hover"
                      style={{ width: '30px', height: '30px' }}
                    ></lord-icon>
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={({ row, table }) => (
              <Button
                color="primary"
                variant="contained"
                shape="rounded-pill"
                onClick={async () => {
                  setIsViewAll(!isViewAll)
                  setFetchDataLoading(true)
                  if (isViewAll) {
                    await api
                      .get('all_applicant')
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
                  } else {
                    fetchData()
                  }
                }}
              >
                <lord-icon
                  src="https://cdn.lordicon.com/unukghxb.json"
                  trigger="hover"
                  colors="primary:#ffffff,secondary:#ffffff"
                  style={{ width: '30px', height: '30px' }}
                ></lord-icon>{' '}
                {isViewAll ? 'View All' : 'View Current'}
              </Button>
            )}
          />

          {fetchDataLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        size="xl"
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> {isEnableEdit ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>

        <CForm
          id="form"
          className="row g-3 needs-validation"
          noValidate
          onSubmit={formik.handleSubmit}
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
                  value={formik.values.reference_number}
                  required
                  style={{ fontSize: 20 }}
                  className="text-end"
                />
                {formik.touched.reference_number && formik.errors.reference_number && (
                  <CFormText className="text-danger">{formik.errors.reference_number}</CFormText>
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
                  value={formik.values.lastname}
                  required
                />
                {formik.touched.lastname && formik.errors.lastname && (
                  <CFormText className="text-danger">{formik.errors.lastname}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label={requiredField('First Name')}
                  name="firstname"
                  onChange={handleInputChange}
                  value={formik.values.firstname}
                  required
                />
                {formik.touched.firstname && formik.errors.firstname && (
                  <CFormText className="text-danger">{formik.errors.firstname}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Middle Name"
                  name="middlename"
                  onChange={handleInputChange}
                  value={formik.values.middlename}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Suffix"
                  name="suffix"
                  onChange={handleInputChange}
                  value={formik.values.suffix}
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
                  value={address.find((option) => option.value === formik.values.address)}
                  onChange={handleSelectAddress}
                  options={address}
                  name="address"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
                {formik.touched.address && formik.errors.address && (
                  <CFormText className="text-danger">{formik.errors.address}</CFormText>
                )}
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="date"
                  label={requiredField('Birthdate')}
                  name="birthdate"
                  onChange={handleInputChange}
                  value={formik.values.birthdate}
                />
                {formik.touched.birthdate && formik.errors.birthdate && (
                  <CFormText className="text-danger">{formik.errors.birthdate}</CFormText>
                )}
              </CCol>
            </CRow>

            <CRow className="my-3">
              <CCol md={3}>
                <CFormSelect
                  label={requiredField('Civil Status')}
                  name="civil_status"
                  onChange={handleInputChange}
                  value={formik.values.civil_status}
                  required
                >
                  <option value="">Select</option>
                  {CivilStatus.map((civil_status, index) => (
                    <option key={index} value={civil_status}>
                      {civil_status}
                    </option>
                  ))}
                </CFormSelect>
                {formik.touched.civil_status && formik.errors.civil_status && (
                  <CFormText className="text-danger">{formik.errors.civil_status}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  label={requiredField('Sex')}
                  name="sex"
                  onChange={handleInputChange}
                  value={formik.values.sex}
                  required
                >
                  <option value="">Select</option>
                  {Sex.map((sex, index) => (
                    <option key={index} value={sex}>
                      {sex}
                    </option>
                  ))}
                </CFormSelect>
                {formik.touched.sex && formik.errors.sex && (
                  <CFormText className="text-danger">{formik.errors.sex}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Contact #"
                  name="contact_number"
                  onChange={handleInputChange}
                  value={formik.values.contact_number}
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Facebook/Others"
                  name="email_address"
                  onChange={handleInputChange}
                  value={formik.values.email_address}
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
                  value={formik.values.father_name}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Occupation"
                  name="father_occupation"
                  onChange={handleInputChange}
                  value={formik.values.father_occupation}
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
                  value={formik.values.mother_name}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Occupation"
                  name="mother_occupation"
                  onChange={handleInputChange}
                  value={formik.values.mother_occupation}
                />
              </CCol>
            </CRow>
          </CModalBody>

          {courseOperationLoading && <DefaultLoading />}

          <CModalFooter>
            <CButton
              className="btn btn-sm"
              color="secondary"
              onClick={() => setModalVisible(false)}
            >
              Close
            </CButton>
            <CButton className="btn btn-sm" color="primary" type="submit">
              {!isEnableEdit ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Applicant

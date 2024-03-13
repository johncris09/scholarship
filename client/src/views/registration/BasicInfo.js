import React, { useEffect, useRef, useState } from 'react'
import {
  CivilStatus,
  DefaultLoading,
  Sex,
  api,
  calculateAge,
  handleError,
} from 'src/components/SystemConfiguration'
import './../../assets/css/custom.css'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Select from 'react-select'
import {
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormText,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { Skeleton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

const BasicInfo = ({ id }) => {
  const selectAddressIputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [data, setData] = useState([])
  const [fetchApplicationDetailsLoading, setFetchApplicationDetailsLoading] = useState(true)
  const [fetchAddressLoading, setFetchAddressLoading] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [address, setAddress] = useState([])

  useEffect(() => {
    fetchData()
    fetchAddress()
  }, [id])

  const fetchData = () => {
    setFetchDataLoading(true)
    api
      .get('applicant/' + id)
      .then((response) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'birthdate') {
      applicantDetailsForm.setFieldValue('age', calculateAge(value))
    }

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
      <CForm
        id="app-details-form"
        className="   g-3 needs-validation"
        noValidate
        onSubmit={applicantDetailsForm.handleSubmit}
        style={{ position: 'relative' }}
      >
        <div className="d-grid gap-2 d-md-block" style={{ marginLeft: 8 }}>
          <CButton
            className="mt-2"
            color="primary"
            type="submit"
            size="sm"
            shape="rounded-pill"
            variant="outline"
          >
            <FontAwesomeIcon icon={faPencil} /> Update Basic Info
          </CButton>
        </div>
        <CTable responsive>
          <CTableBody>
            <CTableRow>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Reference #
              </CTableHeaderCell>
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
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Last Name
              </CTableHeaderCell>
              <CTableDataCell>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={80} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="lastname"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.lastname}
                      required
                      style={{
                        width: '200px',
                      }}
                    />
                    {applicantDetailsForm.touched.lastname &&
                      applicantDetailsForm.errors.lastname && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.lastname}
                        </CFormText>
                      )}
                  </>
                )}
              </CTableDataCell>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                First Name
              </CTableHeaderCell>
              <CTableDataCell>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={80} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="firstname"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.firstname}
                      required
                      style={{
                        width: '200px',
                      }}
                    />
                    {applicantDetailsForm.touched.firstname &&
                      applicantDetailsForm.errors.firstname && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.firstname}
                        </CFormText>
                      )}
                  </>
                )}
              </CTableDataCell>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Middle Name
              </CTableHeaderCell>
              <CTableDataCell>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={80} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="middlename"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.middlename}
                      required
                      style={{
                        width: '100px',
                      }}
                    />
                    {applicantDetailsForm.touched.middlename &&
                      applicantDetailsForm.errors.middlename && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.middlename}
                        </CFormText>
                      )}
                  </>
                )}
              </CTableDataCell>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Suffix
              </CTableHeaderCell>
              <CTableDataCell>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={50} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="suffix"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.suffix}
                      required
                      style={{
                        width: '100px',
                      }}
                    />
                    {applicantDetailsForm.touched.suffix && applicantDetailsForm.errors.suffix && (
                      <CFormText className="text-danger">
                        {applicantDetailsForm.errors.suffix}
                      </CFormText>
                    )}
                  </>
                )}
              </CTableDataCell>
            </CTableRow>

            <CTableRow>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Address
              </CTableHeaderCell>
              <CTableDataCell colSpan={3}>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={150} />
                ) : (
                  <>
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
                  </>
                )}
              </CTableDataCell>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Birthdate
              </CTableHeaderCell>
              <CTableDataCell>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={80} />
                ) : (
                  <>
                    <CFormInput
                      type="date"
                      name="birthdate"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.birthdate}
                      required
                      style={{
                        width: '120px',
                      }}
                    />
                    {applicantDetailsForm.touched.birthdate &&
                      applicantDetailsForm.errors.birthdate && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.birthdate}
                        </CFormText>
                      )}
                  </>
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
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Civil Status
              </CTableHeaderCell>
              <CTableDataCell>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={40} />
                ) : (
                  <>
                    <CFormSelect
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
                  </>
                )}
              </CTableDataCell>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Sex
              </CTableHeaderCell>
              <CTableDataCell>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={50} />
                ) : (
                  <>
                    <CFormSelect
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
                      <CFormText className="text-danger">
                        {applicantDetailsForm.errors.sex}
                      </CFormText>
                    )}
                  </>
                )}
              </CTableDataCell>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Contact #
              </CTableHeaderCell>
              <CTableDataCell>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={90} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="contact_number"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.contact_number}
                      required
                      style={{
                        width: '200px',
                      }}
                    />
                    {applicantDetailsForm.touched.contact_number &&
                      applicantDetailsForm.errors.contact_number && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.contact_number}
                        </CFormText>
                      )}
                  </>
                )}
              </CTableDataCell>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Email Address
              </CTableHeaderCell>
              <CTableDataCell>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={120} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="email_address"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.email_address}
                      required
                      style={{
                        width: '200px',
                      }}
                    />
                    {applicantDetailsForm.touched.email_address &&
                      applicantDetailsForm.errors.email_address && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.email_address}
                        </CFormText>
                      )}
                  </>
                )}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Father&apos;s Name
              </CTableHeaderCell>
              <CTableDataCell colSpan={3}>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={90} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="father_name"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.father_name}
                      required
                      style={{
                        width: '200px',
                      }}
                    />
                    {applicantDetailsForm.touched.father_name &&
                      applicantDetailsForm.errors.father_name && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.father_name}
                        </CFormText>
                      )}
                  </>
                )}
              </CTableDataCell>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Father&apos;s Occupation
              </CTableHeaderCell>
              <CTableDataCell colSpan={3}>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={90} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="father_occupation"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.father_occupation}
                      required
                      style={{
                        width: '200px',
                      }}
                    />
                    {applicantDetailsForm.touched.father_occupation &&
                      applicantDetailsForm.errors.father_occupation && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.father_occupation}
                        </CFormText>
                      )}
                  </>
                )}
              </CTableDataCell>
            </CTableRow>

            <CTableRow>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Mother&apos;s Name
              </CTableHeaderCell>
              <CTableDataCell colSpan={3}>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={90} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="mother_name"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.mother_name}
                      required
                      style={{
                        width: '200px',
                      }}
                    />
                    {applicantDetailsForm.touched.mother_name &&
                      applicantDetailsForm.errors.mother_name && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.mother_name}
                        </CFormText>
                      )}
                  </>
                )}
              </CTableDataCell>
              <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                Mother&apos;s Occupation
              </CTableHeaderCell>
              <CTableDataCell colSpan={3}>
                {fetchDataLoading ? (
                  <Skeleton variant="rounded" width={90} />
                ) : (
                  <>
                    <CFormInput
                      type="text"
                      name="mother_occupation"
                      onChange={handleInputChange}
                      value={applicantDetailsForm.values.mother_occupation}
                      required
                      style={{
                        width: '200px',
                      }}
                    />
                    {applicantDetailsForm.touched.mother_occupation &&
                      applicantDetailsForm.errors.mother_occupation && (
                        <CFormText className="text-danger">
                          {applicantDetailsForm.errors.mother_occupation}
                        </CFormText>
                      )}
                  </>
                )}
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CForm>
      {operationLoading && <DefaultLoading />}
    </>
  )
}

export default BasicInfo

import React, { useEffect, useRef, useState } from 'react'
import {
  CivilStatus,
  DefaultLoading,
  Sex,
  api,
  calculateAge,
  handleError,
  toSentenceCase,
} from 'src/components/SystemConfiguration'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import './../../assets/css/custom.css'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Select from 'react-select'
import logo from './../../assets/images/logo.png'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
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
const isProduction = false
const BasicInfo = ({ id }) => {
  const avatarRef = useRef(null)
  const imageRef = useRef(null)
  const selectAddressIputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [data, setData] = useState([])
  const [fetchApplicationDetailsLoading, setFetchApplicationDetailsLoading] = useState(true)
  const [fetchAddressLoading, setFetchAddressLoading] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [profilePhotoLoading, setProfilePhotoLoading] = useState(false)
  const [address, setAddress] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [cropper, setCropper] = useState(null)
  const [cropPhotoModalVisible, setCropPhotoModalVisible] = useState(false)
  const cropperRef = useRef(null)
  const [cropData, setCropData] = useState('https://avatars0.githubusercontent.com/u/3456749?s=160')

  useEffect(() => {
    fetchData()
    fetchAddress()
  }, [id])

  const fetchData = async () => {
    setFetchDataLoading(true)
    await api
      .get('applicant/' + id)
      .then((response) => {
        setData(response.data)
        applicantDetailsForm.setFieldValue('id', response.data.id)
        applicantDetailsForm.setFieldValue('reference_number', response.data.reference_number)
        applicantDetailsForm.setFieldValue('lastname', toSentenceCase(response.data.lastname))
        applicantDetailsForm.setFieldValue('firstname', toSentenceCase(response.data.firstname))
        applicantDetailsForm.setFieldValue('middlename', response.data.middlename)
        applicantDetailsForm.setFieldValue('suffix', response.data.suffix)
        applicantDetailsForm.setFieldValue('barangay', response.data.address)
        applicantDetailsForm.setFieldValue('birthdate', response.data.birthdate)
        applicantDetailsForm.setFieldValue('age', calculateAge(response.data.birthdate))
        applicantDetailsForm.setFieldValue('civil_status', response.data.civil_status)
        applicantDetailsForm.setFieldValue('sex', response.data.sex)
        applicantDetailsForm.setFieldValue('contact_number', response.data.contact_number)
        applicantDetailsForm.setFieldValue('email_address', response.data.email_address)
        applicantDetailsForm.setFieldValue('father_name', toSentenceCase(response.data.father_name))
        applicantDetailsForm.setFieldValue(
          'father_occupation',
          toSentenceCase(response.data.father_occupation),
        )
        applicantDetailsForm.setFieldValue('mother_name', toSentenceCase(response.data.mother_name))
        applicantDetailsForm.setFieldValue(
          'mother_occupation',
          toSentenceCase(response.data.mother_occupation),
        )
        applicantDetailsForm.setFieldValue('address', response.data.barangay_id)
        if (response.data.photo) {
          applicantDetailsForm.setFieldValue('photo', response.data.photo)
        } else {
          applicantDetailsForm.setFieldValue('photo', 'defaultAvatar.png')
        }
      })
      .catch((error) => {
        console.info(error)
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
      photo: '',
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
          setProfilePhotoLoading(true)
          await api
            .put('applicant/update_photo/' + id, { photo: base64Data })
            .then((response) => {
              fetchData()
              toast.success(response.data.message)
              setCropPhotoModalVisible(false)
            })
            .catch((error) => {
              console.error('Error uploading image:', error)
              // Handle error
            })
            .finally(() => {
              setProfilePhotoLoading(false)
            })
        }
      })
    }
  }

  return (
    <>
      <CForm
        id="app-details-form"
        className="   g-3 needs-validation"
        noValidate
        onSubmit={applicantDetailsForm.handleSubmit}
        style={{ position: 'relative' }}
      >
        <CRow>
          <CCol md={2} className="mt-5 text-center  ">
            <p className="text-center">Profile Photo</p>

            {fetchDataLoading ? (
              <Skeleton className="m-auto" variant="rounded" height={120} width={140} />
            ) : (
              <CFormLabel className="label" data-toggle="tooltip" title="Change your avatar">
                <CImage
                  rounded
                  thumbnail
                  ref={avatarRef}
                  id="avatar"
                  src={
                    isProduction
                      ? process.env.REACT_APP_BASEURL_PRODUCTION +
                        'assets/image/scholarship/' +
                        applicantDetailsForm.values.photo
                      : process.env.REACT_APP_BASEURL_DEVELOPMENT +
                        'assets/image/scholarship/' +
                        applicantDetailsForm.values.photo
                  }
                  alt="Profile Photo"
                  width="90%"
                  height="90%"
                />
                <CFormInput
                  type="file"
                  className="sr-only"
                  id="input"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </CFormLabel>
            )}

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
              {profilePhotoLoading && <DefaultLoading />}
              <CModalFooter>
                <button
                  type="button"
                  onClick={() => setCropPhotoModalVisible(false)}
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" onClick={handleCrop} className="btn btn-primary" id="crop">
                  Crop
                </button>
              </CModalFooter>
            </CModal>
          </CCol>
          <CCol md={10}>
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
                        {applicantDetailsForm.touched.suffix &&
                          applicantDetailsForm.errors.suffix && (
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
          </CCol>
        </CRow>
      </CForm>
      {operationLoading && <DefaultLoading />}
    </>
  )
}

export default BasicInfo

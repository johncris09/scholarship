import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import Swal from 'sweetalert2'
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
  CFormText,
  CImage,
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
import { faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp, Key } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  decrypted,
  handleError,
  requiredField,
  roleType,
  toSentenceCase,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const isProduction = false

const User = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)

  const column = [
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
              alt="Profile Photo"
              height={25}
              src={
                isProduction
                  ? `${process.env.REACT_APP_BASEURL_PRODUCTION}assets/image/user/${photo}`
                  : `${process.env.REACT_APP_BASEURL_DEVELOPMENT}assets/image/user/${photo}`
              }
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />
          </Box>
        )
      },
    },
    {
      accessorKey: 'firstname',
      header: 'First Name',
    },

    {
      accessorKey: 'middlename',
      header: 'M.I.',
    },
    {
      accessorKey: 'lastname',
      header: 'Last Name',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      accessorFn: (row) => {
        if (row.role === '4BSVYawhFI8j779vM8q1') {
          return 'Administrator'
        }
        if (row.role === 'KmOlD4kHZC93Yp8Jirhc') {
          return 'Encoder'
        }
        if (row.role === 'azr14gGCV7hLW2ppQz2l') {
          return 'User'
        }
      },
    },
    {
      accessorKey: 'school',
      header: 'School',
    },
  ]

  const user = useQuery({
    queryFn: async () =>
      await api.get('user').then((response) => {
        return response.data
      }),
    queryKey: ['user'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const seniorHighSchoolUser = useQuery({
    queryFn: async () =>
      await api.get('senior_high_school').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['senior_high_school_user'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const avatarRef = useRef(null)
  const [data, setData] = useState([])
  const cropperRef = useRef(null)
  const selectSeniorHighSchoolInputRef = useRef()
  const selectRoleTypeInputRef = useRef()
  const [validated, setValidated] = useState(true)
  const [passwordValidated, setPasswordValidated] = useState(false)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)
  const [seniorHighSchool, setSeniorHighSchool] = useState([])
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [togglePassword, setTogglePassword] = useState(true)
  const [fetchSeniorHighSchoolLoading, setFetchSeniorHighSchoolLoading] = useState(false)
  const [cropPhotoModalVisible, setCropPhotoModalVisible] = useState(false)

  const [cropData, setCropData] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    username: Yup.string().required('Username is required'),
    role_type: Yup.string().when('school_user', {
      is: false,
      then: (schema) => schema.required('Role Type is required'),
      otherwise: (schema) => schema,
    }),
    password: Yup.string().when('hidePassword', {
      is: false,
      then: (schema) =>
        schema
          .required('Password is required')
          .min(7, 'Too Short!')
          .max(12, 'Too Long!')
          .matches(
            /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
            'Password must have at least 1 uppercase letter, 1 symbol, and be at least 8 characters',
          ),
      otherwise: (schema) => schema,
    }),
    school: Yup.string().when('school_user', {
      is: true,
      then: (schema) => schema.required('School is required'),
      otherwise: (schema) => schema,
    }),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      username: '',
      password: '',
      hidePassword: false,
      role_type: '',
      school_user: false,
      school: '',
      photo: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.hidePassword) {
        await updateUser.mutate(values)
      } else {
        await insertUser.mutate(values)
      }
    },
  })

  const insertUser = useMutation({
    mutationFn: async (user) => {
      return await api.post('user/insert', user)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updateUser = useMutation({
    mutationFn: async (user) => {
      return await api.put('user/update/' + user.id, user)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updatePasswordFormValidationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(7, 'Too Short!')
      .max(12, 'Too Long!')
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        'Password must have at least 1 uppercase letter, 1 symbol, and be at least 8 characters',
      ),
  })
  const updatePasswordForm = useFormik({
    initialValues: {
      id: '',
      password: '',
    },
    validationSchema: updatePasswordFormValidationSchema,
    onSubmit: async (values) => {
      await updatePassword.mutate(values)
      // setOperationLoading(true)
      // setFetchDataLoading(true)
      // // update password
      // await api
      //   .put('user/change_password/' + values.id, values)
      //   .then((response) => {
      //     toast.success(response.data.message)
      //     fetchData()
      //     setPasswordValidated(false)
      //     setModalChangePasswordFormVisible(false)
      //   })
      //   .catch((error) => {
      //     toast.error(handleError(error))
      //   })
      //   .finally(() => {
      //     setOperationLoading(false)
      //     setFetchDataLoading(false)
      //   })
    },
  })

  const updatePassword = useMutation({
    mutationFn: async (user) => {
      return await api.put('user/change_password/' + user.id, user)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value, type, checked } = e.target

    if (type === 'text' && name !== 'username' && name !== 'password') {
      form.setFieldValue(name, toSentenceCase(value))
    } else {
      form.setFieldValue(name, value)
    }

    if (type === 'checkbox') {
      form.setFieldValue(name, checked)
      // reset school and role type
      if (!checked) {
        form.setFieldValue('school', '')
        form.setFieldValue('role_type', '')
      } else {
        form.setFieldValue('role_type', 'User')
      }
    }
  }

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target
    updatePasswordForm.setFieldValue(name, value)
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
          form.setFieldValue('photo', base64Data)
          setCropPhotoModalVisible(false)
        }
      })
    }
  }
  return (
    <>
      <ToastContainer />
      <CCard className="mb-4" style={{ position: 'relative' }}>
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                form.resetForm()
                setIsEnableEdit(false)
                setValidated(false)
                setModalVisible(!modalFormVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add {cardTitle}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!user.isLoading && user.data}
            state={{
              isLoading:
                user.isLoading ||
                insertUser.isPending ||
                updateUser.isPending ||
                updatePassword.isPending,
              isSaving:
                user.isLoading ||
                insertUser.isPending ||
                updateUser.isPending ||
                updatePassword.isPending,
              showLoadingOverlay:
                user.isLoading ||
                insertUser.isPending ||
                updateUser.isPending ||
                updatePassword.isPending,
              showProgressBars:
                user.isLoading ||
                insertUser.isPending ||
                updateUser.isPending ||
                updatePassword.isPending,
              showSkeletons:
                user.isLoading ||
                insertUser.isPending ||
                updateUser.isPending ||
                updatePassword.isPending,
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
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            initialState={{
              density: 'compact',
              columnPinning: { left: ['mrt-row-actions'] },
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setOperationLoading(false)

                      form.setValues({
                        id: row.original.id,
                        last_name: row.original.lastname,
                        first_name: row.original.firstname,
                        middle_name: row.original.middlename,
                        username: row.original.username,
                        role_type: row.original.role,
                        hidePassword: true,
                        school_user: row.original.school != null ? row.original.school : '',
                        school: row.original.school_id === null ? '' : row.original.school_id,
                        photo: row.original.photo
                          ? isProduction
                            ? `${process.env.REACT_APP_BASEURL_PRODUCTION}assets/image/user/${row.original.photo}`
                            : `${process.env.REACT_APP_BASEURL_DEVELOPMENT}assets/image/user/${row.original.photo}`
                          : '',
                      })
                      setModalVisible(true)
                    }}
                  >
                    <EditSharp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => {
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
                          validationPrompt(async () => {
                            let id = row.original.id

                            await api
                              .delete('user/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries(['user'])

                                toast.success(response.data.message)
                              })
                              .catch((error) => {
                                console.info(error.response.data)
                                // toast.error(handleError(error))
                              })
                          })
                        }
                      })
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Change Password">
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setModalChangePasswordFormVisible(true)
                      updatePasswordForm.setValues({
                        id: row.original.id,
                        password: '',
                      })
                    }}
                  >
                    <Key />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {form.values.hidePassword ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm className="row g-3   mt-4" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={2} className="mt-3 text-center  ">
                <p className="text-center">Profile Photo</p>
                <CFormLabel className="label" data-toggle="tooltip" title="Change your avatar">
                  <CImage
                    rounded
                    thumbnail
                    ref={avatarRef}
                    id="avatar"
                    src={
                      form.values.photo
                        ? form.values.photo
                        : isProduction
                        ? process.env.REACT_APP_BASEURL_PRODUCTION +
                          'assets/image/user/defaultAvatar.png'
                        : process.env.REACT_APP_BASEURL_DEVELOPMENT +
                          'assets/image/user/defaultAvatar.png'
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
                <CRow>
                  <CCol md={4}>
                    <CFormInput
                      type="text"
                      label={requiredField('First Name')}
                      name="first_name"
                      onChange={handleInputChange}
                      value={form.values.first_name}
                      placeholder="First Name"
                    />
                    {form.touched.first_name && form.errors.first_name && (
                      <CFormText className="text-danger">{form.errors.first_name}</CFormText>
                    )}
                  </CCol>
                  <CCol md={4}>
                    <CFormInput
                      type="text"
                      label="Middle Initial"
                      name="middle_name"
                      onChange={handleInputChange}
                      value={form.values.middle_name}
                      placeholder="Middle Initial"
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormInput
                      type="text"
                      label={requiredField('Last Name')}
                      name="last_name"
                      onChange={handleInputChange}
                      value={form.values.last_name}
                      placeholder="Last Name"
                    />
                    {form.touched.last_name && form.errors.last_name && (
                      <CFormText className="text-danger">{form.errors.last_name}</CFormText>
                    )}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      label={requiredField('Username')}
                      name="username"
                      onChange={handleInputChange}
                      value={form.values.username}
                      placeholder="Username"
                    />
                    {form.touched.username && form.errors.username && (
                      <CFormText className="text-danger">{form.errors.username}</CFormText>
                    )}
                  </CCol>
                  {!form.values.hidePassword && (
                    <>
                      <CCol md={6}>
                        <CFormLabel>{requiredField('Password')}</CFormLabel>
                        <CInputGroup className="mb-3">
                          <CFormInput
                            type={togglePassword ? 'password' : 'text'}
                            name="password"
                            onChange={handleInputChange}
                            value={form.values.password}
                            placeholder="Password"
                          />
                          <CButton
                            onClick={() => {
                              setTogglePassword((prevShowPassword) => !prevShowPassword)
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                          >
                            <FontAwesomeIcon icon={togglePassword ? faEye : faEyeSlash} />
                          </CButton>
                        </CInputGroup>
                        {form.touched.password && form.errors.password && (
                          <CFormText className="text-danger">{form.errors.password}</CFormText>
                        )}
                      </CCol>
                    </>
                  )}
                  {!form.values.school_user && (
                    <CCol md={form.values.hidePassword ? 6 : 12}>
                      <CFormLabel>{requiredField('Role Type')}</CFormLabel>
                      <Select
                        ref={selectRoleTypeInputRef}
                        value={roleType.find((option) => option.value === form.values.role_type)}
                        onChange={handleSelectChange}
                        options={roleType}
                        name="role_type"
                        isSearchable
                        placeholder="Search..."
                        isClearable
                      />
                      {form.touched.role_type && form.errors.role_type && (
                        <CFormText className="text-danger">{form.errors.role_type}</CFormText>
                      )}
                    </CCol>
                  )}
                </CRow>
                <CRow>
                  <CCol className="mt-4">
                    <CFormCheck
                      name="school_user"
                      onChange={handleInputChange}
                      checked={form.values.school_user}
                      label="Create a user for the school"
                    />
                  </CCol>
                </CRow>

                {form.values.school_user && (
                  <CRow>
                    <CCol className="mt-1">
                      <hr />
                      <CFormLabel>
                        {
                          <>
                            {seniorHighSchoolUser.isLoading && <CSpinner size="sm" />}
                            {requiredField(' School')}
                          </>
                        }
                      </CFormLabel>
                      <Select
                        ref={selectSeniorHighSchoolInputRef}
                        value={
                          !seniorHighSchoolUser.isLoading &&
                          seniorHighSchoolUser.data?.find(
                            (option) => option.value === form.values.address,
                          )
                        }
                        onChange={handleSelectChange}
                        options={!seniorHighSchoolUser.isLoading && seniorHighSchoolUser.data}
                        name="school"
                        isSearchable
                        placeholder="Search..."
                        isClearable
                      />
                      {form.touched.school && form.errors.school && (
                        <CFormText className="text-danger">{form.errors.school}</CFormText>
                      )}
                    </CCol>
                  </CRow>
                )}

                <hr />
                <CRow>
                  <CCol xs={12}>
                    <CButton color="primary" type="submit" className="float-end">
                      {form.values.hidePassword ? 'Update' : 'Submit'}
                    </CButton>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CForm>
          {(insertUser.isPending || updateUser.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>

      <CModal
        alignment="center"
        visible={modalChangePasswordFormVisible}
        onClose={() => setModalChangePasswordFormVisible(false)}
        backdrop="static"
        keyboard={false}
        size="md"
      >
        <CModalHeader>
          <CModalTitle>Change Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm className="row g-3   mt-4" onSubmit={updatePasswordForm.handleSubmit}>
            <CCol md={12}>
              <CFormLabel>{requiredField('Password')}</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput
                  type={togglePassword ? 'password' : 'text'}
                  name="password"
                  onChange={handlePasswordInputChange}
                  value={updatePasswordForm.values.password}
                  placeholder="Password"
                />
                <CButton
                  onClick={() => {
                    setTogglePassword((prevShowPassword) => !prevShowPassword)
                  }}
                  type="button"
                  color="secondary"
                  variant="outline"
                >
                  <FontAwesomeIcon icon={togglePassword ? faEye : faEyeSlash} />
                </CButton>
              </CInputGroup>
              {updatePasswordForm.touched.password && updatePasswordForm.errors.password && (
                <CFormText className="text-danger">{updatePasswordForm.errors.password}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                Change Password
              </CButton>
            </CCol>
          </CForm>
          {updatePassword.isPending && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default User

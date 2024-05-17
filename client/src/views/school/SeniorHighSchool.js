import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import Select from 'react-select'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  handleError,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const SeniorHighSchool = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const selectAddressIputRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)

  const column = [
    {
      accessorKey: 'abbreviation',
      header: 'Abbreviation',
    },
    {
      accessorKey: 'school',
      header: 'School',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
  ]

  const seniorHighSchool = useQuery({
    queryFn: async () =>
      await api.get('senior_high_school').then((response) => {
        return response.data
      }),
    queryKey: ['seniorHighSchool'],
    staleTime: Infinity,
    refetchInterval: 1000,
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
    queryKey: ['address'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    school_name: Yup.string().required('School Name is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      abbreviation: '',
      school_name: '',
      address: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateSeniorHighSchool.mutate(values)
      } else {
        await insertSeniorHighSchool.mutate(values)
      }
    },
  })

  const insertSeniorHighSchool = useMutation({
    mutationFn: async (school) => {
      return await api.post('senior_high_school/insert', school)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries(['seniorHighSchool'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updateSeniorHighSchool = useMutation({
    mutationFn: async (school) => {
      return await api.put('senior_high_school/update/' + school.id, school)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['seniorHighSchool'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }
  const handleSelectAddress = (selectedOption) => {
    form.setFieldValue('address', selectedOption ? selectedOption.value : '')
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                form.resetForm()
                setIsEnableEdit(false)
                setModalVisible(!modalVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add {cardTitle}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!seniorHighSchool.isLoading && seniorHighSchool.data}
            state={{
              isLoading:
                seniorHighSchool.isLoading ||
                insertSeniorHighSchool.isPending ||
                updateSeniorHighSchool.isPending,
              isSaving:
                seniorHighSchool.isLoading ||
                insertSeniorHighSchool.isPending ||
                updateSeniorHighSchool.isPending,
              showLoadingOverlay:
                seniorHighSchool.isLoading ||
                insertSeniorHighSchool.isPending ||
                updateSeniorHighSchool.isPending,
              showProgressBars:
                seniorHighSchool.isLoading ||
                insertSeniorHighSchool.isPending ||
                updateSeniorHighSchool.isPending,
              showSkeletons:
                seniorHighSchool.isLoading ||
                insertSeniorHighSchool.isPending ||
                updateSeniorHighSchool.isPending,
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
                      form.setValues({
                        id: row.original.id,
                        abbreviation: row.original.abbreviation,
                        school_name: row.original.school,
                        address: row.original.address_id,
                      })
                      setIsEnableEdit(true)
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
                              .delete('senior_high_school/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries(['seniorHighSchool'])

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
              </Box>
            )}
          />
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>{isEnableEdit ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>
        <CForm className="row g-3  " onSubmit={form.handleSubmit}>
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Abbreviation"
                  name="abbreviation"
                  onChange={handleInputChange}
                  value={form.values.abbreviation}
                />
              </CCol>
              {form.touched.abbreviation && form.errors.abbreviation && (
                <CFormText className="text-danger">{form.errors.abbreviation}</CFormText>
              )}
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="School Name is required."
                  label={requiredField('School Name')}
                  name="school_name"
                  onChange={handleInputChange}
                  value={form.values.school_name}
                />
              </CCol>
              {form.touched.school_name && form.errors.school_name && (
                <CFormText className="text-danger">{form.errors.school_name}</CFormText>
              )}
              <CCol className="my-1" md={12}>
                <CFormLabel>
                  {
                    <>
                      {(address.isLoading || address.isFetching) && <CSpinner size="sm" />}
                      {' Address'}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectAddressIputRef}
                  value={
                    (!address.isLoading || !address.isFetching) &&
                    address.data?.find((option) => option.value === form.values.address)
                  }
                  onChange={handleSelectAddress}
                  options={(!address.isLoading || !address.isFetching) && address.data}
                  name="address"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
              </CCol>
            </CRow>
          </CModalBody>

          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              {!isEnableEdit ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CForm>
        {(insertSeniorHighSchool.isPending || updateSeniorHighSchool.isPending) && (
          <DefaultLoading />
        )}
      </CModal>
    </>
  )
}

export default SeniorHighSchool

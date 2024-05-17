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
  CFormText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
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

const CollegeSchool = ({ cardTitle }) => {
  const queryClient = useQueryClient()
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

  const collegeSchool = useQuery({
    queryFn: async () =>
      await api.get('college_school').then((response) => {
        return response.data
      }),
    queryKey: ['collegeSchool'],
    staleTime: Infinity,
    refetchInterval: 1000,
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
        await updateCollegeSchool.mutate(values)
      } else {
        await insertCollegeSchool.mutate(values)
      }
    },
  })

  const insertCollegeSchool = useMutation({
    mutationFn: async (school) => {
      return await api.post('college_school/insert', school)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries(['collegeSchool'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updateCollegeSchool = useMutation({
    mutationFn: async (school) => {
      return await api.put('college_school/update/' + school.id, school)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['collegeSchool'])
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
            data={!collegeSchool.isLoading && collegeSchool.data}
            state={{
              isLoading:
                collegeSchool.isLoading ||
                insertCollegeSchool.isPending ||
                updateCollegeSchool.isPending,
              isSaving:
                collegeSchool.isLoading ||
                insertCollegeSchool.isPending ||
                updateCollegeSchool.isPending,
              showLoadingOverlay:
                collegeSchool.isLoading ||
                insertCollegeSchool.isPending ||
                updateCollegeSchool.isPending,
              showProgressBars:
                collegeSchool.isLoading ||
                insertCollegeSchool.isPending ||
                updateCollegeSchool.isPending,
              showSkeletons:
                collegeSchool.isLoading ||
                insertCollegeSchool.isPending ||
                updateCollegeSchool.isPending,
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
                        address: row.original.address,
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
                              .delete('college_school/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries(['collegeSchool'])

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

              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Address"
                  name="address"
                  onChange={handleInputChange}
                  value={form.values.address}
                />
              </CCol>
            </CRow>
          </CModalBody>

          <CModalFooter>
            <CButton size="sm" color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
            <CButton size="sm" color="primary" type="submit">
              {!isEnableEdit ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CForm>
        {(insertCollegeSchool.isPending || updateCollegeSchool.isPending) && <DefaultLoading />}
      </CModal>
    </>
  )
}

export default CollegeSchool

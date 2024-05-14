import React, { useState } from 'react'
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
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const Course = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)

  const column = [
    {
      accessorKey: 'course',
      header: 'Course',
    },
  ]

  const course = useQuery({
    queryFn: async () =>
      await api.get('tvet_course').then((response) => {
        return response.data
      }),
    queryKey: ['tvet_course'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    course: Yup.string().required('Course is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      course: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateCourse.mutate(values)
      } else {
        await insertCourse.mutate(values)
      }
    },
  })

  const insertCourse = useMutation({
    mutationFn: async (course) => {
      return await api.post('tvet_course/insert', course)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries(['tvet_course'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updateCourse = useMutation({
    mutationFn: async (course) => {
      return await api.put('tvet_course/update/' + course.id, course)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['tvet_course'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const deleteCourse = useMutation({
    mutationFn: async (id) => {
      return await api.delete('tvet_course/delete/' + id)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message, { autoClose: false })
      }
      await queryClient.invalidateQueries(['tvet_course'])
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
      <ToastContainer autoClose={10000} />
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
            data={!course.isLoading && course.data}
            state={{
              isLoading:
                course.isLoading ||
                course.isFetching ||
                insertCourse.isPending ||
                updateCourse.isPending ||
                deleteCourse.isPending,
              isSaving:
                course.isLoading ||
                course.isFetching ||
                insertCourse.isPending ||
                updateCourse.isPending ||
                deleteCourse.isPending,
              showLoadingOverlay:
                course.isLoading ||
                course.isFetching ||
                insertCourse.isPending ||
                updateCourse.isPending ||
                deleteCourse.isPending,
              showProgressBars:
                course.isLoading ||
                course.isFetching ||
                insertCourse.isPending ||
                updateCourse.isPending ||
                deleteCourse.isPending,
              showSkeletons:
                course.isLoading ||
                course.isFetching ||
                insertCourse.isPending ||
                updateCourse.isPending ||
                deleteCourse.isPending,
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
            enableColumnResizing
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
                        course: row.original.course,
                      })
                      setModalVisible(true)
                      setIsEnableEdit(true)
                    }}
                  >
                    <EditSharp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={async () => {
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
                            await deleteCourse.mutate(row.original.id)
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

      <CModal alignment="center" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> {isEnableEdit ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>

        <CForm id="form" className="row g-3  " onSubmit={form.handleSubmit}>
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Course is required."
                  label={requiredField('Course')}
                  name="course"
                  onChange={handleInputChange}
                  value={form.values.course}
                />
              </CCol>
              {form.touched.course && form.errors.course && (
                <CFormText className="text-danger">{form.errors.course}</CFormText>
              )}
            </CRow>
          </CModalBody>

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
        {(insertCourse.isPending || updateCourse.isPending) && <DefaultLoading />}
      </CModal>
    </>
  )
}

export default Course

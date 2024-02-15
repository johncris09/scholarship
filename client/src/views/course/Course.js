import React, { useState, useEffect } from 'react'
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

const Course = ({ cardTitle }) => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [courseOperationLoading, setDataOperationLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const column = [
    {
      accessorKey: 'course',
      header: 'Course',
    },
  ]

  const fetchData = () => {
    api
      .get('course')
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

  const validationSchema = Yup.object().shape({
    course: Yup.string().required('Course is required'),
  })
  const formik = useFormik({
    initialValues: {
      course: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      !isEnableEdit
        ? // add new data
          await api
            .post('course/insert', values)
            .then((response) => {
              toast.success(response.data.message)
              fetchData()
              formik.resetForm()
              setValidated(false)
            })
            .catch((error) => {
              toast.error(handleError(error))
            })
            .finally(() => {
              setDataOperationLoading(false)
            })
        : // update data
          await api
            .put('course/update/' + editId, values)
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
            })
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
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                formik.resetForm()
                setIsEnableEdit(false)
                setValidated(false)
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
                      setEditId(row.original.id)
                      formik.setValues({
                        course: row.original.course,
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
                          validationPrompt(() => {
                            let id = row.original.id

                            setFetchDataLoading(true)

                            api
                              .delete('course/delete/' + id)
                              .then((response) => {
                                fetchData()

                                toast.success(response.data.message)
                              })
                              .catch((error) => {
                                toast.error(handleError(error))
                              })
                              .finally(() => {
                                setFetchDataLoading(false)
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

          {fetchDataLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
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

            <CRow className="my-2">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Course is required."
                  label={requiredField('Course')}
                  name="course"
                  onChange={handleInputChange}
                  value={formik.values.course}
                  required
                />
              </CCol>
              {formik.touched.course && formik.errors.course && (
                <CFormText className="text-danger">{formik.errors.course}</CFormText>
              )}
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

export default Course

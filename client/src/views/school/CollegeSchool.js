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

const CollegeSchool = ({ cardTitle }) => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchDataLoading, setDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchCollegeSchool()
  }, [])

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

  const fetchCollegeSchool = () => {
    api
      .get('college_school')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setDataLoading(false)
      })
  }

  const validationSchema = Yup.object().shape({
    school_name: Yup.string().required('School Name is required'),
  })
  const formik = useFormik({
    initialValues: {
      abbreviation: '',
      school_name: '',
      address: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setOperationLoading(true)

      !isEnableEdit
        ? // add new data
          await api
            .post('college_school/insert', values)
            .then((response) => {
              toast.success(response.data.message)
              fetchCollegeSchool()
              formik.resetForm()
              setValidated(false)
            })
            .catch((error) => {
              toast.error(handleError(error))
            })
            .finally(() => {
              setOperationLoading(false)
            })
        : // update data
          await api
            .put('college_school/update/' + editId, values)
            .then((response) => {
              toast.success(response.data.message)
              fetchCollegeSchool()
              setValidated(false)
              setModalVisible(false)
            })
            .catch((error) => {
              toast.error(handleError(error))
            })
            .finally(() => {
              setOperationLoading(false)
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
                      let id = row.original.id
                      setEditId(id)
                      formik.setValues({
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
                          validationPrompt(() => {
                            let id = row.original.id

                            setDataLoading(true)

                            api
                              .delete('college_school/delete/' + id)
                              .then((response) => {
                                fetchCollegeSchool()

                                toast.success(response.data.message)
                              })
                              .catch((error) => {
                                toast.error(handleError(error))
                              })
                              .finally(() => {
                                setDataLoading(false)
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
          <CModalTitle>{isEnableEdit ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>
        <CForm
          id="form"
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={formik.handleSubmit}
        >
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Abbreviation"
                  name="abbreviation"
                  onChange={handleInputChange}
                  value={formik.values.abbreviation}
                />
              </CCol>

              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="School Name is required."
                  label={requiredField('School Name')}
                  name="school_name"
                  onChange={handleInputChange}
                  value={formik.values.school_name}
                />
              </CCol>
              {formik.touched.school_name && formik.errors.school_name && (
                <CFormText className="text-danger">{formik.errors.school_name}</CFormText>
              )}

              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Address"
                  name="address"
                  onChange={handleInputChange}
                  value={formik.values.address}
                />
              </CCol>
            </CRow>
          </CModalBody>

          {operationLoading && <DefaultLoading />}

          <CModalFooter>
            <CButton size="sm" color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
            <CButton size="sm" color="primary" type="submit">
              {!isEnableEdit ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default CollegeSchool

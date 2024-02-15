import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormSelect,
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { EditSharp } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  SchoolYear,
  Semester,
  api,
  handleError,
  requiredField,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'

const Config = ({ cardTitle }) => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    api
      .get('config')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const formValidationSchema = Yup.object().shape({
    current_sy: Yup.string().required('School Year is required'),
    current_semester: Yup.string().required('Semester Year is required'),
  })
  const form = useFormik({
    initialValues: {
      current_sy: '',
      current_semester: '',
    },
    validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      setOperationLoading(true)
      if (isEnableEdit) {
        // update
        setFetchDataLoading(true)
        await api
          .put('config/update/' + editId, values)
          .then((response) => {
            toast.success(response.data.message)
            fetchData()
            setValidated(false)
            setModalFormVisible(false)

            window.location.reload()
          })
          .catch((error) => {
            toast.error(handleError(error))
          })
          .finally(() => {
            setOperationLoading(false)
            setFetchDataLoading(false)
          })
      }
    },
  })

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  const column = [
    {
      accessorKey: 'current_sy',
      header: 'Current School Year',
    },
    {
      accessorKey: 'current_semester',
      header: 'Current Semester',
    },
  ]

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4" style={{ position: 'relative' }}>
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
                    onClick={async () => {
                      let id = row.original.id
                      setIsEnableEdit(true)
                      setEditId(id)
                      setFetchDataLoading(true)
                      setOperationLoading(true)
                      await api
                        .get('config/find/' + id)
                        .then((response) => {
                          const res = response.data
                          form.setValues({
                            current_sy: res.current_sy,
                            current_semester: res.current_semester,
                          })
                          setModalFormVisible(true)
                        })
                        .catch((error) => {
                          toast.error('Error fetching data')
                        })
                        .finally(() => {
                          setOperationLoading(false)
                          setFetchDataLoading(false)
                        })
                    }}
                  >
                    <EditSharp />
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
        visible={modalFormVisible}
        onClose={() => setModalFormVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Edit Current List View</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm
            className="row g-3 needs-validation mt-4"
            noValidate
            validated={validated}
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CCol md={12}>
              <CFormSelect
                label={requiredField('School Year')}
                name="current_sy"
                onChange={handleInputChange}
                value={form.values.current_sy}
                required
              >
                <option value="">Select</option>
                {SchoolYear.map((school_year, index) => (
                  <option key={index} value={school_year}>
                    {school_year}
                  </option>
                ))}
              </CFormSelect>
              {form.touched.current_sy && form.errors.current_sy && (
                <CFormText className="text-danger">{form.errors.current_sy}</CFormText>
              )}

              <CFormSelect
                label={requiredField('Semester')}
                name="current_semester"
                onChange={handleInputChange}
                value={form.values.current_semester}
                required
              >
                <option value="">Select</option>
                {Semester.map((semester, index) => (
                  <option key={index} value={semester}>
                    {semester}
                  </option>
                ))}
              </CFormSelect>
              {form.touched.current_semester && form.errors.current_semester && (
                <CFormText className="text-danger">{form.errors.current_semester}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {isEnableEdit ? 'Update' : 'Submit form'}
              </CButton>
            </CCol>
          </CForm>
          {operationLoading && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Config

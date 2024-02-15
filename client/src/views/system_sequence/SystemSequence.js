import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
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
  api,
  handleError,
  requiredField,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'

const SystemSequence = ({ cardTitle }) => {
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
      .get('system_sequence')
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
    seq_name: Yup.string().required('Sequence Name is required'),
    seq_year: Yup.string().required('Sequence Year is required'),
    seq_sem: Yup.string().required('Sequence Semester is required'),
    seq_appno: Yup.string().required('Sequence Application # is required'),
  })
  const form = useFormik({
    initialValues: {
      seq_name: '',
      seq_sem: '',
      seq_year: '',
      seq_appno: '',
    },
    validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      // setOperationLoading(true)
      if (isEnableEdit) {
        // update
        setFetchDataLoading(true)
        await api
          .put('system_sequence/update/' + editId, values)
          .then((response) => {
            toast.success(response.data.message)
            fetchData()
            setValidated(false)
            setModalFormVisible(false)
          })
          .catch((error) => {
            console.info(error)
            // toast.error(handleError(error))
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
    const { name, value, type } = e.target

    form.setFieldValue(name, value)
  }

  const column = [
    {
      accessorKey: 'seq_name',
      header: 'Sequence Name',
    },

    {
      accessorKey: 'seq_year',
      header: '  Year',
    },

    {
      accessorKey: 'seq_sem',
      header: '  Semester',
    },
    {
      accessorKey: 'seq_appno',
      header: 'Application #',
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
                        .get('system_sequence/find/' + id)
                        .then((response) => {
                          const res = response.data

                          form.setValues({
                            seq_appno: res.seq_appno,
                            seq_name: res.seq_name,
                            seq_sem: res.seq_sem,
                            seq_year: res.seq_year,
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
          <CModalTitle>
            {isEnableEdit ? 'Edit System Sequence' : 'Add New  System Sequence'}
          </CModalTitle>
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
              <CFormInput
                type="text"
                label={requiredField('Sequence Name')}
                name="seq_name"
                onChange={handleInputChange}
                value={form.values.seq_name}
                required
                placeholder="Sequence Name"
              />
              {form.touched.seq_name && form.errors.seq_name && (
                <CFormText className="text-danger">{form.errors.seq_name}</CFormText>
              )}
              <CFormInput
                type="number"
                label={requiredField('Sequence Year')}
                name="seq_year"
                onChange={handleInputChange}
                value={form.values.seq_year}
                required
                placeholder="Sequence Year"
              />
              {form.touched.seq_year && form.errors.seq_year && (
                <CFormText className="text-danger">{form.errors.seq_year}</CFormText>
              )}
              <CFormInput
                type="number"
                label={requiredField('Sequence Semester')}
                name="seq_sem"
                onChange={handleInputChange}
                value={form.values.seq_sem}
                required
                placeholder="Sequence Semester"
              />
              {form.touched.seq_sem && form.errors.seq_sem && (
                <CFormText className="text-danger">{form.errors.seq_sem}</CFormText>
              )}
              <CFormInput
                type="number"
                label={requiredField('Sequence Application #')}
                name="seq_appno"
                onChange={handleInputChange}
                value={form.values.seq_appno}
                required
                placeholder="Sequence Application #"
              />
              {form.touched.seq_appno && form.errors.seq_appno && (
                <CFormText className="text-danger">{form.errors.seq_appno}</CFormText>
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

export default SystemSequence

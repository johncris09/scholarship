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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const Config = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)

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

  const config = useQuery({
    queryFn: async () =>
      await api.get('config').then((response) => {
        return response.data
      }),
    queryKey: ['config'],
    staleTime: Infinity,
  })

  const formValidationSchema = Yup.object().shape({
    current_sy: Yup.string().required('School Year is required'),
    current_semester: Yup.string().required('Semester Year is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      current_sy: '',
      current_semester: '',
    },
    validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateConfig.mutate(values)
      }
    },
  })

  const updateConfig = useMutation({
    mutationFn: async (config) => {
      return await api.put('config/update/' + config.id, config)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['config'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!config.isLoading && config.data}
            state={{
              isLoading: config.isLoading || config.isFetching || updateConfig.isPending,
              isSaving: config.isLoading || config.isFetching || updateConfig.isPending,
              showLoadingOverlay: config.isLoading || config.isFetching || updateConfig.isPending,
              showProgressBars: config.isLoading || config.isFetching || updateConfig.isPending,
              showSkeletons: config.isLoading || config.isFetching || updateConfig.isPending,
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
                      console.info(id)
                      await api
                        .get('config/find/' + id)
                        .then((response) => {
                          const res = response.data
                          console.info(res)
                          form.setValues({
                            id: res.id,
                            current_sy: res.current_sy,
                            current_semester: res.current_semester,
                          })
                          setModalVisible(true)
                        })
                        .catch((error) => {
                          toast.error('Error fetching data')
                        })
                      // .finally(() => {
                      //   setOperationLoading(false)
                      //   setFetchDataLoading(false)
                      // })
                    }}
                  >
                    <EditSharp />
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
        size="md"
      >
        <CModalHeader>
          <CModalTitle>Edit Current List View</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm className="row g-3   mt-4" onSubmit={form.handleSubmit}>
            <CCol md={12}>
              <CFormSelect
                label={requiredField('School Year')}
                name="current_sy"
                onChange={handleInputChange}
                value={form.values.current_sy}
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
                Update
              </CButton>
            </CCol>
          </CForm>
          {updateConfig.isPending && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Config

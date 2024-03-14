import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCancel,
  faCheckSquare,
  faEye,
  faFileExcel,
  faFilter,
  faTimesRectangle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CFormTextarea,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box, ListItemIcon, MenuItem } from '@mui/material'
import { EditSharp } from '@mui/icons-material'
import { useFormik } from 'formik'
import Select from 'react-select'
import {
  ApprovedType,
  DefaultLoading,
  GradeLevel,
  RequiredFieldNote,
  SchoolYear,
  Semester,
  StatusType,
  YearLevel,
  api,
  collegeDefaultColumn,
  handleError,
  requiredField,
  seniorHighDefaultColumn,
  toSentenceCase,
  tvetDefaultColumn,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { ExportToCsv } from 'export-to-csv'
import Swal from 'sweetalert2'

const ManageApplication = ({
  app_status,
  scholarship_type,
  hasBulkApproved,
  hasBulkDisapproved,
  hasDeleteSelectedRows,
}) => {
  const selectSchoolInputRef = useRef()
  const selectCourseInputRef = useRef()
  const selectStrandInputRef = useRef()
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(false)
  const [bulkApprovedValidated, setBulkApprovedValidated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [course, setCourse] = useState([])
  const [school, setSchool] = useState([])
  const [applicationDetailsModalVisible, setApplicationDetailsModalVisible] = useState(false)
  const [fetchSchoolLoading, setFetchSchoolLoading] = useState(false)
  const [fetchCourseLoading, setFetchCourseLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [modalBulkApproved, setModalBulkApprovedVisible] = useState(false)
  const [table, setTable] = useState([])

  useEffect(() => {
    fetchData()
    fetchSchool()
    fetchCourse()
  }, [app_status, scholarship_type, hasBulkApproved, hasBulkDisapproved, hasDeleteSelectedRows])

  const fetchSchool = async () => {
    setFetchSchoolLoading(true)

    let endpoint

    if (scholarship_type === 'senior_high') {
      endpoint = 'senior_high_school'
    } else if (scholarship_type === 'college') {
      endpoint = 'college_school'
    } else if (scholarship_type === 'tvet') {
      endpoint = 'tvet_school'
    }

    await api
      .get(endpoint)
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })

        setSchool(formattedData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setFetchSchoolLoading(false)
      })
  }

  const fetchCourse = async () => {
    setFetchCourseLoading(true)

    let endpoint

    if (scholarship_type === 'senior_high') {
      endpoint = 'strand'
    } else if (scholarship_type === 'college') {
      endpoint = 'course'
    } else if (scholarship_type === 'tvet') {
      endpoint = 'tvet_course'
    }

    await api
      .get(endpoint)
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = scholarship_type === 'senior_high' ? `${item.strand}` : `${item.course}`
          return { value, label }
        })
        setCourse(formattedData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setFetchCourseLoading(false)
      })
  }
  const fetchData = () => {
    api
      .get(scholarship_type + '/get_by_status', {
        params: {
          status: app_status,
        },
      })
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    filterForm.setFieldValue(name, value)
    applicationDetailsForm.setFieldValue(name, value)
    approvedForm.setFieldValue(name, value)
  }

  const handleSelectChange = (selectedOption, ref) => {
    applicationDetailsForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  const applicationDetailsFormValidationSchema = Yup.object().shape({
    school: Yup.string().required('School is required'),
    strand: Yup.string().when('scholarship_type', {
      is: (value) => value === 'senior_high',
      then: (schema) => schema.required('Strand is required'),
      otherwise: (schema) => schema,
    }),
    course: Yup.string().when('scholarship_type', {
      is: (value) => value === 'college' || value === 'tvet',
      then: (schema) => schema.required('Course is required'),
    }),
    unit: Yup.string().when('scholarship_type', {
      is: (value) => value === 'college',
      then: (schema) => schema.required('Unit is required'),
      otherwise: (schema) => schema,
    }),
    hourNumber: Yup.string().when('scholarship_type', {
      is: (value) => value === 'tvet',
      then: (schema) => schema.required('No. of days is required'),
      otherwise: (schema) => schema,
    }),
    grade_level: Yup.string().when('scholarship_type', {
      is: (value) => value === 'senior_high',
      then: (schema) => schema.required('Grade Level is required'),
      otherwise: (schema) => schema,
    }),
    year_level: Yup.string().when('scholarship_type', {
      is: (value) => value === 'college',
      then: (schema) => schema.required('Year Level is required'),
      otherwise: (schema) => schema,
    }),
    availment: Yup.string().required('Availment is required'),
    app_status: Yup.string().required('Application Status is required'),
    reason: Yup.string().when('app_status', {
      is: (value) => value === 'Disapproved' || value === 'Void' || value === 'Archived',
      then: (schema) => schema.required('Reason is required'),
      otherwise: (schema) => schema,
    }),
  })
  const applicationDetailsForm = useFormik({
    initialValues: {
      id: '',
      lastname: '',
      firstname: '',
      middlename: '',
      reference_number: '',
      scholarship_id: '',
      app_year_number: '',
      app_sem_number: '',
      app_id_number: '',
      scholarship_type: 'senior_high',
      school: '',
      strand: '',
      course: '',
      // tvetCourse: '',
      unit: '',
      hourNumber: '',
      grade_level: '',
      year_level: '',
      semester: '',
      school_year: '',
      availment: '',
      app_status: '',
    },
    validationSchema: applicationDetailsFormValidationSchema,
    onSubmit: async (values) => {
      setLoadingOperation(true)
      await api
        .put(scholarship_type + '/update/' + values.id, values)
        .then((response) => {
          toast.success(response.data.message)
          fetchData()
          setApplicationDetailsModalVisible(false)
        })
        .catch((error) => {
          console.info(error)
          // toast.error(handleError(error))
        })
        .finally(() => {
          setLoadingOperation(false)
        })
    },
  })

  const handleViewAllData = () => {
    setLoading(true)
    api
      .get(scholarship_type + '/get_all_by_status', {
        params: {
          status: 'void',
        },
      })
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  const filterFormValidationSchema = Yup.object().shape({
    semester: Yup.string().required('Semester is required'),
    school_year: Yup.string().required('School Year is required'),
  })

  const filterForm = useFormik({
    initialValues: {
      semester: '',
      school_year: '',
    },
    validationSchema: filterFormValidationSchema,
    onSubmit: async (values) => {
      setLoadingOperation(true)
      setLoading(true)
      await api
        .get(scholarship_type + '/filter_by_status', {
          params: {
            ...values,
            status: 'void',
          },
        })
        .then((response) => {
          setData(response.data)
          setValidated(false)
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setLoadingOperation(false)
          setLoading(false)
        })
    },
  })

  const handleRemoveFilter = () => {
    setLoading(true)
    setLoadingOperation(true)
    filterForm.resetForm()
    fetchData()
  }

  const csvOptions = (column) => {
    return {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers:
        column === 'senior_high'
          ? seniorHighDefaultColumn.map((c) => c.header)
          : column === 'college'
          ? collegeDefaultColumn.map((c) => c.header)
          : column === 'tvet'
          ? tvetDefaultColumn.map((c) => c.header)
          : [],
    }
  }
  const csvExporter = new ExportToCsv(csvOptions(scholarship_type))
  const handleExportData = () => {
    const exportedData = data.map((item) => {
      let dataObject = {
        'Application #': `${item.app_year_number}-${item.app_sem_number}-${item.app_id_number}`,
        'First Name': toSentenceCase(item.firstname),
        'Last Name': toSentenceCase(item.lastname),
        'Middle Name': toSentenceCase(item.middlename),
        Suffix: toSentenceCase(item.suffix),
        Address: item.address,
        'Contact #': item.contact_number,
        Gender: item.sex,
        School: item.school,
        'Application Status': item.app_status,
        Availment: item.availment,
        'School Year': item.school_year,
        Semester: item.semester,
        Reason: item.reason,
      }

      if (scholarship_type === 'senior_high') {
        dataObject.Strand = item.strand
        dataObject['Grade Level'] = item.grade_level
      } else if (scholarship_type === 'college') {
        dataObject.Course = item.course
        dataObject.Unit = item.unit
        dataObject['Year Level'] = item.year_level
      } else if (scholarship_type === 'tvet') {
        dataObject['# of Days'] = item.unit
        dataObject.Course = item.course
      }
      return dataObject
    })
    csvExporter.generateCsv(exportedData)
  }

  const handleExportRows = (rows) => {
    const csvExporter = new ExportToCsv(csvOptions(scholarship_type))
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        const exportedItem = {}

        if (scholarship_type === 'senior_high') {
          seniorHighDefaultColumn.forEach((col) => {
            exportedItem[col.header] = col.accessorFn ? col.accessorFn(item) : item[col.accessorKey]
          })
        } else if (scholarship_type === 'college') {
          collegeDefaultColumn.forEach((col) => {
            exportedItem[col.header] = col.accessorFn ? col.accessorFn(item) : item[col.accessorKey]
          })
        } else if (scholarship_type === 'tvet') {
          tvetDefaultColumn.forEach((col) => {
            exportedItem[col.header] = col.accessorFn ? col.accessorFn(item) : item[col.accessorKey]
          })
        }

        return exportedItem
      })
    csvExporter.generateCsv(exportedData)
  }

  const handleDeleteRows = (table) => {
    const rows = table.getSelectedRowModel().rows

    const selectedRows = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          id: item.id,
        }
      })

    validationPrompt(() => {
      setLoading(true)
      api
        .post(scholarship_type + '/bulk_status_update', {
          data: selectedRows,
          status: 'Archived',
        })

        .then((response) => {
          toast.success(response.data.message)
          fetchData()
          table.resetRowSelection()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const approvedFormValidationSchema = Yup.object().shape({
    status: Yup.string().required('Status  is required'),
  })
  const approvedForm = useFormik({
    initialValues: {
      status: '',
    },
    validationSchema: approvedFormValidationSchema,
    onSubmit: async (values) => {
      validationPrompt(() => {
        setLoadingOperation(true)
        api
          .post(scholarship_type + '/bulk_status_update', {
            data: selectedRows,
            status: values.status,
          })
          .then((response) => {
            toast.success(response.data.message)
            fetchData()
            approvedForm.resetForm()
            setBulkApprovedValidated(false)
            setModalBulkApprovedVisible(false)
            table.resetRowSelection()
            // clear select rows
            setSelectedRows([])
          })
          .catch((error) => {
            toast.error(handleError(error))
          })
          .finally(() => {
            setLoadingOperation(false)
          })
      })
    },
  })
  const handleBulkApprovedRows = (table) => {
    const rows = table.getSelectedRowModel().rows

    // clear select rows
    setSelectedRows([])

    const selectedRows = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          id: item.id,
        }
      })

    setSelectedRows(selectedRows)
    setModalBulkApprovedVisible(true)
    setTable(table)
  }

  const handleBulkDisapprovedRows = async (table) => {
    const rows = table.getSelectedRowModel().rows

    const selectedRows = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          id: item.id,
        }
      })

    Swal.fire({
      title: 'Selected row(s) will be disapproved.',
      text: 'Reason for disapproval (optional)',
      input: 'textarea',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        validationPrompt(() => {
          setLoading(true)
          api
            .post(scholarship_type + '/bulk_status_update', {
              data: selectedRows,
              status: 'Disapproved',
              reason: result.value,
            })

            .then((response) => {
              toast.success(response.data.message)
              fetchData()
              table.resetRowSelection()
            })
            .catch((error) => {
              toast.error(handleError(error))
            })
            .finally(() => {
              setLoading(false)
            })
        })
      }
    })
  }

  return (
    <>
      <ToastContainer />
      <CRow className="justify-content-center ">
        <CCol md={6}>
          <h5>
            <FontAwesomeIcon icon={faFilter} /> Filter
          </h5>
          <CForm
            id="filterForm"
            className="row g-3 needs-validation mb-4"
            noValidate
            validated={validated}
            onSubmit={filterForm.handleSubmit}
          >
            <RequiredFieldNote />

            <CRow className="my-1">
              <CCol md={6}>
                <CFormSelect
                  label={requiredField('Semester')}
                  name="semester"
                  onChange={handleInputChange}
                  value={filterForm.values.semester}
                  required
                >
                  <option value="">Select</option>
                  {Semester.map((semester, index) => (
                    <option key={index} value={semester}>
                      {semester}
                    </option>
                  ))}
                </CFormSelect>
                {filterForm.touched.semester && filterForm.errors.semester && (
                  <CFormText className="text-danger">{filterForm.errors.semester}</CFormText>
                )}
              </CCol>

              <CCol md={6}>
                <CFormSelect
                  label={requiredField('School Year')}
                  name="school_year"
                  onChange={handleInputChange}
                  value={filterForm.values.school_year}
                  required
                >
                  <option value="">Select</option>
                  {SchoolYear.map((school_year, index) => (
                    <option key={index} value={school_year}>
                      {school_year}
                    </option>
                  ))}
                </CFormSelect>
                {filterForm.touched.school_year && filterForm.errors.school_year && (
                  <CFormText className="text-danger">{filterForm.errors.school_year}</CFormText>
                )}
              </CCol>
            </CRow>

            <CRow className="justify-content-between mt-1">
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="danger" size="sm" variant="outline" onClick={handleRemoveFilter}>
                  <FontAwesomeIcon icon={faCancel} /> Remove Filter
                </CButton>
                <CButton size="sm" variant="outline" color="primary" onClick={handleViewAllData}>
                  <FontAwesomeIcon icon={faEye} /> View All Data
                </CButton>
                <CButton color="primary" size="sm" type="submit">
                  <FontAwesomeIcon icon={faFilter} /> Filter
                </CButton>
              </div>
            </CRow>
          </CForm>
          {loadingOperation && <DefaultLoading />}
          <hr />
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <MaterialReactTable
            columns={
              scholarship_type === 'senior_high'
                ? seniorHighDefaultColumn
                : scholarship_type === 'college'
                ? collegeDefaultColumn
                : scholarship_type === 'tvet'
                ? tvetDefaultColumn
                : []
            }
            data={data}
            enableRowVirtualization
            enableColumnVirtualization
            state={{
              isLoading: loading,
              isSaving: loading,
              showLoadingOverlay: loading,
              showProgressBars: loading,
              showSkeletons: loading,
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
            enableRowSelection
            enableGrouping
            enableSelectAll={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            selectAllMode="all"
            initialState={{ density: 'compact' }}
            renderRowActionMenuItems={({ closeMenu, row }) => [
              <MenuItem
                key={0}
                onClick={async () => {
                  closeMenu()
                  if (scholarship_type === 'senior_high') {
                    applicationDetailsForm.setFieldValue(
                      'school',
                      row.original.senior_high_school_id,
                    )
                    applicationDetailsForm.setFieldValue('strand', row.original.strand_id)
                    applicationDetailsForm.setFieldValue('grade_level', row.original.grade_level)
                  } else if (scholarship_type === 'college') {
                    applicationDetailsForm.setFieldValue('school', row.original.college_school_id)
                    applicationDetailsForm.setFieldValue('course', row.original.course_id)
                    applicationDetailsForm.setFieldValue('unit', row.original.unit)
                    applicationDetailsForm.setFieldValue('year_level', row.original.year_level)
                  } else if (scholarship_type === 'tvet') {
                    applicationDetailsForm.setFieldValue('school', row.original.tvet_school_id)
                    applicationDetailsForm.setFieldValue('course', row.original.tvet_course_id)
                    applicationDetailsForm.setFieldValue('hourNumber', row.original.unit)
                  }

                  applicationDetailsForm.setFieldValue('id', row.original.id)
                  applicationDetailsForm.setFieldValue('lastname', row.original.lastname)
                  applicationDetailsForm.setFieldValue('firstname', row.original.firstname)
                  applicationDetailsForm.setFieldValue('middlename', row.original.middlename)
                  applicationDetailsForm.setFieldValue('suffix', row.original.suffix)
                  applicationDetailsForm.setFieldValue(
                    'reference_number',
                    row.original.reference_number,
                  )
                  applicationDetailsForm.setFieldValue(
                    'app_year_number',
                    row.original.app_year_number,
                  )
                  applicationDetailsForm.setFieldValue(
                    'app_sem_number',
                    row.original.app_sem_number,
                  )
                  applicationDetailsForm.setFieldValue('app_id_number', row.original.app_id_number)
                  applicationDetailsForm.setFieldValue('availment', row.original.availment)
                  applicationDetailsForm.setFieldValue('semester', row.original.semester)
                  applicationDetailsForm.setFieldValue('scholarship_type', scholarship_type)
                  applicationDetailsForm.setFieldValue('school_year', row.original.school_year)
                  applicationDetailsForm.setFieldValue('app_status', row.original.app_status)
                  applicationDetailsForm.setFieldValue(
                    'reason',
                    row.original.reason === null ? '' : row.original.reason,
                  )

                  setApplicationDetailsModalVisible(true)
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <EditSharp />
                </ListItemIcon>
                Edit
              </MenuItem>,
            ]}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <Box
                  className="d-none d-lg-flex"
                  sx={{
                    display: 'flex',
                    gap: '.2rem',
                    p: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <CInputGroup className="mb-3">
                    <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
                      <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                    </CButton>
                    <CButton
                      disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                      size="sm"
                      onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                      variant="outline"
                    >
                      <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
                    </CButton>
                    {hasDeleteSelectedRows && (
                      <CButton
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        size="sm"
                        color="danger"
                        onClick={() => handleDeleteRows(table)}
                        variant="outline"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} /> Delete Selected Rows
                      </CButton>
                    )}
                    {hasBulkApproved && (
                      <CButton
                        color="primary"
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        size="sm"
                        onClick={() => handleBulkApprovedRows(table)}
                      >
                        <FontAwesomeIcon icon={faCheckSquare} /> Bulk Approved
                      </CButton>
                    )}
                    {hasBulkDisapproved && (
                      <CButton
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        size="sm"
                        className="  text-white"
                        color="danger"
                        onClick={() => handleBulkDisapprovedRows(table)}
                      >
                        <FontAwesomeIcon icon={faTimesRectangle} /> Bulk Disapproved
                      </CButton>
                    )}
                  </CInputGroup>

                  {/* <CButton
                    className="btn-info text-white"
                    onClick={() => handleExportSeniorHighData(data)}
                    size="sm"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    onClick={() => handleExportSeniorHighRows(table.getSelectedRowModel().rows)}
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
                  </CButton> */}
                </Box>
              </>
            )}
          />
        </CCol>
      </CRow>

      {loading && <DefaultLoading />}

      <>
        <CModal
          size="lg"
          alignment="center"
          backdrop="static"
          visible={applicationDetailsModalVisible}
          onClose={() => setApplicationDetailsModalVisible(false)}
        >
          <CModalHeader onClose={() => setApplicationDetailsModalVisible(false)}>
            <CModalTitle>
              Update Application Status for{' '}
              <strong>
                `{toSentenceCase(applicationDetailsForm.values.lastname)},{' '}
                {toSentenceCase(applicationDetailsForm.values.firstname)}{' '}
                {toSentenceCase(applicationDetailsForm.values.middlename)}{' '}
                {toSentenceCase(applicationDetailsForm.values.suffix)}`
              </strong>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <>
              <CForm
                id="form"
                className="row g-3 needs-validation"
                noValidate
                onSubmit={applicationDetailsForm.handleSubmit}
              >
                <CRow className="justify-content-end mt-3">
                  <CCol>
                    <div className="text-end">
                      <h6>
                        Reference #:{' '}
                        <span
                          style={{
                            textDecoration: 'underline',
                            color: 'red',
                            fontSize: 20,
                          }}
                        >
                          {applicationDetailsForm.values.reference_number}
                        </span>
                      </h6>
                    </div>
                  </CCol>
                </CRow>

                <CRow className="justify-content-between my-1">
                  <CCol md={7} sm={6} xs={6} lg={8} xl={4}>
                    <CFormLabel>{requiredField(' Application Number')}</CFormLabel>
                    <h4 className="text-danger text-decoration-underline">
                      {applicationDetailsForm.values.app_year_number}-
                      {applicationDetailsForm.values.app_sem_number}-
                      {applicationDetailsForm.values.app_id_number}
                    </h4>

                    <CInputGroup className="mb-3 ">
                      <CFormInput
                        type="hidden"
                        name="app_year_number"
                        onChange={handleInputChange}
                        value={applicationDetailsForm.values.app_year_number}
                        className="text-center"
                        placeholder="Year"
                        aria-label="Year"
                        required
                      />
                      <CFormInput
                        type="hidden"
                        name="app_sem_number"
                        onChange={handleInputChange}
                        value={applicationDetailsForm.values.app_sem_number}
                        className="text-center "
                        placeholder="Semester"
                        aria-label="Sem"
                        required
                      />
                      <CFormInput
                        type="hidden"
                        name="app_id_number"
                        onChange={handleInputChange}
                        value={applicationDetailsForm.values.app_id_number}
                        className="text-center"
                        placeholder="App No"
                        aria-label="App No"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Application Status</CFormLabel>
                    <CFormSelect
                      feedbackInvalid="Status is required."
                      name="app_status"
                      onChange={handleInputChange}
                      value={applicationDetailsForm.values.app_status}
                      required
                    >
                      <option value="">Select</option>
                      {StatusType.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                      ))}
                    </CFormSelect>
                    {applicationDetailsForm.touched.app_status &&
                      applicationDetailsForm.errors.app_status && (
                        <CFormText className="text-danger">
                          {applicationDetailsForm.errors.app_status}
                        </CFormText>
                      )}
                  </CCol>
                </CRow>
                {scholarship_type === 'senior_high' && (
                  <>
                    <CRow className="my-1">
                      <CCol md={8}>
                        <CFormLabel>
                          {
                            <>
                              {fetchSchoolLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectSchoolInputRef}
                          value={school.find(
                            (option) => option.value === applicationDetailsForm.values.school,
                          )}
                          onChange={handleSelectChange}
                          options={school}
                          name="school"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {applicationDetailsForm.touched.school &&
                          applicationDetailsForm.errors.school && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.school}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>
                          {
                            <>
                              {fetchCourseLoading && <CSpinner size="sm" />}
                              {requiredField(' Strand')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectStrandInputRef}
                          value={course.find(
                            (option) => option.value === applicationDetailsForm.values.strand,
                          )}
                          onChange={handleSelectChange}
                          options={course}
                          name="strand"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {applicationDetailsForm.touched.strand &&
                          applicationDetailsForm.errors.strand && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.strand}
                            </CFormText>
                          )}
                      </CCol>
                    </CRow>
                    <CRow className="my-1">
                      <CCol>
                        <CFormSelect
                          label={requiredField('Grade Level')}
                          name="grade_level"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.grade_level}
                          required
                        >
                          <option value="">Select</option>
                          {GradeLevel.map((grade_level, index) => (
                            <option key={index} value={grade_level}>
                              {grade_level}
                            </option>
                          ))}
                        </CFormSelect>

                        {applicationDetailsForm.touched.grade_level &&
                          applicationDetailsForm.errors.grade_level && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.grade_level}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol>
                        <CFormSelect
                          label={requiredField('Semester')}
                          name="semester"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.semester}
                          required
                        >
                          <option value="">Select</option>
                          {Semester.map((semester, index) => (
                            <option key={index} value={semester}>
                              {semester}
                            </option>
                          ))}
                        </CFormSelect>
                        {applicationDetailsForm.touched.semester &&
                          applicationDetailsForm.errors.semester && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.semester}
                            </CFormText>
                          )}
                      </CCol>
                    </CRow>

                    <CRow className="my-1">
                      <CCol md={6}>
                        <CFormSelect
                          label={requiredField('School Year')}
                          name="school_year"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.school_year}
                          required
                        >
                          <option value="">Select</option>
                          {SchoolYear.map((school_year, index) => (
                            <option key={index} value={school_year}>
                              {school_year}
                            </option>
                          ))}
                        </CFormSelect>
                        {applicationDetailsForm.touched.school_year &&
                          applicationDetailsForm.errors.school_year && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.school_year}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="number"
                          label={requiredField('Availment')}
                          name="availment"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.availment}
                          required
                        />
                        {applicationDetailsForm.touched.availment &&
                          applicationDetailsForm.errors.availment && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.availment}
                            </CFormText>
                          )}
                      </CCol>
                    </CRow>
                  </>
                )}

                {scholarship_type === 'college' && (
                  <>
                    <CRow className="my-1">
                      <CCol md={5}>
                        <CFormLabel>
                          {
                            <>
                              {fetchSchoolLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectSchoolInputRef}
                          value={school.find(
                            (option) => option.value === applicationDetailsForm.values.school,
                          )}
                          onChange={handleSelectChange}
                          options={school}
                          name="school"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {applicationDetailsForm.touched.school &&
                          applicationDetailsForm.errors.school && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.school}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>
                          {
                            <>
                              {fetchCourseLoading && <CSpinner size="sm" />}
                              {requiredField(' Course')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectCourseInputRef}
                          value={course.find(
                            (option) => option.value === applicationDetailsForm.values.course,
                          )}
                          onChange={handleSelectChange}
                          options={course}
                          name="course"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {applicationDetailsForm.touched.course &&
                          applicationDetailsForm.errors.course && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.course}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={3}>
                        <CFormInput
                          type="number"
                          label={requiredField('Unit')}
                          name="unit"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.unit}
                          required
                        />
                        {applicationDetailsForm.touched.unit &&
                          applicationDetailsForm.errors.unit && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.unit}
                            </CFormText>
                          )}
                      </CCol>
                    </CRow>

                    <CRow className="my-1">
                      <CCol>
                        <CFormSelect
                          label={requiredField('Year Level')}
                          name="year_level"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.year_level}
                          required
                        >
                          <option value="">Select</option>
                          {YearLevel.map((year_level, index) => (
                            <option key={index} value={year_level}>
                              {year_level}
                            </option>
                          ))}
                        </CFormSelect>
                        {applicationDetailsForm.touched.year_level &&
                          applicationDetailsForm.errors.year_level && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.year_level}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol>
                        <CFormSelect
                          label={requiredField('Semester')}
                          name="semester"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.semester}
                          required
                        >
                          <option value="">Select</option>
                          {Semester.map((semester, index) => (
                            <option key={index} value={semester}>
                              {semester}
                            </option>
                          ))}
                        </CFormSelect>
                        {applicationDetailsForm.touched.semester &&
                          applicationDetailsForm.errors.semester && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.semester}
                            </CFormText>
                          )}
                      </CCol>
                    </CRow>
                    <CRow className="my-1">
                      <CCol md={6}>
                        <CFormSelect
                          label={requiredField('School Year')}
                          name="school_year"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.school_year}
                          required
                        >
                          <option value="">Select</option>
                          {SchoolYear.map((school_year, index) => (
                            <option key={index} value={school_year}>
                              {school_year}
                            </option>
                          ))}
                        </CFormSelect>
                        {applicationDetailsForm.touched.school_year &&
                          applicationDetailsForm.errors.school_year && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.school_year}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="number"
                          label={requiredField('Availment')}
                          name="availment"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.availment}
                          required
                        />
                        {applicationDetailsForm.touched.availment &&
                          applicationDetailsForm.errors.availment && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.availment}
                            </CFormText>
                          )}
                      </CCol>
                    </CRow>
                  </>
                )}

                {scholarship_type === 'tvet' && (
                  <>
                    <CRow className="my-1">
                      <CCol md={5}>
                        <CFormLabel>
                          {
                            <>
                              {fetchSchoolLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectCourseInputRef}
                          value={school.find(
                            (option) => option.value === applicationDetailsForm.values.school,
                          )}
                          onChange={handleSelectChange}
                          options={school}
                          name="school"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {applicationDetailsForm.touched.school &&
                          applicationDetailsForm.errors.school && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.school}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>
                          {
                            <>
                              {fetchCourseLoading && <CSpinner size="sm" />}
                              {requiredField(' Course')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectCourseInputRef}
                          value={course.find(
                            (option) => option.value === applicationDetailsForm.values.course,
                          )}
                          onChange={handleSelectChange}
                          options={course}
                          name="course"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {applicationDetailsForm.touched.course &&
                          applicationDetailsForm.errors.course && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.course}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={3}>
                        <CFormInput
                          type="number"
                          label={requiredField('No. of days')}
                          name="hourNumber"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.hourNumber}
                          required
                        />
                        {applicationDetailsForm.touched.hourNumber &&
                          applicationDetailsForm.errors.hourNumber && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.hourNumber}
                            </CFormText>
                          )}
                      </CCol>
                    </CRow>
                    <CRow className="my-1">
                      <CCol md={4}>
                        <CFormSelect
                          label={requiredField('Semester')}
                          name="semester"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.semester}
                          required
                        >
                          <option value="">Select</option>
                          {Semester.map((semester, index) => (
                            <option key={index} value={semester}>
                              {semester}
                            </option>
                          ))}
                        </CFormSelect>
                        {applicationDetailsForm.touched.semester &&
                          applicationDetailsForm.errors.semester && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.semester}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={4}>
                        <CFormSelect
                          label={requiredField('School Year')}
                          name="school_year"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.school_year}
                          required
                        >
                          <option value="">Select</option>
                          {SchoolYear.map((school_year, index) => (
                            <option key={index} value={school_year}>
                              {school_year}
                            </option>
                          ))}
                        </CFormSelect>
                        {applicationDetailsForm.touched.school_year &&
                          applicationDetailsForm.errors.school_year && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.school_year}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={4}>
                        <CFormInput
                          type="number"
                          label={requiredField('Availment')}
                          name="availment"
                          onChange={handleInputChange}
                          value={applicationDetailsForm.values.availment}
                          required
                        />
                        {applicationDetailsForm.touched.availment &&
                          applicationDetailsForm.errors.availment && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.availment}
                            </CFormText>
                          )}
                      </CCol>
                    </CRow>
                  </>
                )}

                <CRow className="my-1">
                  <CCol md={12}>
                    <CFormTextarea
                      placeholder="Required only when application status set to disapproved, archived and void"
                      label="Reason (Optional)"
                      name="reason"
                      onChange={handleInputChange}
                      style={{ height: '100px' }}
                    >
                      {applicationDetailsForm.values.reason}
                    </CFormTextarea>

                    {applicationDetailsForm.touched.reason &&
                      applicationDetailsForm.errors.reason && (
                        <CFormText className="text-danger">
                          {applicationDetailsForm.errors.reason}
                        </CFormText>
                      )}
                  </CCol>
                </CRow>

                <CRow className="mt-4">
                  <div className="d-grid gap-2">
                    <CButton color="primary" type="submit" shape="rounded-pill">
                      Update Details
                    </CButton>
                  </div>
                </CRow>
              </CForm>
              {loadingOperation && <DefaultLoading />}
            </>
          </CModalBody>
        </CModal>
      </>
      <>
        <CModal
          alignment="center"
          backdrop="static"
          visible={modalBulkApproved}
          onClose={() => setModalBulkApprovedVisible(false)}
        >
          <CModalHeader onClose={() => setModalBulkApprovedVisible(false)}>
            <CModalTitle> Bulk Approved </CModalTitle>
          </CModalHeader>
          <CForm
            id="form"
            className="row g-3 needs-validation"
            noValidate
            validated={bulkApprovedValidated}
            onSubmit={approvedForm.handleSubmit}
          >
            <CModalBody>
              <RequiredFieldNote />

              <CRow className="my-2">
                <CCol md={12}>
                  <CFormSelect
                    feedbackInvalid="Status is required."
                    label={requiredField('Status')}
                    name="status"
                    onChange={handleInputChange}
                    value={approvedForm.values.status}
                    required
                  >
                    <option value="">Select</option>
                    {ApprovedType.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </CFormSelect>
                  {approvedForm.touched.status && approvedForm.errors.status && (
                    <CFormText className="text-danger">{approvedForm.errors.status}</CFormText>
                  )}
                </CCol>
              </CRow>
            </CModalBody>

            {loadingOperation && <DefaultLoading />}

            <CModalFooter>
              <CButton
                color="secondary"
                size="sm"
                onClick={() => setModalBulkApprovedVisible(false)}
              >
                Close
              </CButton>
              <CButton color="primary" size="sm" type="submit">
                Approve
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      </>
    </>
  )
}

export default ManageApplication

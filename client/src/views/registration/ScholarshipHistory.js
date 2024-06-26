import React, { useEffect, useRef, useState } from 'react'
import {
  DefaultLoading,
  GradeLevel,
  SchoolYear,
  Semester,
  StatusType,
  YearLevel,
  api,
  handleError,
  requiredField,
} from 'src/components/SystemConfiguration'
import './../../assets/css/custom.css'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Select from 'react-select'
import {
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CInputGroup,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {
  ApplicationIDNumber,
  ApplicationSemNumber,
  ApplicationYearNumber,
} from './ApplicationNumber'
import { EditSharp } from '@mui/icons-material'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const ScholarshipHistory = ({ scholarshipId, hasNewRecordButton }) => {
  const queryClient = useQueryClient()
  const selectStrandInputRef = useRef()
  const selectSeniorHighSchoolInputRef = useRef()
  const selectCourseInputRef = useRef()
  const selectTvetCourseInputRef = useRef()
  const selectCollegeSchoolInputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [endPoint, setEndPoint] = useState('shs_appno')
  const [applicationDetails, setApplicationDetails] = useState([])
  const [fetchApplicationDetailsLoading, setFetchApplicationDetailsLoading] = useState(true)
  const [applicationDetailsModalVisible, setApplicationDetailsModalVisible] = useState(false)
  const [applicationDetailsEditModalVisible, setApplicationDetailsEditModalVisible] =
    useState(false)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  useEffect(() => {
    fetchApplicationDetails()
  }, [scholarshipId])

  const seniorHighSchool = useQuery({
    queryFn: async () =>
      await api.get('senior_high_school').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['seniorHighSchoolHistory'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const collegeSchool = useQuery({
    queryFn: async () =>
      await api.get('college_school').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['collegeSchoolHistory'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const tvetSchool = useQuery({
    queryFn: async () =>
      await api.get('tvet_school').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['tvetSchoolHistory'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const strand = useQuery({
    queryFn: async () =>
      await api.get('strand').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.strand}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['strandHistory'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const course = useQuery({
    queryFn: async () =>
      await api.get('course').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.course}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['courseHistory'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const tvetCourse = useQuery({
    queryFn: async () =>
      await api.get('tvet_course').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.course}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['tvetCourseHistory'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const fetchApplicationDetails = () => {
    setFetchApplicationDetailsLoading(true)
    api
      .get('applicant_details/' + scholarshipId)
      .then((response) => {
        setApplicationDetails(response.data)
      })
      .catch((error) => {
        console.info(error)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchApplicationDetailsLoading(false)
      })
  }

  const column = [
    {
      accessorKey: 'app_year_number',
      header: 'Application #',
      accessorFn: (row) => `${row.app_year_number}-${row.app_sem_number}-${row.app_id_number}`,
    },
    {
      accessorKey: 'availment',
      header: 'Availment',
    },
    {
      accessorKey: 'school',
      header: 'School',
    },
    {
      accessorKey: 'course',
      header: 'Course',
    },
    {
      accessorKey: 'unit',
      header: 'Unit/# of Days',
    },
    {
      accessorKey: 'year_level',
      header: 'Year Level',
    },
    {
      accessorKey: 'semester',
      header: 'Semester',
    },
    {
      accessorKey: 'school_year',
      header: 'School Year',
    },
    {
      accessorKey: 'app_status',
      header: 'Application Status',
    },
    {
      accessorKey: 'scholarship_type',
      header: 'Scholarship Type',
    },
    {
      accessorKey: 'reason',
      header: 'Note(s)',
      accessorFn: (row) => {
        const contentStateString = row.reason

        if (contentStateString === null) {
          return '' // Return empty string if content state is null
        } else {
          const contentState = convertFromRaw(JSON.parse(contentStateString))
          const plainText = contentState
            .getBlocksAsArray()
            .map((block) => block.getText())
            .join('\n')
          return plainText
        }
      },
      includeInExport: false,
    },
    {
      accessorKey: 'fourps_beneficiary',
      header: "4'ps Beneficiary",
      accessorFn: (row) => (parseInt(row.fourps_beneficiary) === 1 ? 'Yes' : 'No'),
      includeInExport: true,
    },
  ]

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target
    applicationDetailsForm.setFieldValue(name, value)

    if (name === 'scholarship_type') {
      addNewApplicationDetailsForm.setFieldValue('school', '')
      addNewApplicationDetailsForm.setFieldValue('strand', '')
      addNewApplicationDetailsForm.setFieldValue('course', '')
      addNewApplicationDetailsForm.setFieldValue('unit', '')
      setEndPoint((prevEndPoint) => {
        let updatedEndPoint = ''

        if (value === 'college') {
          updatedEndPoint = 'college_appno'
        } else if (value === 'tvet') {
          updatedEndPoint = 'tvet_appno'
        } else if (value === 'senior_high') {
          updatedEndPoint = 'shs_appno'
        }

        return updatedEndPoint
      })

      addNewApplicationDetailsForm.setFieldValue(name, value)
    }

    addNewApplicationDetailsForm.setFieldValue(name, value)

    if (name === 'fourps_beneficiary') {
      addNewApplicationDetailsForm.setFieldValue(name, checked)
      applicationDetailsForm.setFieldValue(name, checked)
    }
  }

  const handleSelectChange = (selectedOption, ref) => {
    applicationDetailsForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
    addNewApplicationDetailsForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  const applicationDetailsFormValidationSchema = Yup.object().shape({
    school: Yup.string().required('School is required'),
    strand: Yup.string().when('scholarship_type', {
      is: (value) => value === 'senior_high',
      then: (schema) => schema.required('Strand is required'),
      otherwise: (schema) => schema,
    }),
    course: Yup.string().when('scholarship_type', {
      is: (value) => value === 'college',
      then: (schema) => schema.required('Course is required'),
    }),
    tvetCourse: Yup.string().when('scholarship_type', {
      is: (value) => value === 'tvet',
      then: (schema) => schema.required('Course is required'),
      otherwise: (schema) => schema,
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
      tvetCourse: '',
      unit: '',
      hourNumber: '',
      grade_level: '',
      year_level: '',
      semester: '',
      school_year: '',
      availment: '',
      app_status: '',
      reason: '',
      fourps_beneficiary: true,
    },
    validationSchema: applicationDetailsFormValidationSchema,
    onSubmit: async (values) => {
      const contentState = convertToRaw(values.reason.getCurrentContent())
      const contentStateString = JSON.stringify(contentState)
      const updatedValues = { ...values, reason: JSON.parse(contentStateString) }

      setOperationLoading(true)
      await api
        .put('applicant/update_applicant_details/' + values.id, updatedValues)
        .then((response) => {
          fetchApplicationDetails()
          toast.success(response.data.message)
          setApplicationDetailsEditModalVisible(false)

          // reset form
          applicationDetailsForm.resetForm()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setOperationLoading(false)
        })
    },
  })

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState) // Update the local state with the new EditorState

    applicationDetailsForm.setFieldValue('reason', editorState)
  }
  const addNewApplicationDetailsFormValidationSchema = Yup.object().shape({
    school: Yup.string().required('School is required'),
    strand: Yup.string().when('scholarship_type', {
      is: (value) => value === 'senior_high',
      then: (schema) => schema.required('Strand is required'),
      otherwise: (schema) => schema,
    }),
    course: Yup.string().when('scholarship_type', {
      is: (value) => value === 'college',
      then: (schema) => schema.required('Course is required'),
    }),
    tvetCourse: Yup.string().when('scholarship_type', {
      is: (value) => value === 'tvet',
      then: (schema) => schema.required('Course is required'),
      otherwise: (schema) => schema,
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
  })

  // form used to add application details for applicant
  const addNewApplicationDetailsForm = useFormik({
    initialValues: {
      lastname: '',
      firstname: '',
      middlename: '',
      reference_number: '',
      scholarship_id: '',
      scholarship_type: 'senior_high',
      school: '',
      strand: '',
      course: '',
      tvetCourse: '',
      unit: '',
      hourNumber: '',
      grade_level: '',
      year_level: '',
      availment: '',
      fourps_beneficiary: false,
    },
    validationSchema: addNewApplicationDetailsFormValidationSchema,
    onSubmit: async (values) => {
      setOperationLoading(true)
      await api
        .post('applicant/insert', values)
        .then((response) => {
          toast.success(response.data.message)
          setApplicationDetailsModalVisible(false)
          fetchApplicationDetails()
          // reset form
          addNewApplicationDetailsForm.resetForm()
        })
        .catch((error) => {
          toast.error('Application already exist!')
        })
        .finally(async () => {
          await queryClient.invalidateQueries({ queryKey: ['seniorHighDataPending'] })
          await queryClient.invalidateQueries({ queryKey: ['collegeDataPending'] })
          await queryClient.invalidateQueries({ queryKey: ['tvetDataPending'] })
          setOperationLoading(false)
        })
    },
  })

  return (
    <>
      <MaterialReactTable
        columns={column}
        data={applicationDetails}
        enableColumnActions={false}
        enablePagination={false}
        enableDensityToggle={false}
        enableColumnFilterModes={false}
        enableColumnResizing={false}
        enableFullScreenToggle={false}
        enableColumnFilters={false}
        enableGlobalFilterModes={false}
        enableSorting={false}
        state={{
          isLoading: fetchApplicationDetailsLoading,
          isSaving: fetchApplicationDetailsLoading,
          showLoadingOverlay: fetchApplicationDetailsLoading,
          showProgressBars: fetchApplicationDetailsLoading,
          showSkeletons: fetchApplicationDetailsLoading,
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
        enableGrouping={false}
        enableStickyHeader
        enableStickyFooter
        initialState={{
          density: 'compact',
          pagination: { pageSize: 20 },
          columnPinning: {
            left: ['mrt-row-actions'],
          },
        }}
        enableRowActions
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
            <Tooltip title="Edit">
              <IconButton
                color="warning"
                onClick={() => {
                  if (row.original.scholarship_type === 'Senior High') {
                    applicationDetailsForm.setFieldValue('scholarship_type', 'senior_high')
                    applicationDetailsForm.setFieldValue('school', row.original.school_id)
                    applicationDetailsForm.setFieldValue('strand', row.original.course_id)
                    applicationDetailsForm.setFieldValue('grade_level', row.original.year_level)
                  } else if (row.original.scholarship_type === 'College') {
                    applicationDetailsForm.setFieldValue('scholarship_type', 'college')
                    applicationDetailsForm.setFieldValue('school', row.original.school_id)
                    applicationDetailsForm.setFieldValue('course', row.original.course_id)
                    applicationDetailsForm.setFieldValue('unit', row.original.unit)
                    applicationDetailsForm.setFieldValue('year_level', row.original.year_level)
                  } else if (row.original.scholarship_type === 'Tvet') {
                    applicationDetailsForm.setFieldValue('scholarship_type', 'tvet')
                    applicationDetailsForm.setFieldValue('school', row.original.school_id)
                    applicationDetailsForm.setFieldValue('tvetCourse', row.original.course_id)
                    applicationDetailsForm.setFieldValue('hourNumber', row.original.unit)
                  }
                  applicationDetailsForm.setFieldValue(
                    'fourps_beneficiary',
                    parseInt(row.original.fourps_beneficiary) === 1 ? true : false,
                  )
                  applicationDetailsForm.setFieldValue('app_status', row.original.app_status)
                  applicationDetailsForm.setFieldValue('id', row.original.id)
                  applicationDetailsForm.setFieldValue('school_year', row.original.school_year)
                  applicationDetailsForm.setFieldValue(
                    'app_year_number',
                    row.original.app_year_number,
                  )
                  applicationDetailsForm.setFieldValue(
                    'app_sem_number',
                    row.original.app_sem_number,
                  )
                  applicationDetailsForm.setFieldValue('app_id_number', row.original.app_id_number)

                  applicationDetailsForm.setFieldValue('semester', row.original.semester)
                  applicationDetailsForm.setFieldValue('availment', row.original.availment)
                  const contentStateString = row.original.reason

                  if (contentStateString === null) {
                    setEditorState(EditorState.createEmpty())
                    applicationDetailsForm.setFieldValue('reason', EditorState.createEmpty())
                  } else {
                    const contentState = convertFromRaw(JSON.parse(contentStateString))
                    const editorState = EditorState.createWithContent(contentState)
                    setEditorState(editorState)
                    applicationDetailsForm.setFieldValue('reason', editorState)
                  }

                  setApplicationDetailsEditModalVisible(true)
                }}
              >
                <EditSharp />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={({ row, table }) => (
          <>
            {hasNewRecordButton && (
              <Button
                color="primary"
                variant="contained"
                shape="rounded" // Shape should be "rounded"
                style={{ fontSize: 12, borderRadius: 50 }}
                onClick={() => {
                  setApplicationDetailsModalVisible(true)

                  addNewApplicationDetailsForm.resetForm()

                  addNewApplicationDetailsForm.setFieldValue('scholarship_id', scholarshipId)

                  setEndPoint('shs_appno')
                }}
              >
                <FontAwesomeIcon style={{ marginRight: 5 }} icon={faPlus} /> Add New Record
              </Button>
            )}
          </>
        )}
      />
      <>
        <CModal
          size="lg"
          alignment="center"
          backdrop="static"
          visible={applicationDetailsEditModalVisible}
          onClose={() => setApplicationDetailsEditModalVisible(false)}
        >
          <CModalHeader onClose={() => setApplicationDetailsEditModalVisible(false)}>
            <CModalTitle>Update Applicant Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <>
              <CForm
                id="form"
                className="row g-3 needs-validation"
                noValidate
                onSubmit={applicationDetailsForm.handleSubmit}
              >
                <CRow className="justify-content-between my-1">
                  <CCol md={7} sm={6} xs={6} lg={8} xl={4}>
                    <CFormLabel>
                      {
                        <>
                          {fetchApplicationDetailsLoading && <CSpinner size="sm" />}
                          {requiredField(' Application Number')}
                        </>
                      }
                    </CFormLabel>
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
                <CRow className="my-1">
                  <CCol md={12}>
                    <CFormCheck
                      id="fourps_beneficiary"
                      name="fourps_beneficiary"
                      value={applicationDetailsForm.values.fourps_beneficiary}
                      onChange={handleInputChange}
                      checked={applicationDetailsForm.values.fourps_beneficiary ? true : false}
                      label="4p's Beneficiary"
                    />
                  </CCol>
                </CRow>
                <CRow className="my-1">
                  {/* if senior high */}
                  {applicationDetailsForm.values.scholarship_type === 'senior_high' && (
                    <>
                      <CCol md={8}>
                        <CFormLabel>
                          {
                            <>
                              {seniorHighSchool.isLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectSeniorHighSchoolInputRef}
                          value={
                            !seniorHighSchool.isLoading &&
                            seniorHighSchool.data?.find(
                              (option) => option.value === applicationDetailsForm.values.school,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!seniorHighSchool.isLoading && seniorHighSchool.data}
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
                              {strand.isLoading && <CSpinner size="sm" />}
                              {requiredField(' Strand')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectStrandInputRef}
                          value={
                            !strand.isLoading &&
                            strand.data?.find(
                              (option) => option.value === applicationDetailsForm.values.strand,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!strand.isLoading && strand.data}
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
                      <CCol md={6}>
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
                      <CCol md={6}>
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
                    </>
                  )}

                  {applicationDetailsForm.values.scholarship_type === 'college' && (
                    <>
                      <CCol md={5}>
                        <CFormLabel>
                          {
                            <>
                              {collegeSchool.isLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectCollegeSchoolInputRef}
                          value={
                            !collegeSchool.isLoading &&
                            collegeSchool.data?.find(
                              (option) => option.value === applicationDetailsForm.values.school,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!collegeSchool.isLoading && collegeSchool.data}
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
                              {course.isLoading && <CSpinner size="sm" />}
                              {requiredField(' Course')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectCourseInputRef}
                          value={
                            !course.isLoading &&
                            course.data?.find(
                              (option) => option.value === applicationDetailsForm.values.course,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!course.isLoading && course.data}
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
                      <CCol md={6}>
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
                      <CCol md={6}>
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
                    </>
                  )}

                  {applicationDetailsForm.values.scholarship_type === 'tvet' && (
                    <>
                      <CCol md={5}>
                        <CFormLabel>
                          {
                            <>
                              {tvetSchool.isLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectTvetCourseInputRef}
                          value={
                            !tvetSchool.isLoading &&
                            tvetSchool.data?.find(
                              (option) => option.value === applicationDetailsForm.values.school,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!tvetSchool.isLoading && tvetSchool.data}
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
                              {tvetCourse.isLoading && <CSpinner size="sm" />}
                              {requiredField(' Course')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectTvetCourseInputRef}
                          value={
                            !tvetCourse.isLoading &&
                            tvetCourse.data?.find(
                              (option) => option.value === applicationDetailsForm.values.tvetCourse,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!tvetCourse.isLoading && tvetCourse.data}
                          name="tvetCourse"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {applicationDetailsForm.touched.tvetCourse &&
                          applicationDetailsForm.errors.tvetCourse && (
                            <CFormText className="text-danger">
                              {applicationDetailsForm.errors.tvetCourse}
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
                    </>
                  )}
                </CRow>

                <CRow className="my-1">
                  <CCol md={12}>
                    <CFormLabel>Notes (optional)</CFormLabel>
                    <Editor
                      editorState={editorState}
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      editorStyle={{ height: 200, paddingLeft: 5, lineHeight: 0.1 }}
                      wrapperStyle={{ border: '.5px solid #F1F6F9' }}
                      onEditorStateChange={onEditorStateChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-4">
                  <div className="d-grid gap-2">
                    <CButton shape="rounded-pill" color="primary" type="submit">
                      Update Details
                    </CButton>
                  </div>
                </CRow>
              </CForm>
            </>
            {operationLoading && <DefaultLoading />}
          </CModalBody>
        </CModal>
      </>

      <>
        <CModal
          size="lg"
          alignment="center"
          backdrop="static"
          visible={applicationDetailsModalVisible}
          onClose={() => setApplicationDetailsModalVisible(false)}
        >
          <CModalHeader onClose={() => setApplicationDetailsModalVisible(false)}>
            <CModalTitle>Add New Record</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <>
              <CForm
                className="row g-3  "
                style={{ position: 'relative' }}
                onSubmit={addNewApplicationDetailsForm.handleSubmit}
              >
                <CRow className="my-2">
                  <CCol md={6}>
                    <CFormSelect
                      label={requiredField('Scholarship Type')}
                      name="scholarship_type"
                      onChange={handleInputChange}
                      value={addNewApplicationDetailsForm.values.scholarship_type}
                      required
                    >
                      <option value="senior_high">Senior High</option>
                      <option value="college">College</option>
                      <option value="tvet">TVET</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="justify-content-between my-1">
                  <CCol md={7} sm={6} xs={6} lg={8} xl={4}>
                    <CFormLabel>
                      {
                        <>
                          {fetchApplicationDetailsLoading && <CSpinner size="sm" />}
                          {requiredField(' Application Number')}
                        </>
                      }
                    </CFormLabel>
                    <h4 className="text-danger text-decoration-underline">
                      <ApplicationYearNumber endPointType={endPoint} />-
                      <ApplicationSemNumber endPointType={endPoint} />-
                      <ApplicationIDNumber endPointType={endPoint} />
                    </h4>

                    <CInputGroup className="mb-3 ">
                      <CFormInput
                        type="hidden"
                        name="app_year_number"
                        onChange={handleInputChange}
                        value={addNewApplicationDetailsForm.values.app_year_number}
                        className="text-center"
                        placeholder="Year"
                        aria-label="Year"
                        required
                      />
                      <CFormInput
                        type="hidden"
                        name="app_sem_number"
                        onChange={handleInputChange}
                        value={addNewApplicationDetailsForm.values.app_sem_number}
                        className="text-center "
                        placeholder="Semester"
                        aria-label="Sem"
                        required
                      />
                      <CFormInput
                        type="hidden"
                        name="app_id_number"
                        onChange={handleInputChange}
                        value={addNewApplicationDetailsForm.values.app_id_number}
                        className="text-center"
                        placeholder="App No"
                        aria-label="App No"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Application Status</CFormLabel>
                    <h4 className="text-danger text-decoration-underline">Pending</h4>
                  </CCol>
                </CRow>
                <CRow className="my-1">
                  <CCol md={12}>
                    <CFormCheck
                      id="fourps_beneficiary"
                      name="fourps_beneficiary"
                      value={addNewApplicationDetailsForm.values.fourps_beneficiary}
                      onChange={handleInputChange}
                      checked={
                        addNewApplicationDetailsForm.values.fourps_beneficiary ? true : false
                      }
                      label="4p's Beneficiary"
                    />
                  </CCol>
                </CRow>
                <CRow className="my-1">
                  {/* if senior high */}
                  {addNewApplicationDetailsForm.values.scholarship_type === 'senior_high' && (
                    <>
                      <CCol md={8}>
                        <CFormLabel>
                          {
                            <>
                              {seniorHighSchool.isLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectSeniorHighSchoolInputRef}
                          value={
                            !seniorHighSchool.isLoading &&
                            seniorHighSchool.data?.find(
                              (option) =>
                                option.value === addNewApplicationDetailsForm.values.school,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!seniorHighSchool.isLoading && seniorHighSchool.data}
                          name="school"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.school &&
                          addNewApplicationDetailsForm.errors.school && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.school}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>
                          {
                            <>
                              {strand.isLoading && <CSpinner size="sm" />}
                              {requiredField(' Strand')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectStrandInputRef}
                          value={
                            !strand.isLoading &&
                            strand.data?.find(
                              (option) =>
                                option.value === addNewApplicationDetailsForm.values.strand,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!strand.isLoading && strand.data}
                          name="strand"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.strand &&
                          addNewApplicationDetailsForm.errors.strand && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.strand}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )}

                  {addNewApplicationDetailsForm.values.scholarship_type === 'college' && (
                    <>
                      <CCol md={5}>
                        <CFormLabel>
                          {
                            <>
                              {collegeSchool.isLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectCollegeSchoolInputRef}
                          value={
                            !collegeSchool.isLoading &&
                            collegeSchool.data?.find(
                              (option) =>
                                option.value === addNewApplicationDetailsForm.values.collegeSchool,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!collegeSchool.isLoading && collegeSchool.data}
                          name="school"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.school &&
                          addNewApplicationDetailsForm.errors.school && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.school}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>
                          {
                            <>
                              {course.isLoading && <CSpinner size="sm" />}
                              {requiredField(' Course')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectCourseInputRef}
                          value={
                            !course.isLoading &&
                            course.data?.find(
                              (option) =>
                                option.value === addNewApplicationDetailsForm.values.course,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!course.isLoading && course.data}
                          name="course"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.course &&
                          addNewApplicationDetailsForm.errors.course && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.course}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={3}>
                        <CFormInput
                          type="number"
                          label={requiredField('Unit')}
                          name="unit"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.unit}
                          required
                        />
                        {addNewApplicationDetailsForm.touched.unit &&
                          addNewApplicationDetailsForm.errors.unit && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.unit}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )}
                  {addNewApplicationDetailsForm.values.scholarship_type === 'tvet' && (
                    <>
                      <CCol md={4}>
                        <CFormLabel>
                          {
                            <>
                              {tvetSchool.isLoading && <CSpinner size="sm" />}
                              {requiredField(' School')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectTvetCourseInputRef}
                          value={
                            !tvetSchool.isLoading &&
                            tvetSchool.data?.find(
                              (option) =>
                                option.value === addNewApplicationDetailsForm.values.tvetSchool,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!tvetSchool.isLoading && tvetSchool.data}
                          name="school"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.school &&
                          addNewApplicationDetailsForm.errors.school && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.school}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>
                          {
                            <>
                              {tvetCourse.isLoading && <CSpinner size="sm" />}
                              {requiredField(' Course')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectTvetCourseInputRef}
                          value={
                            !tvetCourse.isLoading &&
                            tvetCourse.data?.find(
                              (option) =>
                                option.value === addNewApplicationDetailsForm.values.tvetCourse,
                            )
                          }
                          onChange={handleSelectChange}
                          options={!tvetCourse.isLoading && tvetCourse.data}
                          name="tvetCourse"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {addNewApplicationDetailsForm.touched.tvetCourse &&
                          addNewApplicationDetailsForm.errors.tvetCourse && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.tvetCourse}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={2}>
                        <CFormInput
                          type="number"
                          label={requiredField('No. of days')}
                          name="hourNumber"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.hourNumber}
                          required
                        />
                        {addNewApplicationDetailsForm.touched.hourNumber &&
                          addNewApplicationDetailsForm.errors.hourNumber && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.hourNumber}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={2}>
                        <CFormInput
                          type="number"
                          label={requiredField('Availment')}
                          name="availment"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.availment}
                          required
                        />
                        {addNewApplicationDetailsForm.touched.availment &&
                          addNewApplicationDetailsForm.errors.availment && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.availment}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )}
                </CRow>

                <CRow className="my-1">
                  {addNewApplicationDetailsForm.values.scholarship_type === 'senior_high' && (
                    <>
                      <CCol md={6}>
                        <CFormSelect
                          label={requiredField('Grade Level')}
                          name="grade_level"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.grade_level}
                          required
                        >
                          <option value="">Select</option>
                          {GradeLevel.map((grade_level, index) => (
                            <option key={index} value={grade_level}>
                              {grade_level}
                            </option>
                          ))}
                        </CFormSelect>

                        {addNewApplicationDetailsForm.touched.grade_level &&
                          addNewApplicationDetailsForm.errors.grade_level && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.grade_level}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="number"
                          label={requiredField('Availment')}
                          name="availment"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.availment}
                          required
                        />
                        {addNewApplicationDetailsForm.touched.availment &&
                          addNewApplicationDetailsForm.errors.availment && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.availment}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )}

                  {addNewApplicationDetailsForm.values.scholarship_type === 'college' && (
                    <>
                      <CCol md={6}>
                        <CFormSelect
                          label={requiredField('Year Level')}
                          name="year_level"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.year_level}
                          required
                        >
                          <option value="">Select</option>
                          {YearLevel.map((year_level, index) => (
                            <option key={index} value={year_level}>
                              {year_level}
                            </option>
                          ))}
                        </CFormSelect>
                        {addNewApplicationDetailsForm.touched.year_level &&
                          addNewApplicationDetailsForm.errors.year_level && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.year_level}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="number"
                          label={requiredField('Availment')}
                          name="availment"
                          onChange={handleInputChange}
                          value={addNewApplicationDetailsForm.values.availment}
                          required
                        />
                        {addNewApplicationDetailsForm.touched.availment &&
                          addNewApplicationDetailsForm.errors.availment && (
                            <CFormText className="text-danger">
                              {addNewApplicationDetailsForm.errors.availment}
                            </CFormText>
                          )}
                      </CCol>
                    </>
                  )}
                </CRow>

                <CRow className="mt-4">
                  <div className="d-grid gap-2">
                    <CButton color="primary" type="submit">
                      Submit
                    </CButton>
                  </div>
                </CRow>
              </CForm>
              {operationLoading && <DefaultLoading />}
            </>
          </CModalBody>
        </CModal>
      </>
    </>
  )
}

export default ScholarshipHistory

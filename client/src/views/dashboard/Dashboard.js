import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormSelect,
  CFormText,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEye, faFilter, faHashtag } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { CChart, CChartBar } from '@coreui/react-chartjs'
import { jwtDecode } from 'jwt-decode'
import 'animate.css'
import {
  SchoolYear,
  Semester,
  api,
  requiredField,
  RequiredFieldNote,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import CountUp from 'react-countup'
import { Skeleton } from '@mui/material'
import 'intro.js/introjs.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import OnlineUser from './OnlineUser'

const Dashboard = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [activeKey, setActiveKey] = useState(1)
  const [activeGenderKey, setActiveGenderKey] = useState(1)
  const [user, setUser] = useState([])
  const [refetchInterval, setRefetchInterval] = useState(true)
  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem('scholarshipToken')))
  }, [])

  const totalApplicants = useQuery({
    queryFn: async () =>
      await Promise.all([
        api.get('senior_high/total'),
        api.get('college/total'),
        api.get('tvet/total'),
      ]).then((responses) => {
        const response = responses.map((response) => response.data)
        return {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
      }),
    queryKey: ['totalApplicants'],
    refetchInterval: refetchInterval ? 1000 : false,
    staleTime: Infinity,
  })
  const totalApplicantsStatus = useQuery({
    queryFn: async () =>
      await Promise.all([
        api.get('senior_high/total_status'),
        api.get('college/total_status'),
        api.get('tvet/total_status'),
      ]).then((responses) => {
        const response = responses.map((response) => response.data)
        return response
      }),
    queryKey: ['totalApplicantsStatus'],
    refetchInterval: refetchInterval ? 1000 : false,
    staleTime: Infinity,
  })

  const fourPsBeneficiary = useQuery({
    queryFn: async () =>
      await Promise.all([
        api.get('senior_high/get_fourps_beneficiary'),
        api.get('college/get_fourps_beneficiary'),
        api.get('tvet/get_fourps_beneficiary'),
      ]).then((responses) => {
        const response = responses.map((response) => response.data)

        return {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
      }),
    queryKey: ['fourPsBeneficiary'],
    refetchInterval: refetchInterval ? 1000 : false,
    refetchIntervalInBackground: true,
  })

  const applicationGender = useQuery({
    queryFn: async () =>
      await Promise.all([
        api.get('senior_high/get_data_by_gender'),
        api.get('college/get_data_by_gender'),
        api.get('tvet/get_data_by_gender'),
      ]).then((responses) => {
        const response = responses.map((response) => response.data)

        return {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
      }),
    queryKey: ['applicationGender'],
    refetchInterval: refetchInterval ? 1000 : false,
    staleTime: Infinity,
  })

  const applicationStatusBarangay = useQuery({
    queryFn: async () =>
      await Promise.all([
        api.get('senior_high/get_status_by_barangay'),
        api.get('college/get_status_by_barangay'),
        api.get('tvet/get_status_by_barangay'),
      ]).then((responses) => {
        const response = responses.map((response) => response.data)

        return {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
      }),
    queryKey: ['applicationStatusBarangay'],
    refetchInterval: refetchInterval ? 1000 : false,
    staleTime: Infinity,
  })

  const handleRemoveFilter = async () => {
    filterForm.resetForm()
    await queryClient.invalidateQueries()
  }
  const allTotalApplicants = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/all_total'),
        api.get('college/all_total'),
        api.get('tvet/all_total'),
      ])
    },
    onSuccess: async (responses) => {
      const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
        (response) => response.data,
      )

      await queryClient.setQueryData(['totalApplicants'], {
        senior_high: responseSeniorHigh,
        college: responseCollege,
        tvet: responseTvet,
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const allTotalApplicantsStatus = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/all_total_status'),
        api.get('college/all_total_status'),
        api.get('tvet/all_total_status'),
      ])
    },
    onSuccess: async (responses) => {
      const newData = responses.map((response) => response.data)

      await queryClient.setQueryData(['totalApplicantsStatus'], newData)
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const allFourPsBeneficiary = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/all_fourps_beneficiary'),
        api.get('college/all_fourps_beneficiary'),
        api.get('tvet/all_fourps_beneficiary'),
      ])
    },
    onSuccess: async (responses) => {
      const response = responses.map((response) => response.data)

      await queryClient.setQueryData(['fourPsBeneficiary'], {
        senior_high: response[0],
        college: response[1],
        tvet: response[2],
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const allApplicationGender = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/all_gender'),
        api.get('college/all_gender'),
        api.get('tvet/all_gender'),
      ])
    },
    onSuccess: async (responses) => {
      const response = responses.map((response) => response.data)

      await queryClient.setQueryData(['applicationGender'], {
        senior_high: response[0],
        college: response[1],
        tvet: response[2],
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const allApplicationStatusBarangay = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/all_status_by_barangay'),
        api.get('college/all_status_by_barangay'),
        api.get('tvet/all_status_by_barangay'),
      ])
    },
    onSuccess: async (responses) => {
      const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
        (response) => response.data,
      )

      await queryClient.setQueryData(['applicationStatusBarangay'], {
        senior_high: responseSeniorHigh,
        college: responseCollege,
        tvet: responseTvet,
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const handleViewAllData = async () => {
    try {
      filterForm.resetForm()
      setRefetchInterval(false)
      await allTotalApplicants.mutate()
      await allTotalApplicantsStatus.mutate()
      await allFourPsBeneficiary.mutate()
      await allApplicationGender.mutate()
      await allApplicationStatusBarangay.mutate()
    } catch (err) {
      console.error(err.response.data)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    filterForm.setFieldValue(name, value)
  }
  const filterFormValidationSchema = Yup.object().shape({
    semester: Yup.string().required('Semester is required'),
    school_year: Yup.string().required('School Year is required'),
  })

  const filterTotalApplicants = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/filter_total', { params: values }),
        api.get('college/filter_total', { params: values }),
        api.get('tvet/filter_total', { params: values }),
      ])
    },
    onSuccess: async (responses) => {
      const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
        (response) => response.data,
      )

      await queryClient.setQueryData(['totalApplicants'], {
        senior_high: responseSeniorHigh,
        college: responseCollege,
        tvet: responseTvet,
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const filterTotalApplicantsStatus = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/filter_total_status', { params: values }),
        api.get('college/filter_total_status', { params: values }),
        api.get('tvet/filter_total_status', { params: values }),
      ])
    },
    onSuccess: async (responses) => {
      const newData = responses.map((response) => response.data)
      await queryClient.setQueryData(['totalApplicantsStatus'], newData)
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const filterFourPsBeneficiary = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/filter_total_status', { params: values }),
        api.get('college/filter_total_status', { params: values }),
        api.get('tvet/filter_total_status', { params: values }),
      ])
    },
    onSuccess: async (responses) => {
      const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
        (response) => response.data,
      )
      await queryClient.setQueryData(['fourPsBeneficiary'], {
        senior_high: responseSeniorHigh,
        college: responseCollege,
        tvet: responseTvet,
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const filterApplicationGender = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/get_data_by_gender', { params: values }),
        api.get('college/get_data_by_gender', { params: values }),
        api.get('tvet/get_data_by_gender', { params: values }),
      ])
    },
    onSuccess: async (responses) => {
      const response = responses.map((response) => response.data)
      await queryClient.setQueryData(['applicationGender'], {
        senior_high: response[0],
        college: response[1],
        tvet: response[2],
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const filterApplicationStatusBarangay = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.get('senior_high/filter_status_by_barangay', { params: values }),
        api.get('college/filter_status_by_barangay', { params: values }),
        api.get('tvet/filter_status_by_barangay', { params: values }),
      ])
    },
    onSuccess: async (responses) => {
      const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
        (response) => response.data,
      )
      await queryClient.setQueryData(['applicationStatusBarangay'], {
        senior_high: responseSeniorHigh,
        college: responseCollege,
        tvet: responseTvet,
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const filterForm = useFormik({
    initialValues: {
      semester: '',
      school_year: '',
    },
    validationSchema: filterFormValidationSchema,
    onSubmit: async (values) => {
      await filterTotalApplicants.mutate(values)
      await filterTotalApplicantsStatus.mutate(values)
      await filterFourPsBeneficiary.mutate(values)
      await filterApplicationGender.mutate(values)
      await filterApplicationStatusBarangay.mutate(values)
    },
  })

  function getRandomPercentage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min + '%'
  }

  return (
    <>
      <ToastContainer />
      <h5>Welcome {user.firstname},</h5>

      <CRow className="justify-content-center mt-2">
        <CCol md={12}>
          <CCard className="mb-4" id="filter">
            <CCardHeader>{cardTitle}</CCardHeader>
            <CCardBody>
              <h5>
                <FontAwesomeIcon icon={faFilter} />
                Filter
              </h5>
              <CForm className="row g-3 needs-validation mb-4" onSubmit={filterForm.handleSubmit}>
                <RequiredFieldNote />

                <CRow className="my-1">
                  <CCol md={6}>
                    <CFormSelect
                      label={requiredField('Semester')}
                      name="semester"
                      onChange={handleInputChange}
                      value={filterForm.values.semester}
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
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveFilter}
                    >
                      <FontAwesomeIcon icon={faCancel} /> Remove Filter
                    </CButton>
                    <CButton
                      size="sm"
                      variant="outline"
                      color="primary"
                      onClick={handleViewAllData}
                    >
                      <FontAwesomeIcon icon={faEye} /> View All Data
                    </CButton>
                    <CButton color="primary" size="sm" type="submit">
                      <FontAwesomeIcon icon={faFilter} /> Filter
                    </CButton>
                  </div>
                </CRow>
              </CForm>

              {/* {loadingOperation && <WidgetLoading />} */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        {totalApplicants.isLoading ||
        allTotalApplicants.isPending ||
        filterTotalApplicants.isPending
          ? [...Array(3)].map((_, index) => (
              <CCol key={index}>
                <div className="card mb-3" style={{ borderRadius: '10px' }}>
                  <div className="card-body d-flex align-items-center p-0">
                    <div className="me-3 text-white bg-transparent p-4">
                      <Skeleton variant="circular" height={55} width={55} />
                    </div>
                    <div>
                      <div
                        className="fs-6 fw-semibold text-transparent"
                        style={{ marginBottom: -10 }}
                      >
                        <p>
                          <Skeleton variant="rectangular" width={30} />
                        </p>
                      </div>
                      <div className="text-medium-emphasis text-uppercase fw-semibold small">
                        <p>
                          <Skeleton variant="rectangular" width={100} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CCol>
            ))
          : Object.entries(totalApplicants.data).map(([key, value], index) => (
              <CCol key={index}>
                <div className="card mb-3" style={{ borderRadius: '10px' }}>
                  <div className="card-body d-flex align-items-center p-0">
                    <div className="me-3 text-white bg-transparent p-4">
                      <lord-icon
                        src="https://cdn.lordicon.com/zsaomnmb.json"
                        trigger="hover"
                        colors="primary:#e8308c,secondary:#2516c7,tertiary:#109121,quaternary:#3a3347"
                        style={{ width: '50px', height: '50px' }}
                      ></lord-icon>
                    </div>
                    <div>
                      <div
                        className="fs-6 fw-semibold text-transparent"
                        style={{ marginBottom: -10 }}
                      >
                        <p>
                          <CountUp end={value} />
                        </p>
                      </div>
                      <div className="text-medium-emphasis text-uppercase fw-semibold small">
                        <p>{key.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CCol>
            ))}
      </CRow>
      <CRow>
        <CCol id="totalStatusData">
          <CTable responsive>
            {totalApplicantsStatus.isLoading ||
            allTotalApplicantsStatus.isPending ||
            filterTotalApplicantsStatus.isPending ? (
              <>
                <CTableHead>
                  <CTableRow>
                    {[...Array(6)].map((_, index) => (
                      <CTableHeaderCell key={index} scope="row">
                        <Skeleton
                          variant="rounded"
                          width={index === 0 ? '100%' : '60%'}
                          style={{ backgroundColor: 'rgba(0, 0, 0, 0.11)', margin: 'auto' }}
                        />
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {[...Array(4)].map((_, indexRow) => (
                    <CTableRow key={indexRow}>
                      {[...Array(6)].map((_, index) => (
                        <CTableDataCell key={index} style={{ padding: 5 }}>
                          <Skeleton
                            variant="rounded"
                            width={index === 0 ? '60%' : '30%'}
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.11)', margin: 'auto' }}
                          />
                        </CTableDataCell>
                      ))}
                    </CTableRow>
                  ))}
                </CTableBody>
              </>
            ) : (
              <>
                <CTableHead>
                  <CTableRow className="text-center">
                    <CTableHeaderCell scope="col">Scholarship Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Approved</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Pending</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Disapproved</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Archived</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Voided</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {!totalApplicantsStatus.isLoading &&
                    totalApplicantsStatus.data.map((item, index) => (
                      <CTableRow key={index} className="text-center">
                        <CTableHeaderCell scope="col">{item.type}</CTableHeaderCell>
                        <CTableDataCell>
                          <CountUp end={item.approved} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CountUp end={item.pending} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CountUp end={item.disapproved} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CountUp end={item.archived} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CountUp end={item.void} />
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </>
            )}
          </CTable>
        </CCol>
      </CRow>
      <CRow>
        {fourPsBeneficiary.isLoading ||
        allFourPsBeneficiary.isPending ||
        filterFourPsBeneficiary.isPending ? (
          <>
            <h5>
              <Skeleton variant="rounded" width={170} />
            </h5>
            {[...Array(3)].map((_, index) => (
              <CCol key={index}>
                <div className="card mb-3" style={{ borderRadius: '10px' }}>
                  <div className="card-body d-flex align-items-center p-0">
                    <div className="me-3   bg-transparent p-4">
                      <Skeleton variant="rounded" height={55} width={55} />
                    </div>
                    <div>
                      <div
                        className="fs-6 fw-semibold text-transparent"
                        style={{ marginBottom: -10 }}
                      >
                        <p>
                          <Skeleton variant="rounded" width={30} />
                        </p>
                      </div>
                      <div className="text-medium-emphasis text-uppercase fw-semibold small">
                        <p>
                          <Skeleton variant="rounded" width={100} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CCol>
            ))}
          </>
        ) : (
          <>
            <h5>
              <h5>4&apos;Ps Beneficiary</h5>
            </h5>
            {Object.entries(fourPsBeneficiary.data).map(([key, value], index) => (
              <CCol key={index}>
                <div className="card mb-3" style={{ borderRadius: '10px' }}>
                  <div className="card-body d-flex align-items-center p-0">
                    <div className="me-3   bg-primary text-white p-4">
                      <FontAwesomeIcon icon={faHashtag} style={{ height: 35 }} />
                    </div>
                    <div>
                      <div
                        className="fs-6 fw-semibold text-transparent"
                        style={{ marginBottom: -20 }}
                      >
                        <p>
                          <CountUp end={value} />
                        </p>
                      </div>
                      <div className="text-medium-emphasis text-uppercase fw-semibold small">
                        <p>{key.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CCol>
            ))}
          </>
        )}
      </CRow>
      <CRow className="justify-content-center mb-4">
        <CCol md={12}>
          <CCard id="chart">
            <CCardBody>
              <h5>
                {applicationGender.isLoading ||
                allApplicationGender.isPending ||
                filterApplicationGender.isPending ? (
                  <Skeleton variant="rounded" width={170} />
                ) : (
                  'Gender Statistics'
                )}
              </h5>
              <CNav variant="pills" layout="justified">
                <CNavItem role="presentation">
                  {applicationGender.isLoading ||
                  allApplicationGender.isPending ||
                  filterApplicationGender.isPending ? (
                    <CNavItem className="nav-item px-3" role="presentation">
                      <Skeleton variant="rounded" height={40} />
                    </CNavItem>
                  ) : (
                    <CNavLink
                      active={activeGenderKey === 1}
                      component="button"
                      role="tab"
                      aria-controls="senior-high-gender-tab-pane"
                      aria-selected={activeGenderKey === 1}
                      onClick={() => {
                        setActiveGenderKey(1)
                        toast.dismiss()
                      }}
                    >
                      Senior High
                    </CNavLink>
                  )}
                </CNavItem>

                <CNavItem role="presentation">
                  {applicationGender.isLoading ||
                  allApplicationGender.isPending ||
                  filterApplicationGender.isPending ? (
                    <CNavItem className="nav-item px-3" role="presentation">
                      <Skeleton variant="rounded" height={40} />
                    </CNavItem>
                  ) : (
                    <CNavLink
                      active={activeGenderKey === 2}
                      component="button"
                      role="tab"
                      aria-controls="college-gender-tab-pane"
                      aria-selected={activeGenderKey === 2}
                      onClick={() => {
                        setActiveGenderKey(2)
                        toast.dismiss()
                      }}
                    >
                      College
                    </CNavLink>
                  )}
                </CNavItem>
                <CNavItem role="presentation">
                  {applicationGender.isLoading ||
                  allApplicationGender.isPending ||
                  filterApplicationGender.isPending ? (
                    <CNavItem className="nav-item px-3" role="presentation">
                      <Skeleton variant="rounded" height={40} />
                    </CNavItem>
                  ) : (
                    <CNavLink
                      active={activeGenderKey === 3}
                      component="button"
                      role="tab"
                      aria-controls="tvet-gender-tab-pane"
                      aria-selected={activeGenderKey === 3}
                      onClick={() => {
                        setActiveGenderKey(3)
                        toast.dismiss()
                      }}
                    >
                      Tvet
                    </CNavLink>
                  )}
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="senior-high-gender-tab-pane"
                  visible={activeGenderKey === 1}
                  style={{ position: 'relative' }}
                >
                  {applicationGender.isLoading ||
                  allApplicationGender.isPending ||
                  filterApplicationGender.isPending ? (
                    <>
                      <div className="d-grid gap-2 d-md-flex justify-content-center mt-2">
                        <Skeleton variant="rounded" width={90} height={15} />
                        <Skeleton variant="rounded" width={90} height={15} />
                      </div>
                      <div className="d-grid gap-2 d-md-flex justify-content-center mt-3">
                        <Skeleton variant="circular" height={350} width={350} />
                      </div>
                    </>
                  ) : (
                    <CChart
                      className="mx-auto"
                      type="doughnut"
                      style={{ height: 400, width: 400 }}
                      data={{
                        labels: ['Male', 'Female'],
                        datasets: [
                          {
                            backgroundColor: ['#378CE7', '#FF5BAE'],
                            data: [
                              applicationGender.data.senior_high?.male,
                              applicationGender.data.senior_high?.female,
                            ],
                          },
                        ],
                      }}
                    />
                  )}
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="college-gender-tab-pane"
                  visible={activeGenderKey === 2}
                  style={{ position: 'relative' }}
                >
                  {applicationGender.isLoading ||
                  allApplicationGender.isPending ||
                  filterApplicationGender.isPending ? (
                    <>
                      <div className="d-grid gap-2 d-md-flex justify-content-center mt-2">
                        <Skeleton variant="rounded" width={90} height={15} />
                        <Skeleton variant="rounded" width={90} height={15} />
                      </div>
                      <div className="d-grid gap-2 d-md-flex justify-content-center mt-3">
                        <Skeleton variant="circular" height={350} width={350} />
                      </div>
                    </>
                  ) : (
                    <CChart
                      className="mx-auto"
                      type="doughnut"
                      style={{ height: 400, width: 400 }}
                      data={{
                        labels: ['Male', 'Female'],
                        datasets: [
                          {
                            backgroundColor: ['#378CE7', '#FF5BAE'],
                            data: [
                              applicationGender.data.college?.male,
                              applicationGender.data.college?.female,
                            ],
                          },
                        ],
                      }}
                    />
                  )}
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="tvet-gender-tab-pane"
                  visible={activeGenderKey === 3}
                  style={{ position: 'relative' }}
                >
                  {applicationGender.isLoading ||
                  allApplicationGender.isPending ||
                  filterApplicationGender.isPending ? (
                    <>
                      <div className="d-grid gap-2 d-md-flex justify-content-center mt-2">
                        <Skeleton variant="rounded" width={90} height={15} />
                        <Skeleton variant="rounded" width={90} height={15} />
                      </div>
                      <div className="d-grid gap-2 d-md-flex justify-content-center mt-3">
                        <Skeleton variant="circular" height={350} width={350} />
                      </div>
                    </>
                  ) : (
                    <CChart
                      className="mx-auto"
                      type="doughnut"
                      style={{ height: 400, width: 400 }}
                      data={{
                        labels: ['Male', 'Female'],
                        datasets: [
                          {
                            backgroundColor: ['#378CE7', '#FF5BAE'],
                            data: [
                              applicationGender.data.tvet?.male,
                              applicationGender.data.tvet?.female,
                            ],
                          },
                        ],
                      }}
                    />
                  )}
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="justify-content-center mt-4">
        <CCol md={12}>
          <CCard id="chart">
            <CCardBody>
              <CNav variant="pills" layout="justified">
                <CNavItem role="presentation">
                  {applicationStatusBarangay.isLoading ||
                  allApplicationStatusBarangay.isPending ||
                  filterApplicationStatusBarangay.isPending ? (
                    <CNavItem className="nav-item px-3" role="presentation">
                      <Skeleton variant="rounded" height={40} />
                    </CNavItem>
                  ) : (
                    <CNavLink
                      active={activeKey === 1}
                      component="button"
                      role="tab"
                      aria-controls="senior-high-tab-pane"
                      aria-selected={activeKey === 1}
                      onClick={() => {
                        setActiveKey(1)
                        toast.dismiss()
                      }}
                    >
                      Senior High
                    </CNavLink>
                  )}
                </CNavItem>
                <CNavItem role="presentation">
                  {applicationStatusBarangay.isLoading ||
                  allApplicationStatusBarangay.isPending ||
                  filterApplicationStatusBarangay.isPending ? (
                    <CNavItem className="nav-item px-3" role="presentation">
                      <Skeleton variant="rounded" height={40} />
                    </CNavItem>
                  ) : (
                    <CNavLink
                      active={activeKey === 2}
                      component="button"
                      role="tab"
                      aria-controls="college-tab-pane"
                      aria-selected={activeKey === 2}
                      onClick={() => {
                        setActiveKey(2)
                        toast.dismiss()
                      }}
                    >
                      College
                    </CNavLink>
                  )}
                </CNavItem>
                <CNavItem role="presentation">
                  {applicationStatusBarangay.isLoading ||
                  allApplicationStatusBarangay.isPending ||
                  filterApplicationStatusBarangay.isPending ? (
                    <CNavItem className="nav-item px-3" role="presentation">
                      <Skeleton variant="rounded" height={40} />
                    </CNavItem>
                  ) : (
                    <CNavLink
                      active={activeKey === 3}
                      component="button"
                      role="tab"
                      aria-controls="tvet-tab-pane"
                      aria-selected={activeKey === 3}
                      onClick={() => {
                        setActiveKey(3)
                        toast.dismiss()
                      }}
                    >
                      Tvet
                    </CNavLink>
                  )}
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="senior-high-tab-pane"
                  visible={activeKey === 1}
                  style={{ position: 'relative' }}
                >
                  {applicationStatusBarangay.isLoading ||
                  allApplicationStatusBarangay.isPending ||
                  filterApplicationStatusBarangay.isPending ? (
                    <>
                      <div className="d-grid gap-2 d-md-flex mt-3 mb-3 justify-content-md-center">
                        <Skeleton variant="rounded" height={10} width={400} />
                      </div>
                      <div className="d-grid gap-2 d-md-flex mt-2 mb-4 justify-content-md-center">
                        <Skeleton variant="rounded" height={20} width={110} />
                        <Skeleton variant="rounded" height={20} width={110} />
                        <Skeleton variant="rounded" height={20} width={110} />
                      </div>

                      {[...Array(47)].map((_, index) => (
                        <CRow key={index} className="mt-3">
                          <CCol md="1">
                            <Skeleton
                              className="float-end"
                              variant="rounded"
                              width={getRandomPercentage(30, 70)}
                              height={10}
                            />
                          </CCol>
                          <CCol>
                            <Skeleton
                              className="float-start"
                              variant="rounded"
                              width={getRandomPercentage(30, 70)}
                              height={10}
                            />
                          </CCol>
                        </CRow>
                      ))}
                    </>
                  ) : (
                    <CChartBar
                      height={300}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Application status for each address',
                          },
                        },
                      }}
                      data={applicationStatusBarangay.data?.senior_high}
                    />
                  )}
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="college-tab-pane"
                  visible={activeKey === 2}
                  style={{ position: 'relative' }}
                >
                  {applicationStatusBarangay.isLoading ||
                  allApplicationStatusBarangay.isPending ||
                  filterApplicationStatusBarangay.isPending ? (
                    <>
                      <div className="d-grid gap-2 d-md-flex mt-3 mb-3 justify-content-md-center">
                        <Skeleton variant="rounded" height={10} width={400} />
                      </div>
                      <div className="d-grid gap-2 d-md-flex mt-2 mb-4 justify-content-md-center">
                        <Skeleton variant="rounded" height={20} width={110} />
                        <Skeleton variant="rounded" height={20} width={110} />
                        <Skeleton variant="rounded" height={20} width={110} />
                      </div>

                      {[...Array(47)].map((_, index) => (
                        <CRow key={index} className="mt-3">
                          <CCol md="1">
                            <Skeleton
                              className="float-end"
                              variant="rounded"
                              width={getRandomPercentage(30, 70)}
                              height={10}
                            />
                          </CCol>
                          <CCol>
                            <Skeleton
                              className="float-start"
                              variant="rounded"
                              width={getRandomPercentage(30, 70)}
                              height={10}
                            />
                          </CCol>
                        </CRow>
                      ))}
                    </>
                  ) : (
                    <CChartBar
                      height={300}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Application status for each address',
                          },
                        },
                      }}
                      data={applicationStatusBarangay.data?.college}
                    />
                  )}
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="tvet-tab-pane"
                  visible={activeKey === 3}
                  style={{ position: 'relative' }}
                >
                  {applicationStatusBarangay.isLoading || allApplicationStatusBarangay.isPending ? (
                    <>
                      <div className="d-grid gap-2 d-md-flex mt-3 mb-3 justify-content-md-center">
                        <Skeleton variant="rounded" height={10} width={400} />
                      </div>
                      <div className="d-grid gap-2 d-md-flex mt-2 mb-4 justify-content-md-center">
                        <Skeleton variant="rounded" height={20} width={110} />
                        <Skeleton variant="rounded" height={20} width={110} />
                        <Skeleton variant="rounded" height={20} width={110} />
                      </div>

                      {[...Array(47)].map((_, index) => (
                        <CRow key={index} className="mt-3">
                          <CCol md="1">
                            <Skeleton
                              className="float-end"
                              variant="rounded"
                              width={getRandomPercentage(30, 70)}
                              height={10}
                            />
                          </CCol>
                          <CCol>
                            <Skeleton
                              className="float-start"
                              variant="rounded"
                              width={getRandomPercentage(30, 70)}
                              height={10}
                            />
                          </CCol>
                        </CRow>
                      ))}
                    </>
                  ) : (
                    <CChartBar
                      height={300}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Application status for each address',
                          },
                        },
                      }}
                      data={applicationStatusBarangay.data?.tvet}
                    />
                  )}
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-2">
        <CCol md={6}>
          <OnlineUser />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard

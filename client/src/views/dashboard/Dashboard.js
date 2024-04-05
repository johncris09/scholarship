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
  CWidgetStatsB,
  CWidgetStatsF,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faCircle, faEye, faFilter, faHashtag } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { CChart, CChartBar } from '@coreui/react-chartjs'
import { jwtDecode } from 'jwt-decode'
import 'animate.css'
import {
  SchoolYear,
  Semester,
  api,
  DefaultLoading,
  handleError,
  requiredField,
  RequiredFieldNote,
  toSentenceCase,
  MagnifyingGlassLoading,
  WidgetLoading,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import CountUp from 'react-countup'
import { Skeleton } from '@mui/material'
import 'intro.js/introjs.css'
import { cilChartLine, cilChartPie, cilListNumbered } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Dashboard = ({ cardTitle }) => {
  const [loading, setLoading] = useState(false)
  const [onlineUser, setOnlineUser] = useState([])
  const [loadingTotal, setLoadingTotal] = useState(false)
  const [loadingChart, setLoadingChart] = useState(false)
  const [loadingOnline, setLoadingOnline] = useState(false)
  const [totalStatusData, setTotalStatusData] = useState([])
  const [totalData, setTotalData] = useState([])
  const [validated, setValidated] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(true)
  const [statusAddressChartData, setStatusAddressChartData] = useState([])
  const [activeKey, setActiveKey] = useState(1)
  const [activeGenderKey, setActiveGenderKey] = useState(1)
  const [user, setUser] = useState([])
  const [loadingGenderChart, setLoadingGenderChart] = useState(false)
  const [genderChartData, setGenderChartData] = useState([])
  const [loadingFourPsBeneficiary, setLoadingFourPsBeneficiary] = useState(false)
  const [fourPsBeneficiary, setFourPsBeneficiary] = useState([])

  useEffect(() => {
    fetchTotalStatus()
    fetchTotal()
    fetchStatusAddress()
    fetchGender()
    fetchOnlineUser()
    fetchFourPsBeneficiary()
    setUser(jwtDecode(localStorage.getItem('scholarshipToken')))
  }, [])

  const fetchFourPsBeneficiary = () => {
    setLoadingFourPsBeneficiary(true)
    Promise.all([
      api.get('senior_high/get_fourps_beneficiary'),
      api.get('college/get_fourps_beneficiary'),
      api.get('tvet/get_fourps_beneficiary'),
    ])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        const newData = {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
        console.info(newData)
        setFourPsBeneficiary(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoadingFourPsBeneficiary(false)
      })
  }
  const fetchGender = async () => {
    setLoadingGenderChart(true)
    await Promise.all([
      api.get('senior_high/get_data_by_gender'),
      api.get('college/get_data_by_gender'),
      api.get('tvet/get_data_by_gender'),
    ])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        const newData = {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
        console.info(newData)
        setGenderChartData(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoadingGenderChart(false)
      })
  }

  const fetchOnlineUser = () => {
    setLoadingOnline(true)
    api
      .get('user/online')
      .then((response) => {
        setOnlineUser(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoadingOnline(false)
      })
  }
  const fetchStatusAddress = () => {
    setLoadingChart(true)
    Promise.all([
      api.get('senior_high/get_status_by_barangay'),
      api.get('college/get_status_by_barangay'),
      api.get('tvet/get_status_by_barangay'),
    ])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        const newData = {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
        setStatusAddressChartData(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoadingChart(false)
        setLoadingOperation(false)
      })
  }

  const fetchTotalStatus = () => {
    setLoading(true)
    Promise.all([
      api.get('senior_high/total_status'),
      api.get('college/total_status'),
      api.get('tvet/total_status'),
    ])
      .then((responses) => {
        const newData = responses.map((response) => response.data)
        setTotalStatusData(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  const fetchTotal = () => {
    setLoadingTotal(true)
    Promise.all([api.get('senior_high/total'), api.get('college/total'), api.get('tvet/total')])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        const newData = {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
        setTotalData(newData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })
  }

  const handleRemoveFilter = () => {
    setLoading(true)
    setLoadingTotal(false)
    setLoadingOperation(true)
    setLoadingChart(true)
    setLoadingGenderChart(true)
    setLoadingFourPsBeneficiary(true)
    filterForm.resetForm()
    fetchTotal()
    fetchStatusAddress()
    fetchTotalStatus()
    fetchGender()
    fetchFourPsBeneficiary()
  }

  const handleViewAllData = async () => {
    setLoadingTotal(false)
    setLoadingTotal(true)
    setLoadingOperation(true)
    setLoadingChart(true)
    setLoadingGenderChart(true)
    setLoadingFourPsBeneficiary(true)

    filterForm.resetForm()
    setValidated(false)

    // Widget
    await Promise.all([
      api.get('senior_high/all_total_status'),
      api.get('college/all_total_status'),
      api.get('tvet/all_total_status'),
    ])
      .then((responses) => {
        const newData = responses.map((response) => response.data)
        setTotalStatusData(newData)
      })
      .catch((error) => {
        console.error('Error fetching total status data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })

    // Fetch total data
    await Promise.all([
      api.get('senior_high/all_total'),
      api.get('college/all_total'),
      api.get('tvet/all_total'),
    ])
      .then((responses) => {
        const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
          (response) => response.data,
        )
        const newData = {
          senior_high: responseSeniorHigh,
          college: responseCollege,
          tvet: responseTvet,
        }
        setTotalData(newData)
      })
      .catch((error) => {
        console.error('Error fetching total data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })

    // gender
    await Promise.all([
      api.get('senior_high/all_gender'),
      api.get('college/all_gender'),
      api.get('tvet/all_gender'),
    ])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        // console.info(response)
        const newData = {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
        setGenderChartData(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoadingGenderChart(false)
      })
    // 4p's Beneficiary
    await Promise.all([
      api.get('senior_high/all_fourps_beneficiary'),
      api.get('college/all_fourps_beneficiary'),
      api.get('tvet/all_fourps_beneficiary'),
    ])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        // console.info(response)
        const newData = {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
        setFourPsBeneficiary(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoadingFourPsBeneficiary(false)
      })
    // chart status in every barangay
    await Promise.all([
      api.get('senior_high/all_status_by_barangay'),
      api.get('college/all_status_by_barangay'),
      api.get('tvet/all_status_by_barangay'),
    ])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        const newData = {
          senior_high: response[0],
          college: response[1],
          tvet: response[2],
        }
        setStatusAddressChartData(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
        setLoadingChart(false)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    filterForm.setFieldValue(name, value)
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
      setLoadingTotal(false)
      setLoadingTotal(true)
      setLoadingOperation(true)
      setLoadingChart(true)
      setLoadingGenderChart(true)
      setLoadingFourPsBeneficiary(true)
      // Fetch total status data
      await Promise.all([
        api.get('senior_high/filter_total_status', { params: values }),
        api.get('college/filter_total_status', { params: values }),
        api.get('tvet/filter_total_status', { params: values }),
      ])
        .then((responses) => {
          const newData = responses.map((response) => response.data)
          setTotalStatusData(newData)
        })
        .catch((error) => {
          console.error('Error fetching total status data:', error)
        })
        .finally(() => {
          setLoadingTotal(false)
          setLoadingOperation(false)
        })

      // 4p's Beneficiary
      await Promise.all([
        api.get('senior_high/get_fourps_beneficiary', { params: values }),
        api.get('college/get_fourps_beneficiary', { params: values }),
        api.get('tvet/get_fourps_beneficiary', { params: values }),
      ])
        .then((responses) => {
          const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
            (response) => response.data,
          )
          const newData = {
            senior_high: responseSeniorHigh,
            college: responseCollege,
            tvet: responseTvet,
          }
          setFourPsBeneficiary(newData)
        })
        .catch((error) => {
          console.error('Error fetching total data:', error)
        })
        .finally(() => {
          setLoadingTotal(false)
          setLoadingFourPsBeneficiary(false)
        })
      // Widget
      await Promise.all([
        api.get('senior_high/filter_total', { params: values }),
        api.get('college/filter_total', { params: values }),
        api.get('tvet/filter_total', { params: values }),
      ])
        .then((responses) => {
          const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
            (response) => response.data,
          )
          const newData = {
            senior_high: responseSeniorHigh,
            college: responseCollege,
            tvet: responseTvet,
          }
          setTotalData(newData)
        })
        .catch((error) => {
          console.error('Error fetching total data:', error)
        })
        .finally(() => {
          setLoadingTotal(false)
          setLoadingOperation(false)
        })
      // gender
      await Promise.all([
        api.get('senior_high/get_data_by_gender', { params: values }),
        api.get('college/get_data_by_gender', { params: values }),
        api.get('tvet/get_data_by_gender', { params: values }),
      ])
        .then((responses) => {
          const response = responses.map((response) => response.data)
          // console.info(response)
          const newData = {
            senior_high: response[0],
            college: response[1],
            tvet: response[2],
          }
          setGenderChartData(newData)
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setLoadingGenderChart(false)
        })

      // chart status in every barangay
      await Promise.all([
        api.get('senior_high/filter_status_by_barangay', { params: values }),
        api.get('college/filter_status_by_barangay', { params: values }),
        api.get('tvet/filter_status_by_barangay', { params: values }),
      ])
        .then((responses) => {
          const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
            (response) => response.data,
          )
          const newData = {
            senior_high: responseSeniorHigh,
            college: responseCollege,
            tvet: responseTvet,
          }
          setStatusAddressChartData(newData)
        })
        .catch((error) => {
          console.error('Error fetching total data:', error)
        })
        .finally(() => {
          setLoadingTotal(false)
          setLoadingOperation(false)
          setLoadingChart(false)
        })
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

      {!loadingTotal ? (
        <CRow>
          <CCol id="totalDataSeniorHigh">
            <CWidgetStatsF
              style={{ borderRadius: 10 }}
              className="mb-3"
              color="transparent"
              padding={false}
              icon={
                <lord-icon
                  src="https://cdn.lordicon.com/zsaomnmb.json"
                  trigger="hover"
                  colors="primary:#e8308c,secondary:#2516c7,tertiary:#109121,quaternary:#3a3347"
                  style={{ width: '50px', height: '50px' }}
                ></lord-icon>
              }
              title="Senior High"
              value=<CountUp end={totalData.senior_high} />
            />
          </CCol>
          <CCol id="totalDataCollege">
            <CWidgetStatsF
              style={{ borderRadius: 10 }}
              className="mb-3"
              color="transparent"
              padding={false}
              icon={
                <lord-icon
                  src="https://cdn.lordicon.com/zsaomnmb.json"
                  trigger="hover"
                  colors="primary:#e88c30,secondary:#16c72e,tertiary:#30c9e8,quaternary:#3a3347"
                  style={{ width: '50px', height: '50px' }}
                ></lord-icon>
              }
              title="College"
              value=<CountUp end={totalData.college} />
            />
          </CCol>
          <CCol id="totalDataTvet">
            <CWidgetStatsF
              style={{ borderRadius: 10 }}
              className="mb-3"
              variant="outline"
              color="transparent"
              padding={false}
              icon={
                <lord-icon
                  src="https://cdn.lordicon.com/zsaomnmb.json"
                  trigger="hover"
                  style={{ width: '50px', height: '50px' }}
                ></lord-icon>
              }
              title="TVET"
              value=<CountUp end={totalData.tvet} />
            />
          </CCol>
        </CRow>
      ) : (
        <CRow>
          <CCol>
            <div className="card mb-3" style={{ borderRadius: '10px' }}>
              <div className="card-body d-flex align-items-center p-0">
                <div className="me-3 text-white bg-transparent p-4">
                  <Skeleton variant="circular" height={55} width={55} />
                </div>
                <div>
                  <div className="fs-6 fw-semibold text-transparent">
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
          <CCol>
            <div className="card mb-3" style={{ borderRadius: '10px' }}>
              <div className="card-body d-flex align-items-center p-0">
                <div className="me-3 text-white bg-transparent p-4">
                  <Skeleton variant="circular" height={55} width={55} />
                </div>
                <div>
                  <div className="fs-6 fw-semibold text-transparent">
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
          <CCol>
            <div className="card mb-3" style={{ borderRadius: '10px' }}>
              <div className="card-body d-flex align-items-center p-0">
                <div className="me-3 text-white bg-transparent p-4">
                  <Skeleton variant="circular" height={55} width={55} />
                </div>
                <div>
                  <div className="fs-6 fw-semibold text-transparent">
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
        </CRow>
      )}
      <CRow>
        <CCol id="totalStatusData">
          <CTable responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  {!loadingTotal ? (
                    'Scholarship Type'
                  ) : (
                    <Skeleton
                      variant="rounded"
                      width={140}
                      height={15}
                      className="my-1"
                      animation="wave"
                    />
                  )}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {!loadingTotal ? (
                    'Approved'
                  ) : (
                    <Skeleton
                      variant="rounded"
                      width={140}
                      height={15}
                      className="my-1"
                      animation="wave"
                    />
                  )}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {!loadingTotal ? (
                    'Pending'
                  ) : (
                    <Skeleton
                      variant="rounded"
                      width={140}
                      height={15}
                      className="my-1"
                      animation="wave"
                    />
                  )}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {!loadingTotal ? (
                    'Disapproved'
                  ) : (
                    <Skeleton
                      variant="rounded"
                      width={140}
                      height={15}
                      className="my-1"
                      animation="wave"
                    />
                  )}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {!loadingTotal ? (
                    'Archived'
                  ) : (
                    <Skeleton
                      variant="rounded"
                      width={140}
                      height={15}
                      className="my-1"
                      animation="wave"
                    />
                  )}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  {!loadingTotal ? (
                    'Voided'
                  ) : (
                    <Skeleton
                      variant="rounded"
                      width={140}
                      height={15}
                      className="my-1"
                      animation="wave"
                    />
                  )}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {totalStatusData.map((data, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell scope="row">
                    {index === 0 &&
                      (!loadingTotal ? (
                        'Senior High'
                      ) : (
                        <Skeleton
                          variant="rounded"
                          width={100}
                          height={15}
                          className="my-1"
                          animation="wave"
                        />
                      ))}
                    {index === 1 &&
                      (!loadingTotal ? (
                        'College'
                      ) : (
                        <Skeleton
                          variant="rounded"
                          width={60}
                          height={15}
                          className="my-1"
                          animation="wave"
                        />
                      ))}
                    {index === 2 &&
                      (!loadingTotal ? (
                        'Tvet'
                      ) : (
                        <Skeleton
                          variant="rounded"
                          width={30}
                          height={15}
                          className="my-1"
                          animation="wave"
                        />
                      ))}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    {!loadingTotal ? (
                      data.approved
                    ) : (
                      <Skeleton
                        variant="rounded"
                        width={50}
                        height={15}
                        className="my-1"
                        animation="wave"
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {!loadingTotal ? (
                      data.pending
                    ) : (
                      <Skeleton
                        variant="rounded"
                        width={50}
                        height={15}
                        className="my-1"
                        animation="wave"
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {!loadingTotal ? (
                      data.disapproved
                    ) : (
                      <Skeleton
                        variant="rounded"
                        width={50}
                        height={15}
                        className="my-1"
                        animation="wave"
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {!loadingTotal ? (
                      data.archived
                    ) : (
                      <Skeleton
                        variant="rounded"
                        width={50}
                        height={15}
                        className="my-1"
                        animation="wave"
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {!loadingTotal ? (
                      data.void
                    ) : (
                      <Skeleton
                        variant="rounded"
                        width={50}
                        height={15}
                        className="my-1"
                        animation="wave"
                      />
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>

      {!loadingFourPsBeneficiary ? (
        <CRow>
          <h5>4&apos;Ps Beneficiary</h5>
          <CCol md={4}>
            <CWidgetStatsF
              className="mb-3"
              color="primary"
              icon={<FontAwesomeIcon icon={faHashtag} style={{ height: 35 }} />}
              title="Senior High"
              value={fourPsBeneficiary.senior_high}
            />
          </CCol>
          <CCol md={4}>
            <CWidgetStatsF
              className="mb-3"
              color="primary"
              icon={<FontAwesomeIcon icon={faHashtag} style={{ height: 35 }} />}
              title="College"
              value={fourPsBeneficiary.college}
            />
          </CCol>
          <CCol md={4}>
            <CWidgetStatsF
              className="mb-3"
              color="primary"
              icon={<FontAwesomeIcon icon={faHashtag} style={{ height: 35 }} />}
              title="Tvet"
              value={fourPsBeneficiary.tvet}
            />
          </CCol>
        </CRow>
      ) : (
        <CRow>
          <h5>
            <Skeleton variant="rectangular" width={170} />
          </h5>

          <CCol>
            <div className="card mb-3" style={{ borderRadius: '10px' }}>
              <div className="card-body d-flex align-items-center p-0">
                <div className="me-3 text-white bg-transparent p-4">
                  <Skeleton variant="rectangular" height={55} width={55} />
                </div>
                <div>
                  <div className="fs-6 fw-semibold text-transparent">
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
          <CCol>
            <div className="card mb-3" style={{ borderRadius: '10px' }}>
              <div className="card-body d-flex align-items-center p-0">
                <div className=" text-white bg-transparent p-4">
                  <Skeleton variant="rectangular" height={55} width={55} />
                </div>
                <div>
                  <div className="fs-6 fw-semibold text-transparent">
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
          <CCol>
            <div className="card mb-3" style={{ borderRadius: '10px' }}>
              <div className="card-body d-flex align-items-center p-0">
                <div className="me-3 text-white bg-transparent p-4">
                  <Skeleton variant="rectangular" height={55} width={55} />
                </div>
                <div>
                  <div className="fs-6 fw-semibold text-transparent">
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
        </CRow>
      )}

      <CRow className="justify-content-center mb-4">
        <CCol md={12}>
          <CCard id="chart">
            <CCardBody>
              <h5>
                {!loadingGenderChart ? (
                  'Gender Statistics'
                ) : (
                  <Skeleton variant="rounded" width={170} />
                )}
              </h5>
              <CNav variant="pills" layout="justified">
                <CNavItem role="presentation">
                  {!loadingGenderChart ? (
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
                  ) : (
                    <CNavItem className="nav-item px-3" role="presentation">
                      <Skeleton variant="rounded" height={40} />
                    </CNavItem>
                  )}
                </CNavItem>

                <CNavItem role="presentation">
                  {!loadingGenderChart ? (
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
                  ) : (
                    <CNavItem className="nav-item px-3" role="presentation">
                      <Skeleton variant="rounded" height={40} />
                    </CNavItem>
                  )}
                </CNavItem>
                <CNavItem role="presentation">
                  {!loadingGenderChart ? (
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
                  ) : (
                    <CNavItem className="nav-item px-3" role="presentation">
                      <Skeleton variant="rounded" height={40} />
                    </CNavItem>
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
                  {loadingGenderChart ? (
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
                            data:
                              genderChartData.senior_high === undefined
                                ? [0, 0]
                                : [
                                    genderChartData.senior_high.male,
                                    genderChartData.senior_high.female,
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
                  {loadingGenderChart ? (
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
                      className=" mx-auto"
                      type="doughnut"
                      style={{ height: 400, width: 400 }}
                      data={{
                        labels: ['Male', 'Female'],
                        datasets: [
                          {
                            backgroundColor: ['#378CE7', '#FF5BAE'],
                            data:
                              genderChartData.college === undefined
                                ? [0, 0]
                                : [genderChartData.college.male, genderChartData.college.female],
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
                  {loadingGenderChart ? (
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
                      className=" mx-auto"
                      type="doughnut"
                      style={{ height: 400, width: 400 }}
                      data={{
                        labels: ['Male', 'Female'],
                        datasets: [
                          {
                            backgroundColor: ['#378CE7', '#FF5BAE'],
                            data:
                              genderChartData.tvet === undefined
                                ? [0, 0]
                                : [genderChartData.tvet.male, genderChartData.tvet.female],
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

      {!loadingChart ? (
        <CRow className="justify-content-center mt-4">
          <CCol md={12}>
            <CCard id="chart">
              <CCardBody>
                <CNav variant="pills" layout="justified">
                  <CNavItem role="presentation">
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
                  </CNavItem>
                  <CNavItem role="presentation">
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
                  </CNavItem>
                  <CNavItem role="presentation">
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
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="senior-high-tab-pane"
                    visible={activeKey === 1}
                    style={{ position: 'relative' }}
                  >
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
                      data={
                        statusAddressChartData.senior_high === undefined
                          ? []
                          : statusAddressChartData.senior_high
                      }
                    />
                  </CTabPane>
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="college-tab-pane"
                    visible={activeKey === 2}
                    style={{ position: 'relative' }}
                  >
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
                      data={
                        statusAddressChartData.college === undefined
                          ? []
                          : statusAddressChartData.college
                      }
                    />
                  </CTabPane>
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="tvet-tab-pane"
                    visible={activeKey === 3}
                    style={{ position: 'relative' }}
                  >
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
                      data={
                        statusAddressChartData.tvet === undefined ? [] : statusAddressChartData.tvet
                      }
                    />
                  </CTabPane>
                  {loadingChart && <DefaultLoading />}
                </CTabContent>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ) : (
        <CRow className="justify-content-center mt-4">
          <CCol md={12}>
            <CCard>
              <CCardBody>
                <CNav variant="pills" layout="justified">
                  <CNavItem className="nav-item px-3" role="presentation">
                    <Skeleton variant="rounded" height={35} />
                  </CNavItem>
                  <CNavItem className="nav-item px-3" role="presentation">
                    <Skeleton variant="rounded" height={35} />
                  </CNavItem>
                  <CNavItem className="nav-item px-3" role="presentation">
                    <Skeleton variant="rounded" height={35} />
                  </CNavItem>
                </CNav>

                <CTabContent>
                  <div className="d-grid gap-2 d-md-flex mt-3 mb-3 justify-content-md-center">
                    <Skeleton variant="rounded" height={10} width={400} />
                  </div>
                  <div className="d-grid gap-2 d-md-flex mt-2 mb-4 justify-content-md-center">
                    <Skeleton variant="rounded" height={20} width={110} />
                    <Skeleton variant="rounded" height={20} width={110} />
                    <Skeleton variant="rounded" height={20} width={110} />
                  </div>

                  {[...Array(20)].map((_, index) => (
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
                </CTabContent>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {!loadingOnline ? (
        <CRow className="mt-2">
          <CCol md={6}>
            <CCard className="mb-4" id="onlineUser">
              <CCardHeader>Online Users</CCardHeader>
              <CCardBody>
                <CTable small striped bordered responsive hover className="text-center">
                  <CTableRow>
                    <CTableHeaderCell scope="row">Name</CTableHeaderCell>
                    <CTableDataCell scope="row">Login</CTableDataCell>
                    <CTableDataCell scope="row">Logout</CTableDataCell>
                    <CTableDataCell scope="row">Status</CTableDataCell>
                  </CTableRow>

                  {onlineUser.map((row, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{`${toSentenceCase(row.firstname)} ${toSentenceCase(
                        row.lastname,
                      )}`}</CTableDataCell>
                      <CTableDataCell>{row.login_time}</CTableDataCell>
                      <CTableDataCell>{row.logout_time}</CTableDataCell>
                      <CTableDataCell>
                        {row.isLogin == 1 ? (
                          <FontAwesomeIcon className="text-success" icon={faCircle} />
                        ) : (
                          <FontAwesomeIcon className="text-danger" icon={faCircle} />
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ) : (
        <CRow className="mt-2">
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>
                <Skeleton variant="rectangular" width={100} />
              </CCardHeader>

              <CCardBody>
                <div className="d-grid gap-5 d-md-flex mt-2 justify-content-md-center">
                  <Skeleton variant="rounded" height={20} width={80} />
                  <Skeleton variant="rounded" height={20} width={80} />
                  <Skeleton variant="rounded" height={20} width={80} />
                  <Skeleton variant="rounded" height={20} width={80} />
                </div>
                <div className="container-fluid px-3 pt-2">
                  <Skeleton variant="rounded" width={'100%'} height={500} />
                </div>
                {loadingOperation && <DefaultLoading />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default Dashboard

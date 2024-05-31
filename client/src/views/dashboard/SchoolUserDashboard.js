import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsF,
} from '@coreui/react'
import { Skeleton } from '@mui/material'
import CIcon from '@coreui/icons-react'
import { cilChartLine } from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import { CChart } from '@coreui/react-chartjs'
import { jwtDecode } from 'jwt-decode'
import 'animate.css'
import { api, DefaultLoading, WidgetLoading, handleError } from 'src/components/SystemConfiguration'
import CountUp from 'react-countup'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const Dashboard = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [loadingTotal, setLoadingTotal] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingChart, setLoadingChart] = useState(false)
  const [totalStatusData, setTotalStatusData] = useState([])
  const [totalData, setTotalData] = useState([])
  const [loadingOperation, setLoadingOperation] = useState(true)
  const [statusAddressChartData, setStatusAddressChartData] = useState([])
  const [user, setUser] = useState([])
  const token = jwtDecode(localStorage.getItem('scholarshipToken'))

  useEffect(() => {
    fetchTotalStatus()
    fetchTotal()
    fetchStatusAddress()
    setUser(jwtDecode(localStorage.getItem('scholarshipToken')))
  }, [])

  // Chart Data by Address
  const fetchStatusAddress = async () => {
    fetchTotalStatus()
    setLoadingChart(true)

    await api
      .get('senior_high/get_status_by_barangay', {
        params: { school: token.school }, // for school user
      })
      .then((response) => {
        setStatusAddressChartData({
          senior_high: response.data,
        })
      })
      .catch((error) => {
        console.info(error)
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoadingChart(false)
        setLoadingOperation(false)
      })
  }

  const fetchTotalStatus = async () => {
    const token = jwtDecode(localStorage.getItem('scholarshipToken'))

    setLoading(true)

    await api
      .get('senior_high/total_status', {
        params: { school: token.school }, // for school user
      })
      .then((response) => {
        setTotalStatusData(response.data)
      })
      .catch((error) => {
        console.info(error)
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  // Widget Total
  const fetchTotal = async () => {
    setLoadingTotal(true)

    await api
      .get('senior_high/total', {
        params: { school: token.school }, // for school user
      })
      .then((responses) => {
        setTotalData(responses.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })
  }

  const applicationGender = useQuery({
    queryFn: async () =>
      await api
        .get('senior_high/get_data_by_gender', {
          params: { school: token.school }, // for school user
        })
        .then((response) => {
          return response.data
        }),
    queryKey: ['applicationGender'],
    staleTime: Infinity,
  })

  return (
    <>
      <ToastContainer />
      <h5>Welcome {token.firstname},</h5>
      <>
        <CRow className="animate__animated animate__pulse">
          <CCol style={{ position: 'relative' }}>
            <CWidgetStatsF
              className="mb-3  "
              variant="outline"
              color="primary"
              icon={<CIcon icon={cilChartLine} height={24} />}
              title="Total"
              value=<CountUp end={totalData} />
            />
            {loadingTotal && <WidgetLoading />}
          </CCol>
        </CRow>

        <CRow className="justify-content-center mb-4">
          <CCol style={{ position: 'relative' }}>
            <CCard>
              <CCardBody className="" bordered>
                <CTable caption="top" responsive className="text-center" bordered>
                  <CTableCaption className="h5">Approval Status Overview</CTableCaption>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Pending</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Approved</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Disapproved</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>
                        <Link to="/status/pending" replace>
                          {totalStatusData.pending}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link to="/status/approved" replace>
                          {totalStatusData.approved}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link to="/status/disapproved" replace>
                          {totalStatusData.disapproved}
                        </Link>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
            {loadingTotal && <DefaultLoading />}
          </CCol>
        </CRow>

        <CRow className="justify-content-center mb-4">
          <CCol md={12}>
            <CCard id="chart">
              <CCardBody>
                <p className="h5">Gender Statistics</p>
                <br />
                {applicationGender.isLoading ? (
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
                          data: [applicationGender.data?.male, applicationGender.data?.female],
                        },
                      ],
                    }}
                  />
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow className="justify-content-center mt-4">
          <CCol md={12}>
            <CCard className="mb-4">
              <CCardBody>
                <p className="text-medium-emphasis h5">
                  A chart that shows the application status for each address.
                </p>

                <CChart
                  type="bar"
                  data={
                    statusAddressChartData.senior_high === undefined
                      ? []
                      : statusAddressChartData.senior_high
                  }
                />
                {loadingChart && <DefaultLoading />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    </>
  )
}

export default Dashboard

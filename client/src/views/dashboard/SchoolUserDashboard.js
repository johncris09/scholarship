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
import CIcon from '@coreui/icons-react'
import { cilChartLine } from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import { CChart } from '@coreui/react-chartjs'
import { jwtDecode } from 'jwt-decode'
import 'animate.css'
import { api, DefaultLoading, WidgetLoading, handleError } from 'src/components/SystemConfiguration'
import CountUp from 'react-countup'
import { Link } from 'react-router-dom'

const Dashboard = ({ cardTitle }) => {
  const [loadingTotal, setLoadingTotal] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingChart, setLoadingChart] = useState(false)
  const [totalStatusData, setTotalStatusData] = useState([])
  const [totalData, setTotalData] = useState([])
  const [loadingOperation, setLoadingOperation] = useState(true)
  const [statusAddressChartData, setStatusAddressChartData] = useState([])
  const [user, setUser] = useState([])

  useEffect(() => {
    fetchTotalStatus()
    fetchTotal()
    fetchStatusAddress()
    setUser(jwtDecode(localStorage.getItem('scholarshipToken')))
  }, [])

  // Chart Data by Address
  const fetchStatusAddress = async () => {
    const token = jwtDecode(localStorage.getItem('scholarshipToken'))

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
    const token = jwtDecode(localStorage.getItem('scholarshipToken'))

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

  const column = [
    {
      accessorKey: 'type',
      header: 'Scholarship Type',
    },
    {
      accessorKey: 'approved',
      header: 'Approved',
    },
    {
      accessorKey: 'pending',
      header: 'Pending',
    },
    {
      accessorKey: 'disapproved',
      header: 'Dispproved',
    },
    {
      accessorKey: 'archived',
      header: 'Archived',
    },
    {
      accessorKey: 'void',
      header: 'Void',
    },
  ]
  return (
    <>
      <ToastContainer />
      <h5>Welcome {user.firstname},</h5>
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
        <CRow>
          <CCol style={{ position: 'relative' }}>
            <CCard>
              <CCardBody className="" bordered>
                <CTable caption="top" responsive className="text-center" bordered>
                  <CTableCaption>Approval Status Overview</CTableCaption>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Pending</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Approved</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Archived</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Disapproved</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Void</CTableHeaderCell>
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
                        <Link to="/status/archived" replace>
                          {totalStatusData.archived}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link to="/status/disapproved" replace>
                          {totalStatusData.disapproved}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link to="/status/void" replace>
                          {totalStatusData.void}
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
        <CRow className="justify-content-center mt-4">
          <CCol md={12}>
            <CCard className="mb-4">
              <CCardBody>
                <p className="text-medium-emphasis small">
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

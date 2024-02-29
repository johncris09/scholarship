import React, { useEffect, useState } from 'react'
import { api } from 'src/components/SystemConfiguration'

const ApplicationYearNumber = ({ endPointType }) => {
  const [appNumber, setAppNumber] = useState([])
  useEffect(() => {
    fetchApplicationNumber()
  }, [appNumber])

  const fetchApplicationNumber = async () => {
    await api
      .get('system_sequence/' + endPointType)
      .then((response) => {
        setAppNumber(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  return appNumber.seq_year ? appNumber.seq_year : 0
}

const ApplicationSemNumber = ({ endPointType }) => {
  const [appNumber, setAppNumber] = useState([])
  useEffect(() => {
    fetchApplicationNumber()
  }, [appNumber])

  const fetchApplicationNumber = async () => {
    await api
      .get('system_sequence/' + endPointType)
      .then((response) => {
        setAppNumber(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  return appNumber.seq_sem ? appNumber.seq_sem : 0
}

const ApplicationIDNumber = ({ endPointType }) => {
  const [appNumber, setAppNumber] = useState([])
  useEffect(() => {
    fetchApplicationNumber()
  }, [appNumber])

  const fetchApplicationNumber = async () => {
    await api
      .get('system_sequence/' + endPointType)
      .then((response) => {
        setAppNumber(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  return appNumber.seq_appno ? parseInt(appNumber.seq_appno) + 1 : 0
}

export { ApplicationYearNumber, ApplicationSemNumber, ApplicationIDNumber }

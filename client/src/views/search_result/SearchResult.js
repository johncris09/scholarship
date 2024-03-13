import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { CCard } from '@coreui/react'
import { ToastContainer } from 'react-toastify'
import { api } from 'src/components/SystemConfiguration'
import { useParams } from 'react-router-dom'
import BasicInfo from '../registration/BasicInfo'
import ScholarshipHistory from '../registration/ScholarshipHistory'

const SearchResult = ({ cardTitle }) => {
  const { id } = useParams()
  const [scholarshipID, setScholarshipID] = useState('')
  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    await api
      .get('advance_search', {
        params: {
          query: id,
        },
      })
      .then((response) => {
        setScholarshipID(response.data[0].id)
      })
      .catch((error) => {
        console.info(error)
        // toast.error(handleError(error))
      })
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <>
          <div className="m-2">
            <h5>Application Details</h5>
          </div>
          <BasicInfo id={scholarshipID} />
          <ScholarshipHistory scholarshipId={scholarshipID} hasNewRecordButton={false} />
        </>
      </CCard>
    </>
  )
}

export default SearchResult

import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CFormText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from '@coreui/react'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
  toSentenceCase,
} from 'src/components/SystemConfiguration'
import CIcon from '@coreui/icons-react'
import { cilWarning, cilX } from '@coreui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faPlus } from '@fortawesome/free-solid-svg-icons'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Skeleton } from '@mui/material'
import Swal from 'sweetalert2'

const RedFlag = ({ scholarshipId }) => {
  const queryClient = useQueryClient()

  const [modalVisible, setModalVisible] = useState(false)
  useEffect(() => {
    console.info(scholarshipId)
    fetchData()
  }, [scholarshipId])

  const fetchData = async () => {
    await api
      .get('red_flag/applicant/' + scholarshipId)
      .then((response) => {
        console.info(response.data)
        // setScholarshipID(response.data[0].id)
      })
      .catch((error) => {
        console.info(error)
        // toast.error(handleError(error))
      })
  }

  const redFlag = useQuery({
    queryFn: async () =>
      await api.get('red_flag/applicant/' + scholarshipId).then((response) => {
        return response.data
      }),
    queryKey: ['redFlag'],
    refetchIntervalInBackground: true,
  })

  const validationSchema = Yup.object().shape({
    note: Yup.string().required('Note is required'),
  })
  const form = useFormik({
    initialValues: {
      note: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let formattedValues = { ...values, scholarshipId }
      await insert(formattedValues)
    },
  })

  const { mutate: insert, isLoading: isLoadingInsert } = useMutation({
    mutationFn: (item) => {
      return api.post('red_flag/insert', item)
    },
    onSuccess: async (response) => {
      if (response.data) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.resetQueries(['redFlag'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  const deleteData = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api
          .delete('red_flag/delete/' + id)
          .then((response) => {
            queryClient.resetQueries(['redFlag'])
            toast.success(response.data.message)
          })
          .catch((error) => {
            console.info(error.response.data)
            // toast.error(handleError(error))
          })
        // .finally(() => {
        // })
      }
    })
  }

  return (
    <>
      <ToastContainer />
      <div className="d-flex bd-highlight">
        <div className="p-2 flex-grow-1 bd-highlight">
          <h5>
            <FontAwesomeIcon className="text-danger" icon={faFlag} /> Red Flag(s)
          </h5>
        </div>
        <div className="p-2 bd-highlight">
          <CButton
            onClick={() => setModalVisible(true)}
            className="mt-2"
            color="primary"
            type="submit"
            size="sm"
            shape="rounded-pill"
            // variant="outline"
          >
            <FontAwesomeIcon icon={faPlus} /> Add New
          </CButton>
        </div>
      </div>

      <div className="px-5">
        {!redFlag.isLoading ? (
          redFlag.data.map((item, index) => (
            <CAlert key={index} color="danger">
              <div className="d-flex bd-highlight">
                <div className="p-2  bd-highlight">
                  <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                </div>
                <div className="d-flex w-100 flex-column bd-highlight ">
                  <strong>{toSentenceCase(item.note)}</strong>
                  <small style={{ fontSize: 12 }}>{item.date_added}</small>
                </div>
                <div className="p-2  bd-highlight">
                  <CIcon
                    onClick={() => deleteData(item.id)}
                    icon={cilX}
                    className="flex-shrink-0 me-2"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            </CAlert>
          ))
        ) : (
          <>
            {[...Array(1)].map((_, index) => (
              <div key={index}>
                <Skeleton className="mb-3" variant="rounded" height={60} width={'100%'} />
                <Skeleton className="mb-3" variant="rounded" height={60} width={'100%'} />
                <Skeleton className="mb-3" variant="rounded" height={60} width={'100%'} />
              </div>
            ))}
          </>
        )}
      </div>

      <CModal alignment="center" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader> Add New Red Flag</CModalHeader>
        <CForm id="form" className="row  g-3" onSubmit={form.handleSubmit}>
          {redFlag.isLoading && <DefaultLoading />}

          <CModalBody>
            <RequiredFieldNote />

            <CFormInput
              type="text"
              feedbackInvalid="note is required."
              label={requiredField('Note')}
              name="note"
              onChange={handleInputChange}
              value={form.values.note}
              required
            />
            {form.touched.note && form.errors.note && (
              <CFormText className="text-danger">{form.errors.note}</CFormText>
            )}
          </CModalBody>

          <CModalFooter>
            <CButton
              className="btn btn-sm"
              color="secondary"
              onClick={() => setModalVisible(false)}
            >
              Close
            </CButton>
            <CButton className="btn btn-sm" color="primary" type="submit">
              Save
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default RedFlag

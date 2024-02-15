import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CRow,
} from '@coreui/react'
import logo from './../../../assets/images/logo-sm.png'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { DefaultLoading, api, handleError } from 'src/components/SystemConfiguration'
import { InvalidTokenError, jwtDecode } from 'jwt-decode'
import './../../../assets/css/custom.css'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const isTokenExist = localStorage.getItem('scholarshipToken') !== null
    if (isTokenExist) {
      const user = jwtDecode(localStorage.getItem('scholarshipToken'))

      if (user.school !== null) {
        navigate('/home', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [navigate])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },

    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setLoading(true)
        await api
          .post('login', values)
          .then(async (response) => {
            if (response.data.status) {
              toast.success(response.data.message)

              localStorage.setItem('scholarshipToken', response.data.token)
              const user = jwtDecode(response.data.token)
              if (response.data.role === 'azr14gGCV7hLW2ppQz2l') {
                if (response.data.school !== '') {
                  navigate('/home', { replace: true })
                } else {
                  navigate('/dashboard', { replace: true })
                }
              } else {
                navigate('/dashboard', { replace: true })
              }

              // update login status then go to dashboard/home page
              await api.put('user/update/' + user.id, { isLogin: 1 }).then((response) => {
                console.info(response.data)
              })
            } else {
              toast.error(response.data.message)
            }
          })
          .catch((error) => {
            console.info(error)
            toast.error(handleError(error))
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    formik.setFieldValue(name, value)
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={12} lg={6} xl={6}>
            <CCardGroup>
              <CCard className="p-4 box">
                <div className="ribbon ribbon-top-right">
                  <span>Upgraded </span>
                </div>
                <CCardBody>
                  <div className="text-center">
                    <CImage
                      rounded
                      src={logo}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '150px',
                        maxHeight: '150px',
                      }}
                    />
                  </div>

                  <CForm
                    className="row g-3 needs-validation"
                    onSubmit={formik.handleSubmit}
                    // noValidate
                    validated={validated}
                  >
                    <h3 className="text-center">
                      Oroquieta City <br /> Scholarship System
                    </h3>
                    <p className="text-medium-emphasis text-center">Sign In to your account</p>

                    <CFormInput
                      className="text-center py-2"
                      type="text"
                      placeholder="Username"
                      name="username"
                      onChange={handleInputChange}
                      value={formik.values.username}
                      required
                    />
                    <CFormInput
                      className="text-center py-2"
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={handleInputChange}
                      value={formik.values.password}
                      required
                    />
                    <CButton type="submit" color="primary">
                      Login
                    </CButton>
                  </CForm>
                  {loading && <DefaultLoading />}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -5,
                      right: 33,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ fontSize: '10px' }}>
                      Version: {process.env.REACT_APP_DATE_UPDATED}
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

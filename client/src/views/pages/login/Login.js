import React, { useEffect, useMemo, useState } from 'react'
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
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
const Login = () => {
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine)
      //await loadBasic(engine);
    }).then(() => {
      setInit(true)
    })

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
            toast.error('The server is closed. Please try again later."')
            // console.info(error)
            // toast.error(handleError(error))
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

  const particlesLoaded = (container) => {
    console.log(container)
  }

  const options = [
    {
      autoPlay: true,
      background: {
        color: {
          value: '#0d47a1',
        },
        image: '',
        position: '',
        repeat: '',
        size: '',
        opacity: 1,
      },
      backgroundMask: {
        composite: 'destination-out',
        cover: {
          color: {
            value: '#fff',
          },
          opacity: 1,
        },
        enable: true,
      },
      clear: true,
      defaultThemes: {},
      delay: 0,
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      detectRetina: true,
      duration: 0,
      fpsLimit: 120,
      interactivity: {
        detectsOn: 'window',
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onDiv: {
            selectors: {},
            enable: false,
            mode: {},
            type: 'circle',
          },
          onHover: {
            enable: true,
            mode: 'grab',
            parallax: {
              enable: true,
              force: 60,
              smooth: 10,
            },
          },
          resize: {
            delay: 0.5,
            enable: true,
          },
        },
        modes: {
          trail: {
            delay: 1,
            pauseOnStop: false,
            quantity: 1,
          },
          attract: {
            distance: 200,
            duration: 0.4,
            easing: 'ease-out-quad',
            factor: 1,
            maxSpeed: 50,
            speed: 1,
          },
          bounce: {
            distance: 200,
          },
          bubble: {
            distance: 400,
            duration: 2,
            mix: false,
            opacity: 0.8,
            size: 10,
            divs: {
              distance: 200,
              duration: 0.4,
              mix: false,
              selectors: {},
            },
          },
          connect: {
            distance: 80,
            links: {
              opacity: 0.5,
            },
            radius: 60,
          },
          grab: {
            distance: 400,
            links: {
              blink: false,
              consent: false,
              opacity: 1,
            },
          },
          push: {
            default: true,
            // groups: {},
            quantity: 4,
          },
          remove: {
            quantity: 2,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: 'ease-out-quad',
            divs: {
              distance: 200,
              duration: 0.4,
              factor: 100,
              speed: 1,
              maxSpeed: 50,
              easing: 'ease-out-quad',
              selectors: {},
            },
          },
          slow: {
            factor: 3,
            radius: 200,
          },
          light: {
            area: {
              gradient: {
                start: {
                  value: '#ffffff',
                },
                stop: {
                  value: '#000000',
                },
              },
              radius: 1000,
            },
            shadow: {
              color: {
                value: '#000000',
              },
              length: 2000,
            },
          },
        },
      },
      // manualParticles: {},
      particles: {
        bounce: {
          horizontal: {
            value: 1,
          },
          vertical: {
            value: 1,
          },
        },
        collisions: {
          absorb: {
            speed: 2,
          },
          bounce: {
            horizontal: {
              value: 1,
            },
            vertical: {
              value: 1,
            },
          },
          enable: false,
          maxSpeed: 50,
          mode: 'bounce',
          overlap: {
            enable: true,
            retries: 0,
          },
        },
        color: {
          value: '#ffffff',
          animation: {
            h: {
              count: 0,
              enable: false,
              speed: 1,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0,
            },
            s: {
              count: 0,
              enable: false,
              speed: 1,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0,
            },
            l: {
              count: 0,
              enable: false,
              speed: 1,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0,
            },
          },
        },
        effect: {
          close: true,
          fill: true,
          options: {},
          type: {},
        },
        // groups: {},
        move: {
          angle: {
            offset: 0,
            value: 90,
          },
          attract: {
            distance: 200,
            enable: false,
            rotate: {
              x: 3000,
              y: 3000,
            },
          },
          center: {
            x: 50,
            y: 50,
            mode: 'percent',
            radius: 0,
          },
          decay: 0,
          distance: {},
          direction: 'none',
          drift: 0,
          enable: true,
          gravity: {
            acceleration: 9.81,
            enable: false,
            inverse: false,
            maxSpeed: 50,
          },
          path: {
            clamp: true,
            delay: {
              value: 0,
            },
            enable: false,
            options: {},
          },
          outModes: {
            default: 'out',
          },
          random: false,
          size: false,
          speed: 2,
          spin: {
            acceleration: 0,
            enable: false,
          },
          straight: false,
          trail: {
            enable: false,
            length: 10,
            fill: {},
          },
          vibrate: false,
          warp: false,
        },
        number: {
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
          limit: {
            mode: 'delete',
            value: 0,
          },
          value: 100,
        },
        opacity: {
          value: {
            min: 0.1,
            max: 0.5,
          },
          animation: {
            count: 0,
            enable: true,
            speed: 3,
            decay: 0,
            delay: 0,
            sync: false,
            mode: 'auto',
            startValue: 'random',
            destroy: 'none',
          },
        },
        reduceDuplicates: false,
        shadow: {
          blur: 0,
          color: {
            value: '#000',
          },
          enable: false,
          offset: {
            x: 0,
            y: 0,
          },
        },
        shape: {
          close: true,
          fill: true,
          options: {},
          type: 'circle',
        },
        size: {
          value: {
            min: 1,
            max: 10,
          },
          animation: {
            count: 0,
            enable: true,
            speed: 20,
            decay: 0,
            delay: 0,
            sync: false,
            mode: 'auto',
            startValue: 'random',
            destroy: 'none',
          },
        },
        stroke: {
          width: 0,
        },
        zIndex: {
          value: 0,
          opacityRate: 1,
          sizeRate: 1,
          velocityRate: 1,
        },
        destroy: {
          bounds: {},
          mode: 'none',
          split: {
            count: 1,
            factor: {
              value: 3,
            },
            rate: {
              value: {
                min: 4,
                max: 9,
              },
            },
            sizeOffset: true,
          },
        },
        roll: {
          darken: {
            enable: false,
            value: 0,
          },
          enable: false,
          enlighten: {
            enable: false,
            value: 0,
          },
          mode: 'vertical',
          speed: 25,
        },
        tilt: {
          value: 0,
          animation: {
            enable: false,
            speed: 0,
            decay: 0,
            sync: false,
          },
          direction: 'clockwise',
          enable: false,
        },
        twinkle: {
          lines: {
            enable: false,
            frequency: 0.05,
            opacity: 1,
          },
          particles: {
            enable: false,
            frequency: 0.05,
            opacity: 1,
          },
        },
        wobble: {
          distance: 5,
          enable: false,
          speed: {
            angle: 50,
            move: 10,
          },
        },
        life: {
          count: 0,
          delay: {
            value: 0,
            sync: false,
          },
          duration: {
            value: 0,
            sync: false,
          },
        },
        rotate: {
          value: 0,
          animation: {
            enable: false,
            speed: 0,
            decay: 0,
            sync: false,
          },
          direction: 'clockwise',
          path: false,
        },
        orbit: {
          animation: {
            count: 0,
            enable: false,
            speed: 1,
            decay: 0,
            delay: 0,
            sync: false,
          },
          enable: false,
          opacity: 1,
          rotation: {
            value: 45,
          },
          width: 1,
        },
        links: {
          blink: false,
          color: {
            value: '#ffffff',
          },
          consent: false,
          distance: 150,
          enable: true,
          frequency: 1,
          opacity: 0.4,
          shadow: {
            blur: 5,
            color: {
              value: '#000',
            },
            enable: false,
          },
          triangles: {
            enable: false,
            frequency: 1,
          },
          width: 1,
          warp: false,
        },
        repulse: {
          value: 0,
          enabled: false,
          distance: 1,
          duration: 1,
          factor: 1,
          speed: 1,
        },
      },
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      // responsive: {},
      smooth: false,
      style: {},
      // themes: {},
      zLayers: 100,
      name: 'Parallax',
      motion: {
        disable: false,
        reduce: {
          factor: 4,
          value: true,
        },
      },
    },
  ]
  return (
    <>
      <ToastContainer />
      <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />

      <div className=" bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol xs={12} sm={12} lg={6} xl={6}>
              <CCardGroup>
                <CCard className="p-4 box">
                  {/* <div className="ribbon ribbon-top-right">
                    <span>Upgraded </span>
                  </div> */}
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
    </>
  )
}

export default Login

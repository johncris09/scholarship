import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import { ExportToCsv } from 'export-to-csv'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPrint } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import Select from 'react-select'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CRow,
  CSpinner,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box } from '@mui/material'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import logo from './../../assets/images/logo-sm.png'
import { jwtDecode } from 'jwt-decode'
import {
  DefaultLoading,
  MagnifyingGlassLoading,
  SchoolYear,
  Semester,
  Sex,
  StatusType,
  YearLevel,
  api,
  cityMayor,
  commiteeChairperson,
  handleError,
  toSentenceCase,
} from 'src/components/SystemConfiguration'

const Tvet = () => {
  const selectSchoolInputRef = useRef()
  const selectAddressIputRef = useRef()
  const selectCourseInputRef = useRef()
  const [data, setData] = useState([])
  const [school, setSchool] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [fetchSchoolLoading, setFetchSchoolLoading] = useState(true)
  const [fetchCourseLoading, setFetchCourseLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [printPreviewModalVisible, setPrintPreviewModalVisible] = useState(false)
  const [user, setUser] = useState([])
  const [course, setCourse] = useState([])
  const [address, setAddress] = useState([])
  const [fetchAddressLoading, setFetchAddressLoading] = useState([])

  useEffect(() => {
    fetchSchool()
    fetchCourse()
    fetchAddress()
    setUser(jwtDecode(localStorage.getItem('scholarshipToken')))
  }, [])

  const fetchSchool = () => {
    api
      .get('tvet_school')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })
        setSchool(formattedData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setFetchSchoolLoading(false)
      })
  }

  const fetchCourse = () => {
    setFetchCourseLoading(true)
    api
      .get('tvet_course')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.course}`
          return { value, label }
        })

        setCourse(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchCourseLoading(false)
      })
  }

  const fetchAddress = () => {
    api
      .get('barangay')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.barangay}`
          return { value, label }
        })

        setAddress(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchAddressLoading(false)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  const form = useFormik({
    initialValues: {
      school: '',
      semester: '',
      school_year: '',
      status: '',
      availment: '',
      sex: '',
      year_level: '',
      address: '',
      course: '',
    },
    onSubmit: async (values) => {
      setLoadingOperation(true)
      setLoading(true)
      await api
        .get('tvet/generate_report/', { params: values })
        .then((response) => {
          let text = values.semester === '' ? '' : `${values.semester} Semester `
          text += `List of ${values.status} TVET Scholarship Applicants `
          text += values.school_year === '' ? '' : `for ${values.school_year} `
          setTitle(text)
          setData(response.data)
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setLoadingOperation(false)
          setLoading(false)
        })
    },
  })

  const column = [
    {
      accessorKey: 'id',
      header: 'Name',
      accessorFn: (row) =>
        `${toSentenceCase(row.lastname)}, ${toSentenceCase(row.firstname)} ${toSentenceCase(
          row.middlename,
        )} ${row.suffix}`,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      accessorFn: (row) => `${toSentenceCase(row.address)}`,
    },
    {
      accessorKey: 'course',
      header: 'Course',
    },
    {
      accessorKey: 'year_level',
      header: 'Year Level',
    },
    {
      accessorKey: 'school',
      header: 'School',
    },
    {
      accessorKey: 'contact_number',
      header: 'Contact #',
    },
    {
      accessorKey: 'availment',
      header: 'Availment',
    },
  ]

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }
  const csvExporter = new ExportToCsv(csvOptions)
  const handleExportData = () => {
    const exportedData = data.map((item) => {
      return {
        Name: `${item.colLastName}, ${item.colFirstName} ${item.colMI}`,
        Address: item.colAddress,
        Course: item.colCourse,
        'Year Level': item.colYearLevel,
        School: item.colSchool,
        'Contact #': item.colContactNo,
        Availment: item.colAvailment,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  const handlePrintData = () => {
    setPrintPreviewModalVisible(true)
  }

  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
        fontWeight: 'bolder',
      },
    ],
  })

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 10,
      height: '100%',
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    country: {
      fontSize: '16pt',
    },
    office: {
      fontSize: '14pt',
    },
    city: {
      fontSize: '12pt',
    },
    citytag: {
      fontSize: '9pt',
      color: 'red',
      fontStyle: 'italic !important',
    },

    logo: {
      width: 70,
      height: 70,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      left: 5,
    },

    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    description: {
      fontWeight: 'bolder',
      backgroundColor: '#5FBDFF',
      textAlign: 'center',
      marginBottom: '10px',
      fontSize: '12pt',
      paddingTop: '3px',
      paddingBottom: '3px',
    },

    recommended: {
      fontSize: '11pt',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      marginTop: 30,
    },
    chairpersion: {
      borderTop: 1,
      borderTopColor: 'black',
      width: 200,
      textAlign: 'center',
      marginLeft: 50,
      marginTop: 40,
      fontSize: '11pt',
      flexDirection: 'column',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: '8pt',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },

    inBehalf: {
      flexDirection: 'row',
      fontSize: '10pt',
    },
    cityMayor: {
      textAlign: 'center',
      borderTop: 1,
      borderTopColor: 'black',
      flexDirection: 'column',
      marginLeft: 140,
      width: 180,
    },

    footer: {
      color: 'grey',
      position: 'absolute',
      bottom: 20,
      left: 10,
      right: 20,
      textAlign: 'center',
      paddingTop: 10,
      fontSize: '8pt',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tableHeader: {
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      fontSize: '11pt',
      backgroundColor: 'blue',
      color: 'white',
      fontFamily: 'Roboto',
      fontWeight: 800,
    },
    tableData: {
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      borderBottom: '0.4px solid grey',
      paddingTop: 3,
      paddingBottom: 3,
      fontSize: '10pt',
      flexWrap: 'wrap',
      wordWrap: 'break-word',
    },
  })
  const col = ['no', 'name', 'address', 'course', 'year_level', 'school', 'availment']
  const ROWS_PER_PAGE = 20
  const chunks = []

  for (let i = 0; i < data.length; i += ROWS_PER_PAGE) {
    chunks.push(data.slice(i, i + ROWS_PER_PAGE))
  }

  const totalChunks = chunks.length

  return (
    <>
      <ToastContainer />
      <CRow>
        <CCol>
          <CForm
            className="row g-3 needs-validation my-4"
            noValidate
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CRow>
              <CCol md={12}>
                <CFormLabel>
                  {
                    <>
                      {fetchSchoolLoading && <CSpinner size="sm" />}
                      {' School'}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectSchoolInputRef}
                  value={school.find((option) => option.value === form.values.school)}
                  onChange={handleSelectChange}
                  options={school}
                  name="school"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <CFormSelect
                  label="Semester"
                  name="semester"
                  onChange={handleInputChange}
                  value={form.values.semester}
                  required
                >
                  <option value="">Select</option>
                  {Semester.map((semester, index) => (
                    <option key={index} value={semester}>
                      {semester}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={4}>
                <CFormSelect
                  label="School Year"
                  name="school_year"
                  onChange={handleInputChange}
                  value={form.values.school_year}
                >
                  <option value="">Select</option>
                  {SchoolYear.map((school_year, index) => (
                    <option key={index} value={school_year}>
                      {school_year}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  aria-label="Status"
                  label="Status"
                  name="status"
                  onChange={handleInputChange}
                  value={form.values.status}
                >
                  <option value="">Select</option>
                  {StatusType.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <CFormInput
                  type="number"
                  label="Availment"
                  name="availment"
                  onChange={handleInputChange}
                  value={form.values.availment}
                />
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  type="text"
                  label="Sex"
                  name="sex"
                  onChange={handleInputChange}
                  value={form.values.sex}
                >
                  <option value="">Select</option>
                  {Sex.map((sex, index) => (
                    <option key={index} value={sex}>
                      {sex}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  label="Year Level"
                  name="year_level"
                  onChange={handleInputChange}
                  value={form.values.year_level}
                  required
                >
                  <option value="">Select</option>
                  {YearLevel.map((year_level, index) => (
                    <option key={index} value={year_level}>
                      {year_level}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={12}>
                <CFormLabel>
                  {
                    <>
                      {fetchAddressLoading && <CSpinner size="sm" />}
                      {' Address'}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectAddressIputRef}
                  value={address.find((option) => option.value === form.values.address)}
                  onChange={handleSelectChange}
                  options={address}
                  name="address"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={12}>
                <CFormLabel>
                  {
                    <>
                      {fetchCourseLoading && <CSpinner size="sm" />}
                      {' Course'}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectCourseInputRef}
                  value={course.find((option) => option.value === form.values.course)}
                  onChange={handleSelectChange}
                  options={course}
                  name="course"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
              </CCol>
            </CRow>

            <CRow className="justify-content-between mt-4">
              <CButton color="primary" type="submit">
                <lord-icon
                  src="https://cdn.lordicon.com/lyrrgrsl.json"
                  trigger="hover"
                  colors="primary:#ffffff"
                  style={{ width: '20px', height: '20px', paddingTop: '5px' }}
                ></lord-icon>{' '}
                Generate
              </CButton>
            </CRow>
            {loadingOperation && <MagnifyingGlassLoading />}
          </CForm>
        </CCol>
      </CRow>
      {data.length > 0 && (
        <CRow>
          <CCol style={{ position: 'relative' }}>
            <MaterialReactTable
              columns={column}
              data={data}
              enableRowVirtualization
              enableColumnVirtualization
              state={{
                isLoading: loading,
                isSaving: loading,
                showLoadingOverlay: loading,
                showProgressBars: loading,
                showSkeletons: loading,
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
              enableColumnResizing
              enableGrouping
              enableSelectAll={true}
              columnFilterDisplayMode="popover"
              paginationDisplayMode="pages"
              positionToolbarAlertBanner="bottom"
              enableStickyHeader
              enableStickyFooter
              selectAllMode="all"
              initialState={{ density: 'compact' }}
              renderTopToolbarCustomActions={({ table }) => (
                <>
                  <Box
                    className="d-none d-lg-flex"
                    sx={{
                      display: 'flex',
                      gap: '.2rem',
                      p: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
                      <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                    </CButton>
                    <CButton color="primary" variant="outline" onClick={handlePrintData} size="sm">
                      <FontAwesomeIcon icon={faPrint} /> Print
                    </CButton>
                  </Box>
                </>
              )}
            />
            {loading && <DefaultLoading />}
          </CCol>
        </CRow>
      )}

      <CModal
        size="lg"
        alignment="center"
        visible={printPreviewModalVisible}
        onClose={() => setPrintPreviewModalVisible(false)}
      >
        <PDFViewer width="100%" height="800px%">
          <Document
            size="A4"
            author={process.env.REACT_APP_DEVELOPER}
            title="Senior High Applicants"
            keywords="document, pdf"
            subject={title}
            creator={process.env.REACT_APP_DEVELOPER}
            producer={process.env.REACT_APP_DEVELOPER}
            pdfVersion="1.3"
          >
            {chunks.map((chunk, index) => (
              <Page key={index} style={styles.page}>
                <View style={styles.header} fixed>
                  <Image src={logo} style={styles.logo} alt="logo" />
                  <Text style={styles.country}>Republic of the Philippines</Text>
                  <Text style={styles.office}>Office of the City Mayor</Text>
                  <Text style={styles.city}>Oroqueita City</Text>
                  <Text style={styles.citytag}>City of Goodlife</Text>
                </View>
                <View style={styles.description} fixed>
                  <Text>{title}</Text>
                </View>
                <View style={styles.tableHeader} fixed>
                  {col.map((c, index) => (
                    <>
                      {c === 'no' && (
                        <Text
                          key={index}
                          style={{
                            width: `${40 / col.length}%`,
                          }}
                        >
                          No.
                        </Text>
                      )}
                      {c === 'name' && (
                        <Text
                          key={index}
                          style={{
                            width: `${250 / col.length}%`,
                          }}
                        >
                          {toSentenceCase(c)}
                        </Text>
                      )}
                      {c === 'address' && (
                        <Text
                          key={index}
                          style={{
                            width: `${150 / col.length}%`,
                          }}
                        >
                          {toSentenceCase(c)}
                        </Text>
                      )}
                      {c === 'strand' && (
                        <Text
                          key={index}
                          style={{
                            width: `${80 / col.length}%`,
                          }}
                        >
                          {toSentenceCase(c)}
                        </Text>
                      )}
                      {c === 'school' && (
                        <Text
                          key={index}
                          style={{
                            width: `${160 / col.length}%`,
                          }}
                        >
                          {toSentenceCase(c)}
                        </Text>
                      )}

                      {c === 'availment' && (
                        <Text
                          key={index}
                          style={{
                            width: `${100 / col.length}%`,
                          }}
                        >
                          {toSentenceCase(c)}
                        </Text>
                      )}
                    </>
                  ))}
                </View>
                {chunk.map((rowData, rowIndex) => (
                  <>
                    <View style={styles.tableData}>
                      {col.map((c) => (
                        <>
                          {c === 'no' && (
                            <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                              {index * ROWS_PER_PAGE + rowIndex + 1}
                            </Text>
                          )}
                          {c === 'name' && (
                            <Text key={rowIndex} style={{ width: `${250 / col.length}%` }}>
                              {`${toSentenceCase(rowData.lastname)},  ${toSentenceCase(
                                rowData.firstname,
                              )}. ${toSentenceCase(rowData.middlename)} ${toSentenceCase(
                                rowData.suffix,
                              )}`}
                            </Text>
                          )}
                          {c === 'address' && (
                            <Text key={rowIndex} style={{ width: `${150 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                          {c === 'strand' && (
                            <Text key={rowIndex} style={{ width: `${80 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                          {c === 'school' && (
                            <Text key={rowIndex} style={{ width: `${160 / col.length}%` }}>
                              {rowData.abbreviation}
                            </Text>
                          )}

                          {c === 'availment' && (
                            <Text key={rowIndex} style={{ width: `${100 / col.length}%` }}>
                              {rowData[c]}
                            </Text>
                          )}
                        </>
                      ))}
                    </View>
                  </>
                ))}

                <View>
                  {index === totalChunks - 1 && (
                    <>
                      <View style={styles.recommended}>
                        <Text>Recommended for Approval:</Text>
                        <Text style={{ marginRight: 180 }}>Approved:</Text>
                      </View>
                      <View style={styles.inBehalf}>
                        <Text>In behalf of the City Scholarship Screening Committee</Text>
                        <View style={styles.cityMayor}>
                          <Text>{cityMayor}</Text>
                          <Text style={{ textAlign: 'center', fontSize: 10 }}>City Mayor</Text>
                        </View>
                      </View>
                      <View style={styles.chairpersion}>
                        <Text>{commiteeChairperson}</Text>
                        <Text style={{ fontSize: 10 }}>Commitee Chairperson</Text>
                      </View>
                    </>
                  )}
                </View>

                <Text
                  style={styles.pageNumber}
                  render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                  fixed
                />
                <View style={styles.footer}>
                  <Text>
                    Printed by: {`${user.firstname}  ${user.middlename}. ${user.lastname}`}
                  </Text>

                  <Text>Printed on: {new Date().toLocaleString()}</Text>
                </View>
              </Page>
            ))}
          </Document>
        </PDFViewer>
      </CModal>
    </>
  )
}

export default Tvet

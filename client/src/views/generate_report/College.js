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
  CInputGroup,
  CModal,
  CRow,
  CSpinner,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box } from '@mui/material'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import logo from './../../assets/images/logo-sm.png'
import asensoLogo from './../../assets/images/asenso-logo.png'
import bagongPilipinasLogo from './../../assets/images/bagong-pilipinas-logo.png'
import { jwtDecode } from 'jwt-decode'
import {
  SchoolYear,
  Semester,
  Sex,
  StatusType,
  YearLevel,
  api,
  handleError,
  toSentenceCase,
  cityMayor,
  commiteeChairperson,
  DefaultLoading,
  MagnifyingGlassLoading,
} from 'src/components/SystemConfiguration'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const College = () => {
  const queryClient = useQueryClient()
  const selectSchoolInputRef = useRef()
  const selectAddressIputRef = useRef()
  const selectCourseInputRef = useRef()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [title, setTitle] = useState('')
  const [printPreviewModalVisible, setPrintPreviewModalVisible] = useState(false)
  const [user, setUser] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(20) // DEFAULT ROWS PER PAGE
  const [totalChunks, setTotalChunks] = useState(2)
  const [chunks, setChunks] = useState([])

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

  const collegeSchool = useQuery({
    queryFn: async () =>
      await api.get('college_school').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.school}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['collegeSchoolReport'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const course = useQuery({
    queryFn: async () =>
      await api.get('course').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.course}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['collegeCourseReport'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const address = useQuery({
    queryFn: async () =>
      await api.get('barangay').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.barangay}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['addressCollegeReport'],
    staleTime: Infinity,
  })

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem('scholarshipToken')))
  }, [])

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
        .get('college/generate_report/', { params: values })
        .then((response) => {
          if (response.data.length > 0) {
            let text = values.semester === '' ? '' : `${values.semester} Semester `
            text += `List of ${values.status} College Scholarship Applicants `
            text += values.school_year === '' ? '' : `for ${values.school_year} `
            setTitle(text)
            setData(response.data)
          } else {
            toast.info('No Record Found')
          }
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
        Name: `${toSentenceCase(item.lastname)}, ${toSentenceCase(item.firstname)} ${
          item.middlename.length === 1
            ? item.middlename + '.'
            : item.middlename.length > 1
            ? item.middlename.substring(0, 1) + '.'
            : ''
        } ${item.suffix}`,
        Address: `${toSentenceCase(item.address)}`,
        Course: item.course,
        'Year Level': item.year_level,
        School: item.school,
        'Contact #': item.contact_number,
        Availment: item.availment,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  const handleRowsPerPageChange = (e) => {
    const { value } = e.target
    setRowsPerPage(value)
  }
  const handlePrintData = () => {
    const dividedArray = chunkArray(data, parseInt(rowsPerPage))

    setChunks(dividedArray)
    setTotalChunks(parseInt(dividedArray.length))

    setPrintPreviewModalVisible(true)
  }

  const chunkArray = (arr, size) => {
    const slice = []
    for (let i = 0; i < arr.length; i += size) {
      slice.push(arr.slice(i, i + size))
    }

    return slice
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

    logo_left: {
      width: 70,
      height: 70,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      left: 5,
    },
    logo_right_1: {
      width: 70,
      height: 70,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      right: 50,
    },
    logo_right_2: {
      width: 80,
      height: 80,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      right: -15,
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
                      {collegeSchool.isLoading && <CSpinner size="sm" />}
                      {' School'}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectSchoolInputRef}
                  value={
                    !collegeSchool.isLoading &&
                    collegeSchool.data?.find((option) => option.value === form.values.school)
                  }
                  onChange={handleSelectChange}
                  options={!collegeSchool.isLoading && collegeSchool.data}
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
                      {address.isLoading && <CSpinner size="sm" />}
                      {' Address'}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectAddressIputRef}
                  value={
                    !address.isLoading &&
                    address.data?.find((option) => option.value === form.values.address)
                  }
                  onChange={handleSelectChange}
                  options={!address.isLoading && address.data}
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
                      {course.isLoading && <CSpinner size="sm" />}
                      {' Course'}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectCourseInputRef}
                  value={
                    !course.isLoading &&
                    course.data?.find((option) => option.value === form.values.course)
                  }
                  onChange={handleSelectChange}
                  options={!course.isLoading && course.data}
                  name="course"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
              </CCol>
            </CRow>

            <CRow className="justify-content-between mt-4">
              <CButton color="primary" type="submit" shape="rounded-pill">
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
                    <CInputGroup className="mb-3">
                      <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
                        <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                      </CButton>
                      <CFormInput
                        type="number"
                        size="sm"
                        style={{ width: 60 }}
                        name="rows_per_page"
                        onChange={handleRowsPerPageChange}
                        value={rowsPerPage}
                        required
                      />

                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={handlePrintData}
                        size="sm"
                      >
                        <FontAwesomeIcon icon={faPrint} /> Print
                      </CButton>
                    </CInputGroup>
                  </Box>
                </>
              )}
            />
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
            title="College Applicants"
            keywords="document, pdf"
            subject={title}
            creator={process.env.REACT_APP_DEVELOPER}
            producer={process.env.REACT_APP_DEVELOPER}
            pdfVersion="1.3"
          >
            {chunks.map((chunk, index) => (
              <Page key={index} style={styles.page}>
                <View style={styles.header} fixed>
                  <Image src={logo} style={styles.logo_left} alt="Oroquieta City Logo" />
                  <Text style={styles.country}>Republic of the Philippines</Text>
                  <Text style={styles.office}>Office of the City Mayor</Text>
                  <Text style={styles.city}>Oroqueita City</Text>
                  <Text style={styles.citytag}>City of Goodlife</Text>
                  <Image src={asensoLogo} style={styles.logo_right_1} alt="Asenso Logo" />
                  <Image
                    src={bagongPilipinasLogo}
                    style={styles.logo_right_2}
                    alt="Baqgong Pilipinas Logo"
                  />
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
                              {index * rowsPerPage + rowIndex + 1}
                            </Text>
                          )}
                          {c === 'name' && (
                            <Text key={rowIndex} style={{ width: `${250 / col.length}%` }}>
                              {`${toSentenceCase(rowData.lastname)}, ${toSentenceCase(
                                rowData.firstname,
                              )} ${
                                rowData.middlename.length === 1
                                  ? rowData.middlename + '.'
                                  : rowData.middlename.length > 1
                                  ? rowData.middlename.substring(0, 1) + '.'
                                  : ''
                              } ${rowData.suffix}`}
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
                    Printed by:{' '}
                    {`${user.firstname} ${
                      user.middlename
                        ? user.middlename.length === 1
                          ? user.middlename + '.'
                          : user.middlename.substring(0, 1) + '.'
                        : ''
                    } ${user.lastname}`}
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

export default College

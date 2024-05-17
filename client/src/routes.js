import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const SchoolUserDashboard = React.lazy(() => import('./views/dashboard/SchoolUserDashboard'))
const AdvanceSearch = React.lazy(() => import('./views/advance_search/AdvanceSearch'))
const Registration = React.lazy(() => import('./views/registration/Registration'))
// Manage Application
const Approved = React.lazy(() => import('./views/approved/Approved'))
const Pending = React.lazy(() => import('./views/pending/Pending'))
const Disapproved = React.lazy(() => import('./views/disapproved/Disapproved'))
const Archived = React.lazy(() => import('./views/archived/Archived'))
const Void = React.lazy(() => import('./views/void/Void'))
const Status = React.lazy(() => import('./views/status/Status'))

const Sibling = React.lazy(() => import('./views/sibling/Sibling'))

const GenerateReport = React.lazy(() => import('./views/generate_report/GenerateReport'))

// Applicant
const Applicant = React.lazy(() => import('./views/applicant/Applicant'))
const ApplicationDetails = React.lazy(() => import('./views/applicant/ApplicationDetails'))

const SearchResult = React.lazy(() => import('./views/search_result/SearchResult'))

// School
const SeniorHighSchool = React.lazy(() => import('./views/school/SeniorHighSchool'))
const CollegeSchool = React.lazy(() => import('./views/school/CollegeSchool'))
const TvetSchool = React.lazy(() => import('./views/school/TvetSchool'))

// Course/Strand
const Strand = React.lazy(() => import('./views/course/Strand'))
const Course = React.lazy(() => import('./views/course/Course'))
const TvetCourse = React.lazy(() => import('./views/course/TvetCourse'))

const User = React.lazy(() => import('./views/user/User'))
const Profile = React.lazy(() => import('./views/profile/Profile'))
const SystemSequence = React.lazy(() => import('./views/system_sequence/SystemSequence'))
const Config = React.lazy(() => import('./views/config/Config'))

const routes = [
  { path: '/home', user: ['azr14gGCV7hLW2ppQz2l'], exact: true, element: SchoolUserDashboard },
  {
    path: '/status/:status',
    user: ['azr14gGCV7hLW2ppQz2l'],
    exact: true,
    name: 'Status',
    element: Status,
  },
  {
    path: '/dashboard',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Dashboard',
    element: Dashboard,
  },
  {
    path: '/applicant',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Applicant',
    element: Applicant,
  },
  {
    path: '/registration',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Registration',
    element: Registration,
  },
  {
    path: '/applicant/details/:id',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Application Details',
    element: ApplicationDetails,
  },
  {
    path: '/search/:id',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Search Result',
    element: SearchResult,
  },
  // { path: '/registration', name: 'Registration', element: Registration },
  {
    path: '/sibling',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Sibling(s)',
    element: Sibling,
  },
  {
    path: '/advance_search',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc', 'azr14gGCV7hLW2ppQz2l'],
    name: 'Advance Search',
    element: AdvanceSearch,
  },
  {
    path: '/manage',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Manage',
    element: Approved,
  },
  {
    path: '/manage/approved',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Approved',
    element: Approved,
  },
  {
    path: '/manage/pending',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Pending',
    element: Pending,
  },
  {
    path: '/manage/disapproved',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Disapproved',
    element: Disapproved,
  },
  {
    path: '/manage/archived',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Archived',
    element: Archived,
  },
  {
    path: '/manage/void',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Void',
    element: Void,
  },

  {
    path: '/generate_report',
    user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
    name: 'Generate Report',
    element: GenerateReport,
  },

  {
    path: '/school',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'School',
    element: SeniorHighSchool,
    exact: true,
  },
  {
    path: '/school/senior_high',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'Senior High School',
    element: SeniorHighSchool,
  },
  {
    path: '/school/college',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'College School',
    element: CollegeSchool,
  },
  {
    path: '/school/tvet',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'TVET School',
    element: TvetSchool,
  },

  { path: '/manage', user: ['4BSVYawhFI8j779vM8q1'], name: 'Manage', element: Strand, exact: true },
  { path: '/manage/strand', user: ['4BSVYawhFI8j779vM8q1'], name: 'Strand', element: Strand },
  {
    path: '/manage/course',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'College Course',
    element: Course,
  },
  {
    path: '/manage/tvet_course',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'TVET Course',
    element: TvetCourse,
  },
  { path: '/user', user: ['4BSVYawhFI8j779vM8q1'], name: 'User', element: User },
  { path: '/profile', user: ['4BSVYawhFI8j779vM8q1'], name: 'Profile', element: Profile },
  {
    path: '/system_sequence',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'System Sequence',
    element: SystemSequence,
  },
  {
    path: '/configuration',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'System Configuration',
    element: Config,
    exact: true,
  },
  {
    path: '/configuration/config',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'Current List View',
    element: Config,
  },
  {
    path: '/configuration/system_sequence',
    user: ['4BSVYawhFI8j779vM8q1'],
    name: 'System Sequence',
    element: SystemSequence,
  },
]

export default routes

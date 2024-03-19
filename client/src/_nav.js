import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilApplicationsSettings,
  cilBarChart,
  cilCog,
  cilHome,
  cilLibraryBuilding,
  cilListRich,
  cilMagnifyingGlass,
  cilPeople,
  cilPlus,
  cilSchool,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = (userInfo) => {
  let items = []

  // Administrator
  if (userInfo.role === '4BSVYawhFI8j779vM8q1') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Registration',
        to: '/registration',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Applicant',
      //   to: '/applicant',
      //   icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Advance Search',
      //   to: '/advance_search',
      //   icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
      // },

      {
        component: CNavGroup,
        name: 'Manage Application',
        to: '/manage',
        icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Approved',
            to: '/manage/approved',
          },
          {
            component: CNavItem,
            name: 'Pending',
            to: '/manage/pending',
          },
          {
            component: CNavItem,
            name: 'Disapproved',
            to: '/manage/disapproved',
          },
          {
            component: CNavItem,
            name: 'Archived',
            to: '/manage/archived',
          },
          {
            component: CNavItem,
            name: 'Void',
            to: '/manage/void',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Sibling(s)',
        to: '/sibling',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavTitle,
        name: 'Report',
      },
      {
        component: CNavItem,
        name: 'Generate Report',
        to: '/generate_report',
        icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
      },
      {
        component: CNavTitle,
        name: 'Utilities',
      },

      {
        component: CNavGroup,
        name: 'System Configuration',
        to: '/configuration',
        icon: <CIcon icon={cilApplicationsSettings} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Current List View',
            to: '/configuration/config',
          },
          // {
          //   component: CNavItem,
          //   name: 'System Sequence',
          //   to: '/configuration/system_sequence',
          // },
        ],
      },
      {
        component: CNavGroup,
        name: 'Manage School',
        to: '/school',
        icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Senior High',
            to: '/school/senior_high',
          },
          {
            component: CNavItem,
            name: 'College',
            to: '/school/college',
          },
          {
            component: CNavItem,
            name: 'TVET',
            to: '/school/tvet',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Manage Course',
        to: '/manage',
        icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Strand',
            to: '/manage/strand',
          },
          {
            component: CNavItem,
            name: 'Course',
            to: '/manage/course',
          },
          {
            component: CNavItem,
            name: 'TVET Course',
            to: '/manage/tvet_course',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'User',
        to: '/user',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ]
  }

  // Encoder
  if (userInfo.role === 'KmOlD4kHZC93Yp8Jirhc') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Registration',
        to: '/registration',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Applicant',
        to: '/applicant',
        icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Advance Search',
      //   to: '/advance_search',
      //   icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
      // },
      {
        component: CNavGroup,
        name: 'Manage Application',
        to: '/manage',
        icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Approved',
            to: '/manage/approved',
          },
          {
            component: CNavItem,
            name: 'Pending',
            to: '/manage/pending',
          },
          {
            component: CNavItem,
            name: 'Disapproved',
            to: '/manage/disapproved',
          },
          {
            component: CNavItem,
            name: 'Archived',
            to: '/manage/archived',
          },
          {
            component: CNavItem,
            name: 'Void',
            to: '/manage/void',
          },
        ],
      },
      {
        component: CNavTitle,
        name: 'Utilities',
      },
      {
        component: CNavItem,
        name: 'Generate Report',
        to: '/generate_report',
        icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
      },
    ]
  }

  // User
  if (userInfo.role === 'azr14gGCV7hLW2ppQz2l') {
    if (userInfo.school === null) {
      // non school user
      items = [
        {
          component: CNavItem,
          name: 'Dashboard',
          to: '/dashboard',
          icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        },
        // {
        //   component: CNavItem,
        //   name: 'Advance Search',
        //   to: '/advance_search',
        //   icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
        // },
      ]
    } else {
      // schol user
      items = [
        {
          component: CNavItem,
          name: 'Home',
          to: '/home',
          icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
        },
      ]
    }
  }
  return items
}

export default _nav

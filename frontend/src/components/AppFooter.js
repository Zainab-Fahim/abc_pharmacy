import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://zainabfahim.bio.link/" target="_blank" rel="noopener noreferrer">
          Zainab Fahim
        </a>
        <span className="ms-1">&copy; ABC Pharmacy.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://zainabfahim.bio.link/" target="_blank" rel="noopener noreferrer">
        Zainab Fahim
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

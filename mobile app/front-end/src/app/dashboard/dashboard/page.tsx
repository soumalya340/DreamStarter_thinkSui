import React from 'react'

const page = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-t from-purple-900 via-purple-600 to-black animate-gradient'>
        <a href="/dashboard/crowdfunding-events"><button className='ant-btn css-1g853jt ant-btn-default border-solid border-2 border-sky-500 p-3 bg-white'> Crowdfunding Events</button></a>
        <a href="/dashboard/started-events"><button className='ant-btn css-1g853jt ant-btn-default border-solid border-2 border-sky-500 p-3 bg-white'>Started Events</button></a>
    </div>
  )
}

export default page
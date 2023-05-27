import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Button, Divider, Typography } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Typography variant="h4">Standup Fight Series</Typography>
      <Typography variant="body2"> Bout 2 </Typography>
      <Divider />
      <Box sx={{ margin: '10px 0px' }}>
        <Typography variant='h5' color="steelblue">Blue Corner</Typography>
        <Box className="trackerRow" sx={{ borderBottom: '1px solid #000' }}>
          <div className='targetName'>&nbsp;</div>
          <div>Kick</div>
          <div>Punch</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className='targetName'>HEAD</div>
          <div className='trackerBtn'>&nbsp;</div>
          <div className='trackerBtn'>&nbsp;</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className='targetName'>BODY</div>
          <div className='trackerBtn'>&nbsp;</div>
          <div className='trackerBtn'>&nbsp;</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className='targetName'>LEG</div>
          <div className='trackerBtn'>&nbsp;</div>
          <div className='blankItem'>&nbsp;</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className='targetName'>SWEEP</div>
          <div className='trackerBtn'>&nbsp;</div>
          <div className='blankItem'>&nbsp;</div>
        </Box>
      </Box>
      <Box>
        <Typography variant='h5' color="red">Red Corner</Typography>
        <Box className="trackerRow" sx={{ borderBottom: '1px solid #000' }}>
          <div className='targetName'>&nbsp;</div>
          <div>Kick</div>
          <div>Punch</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className='targetName'>HEAD</div>
          <div className='trackerBtn'>&nbsp;</div>
          <div className='trackerBtn'>&nbsp;</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className='targetName'>BODY</div>
          <div className='trackerBtn'>&nbsp;</div>
          <div className='trackerBtn'>&nbsp;</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className='targetName'>LEG</div>
          <div className='trackerBtn'>&nbsp;</div>
          <div className='blankItem'>&nbsp;</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className='targetName'>SWEEP</div>
          <div className='trackerBtn'>&nbsp;</div>
          <div className='blankItem'>&nbsp;</div>
        </Box>
      </Box>


    </>
  )
}

export default App

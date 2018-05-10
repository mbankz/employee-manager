import React from 'react'
import Paper from 'material-ui/Paper'
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import './about.css'

export default function About(props) {
 const style = {
  height: 600,
  width: 1200,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block'
};
const toolStyle = {
  alignItems: 'center'
}

 return (
  <div id="landing">
   <div id="about-wrapper">
    <Paper style={style} zDepth={5}>
     <Toolbar style={toolStyle}>
      <ToolbarTitle text="About" />
     </Toolbar>
    </Paper>
   </div>
  </div>
 )
}
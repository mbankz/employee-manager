import React from 'react'

export default {
 requests: (props, requests) => {
  return (
   <div>
    <div>
     <div className="modal-header">
      <h5 className="modal-title"> Current Employee Requests </h5>
      <button onClick={() => props.closeModal()} type="button" className="close" data-dismiss="modal" aria-label="Close">
       <span style={{marginLeft: "500px"}} aria-hidden="true">&times;</span>
      </button>
     </div>
     <div className="modal-body">
      {requests}
     </div>
    </div>
   </div>
  )
 },

 form: (props, ManagerForm) => {
  return (
   <div>
    <div>
     <div className="modal-header">
      
     <h4 style={{paddingTop: "10px"}} className="close" onClick={()=>props.updateFormCompleted(false)}>&#x003C;</h4><h5 className="modal-title"> Complete Employee Form </h5>
      <button onClick={() => props.closeModal()} type="button" className="close" data-dismiss="modal" aria-label="Close">
       <span style={{marginLeft: "500px"}} aria-hidden="true">&times;</span>
      </button>
     </div>
     <div className="modal-body">
 
      Employee Name:&nbsp;{props.current_request[0] ? props.current_request[0].first_name : ''}&nbsp;{props.current_request[0] ? props.current_request[0].last_name : ''}

      <ManagerForm 
        current_request={props.current_request}
        updateFormCompleted={props.updateFormCompleted}
        />

     </div>
    </div>
   </div>
  )
 }
}
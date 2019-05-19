import React from 'react';
import Board from 'react-trello'
import './ContentBody.css';
import Modal from 'react-modal';
Modal.setAppElement('#root');
const customStyles = {
    overlay: {
        background: 'transparent'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        display: 'table' /* This is important */,
        overflow: 'auto',
        width: 'auto',
        minWidth: '350px',
        borderBottom: '4px solid white',
        borderLeft: '4px solid white',
        borderRight: '4px solid white',
        borderTop: '4px solid white',
        borderRadius: '8px',
        background:'#f4f5f7',
        WebkitBoxShadow:
            '0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2)',
        boxShadow:
            '0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2)'
    }
};
export const TaskModal = props => (
    <Modal
        isOpen={props.showModal}
        style={customStyles}
        onRequestClose={() => props.closeModal()}
    >
        <TaskComment {...props} />
    </Modal>
);
class TaskComment extends React.Component
{
    getTaskComments = (props) => {
        var { data, activeBoardId, activeTask } = props;
        var { cardId, laneId } = activeTask;
        var comments = [];
        for(var i=0;i<data.lanes.length;i++){
            if (data.lanes[i]['id'] === laneId){
                for (var j = 0; j < data.lanes[i]['cards'].length;j++){
                    if (data.lanes[i]['cards'][j]['id'] === cardId) {
                        comments = data.lanes[i]['cards'][j]['comments'];
                        return comments;
                    }
                }
            }
        }
        return comments;
    }
    render(){
        var comments = this.getTaskComments(this.props);
        // console.log(comments);
        var commentsWrap = comments.map((comment) =>
            <div key={comment.id}>
            <hr className='comments-hr' />
            <div className='comment-user'>
                Anonymous User
            </div>
            <div className="comments-wrap" >
                {comment.text}
                </div>
            </div>
        );
        return(
            <div>
                <div className='comments-text'>
                    Comments
                </div>
                
                {commentsWrap}
                <AddComment {...this.props}/>
            </div>
        )
    }
}
class AddComment extends React.Component{
    state = {
        commentVal: ''
    }
    handleChange = (event) => {
        this.setState({ commentVal: event.target.value })
    }
    handleSubmit = () => {
        var { commentVal } = this.state;
        if(commentVal.trim() !== ''){
            var { data, activeBoardId, activeTask } = this.props;
            var cardId = activeTask.cardId;
            var laneId = activeTask.laneId;
            var boardId = activeBoardId;
            var text = commentVal;
            this.props.addComment({ cardId, laneId, boardId, text });
            this.setState({ commentVal: ''});
        }
    }
    render(){
        var { commentVal } = this.state;
        return (
            <div>
                <input type='text' className='add-comment' value={commentVal} onChange={this.handleChange}/>
                <button type='button' className='add-btn' onClick={this.handleSubmit}>
                    Add
                </button>
            </div>
        )
    }
}
class ContentBody extends React.Component
{   
    state = {
        showModal: false,
        activeTask: {}
    }
    closeModal = () => {
        this.setState({ showModal: false, activeTask:{}})
    }
    onDataChange = (data) => {
        // console.log('data change')
        // console.log(this.props.activeBoardId);
        // console.log(data)
        this.props.updateBoard(data, this.props.activeBoardId);
    }
    onCardDelete = (data) => {
        // console.log('card delete')
        // console.log(data)
    }
    onCardAdd = (data) => {
        // console.log('card add')
        // console.log(data)
    }
    onCardClick = (data, metadata, laneId) => {
        // console.log('card click')
        // console.log(data)
        // console.log(laneId)
        this.setState({ activeTask: { cardId: data, laneId: laneId}, showModal: true })
    }
    onLaneAdd = (data) => {
        // console.log('lane added')
        // console.log(data)
    }
    render(){
        var { data, activeBoardId} = this.props;
        var { showModal, activeTask} = this.state;
        return (
            <div>
                <TaskModal {...this.props} activeTask={activeTask} showModal={showModal} closeModal={this.closeModal}/>
                <div className='board-title'>{data.name+' '+'('+data.id+')'}</div>
                <Board data={data}
                    id="EditableBoard1"
                    draggable
                    onDataChange={this.onDataChange}
                    editable
                    onCardDelete={this.onCardDelete}
                    onCardAdd={this.onCardAdd}
                    onCardClick={this.onCardClick}
                    canAddLanes
                    onLaneAdd={this.onLaneAdd}
                />
            </div>
        )
    }  
}

export default ContentBody;

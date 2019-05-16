import React from 'react';
import Board from 'react-trello'
class ContentBody extends React.Component
{   
    onDataChange = (data) => {
        console.log('data change')
        console.log(data)
    }
    onCardDelete = (data) => {
        console.log('card delete')
        console.log(data)
    }
    onCardAdd = (data) => {
        console.log('card add')
        console.log(data)
    }
    onCardClick = (data) => {
        console.log('card click')
        console.log(data)
    }
    onLaneAdd = (data) => {
        console.log('lane added')
        console.log(data)
    }
    render(){
        var {data} = this.props;
        return (
            <div>
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
